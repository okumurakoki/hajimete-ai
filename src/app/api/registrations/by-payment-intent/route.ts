import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const paymentIntentId = searchParams.get('payment_intent')

    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Payment intent ID required' }, { status: 400 })
    }

    // PaymentIntent IDからPaymentを取得
    const payment = await prisma.payment.findUnique({
      where: {
        stripePaymentIntentId: paymentIntentId,
        userId
      }
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // 関連する登録を取得
    const registrations = await prisma.registration.findMany({
      where: {
        paymentId: payment.id,
        userId
      },
      include: {
        course: true,
        payment: true
      },
      orderBy: {
        course: {
          startDate: 'asc'
        }
      }
    })

    return NextResponse.json(registrations)
  } catch (error) {
    console.error('Error fetching registrations by payment intent:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}