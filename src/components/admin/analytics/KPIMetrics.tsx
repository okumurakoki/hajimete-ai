'use client'

import React from 'react'
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Eye, 
  EyeOff, 
  Calendar,
  Activity,
  Target,
  BarChart3
} from 'lucide-react'

interface KPIData {
  totalStudents: number
  totalCourses: number
  avgCompletion: number
  monthlyGrowth: number
  activeCourses: number
  draftCourses: number
}

interface KPIMetricsProps {
  data: KPIData
  title?: string
}

export default function KPIMetrics({ 
  data, 
  title = "主要業績指標 (KPI)" 
}: KPIMetricsProps) {
  const kpiCards = [
    {
      title: '総受講者数',
      value: data.totalStudents.toLocaleString(),
      unit: '人',
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      iconColor: 'text-blue-600',
      trend: '+12.5%',
      trendColor: 'text-green-600'
    },
    {
      title: '総コース数',
      value: data.totalCourses.toString(),
      unit: 'コース',
      icon: BookOpen,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      iconColor: 'text-green-600',
      trend: '+3',
      trendColor: 'text-green-600'
    },
    {
      title: '平均完了率',
      value: data.avgCompletion.toString(),
      unit: '%',
      icon: Award,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      iconColor: 'text-purple-600',
      trend: '+2.3%',
      trendColor: 'text-green-600'
    },
    {
      title: '月間成長率',
      value: data.monthlyGrowth.toString(),
      unit: '%',
      icon: TrendingUp,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      iconColor: 'text-yellow-600',
      trend: '+1.2%',
      trendColor: 'text-green-600'
    },
    {
      title: '公開中コース',
      value: data.activeCourses.toString(),
      unit: 'コース',
      icon: Eye,
      color: 'indigo',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      iconColor: 'text-indigo-600',
      trend: '活動中',
      trendColor: 'text-green-600'
    },
    {
      title: '下書きコース',
      value: data.draftCourses.toString(),
      unit: 'コース',
      icon: EyeOff,
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      iconColor: 'text-gray-600',
      trend: '準備中',
      trendColor: 'text-yellow-600'
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart3 className="w-6 h-6 text-indigo-500 mr-2" />
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date().toLocaleDateString('ja-JP')}
        </div>
      </div>

      {/* KPIカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {kpiCards.map((kpi, index) => (
          <div 
            key={index}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            {/* アイコンとタイトル */}
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${kpi.bgColor} ${kpi.textColor}`}>
                {kpi.trend}
              </div>
            </div>

            {/* メトリクス */}
            <div className="mb-2">
              <div className="flex items-baseline">
                <span className={`text-2xl font-bold ${kpi.textColor}`}>
                  {kpi.value}
                </span>
                <span className={`text-sm ml-1 ${kpi.textColor}`}>
                  {kpi.unit}
                </span>
              </div>
            </div>

            {/* ラベル */}
            <div className="text-sm text-gray-600">
              {kpi.title}
            </div>
          </div>
        ))}
      </div>

      {/* パフォーマンス指標 */}
      <div className="pt-4 border-t">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-4 h-4 mr-2" />
          パフォーマンス指標
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 学習効率 */}
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {Math.round(data.totalStudents / data.totalCourses)}
            </div>
            <div className="text-xs text-gray-600">平均受講者/コース</div>
          </div>

          {/* コース充実度 */}
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {Math.round((data.activeCourses / data.totalCourses) * 100)}%
            </div>
            <div className="text-xs text-gray-600">コース公開率</div>
          </div>

          {/* 成長速度 */}
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {Math.round(data.monthlyGrowth * 30)}
            </div>
            <div className="text-xs text-gray-600">月間新規受講者</div>
          </div>

          {/* 学習満足度 */}
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">
              4.{Math.floor(Math.random() * 3) + 6}
            </div>
            <div className="text-xs text-gray-600">平均評価 (5点満点)</div>
          </div>
        </div>
      </div>

      {/* アクティビティ指標 */}
      <div className="mt-6 pt-4 border-t">
        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
          <Activity className="w-4 h-4 mr-2" />
          今週のアクティビティ
        </h4>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">新規受講者</span>
            <span className="font-semibold">+{Math.floor(Math.random() * 50) + 20}人</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">コース完了</span>
            <span className="font-semibold">+{Math.floor(Math.random() * 30) + 15}件</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">新規コース</span>
            <span className="font-semibold">+{Math.floor(Math.random() * 3) + 1}コース</span>
          </div>
        </div>
      </div>

      {/* 更新時刻 */}
      <div className="mt-4 text-xs text-gray-400 text-center">
        最終更新: {new Date().toLocaleString('ja-JP')}
      </div>
    </div>
  )
}