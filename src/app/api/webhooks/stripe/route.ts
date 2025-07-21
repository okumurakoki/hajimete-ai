import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { emailService } from '@/lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('💳 Stripe webhook received:', event.type)

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent)
        break
      default:
        console.log(`🤷‍♂️ Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('❌ Stripe webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('✅ Payment succeeded:', paymentIntent.id)
    
    // 領収書URLを取得するためにchargesを取得
    let receiptUrl: string | null = null
    if (paymentIntent.latest_charge) {
      const charge = await stripe.charges.retrieve(paymentIntent.latest_charge as string)
      receiptUrl = charge.receipt_url || null
    }
    
    // Paymentレコードを更新
    const payment = await prisma.payment.update({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { 
        status: 'SUCCEEDED',
        receiptUrl
      }
    })

    // 講座IDを取得
    const courseIds = JSON.parse(paymentIntent.metadata.courseIds)
    const userId = paymentIntent.metadata.userId

    // 各講座の登録レコードを作成
    for (const courseId of courseIds) {
      // 既存の登録をチェック
      const existingRegistration = await prisma.registration.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        }
      })

      if (!existingRegistration) {
        await prisma.registration.create({
          data: {
            userId,
            courseId,
            paymentId: payment.id,
            amount: Math.floor(payment.finalAmount / courseIds.length), // 均等割り
            appliedDiscount: Math.floor(payment.discountAmount / courseIds.length),
            status: 'CONFIRMED'
          }
        })

        // 講座の参加者数を更新
        await prisma.liveCourse.update({
          where: { id: courseId },
          data: {
            currentParticipants: {
              increment: 1
            }
          }
        })
      }
    }

    console.log(`✅ Created ${courseIds.length} registrations for user ${userId}`)

    // 確認メール送信処理
    await sendConfirmationEmail(userId, courseIds, payment)

  } catch (error) {
    console.error('❌ Error handling payment success:', error)
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('❌ Payment failed:', paymentIntent.id)
    
    await prisma.payment.update({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { status: 'FAILED' }
    })

    // TODO: 失敗メール送信
    
  } catch (error) {
    console.error('❌ Error handling payment failure:', error)
  }
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('🚫 Payment canceled:', paymentIntent.id)
    
    await prisma.payment.update({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { status: 'CANCELLED' }
    })

  } catch (error) {
    console.error('❌ Error handling payment cancellation:', error)
  }
}

/**
 * 確認メール送信処理
 */
async function sendConfirmationEmail(userId: string, courseIds: string[], payment: any) {
  try {
    console.log('📧 Sending confirmation email...')

    // ユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      console.error('❌ User not found for email sending:', userId)
      return
    }

    // 講座情報を取得
    const courses = await prisma.liveCourse.findMany({
      where: { id: { in: courseIds } }
    })

    // メール送信用のデータを準備
    const emailData = {
      userEmail: user.email,
      userName: user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || '受講者',
      courses: courses.map(course => ({
        id: course.id,
        title: course.title,
        instructor: course.instructor,
        startDate: course.startDate.toISOString(),
        endDate: course.endDate.toISOString(),
        zoomUrl: course.zoomUrl || undefined,
        zoomId: course.zoomId || undefined,
        zoomPassword: course.zoomPassword || undefined
      })),
      paymentAmount: payment.finalAmount,
      receiptUrl: payment.receiptUrl || undefined
    }

    // 確認メール送信
    const emailSent = await emailService.sendRegistrationConfirmation(emailData)
    
    if (emailSent) {
      console.log('✅ Confirmation email sent successfully to:', user.email)
    } else {
      console.error('❌ Failed to send confirmation email to:', user.email)
    }

  } catch (error) {
    console.error('❌ Error in sendConfirmationEmail:', error)
  }
}

// 新しいイベントハンドラーを追加
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('✅ Checkout session completed:', session.id)
    
    if (session.metadata?.type === 'seminar') {
      // セミナー参加登録
      await handleSeminarRegistration(session)
    } else {
      // サブスクリプション処理
      await handleSubscriptionCheckout(session)
    }
  } catch (error) {
    console.error('❌ Error handling checkout session:', error)
  }
}

async function handleSeminarRegistration(session: Stripe.Checkout.Session) {
  const { userId, seminarId } = session.metadata || {}
  
  if (!userId || !seminarId) {
    console.error('❌ Missing metadata for seminar registration')
    return
  }

  try {
    // セミナー参加記録を作成
    const registration = await prisma.seminarRegistration.create({
      data: {
        userId,
        seminarId,
        status: 'confirmed',
        paymentId: session.payment_intent as string,
        stripeSessionId: session.id,
        amount: session.amount_total || 0
      }
    })

    console.log(`📅 Seminar registration created:`, registration.id)
  } catch (error) {
    console.error('❌ Error creating seminar registration:', error)
  }
}

async function handleSubscriptionCheckout(session: Stripe.Checkout.Session) {
  const { userId, planType } = session.metadata || {}
  
  if (!userId || !planType) {
    console.error('❌ Missing metadata for subscription checkout')
    return
  }

  console.log(`📋 Processing subscription checkout for user ${userId}, plan ${planType}`)
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const { userId, planType } = subscription.metadata || {}
  
  if (!userId || !planType) {
    console.error('❌ Missing metadata for subscription creation')
    return
  }

  try {
    // ユーザーのプランを更新
    await prisma.user.upsert({
      where: { clerkId: userId },
      create: {
        clerkId: userId,
        plan: planType,
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status
      },
      update: {
        plan: planType,
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status
      }
    })

    console.log(`✅ User plan updated: ${userId} -> ${planType}`)
  } catch (error) {
    console.error('❌ Error updating user plan:', error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    await prisma.user.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        subscriptionStatus: subscription.status
      }
    })

    console.log(`📝 Subscription status updated: ${subscription.id} -> ${subscription.status}`)
  } catch (error) {
    console.error('❌ Error updating subscription status:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    await prisma.user.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        plan: 'free',
        subscriptionStatus: 'canceled',
        stripeSubscriptionId: null
      }
    })

    console.log(`❌ Subscription canceled: ${subscription.id}`)
  } catch (error) {
    console.error('❌ Error handling subscription deletion:', error)
  }
}