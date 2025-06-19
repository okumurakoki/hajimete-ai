import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { paymentIntentId, amount, reason } = body

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      )
    }

    // Since we're in test mode, we'll simulate a successful refund
    // In production, you would use the real Stripe SDK:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    // const refund = await stripe.refunds.create({
    //   payment_intent: paymentIntentId,
    //   amount: amount, // optional - for partial refunds
    //   reason: reason || 'requested_by_customer'
    // })

    // For demo purposes, simulate Stripe refund response
    const simulatedRefund = {
      id: `re_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      object: 'refund',
      amount: amount || 550000, // Amount in cents (¥5,500)
      charge: `ch_${Date.now()}_mock`,
      created: Math.floor(Date.now() / 1000),
      currency: 'jpy',
      payment_intent: paymentIntentId,
      reason: reason || 'requested_by_customer',
      status: 'succeeded',
      receipt_number: null
    }

    console.log('Refund processed (demo mode):', {
      paymentIntentId,
      amount,
      reason,
      userId,
      refundId: simulatedRefund.id
    })

    return NextResponse.json({
      success: true,
      refund: simulatedRefund,
      message: 'Refund processed successfully'
    })

  } catch (error) {
    console.error('Refund processing error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process refund',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const paymentIntentId = searchParams.get('payment_intent_id')

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      )
    }

    // Simulate getting refund status
    // In production: const refunds = await stripe.refunds.list({ payment_intent: paymentIntentId })
    
    const simulatedRefunds = [
      {
        id: `re_${Date.now()}_mock`,
        object: 'refund',
        amount: 550000, // ¥5,500 in cents
        charge: `ch_${Date.now()}_mock`,
        created: Math.floor(Date.now() / 1000),
        currency: 'jpy',
        payment_intent: paymentIntentId,
        reason: 'requested_by_customer',
        status: 'succeeded',
        receipt_number: null
      }
    ]

    return NextResponse.json({
      success: true,
      refunds: simulatedRefunds
    })

  } catch (error) {
    console.error('Error fetching refunds:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch refunds',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}