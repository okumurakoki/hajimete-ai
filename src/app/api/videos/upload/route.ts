import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { vimeoService } from '@/lib/vimeo'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { filename, fileSize, mimeType, title, description, lessonId } = body

    // 基本的なバリデーション
    if (!filename || !fileSize || !mimeType) {
      return NextResponse.json(
        { error: 'filename, fileSize, and mimeType are required' },
        { status: 400 }
      )
    }

    // ファイルサイズ制限 (500MB)
    const MAX_FILE_SIZE = 500 * 1024 * 1024
    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 500MB limit' },
        { status: 400 }
      )
    }

    // 動画ファイル形式チェック
    const allowedMimeTypes = [
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/wmv',
      'video/flv',
      'video/webm',
      'video/mkv'
    ]
    
    if (!allowedMimeTypes.includes(mimeType)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a video file.' },
        { status: 400 }
      )
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

    // アップロードタスクを作成
    const uploadTaskId = await vimeoService.createUploadTask(userId, {
      filename,
      fileSize,
      mimeType,
      title,
      description,
      lessonId
    })

    // アップロードタスクの詳細を取得
    const uploadTask = await prisma.uploadTask.findUnique({
      where: { id: uploadTaskId },
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

    return NextResponse.json({
      success: true,
      uploadTask: {
        id: uploadTask!.id,
        filename: uploadTask!.filename,
        fileSize: uploadTask!.fileSize,
        status: uploadTask!.status,
        progress: uploadTask!.progress,
        vimeoUploadUrl: uploadTask!.vimeoUploadUrl,
        createdAt: uploadTask!.createdAt
      }
    })

  } catch (error) {
    console.error('Error creating upload task:', error)
    return NextResponse.json(
      { error: 'Failed to create upload task' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // ユーザーのアップロードタスクを取得
    const whereClause: any = { userId }
    if (status) {
      whereClause.status = status
    }

    const [uploadTasks, total] = await Promise.all([
      prisma.uploadTask.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      }),
      prisma.uploadTask.count({ where: whereClause })
    ])

    return NextResponse.json({
      success: true,
      uploadTasks,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('Error fetching upload tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch upload tasks' },
      { status: 500 }
    )
  }
}