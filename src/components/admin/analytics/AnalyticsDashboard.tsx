'use client'

import React, { useState, useEffect } from 'react'
import { RefreshCw, BarChart3, Clock } from 'lucide-react'
import EnrollmentChart from './EnrollmentChart'
import PopularCourses from './PopularCourses'
import DepartmentStats from './DepartmentStats'
import KPIMetrics from './KPIMetrics'
import RevenueChart from './RevenueChart'
import SubscriptionStats from './SubscriptionStats'
import FinancialOverview from './FinancialOverview'

interface AnalyticsData {
  enrollment?: any
  popularCourses?: any[]
  departments?: any[]
  kpi?: any
  revenue?: any
  subscriptions?: any
  financial?: any
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData>({})
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)

  // データ取得関数
  const fetchAnalyticsData = async () => {
    try {
      console.log('📊 統計データを取得中...')
      
      // 並列でデータを取得
      const [enrollmentRes, popularRes, departmentsRes, kpiRes, revenueRes, subscriptionsRes, financialRes] = await Promise.all([
        fetch('/api/admin/analytics?type=enrollment'),
        fetch('/api/admin/analytics?type=popular-courses'),
        fetch('/api/admin/analytics?type=departments'),
        fetch('/api/admin/analytics?type=kpi'),
        fetch('/api/admin/analytics?type=revenue'),
        fetch('/api/admin/analytics?type=subscriptions'),
        fetch('/api/admin/analytics?type=financial')
      ])

      const [enrollment, popular, departments, kpi, revenue, subscriptions, financial] = await Promise.all([
        enrollmentRes.json(),
        popularRes.json(),
        departmentsRes.json(),
        kpiRes.json(),
        revenueRes.json(),
        subscriptionsRes.json(),
        financialRes.json()
      ])

      setData({
        enrollment: enrollment.data,
        popularCourses: popular.data,
        departments: departments.data,
        kpi: kpi.data,
        revenue: revenue.data,
        subscriptions: subscriptions.data,
        financial: financial.data
      })

      setLastUpdate(new Date())
      console.log('✅ 統計データ更新完了')
      
    } catch (error) {
      console.error('📊 統計データ取得エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  // 初回データ取得
  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  // 自動更新
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      console.log('🔄 自動更新実行')
      fetchAnalyticsData()
    }, 30000) // 30秒ごとに更新

    return () => clearInterval(interval)
  }, [autoRefresh])

  // 手動更新
  const handleManualRefresh = () => {
    setLoading(true)
    fetchAnalyticsData()
  }

  // 自動更新トグル
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh)
    console.log('🔄 自動更新:', !autoRefresh ? '有効' : '無効')
  }

  if (loading && Object.keys(data).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">統計データを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
              📊 リアルタイム統計ダッシュボード
            </h1>
            <p className="text-gray-600 mt-2">
              受講者数、人気コース、部門別統計を確認できます
            </p>
          </div>

          {/* コントロールパネル */}
          <div className="flex items-center space-x-4">
            {/* 最終更新時刻 */}
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {lastUpdate.toLocaleTimeString('ja-JP')}
            </div>

            {/* 自動更新トグル */}
            <button
              onClick={toggleAutoRefresh}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                autoRefresh
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {autoRefresh ? '自動更新: ON' : '自動更新: OFF'}
            </button>

            {/* 手動更新ボタン */}
            <button
              onClick={handleManualRefresh}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              更新
            </button>
          </div>
        </div>
      </div>

      {/* ダッシュボードコンテンツ */}
      <div className="space-y-8">
        {/* KPIメトリクス */}
        {data.kpi && (
          <KPIMetrics data={data.kpi} />
        )}

        {/* 上段: グラフとランキング */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 受講者数推移グラフ */}
          {data.enrollment && (
            <EnrollmentChart 
              data={data.enrollment}
              title="受講者数推移 (30日間)"
              height={400}
            />
          )}

          {/* 人気コースランキング */}
          {data.popularCourses && (
            <PopularCourses courses={data.popularCourses} />
          )}
        </div>

        {/* 中段: 収益統計 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 収益チャート */}
          {data.revenue && (
            <RevenueChart 
              data={data.revenue}
              title="月間収益推移 (30日間)"
            />
          )}

          {/* 有料メンバー統計 */}
          {data.subscriptions && (
            <SubscriptionStats data={data.subscriptions} />
          )}
        </div>

        {/* 財務概要 */}
        {data.financial && (
          <FinancialOverview data={data.financial} />
        )}

        {/* 下段: 部門別統計 */}
        {data.departments && (
          <DepartmentStats departments={data.departments} />
        )}
      </div>

      {/* ステータスインジケーター */}
      <div className="fixed bottom-6 right-6">
        <div className={`flex items-center px-3 py-2 rounded-full text-sm ${
          autoRefresh 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`} />
          {autoRefresh ? 'リアルタイム更新中' : '手動更新モード'}
        </div>
      </div>
    </div>
  )
}