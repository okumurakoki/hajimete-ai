import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { stripe } from '@/lib/stripe'
import { getStripePriceId } from '@/lib/stripe-pricing'
import { CheckoutSessionSchema, validateInput } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    // デモ環境用: 固定ユーザーIDを使用
    const userId = 'demo-user-123'

    const body = await request.json()
    const validation = validateInput(CheckoutSessionSchema, body)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: validation.error,
          details: validation.details 
        },
        { status: 400 }
      )
    }

    const { seminarId, seminarTitle, seminarDescription, amount, userPlan, currency } = validation.data

    // Handle free seminars
    if (amount === 0) {
      return NextResponse.json(
        { error: 'Free seminars do not require payment' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const priceId = getStripePriceId(userPlan, amount)

    let lineItems
    
    if (priceId) {
      // Use predefined price ID for consistent pricing
      lineItems = [
        {
          price: priceId,
          quantity: 1,
        },
      ]
    } else {
      // Fallback to dynamic pricing (shouldn't happen in normal flow)
      lineItems = [
        {
          price_data: {
            currency: currency || 'jpy',
            product_data: {
              name: seminarTitle,
              description: seminarDescription,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ]
    }

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/seminars/${seminarId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/seminars/${seminarId}`,
      metadata: {
        userId,
        seminarId,
        userPlan,
        amount: amount.toString(),
        type: 'seminar_registration',
      },
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      allow_promotion_codes: true,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    // Log error for debugging but don't expose internal details
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    )
  }
}