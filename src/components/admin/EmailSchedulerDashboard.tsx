'use client'

import { useState, useEffect } from 'react'
import { 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  Send,
  Users,
  Calendar,
  Filter,
  Plus
} from 'lucide-react'

interface ScheduledEmail {
  id: string
  type: 'reminder' | 'follow-up' | 'marketing' | 'feedback'
  recipientEmail: string
  recipientName: string
  scheduledAt: string
  seminarId?: string
  courseId?: string
  status: 'pending' | 'sent' | 'failed' | 'cancelled'
  data?: Record<string, any>
  createdAt: string
  sentAt?: string
  errorMessage?: string
}

interface EmailStats {
  total: number
  byStatus: Record<string, number>
  byType: Record<string, number>
  pending: number
  recentSent: number
}

interface EmailSchedulerData {
  emails: ScheduledEmail[]
  stats: EmailStats
  filters: {
    status: string | null
    type: string | null
    limit: number
  }
}

export default function EmailSchedulerDashboard() {
  const [data, setData] = useState<EmailSchedulerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [schedulerRunning, setSchedulerRunning] = useState(false)

  useEffect(() => {
    fetchEmailData()
  }, [selectedStatus, selectedType])

  const fetchEmailData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedStatus) params.append('status', selectedStatus)
      if (selectedType) params.append('type', selectedType)
      params.append('limit', '100')

      const response = await fetch(`/api/admin/email-scheduler?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch email data')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch email data')
    } finally {
      setLoading(false)
    }
  }

  const startScheduler = async () => {
    try {
      const response = await fetch('/api/admin/email-scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start-scheduler' })
      })
      
      if (response.ok) {
        setSchedulerRunning(true)
        alert('メールスケジューラーを開始しました')
      } else {
        alert('スケジューラーの開始に失敗しました')
      }
    } catch (err) {
      console.error('Error starting scheduler:', err)
      alert('スケジューラーの開始に失敗しました')
    }
  }

  const stopScheduler = async () => {
    try {
      const response = await fetch('/api/admin/email-scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop-scheduler' })
      })
      
      if (response.ok) {
        setSchedulerRunning(false)
        alert('メールスケジューラーを停止しました')
      } else {
        alert('スケジューラーの停止に失敗しました')
      }
    } catch (err) {
      console.error('Error stopping scheduler:', err)
      alert('スケジューラーの停止に失敗しました')
    }
  }

  const cancelEmail = async (emailId: string) => {
    if (!confirm('このメールをキャンセルしますか？')) return

    try {
      const response = await fetch('/api/admin/email-scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel-email', emailId })
      })
      
      if (response.ok) {
        await fetchEmailData()
        alert('メールをキャンセルしました')
      } else {
        alert('メールのキャンセルに失敗しました')
      }
    } catch (err) {
      console.error('Error cancelling email:', err)
      alert('メールのキャンセルに失敗しました')
    }
  }

  const scheduleTestReminder = async () => {
    const testData = {
      action: 'schedule-reminder',
      userEmail: 'test@example.com',
      userName: 'テストユーザー',
      seminar: {
        id: '1',
        title: 'ChatGPT活用セミナー 基礎編',
        instructor: '山田太郎',
        startDate: new Date(Date.now() + 2 * 60 * 1000).toISOString(), // 2分後
        endDate: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
        zoomUrl: 'https://zoom.us/j/test',
        zoomId: '123-456-789',
        zoomPassword: 'test123'
      },
      reminderTime: 0.03 // 2分前（テスト用）
    }

    try {
      const response = await fetch('/api/admin/email-scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })
      
      if (response.ok) {
        await fetchEmailData()
        alert('テストリマインダーメールをスケジュールしました（2分後に送信）')
      } else {
        alert('テストメールのスケジュールに失敗しました')
      }
    } catch (err) {
      console.error('Error scheduling test reminder:', err)
      alert('テストメールのスケジュールに失敗しました')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />
      case 'sent': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />
      case 'cancelled': return <XCircle className="w-4 h-4 text-gray-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'sent': return 'bg-green-100 text-green-800 border-green-200'
      case 'failed': return 'bg-red-100 text-red-800 border-red-200'
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reminder': return <Clock className="w-4 h-4 text-blue-600" />
      case 'follow-up': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'marketing': return <Send className="w-4 h-4 text-purple-600" />
      case 'feedback': return <AlertTriangle className="w-4 h-4 text-orange-600" />
      default: return <Mail className="w-4 h-4 text-gray-600" />
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2">メールデータを読み込み中...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="w-5 h-5" />
          <span>メールデータの取得に失敗しました: {error}</span>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">総メール数</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.stats.total}</p>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-gray-600">待機中</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{data.stats.pending}</p>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">送信済み</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{data.stats.byStatus.sent || 0}</p>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-gray-600">失敗</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{data.stats.byStatus.failed || 0}</p>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">24時間以内</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{data.stats.recentSent}</p>
        </div>
      </div>

      {/* コントロールパネル */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">スケジューラー:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              schedulerRunning 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {schedulerRunning ? '実行中' : '停止中'}
            </span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={schedulerRunning ? stopScheduler : startScheduler}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                schedulerRunning
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {schedulerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {schedulerRunning ? '停止' : '開始'}
            </button>
            
            <button
              onClick={scheduleTestReminder}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              テストメール
            </button>
          </div>
          
          <div className="flex-1"></div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="">すべてのステータス</option>
              <option value="pending">待機中</option>
              <option value="sent">送信済み</option>
              <option value="failed">失敗</option>
              <option value="cancelled">キャンセル</option>
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="">すべてのタイプ</option>
              <option value="reminder">リマインダー</option>
              <option value="follow-up">フォローアップ</option>
              <option value="marketing">マーケティング</option>
              <option value="feedback">フィードバック</option>
            </select>
            
            <button
              onClick={fetchEmailData}
              className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
            >
              <RefreshCw className="w-4 h-4" />
              更新
            </button>
          </div>
        </div>
      </div>

      {/* メール一覧 */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">スケジュール済みメール一覧</h3>
          <p className="text-sm text-gray-600">{data.emails.length}件のメールを表示中</p>
        </div>
        
        <div className="divide-y">
          {data.emails.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Mail className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>スケジュール済みメールがありません</p>
            </div>
          ) : (
            data.emails.map((email) => (
              <div key={email.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(email.type)}
                    {getStatusIcon(email.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(email.status)}`}>
                        {email.status}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {email.type}
                      </span>
                      <span className="text-sm text-gray-500">{formatDateTime(email.scheduledAt)}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-900">{email.recipientName}</p>
                        <p className="text-gray-600">{email.recipientEmail}</p>
                      </div>
                      <div>
                        {email.seminarId && (
                          <p className="text-gray-600">セミナーID: {email.seminarId}</p>
                        )}
                        <p className="text-gray-500">作成: {formatDateTime(email.createdAt)}</p>
                        {email.sentAt && (
                          <p className="text-green-600">送信: {formatDateTime(email.sentAt)}</p>
                        )}
                      </div>
                    </div>
                    
                    {email.errorMessage && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-600">
                        エラー: {email.errorMessage}
                      </div>
                    )}
                    
                    {email.status === 'pending' && (
                      <div className="mt-2">
                        <button
                          onClick={() => cancelEmail(email.id)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          キャンセル
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}