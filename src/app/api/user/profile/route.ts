import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Mock user data - replace with actual database call when Prisma is properly configured
    const user = {
      id: 'mock-user-id',
      email: 'user@example.com',
      clerkId: userId,
      plan: 'premium',
      status: 'active',
      profile: {
        firstName: '太郎',
        lastName: '田中',
        departmentPreferences: ['ai', 'programming'],
        learningGoals: {
          target: 'become-expert',
          timeline: '6-months'
        }
      },
      preferences: {
        notifications: true,
        emailUpdates: true,
        language: 'ja'
      },
      subscriptions: [{
        id: 'sub-1',
        status: 'active',
        plan: {
          name: 'Premium',
          price: 2980
        }
      }],
      progress: [
        {
          watchTime: 1800,
          completedAt: new Date(),
          video: {
            id: 'video-1',
            department: {
              name: 'AI基礎',
              slug: 'ai-basics'
            }
          }
        }
      ],
      achievements: [
        {
          earnedAt: new Date(),
          achievement: {
            id: 'achievement-1',
            name: '初心者',
            points: 100
          }
        }
      ]
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
    const { userId } = await auth()
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

    // Mock user data - replace with actual database call when Prisma is properly configured
    const user = {
      id: 'mock-user-id',
      clerkId: userId
    }

    // Mock profile and preferences update - replace with actual database calls when Prisma is properly configured
    // These would normally update the user profile and preferences in the database
    
    // Profile update mock
    if (firstName !== undefined || lastName !== undefined || departmentPreferences || learningGoals) {
      // Mock profile upsert operation
    }

    // Preferences update mock
    if (preferences) {
      // Mock preferences upsert operation
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