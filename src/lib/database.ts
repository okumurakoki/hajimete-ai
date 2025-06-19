// Simple in-memory database implementation for development
// This will be replaced with a proper database solution in production

import { VideoRecord, SeminarRecord, VideoProgress, UserActivity } from './database-schema'

// In-memory storage
const database = {
  videos: new Map<string, VideoRecord>(),
  seminars: new Map<string, SeminarRecord>(),
  videoProgress: new Map<string, VideoProgress>(),
  userActivities: new Map<string, UserActivity>(),
  seminarRegistrations: new Map<string, any>()
}

// Video operations
export const videoDatabase = {
  create: async (video: Omit<VideoRecord, 'created_at' | 'updated_at'>): Promise<VideoRecord> => {
    const now = new Date()
    const fullVideo: VideoRecord = {
      ...video,
      created_at: now,
      updated_at: now
    }
    database.videos.set(video.id, fullVideo)
    return fullVideo
  },

  findById: async (id: string): Promise<VideoRecord | null> => {
    return database.videos.get(id) || null
  },

  findAll: async (filters?: {
    department?: string
    level?: string
    isPremium?: boolean
    status?: string
    limit?: number
    offset?: number
  }): Promise<VideoRecord[]> => {
    let videos = Array.from(database.videos.values())

    if (filters) {
      if (filters.department) {
        videos = videos.filter(v => v.department === filters.department)
      }
      if (filters.level) {
        videos = videos.filter(v => v.level === filters.level)
      }
      if (filters.isPremium !== undefined) {
        videos = videos.filter(v => v.is_premium === filters.isPremium)
      }
      if (filters.status) {
        videos = videos.filter(v => v.status === filters.status)
      }
      if (filters.offset) {
        videos = videos.slice(filters.offset)
      }
      if (filters.limit) {
        videos = videos.slice(0, filters.limit)
      }
    }

    return videos.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
  },

  update: async (id: string, updates: Partial<VideoRecord>): Promise<VideoRecord | null> => {
    const existing = database.videos.get(id)
    if (!existing) return null

    const updated: VideoRecord = {
      ...existing,
      ...updates,
      updated_at: new Date()
    }
    database.videos.set(id, updated)
    return updated
  },

  delete: async (id: string): Promise<boolean> => {
    return database.videos.delete(id)
  }
}

// Seminar operations
export const seminarDatabase = {
  create: async (seminar: Omit<SeminarRecord, 'created_at' | 'updated_at'>): Promise<SeminarRecord> => {
    const now = new Date()
    const fullSeminar: SeminarRecord = {
      ...seminar,
      created_at: now,
      updated_at: now
    }
    database.seminars.set(seminar.id, fullSeminar)
    return fullSeminar
  },

  findById: async (id: string): Promise<SeminarRecord | null> => {
    return database.seminars.get(id) || null
  },

  findAll: async (filters?: {
    department?: string
    status?: string
    isPremium?: boolean
    startDate?: Date
    endDate?: Date
    limit?: number
    offset?: number
  }): Promise<SeminarRecord[]> => {
    let seminars = Array.from(database.seminars.values())

    if (filters) {
      if (filters.department) {
        seminars = seminars.filter(s => s.department === filters.department)
      }
      if (filters.status) {
        seminars = seminars.filter(s => s.status === filters.status)
      }
      if (filters.isPremium !== undefined) {
        seminars = seminars.filter(s => s.is_premium === filters.isPremium)
      }
      if (filters.startDate) {
        seminars = seminars.filter(s => s.scheduled_date >= filters.startDate!)
      }
      if (filters.endDate) {
        seminars = seminars.filter(s => s.scheduled_date <= filters.endDate!)
      }
      if (filters.offset) {
        seminars = seminars.slice(filters.offset)
      }
      if (filters.limit) {
        seminars = seminars.slice(0, filters.limit)
      }
    }

    return seminars.sort((a, b) => a.scheduled_date.getTime() - b.scheduled_date.getTime())
  },

  update: async (id: string, updates: Partial<SeminarRecord>): Promise<SeminarRecord | null> => {
    const existing = database.seminars.get(id)
    if (!existing) return null

    const updated: SeminarRecord = {
      ...existing,
      ...updates,
      updated_at: new Date()
    }
    database.seminars.set(id, updated)
    return updated
  },

  delete: async (id: string): Promise<boolean> => {
    return database.seminars.delete(id)
  }
}

// Video progress operations
export const videoProgressDatabase = {
  upsert: async (progress: Omit<VideoProgress, 'created_at' | 'updated_at'>): Promise<VideoProgress> => {
    const now = new Date()
    const key = `${progress.user_id}_${progress.video_id}`
    const existing = database.videoProgress.get(key)

    const fullProgress: VideoProgress = {
      ...progress,
      created_at: existing?.created_at || now,
      updated_at: now
    }
    database.videoProgress.set(key, fullProgress)
    return fullProgress
  },

  findByUserAndVideo: async (userId: string, videoId: string): Promise<VideoProgress | null> => {
    const key = `${userId}_${videoId}`
    return database.videoProgress.get(key) || null
  },

  findByUser: async (userId: string): Promise<VideoProgress[]> => {
    return Array.from(database.videoProgress.values())
      .filter(p => p.user_id === userId)
      .sort((a, b) => b.last_watched.getTime() - a.last_watched.getTime())
  }
}

// User activity operations
export const userActivityDatabase = {
  create: async (activity: Omit<UserActivity, 'created_at'>): Promise<UserActivity> => {
    const fullActivity: UserActivity = {
      ...activity,
      created_at: new Date()
    }
    database.userActivities.set(activity.id, fullActivity)
    return fullActivity
  },

  findByUser: async (userId: string, limit = 50): Promise<UserActivity[]> => {
    return Array.from(database.userActivities.values())
      .filter(a => a.user_id === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  },

  findByContent: async (contentId: string, limit = 100): Promise<UserActivity[]> => {
    return Array.from(database.userActivities.values())
      .filter(a => a.content_id === contentId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }
}

// Utility functions for seeding demo data
export const seedDatabase = async () => {
  console.log('Seeding database with demo data...')

  // Seed videos
  const demoVideos = [
    {
      id: 'video_001',
      title: 'ChatGPT基礎講座',
      description: 'ChatGPTの基本的な使い方から実践的な活用方法まで学習します',
      vimeo_id: '123456789',
      vimeo_uri: '/videos/123456789',
      thumbnail_url: 'https://i.vimeocdn.com/video/123456789.jpg',
      duration: 1800,
      department: 'ai-basics',
      level: 'beginner' as const,
      category: 'ai-basics',
      is_premium: false,
      is_featured: true,
      is_popular: true,
      tags: ['ChatGPT', 'AI基礎', '初心者向け'],
      instructor_name: '田中AI博士',
      upload_date: new Date('2024-01-15'),
      published_date: new Date('2024-01-15'),
      status: 'published' as const,
      view_count: 1250,
      like_count: 89
    },
    {
      id: 'video_002',
      title: 'プロンプトエンジニアリング実践',
      description: '効果的なプロンプトの作成方法とテクニックを学習します',
      vimeo_id: '987654321',
      vimeo_uri: '/videos/987654321',
      thumbnail_url: 'https://i.vimeocdn.com/video/987654321.jpg',
      duration: 2400,
      department: 'practical-application',
      level: 'intermediate' as const,
      category: 'practical-application',
      is_premium: true,
      is_featured: false,
      is_popular: true,
      tags: ['プロンプト', 'エンジニアリング', '実践'],
      instructor_name: '山田プロンプター',
      upload_date: new Date('2024-01-20'),
      published_date: new Date('2024-01-20'),
      status: 'published' as const,
      view_count: 890,
      like_count: 67
    }
  ]

  for (const video of demoVideos) {
    await videoDatabase.create(video)
  }

  // Seed seminars
  const demoSeminars = [
    {
      id: 'seminar_001',
      title: 'AI活用ビジネス戦略セミナー',
      description: 'AI技術をビジネスに活用するための戦略と実践方法を学習します',
      zoom_meeting_id: '123-456-789',
      zoom_webinar_id: undefined,
      zoom_join_url: 'https://zoom.us/j/123456789',
      zoom_start_url: 'https://zoom.us/s/123456789',
      zoom_password: 'ai2024',
      type: 'meeting' as const,
      department: 'business-strategy',
      is_premium: false,
      scheduled_date: new Date('2024-06-25T14:00:00Z'),
      duration: 120,
      max_participants: 100,
      instructor_name: '佐藤戦略コンサル',
      instructor_email: 'sato@example.com',
      status: 'scheduled' as const,
      registration_required: true,
      auto_recording: true,
      waiting_room: true,
      price_free: 5500,
      price_basic: 5500,
      price_premium: 4400
    },
    {
      id: 'seminar_002',
      title: 'データサイエンス実践ワークショップ',
      description: '実際のデータを使ったデータサイエンスの実践的ワークショップです',
      zoom_meeting_id: '987-654-321',
      zoom_webinar_id: undefined,
      zoom_join_url: 'https://zoom.us/j/987654321',
      zoom_start_url: 'https://zoom.us/s/987654321',
      zoom_password: 'data2024',
      type: 'webinar' as const,
      department: 'data-science',
      is_premium: true,
      scheduled_date: new Date('2024-06-30T10:00:00Z'),
      duration: 180,
      max_participants: 50,
      instructor_name: '高橋データサイエンティスト',
      instructor_email: 'takahashi@example.com',
      status: 'scheduled' as const,
      registration_required: true,
      auto_recording: false,
      waiting_room: true,
      price_free: 8800,
      price_basic: 8800,
      price_premium: 7040
    }
  ]

  for (const seminar of demoSeminars) {
    await seminarDatabase.create(seminar)
  }

  console.log('Database seeded successfully!')
}

// Initialize database on first import
let isInitialized = false
export const initializeDatabase = async () => {
  if (!isInitialized) {
    await seedDatabase()
    isInitialized = true
  }
}

// Export the database instance for direct access if needed
export { database }