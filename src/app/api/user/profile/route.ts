import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        profile: true,
        preferences: true,
        subscriptions: {
          include: {
            plan: true
          },
          where: {
            status: 'active'
          }
        },
        progress: {
          include: {
            video: {
              include: {
                department: true
              }
            }
          }
        },
        achievements: {
          include: {
            achievement: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate learning statistics
    const totalWatchTime = user.progress.reduce((sum, p) => sum + p.watchTime, 0)
    const completedVideos = user.progress.filter(p => p.completedAt).length
    const totalVideos = user.progress.length
    const completionRate = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0

    // Calculate department progress
    const departmentProgress: Record<string, any> = {}
    user.progress.forEach(p => {
      const dept = p.video.department.slug
      if (!departmentProgress[dept]) {
        departmentProgress[dept] = {
          name: p.video.department.name,
          completed: 0,
          total: 0,
          watchTime: 0
        }
      }
      departmentProgress[dept].total++
      departmentProgress[dept].watchTime += p.watchTime
      if (p.completedAt) {
        departmentProgress[dept].completed++
      }
    })

    // Get total achievement points
    const totalPoints = user.achievements.reduce((sum, a) => sum + a.achievement.points, 0)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        status: user.status,
        profile: user.profile,
        preferences: user.preferences,
        subscription: user.subscriptions[0] || null
      },
      stats: {
        totalWatchTime,
        completedVideos,
        totalVideos,
        completionRate: Math.round(completionRate * 100) / 100,
        totalPoints,
        departmentProgress
      },
      achievements: user.achievements.map(a => ({
        ...a.achievement,
        earnedAt: a.earnedAt
      }))
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const {
      firstName,
      lastName,
      departmentPreferences,
      learningGoals,
      preferences
    } = body

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update profile
    if (firstName !== undefined || lastName !== undefined || departmentPreferences || learningGoals) {
      await prisma.userProfile.upsert({
        where: { userId: user.id },
        update: {
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
          ...(departmentPreferences && { departmentPreferences }),
          ...(learningGoals && { learningGoals })
        },
        create: {
          userId: user.id,
          firstName: firstName || '',
          lastName: lastName || '',
          departmentPreferences: departmentPreferences || [],
          learningGoals: learningGoals || {}
        }
      })
    }

    // Update preferences
    if (preferences) {
      await prisma.userPreferences.upsert({
        where: { userId: user.id },
        update: preferences,
        create: {
          userId: user.id,
          ...preferences
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}