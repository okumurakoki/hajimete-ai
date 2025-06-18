import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const includeVideos = searchParams.get('includeVideos') === 'true'

    // Mock departments data
    const departments = [
      {
        id: '1',
        name: 'AI基礎学部',
        slug: 'ai-basics',
        description: 'AIの基本概念から実践的な活用方法まで学ぶ',
        colorPrimary: '#3B82F6',
        colorSecondary: '#DBEAFE',
        icon: '🤖',
        isActive: true,
        sortOrder: 1,
        accessLevel: 'basic',
        _count: { videos: 38 },
        ...(includeVideos && {
          videos: [
            {
              id: '1',
              title: 'AI基礎概念とビジネス活用',
              viewCount: 1250,
              instructor: {
                name: '田中AI博士',
                avatarUrl: 'https://example.com/avatar1.jpg'
              },
              _count: {
                progress: 320,
                ratings: 45
              }
            }
          ]
        })
      },
      {
        id: '2',
        name: '業務効率化学部',
        slug: 'business-efficiency',
        description: 'Excel、スプレッドシート、自動化ツールで業務効率化',
        colorPrimary: '#10B981',
        colorSecondary: '#D1FAE5',
        icon: '⚙️',
        isActive: true,
        sortOrder: 2,
        accessLevel: 'basic',
        _count: { videos: 42 },
        ...(includeVideos && {
          videos: [
            {
              id: '2',
              title: 'Excel自動化完全マスター',
              viewCount: 890,
              instructor: {
                name: '佐藤エクセル先生',
                avatarUrl: 'https://example.com/avatar2.jpg'
              },
              _count: {
                progress: 156,
                ratings: 32
              }
            }
          ]
        })
      },
      {
        id: '3',
        name: '実践応用学部',
        slug: 'practical-application',
        description: '実際のビジネス課題解決とケーススタディ',
        colorPrimary: '#8B5CF6',
        colorSecondary: '#EDE9FE',
        icon: '💼',
        isActive: true,
        sortOrder: 3,
        accessLevel: 'premium',
        _count: { videos: 35 },
        ...(includeVideos && {
          videos: [
            {
              id: '3',
              title: 'ChatGPT実践活用術',
              viewCount: 2100,
              instructor: {
                name: '山田GPT専門家',
                avatarUrl: 'https://example.com/avatar3.jpg'
              },
              _count: {
                progress: 445,
                ratings: 67
              }
            }
          ]
        })
      },
      {
        id: '4',
        name: 'キャッチアップ学部',
        slug: 'catchup',
        description: '最新技術トレンドと業界動向をキャッチアップ',
        colorPrimary: '#F59E0B',
        colorSecondary: '#FEF3C7',
        icon: '🚀',
        isActive: true,
        sortOrder: 4,
        accessLevel: 'premium',
        _count: { videos: 27 },
        ...(includeVideos && {
          videos: [
            {
              id: '4',
              title: '最新AI技術動向2024',
              viewCount: 680,
              instructor: {
                name: '高橋トレンド研究家',
                avatarUrl: 'https://example.com/avatar4.jpg'
              },
              _count: {
                progress: 89,
                ratings: 28
              }
            }
          ]
        })
      }
    ]

    return NextResponse.json({ departments })
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // This would require admin authentication
    // For now, returning method not allowed
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  } catch (error) {
    console.error('Error creating department:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}