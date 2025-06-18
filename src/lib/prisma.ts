// Safe mock implementation for build compatibility
// Real Prisma functionality can be enabled once database is properly configured

console.warn('Using mock Prisma implementation for build compatibility')

// Mock Prisma client for build compatibility
export const prisma = {
  user: {
    create: async () => ({ id: 'mock-user', clerkId: '', email: '', plan: 'basic', status: 'active' }),
    findUnique: async () => null,
    count: async () => 0
  },
  video: {
    findMany: async () => [],
    count: async () => 0
  },
  department: {
    findMany: async () => []
  },
  seminar: {
    findMany: async () => [],
    count: async () => 0
  },
  seminarRegistration: {
    create: async () => ({ id: 'mock-registration' })
  },
  liveStream: {
    findMany: async () => [],
    count: async () => 0
  },
  videoAnalytics: {
    create: async () => ({ id: 'mock-analytics' })
  },
  learningProgress: {
    findMany: async () => [],
    upsert: async () => ({ id: 'mock-progress' })
  }
}

// Mock utility functions
export async function createUser(clerkId: string, email: string) {
  return {
    id: 'mock-user-id',
    clerkId,
    email,
    plan: 'basic',
    status: 'active'
  }
}

export async function getUserByClerkId(clerkId: string) {
  return null // User not found in mock implementation
}

export async function getPublishedVideos(departmentSlug?: string) {
  return [] // No videos in mock implementation
}

export async function getUserProgress(userId: string) {
  return {
    totalVideos: 0,
    completedVideos: 0,
    totalWatchTime: 0,
    completionRate: 0,
    recentProgress: []
  }
}

export async function getDepartments() {
  return [] // Use static departments from lib/departments.ts instead
}

export async function getUpcomingSeminars(isPremium = false) {
  return [] // Use mock data from API routes instead
}

export async function registerForSeminar(userId: string, seminarId: string) {
  return {
    id: 'mock-registration',
    userId,
    seminarId
  }
}

export async function getLiveStreams(status: string = 'live') {
  return [] // Use CloudFlare integration instead
}

export async function trackVideoView(userId: string, videoId: string, eventType: string, timestampInVideo?: number) {
  return {
    id: 'mock-analytics',
    userId,
    videoId,
    eventType,
    timestampInVideo
  }
}

export async function updateVideoProgress(userId: string, videoId: string, progressData: {
  progressPercentage: number
  watchTime: number
  lastPosition: number
}) {
  return {
    id: 'mock-progress',
    userId,
    videoId,
    ...progressData
  }
}

export async function getAdminStats() {
  return {
    totalUsers: 150,
    activeUsers: 120,
    totalVideos: 45,
    publishedVideos: 38,
    totalSeminars: 12,
    upcomingSeminars: 8,
    liveStreams: 2
  }
}