import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { rating, comment } = body

    // バリデーション
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const resolvedParams = await params
    // 動画コンテンツの存在確認
    const videoContent = await prisma.videoContent.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!videoContent) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // 既存の評価をチェック
    const existingRating = await prisma.videoRating.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId: resolvedParams.id
        }
      }
    })

    let videoRating
    if (existingRating) {
      // 既存の評価を更新
      videoRating = await prisma.videoRating.update({
        where: { id: existingRating.id },
        data: {
          rating,
          comment: comment || null
        }
      })
    } else {
      // 新しい評価を作成
      videoRating = await prisma.videoRating.create({
        data: {
          userId,
          videoId: resolvedParams.id,
          rating,
          comment: comment || null
        }
      })
    }

    // 平均評価を再計算
    const avgRatingResult = await prisma.videoRating.aggregate({
      where: { videoId: resolvedParams.id },
      _avg: { rating: true }
    })

    // 動画コンテンツの平均評価を更新
    await prisma.videoContent.update({
      where: { id: resolvedParams.id },
      data: {
        avgRating: avgRatingResult._avg.rating
      }
    })

    return NextResponse.json({
      success: true,
      rating: videoRating,
      avgRating: avgRatingResult._avg.rating
    })

  } catch (error) {
    console.error('Error rating video:', error)
    return NextResponse.json(
      { error: 'Failed to rate video' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    // ユーザーの評価を取得
    const userRating = await prisma.videoRating.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId: resolvedParams.id
        }
      }
    })

    // 評価統計を取得
    const [ratingStats, totalRatings] = await Promise.all([
      prisma.videoRating.groupBy({
        by: ['rating'],
        where: { videoId: resolvedParams.id },
        _count: { rating: true }
      }),
      prisma.videoRating.count({
        where: { videoId: resolvedParams.id }
      })
    ])

    // 平均評価を計算
    const avgRatingResult = await prisma.videoRating.aggregate({
      where: { videoId: resolvedParams.id },
      _avg: { rating: true }
    })

    return NextResponse.json({
      success: true,
      userRating,
      stats: {
        avgRating: avgRatingResult._avg.rating,
        totalRatings,
        distribution: ratingStats.reduce((acc, stat) => {
          acc[stat.rating] = stat._count.rating
          return acc
        }, {} as Record<number, number>)
      }
    })

  } catch (error) {
    console.error('Error fetching video ratings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch video ratings' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    // ユーザーの評価を削除
    const deletedRating = await prisma.videoRating.deleteMany({
      where: {
        userId,
        videoId: resolvedParams.id
      }
    })

    if (deletedRating.count === 0) {
      return NextResponse.json({ error: 'Rating not found' }, { status: 404 })
    }

    // 平均評価を再計算
    const avgRatingResult = await prisma.videoRating.aggregate({
      where: { videoId: resolvedParams.id },
      _avg: { rating: true }
    })

    // 動画コンテンツの平均評価を更新
    await prisma.videoContent.update({
      where: { id: resolvedParams.id },
      data: {
        avgRating: avgRatingResult._avg.rating
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Rating deleted successfully',
      avgRating: avgRatingResult._avg.rating
    })

  } catch (error) {
    console.error('Error deleting video rating:', error)
    return NextResponse.json(
      { error: 'Failed to delete video rating' },
      { status: 500 }
    )
  }
}