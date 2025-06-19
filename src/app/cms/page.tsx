'use client'

import CMSLayout from '@/components/cms/CMSLayout'
import { useState, useEffect } from 'react'
import { 
  Video, 
  Calendar, 
  Users, 
  BarChart3, 
  TrendingUp, 
  Eye,
  Clock,
  PlayCircle
} from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function CMSDashboard() {
  const [stats, setStats] = useState({
    videos: { total: 0, published: 0, drafts: 0, views: 0 },
    seminars: { total: 0, scheduled: 0, live: 0, registrations: 0 },
    users: { total: 0, active: 0, premium: 0, newThisMonth: 0 },
    analytics: { totalViews: 0, totalWatchTime: 0, completionRate: 0, revenue: 0 }
  })

  const [recentActivity, setRecentActivity] = useState([
    {
      id: '1',
      type: 'video_upload',
      title: '新しい動画「ChatGPT基礎講座」がアップロードされました',
      timestamp: new Date(),
      user: '田中AI博士'
    },
    {
      id: '2',
      type: 'seminar_created',
      title: 'セミナー「AI開発者向け技術セッション」が作成されました',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      user: '山田ML研究員'
    },
    {
      id: '3',
      type: 'user_registered',
      title: '新しいユーザーがプレミアムプランに登録しました',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      user: 'システム'
    }
  ])

  const [quickActions] = useState([
    {
      title: '動画アップロード',
      description: 'Vimeoに新しい動画をアップロード',
      href: '/cms/upload',
      icon: Video,
      color: 'bg-blue-500'
    },
    {
      title: 'セミナー作成',
      description: 'Zoomセミナーを新規作成',
      href: '/cms/seminars',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      title: 'ユーザー管理',
      description: 'ユーザーアカウントを管理',
      href: '/cms/users',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: '分析レポート',
      description: '詳細な統計とレポートを確認',
      href: '/cms/analytics',
      icon: BarChart3,
      color: 'bg-orange-500'
    }
  ])

  // モック統計データの生成
  useEffect(() => {
    setStats({
      videos: { total: 156, published: 134, drafts: 22, views: 45670 },
      seminars: { total: 28, scheduled: 12, live: 2, registrations: 892 },
      users: { total: 2847, active: 1923, premium: 456, newThisMonth: 127 },
      analytics: { totalViews: 45670, totalWatchTime: 8934, completionRate: 73.2, revenue: 1245000 }
    })
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'video_upload': return <Video size={10} className="text-blue-600" />
      case 'seminar_created': return <Calendar size={10} className="text-green-600" />
      case 'user_registered': return <Users size={10} className="text-purple-600" />
      default: return <BarChart3 size={10} className="text-gray-600" />
    }
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('ja-JP')
  }

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString('ja-JP')}`
  }

  return (
    <CMSLayout currentPage="dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">はじめて.AI CMS管理画面へようこそ</h1>
          <p className="text-blue-100">
            動画コンテンツ、セミナー、ユーザーを一元管理できます
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Videos */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">動画コンテンツ</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.videos.total)}</p>
                <p className="text-sm text-green-600 mt-1">
                  公開中: {stats.videos.published}件
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Video size={14} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <Eye size={10} className="mr-1" />
                総視聴: {formatNumber(stats.videos.views)}回
              </div>
            </div>
          </div>

          {/* Seminars */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">セミナー</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.seminars.total)}</p>
                <p className="text-sm text-green-600 mt-1">
                  予定: {stats.seminars.scheduled}件
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar size={14} className="text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <Users size={10} className="mr-1" />
                参加登録: {formatNumber(stats.seminars.registrations)}人
              </div>
            </div>
          </div>

          {/* Users */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ユーザー</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.users.total)}</p>
                <p className="text-sm text-green-600 mt-1">
                  アクティブ: {stats.users.active}人
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users size={14} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp size={10} className="mr-1" />
                今月の新規: {stats.users.newThisMonth}人
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">月間売上</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.analytics.revenue)}</p>
                <p className="text-sm text-green-600 mt-1">
                  完了率: {stats.analytics.completionRate}%
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <BarChart3 size={14} className="text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={10} className="mr-1" />
                総学習時間: {formatNumber(stats.analytics.totalWatchTime)}時間
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">クイックアクション</h2>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group hover:border-blue-300"
                >
                  <div className={`p-2 ${action.color} rounded-lg mr-4 group-hover:scale-105 transition-transform`}>
                    <action.icon size={12} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Additional Quick Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/admin/login"
                  className="flex items-center justify-center p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-purple-700 font-medium"
                >
                  🔐 管理者ログイン
                </Link>
                <Link
                  href="/cms/api-settings"
                  className="flex items-center justify-center p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-green-700 font-medium"
                >
                  ⚙️ API設定
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">最近のアクティビティ</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{activity.user}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {activity.timestamp.toLocaleString('ja-JP', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                href="/cms/activity"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                すべてのアクティビティを表示 →
              </Link>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">システム状態</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-green-900">Vimeo API</p>
                <p className="text-sm text-green-700">正常動作中</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-green-900">Zoom API</p>
                <p className="text-sm text-green-700">正常動作中</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-yellow-900">データベース</p>
                <p className="text-sm text-yellow-700">軽微な遅延</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CMSLayout>
  )
}