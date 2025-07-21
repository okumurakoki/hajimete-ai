import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

// モックセミナー登録データ
const mockRegistration = {
  id: 'reg_mock_' + Date.now(),
  course: {
    id: '1',
    title: 'ChatGPT活用セミナー 基礎編',
    description: 'ChatGPTを使った効率的な業務改善方法を学びます。初心者の方でも安心してご参加いただけます。',
    instructor: '山田太郎',
    startDate: '2025-07-15T19:00:00.000Z',
    endDate: '2025-07-15T20:30:00.000Z',
    zoomUrl: 'https://zoom.us/j/example-mock',
    zoomId: '123-456-789',
    zoomPassword: 'ai2025'
  },
  payment: {
    id: 'pay_mock_' + Date.now(),
    amount: 3000,
    receiptUrl: null
  },
  status: 'CONFIRMED'
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔍 GET /api/registrations/seminar-mock - Mock seminar registration')
    
    // URLパラメータから payment_intent を取得
    const searchParams = req.nextUrl.searchParams
    const paymentIntent = searchParams.get('payment_intent')
    
    if (paymentIntent) {
      console.log('📋 Returning mock registration for payment intent:', paymentIntent)
      // payment_intent がある場合は1件のみ返す
      return NextResponse.json([mockRegistration])
    }
    
    // payment_intent がない場合も同じデータを返す（最新の登録として）
    console.log('📋 Returning latest mock registration')
    return NextResponse.json([mockRegistration])
    
  } catch (error) {
    console.error('Error fetching mock seminar registration:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registration' },
      { status: 500 }
    )
  }
}