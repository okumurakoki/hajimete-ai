import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: videoId } = await params
    const body = await req.json()
    const { progressPercentage, watchTime, lastPosition, eventType } = body

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Track video analytics
    await prisma.videoAnalytics.create({
      data: {
        videoId,
        userId: user.id,
        eventType: eventType || 'progress_update',
        timestampInVideo: lastPosition,
        watchedDuration: watchTime,
        sessionId: `session_${Date.now()}`
      }
    })

    // Update learning progress
    const progress = await prisma.learningProgress.upsert({
      where: {
        userId_videoId: {
          userId: user.id,
          videoId
        }
      },
      update: {
        progressPercentage,
        watchTime,
        lastPosition,
        completedAt: progressPercentage >= 90 ? new Date() : undefined,
        completionRate: progressPercentage
      },
      create: {
        userId: user.id,
        videoId,
        progressPercentage,
        watchTime,
        lastPosition,
        completedAt: progressPercentage >= 90 ? new Date() : undefined,
        completionRate: progressPercentage
      }
    })

    // If video completed, check for achievements
    if (progressPercentage >= 90 && !progress.completedAt) {
      await checkAndAwardAchievements(user.id)
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
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: videoId } = await params

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const progress = await prisma.learningProgress.findUnique({
      where: {
        userId_videoId: {
          userId: user.id,
          videoId
        }
      }
    })

    return NextResponse.json({
      progress: progress || {
        progressPercentage: 0,
        watchTime: 0,
        lastPosition: 0,
        completedAt: null
      }
    })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to check and award achievements
async function checkAndAwardAchievements(userId: string) {
  try {
    // Get user's completed video count
    const completedCount = await prisma.learningProgress.count({
      where: {
        userId,
        completedAt: { not: null }
      }
    })

    // Get available achievements
    const achievements = await prisma.achievement.findMany()

    for (const achievement of achievements) {
      // Check if user already has this achievement
      const existingAchievement = await prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id
          }
        }
      })

      if (existingAchievement) continue

      // Check criteria
      const criteria = achievement.criteria as any
      let shouldAward = false

      if (criteria?.type === 'video_completion') {
        shouldAward = completedCount >= criteria.count
      }

      if (shouldAward) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id
          }
        })

        // Create notification
        await prisma.notification.create({
          data: {
            userId,
            title: '🏆 新しい実績を獲得しました！',
            message: `「${achievement.name}」を達成しました。${achievement.points}ポイントを獲得！`,
            type: 'success',
            actionUrl: '/dashboard'
          }
        })
      }
    }
  } catch (error) {
    console.error('Error checking achievements:', error)
  }
}