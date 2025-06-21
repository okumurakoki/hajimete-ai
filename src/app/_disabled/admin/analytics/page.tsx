'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminData } from '@/contexts/AdminDataContext'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Video, 
  Calendar, 
  DollarSign,
  Eye,
  Clock,
  Target,
  Download,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  PieChart,
  Activity,
  Star,
  Play,
  UserCheck
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface AnalyticsData {
  userMetrics: {
    totalUsers: number
    newUsers: number
    activeUsers: number
    premiumUsers: number
    churnRate: number
    userGrowthRate: number
  }
  contentMetrics: {
    totalVideos: number
    totalViews: number
    avgWatchTime: number
    completionRate: number
    topVideos: Array<{
      id: string
      title: string
      views: number
      rating: number
    }>
  }
  revenueMetrics: {
    totalRevenue: number
    monthlyRevenue: number
    avgRevenuePerUser: number
    conversionRate: number
    revenueGrowth: number
  }
  engagementMetrics: {
    dailyActiveUsers: number
    sessionDuration: number
    pageViews: number
    bounceRate: number
    retentionRate: number
  }
  seminarMetrics: {
    totalSeminars: number
    attendanceRate: number
    avgRating: number
    completedSeminars: number
    totalAttendees: number
  }
}

export default function AdminAnalytics() {
  const { data, loading: dataLoading, refreshData } = useAdminData()
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('users')

  // AdminDataContextのデータを分析形式に変換
  const analyticsData: AnalyticsData = {
    userMetrics: {
      totalUsers: data.users.total,
      newUsers: data.users.newThisMonth,
      activeUsers: data.users.active,
      premiumUsers: data.users.premium,
      churnRate: data.users.churnRate,
      userGrowthRate: data.users.growthRate
    },
    contentMetrics: {
      totalVideos: data.content.videos.total,
      totalViews: data.content.videos.totalViews,
      avgWatchTime: data.content.videos.avgWatchTime,
      completionRate: data.content.videos.completionRate,
      topVideos: [
        { id: '1', title: 'ChatGPT基礎講座', views: 12543, rating: 4.8 },
        { id: '2', title: 'AI プログラミング入門', views: 8654, rating: 4.6 },
        { id: '3', title: '機械学習アルゴリズム解説', views: 5432, rating: 4.9 },
        { id: '4', title: 'データサイエンス実践', views: 4321, rating: 4.5 },
        { id: '5', title: 'AI倫理とガバナンス', views: 3210, rating: 4.7 }
      ]
    },
    revenueMetrics: {
      totalRevenue: data.revenue.total,
      monthlyRevenue: data.revenue.monthly,
      avgRevenuePerUser: data.revenue.avgPerUser,
      conversionRate: data.revenue.conversionRate,
      revenueGrowth: data.revenue.growthRate
    },
    engagementMetrics: {
      dailyActiveUsers: data.users.dailyActive,
      sessionDuration: data.engagement.sessionDuration,
      pageViews: data.engagement.pageViews,
      bounceRate: data.engagement.bounceRate,
      retentionRate: data.engagement.retentionRate
    },
    seminarMetrics: {
      totalSeminars: data.content.seminars.total,
      attendanceRate: data.content.seminars.attendanceRate,
      avgRating: data.content.seminars.avgRating,
      completedSeminars: data.content.seminars.completed,
      totalAttendees: data.content.seminars.totalAttendees
    }
  }

  const loading = dataLoading

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString('ja-JP')}`
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('ja-JP')
  }

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`
  }

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp size={10} className="text-green-600" />
    if (value < 0) return <ArrowDown size={10} className="text-red-600" />
    return <Minus size={10} className="text-gray-600" />
  }

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-600'
    if (value < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  if (loading) {
    return (
      <AdminLayout currentPage="analytics">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <BarChart3 size={29} className="mx-auto text-gray-400 mb-4" />
            <div className="text-lg font-medium text-gray-600">分析データを読み込み中...</div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout currentPage="analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">統計・分析</h1>
            <p className="text-gray-600">プラットフォームの詳細な分析データとパフォーマンス指標</p>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">過去7日間</option>
              <option value="30d">過去30日間</option>
              <option value="90d">過去90日間</option>
              <option value="1y">過去1年</option>
            </select>
            <button 
              onClick={refreshData}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
              {loading ? '更新中...' : '更新'}
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <Download size={10} />
              エクスポート
            </button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総ユーザー数</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.userMetrics.totalUsers)}</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(analyticsData.userMetrics.userGrowthRate)}
                  <span className={`text-sm ml-1 ${getTrendColor(analyticsData.userMetrics.userGrowthRate)}`}>
                    {formatPercentage(analyticsData.userMetrics.userGrowthRate)}
                  </span>
                </div>
              </div>
              <Users size={14} className="text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">月間売上</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.revenueMetrics.monthlyRevenue)}</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(analyticsData.revenueMetrics.revenueGrowth)}
                  <span className={`text-sm ml-1 ${getTrendColor(analyticsData.revenueMetrics.revenueGrowth)}`}>
                    {formatPercentage(analyticsData.revenueMetrics.revenueGrowth)}
                  </span>
                </div>
              </div>
              <DollarSign size={14} className="text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総視聴数</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.contentMetrics.totalViews)}</p>
                <div className="flex items-center mt-1">
                  <Play size={14} className="text-orange-600" />
                  <span className="text-sm ml-1 text-gray-600">
                    {formatNumber(analyticsData.contentMetrics.totalVideos)}動画
                  </span>
                </div>
              </div>
              <Eye size={14} className="text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">視聴完了率</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(analyticsData.contentMetrics.completionRate)}</p>
                <div className="flex items-center mt-1">
                  <Clock size={14} className="text-purple-600" />
                  <span className="text-sm ml-1 text-gray-600">
                    平均{analyticsData.contentMetrics.avgWatchTime}分
                  </span>
                </div>
              </div>
              <Target size={14} className="text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">アクティブユーザー</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.userMetrics.activeUsers)}</p>
                <div className="flex items-center mt-1">
                  <Activity size={14} className="text-red-600" />
                  <span className="text-sm ml-1 text-gray-600">
                    {formatPercentage((analyticsData.userMetrics.activeUsers / analyticsData.userMetrics.totalUsers) * 100)}
                  </span>
                </div>
              </div>
              <UserCheck size={14} className="text-red-600" />
            </div>
          </div>
        </div>

        {/* Detailed Analytics Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Analytics */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={12} />
              ユーザー分析
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">新規ユーザー</span>
                <span className="text-lg font-bold text-blue-600">{formatNumber(analyticsData.userMetrics.newUsers)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">プレミアムユーザー</span>
                <span className="text-lg font-bold text-purple-600">{formatNumber(analyticsData.userMetrics.premiumUsers)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">解約率</span>
                <span className="text-lg font-bold text-red-600">{formatPercentage(analyticsData.userMetrics.churnRate)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">成長率</span>
                <div className="flex items-center">
                  {getTrendIcon(analyticsData.userMetrics.userGrowthRate)}
                  <span className={`text-lg font-bold ml-1 ${getTrendColor(analyticsData.userMetrics.userGrowthRate)}`}>
                    {formatPercentage(analyticsData.userMetrics.userGrowthRate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Analytics */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={12} />
              売上分析
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">総売上</span>
                <span className="text-lg font-bold text-green-600">{formatCurrency(analyticsData.revenueMetrics.totalRevenue)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">ユーザー単価</span>
                <span className="text-lg font-bold text-blue-600">{formatCurrency(analyticsData.revenueMetrics.avgRevenuePerUser)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">コンバージョン率</span>
                <span className="text-lg font-bold text-purple-600">{formatPercentage(analyticsData.revenueMetrics.conversionRate)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">売上成長率</span>
                <div className="flex items-center">
                  {getTrendIcon(analyticsData.revenueMetrics.revenueGrowth)}
                  <span className={`text-lg font-bold ml-1 ${getTrendColor(analyticsData.revenueMetrics.revenueGrowth)}`}>
                    {formatPercentage(analyticsData.revenueMetrics.revenueGrowth)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Performance */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Video size={12} />
              コンテンツ分析
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">平均視聴時間</span>
                <span className="text-lg font-bold text-orange-600">{analyticsData.contentMetrics.avgWatchTime}分</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">視聴完了率</span>
                <span className="text-lg font-bold text-green-600">{formatPercentage(analyticsData.contentMetrics.completionRate)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">総視聴数</span>
                <span className="text-lg font-bold text-blue-600">{formatNumber(analyticsData.contentMetrics.totalViews)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">動画数</span>
                <span className="text-lg font-bold text-purple-600">{formatNumber(analyticsData.contentMetrics.totalVideos)}</span>
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity size={12} />
              エンゲージメント分析
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">日次アクティブユーザー</span>
                <span className="text-lg font-bold text-blue-600">{formatNumber(analyticsData.engagementMetrics.dailyActiveUsers)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">セッション時間</span>
                <span className="text-lg font-bold text-green-600">{analyticsData.engagementMetrics.sessionDuration}分</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">ページビュー</span>
                <span className="text-lg font-bold text-orange-600">{formatNumber(analyticsData.engagementMetrics.pageViews)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">継続率</span>
                <span className="text-lg font-bold text-purple-600">{formatPercentage(analyticsData.engagementMetrics.retentionRate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={12} />
            人気コンテンツランキング
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    順位
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    動画タイトル
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    視聴数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    評価
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.contentMetrics.topVideos.map((video, index) => (
                  <tr key={video.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-orange-600' : 'bg-blue-600'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{video.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatNumber(video.views)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star size={10} className="text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-900">{video.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Seminar Analytics */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={12} />
            セミナー分析
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{formatNumber(analyticsData.seminarMetrics.totalSeminars)}</div>
              <div className="text-sm text-gray-600">総セミナー数</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{formatPercentage(analyticsData.seminarMetrics.attendanceRate)}</div>
              <div className="text-sm text-gray-600">出席率</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{analyticsData.seminarMetrics.avgRating}</div>
              <div className="text-sm text-gray-600">平均評価</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{formatNumber(analyticsData.seminarMetrics.completedSeminars)}</div>
              <div className="text-sm text-gray-600">完了セミナー</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{formatNumber(analyticsData.seminarMetrics.totalAttendees)}</div>
              <div className="text-sm text-gray-600">総参加者数</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}