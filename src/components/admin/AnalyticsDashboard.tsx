'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  totalViews: number
  totalRevenue: number
  conversionRate: number
  churnRate: number
  departmentStats: {
    name: string
    users: number
    views: number
    completion: number
  }[]
  revenueData: {
    month: string
    basic: number
    premium: number
  }[]
  topVideos: {
    id: string
    title: string
    views: number
    likes: number
    completion: number
  }[]
  userGrowth: {
    date: string
    newUsers: number
    totalUsers: number
  }[]
}

export default function AnalyticsDashboard() {
  const { isAdmin } = useAuth()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState('30d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // モック分析データを生成
    const mockData: AnalyticsData = {
      totalUsers: 12847,
      activeUsers: 8932,
      totalViews: 156780,
      totalRevenue: 18650000,
      conversionRate: 24.5,
      churnRate: 3.2,
      departmentStats: [
        { name: 'AI基礎学部', users: 4520, views: 67840, completion: 78.5 },
        { name: '業務効率化学部', users: 3890, views: 45290, completion: 82.1 },
        { name: '実践応用学部', users: 2780, views: 28450, completion: 71.8 },
        { name: 'AI開発学部', users: 1657, views: 15200, completion: 65.3 }
      ],
      revenueData: [
        { month: '1月', basic: 2400000, premium: 4800000 },
        { month: '2月', basic: 2650000, premium: 5200000 },
        { month: '3月', basic: 2890000, premium: 5950000 },
        { month: '4月', basic: 3120000, premium: 6480000 },
        { month: '5月', basic: 3350000, premium: 7120000 },
        { month: '6月', basic: 3580000, premium: 7850000 }
      ],
      topVideos: [
        { id: '1', title: 'ChatGPT基礎講座', views: 15780, likes: 892, completion: 85.3 },
        { id: '2', title: 'Excel VBA自動化', views: 12450, likes: 734, completion: 79.8 },
        { id: '3', title: 'Python機械学習入門', views: 9870, likes: 612, completion: 73.2 },
        { id: '4', title: 'ビジネスAI活用法', views: 8940, likes: 567, completion: 81.1 },
        { id: '5', title: 'データ分析実践', views: 7650, likes: 445, completion: 76.4 }
      ],
      userGrowth: [
        { date: '2024-01-01', newUsers: 245, totalUsers: 8500 },
        { date: '2024-02-01', newUsers: 389, totalUsers: 8889 },
        { date: '2024-03-01', newUsers: 456, totalUsers: 9345 },
        { date: '2024-04-01', newUsers: 523, totalUsers: 9868 },
        { date: '2024-05-01', newUsers: 678, totalUsers: 10546 },
        { date: '2024-06-01', newUsers: 834, totalUsers: 11380 },
        { date: '2024-07-01', newUsers: 967, totalUsers: 12347 }
      ]
    }

    setTimeout(() => {
      setAnalyticsData(mockData)
      setLoading(false)
    }, 1000)
  }, [timeRange])

  if (!isAdmin) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">アクセス拒否</h2>
        <p className="text-gray-600 mt-2">管理者権限が必要です</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">分析データを読み込み中...</p>
      </div>
    )
  }

  if (!analyticsData) return null

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">分析ダッシュボード</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="7d">過去7日</option>
          <option value="30d">過去30日</option>
          <option value="90d">過去90日</option>
          <option value="1y">過去1年</option>
        </select>
      </div>

      {/* KPI カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">総ユーザー数</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600">+12.5% 前月比</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">アクティブユーザー</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.activeUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600">+8.3% 前月比</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">👁️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">総視聴回数</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalViews.toLocaleString()}</p>
              <p className="text-sm text-green-600">+15.7% 前月比</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">月間売上</p>
              <p className="text-2xl font-bold text-gray-900">¥{(analyticsData.totalRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-green-600">+22.1% 前月比</p>
            </div>
          </div>
        </div>
      </div>

      {/* チャートエリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 売上推移 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">月間売上推移</h3>
          <div className="space-y-2">
            {analyticsData.revenueData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{data.month}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(data.basic / 4000000) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${(data.premium / 8000000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">¥{((data.basic + data.premium) / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">ベーシック</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">プレミアム</span>
            </div>
          </div>
        </div>

        {/* 学部別統計 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">学部別利用状況</h3>
          <div className="space-y-4">
            {analyticsData.departmentStats.map((dept, index) => (
              <div key={index} className="border-b border-gray-100 pb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{dept.name}</span>
                  <span className="text-sm text-gray-600">{dept.users.toLocaleString()} ユーザー</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>👁️ {dept.views.toLocaleString()} 視聴</span>
                  <span>✅ {dept.completion}% 完了率</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${dept.completion}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 人気動画とユーザー成長 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 人気動画ランキング */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">人気動画ランキング</h3>
          <div className="space-y-3">
            {analyticsData.topVideos.map((video, index) => (
              <div key={video.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{video.title}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>👁️ {video.views.toLocaleString()}</span>
                      <span>👍 {video.likes.toLocaleString()}</span>
                      <span>✅ {video.completion}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ユーザー成長 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">ユーザー成長</h3>
          <div className="space-y-3">
            {analyticsData.userGrowth.slice(-5).map((growth, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{new Date(growth.date).toLocaleDateString('ja-JP')}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-green-600">+{growth.newUsers}</span>
                  <span className="text-sm font-medium">{growth.totalUsers.toLocaleString()}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(growth.newUsers / 1000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-blue-900">コンバージョン率</p>
                <p className="text-2xl font-bold text-blue-600">{analyticsData.conversionRate}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-red-900">チャーン率</p>
                <p className="text-2xl font-bold text-red-600">{analyticsData.churnRate}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}