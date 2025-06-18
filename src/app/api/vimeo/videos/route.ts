import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getVimeoVideos } from '@/lib/vimeo'

// GET: Vimeo動画一覧取得
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

    // Vimeoから動画一覧取得
    const result = await getVimeoVideos(page, limit)

    return NextResponse.json({
      success: true,
      data: {
        videos: result.data,
        pagination: {
          page: page,
          limit: limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Get Vimeo videos error:', error)
    
    // 環境変数が未設定の場合のフォールバック
    if (error instanceof Error && error.message.includes('Client ID')) {
      return NextResponse.json({
        success: true,
        data: {
          videos: [],
          pagination: {
            page: 1,
            limit: 25,
            total: 0,
            pages: 0
          },
          notice: 'Vimeo credentials not configured. Using fallback mode.'
        }
      })
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch videos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}