import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Mock admin check - in production, verify against your user system
    const isAdmin = userId === 'admin_user_id'
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Mock comprehensive stats
    const mockStats = {
      overview: {
        totalUsers: 1247,
        activeUsers: 892,
        basicUsers: 634,
        premiumUsers: 258,
        totalVideos: 156,
        publishedVideos: 142,
        draftVideos: 14,
        totalSeminars: 89,
        upcomingSeminars: 12,
        completedSeminars: 77,
        liveStreams: 3,
        engagementRate: 78.5,
        totalWatchTime: 245678
      },
      recentActivity: {
        users: [
          {
            id: '1',
            clerkId: 'user_123',
            createdAt: '2024-01-18T10:30:00Z',
            profile: {
              firstName: '田中',
              lastName: '太郎'
            }
          },
          {
            id: '2',
            clerkId: 'user_456',
            createdAt: '2024-01-18T09:15:00Z',
            profile: {
              firstName: '佐藤',
              lastName: '花子'
            }
          }
        ],
        videos: [
          {
            id: '1',
            title: 'AI基礎概念とビジネス活用',
            createdAt: '2024-01-17T14:00:00Z',
            department: {
              name: 'AI基礎学部',
              colorPrimary: '#3B82F6'
            }
          },
          {
            id: '2',
            title: 'Excel自動化完全マスター',
            createdAt: '2024-01-16T11:30:00Z',
            department: {
              name: '業務効率化学部',
              colorPrimary: '#10B981'
            }
          }
        ]
      },
      departmentStats: [
        {
          id: '1',
          name: 'AI基礎学部',
          slug: 'ai-basics',
          colorPrimary: '#3B82F6',
          _count: { videos: 38 }
        },
        {
          id: '2',
          name: '業務効率化学部',
          slug: 'business-efficiency',
          colorPrimary: '#10B981',
          _count: { videos: 42 }
        },
        {
          id: '3',
          name: '実践応用学部',
          slug: 'practical-application',
          colorPrimary: '#8B5CF6',
          _count: { videos: 35 }
        },
        {
          id: '4',
          name: 'キャッチアップ学部',
          slug: 'catchup',
          colorPrimary: '#F59E0B',
          _count: { videos: 27 }
        }
      ],
      analytics: [
        { eventType: 'video_start', _count: { id: 1245 } },
        { eventType: 'video_complete', _count: { id: 892 } },
        { eventType: 'progress_update', _count: { id: 3456 } }
      ],
      topVideos: [
        {
          id: '1',
          title: 'ChatGPT実践活用術',
          viewCount: 2100,
          department: {
            name: '実践応用学部',
            colorPrimary: '#8B5CF6'
          },
          _count: {
            progress: 445,
            ratings: 67
          }
        },
        {
          id: '2',
          title: 'AI基礎概念とビジネス活用',
          viewCount: 1250,
          department: {
            name: 'AI基礎学部',
            colorPrimary: '#3B82F6'
          },
          _count: {
            progress: 320,
            ratings: 45
          }
        }
      ]
    }

    return NextResponse.json(mockStats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}