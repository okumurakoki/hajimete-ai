import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { errorLogger } from '@/lib/error-logger'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const level = searchParams.get('level') as 'error' | 'warn' | 'info' | null
    const component = searchParams.get('component')
    const userIdFilter = searchParams.get('userId')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50

    console.log('🔍 GET /api/admin/error-logs - Fetching error logs')

    const logs = errorLogger.getLogs({
      level: level || undefined,
      component: component || undefined,
      userId: userIdFilter || undefined,
      limit
    })

    const stats = errorLogger.getErrorStats()

    return NextResponse.json({
      logs,
      stats,
      filters: {
        level,
        component,
        userId: userIdFilter,
        limit
      }
    })

  } catch (error) {
    console.error('Error fetching error logs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    // 内部API呼び出しの場合は認証をスキップ（エラーログサービスから）
    const authHeader = req.headers.get('Authorization')
    if (!userId && !authHeader?.includes('internal')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const log = await req.json()

    console.log('📝 POST /api/admin/error-logs - Storing error log:', log.level)

    // ログを永続化する場合はここでDBに保存
    // 現在はメモリ内のErrorLoggerで管理
    
    return NextResponse.json({
      success: true,
      message: 'Error log stored successfully'
    })

  } catch (error) {
    console.error('Error storing error log:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🗑️ DELETE /api/admin/error-logs - Clearing error logs')

    errorLogger.clearLogs()

    return NextResponse.json({
      success: true,
      message: 'Error logs cleared successfully'
    })

  } catch (error) {
    console.error('Error clearing error logs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}