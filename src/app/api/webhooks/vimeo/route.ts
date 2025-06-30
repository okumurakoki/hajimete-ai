import { NextRequest, NextResponse } from 'next/server'
import { vimeoService } from '@/lib/vimeo'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, data } = body

    console.log('Vimeo webhook received:', { event, data })

    // Vimeoイベントの処理
    switch (event) {
      case 'video.upload.complete':
        await handleVideoUploadComplete(data)
        break
      
      case 'video.transcode.complete':
        await handleVideoTranscodeComplete(data)
        break
      
      case 'video.delete':
        await handleVideoDelete(data)
        break
      
      default:
        console.log(`Unhandled Vimeo event: ${event}`)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error processing Vimeo webhook:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}

async function handleVideoUploadComplete(data: any) {
  try {
    const vimeoVideoId = extractVideoId(data.uri || data.video_uri)
    
    if (!vimeoVideoId) {
      console.warn('No video ID found in upload complete event')
      return
    }

    // アップロードタスクを検索（vimeoTicketまたはvimeoVideoIdで）
    const uploadTask = await prisma.uploadTask.findFirst({
      where: {
        OR: [
          { vimeoTicket: vimeoVideoId },
          { vimeoVideoId: vimeoVideoId }
        ]
      }
    })

    if (!uploadTask) {
      console.warn(`No upload task found for Vimeo video: ${vimeoVideoId}`)
      return
    }

    // アップロードタスクを更新
    await prisma.uploadTask.update({
      where: { id: uploadTask.id },
      data: {
        status: 'PROCESSING',
        progress: 100,
        vimeoVideoId: vimeoVideoId
      }
    })

    // VideoContentが既に存在するかチェック
    const existingVideo = await prisma.videoContent.findFirst({
      where: { vimeoId: vimeoVideoId }
    })

    if (!existingVideo) {
      // VideoContentレコードを作成
      const videoContent = await prisma.videoContent.create({
        data: {
          vimeoId: vimeoVideoId,
          vimeoUri: data.uri || `/videos/${vimeoVideoId}`,
          embedUrl: vimeoService.generateEmbedUrl(vimeoVideoId),
          title: uploadTask.title || uploadTask.filename,
          description: uploadTask.description,
          duration: data.duration || 0,
          uploadedBy: uploadTask.userId,
          originalFilename: uploadTask.filename,
          fileSize: uploadTask.fileSize,
          lessonId: uploadTask.lessonId,
          status: 'PROCESSING'
        }
      })

      console.log(`✅ VideoContent created: ${videoContent.id} for Vimeo video: ${vimeoVideoId}`)
    }

  } catch (error) {
    console.error('Error handling video upload complete:', error)
  }
}

async function handleVideoTranscodeComplete(data: any) {
  try {
    const vimeoVideoId = extractVideoId(data.uri || data.video_uri)
    
    if (!vimeoVideoId) {
      console.warn('No video ID found in transcode complete event')
      return
    }

    // VideoContentを検索して更新
    const videoContent = await prisma.videoContent.findFirst({
      where: { vimeoId: vimeoVideoId }
    })

    if (!videoContent) {
      console.warn(`No video content found for Vimeo video: ${vimeoVideoId}`)
      return
    }

    // Vimeoから最新のメタデータを同期
    await vimeoService.syncVideoMetadata(videoContent.id)

    // ステータスをREADYに更新
    await prisma.videoContent.update({
      where: { id: videoContent.id },
      data: {
        status: 'READY'
      }
    })

    // 関連するアップロードタスクを完了に更新
    await prisma.uploadTask.updateMany({
      where: { vimeoVideoId: vimeoVideoId },
      data: { status: 'COMPLETED' }
    })

    console.log(`✅ Video transcode completed: ${vimeoVideoId}`)

  } catch (error) {
    console.error('Error handling video transcode complete:', error)
  }
}

async function handleVideoDelete(data: any) {
  try {
    const vimeoVideoId = extractVideoId(data.uri || data.video_uri)
    
    if (!vimeoVideoId) {
      console.warn('No video ID found in delete event')
      return
    }

    // VideoContentのステータスをDELETEDに更新
    await prisma.videoContent.updateMany({
      where: { vimeoId: vimeoVideoId },
      data: { status: 'DELETED' }
    })

    console.log(`✅ Video marked as deleted: ${vimeoVideoId}`)

  } catch (error) {
    console.error('Error handling video delete:', error)
  }
}

function extractVideoId(uri: string): string | null {
  if (!uri) return null
  
  // URI format: "/videos/123456789" or "https://api.vimeo.com/videos/123456789"
  const match = uri.match(/\/videos\/(\d+)/)
  return match ? match[1] : null
}