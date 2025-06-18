import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { StripeService } from '@/lib/stripe-service'

const stripeService = new StripeService()

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
    const { returnUrl } = body

    // Mock user data - replace with actual database call when Prisma is properly configured
    const user = {
      id: 'mock-user-id',
      clerkId: userId,
      subscriptions: [{
        stripeCustomerId: 'cus_mock_customer_id'
      }]
    }

    const customerId = user.subscriptions[0]?.stripeCustomerId
    if (!customerId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    // Create portal session
    const portalUrl = await stripeService.createPortalSession(
      customerId,
      returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    )

    return NextResponse.json({ url: portalUrl })
  } catch (error) {
    console.error('Error creating portal session:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}