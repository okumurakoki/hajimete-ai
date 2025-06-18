'use client'

import { useState, useEffect } from 'react'
import { Radio, Users, Settings, Play, Square, Trash2, Copy, CheckCircle } from 'lucide-react'

interface LiveInput {
  uid: string
  rtmps: {
    url: string
    streamKey: string
  }
  status: string
  meta: {
    name: string
  }
  created: string
}

interface LiveStreamManagerProps {
  className?: string
}

export default function LiveStreamManager({ className = '' }: LiveStreamManagerProps) {
  const [liveInputs, setLiveInputs] = useState<LiveInput[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newStreamName, setNewStreamName] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  useEffect(() => {
    fetchLiveInputs()
  }, [])

  const fetchLiveInputs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cloudflare/live')
      const data = await response.json()
      
      if (data.success) {
        setLiveInputs(data.data.liveInputs)
      }
    } catch (error) {
      console.error('Failed to fetch live inputs:', error)
    } finally {
      setLoading(false)
    }
  }

  const createLiveInput = async () => {
    if (!newStreamName.trim()) return

    try {
      setCreating(true)
      const response = await fetch('/api/cloudflare/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStreamName,
          recording: true
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setLiveInputs(prev => [data.data.liveInput, ...prev])
        setNewStreamName('')
        setShowCreateForm(false)
      }
    } catch (error) {
      console.error('Failed to create live input:', error)
    } finally {
      setCreating(false)
    }
  }

  const deleteLiveInput = async (inputId: string) => {
    if (!confirm('このライブ入力を削除しますか？')) return

    try {
      const response = await fetch(`/api/cloudflare/live/${inputId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setLiveInputs(prev => prev.filter(input => input.uid !== inputId))
      }
    } catch (error) {
      console.error('Failed to delete live input:', error)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(`${type}-${text}`)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'connected':
        return 'text-green-600 bg-green-100'
      case 'live':
        return 'text-red-600 bg-red-100'
      case 'idle':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-yellow-600 bg-yellow-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'connected':
      case 'live':
        return <Play className="h-4 w-4" />
      default:
        return <Square className="h-4 w-4" />
    }
  }

  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Radio className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold">ライブ配信管理</h3>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          新しいライブ作成
        </button>
      </div>

      {/* ライブ作成フォーム */}
      {showCreateForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h4 className="font-semibold mb-3">新しいライブ配信を作成</h4>
          <div className="flex space-x-3">
            <input
              type="text"
              value={newStreamName}
              onChange={(e) => setNewStreamName(e.target.value)}
              placeholder="ライブ配信名を入力"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              onKeyDown={(e) => e.key === 'Enter' && createLiveInput()}
            />
            <button
              onClick={createLiveInput}
              disabled={creating || !newStreamName.trim()}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-300 transition-colors"
            >
              {creating ? '作成中...' : '作成'}
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false)
                setNewStreamName('')
              }}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* ライブ入力一覧 */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">読み込み中...</p>
        </div>
      ) : liveInputs.length === 0 ? (
        <div className="text-center py-8">
          <Radio className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600">ライブ入力がありません</p>
          <p className="text-sm text-gray-500">「新しいライブ作成」ボタンから始めてください</p>
        </div>
      ) : (
        <div className="space-y-4">
          {liveInputs.map((input) => (
            <div key={input.uid} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h4 className="font-semibold text-lg">{input.meta.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(input.status)}`}>
                    {getStatusIcon(input.status)}
                    <span>{input.status}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(input.uid, 'id')}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="IDをコピー"
                  >
                    {copiedKey === `id-${input.uid}` ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteLiveInput(input.uid)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    title="削除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* RTMP URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RTMP URL
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={input.rtmps.url}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(input.rtmps.url, 'url')}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {copiedKey === `url-${input.rtmps.url}` ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Stream Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ストリームキー
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="password"
                      value={input.rtmps.streamKey}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(input.rtmps.streamKey, 'key')}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {copiedKey === `key-${input.rtmps.streamKey}` ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* 設定情報 */}
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <div className="flex items-center space-x-2 mb-2">
                  <Settings className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">配信設定情報</span>
                </div>
                <div className="text-xs text-blue-700 space-y-1">
                  <p>・OBSなどの配信ソフトで上記URLとキーを設定</p>
                  <p>・解像度: 1920x1080 (Full HD) 推奨</p>
                  <p>・ビットレート: 2000-6000 kbps</p>
                  <p>・FPS: 30fps 推奨</p>
                </div>
              </div>

              {/* 視聴用埋め込みコード */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  視聴用埋め込みコード
                </label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 px-3 py-2 bg-gray-100 border rounded-md text-xs overflow-x-auto">
                    {`<iframe src="https://iframe.cloudflarestream.com/live/${input.uid}" style="border:none; width:100%; height:400px;" allowfullscreen></iframe>`}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`<iframe src="https://iframe.cloudflarestream.com/live/${input.uid}" style="border:none; width:100%; height:400px;" allowfullscreen></iframe>`, 'embed')}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {copiedKey === `embed-<iframe src="https://iframe.cloudflarestream.com/live/${input.uid}" style="border:none; width:100%; height:400px;" allowfullscreen></iframe>` ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}