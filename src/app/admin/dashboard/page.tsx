'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import AnalyticsChart from '@/components/admin/AnalyticsChart'
import { useAdminData } from '@/contexts/AdminDataContext'
import Link from 'next/link'
import { 
  Users, 
  Video, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Play,
  UserCheck,
  Eye,
  Clock,
  ArrowUpRight,
  BarChart3,
  RefreshCw
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AdminDashboard() {
  const { data, loading, lastUpdated, refreshData } = useAdminData()

  const [recentActivity, setRecentActivity] = useState([
    {
      id: '1',
      type: 'user_registered',
      message: '新規ユーザーが登録しました',
      user: '田中太郎',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      icon: UserCheck,
      color: 'text-green-600'
    },
    {
      id: '2',
      type: 'video_uploaded',
      message: '新しい動画がアップロードされました',
      user: '管理者',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      icon: Video,
      color: 'text-blue-600'
    },
    {
      id: '3',
      type: 'seminar_created',
      message: 'セミナーが作成されました',
      user: '講師A',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      icon: Calendar,
      color: 'text-purple-600'
    }
  ])

  // データコンテキストから直接データを取得

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString('ja-JP')}`
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('ja-JP')
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'たった今'
    if (diffInMinutes < 60) return `${diffInMinutes}分前`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}時間前`
    return `${Math.floor(diffInMinutes / 1440)}日前`
  }

  return (
    <AdminLayout currentPage="dashboard">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">管理者ダッシュボードへようこそ</h1>
              <p className="text-blue-100">
                はじめて.AI プラットフォームの運営状況を確認・管理できます
              </p>
              <p className="text-blue-200 text-sm mt-2">
                最終更新: {lastUpdated.toLocaleString('ja-JP')}
              </p>
            </div>
            <button
              onClick={refreshData}
              disabled={loading}
              className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
              {loading ? '更新中...' : 'データ更新'}
            </button>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Users */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総ユーザー数</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(data.users.total)}</p>
                <p className="text-sm text-green-600 mt-1">
                  アクティブ: {formatNumber(data.users.active)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users size={14} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp size={10} className="mr-1" />
                プレミアム: {formatNumber(data.users.premium)}人
              </div>
            </div>
          </div>

          {/* Videos */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">動画コンテンツ</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(data.content.videos.total)}</p>
                <p className="text-sm text-green-600 mt-1">
                  公開中: {data.content.videos.published}件
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Video size={14} className="text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <Eye size={10} className="mr-1" />
                総視聴: {formatNumber(data.content.videos.totalViews)}回
              </div>
            </div>
          </div>

          {/* Seminars */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">セミナー</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(data.content.seminars.total)}</p>
                <p className="text-sm text-red-600 mt-1">
                  配信中: {data.content.seminars.upcoming}件
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar size={14} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={10} className="mr-1" />
                今月開催予定
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">月間売上</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(data.revenue.monthly)}</p>
                <p className="text-sm text-green-600 mt-1">
                  前月比 +{data.revenue.growthRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <DollarSign size={14} className="text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <BarChart3 size={10} className="mr-1" />
                累計: {formatCurrency(data.revenue.total)}
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsChart
            title="ユーザー登録推移"
            type="line"
            data={[
              { date: '2024-01-01', value: 120 },
              { date: '2024-01-02', value: 135 },
              { date: '2024-01-03', value: 142 },
              { date: '2024-01-04', value: 158 },
              { date: '2024-01-05', value: 171 },
              { date: '2024-01-06', value: 189 },
              { date: '2024-01-07', value: 205 },
              { date: '2024-01-08', value: 220 },
              { date: '2024-01-09', value: 238 },
              { date: '2024-01-10', value: 255 },
              { date: '2024-01-11', value: 272 },
              { date: '2024-01-12', value: 290 },
              { date: '2024-01-13', value: 315 },
              { date: '2024-01-14', value: 332 }
            ]}
            height={300}
            color="blue"
          />
          
          <AnalyticsChart
            title="プラン別ユーザー分布"
            type="pie"
            data={[
              { label: 'フリー', value: data.users.total - data.users.premium - (data.users.total * 0.3), color: '#E5E7EB' },
              { label: 'ベーシック', value: Math.floor(data.users.total * 0.3), color: '#3B82F6' },
              { label: 'プレミアム', value: data.users.premium, color: '#8B5CF6' }
            ]}
            height={300}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnalyticsChart
            title="月間アクティブユーザー"
            type="metric"
            data={[]}
            metric={{
              value: formatNumber(data.users.active),
              change: 12.5,
              trend: 'up',
              description: '前月比で12.5%増加'
            }}
            height={200}
          />
          
          <AnalyticsChart
            title="動画視聴時間（今月）"
            type="metric"
            data={[]}
            metric={{
              value: '1,247時間',
              change: 8.3,
              trend: 'up',
              description: '平均視聴時間が向上'
            }}
            height={200}
          />
          
          <AnalyticsChart
            title="セミナー参加率"
            type="metric"
            data={[]}
            metric={{
              value: '85.6%',
              change: -2.1,
              trend: 'down',
              description: '平均参加率'
            }}
            height={200}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsChart
            title="学部別人気度"
            type="bar"
            data={[
              { label: 'AI基礎', value: 245 },
              { label: '実践活用', value: 189 },
              { label: 'ビジネス応用', value: 156 },
              { label: 'エンジニアリング', value: 134 },
              { label: 'マーケティング', value: 98 },
              { label: 'データサイエンス', value: 87 }
            ]}
            height={300}
            color="green"
          />
          
          <AnalyticsChart
            title="売上推移（過去7日間）"
            type="line"
            data={[
              { date: '2024-01-08', value: 45000 },
              { date: '2024-01-09', value: 52000 },
              { date: '2024-01-10', value: 48000 },
              { date: '2024-01-11', value: 61000 },
              { date: '2024-01-12', value: 55000 },
              { date: '2024-01-13', value: 72000 },
              { date: '2024-01-14', value: 68000 }
            ]}
            height={300}
            color="orange"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">視聴完了率</h3>
              <Play size={12} className="text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{data.content.videos.completionRate}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${data.content.videos.completionRate}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">平均視聴時間</h3>
              <Clock size={12} className="text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">{data.content.videos.avgWatchTime}分</div>
            <div className="text-sm text-gray-600">セッション時間: {data.engagement.sessionDuration}分</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">システム状態</h3>
              <Activity size={12} className="text-green-600" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">全システム正常</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">API接続良好</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">クイックアクション</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/admin/videos"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group"
              >
                <Video size={12} className="text-blue-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">動画管理</div>
                  <div className="text-sm text-gray-500">コンテンツ編集</div>
                </div>
              </Link>

              <Link
                href="/admin/seminars"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors group"
              >
                <Calendar size={12} className="text-green-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-green-600">セミナー管理</div>
                  <div className="text-sm text-gray-500">配信・予約管理</div>
                </div>
              </Link>

              <Link
                href="/admin/users"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors group"
              >
                <Users size={12} className="text-purple-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-purple-600">ユーザー管理</div>
                  <div className="text-sm text-gray-500">アカウント管理</div>
                </div>
              </Link>

              <Link
                href="/admin/analytics"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors group"
              >
                <BarChart3 size={12} className="text-orange-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-orange-600">分析・統計</div>
                  <div className="text-sm text-gray-500">詳細レポート</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">最近のアクティビティ</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <Icon size={10} className={activity.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{activity.user}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {getTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                href="/admin/activity"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                すべてのアクティビティを表示
                <ArrowUpRight size={10} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}