import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { emailScheduler } from '@/lib/email-scheduler'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') as any
    const type = searchParams.get('type') as any
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50

    console.log('🔍 GET /api/admin/email-scheduler - Fetching scheduled emails')

    const emails = emailScheduler.getScheduledEmails({
      status,
      type,
      limit
    })

    const stats = emailScheduler.getEmailStats()

    return NextResponse.json({
      emails,
      stats,
      filters: {
        status,
        type,
        limit
      }
    })

  } catch (error) {
    console.error('Error fetching scheduled emails:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // 内部API呼び出しの場合は認証をスキップ
    const authHeader = req.headers.get('Authorization')
    let userId: string | null = null
    
    if (authHeader?.startsWith('Bearer ')) {
      userId = authHeader.replace('Bearer ', '')
    } else {
      const authResult = await auth()
      userId = authResult.userId
      
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const body = await req.json()
    const { action, ...data } = body

    console.log('📝 POST /api/admin/email-scheduler - Action:', action)

    switch (action) {
      case 'start-scheduler':
        emailScheduler.start()
        return NextResponse.json({ success: true, message: 'Email scheduler started' })

      case 'stop-scheduler':
        emailScheduler.stop()
        return NextResponse.json({ success: true, message: 'Email scheduler stopped' })

      case 'schedule-reminder':
        const { userEmail, userName, seminar, reminderTime } = data
        emailScheduler.scheduleReminderEmail(userEmail, userName, seminar, reminderTime)
        return NextResponse.json({ success: true, message: 'Reminder email scheduled' })

      case 'schedule-follow-up':
        const { userEmail: followUpEmail, userName: followUpName, seminar: followUpSeminar, delayHours } = data
        emailScheduler.scheduleFollowUpEmail(followUpEmail, followUpName, followUpSeminar, delayHours)
        return NextResponse.json({ success: true, message: 'Follow-up email scheduled' })

      case 'schedule-marketing':
        const { userEmail: marketingEmail, userName: marketingName, templateType, scheduledAt, emailData } = data
        emailScheduler.scheduleMarketingEmail(
          marketingEmail,
          marketingName,
          templateType,
          new Date(scheduledAt),
          emailData
        )
        return NextResponse.json({ success: true, message: 'Marketing email scheduled' })

      case 'bulk-marketing':
        const { users, templateType: bulkTemplateType, scheduledAt: bulkScheduledAt, emailData: bulkData } = data
        emailScheduler.scheduleBulkMarketingEmail(
          users,
          bulkTemplateType,
          new Date(bulkScheduledAt),
          bulkData
        )
        return NextResponse.json({ 
          success: true, 
          message: `Bulk marketing email scheduled for ${users.length} users` 
        })

      case 'cancel-email':
        const { emailId } = data
        const cancelled = emailScheduler.cancelEmail(emailId)
        return NextResponse.json({ 
          success: cancelled, 
          message: cancelled ? 'Email cancelled' : 'Email not found or cannot be cancelled' 
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Error processing email scheduler action:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}