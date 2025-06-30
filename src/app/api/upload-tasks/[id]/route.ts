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
    const uploadTask = await prisma.uploadTask.findUnique({
      where: { id: resolvedParams.id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    if (!uploadTask) {
      return NextResponse.json({ error: 'Upload task not found' }, { status: 404 })
    }

    // アップロードユーザーまたは管理者のみアクセス可能
    if (uploadTask.userId !== userId) {
      const admin = await prisma.admin.findUnique({
        where: { userId }
      })
      
      if (!admin) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
      }
    }

    return NextResponse.json({
      success: true,
      uploadTask
    })

  } catch (error) {
    console.error('Error fetching upload task:', error)
    return NextResponse.json(
      { error: 'Failed to fetch upload task' },
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
    const { status, progress, errorMessage, vimeoVideoId } = body

    const resolvedParams = await params
    const uploadTask = await prisma.uploadTask.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!uploadTask) {
      return NextResponse.json({ error: 'Upload task not found' }, { status: 404 })
    }

    // アップロードユーザーまたは管理者のみ更新可能
    if (uploadTask.userId !== userId) {
      const admin = await prisma.admin.findUnique({
        where: { userId }
      })
      
      if (!admin) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
      }
    }

    // アップロードタスクを更新
    const updatedTask = await prisma.uploadTask.update({
      where: { id: resolvedParams.id },
      data: {
        ...(status && { status }),
        ...(progress !== undefined && { progress }),
        ...(errorMessage !== undefined && { errorMessage }),
        ...(vimeoVideoId && { vimeoVideoId })
      }
    })

    // ステータスがCOMPLETEDに変更された場合、VideoContentを作成
    if (status === 'COMPLETED' && vimeoVideoId && !uploadTask.vimeoVideoId) {
      try {
        const videoContent = await prisma.videoContent.create({
          data: {
            vimeoId: vimeoVideoId,
            vimeoUri: `/videos/${vimeoVideoId}`,
            embedUrl: vimeoService.generateEmbedUrl(vimeoVideoId),
            title: uploadTask.title || uploadTask.filename,
            description: uploadTask.description,
            duration: 0, // 後で同期される
            uploadedBy: uploadTask.userId,
            originalFilename: uploadTask.filename,
            fileSize: uploadTask.fileSize,
            lessonId: uploadTask.lessonId,
            status: 'PROCESSING'
          }
        })

        console.log(`✅ VideoContent created: ${videoContent.id} for upload task: ${resolvedParams.id}`)
      } catch (error) {
        console.error('Error creating VideoContent:', error)
      }
    }

    return NextResponse.json({
      success: true,
      uploadTask: updatedTask
    })

  } catch (error) {
    console.error('Error updating upload task:', error)
    return NextResponse.json(
      { error: 'Failed to update upload task' },
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
    const uploadTask = await prisma.uploadTask.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!uploadTask) {
      return NextResponse.json({ error: 'Upload task not found' }, { status: 404 })
    }

    // アップロードユーザーまたは管理者のみ削除可能
    if (uploadTask.userId !== userId) {
      const admin = await prisma.admin.findUnique({
        where: { userId }
      })
      
      if (!admin) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
      }
    }

    // 関連するVideoContentがある場合は削除をブロック
    if (uploadTask.vimeoVideoId) {
      const relatedVideo = await prisma.videoContent.findFirst({
        where: { vimeoId: uploadTask.vimeoVideoId }
      })
      
      if (relatedVideo) {
        return NextResponse.json(
          { error: 'Cannot delete upload task: related video content exists' },
          { status: 400 }
        )
      }
    }

    await prisma.uploadTask.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Upload task deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting upload task:', error)
    return NextResponse.json(
      { error: 'Failed to delete upload task' },
      { status: 500 }
    )
  }
}