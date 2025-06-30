import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lessonId')
    const status = searchParams.get('status')
    const uploadedBy = searchParams.get('uploadedBy')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // 管理者権限チェック（全ての動画を見るため）
    const admin = await prisma.admin.findUnique({
      where: { userId }
    })

    // フィルタ条件を構築
    const whereClause: any = {}

    // 管理者でない場合は自分がアップロードした動画のみ
    if (!admin) {
      whereClause.uploadedBy = userId
    } else if (uploadedBy) {
      whereClause.uploadedBy = uploadedBy
    }

    if (lessonId) {
      whereClause.lessonId = lessonId
    }

    if (status) {
      whereClause.status = status
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { originalFilename: { contains: search, mode: 'insensitive' } }
      ]
    }

    // ソート設定
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    const [videos, total] = await Promise.all([
      prisma.videoContent.findMany({
        where: whereClause,
        orderBy,
        take: limit,
        skip: offset,
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              course: {
                select: {
                  id: true,
                  title: true,
                  department: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
                }
              }
            }
          },
          watchSessions: {
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              id: true,
              completed: true,
              progressPercent: true,
              lastPosition: true,
              watchTime: true
            }
          },
          videoRatings: {
            where: { userId },
            select: {
              id: true,
              rating: true,
              comment: true
            }
          },
          _count: {
            select: {
              watchSessions: true,
              videoRatings: true
            }
          }
        }
      }),
      prisma.videoContent.count({ where: whereClause })
    ])

    // 各動画に統計情報を追加
    const videosWithStats = await Promise.all(
      videos.map(async (video) => {
        const avgRating = await prisma.videoRating.aggregate({
          where: { videoId: video.id },
          _avg: { rating: true }
        })

        return {
          ...video,
          avgRating: avgRating._avg.rating,
          userWatchSession: video.watchSessions[0] || null,
          userRating: video.videoRatings[0] || null,
          totalWatchSessions: video._count.watchSessions,
          totalRatings: video._count.videoRatings
        }
      })
    )

    return NextResponse.json({
      success: true,
      videos: videosWithStats,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}