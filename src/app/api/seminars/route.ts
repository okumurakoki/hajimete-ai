 import { NextResponse } from 'next/server'

  export async function GET() {
    try {
      // 一時的にモックデータを返す
      const seminars = [
        {
          id: '1',
          title: 'ChatGPT活用ワークショップ',
          description: '実際にChatGPTを使いながら業務効率化の方法を
  学ぶハンズオン形式のワークショップです。',
          date: '2024-06-25',
          startTime: '14:00',
          endTime: '16:00',
          capacity: 50,
          registeredCount: 35,
          isPremium: false,
          status: 'upcoming'
        },
        {
          id: '2',
          title: 'AI導入戦略セミナー（プレミアム限定）',
          description: 'プレミアム会員限定のAI導入戦略セミナー。企
  業でのAI活用方法を深く学びます。',
          date: '2024-07-02',
          startTime: '19:00',
          endTime: '21:00',
          capacity: 20,
          registeredCount: 12,
          isPremium: true,
          status: 'upcoming'
        }
      ]

      return NextResponse.json(seminars)
    } catch (error) {
      console.error('Error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch seminars' },
        { status: 500 }
      )
    }
  }
