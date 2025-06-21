 import { NextResponse } from 'next/server'

  export async function GET() {
    try {
      // 一時的にモックデータを返す
      const departments = [
        {
          id: '1',
          name: 'AI基礎学部',
          slug: 'ai-basics',
          description: 'AIの基本概念から実践的な活用方法まで学ぶ',
          colorPrimary: '#3B82F6',
          colorSecondary: '#93C5FD',
          icon: '🤖',
          accessLevel: 'basic',
          sortOrder: 1
        },
        {
          id: '2',
          name: '業務効率化学部',
          slug: 'productivity',
          description:
  '日常業務にAIを活用して生産性を向上させる方法',
          colorPrimary: '#10B981',
          colorSecondary: '#6EE7B7',
          icon: '⚡',
          accessLevel: 'basic',
          sortOrder: 2
        },
        {
          id: '3',
          name: '実践応用学部',
          slug: 'practical-application',
          description: '実際のビジネス現場でのAI活用事例と実践',
          colorPrimary: '#F97316',
          colorSecondary: '#FB923C',
          icon: '🚀',
          accessLevel: 'basic',
          sortOrder: 3
        },
        {
          id: '4',
          name: 'キャッチアップ学部',
          slug: 'catchup',
          description:
  '最新のAI技術とトレンドを学ぶプレミアム講座',
          colorPrimary: '#8B5CF6',
          colorSecondary: '#A78BFA',
          icon: '⭐',
          accessLevel: 'premium',
          sortOrder: 4
        }
      ]

      return NextResponse.json(departments)
    } catch (error) {
      console.error('Error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch departments' },
        { status: 500 }
      )
    }
  }
