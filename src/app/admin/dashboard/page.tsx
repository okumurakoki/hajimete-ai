'use client'

import { useState, useEffect } from 'react'

// Disable static generation for admin pages
export const dynamic = 'force-dynamic'
import AdminLayout from '@/components/AdminLayout'
import { 
  formatCurrency, 
  formatNumber, 
  formatDurationFromMinutes 
} from '@/lib/admin'

interface AdminStats {
  overview: {
    totalUsers: number
    activeUsers: number
    basicUsers: number
    premiumUsers: number
    totalVideos: number
    publishedVideos: number
    draftVideos: number
    totalSeminars: number
    upcomingSeminars: number
    completedSeminars: number
    liveStreams: number
    engagementRate: number
    totalWatchTime: number
  }
  recentActivity: {
    users: Array<{
      id: string
      email: string
      createdAt: string
      profile?: {
        firstName?: string
        lastName?: string
      }
    }>
    videos: Array<{
      id: string
      title: string
      status: string
      createdAt: string
      department: {
        name: string
        colorPrimary: string
      }
    }>
  }
  departmentStats: Array<{
    id: string
    name: string
    colorPrimary: string
    _count: {
      videos: number
    }
  }>
  topVideos: Array<{
    id: string
    title: string
    viewCount: number
    averageRating: number
    department: {
      name: string
      colorPrimary: string
    }
    _count: {
      progress: number
      ratings: number
    }
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Real API call to get admin stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          console.error('Failed to fetch admin stats')
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <div className="text-lg font-medium text-gray-600">データを読み込み中...</div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <div className="text-lg font-medium text-gray-600">データの読み込みに失敗しました</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
            <p className="text-gray-600">プラットフォームの全体統計とパフォーマンス</p>
          </div>
          <div className="text-sm text-gray-500">
            最終更新: {new Date().toLocaleString('ja-JP')}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総ユーザー数</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.overview.totalUsers)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+{stats.overview.activeUsers}</span>
              <span className="text-gray-600 ml-1">アクティブユーザー</span>
            </div>
          </div>

          {/* Engagement */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">エンゲージメント率</p>
                <p className="text-3xl font-bold text-gray-900">{stats.overview.engagementRate.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">総視聴時間: </span>
              <span className="text-gray-900 font-medium ml-1">
                {formatDurationFromMinutes(Math.floor(stats.overview.totalWatchTime / 60))}
              </span>
            </div>
          </div>

          {/* Videos */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">動画コンテンツ</p>
                <p className="text-3xl font-bold text-gray-900">{stats.overview.publishedVideos}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎬</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">下書き: </span>
              <span className="text-gray-900 font-medium ml-1">{stats.overview.draftVideos}</span>
            </div>
          </div>

          {/* Seminars */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">セミナー</p>
                <p className="text-3xl font-bold text-gray-900">{stats.overview.upcomingSeminars}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">完了済み: </span>
              <span className="text-gray-900 font-medium ml-1">{stats.overview.completedSeminars}</span>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Breakdown */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ユーザー内訳</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">ベーシックプラン</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{formatNumber(stats.overview.basicUsers)}</div>
                  <div className="text-xs text-gray-500">
                    {Math.round((stats.overview.basicUsers / stats.overview.totalUsers) * 100)}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">プレミアムプラン</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{formatNumber(stats.overview.premiumUsers)}</div>
                  <div className="text-xs text-gray-500">
                    {Math.round((stats.overview.premiumUsers / stats.overview.totalUsers) * 100)}%
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">アクティブユーザー</span>
                  <span className="text-lg font-bold text-green-600">{stats.overview.activeUsers}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Stats */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">コンテンツ統計</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">公開済み動画</span>
                <span className="text-lg font-bold text-gray-900">{stats.overview.publishedVideos}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">下書き動画</span>
                <span className="text-lg font-bold text-gray-600">{stats.overview.draftVideos}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">ライブ配信</span>
                <span className="text-lg font-bold text-gray-900">{stats.overview.liveStreams}</span>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">完了済みセミナー</span>
                  <span className="text-lg font-bold text-gray-900">{stats.overview.completedSeminars}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近の活動</h3>
          <div className="space-y-4">
            {stats.recentActivity.users.slice(0, 2).map((user, index) => (
              <div key={user.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">新規ユーザー登録</p>
                  <p className="text-xs text-gray-500">
                    {user.profile?.firstName && user.profile?.lastName 
                      ? `${user.profile.firstName} ${user.profile.lastName}さんが登録`
                      : `${user.email}が登録`
                    }
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                </div>
              </div>
            ))}

            {stats.recentActivity.videos.slice(0, 2).map((video, index) => (
              <div key={video.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">🎬</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {video.status === 'published' ? '新しい動画公開' : '動画作成'}
                  </p>
                  <p className="text-xs text-gray-500">「{video.title}」({video.department.name})</p>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(video.createdAt).toLocaleDateString('ja-JP')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">クイックアクション</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm">🎬</span>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">新しい動画</div>
                <div className="text-xs text-gray-500">動画をアップロード</div>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-sm">📅</span>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">セミナー作成</div>
                <div className="text-xs text-gray-500">新しいセミナー</div>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm">👥</span>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">ユーザー管理</div>
                <div className="text-xs text-gray-500">ユーザー一覧</div>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-sm">📊</span>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">詳細分析</div>
                <div className="text-xs text-gray-500">レポート表示</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}