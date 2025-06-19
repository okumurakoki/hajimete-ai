import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const params = await context.params
    const seminarId = params.id

    // Mock user data - replace with actual database call when Prisma is properly configured
    const user = {
      id: 'mock-user-id',
      clerkId: userId,
      plan: 'premium'
    }

    // Mock seminar data - replace with actual database call when Prisma is properly configured
    const seminar = {
      id: seminarId,
      title: 'AI基礎セミナー',
      date: new Date('2024-01-15'),
      startTime: '19:00',
      endTime: '21:00'
    }

    // Mock registration check - replace with actual database call when Prisma is properly configured
    const existingRegistration = {
      id: 'mock-registration-id',
      userId: user.id,
      seminarId,
      registeredAt: new Date(),
      paymentStatus: 'completed'
    }

    if (!existingRegistration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }

    // Check cancellation policy - allow cancellation up to 2 hours before seminar
    const seminarDateTime = new Date(seminar.date)
    const [hours, minutes] = seminar.startTime.split(':').map(Number)
    seminarDateTime.setHours(hours, minutes, 0, 0)
    
    const now = new Date()
    const timeDifference = seminarDateTime.getTime() - now.getTime()
    const hoursUntilSeminar = timeDifference / (1000 * 60 * 60)

    if (hoursUntilSeminar < 2) {
      return NextResponse.json(
        { 
          error: 'Cancellation not allowed. Must cancel at least 2 hours before seminar start time.',
          canCancel: false,
          hoursRemaining: Math.max(0, hoursUntilSeminar)
        },
        { status: 400 }
      )
    }

    // Determine refund eligibility
    let refundAmount = 0
    let refundEligible = false
    
    if (existingRegistration.paymentStatus === 'completed') {
      // Calculate refund based on cancellation timing
      if (hoursUntilSeminar >= 24) {
        // Full refund if cancelled 24+ hours before
        refundAmount = 5500 // This would come from the payment record
        refundEligible = true
      } else if (hoursUntilSeminar >= 2) {
        // Partial refund if cancelled 2-24 hours before
        refundAmount = Math.floor(5500 * 0.5) // 50% refund
        refundEligible = true
      }
    }

    // Mock cancellation - replace with actual database calls when Prisma is properly configured
    const cancellation = {
      id: 'mock-cancellation-id',
      registrationId: existingRegistration.id,
      userId: user.id,
      seminarId,
      cancelledAt: new Date(),
      refundAmount,
      refundStatus: refundEligible ? 'pending' : 'none',
      reason: 'user_requested'
    }

    // In a real implementation, this would:
    // 1. Delete the registration from the database
    // 2. Create a cancellation record
    // 3. Update seminar capacity
    // 4. Process refund if eligible
    // 5. Send confirmation email
    // 6. Update any related notifications

    return NextResponse.json({ 
      success: true,
      cancellation,
      seminar: {
        id: seminarId,
        title: seminar.title
      },
      refund: refundEligible ? {
        amount: refundAmount,
        status: 'pending',
        processingTime: '3-5 business days'
      } : null,
      message: refundEligible 
        ? `セミナーの参加をキャンセルしました。${refundAmount}円の返金処理を開始します。`
        : 'セミナーの参加をキャンセルしました。'
    })

  } catch (error) {
    console.error('Error cancelling seminar registration:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET method to check cancellation eligibility
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const params = await context.params
    const seminarId = params.id

    // Mock seminar data
    const seminar = {
      id: seminarId,
      title: 'AI基礎セミナー',
      date: new Date('2024-01-15'),
      startTime: '19:00',
      endTime: '21:00'
    }

    // Calculate time until seminar
    const seminarDateTime = new Date(seminar.date)
    const [hours, minutes] = seminar.startTime.split(':').map(Number)
    seminarDateTime.setHours(hours, minutes, 0, 0)
    
    const now = new Date()
    const timeDifference = seminarDateTime.getTime() - now.getTime()
    const hoursUntilSeminar = timeDifference / (1000 * 60 * 60)

    const canCancel = hoursUntilSeminar >= 2
    let refundPercentage = 0

    if (hoursUntilSeminar >= 24) {
      refundPercentage = 100
    } else if (hoursUntilSeminar >= 2) {
      refundPercentage = 50
    }

    return NextResponse.json({
      canCancel,
      hoursUntilSeminar: Math.max(0, hoursUntilSeminar),
      refundPercentage,
      seminar: {
        id: seminarId,
        title: seminar.title,
        date: seminar.date,
        startTime: seminar.startTime
      }
    })

  } catch (error) {
    console.error('Error checking cancellation eligibility:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}