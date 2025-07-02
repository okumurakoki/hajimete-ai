import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { registrationId, reason } = await request.json()

    if (!registrationId || !reason) {
      return NextResponse.json({ 
        error: 'Registration ID and reason are required' 
      }, { status: 400 })
    }

    // 登録情報を取得（ユーザー認証確認）
    const registration = await prisma.registration.findFirst({
      where: {
        id: registrationId,
        userId: userId
      },
      include: {
        course: true,
        payment: true
      }
    })

    if (!registration) {
      return NextResponse.json({ 
        error: 'Registration not found or access denied' 
      }, { status: 404 })
    }

    // キャンセル可能か確認（24時間前まで）
    const courseStart = new Date(registration.course.startDate)
    const now = new Date()
    const hoursUntilStart = (courseStart.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursUntilStart <= 24) {
      return NextResponse.json({ 
        error: 'Cannot cancel within 24 hours of course start' 
      }, { status: 400 })
    }

    if (registration.status !== 'CONFIRMED') {
      return NextResponse.json({ 
        error: 'Only confirmed registrations can be cancelled' 
      }, { status: 400 })
    }

    // 既に返金処理中または完了済みかチェック
    if (registration.payment && registration.payment.status === 'REFUNDED') {
      return NextResponse.json({ 
        error: 'This payment has already been refunded' 
      }, { status: 400 })
    }

    try {
      // Stripe返金処理
      let refund = null
      if (registration.payment?.stripePaymentIntentId) {
        refund = await stripe.refunds.create({
          payment_intent: registration.payment.stripePaymentIntentId,
          reason: 'requested_by_customer',
          metadata: {
            registrationId: registrationId,
            userId: userId,
            reason: reason
          }
        })
      }

      // データベース更新
      await prisma.$transaction([
        // 登録ステータスを更新
        prisma.registration.update({
          where: { id: registrationId },
          data: { 
            status: 'CANCELLED',
            updatedAt: new Date()
          }
        }),
        
        // 決済ステータスを更新
        ...(registration.payment ? [
          prisma.payment.update({
            where: { id: registration.payment.id },
            data: { 
              status: 'REFUNDED',
              metadata: JSON.stringify({
                ...JSON.parse(registration.payment.metadata || '{}'),
                refundId: refund?.id,
                refundReason: reason,
                refundedAt: new Date().toISOString()
              }),
              updatedAt: new Date()
            }
          })
        ] : []),

        // 講座の参加者数を減らす
        prisma.liveCourse.update({
          where: { id: registration.course.id },
          data: {
            currentParticipants: {
              decrement: 1
            }
          }
        })
      ])

      // TODO: 返金確認メールを送信
      // await sendRefundConfirmationEmail(registration, refund)

      return NextResponse.json({ 
        message: 'Refund request processed successfully',
        refundId: refund?.id,
        status: 'success'
      })

    } catch (stripeError: any) {
      console.error('Stripe refund error:', stripeError)
      
      // Stripe側でエラーが発生した場合でも、DBの状態を更新
      await prisma.registration.update({
        where: { id: registrationId },
        data: { 
          status: 'CANCELLED',
          updatedAt: new Date()
        }
      })

      return NextResponse.json({ 
        error: 'Refund request received but payment processing failed. Please contact support.',
        partialSuccess: true
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Refund request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}