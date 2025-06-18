'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { 
  AdminStats, 
  generateMockAdminStats, 
  formatCurrency, 
  formatNumber, 
  formatDurationFromMinutes 
} from '@/lib/admin'

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // モックデータの読み込み
    setTimeout(() => {
      setStats(generateMockAdminStats())
      setLoading(false)
    }, 1000)
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
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.users.total)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+{stats.users.newThisMonth}</span>
              <span className="text-gray-600 ml-1">今月の新規</span>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">今月の売上</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.revenue.thisMonth)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`font-medium ${stats.revenue.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.revenue.growth > 0 ? '+' : ''}{stats.revenue.growth}%
              </span>
              <span className="text-gray-600 ml-1">前月比</span>
            </div>
          </div>

          {/* Videos */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">動画コンテンツ</p>
                <p className="text-3xl font-bold text-gray-900">{stats.videos.published}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎬</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">総再生時間: </span>
              <span className="text-gray-900 font-medium ml-1">
                {formatDurationFromMinutes(stats.videos.totalDuration)}
              </span>
            </div>
          </div>

          {/* Seminars */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">セミナー</p>
                <p className="text-3xl font-bold text-gray-900">{stats.seminars.upcoming}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">評価: </span>
              <span className="text-yellow-600 font-medium ml-1">
                ⭐ {stats.seminars.averageRating}
              </span>
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
                  <div className="text-lg font-bold text-gray-900">{formatNumber(stats.users.basic)}</div>
                  <div className="text-xs text-gray-500">
                    {Math.round((stats.users.basic / stats.users.total) * 100)}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">プレミアムプラン</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{formatNumber(stats.users.premium)}</div>
                  <div className="text-xs text-gray-500">
                    {Math.round((stats.users.premium / stats.users.total) * 100)}%
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">今日のアクティブユーザー</span>
                  <span className="text-lg font-bold text-green-600">{stats.users.activeToday}</span>
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
                <span className="text-lg font-bold text-gray-900">{stats.videos.published}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">下書き動画</span>
                <span className="text-lg font-bold text-gray-600">{stats.videos.draft}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">総再生回数</span>
                <span className="text-lg font-bold text-gray-900">{formatNumber(stats.videos.totalViews)}</span>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">完了済みセミナー</span>
                  <span className="text-lg font-bold text-gray-900">{stats.seminars.completed}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近の活動</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">新規ユーザー登録</p>
                <p className="text-xs text-gray-500">田中太郎さんがプレミアムプランに登録</p>
              </div>
              <div className="text-xs text-gray-500">2分前</div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm">🎬</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">新しい動画公開</p>
                <p className="text-xs text-gray-500">「AI戦略入門」が公開されました</p>
              </div>
              <div className="text-xs text-gray-500">1時間前</div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-sm">📅</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">セミナー開催</p>
                <p className="text-xs text-gray-500">「ChatGPT活用講座」が開始されました</p>
              </div>
              <div className="text-xs text-gray-500">3時間前</div>
            </div>
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