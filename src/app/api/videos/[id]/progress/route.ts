import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: videoId } = await params
    const body = await req.json()
    const { progressPercentage, watchTime, lastPosition, eventType } = body

    // Mock progress update - in production, store in your database
    const progress = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      videoId,
      progressPercentage,
      watchTime,
      lastPosition,
      completedAt: progressPercentage >= 90 ? new Date() : null,
      completionRate: progressPercentage,
      updatedAt: new Date()
    }

    // If video completed, mock achievement check
    if (progressPercentage >= 90) {
      console.log('Video completed! Would check achievements for user:', userId)
    }

    return NextResponse.json({ 
      success: true,
      progress 
    })
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: videoId } = await params

    // Mock progress data - in production, fetch from your database
    const progress = {
      progressPercentage: 0,
      watchTime: 0,
      lastPosition: 0,
      completedAt: null
    }

    return NextResponse.json({
      progress
    })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Mock helper function for achievement checking
// In production, this would check user progress and award achievements
function mockCheckAchievements(userId: string) {
  console.log(`Mock: Checking achievements for user ${userId}`)
  // In production implementation:
  // 1. Count completed videos
  // 2. Check achievement criteria
  // 3. Award new achievements
  // 4. Send notifications
}