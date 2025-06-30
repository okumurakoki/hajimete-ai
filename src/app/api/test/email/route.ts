import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { emailService } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { type = 'registration' } = body

    // テスト用のサンプルデータ
    const testEmailData = {
      userEmail: 'test@example.com', // 実際のテストではここを変更
      userName: 'テストユーザー',
      courses: [
        {
          id: 'test-course-1',
          title: 'NotebookLM完全マスター講座',
          instructor: '山田太郎',
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
          zoomUrl: 'https://zoom.us/j/123456789',
          zoomId: '123 456 789',
          zoomPassword: 'test123'
        },
        {
          id: 'test-course-2', 
          title: 'Notion AI活用術：生産性爆上げ講座',
          instructor: '田中花子',
          startDate: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 25 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
          zoomUrl: 'https://zoom.us/j/987654321',
          zoomId: '987 654 321',
          zoomPassword: 'notion456'
        }
      ],
      paymentAmount: 7500,
      receiptUrl: 'https://stripe.com/receipt/test123'
    }

    const testZoomData = {
      userEmail: 'test@example.com',
      userName: 'テストユーザー',
      course: testEmailData.courses[0]
    }

    let result: boolean = false

    if (type === 'registration') {
      console.log('📧 Testing registration confirmation email...')
      result = await emailService.sendRegistrationConfirmation(testEmailData)
    } else if (type === 'zoom') {
      console.log('📧 Testing zoom invite email...')
      result = await emailService.sendZoomInvite(testZoomData)
    } else {
      return NextResponse.json({ error: 'Invalid email type' }, { status: 400 })
    }

    return NextResponse.json({
      success: result,
      type,
      message: result ? 
        `${type} email sent successfully` : 
        `Failed to send ${type} email`,
      testData: type === 'registration' ? testEmailData : testZoomData
    })

  } catch (error) {
    console.error('❌ Error testing email:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email test endpoint',
    usage: {
      'POST with type=registration': 'Test registration confirmation email',
      'POST with type=zoom': 'Test zoom invite email'
    },
    environment: process.env.NODE_ENV,
    emailProvider: process.env.SENDGRID_API_KEY ? 'SendGrid' : 'Nodemailer (Dev)'
  })
}