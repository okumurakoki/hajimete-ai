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

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user || user.plan !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get comprehensive stats
    const [
      totalUsers,
      activeUsers,
      basicUsers,
      premiumUsers,
      totalVideos,
      publishedVideos,
      draftVideos,
      totalSeminars,
      upcomingSeminars,
      completedSeminars,
      totalProgress,
      completedProgress,
      liveStreams,
      totalViewTime
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'active' } }),
      prisma.user.count({ where: { plan: 'basic', status: 'active' } }),
      prisma.user.count({ where: { plan: 'premium', status: 'active' } }),
      prisma.video.count(),
      prisma.video.count({ where: { status: 'published' } }),
      prisma.video.count({ where: { status: 'draft' } }),
      prisma.seminar.count(),
      prisma.seminar.count({ where: { status: 'upcoming' } }),
      prisma.seminar.count({ where: { status: 'completed' } }),
      prisma.learningProgress.count(),
      prisma.learningProgress.count({ where: { completedAt: { not: null } } }),
      prisma.liveStream.count({ where: { status: 'live' } }),
      prisma.learningProgress.aggregate({
        _sum: { watchTime: true }
      })
    ])

    // Get recent activity
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        profile: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    })

    const recentVideos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        department: {
          select: {
            name: true,
            colorPrimary: true
          }
        }
      }
    })

    // Get department statistics
    const departmentStats = await prisma.department.findMany({
      include: {
        _count: {
          select: {
            videos: {
              where: { status: 'published' }
            }
          }
        }
      }
    })

    // Get video analytics for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const videoAnalytics = await prisma.videoAnalytics.groupBy({
      by: ['eventType'],
      where: {
        createdAt: { gte: thirtyDaysAgo }
      },
      _count: {
        id: true
      }
    })

    // Get top videos by view count
    const topVideos = await prisma.video.findMany({
      where: { status: 'published' },
      orderBy: { viewCount: 'desc' },
      take: 10,
      include: {
        department: {
          select: {
            name: true,
            colorPrimary: true
          }
        },
        _count: {
          select: {
            progress: true,
            ratings: true
          }
        }
      }
    })

    // Calculate engagement metrics
    const engagementRate = totalProgress > 0 ? (completedProgress / totalProgress) * 100 : 0
    const avgWatchTime = totalViewTime._sum.watchTime || 0

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers,
        basicUsers,
        premiumUsers,
        totalVideos,
        publishedVideos,
        draftVideos,
        totalSeminars,
        upcomingSeminars,
        completedSeminars,
        liveStreams,
        engagementRate: Math.round(engagementRate * 100) / 100,
        totalWatchTime: avgWatchTime
      },
      recentActivity: {
        users: recentUsers,
        videos: recentVideos
      },
      departmentStats,
      analytics: videoAnalytics,
      topVideos
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}