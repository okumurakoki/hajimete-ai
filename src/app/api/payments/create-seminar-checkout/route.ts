import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { stripe } from '@/lib/stripe'
import { STRIPE_PRICE_IDS, getStripePriceId } from '@/lib/stripe-pricing'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { seminarId, userEmail, userPlan, amount } = body

    if (!seminarId || !userEmail || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Price IDを取得
    const priceId = getStripePriceId(userPlan || 'basic', amount)
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid pricing configuration' },
        { status: 400 }
      )
    }

    // Stripeカスタマーを作成
    const customer = await stripe.customers.create({
      email: userEmail,
      metadata: {
        clerkId: userId
      }
    })

    // Checkout セッションを作成
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/seminars/${seminarId}/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/seminars/${seminarId}`,
      metadata: {
        userId,
        seminarId,
        type: 'seminar'
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      locale: 'ja',
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: `はじめて.AI セミナー参加費 - セミナーID: ${seminarId}`,
          metadata: {
            seminarId,
            userId
          }
        }
      }
    })

    return NextResponse.json({
      checkoutUrl: session.url,
      sessionId: session.id
    })

  } catch (error) {
    console.error('Stripe seminar checkout creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}