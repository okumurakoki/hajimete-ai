import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { cloudflareStream } from '@/lib/cloudflare'

// POST: ライブ入力作成
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
    const { name, recording = true } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Live input name is required' },
        { status: 400 }
      )
    }

    // CloudFlare Streamライブ入力作成
    const result = await cloudflareStream.createLiveInput(name, recording)

    if (!result.success) {
      throw new Error('Failed to create live input')
    }

    return NextResponse.json({
      success: true,
      data: {
        liveInput: result.result
      }
    })
  } catch (error) {
    console.error('CloudFlare live input creation error:', error)
    
    // 環境変数未設定のフォールバック
    if (error instanceof Error && error.message.includes('API')) {
      const { name } = await request.json()
      return NextResponse.json({
        success: true,
        data: {
          liveInput: {
            uid: 'demo-live-input-123',
            rtmps: {
              url: 'rtmps://live.cloudflarestream.com/live/',
              streamKey: 'demo-stream-key-456'
            },
            status: 'connected',
            meta: { name: name || 'Demo Live Stream' },
            created: new Date().toISOString()
          },
          notice: 'CloudFlare credentials not configured. Using demo mode.'
        }
      })
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create live input',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET: ライブ入力一覧取得
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // CloudFlare Streamライブ入力一覧取得
    const result = await cloudflareStream.getLiveInputs()

    if (!result.success) {
      throw new Error('Failed to get live inputs')
    }

    return NextResponse.json({
      success: true,
      data: {
        liveInputs: result.result
      }
    })
  } catch (error) {
    console.error('Get CloudFlare live inputs error:', error)
    
    // 環境変数未設定のフォールバック
    if (error instanceof Error && error.message.includes('API')) {
      return NextResponse.json({
        success: true,
        data: {
          liveInputs: [
            {
              uid: 'demo-live-input-123',
              rtmps: {
                url: 'rtmps://live.cloudflarestream.com/live/',
                streamKey: 'demo-stream-key-456'
              },
              status: 'connected',
              meta: { name: 'Demo Live Stream' },
              created: new Date().toISOString()
            }
          ],
          notice: 'CloudFlare credentials not configured. Using demo mode.'
        }
      })
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to get live inputs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}