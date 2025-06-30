import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { vimeoService } from '@/lib/vimeo'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const videoContent = await prisma.videoContent.findUnique({
      where: { id: resolvedParams.id },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            course: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        watchSessions: {
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        videoRatings: {
          where: { userId }
        }
      }
    })

    if (!videoContent) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      video: videoContent
    })

  } catch (error) {
    console.error('Error fetching video:', error)
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, privacy, lessonId } = body

    const resolvedParams = await params
    // 動画コンテンツの存在確認と権限チェック
    const videoContent = await prisma.videoContent.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!videoContent) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // アップロードユーザーまたは管理者のみ編集可能
    if (videoContent.uploadedBy !== userId) {
      // 管理者権限チェック
      const admin = await prisma.admin.findUnique({
        where: { userId }
      })
      
      if (!admin) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
      }
    }

    // レッスンIDが指定されている場合は存在確認
    if (lessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId }
      })
      
      if (!lesson) {
        return NextResponse.json(
          { error: 'Lesson not found' },
          { status: 404 }
        )
      }
    }

    // Vimeoメタデータを更新
    if (title || description || privacy) {
      try {
        await vimeoService.updateVideoMetadata(videoContent.vimeoId, {
          name: title,
          description,
          privacy
        })
      } catch (error) {
        console.warn('Failed to update Vimeo metadata:', error)
        // Vimeo更新失敗してもデータベース更新は続行
      }
    }

    // データベースを更新
    const updatedVideo = await prisma.videoContent.update({
      where: { id: resolvedParams.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(privacy && { privacy }),
        ...(lessonId !== undefined && { lessonId })
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            course: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      video: updatedVideo
    })

  } catch (error) {
    console.error('Error updating video:', error)
    return NextResponse.json(
      { error: 'Failed to update video' },
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
    // 動画コンテンツの存在確認と権限チェック
    const videoContent = await prisma.videoContent.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!videoContent) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // アップロードユーザーまたは管理者のみ削除可能
    if (videoContent.uploadedBy !== userId) {
      // 管理者権限チェック
      const admin = await prisma.admin.findUnique({
        where: { userId }
      })
      
      if (!admin) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
      }
    }

    // Vimeoから動画を削除
    try {
      await vimeoService.deleteVideo(videoContent.vimeoId)
    } catch (error) {
      console.warn('Failed to delete video from Vimeo:', error)
      // Vimeo削除失敗してもデータベース削除は続行
    }

    // データベースから削除（関連するセッションと評価も連鎖削除される）
    await prisma.videoContent.update({
      where: { id: resolvedParams.id },
      data: { status: 'DELETED' }
    })

    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    )
  }
}