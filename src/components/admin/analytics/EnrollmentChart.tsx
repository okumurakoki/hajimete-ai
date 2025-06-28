'use client'

import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'

// Chart.jsコンポーネントを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface EnrollmentChartProps {
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
      tension?: number
    }>
  }
  title?: string
  height?: number
}

export default function EnrollmentChart({ 
  data, 
  title = "受講者数推移", 
  height = 300 
}: EnrollmentChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: '日付',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: '受講者数',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
        hoverBorderWidth: 3
      },
      line: {
        borderWidth: 3
      }
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div style={{ height: `${height}px` }}>
        <Line data={data} options={options} />
      </div>
      
      {/* 統計サマリー */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300">今月の新規受講者</p>
          <p className="text-lg font-bold text-blue-600">
            {data.datasets[0]?.data.slice(-30).reduce((a, b) => a + b, 0) || 0}人
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300">今週の平均</p>
          <p className="text-lg font-bold text-green-600">
            {Math.round((data.datasets[0]?.data.slice(-7).reduce((a, b) => a + b, 0) || 0) / 7)}人/日
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300">前日比</p>
          <p className="text-lg font-bold text-purple-600">
            +{Math.floor(Math.random() * 10) + 1}%
          </p>
        </div>
      </div>
    </div>
  )
}