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
    const { planSlug, paymentMethodId } = body

    if (!planSlug) {
      return NextResponse.json(
        { error: 'Plan slug is required' },
        { status: 400 }
      )
    }

    // Mock subscription creation
    const mockSubscription = {
      id: 'sub_' + Math.random().toString(36).substr(2, 9),
      status: 'active',
      plan: planSlug,
      userId,
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      subscriptionId: mockSubscription.id,
      clientSecret: 'pi_mock_client_secret',
      status: mockSubscription.status
    })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
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

    // Mock subscription usage data
    const mockUsage = {
      plan: 'basic',
      status: 'active',
      videosWatched: 12,
      videosLimit: 100,
      seminarsAttended: 2,
      seminarsLimit: 10,
      storageUsed: '1.2GB',
      storageLimit: '10GB'
    }

    return NextResponse.json(mockUsage)
  } catch (error) {
    console.error('Error getting subscription:', error)
    return NextResponse.json(
      { error: 'Failed to get subscription' },
      { status: 500 }
    )
  }
}