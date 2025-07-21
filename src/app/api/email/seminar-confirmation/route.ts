import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { emailService } from '@/lib/email'

interface SeminarConfirmationData {
  userEmail: string
  userName: string
  seminarId: string
  seminarTitle: string
  instructor: string
  startDate: string
  endDate: string
  price: number
  zoomUrl?: string
  zoomId?: string
  zoomPassword?: string
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
    const { seminarId } = body

    if (!seminarId) {
      return NextResponse.json({ error: 'Seminar ID is required' }, { status: 400 })
    }

    console.log('📧 Sending seminar confirmation email for:', seminarId)

    // セミナー情報をモックデータから取得
    const mockSeminarData: SeminarConfirmationData = {
      userEmail: 'user@example.com', // 実際の実装ではClerkから取得
      userName: 'テストユーザー',
      seminarId: seminarId,
      seminarTitle: 'ChatGPT活用セミナー 基礎編',
      instructor: '山田太郎',
      startDate: '2025-07-15T19:00:00.000Z',
      endDate: '2025-07-15T20:30:00.000Z',
      price: 3000,
      zoomUrl: 'https://zoom.us/j/example-seminar',
      zoomId: '123-456-789',
      zoomPassword: 'ai2025'
    }

    // EmailServiceの既存形式に変換
    const emailData = {
      userEmail: mockSeminarData.userEmail,
      userName: mockSeminarData.userName,
      courses: [{
        id: mockSeminarData.seminarId,
        title: mockSeminarData.seminarTitle,
        instructor: mockSeminarData.instructor,
        startDate: mockSeminarData.startDate,
        endDate: mockSeminarData.endDate,
        zoomUrl: mockSeminarData.zoomUrl,
        zoomId: mockSeminarData.zoomId,
        zoomPassword: mockSeminarData.zoomPassword
      }],
      paymentAmount: mockSeminarData.price,
      receiptUrl: undefined
    }

    // メール送信
    const result = await emailService.sendRegistrationConfirmation(emailData)

    if (result) {
      console.log('✅ Seminar confirmation email sent successfully')
      return NextResponse.json({
        success: true,
        message: 'Seminar confirmation email sent successfully'
      })
    } else {
      console.error('❌ Failed to send seminar confirmation email')
      return NextResponse.json({
        success: false,
        message: 'Failed to send confirmation email'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('💥 Error sending seminar confirmation email:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}