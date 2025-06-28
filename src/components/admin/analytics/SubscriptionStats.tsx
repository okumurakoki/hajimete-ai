'use client'

import React from 'react'
import { 
  Users, 
  UserCheck, 
  UserX, 
  Crown, 
  Star, 
  Building, 
  TrendingUp, 
  TrendingDown,
  Clock,
  DollarSign,
  Target,
  Zap
} from 'lucide-react'

interface SubscriptionData {
  total: number
  active: number
  trial: number
  premium: number
  basic: number
  enterprise: number
  churnRate: number
  averageLifetime: number
  monthlyGrowth: number
}

interface SubscriptionStatsProps {
  data: SubscriptionData
  title?: string
}

export default function SubscriptionStats({ 
  data, 
  title = "有料メンバー統計" 
}: SubscriptionStatsProps) {
  const subscriptionPlans = [
    {
      name: 'Basic',
      count: data.basic,
      price: 1980,
      color: 'blue',
      icon: Users,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      percentage: ((data.basic / data.total) * 100).toFixed(1)
    },
    {
      name: 'Premium',
      count: data.premium,
      price: 2980,
      color: 'purple',
      icon: Crown,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      percentage: ((data.premium / data.total) * 100).toFixed(1)
    },
    {
      name: 'Enterprise',
      count: data.enterprise,
      price: 9800,
      color: 'gold',
      icon: Building,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      percentage: ((data.enterprise / data.total) * 100).toFixed(1)
    }
  ]

  const metrics = [
    {
      label: '総メンバー数',
      value: data.total.toLocaleString(),
      unit: '人',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'アクティブ会員',
      value: data.active.toLocaleString(),
      unit: '人',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'トライアル中',
      value: data.trial.toLocaleString(),
      unit: '人',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      label: '解約率',
      value: data.churnRate.toFixed(1),
      unit: '%',
      icon: data.churnRate < 3 ? TrendingDown : TrendingUp,
      color: data.churnRate < 3 ? 'text-green-600' : 'text-red-600',
      bgColor: data.churnRate < 3 ? 'bg-green-100' : 'bg-red-100'
    }
  ]

  const monthlyRevenue = (data.basic * 1980) + (data.premium * 2980) + (data.enterprise * 9800)
  const averageRevenuePerUser = Math.round(monthlyRevenue / data.active)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Star className="w-6 h-6 text-purple-500 mr-2" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
        <div className={`flex items-center text-sm px-3 py-1 rounded-full ${
          data.monthlyGrowth >= 0 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {data.monthlyGrowth >= 0 ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          {data.monthlyGrowth >= 0 ? '+' : ''}{data.monthlyGrowth.toFixed(1)}%
        </div>
      </div>

      {/* メイン統計 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${metric.bgColor} mb-2`}>
              <metric.icon className={`w-6 h-6 ${metric.color}`} />
            </div>
            <div className={`text-lg font-bold ${metric.color}`}>
              {metric.value}<span className="text-sm ml-1">{metric.unit}</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* プラン別内訳 */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">プラン別内訳</h4>
        <div className="space-y-3">
          {subscriptionPlans.map((plan, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${plan.bgColor} mr-3`}>
                  <plan.icon className={`w-4 h-4 ${plan.textColor}`} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{plan.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">¥{plan.price.toLocaleString()}/月</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-lg font-bold ${plan.textColor}`}>
                  {plan.count.toLocaleString()}人
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">{plan.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 収益メトリクス */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <DollarSign className="w-4 h-4 mr-2" />
          収益指標
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              ¥{monthlyRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">月間定期収益 (MRR)</div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="text-lg font-bold text-blue-600">
              ¥{averageRevenuePerUser.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">ユーザー単価 (ARPU)</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <div className="text-lg font-bold text-purple-600">
              {data.averageLifetime.toFixed(1)}ヶ月
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">平均利用期間</div>
          </div>
        </div>
      </div>

      {/* 健全性指標 */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
          <Target className="w-4 h-4 mr-2" />
          ビジネス健全性
        </h4>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">有料化率:</span>
            <span className="font-semibold">
              {((data.active / data.total) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">解約率:</span>
            <span className={`font-semibold ${
              data.churnRate < 3 ? 'text-green-600' : 'text-red-600'
            }`}>
              {data.churnRate.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">LTV:</span>
            <span className="font-semibold">
              ¥{Math.round(averageRevenuePerUser * data.averageLifetime).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">成長率:</span>
            <span className={`font-semibold ${
              data.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {data.monthlyGrowth >= 0 ? '+' : ''}{data.monthlyGrowth.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* 更新時刻 */}
      <div className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-center">
        最終更新: {new Date().toLocaleString('ja-JP')}
      </div>
    </div>
  )
}