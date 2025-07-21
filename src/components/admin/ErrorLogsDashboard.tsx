'use client'

import { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Trash2, 
  RefreshCw,
  Filter,
  Download,
  Calendar,
  User,
  Code,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

interface ErrorLog {
  id: string
  timestamp: string
  level: 'error' | 'warn' | 'info'
  message: string
  stack?: string
  userId?: string
  userAgent?: string
  url?: string
  component?: string
  metadata?: Record<string, any>
}

interface ErrorStats {
  total: number
  byLevel: Record<string, number>
  byComponent: Record<string, number>
  recent24h: number
}

interface ErrorLogsData {
  logs: ErrorLog[]
  stats: ErrorStats
  filters: {
    level: string | null
    component: string | null
    userId: string | null
    limit: number
  }
}

export default function ErrorLogsDashboard() {
  const [data, setData] = useState<ErrorLogsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('')
  const [selectedComponent, setSelectedComponent] = useState<string>('')
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchErrorLogs()
  }, [selectedLevel, selectedComponent])

  const fetchErrorLogs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedLevel) params.append('level', selectedLevel)
      if (selectedComponent) params.append('component', selectedComponent)
      params.append('limit', '100')

      const response = await fetch(`/api/admin/error-logs?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch error logs')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch error logs')
    } finally {
      setLoading(false)
    }
  }

  const clearLogs = async () => {
    if (!confirm('本当にすべてのエラーログを削除しますか？')) return

    try {
      const response = await fetch('/api/admin/error-logs', {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchErrorLogs()
        alert('エラーログを削除しました')
      } else {
        alert('エラーログの削除に失敗しました')
      }
    } catch (err) {
      console.error('Error clearing logs:', err)
      alert('エラーログの削除に失敗しました')
    }
  }

  const exportLogs = () => {
    if (!data?.logs) return

    const csvContent = [
      'Timestamp,Level,Message,Component,User ID,URL',
      ...data.logs.map(log => 
        `"${log.timestamp}","${log.level}","${log.message.replace(/"/g, '""')}","${log.component || ''}","${log.userId || ''}","${log.url || ''}"`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `error-logs-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'warn': return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case 'info': return <Info className="w-4 h-4 text-blue-600" />
      default: return <Info className="w-4 h-4 text-gray-600" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800 border-red-200'
      case 'warn': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ja-JP')
  }

  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs)
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId)
    } else {
      newExpanded.add(logId)
    }
    setExpandedLogs(newExpanded)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2">エラーログを読み込み中...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="w-5 h-5" />
          <span>エラーログの取得に失敗しました: {error}</span>
        </div>
      </div>
    )
  }

  if (!data) return null

  const uniqueComponents = [...new Set(data.logs.map(log => log.component).filter(Boolean))]

  return (
    <div className="space-y-6">
      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">総ログ数</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.stats.total}</p>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-gray-600">エラー</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{data.stats.byLevel.error || 0}</p>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-gray-600">警告</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{data.stats.byLevel.warn || 0}</p>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">24時間以内</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{data.stats.recent24h}</p>
        </div>
      </div>

      {/* フィルターとアクション */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">フィルター:</span>
          </div>
          
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="">すべてのレベル</option>
            <option value="error">エラー</option>
            <option value="warn">警告</option>
            <option value="info">情報</option>
          </select>
          
          <select
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="">すべてのコンポーネント</option>
            {uniqueComponents.map(component => (
              <option key={component} value={component}>{component}</option>
            ))}
          </select>
          
          <div className="flex-1"></div>
          
          <div className="flex gap-2">
            <button
              onClick={fetchErrorLogs}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4" />
              更新
            </button>
            
            <button
              onClick={exportLogs}
              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
            
            <button
              onClick={clearLogs}
              className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              削除
            </button>
          </div>
        </div>
      </div>

      {/* ログ一覧 */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">エラーログ一覧</h3>
          <p className="text-sm text-gray-600">{data.logs.length}件のログを表示中</p>
        </div>
        
        <div className="divide-y">
          {data.logs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Info className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>エラーログがありません</p>
            </div>
          ) : (
            data.logs.map((log) => {
              const isExpanded = expandedLogs.has(log.id)
              
              return (
                <div key={log.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleLogExpansion(log.id)}
                      className="mt-1 text-gray-400 hover:text-gray-600"
                    >
                      {isExpanded ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                      }
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {getLevelIcon(log.level)}
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">{formatTimestamp(log.timestamp)}</span>
                        {log.component && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Code className="w-3 h-3" />
                            {log.component}
                          </span>
                        )}
                        {log.userId && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <User className="w-3 h-3" />
                            {log.userId.slice(0, 8)}...
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-900 font-medium">{log.message}</p>
                      
                      {isExpanded && (
                        <div className="mt-4 space-y-3">
                          {log.stack && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">スタックトレース:</h4>
                              <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto text-gray-700">
                                {log.stack}
                              </pre>
                            </div>
                          )}
                          
                          {log.url && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">URL:</h4>
                              <p className="text-sm text-blue-600">{log.url}</p>
                            </div>
                          )}
                          
                          {log.userAgent && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">ユーザーエージェント:</h4>
                              <p className="text-xs text-gray-600 break-all">{log.userAgent}</p>
                            </div>
                          )}
                          
                          {log.metadata && Object.keys(log.metadata).length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">追加情報:</h4>
                              <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto text-gray-700">
                                {JSON.stringify(log.metadata, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}