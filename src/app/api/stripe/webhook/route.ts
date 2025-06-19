import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

if (!webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not configured')
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret!)
  } catch (err) {
    // Log error for debugging but don't expose details
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id)
  
  const { userId, seminarId, type } = session.metadata || {}

  if (type === 'seminar_registration' && userId && seminarId) {
    // TODO: Create seminar registration record in database
    // TODO: Send confirmation email
    // TODO: Create Zoom meeting link
    
    console.log(`Seminar registration completed for user ${userId}, seminar ${seminarId}`)
    
    // For now, we'll just log this. In production, you would:
    // 1. Save registration to database
    // 2. Send confirmation email with meeting details
    // 3. Create calendar event
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id)
  
  // TODO: Update payment status in database
  // TODO: Send receipt email
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id)
  
  // TODO: Update payment status in database
  // TODO: Send payment failed notification
}