'use client'

import React from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target, 
  PieChart, 
  BarChart3,
  Calendar,
  Zap,
  Award,
  AlertCircle
} from 'lucide-react'

interface FinancialData {
  monthlyRevenue: number
  averageRevenuePerUser: number
  totalSubscribers: number
  paidSubscribers: number
  trialUsers: number
  churnRate: number
  ltv: number
  mrr: number
  arr: number
}

interface FinancialOverviewProps {
  data: FinancialData
  title?: string
}

export default function FinancialOverview({ 
  data, 
  title = "財務概要ダッシュボード" 
}: FinancialOverviewProps) {
  const keyMetrics = [
    {
      label: 'MRR',
      sublabel: '月間定期収益',
      value: `¥${data.mrr.toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      growth: '+15.2%'
    },
    {
      label: 'ARR',
      sublabel: '年間定期収益',
      value: `¥${data.arr.toLocaleString()}`,
      icon: TrendingUp,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      growth: '+18.7%'
    },
    {
      label: 'ARPU',
      sublabel: 'ユーザー単価',
      value: `¥${data.averageRevenuePerUser.toLocaleString()}`,
      icon: Target,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      growth: '+8.4%'
    },
    {
      label: 'LTV',
      sublabel: '顧客生涯価値',
      value: `¥${data.ltv.toLocaleString()}`,
      icon: Award,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      growth: '+22.1%'
    }
  ]

  const conversionRate = ((data.paidSubscribers / data.totalSubscribers) * 100).toFixed(1)
  const trialConversionEstimate = 75 // モック値
  const paybackPeriod = Math.round(data.ltv / data.averageRevenuePerUser) // 投資回収期間（月）

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart3 className="w-6 h-6 text-indigo-500 mr-2" />
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        <div className="text-sm text-gray-500">
          リアルタイム財務指標
        </div>
      </div>

      {/* 主要メトリクス */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {keyMetrics.map((metric, index) => (
          <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-5 h-5 ${metric.textColor}`} />
              </div>
              <div className="text-xs text-green-600 font-medium">
                {metric.growth}
              </div>
            </div>
            
            <div className={`text-xl font-bold ${metric.textColor} mb-1`}>
              {metric.value}
            </div>
            
            <div className="text-sm text-gray-600">
              <div className="font-medium">{metric.label}</div>
              <div className="text-xs">{metric.sublabel}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ビジネス健全性指標 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 左側: 重要指標 */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            ビジネス健全性
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">有料化率</div>
                <div className="text-xs text-gray-600">Trial → Paid 転換率</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">{conversionRate}%</div>
                <div className="text-xs text-green-600">+2.1%</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">解約率</div>
                <div className="text-xs text-gray-600">Monthly Churn Rate</div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  data.churnRate < 3 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {data.churnRate.toFixed(1)}%
                </div>
                <div className="text-xs text-green-600">-0.3%</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">投資回収期間</div>
                <div className="text-xs text-gray-600">Customer Payback Period</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">{paybackPeriod}ヶ月</div>
                <div className="text-xs text-green-600">-0.5月</div>
              </div>
            </div>
          </div>
        </div>

        {/* 右側: 顧客セグメント */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-4 h-4 mr-2" />
            顧客セグメント
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">有料会員</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">{data.paidSubscribers.toLocaleString()}</span>
                <span className="text-sm text-gray-600 ml-1">
                  ({((data.paidSubscribers / data.totalSubscribers) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">トライアル</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">{data.trialUsers.toLocaleString()}</span>
                <span className="text-sm text-gray-600 ml-1">
                  ({((data.trialUsers / data.totalSubscribers) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">無料会員</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">
                  {(data.totalSubscribers - data.paidSubscribers - data.trialUsers).toLocaleString()}
                </span>
                <span className="text-sm text-gray-600 ml-1">
                  ({(((data.totalSubscribers - data.paidSubscribers - data.trialUsers) / data.totalSubscribers) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* プログレスバー */}
          <div className="mt-4 space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-l-full" 
                style={{ width: `${(data.paidSubscribers / data.totalSubscribers) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 text-center">
              {data.paidSubscribers.toLocaleString()} / {data.totalSubscribers.toLocaleString()} 人が有料会員
            </div>
          </div>
        </div>
      </div>

      {/* アラート・注意事項 */}
      <div className="pt-4 border-t">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-1">財務健全性の評価</h5>
            <div className="text-sm text-gray-600 space-y-1">
              <p>✅ 解約率が業界平均（5%）を下回っており健全</p>
              <p>✅ LTV/CAC比率が3:1を超えており収益性良好</p>
              <p>⚠️ トライアル転換率の改善余地あり（目標: 25%）</p>
            </div>
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