import { NextRequest, NextResponse } from 'next/server'
import { videoDatabase, initializeDatabase } from '@/lib/database'
import { auth } from '@clerk/nextjs/server'

// Helper function to get department names
function getDepartmentName(slug: string): string {
  const departments = {
    'ai-basics': 'AI基礎学部',
    'practical-application': '実践活用学部',
    'business-strategy': 'ビジネス戦略学部',
    'data-science': 'データサイエンス学部',
    'productivity': '生産性向上学部',
    'catchup': 'キャッチアップ学部'
  }
  return departments[slug as keyof typeof departments] || slug
}

export async function GET(req: NextRequest) {
  try {
    // Initialize database with demo data
    await initializeDatabase()

    const { searchParams } = new URL(req.url)
    const department = searchParams.get('department')
    const level = searchParams.get('level')
    const isPremium = searchParams.get('isPremium')
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search')

    // Get videos from database
    const filters: any = {
      status: 'published',
      limit,
      offset: (page - 1) * limit
    }

    if (department) filters.department = department
    if (level) filters.level = level
    if (isPremium !== null) filters.isPremium = isPremium === 'true'

    let videos = await videoDatabase.findAll(filters)

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase()
      videos = videos.filter(video => 
        video.title.toLowerCase().includes(searchLower) ||
        video.description?.toLowerCase().includes(searchLower)
      )
    }

    // Transform database records to API format
    const transformedVideos = videos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      slug: video.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
      level: video.level,
      isPremium: video.is_premium,
      vimeoId: video.vimeo_id,
      thumbnailUrl: video.thumbnail_url,
      duration: video.duration,
      viewCount: video.view_count,
      rating: 4.5, // Mock rating
      status: video.status,
      publishedAt: video.published_date?.toISOString(),
      department: {
        id: video.department,
        name: getDepartmentName(video.department),
        slug: video.department
      },
      instructor: {
        name: video.instructor_name,
        avatarUrl: '/avatars/default.jpg'
      },
      progress: [],
      _count: {
        ratings: Math.floor(Math.random() * 100) + 10,
        progress: Math.floor(video.view_count * 0.3)
      }
    }))

    const total = transformedVideos.length

    return NextResponse.json({
      videos: transformedVideos,
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
    // Initialize database
    await initializeDatabase()

    const body = await req.json()
    const {
      title,
      description,
      vimeoUri,
      department,
      level,
      tags,
      instructor,
      isPublic,
      isPremium,
      service,
      // Legacy fields for compatibility
      departmentId,
      instructorName,
      vimeoId,
      thumbnailUrl,
      duration
    } = body

    // Support both new and legacy formats
    const finalTitle = title
    const finalDescription = description || ''
    const finalDepartment = department || departmentId
    const finalInstructor = instructor || instructorName
    const finalVimeoId = vimeoUri ? vimeoUri.split('/').pop() : vimeoId
    const finalLevel = level || 'beginner'
    const finalTags = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : [])

    if (!finalTitle || !finalDepartment || !finalInstructor) {
      return NextResponse.json(
        { error: 'Required fields: title, department, instructor' },
        { status: 400 }
      )
    }

    // Create video record for database
    const videoData = {
      id: `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: finalTitle,
      description: finalDescription,
      vimeo_id: finalVimeoId || '000000000',
      vimeo_uri: vimeoUri || `/videos/${finalVimeoId || '000000000'}`,
      thumbnail_url: thumbnailUrl || (finalVimeoId ? `https://i.vimeocdn.com/video/${finalVimeoId}.jpg` : undefined),
      duration: duration || 0,
      department: finalDepartment,
      level: finalLevel as 'beginner' | 'intermediate' | 'advanced',
      category: finalDepartment,
      is_premium: isPremium || false,
      is_featured: false,
      is_popular: false,
      tags: finalTags,
      instructor_name: finalInstructor,
      upload_date: new Date(),
      published_date: isPublic ? new Date() : undefined,
      status: isPublic ? 'published' as const : 'draft' as const,
      view_count: 0,
      like_count: 0
    }

    // Save to database
    const savedVideo = await videoDatabase.create(videoData)

    return NextResponse.json({
      success: true,
      data: {
        id: savedVideo.id,
        title: savedVideo.title,
        description: savedVideo.description,
        vimeoId: savedVideo.vimeo_id,
        vimeoUri: savedVideo.vimeo_uri,
        department: savedVideo.department,
        level: savedVideo.level,
        status: savedVideo.status,
        service: service || 'vimeo'
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create video',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}