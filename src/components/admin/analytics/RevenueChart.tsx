'use client'

import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { DollarSign, TrendingUp, Calendar, Target } from 'lucide-react'

// Chart.jsコンポーネントを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface RevenueData {
  daily: Array<{
    date: string
    revenue: number
    subscriptions: number
    upgrades: number
    cancellations: number
  }>
  totalRevenue: number
  avgDailyRevenue: number
  monthlyProjection: number
  growth: number
}

interface RevenueChartProps {
  data: RevenueData
  title?: string
  chartType?: 'line' | 'bar'
}

export default function RevenueChart({ 
  data, 
  title = "月間収益推移", 
  chartType = 'line' 
}: RevenueChartProps) {
  // チャート用データの準備
  const chartData = {
    labels: data.daily.map(item => {
      const date = new Date(item.date)
      return `${date.getMonth() + 1}/${date.getDate()}`
    }),
    datasets: [
      {
        label: '日次収益 (円)',
        data: data.daily.map(item => item.revenue),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: chartType === 'line'
      },
      {
        label: '新規登録数',
        data: data.daily.map(item => item.subscriptions),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
        fill: false
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        callbacks: {
          label: function(context: any) {
            if (context.datasetIndex === 0) {
              return `収益: ¥${context.parsed.y.toLocaleString()}`
            }
            return `登録: ${context.parsed.y}人`
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: '日付'
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: '収益 (円)'
        },
        ticks: {
          callback: function(value: any) {
            return '¥' + value.toLocaleString()
          }
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: '登録数'
        },
        grid: {
          drawOnChartArea: false,
        },
      }
    }
  }

  const ChartComponent = chartType === 'line' ? Line : Bar

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* チャート */}
      <div className="mb-6" style={{ height: '400px' }}>
        <ChartComponent data={chartData} options={options} />
      </div>

      {/* 収益メトリクス */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="w-5 h-5 text-green-500 mr-1" />
            <span className="text-sm text-gray-600 dark:text-gray-300">月間収益</span>
          </div>
          <div className="text-lg font-bold text-green-600">
            ¥{data.totalRevenue.toLocaleString()}
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-5 h-5 text-blue-500 mr-1" />
            <span className="text-sm text-gray-600 dark:text-gray-300">日平均</span>
          </div>
          <div className="text-lg font-bold text-blue-600">
            ¥{data.avgDailyRevenue.toLocaleString()}
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-purple-500 mr-1" />
            <span className="text-sm text-gray-600 dark:text-gray-300">月末予測</span>
          </div>
          <div className="text-lg font-bold text-purple-600">
            ¥{data.monthlyProjection.toLocaleString()}
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-yellow-500 mr-1" />
            <span className="text-sm text-gray-600 dark:text-gray-300">成長率</span>
          </div>
          <div className={`text-lg font-bold ${
            data.growth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {data.growth >= 0 ? '+' : ''}{data.growth.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* 追加の分析 */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-300">最高日次収益: </span>
            <span className="font-semibold text-green-600">
              ¥{Math.max(...data.daily.map(d => d.revenue)).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-300">最低日次収益: </span>
            <span className="font-semibold text-red-600">
              ¥{Math.min(...data.daily.map(d => d.revenue)).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-300">収益安定性: </span>
            <span className="font-semibold text-blue-600">
              {((1 - (Math.max(...data.daily.map(d => d.revenue)) - Math.min(...data.daily.map(d => d.revenue))) / data.avgDailyRevenue) * 100).toFixed(1)}%
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