import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// User utilities
export async function createUser(clerkId: string, email: string) {
  return await prisma.user.create({
    data: {
      clerkId,
      email,
      plan: 'basic',
      status: 'active'
    }
  })
}

export async function getUserByClerkId(clerkId: string) {
  return await prisma.user.findUnique({
    where: { clerkId },
    include: {
      profile: true,
      preferences: true,
      subscriptions: {
        include: {
          plan: true
        }
      }
    }
  })
}

// Video utilities
export async function getPublishedVideos(departmentSlug?: string) {
  return await prisma.video.findMany({
    where: {
      status: 'published',
      ...(departmentSlug && {
        department: {
          slug: departmentSlug
        }
      })
    },
    include: {
      department: true,
      progress: true,
      chapters: true
    },
    orderBy: {
      publishedAt: 'desc'
    }
  })
}

export async function getUserProgress(userId: string) {
  const progressData = await prisma.learningProgress.findMany({
    where: { userId },
    include: {
      video: {
        include: {
          department: true
        }
      }
    }
  })

  const totalVideos = progressData.length
  const completedVideos = progressData.filter(p => p.completedAt).length
  const totalWatchTime = progressData.reduce((sum, p) => sum + p.watchTime, 0)
  
  return {
    totalVideos,
    completedVideos,
    totalWatchTime,
    completionRate: totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0,
    recentProgress: progressData.slice(0, 5)
  }
}

// Department utilities
export async function getDepartments() {
  return await prisma.department.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      videos: {
        where: { status: 'published' },
        take: 3,
        orderBy: { viewCount: 'desc' }
      }
    }
  })
}

// Seminar utilities
export async function getUpcomingSeminars(isPremium = false) {
  return await prisma.seminar.findMany({
    where: {
      status: 'upcoming',
      ...(isPremium ? {} : { isPremium: false })
    },
    include: {
      instructor: true,
      registrations: true
    },
    orderBy: {
      date: 'asc'
    }
  })
}

export async function registerForSeminar(userId: string, seminarId: string) {
  return await prisma.seminarRegistration.create({
    data: {
      userId,
      seminarId
    }
  })
}

// Live stream utilities
export async function getLiveStreams(status: string = 'live') {
  return await prisma.liveStream.findMany({
    where: { status },
    include: {
      instructor: true,
      viewers: true
    },
    orderBy: {
      scheduledAt: 'asc'
    }
  })
}

// Analytics utilities
export async function trackVideoView(userId: string, videoId: string, eventType: string, timestampInVideo?: number) {
  return await prisma.videoAnalytics.create({
    data: {
      userId,
      videoId,
      eventType,
      timestampInVideo,
      sessionId: `session_${Date.now()}`
    }
  })
}

export async function updateVideoProgress(userId: string, videoId: string, progressData: {
  progressPercentage: number
  watchTime: number
  lastPosition: number
}) {
  return await prisma.learningProgress.upsert({
    where: {
      userId_videoId: {
        userId,
        videoId
      }
    },
    update: {
      progressPercentage: progressData.progressPercentage,
      watchTime: progressData.watchTime,
      lastPosition: progressData.lastPosition,
      completedAt: progressData.progressPercentage >= 90 ? new Date() : undefined
    },
    create: {
      userId,
      videoId,
      progressPercentage: progressData.progressPercentage,
      watchTime: progressData.watchTime,
      lastPosition: progressData.lastPosition,
      completedAt: progressData.progressPercentage >= 90 ? new Date() : undefined
    }
  })
}

// Admin utilities
export async function getAdminStats() {
  const [
    totalUsers,
    activeUsers,
    totalVideos,
    publishedVideos,
    totalSeminars,
    upcomingSeminars,
    liveStreams
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'active' } }),
    prisma.video.count(),
    prisma.video.count({ where: { status: 'published' } }),
    prisma.seminar.count(),
    prisma.seminar.count({ where: { status: 'upcoming' } }),
    prisma.liveStream.count({ where: { status: 'live' } })
  ])

  return {
    totalUsers,
    activeUsers,
    totalVideos,
    publishedVideos,
    totalSeminars,
    upcomingSeminars,
    liveStreams
  }
}