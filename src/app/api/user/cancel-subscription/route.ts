import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // ユーザーのサブスクリプション情報を取得
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        subscriptionId: true,
        plan: true
      }
    })

    if (!user || !user.subscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    // Stripeでサブスクリプションをキャンセル
    const subscription = await stripe.subscriptions.cancel(user.subscriptionId)

    // データベースを更新
    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        plan: 'FREE',
        subscriptionStatus: 'CANCELED',
        subscriptionId: null,
        planExpiresAt: null
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription canceled successfully'
    })
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}