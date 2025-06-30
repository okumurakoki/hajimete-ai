import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { vimeoService } from '@/lib/vimeo'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, watchTime, currentPosition, deviceType } = body

    // IPアドレスを取得
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    let sessionId: string
    const resolvedParams = await params

    switch (action) {
      case 'start':
        // 視聴セッションを開始
        sessionId = await vimeoService.startWatchSession(
          userId, 
          resolvedParams.id, 
          deviceType, 
          ipAddress
        )
        
        return NextResponse.json({
          success: true,
          sessionId,
          message: 'Watch session started'
        })

      case 'progress':
        // 視聴進捗を更新
        const { sessionId: progressSessionId } = body
        
        if (!progressSessionId) {
          return NextResponse.json(
            { error: 'sessionId is required for progress updates' },
            { status: 400 }
          )
        }
        
        await vimeoService.updateWatchProgress(
          progressSessionId,
          watchTime || 0,
          currentPosition || 0
        )
        
        return NextResponse.json({
          success: true,
          message: 'Watch progress updated'
        })

      case 'end':
        // 視聴セッションを終了
        const { sessionId: endSessionId } = body
        
        if (!endSessionId) {
          return NextResponse.json(
            { error: 'sessionId is required to end session' },
            { status: 400 }
          )
        }
        
        await vimeoService.endWatchSession(endSessionId)
        
        return NextResponse.json({
          success: true,
          message: 'Watch session ended'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be "start", "progress", or "end"' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error handling watch session:', error)
    return NextResponse.json(
      { error: 'Failed to handle watch session' },
      { status: 500 }
    )
  }
}