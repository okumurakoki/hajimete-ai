'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Users,
  Video,
  Calendar,
  DollarSign,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Eye,
  Clock,
  Play,
  BookOpen,
  Star,
  Filter,
  RefreshCw
} from 'lucide-react'

interface ChartData {
  label: string
  value: number
  change?: number
  color?: string
}

interface TimeSeriesData {
  date: string
  value: number
  label?: string
}

interface AnalyticsChartProps {
  title: string
  type: 'line' | 'bar' | 'pie' | 'metric'
  data: ChartData[] | TimeSeriesData[]
  period?: '7d' | '30d' | '90d' | 'all'
  metric?: {
    value: string | number
    change?: number
    trend: 'up' | 'down' | 'neutral'
    description?: string
  }
  height?: number
  color?: string
}

export default function AnalyticsChart({ 
  title, 
  type, 
  data, 
  period = '30d', 
  metric,
  height = 200,
  color = 'blue'
}: AnalyticsChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(period)
  const [isLoading, setIsLoading] = useState(false)

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-green-600" />
      case 'down':
        return <TrendingDown size={16} className="text-red-600" />
      default:
        return <Minus size={16} className="text-gray-600" />
    }
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 border-blue-200 text-blue-600',
      green: 'bg-green-500 border-green-200 text-green-600',
      red: 'bg-red-500 border-red-200 text-red-600',
      purple: 'bg-purple-500 border-purple-200 text-purple-600',
      orange: 'bg-orange-500 border-orange-200 text-orange-600',
      indigo: 'bg-indigo-500 border-indigo-200 text-indigo-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const handlePeriodChange = (newPeriod: '7d' | '30d' | '90d' | 'all') => {
    setIsLoading(true)
    setSelectedPeriod(newPeriod)
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  const renderSimpleLineChart = (data: TimeSeriesData[]) => {
    const maxValue = Math.max(...data.map(d => d.value))
    const minValue = Math.min(...data.map(d => d.value))
    const range = maxValue - minValue

    return (
      <div className="relative h-full">
        <svg width="100%" height={height} className="overflow-visible">
          {/* Grid lines */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 0.05 }} />
            </linearGradient>
          </defs>
          
          {/* Grid */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1="0"
              y1={i * (height / 4)}
              x2="100%"
              y2={i * (height / 4)}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}
          
          {/* Line path */}
          <path
            d={data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100
              const y = height - ((point.value - minValue) / range) * height
              return `${index === 0 ? 'M' : 'L'} ${x}% ${y}`
            }).join(' ')}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
          />
          
          {/* Area fill */}
          <path
            d={[
              `M 0% ${height}`,
              ...data.map((point, index) => {
                const x = (index / (data.length - 1)) * 100
                const y = height - ((point.value - minValue) / range) * height
                return `L ${x}% ${y}`
              }),
              `L 100% ${height}`,
              'Z'
            ].join(' ')}
            fill="url(#gradient)"
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = height - ((point.value - minValue) / range) * height
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={y}
                r="3"
                fill="#3B82F6"
                stroke="white"
                strokeWidth="2"
              />
            )
          })}
        </svg>
      </div>
    )
  }

  const renderBarChart = (data: ChartData[]) => {
    const maxValue = Math.max(...data.map(d => d.value))
    
    return (
      <div className="flex items-end justify-between h-full gap-2 px-4">
        {data.map((item, index) => {
          const heightPercent = (item.value / maxValue) * 100
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex items-end h-full w-full">
                <div 
                  className={`w-full bg-blue-500 rounded-t transition-all duration-500 ease-out`}
                  style={{ height: `${heightPercent}%` }}
                  title={`${item.label}: ${item.value}`}
                />
              </div>
              <div className="text-xs text-gray-600 mt-2 text-center truncate w-full">
                {item.label}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderPieChart = (data: ChartData[]) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = 0
    
    return (
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          <svg width="150" height="150" className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const angle = (percentage / 100) * 360
              const radius = 60
              const circumference = 2 * Math.PI * radius
              const strokeDasharray = circumference
              const strokeDashoffset = circumference - (percentage / 100) * circumference
              
              const color = item.color || `hsl(${index * (360 / data.length)}, 70%, 50%)`
              currentAngle += angle
              
              return (
                <circle
                  key={index}
                  cx="75"
                  cy="75"
                  r={radius}
                  fill="none"
                  stroke={color}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                  style={{ 
                    transformOrigin: '75px 75px',
                    transform: `rotate(${currentAngle - angle}deg)`
                  }}
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{total}</div>
              <div className="text-xs text-gray-600">総計</div>
            </div>
          </div>
        </div>
        
        <div className="ml-6 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color || `hsl(${index * (360 / data.length)}, 70%, 50%)` }}
              />
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="text-sm font-medium text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderMetric = () => {
    if (!metric) return null
    
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {metric.value}
        </div>
        {metric.change !== undefined && (
          <div className="flex items-center gap-2 mb-2">
            {getTrendIcon(metric.trend)}
            <span className={`text-sm font-medium ${
              metric.trend === 'up' ? 'text-green-600' : 
              metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {metric.change > 0 ? '+' : ''}{metric.change}%
            </span>
          </div>
        )}
        {metric.description && (
          <div className="text-sm text-gray-600 max-w-xs">
            {metric.description}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-2">
          {type !== 'metric' && (
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">7日間</option>
              <option value="30d">30日間</option>
              <option value="90d">90日間</option>
              <option value="all">全期間</option>
            </select>
          )}
          <button 
            onClick={() => handlePeriodChange(selectedPeriod)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
      
      <div className="relative" style={{ height }}>
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <RefreshCw size={24} className="animate-spin text-blue-600" />
          </div>
        )}
        
        {type === 'line' && renderSimpleLineChart(data as TimeSeriesData[])}
        {type === 'bar' && renderBarChart(data as ChartData[])}
        {type === 'pie' && renderPieChart(data as ChartData[])}
        {type === 'metric' && renderMetric()}
      </div>
    </div>
  )
}