import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { cloudflareStream } from '@/lib/cloudflare'

// GET: CloudFlare Stream動画一覧取得
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '25')

    // CloudFlare Streamから動画一覧取得
    const result = await cloudflareStream.getVideos(page, limit)

    if (!result.success) {
      throw new Error('Failed to get videos from CloudFlare')
    }

    return NextResponse.json({
      success: true,
      data: {
        videos: result.result,
        pagination: {
          page: page,
          limit: limit,
          total: result.result.length,
          pages: Math.ceil(result.result.length / limit)
        }
      }
    })
  } catch (error) {
    console.error('Get CloudFlare videos error:', error)
    
    // 環境変数未設定のフォールバック
    if (error instanceof Error && error.message.includes('API')) {
      return NextResponse.json({
        success: true,
        data: {
          videos: [
            {
              uid: 'demo-video-123',
              thumbnail: 'https://videodelivery.net/demo-video-123/thumbnails/thumbnail.jpg',
              readyToStream: true,
              status: { state: 'ready', pctComplete: '100' },
              meta: { 
                name: 'Demo CloudFlare Video',
                description: 'Sample video for demonstration'
              },
              created: new Date().toISOString(),
              duration: 1800,
              playback: {
                hls: 'https://videodelivery.net/demo-video-123/manifest/video.m3u8',
                dash: 'https://videodelivery.net/demo-video-123/manifest/video.mpd'
              }
            }
          ],
          pagination: {
            page: 1,
            limit: 25,
            total: 1,
            pages: 1
          },
          notice: 'CloudFlare credentials not configured. Using demo mode.'
        }
      })
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch CloudFlare videos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST: 直接アップロードURL取得
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { maxDurationSeconds = 3600 } = body

    // CloudFlare StreamアップロードURL作成
    const result = await cloudflareStream.createDirectUpload(maxDurationSeconds)

    if (!result.success) {
      throw new Error('Failed to create upload URL')
    }

    return NextResponse.json({
      success: true,
      data: {
        uploadURL: result.result.uploadURL,
        uid: result.result.uid
      }
    })
  } catch (error) {
    console.error('CloudFlare upload URL creation error:', error)
    
    // 環境変数未設定のフォールバック
    if (error instanceof Error && error.message.includes('API')) {
      return NextResponse.json({
        success: true,
        data: {
          uploadURL: 'https://upload.videodelivery.net/demo-upload-url',
          uid: 'demo-video-upload-123',
          notice: 'CloudFlare credentials not configured. Using demo mode.'
        }
      })
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create upload URL',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}