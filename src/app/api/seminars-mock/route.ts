import { NextResponse } from 'next/server'

// 公開用モックセミナーデータ
const publicMockSeminars = [
  {
    id: '1',
    title: 'ChatGPT活用セミナー 基礎編',
    description: 'ChatGPTを使った効率的な業務改善方法を学びます。初心者の方でも安心してご参加いただけます。',
    instructor: '山田太郎',
    startDate: '2025-07-15T19:00:00.000Z',
    endDate: '2025-07-15T20:30:00.000Z',
    duration: 90,
    price: 3000,
    level: 'BEGINNER',
    category: 'AI基礎',
    maxParticipants: 50,
    currentParticipants: 12,
    tags: ['ChatGPT', 'AI', '基礎'],
    spotsLeft: 38
  },
  {
    id: '2',
    title: 'Notion AI 実践活用術',
    description: 'Notion AIを活用したドキュメント作成とデータ管理の効率化について実践的に学びます。',
    instructor: '佐藤花子',
    startDate: '2025-07-20T14:00:00.000Z',
    endDate: '2025-07-20T16:00:00.000Z',
    duration: 120,
    price: 5000,
    level: 'INTERMEDIATE',
    category: '生産性向上',
    maxParticipants: 30,
    currentParticipants: 8,
    tags: ['Notion', 'AI', '生産性'],
    spotsLeft: 22
  },
  {
    id: '3',
    title: 'AIプロンプト エンジニアリング',
    description: '効果的なAIプロンプトの書き方とテクニックを習得し、AIとの対話を最適化します。',
    instructor: '田中一郎',
    startDate: '2025-07-25T19:30:00.000Z',
    endDate: '2025-07-25T21:00:00.000Z',
    duration: 90,
    price: 4000,
    level: 'ADVANCED',
    category: 'AI開発',
    maxParticipants: 25,
    currentParticipants: 18,
    tags: ['プロンプト', 'AI', '上級'],
    spotsLeft: 7
  }
]

export async function GET() {
  try {
    console.log('🔍 GET /api/seminars-mock - Public mock seminars')
    
    // 公開中のセミナーのみを返す
    const publicSeminars = publicMockSeminars.filter(seminar => {
      const now = new Date()
      const startDate = new Date(seminar.startDate)
      return startDate > now // 未来のセミナーのみ
    })

    console.log(`📋 Returning ${publicSeminars.length} public mock seminars`)
    return NextResponse.json(publicSeminars)
    
  } catch (error) {
    console.error('Error fetching mock seminars:', error)
    return NextResponse.json(
      { error: 'Failed to fetch seminars' },
      { status: 500 }
    )
  }
}