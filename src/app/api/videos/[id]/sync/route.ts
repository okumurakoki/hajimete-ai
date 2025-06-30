import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { vimeoService } from '@/lib/vimeo'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 管理者権限チェック
    const admin = await prisma.admin.findUnique({
      where: { userId }
    })
    
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const resolvedParams = await params
    // 動画コンテンツの存在確認
    const videoContent = await prisma.videoContent.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!videoContent) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Vimeoからメタデータを同期
    await vimeoService.syncVideoMetadata(resolvedParams.id)

    // 更新された動画コンテンツを取得
    const updatedVideo = await prisma.videoContent.findUnique({
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
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Video metadata synchronized successfully',
      video: updatedVideo
    })

  } catch (error) {
    console.error('Error syncing video metadata:', error)
    return NextResponse.json(
      { error: 'Failed to sync video metadata' },
      { status: 500 }
    )
  }
}