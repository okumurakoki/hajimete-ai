import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'

// Stripeのモック設定（本番環境では実際のStripeを使用）
const USE_MOCK_STRIPE = true

interface MockPaymentIntent {
  id: string
  client_secret: string
  amount: number
  currency: string
  status: string
}

// モックStripeクライアント
const mockStripe = {
  customers: {
    create: async (params: any) => ({
      id: `cus_mock_${Date.now()}`,
      email: params.email,
      name: params.name,
      metadata: params.metadata
    })
  },
  paymentIntents: {
    create: async (params: any): Promise<MockPaymentIntent> => ({
      id: `pi_mock_${Date.now()}`,
      client_secret: `pi_mock_${Date.now()}_secret_mock`,
      amount: params.amount,
      currency: params.currency,
      status: 'requires_payment_method'
    })
  }
}

// 実際のStripeクライアント
const realStripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
}) : null

const stripe = USE_MOCK_STRIPE ? mockStripe : realStripe

// セミナーのモックデータ
const mockSeminars = [
  {
    id: '1',
    title: 'ChatGPT活用セミナー 基礎編',
    price: 3000,
    maxParticipants: 50,
    currentParticipants: 12,
    isActive: true,
    isPublished: true
  },
  {
    id: '2',
    title: 'Notion AI 実践活用術',
    price: 5000,
    maxParticipants: 30,
    currentParticipants: 8,
    isActive: true,
    isPublished: true
  },
  {
    id: '3',
    title: 'AIプロンプト エンジニアリング',
    price: 4000,
    maxParticipants: 25,
    currentParticipants: 18,
    isActive: true,
    isPublished: true
  }
]

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { seminarId } = body

    if (!seminarId) {
      return NextResponse.json({ error: 'Seminar ID is required' }, { status: 400 })
    }

    console.log('🔍 Creating payment intent for seminar:', seminarId)

    // セミナー情報を取得（モックデータから）
    const seminar = mockSeminars.find(s => s.id === seminarId)

    if (!seminar) {
      return NextResponse.json({ error: 'Seminar not found' }, { status: 404 })
    }

    if (!seminar.isActive || !seminar.isPublished) {
      return NextResponse.json({ error: 'Seminar is not available' }, { status: 400 })
    }

    // 定員チェック
    if (seminar.currentParticipants >= seminar.maxParticipants) {
      return NextResponse.json({ error: 'Seminar is full' }, { status: 400 })
    }

    const amount = seminar.price

    // モックユーザー情報
    const mockUser = {
      id: 'user_mock_' + userId,
      clerkId: userId,
      email: 'user@example.com',
      firstName: 'テスト',
      lastName: 'ユーザー',
      stripeCustomerId: null
    }

    // Stripe Customer作成（モック）
    const customer = await stripe!.customers.create({
      email: mockUser.email,
      name: `${mockUser.firstName || ''} ${mockUser.lastName || ''}`.trim(),
      metadata: {
        clerkId: userId,
        userId: mockUser.id
      }
    })

    // PaymentIntentを作成（モック）
    const paymentIntent = await stripe!.paymentIntents.create({
      amount: amount,
      currency: 'jpy',
      customer: customer.id,
      metadata: {
        userId,
        seminarId,
        type: 'seminar',
        amount: amount.toString()
      },
      description: `セミナー申し込み: ${seminar.title}`,
      receipt_email: mockUser.email
    })

    console.log('✅ Payment intent created:', paymentIntent.id)

    // メール送信をトリガー（バックグラウンド処理）
    try {
      const emailResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/email/seminar-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userId}` // 簡易認証
        },
        body: JSON.stringify({ seminarId })
      })
      
      if (emailResponse.ok) {
        console.log('📧 Seminar confirmation email triggered')
      } else {
        console.warn('⚠️ Failed to trigger confirmation email')
      }

      // リマインダーメールとフォローアップメールをスケジュール
      const schedulerResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/email-scheduler`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userId}` // 簡易認証
        },
        body: JSON.stringify({
          action: 'schedule-reminder',
          userEmail: mockUser.email,
          userName: mockUser.firstName + ' ' + mockUser.lastName,
          seminar: {
            id: seminar.id,
            title: seminar.title,
            instructor: 'テスト講師',
            startDate: '2025-07-15T19:00:00.000Z',
            endDate: '2025-07-15T20:30:00.000Z',
            zoomUrl: 'https://zoom.us/j/example',
            zoomId: '123-456-789',
            zoomPassword: 'test123'
          },
          reminderTime: 24 // 24時間前
        })
      })

      if (schedulerResponse.ok) {
        console.log('📅 Reminder email scheduled')
      }

      // フォローアップメールもスケジュール
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/email-scheduler`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userId}`
        },
        body: JSON.stringify({
          action: 'schedule-follow-up',
          userEmail: mockUser.email,
          userName: mockUser.firstName + ' ' + mockUser.lastName,
          seminar: {
            id: seminar.id,
            title: seminar.title,
            instructor: 'テスト講師',
            endDate: '2025-07-15T20:30:00.000Z'
          },
          delayHours: 2 // 2時間後
        })
      })

    } catch (emailError) {
      console.warn('⚠️ Email sending/scheduling failed:', emailError)
      // メール失敗でも決済は成功として扱う
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: paymentIntent.id,
      amount: amount,
      seminar: {
        id: seminar.id,
        title: seminar.title,
        price: seminar.price
      }
    })

  } catch (error) {
    console.error('💥 Error creating seminar payment intent:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}