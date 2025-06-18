import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const department = searchParams.get('department')
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search')

    // Mock video data
    const mockVideos = [
      {
        id: '1',
        title: 'AI基礎概念とビジネス活用',
        description: 'AIの基本概念から実践的なビジネス活用方法まで学びます',
        slug: 'ai-basics-business',
        level: 'beginner',
        isPremium: false,
        vimeoId: '123456789',
        thumbnailUrl: 'https://example.com/thumb1.jpg',
        duration: 1800,
        viewCount: 1250,
        rating: 4.8,
        status: 'published',
        publishedAt: '2024-01-15T09:00:00Z',
        department: {
          id: '1',
          name: 'AI基礎学部',
          slug: 'ai-basics'
        },
        instructor: {
          name: '田中AI博士',
          avatarUrl: 'https://example.com/avatar1.jpg'
        },
        progress: [],
        _count: {
          ratings: 45,
          progress: 320
        }
      },
      {
        id: '2',
        title: 'Excel自動化完全マスター',
        description: 'Excelマクロとピボットテーブルで業務効率化',
        slug: 'excel-automation-master',
        level: 'intermediate',
        isPremium: true,
        vimeoId: '987654321',
        thumbnailUrl: 'https://example.com/thumb2.jpg',
        duration: 2400,
        viewCount: 890,
        rating: 4.6,
        status: 'published',
        publishedAt: '2024-01-10T14:00:00Z',
        department: {
          id: '2',
          name: '業務効率化学部',
          slug: 'business-efficiency'
        },
        instructor: {
          name: '佐藤エクセル先生',
          avatarUrl: 'https://example.com/avatar2.jpg'
        },
        progress: [],
        _count: {
          ratings: 32,
          progress: 156
        }
      },
      {
        id: '3',
        title: 'ChatGPT実践活用術',
        description: 'ChatGPTを使った実際のビジネス課題解決方法',
        slug: 'chatgpt-business-practical',
        level: 'intermediate',
        isPremium: false,
        vimeoId: '456789123',
        thumbnailUrl: 'https://example.com/thumb3.jpg',
        duration: 2100,
        viewCount: 2100,
        rating: 4.9,
        status: 'published',
        publishedAt: '2024-01-20T11:00:00Z',
        department: {
          id: '3',
          name: '実践応用学部',
          slug: 'practical-application'
        },
        instructor: {
          name: '山田GPT専門家',
          avatarUrl: 'https://example.com/avatar3.jpg'
        },
        progress: [],
        _count: {
          ratings: 67,
          progress: 445
        }
      },
      {
        id: '4',
        title: '最新AI技術動向2024',
        description: '2024年最新のAI技術トレンドとビジネスインパクト',
        slug: 'ai-trends-2024',
        level: 'advanced',
        isPremium: true,
        vimeoId: '789123456',
        thumbnailUrl: 'https://example.com/thumb4.jpg',
        duration: 1950,
        viewCount: 680,
        rating: 4.7,
        status: 'published',
        publishedAt: '2024-01-25T16:00:00Z',
        department: {
          id: '4',
          name: 'キャッチアップ学部',
          slug: 'catchup'
        },
        instructor: {
          name: '高橋トレンド研究家',
          avatarUrl: 'https://example.com/avatar4.jpg'
        },
        progress: [],
        _count: {
          ratings: 28,
          progress: 89
        }
      }
    ]

    // Filter videos based on parameters
    let filteredVideos = mockVideos.filter(video => video.status === 'published')

    if (department) {
      filteredVideos = filteredVideos.filter(video => video.department.slug === department)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredVideos = filteredVideos.filter(video => 
        video.title.toLowerCase().includes(searchLower) ||
        video.description.toLowerCase().includes(searchLower)
      )
    }

    const total = filteredVideos.length
    const skip = (page - 1) * limit
    const videos = filteredVideos.slice(skip, skip + limit)

    return NextResponse.json({
      videos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Mock admin check - in production, verify against your user system
    const isAdmin = userId === 'admin_user_id'
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const {
      title,
      description,
      departmentId,
      level,
      isPremium,
      instructorName,
      tags,
      vimeoId,
      thumbnailUrl,
      duration
    } = body

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Mock video creation
    const video = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      slug,
      departmentId,
      level,
      isPremium,
      instructorName,
      tags,
      vimeoId,
      thumbnailUrl,
      duration,
      status: 'draft',
      createdAt: new Date().toISOString(),
      department: {
        id: departmentId,
        name: 'Mock Department',
        slug: 'mock-department'
      },
      instructor: {
        name: instructorName,
        avatarUrl: 'https://example.com/default-avatar.jpg'
      }
    }

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}