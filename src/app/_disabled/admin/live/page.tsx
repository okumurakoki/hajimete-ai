'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { 
  Radio, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2, 
  Play, 
  Pause, 
  Square, 
  Users, 
  Clock, 
  Video, 
  Wifi,
  WifiOff,
  Settings,
  Monitor,
  Camera,
  Mic,
  Share2,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface LiveStreamData {
  id: string
  title: string
  description: string
  status: 'offline' | 'live' | 'starting' | 'ending' | 'error'
  startTime?: string
  endTime?: string
  duration?: number
  viewerCount: number
  peakViewers: number
  streamKey: string
  rtmpUrl: string
  playbackUrl?: string
  thumbnailUrl?: string
  quality: 'HD' | 'FHD' | 'UHD'
  isRecording: boolean
  isPublic: boolean
  chatEnabled: boolean
  createdAt: string
  instructor?: string
  category: 'seminar' | 'workshop' | 'presentation' | 'discussion'
  tags: string[]
}

export default function AdminLive() {
  const [streams, setStreams] = useState<LiveStreamData[]>([])
  const [filteredStreams, setFilteredStreams] = useState<LiveStreamData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStreams, setSelectedStreams] = useState<string[]>([])

  useEffect(() => {
    // モックライブ配信データの生成
    const mockStreams: LiveStreamData[] = [
      {
        id: 'stream-1',
        title: 'ChatGPT活用ライブセミナー',
        description: 'ChatGPTの実践的な活用方法をリアルタイムで解説します。',
        status: 'live',
        startTime: '2024-06-18T14:00:00',
        duration: 120,
        viewerCount: 156,
        peakViewers: 203,
        streamKey: 'sk_live_1234567890abcdef',
        rtmpUrl: 'rtmp://live.example.com/live',
        playbackUrl: 'https://live.example.com/stream-1/playlist.m3u8',
        thumbnailUrl: '/api/streams/stream-1/thumbnail',
        quality: 'FHD',
        isRecording: true,
        isPublic: true,
        chatEnabled: true,
        createdAt: '2024-06-18',
        instructor: '田中AI博士',
        category: 'seminar',
        tags: ['ChatGPT', 'ライブ', 'AI活用']
      },
      {
        id: 'stream-2',
        title: 'AI画像生成ワークショップ',
        description: 'Midjourney、DALL-Eを使った画像生成技術のハンズオン。',
        status: 'starting',
        startTime: '2024-06-18T16:00:00',
        duration: 90,
        viewerCount: 0,
        peakViewers: 0,
        streamKey: 'sk_live_0987654321fedcba',
        rtmpUrl: 'rtmp://live.example.com/live',
        quality: 'HD',
        isRecording: true,
        isPublic: true,
        chatEnabled: true,
        createdAt: '2024-06-17',
        instructor: '山田クリエイター',
        category: 'workshop',
        tags: ['AI画像', 'Midjourney', 'DALL-E']
      },
      {
        id: 'stream-3',
        title: 'プロンプトエンジニアリング討論会',
        description: '効果的なプロンプト設計について専門家による討論。',
        status: 'offline',
        endTime: '2024-06-17T20:00:00',
        duration: 75,
        viewerCount: 0,
        peakViewers: 89,
        streamKey: 'sk_live_abcd1234efgh5678',
        rtmpUrl: 'rtmp://live.example.com/live',
        playbackUrl: 'https://archive.example.com/stream-3/recording.mp4',
        quality: 'FHD',
        isRecording: false,
        isPublic: true,
        chatEnabled: true,
        createdAt: '2024-06-17',
        instructor: '佐藤プロンプター',
        category: 'discussion',
        tags: ['プロンプト', '討論', 'エンジニアリング']
      },
      {
        id: 'stream-4',
        title: 'AI開発プレゼンテーション',
        description: '最新のAI開発手法についてのプレゼンテーション。',
        status: 'error',
        startTime: '2024-06-18T10:00:00',
        duration: 0,
        viewerCount: 0,
        peakViewers: 0,
        streamKey: 'sk_live_error123456789',
        rtmpUrl: 'rtmp://live.example.com/live',
        quality: 'HD',
        isRecording: false,
        isPublic: false,
        chatEnabled: false,
        createdAt: '2024-06-18',
        instructor: '鈴木開発者',
        category: 'presentation',
        tags: ['AI開発', 'プレゼン', '技術']
      }
    ]
    
    setStreams(mockStreams)
    setFilteredStreams(mockStreams)
  }, [])

  useEffect(() => {
    let filtered = streams.filter(stream => {
      const matchesSearch = stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           stream.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (stream.instructor?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           stream.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesStatus = selectedStatus === 'all' || stream.status === selectedStatus
      const matchesCategory = selectedCategory === 'all' || stream.category === selectedCategory
      
      return matchesSearch && matchesStatus && matchesCategory
    })

    setFilteredStreams(filtered)
  }, [streams, searchQuery, selectedStatus, selectedCategory])

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}:${mins.toString().padStart(2, '0')}` : `${mins}分`
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-100 text-red-800'
      case 'starting': return 'bg-yellow-100 text-yellow-800'
      case 'ending': return 'bg-orange-100 text-orange-800'
      case 'offline': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'live': return 'ライブ中'
      case 'starting': return '開始準備中'
      case 'ending': return '終了処理中'
      case 'offline': return 'オフライン'
      case 'error': return 'エラー'
      default: return 'オフライン'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <Radio size={10} className="text-red-600" />
      case 'starting': return <Play size={10} className="text-yellow-600" />
      case 'ending': return <Square size={10} className="text-orange-600" />
      case 'offline': return <Pause size={10} className="text-gray-600" />
      case 'error': return <XCircle size={10} className="text-red-600" />
      default: return <Pause size={10} className="text-gray-600" />
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'seminar': return 'セミナー'
      case 'workshop': return 'ワークショップ'
      case 'presentation': return 'プレゼンテーション'
      case 'discussion': return '討論会'
      default: return 'セミナー'
    }
  }

  const handleStreamAction = (action: string, streamId: string) => {
    switch (action) {
      case 'start':
        setStreams(streams.map(stream => 
          stream.id === streamId ? { ...stream, status: 'starting' } : stream
        ))
        // 実際の実装では配信開始APIを呼び出し
        setTimeout(() => {
          setStreams(prev => prev.map(stream => 
            stream.id === streamId ? { ...stream, status: 'live', startTime: new Date().toISOString() } : stream
          ))
        }, 3000)
        break
      case 'stop':
        if (confirm('配信を停止しますか？')) {
          setStreams(streams.map(stream => 
            stream.id === streamId ? { ...stream, status: 'ending' } : stream
          ))
          setTimeout(() => {
            setStreams(prev => prev.map(stream => 
              stream.id === streamId ? { ...stream, status: 'offline', endTime: new Date().toISOString() } : stream
            ))
          }, 2000)
        }
        break
      case 'edit':
        window.location.href = `/admin/live/${streamId}/edit`
        break
      case 'view':
        window.open(`/live/${streamId}`, '_blank')
        break
      case 'settings':
        window.location.href = `/admin/live/${streamId}/settings`
        break
      case 'delete':
        if (confirm('この配信設定を削除しますか？')) {
          setStreams(streams.filter(stream => stream.id !== streamId))
        }
        break
    }
  }

  const handleSelectStream = (streamId: string) => {
    setSelectedStreams(prev => 
      prev.includes(streamId)
        ? prev.filter(id => id !== streamId)
        : [...prev, streamId]
    )
  }

  const handleSelectAll = () => {
    if (selectedStreams.length === filteredStreams.length) {
      setSelectedStreams([])
    } else {
      setSelectedStreams(filteredStreams.map(stream => stream.id))
    }
  }

  const stats = {
    total: streams.length,
    live: streams.filter(s => s.status === 'live').length,
    scheduled: streams.filter(s => s.status === 'starting').length,
    offline: streams.filter(s => s.status === 'offline').length,
    totalViewers: streams.reduce((sum, s) => sum + s.viewerCount, 0),
    totalPeakViewers: streams.reduce((sum, s) => sum + s.peakViewers, 0),
    publicStreams: streams.filter(s => s.isPublic).length,
    recordingStreams: streams.filter(s => s.isRecording).length
  }

  return (
    <AdminLayout currentPage="live">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ライブ配信管理</h1>
            <p className="text-gray-600">リアルタイム配信の作成・管理・監視を行います</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/live/create"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Radio size={18} />
              新規配信作成
            </Link>
            <Link
              href="/admin/live/settings"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Settings size={18} />
              配信設定
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総配信数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Radio size={12} className="text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ライブ中</p>
                <p className="text-2xl font-bold text-red-600">{stats.live}</p>
              </div>
              <Play size={12} className="text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">準備中</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.scheduled}</p>
              </div>
              <Clock size={12} className="text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">オフライン</p>
                <p className="text-2xl font-bold text-gray-600">{stats.offline}</p>
              </div>
              <Pause size={12} className="text-gray-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">現在視聴者</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalViewers.toLocaleString()}</p>
              </div>
              <Users size={12} className="text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">最大同時視聴</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalPeakViewers.toLocaleString()}</p>
              </div>
              <Eye size={12} className="text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">公開配信</p>
                <p className="text-2xl font-bold text-blue-600">{stats.publicStreams}</p>
              </div>
              <Share2 size={12} className="text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">録画中</p>
                <p className="text-2xl font-bold text-orange-600">{stats.recordingStreams}</p>
              </div>
              <Video size={12} className="text-orange-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search size={12} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="配信タイトル、講師名、タグで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">すべてのステータス</option>
                <option value="live">ライブ中</option>
                <option value="starting">開始準備中</option>
                <option value="offline">オフライン</option>
                <option value="error">エラー</option>
              </select>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">すべてのカテゴリー</option>
                <option value="seminar">セミナー</option>
                <option value="workshop">ワークショップ</option>
                <option value="presentation">プレゼンテーション</option>
                <option value="discussion">討論会</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {filteredStreams.length}件の配信を表示中 (全{streams.length}件)
            </div>
            
            {selectedStreams.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {selectedStreams.length}件選択中
                </span>
                <div className="flex gap-2">
                  <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                    一括停止
                  </button>
                  <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors">
                    一括削除
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Streams Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedStreams.length === filteredStreams.length && filteredStreams.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    配信情報
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス・品質
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    視聴者・時間
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    設定・機能
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStreams.map((stream) => (
                  <tr key={stream.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedStreams.includes(stream.id)}
                        onChange={() => handleSelectStream(stream.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center text-white">
                          <Radio size={10} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">
                              {stream.title}
                            </h3>
                            {stream.status === 'live' && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                                LIVE
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                            {stream.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {stream.instructor && (
                              <span>👨‍🏫 {stream.instructor}</span>
                            )}
                            <span>📂 {getCategoryLabel(stream.category)}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {stream.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(stream.status)}
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(stream.status)}`}>
                            {getStatusLabel(stream.status)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          品質: {stream.quality}
                        </div>
                        {stream.status === 'error' && (
                          <div className="flex items-center gap-1 text-xs text-red-600">
                            <AlertCircle size={12} />
                            配信エラー
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Users size={14} />
                          現在: {stream.viewerCount.toLocaleString()}人
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Eye size={14} />
                          最大: {stream.peakViewers.toLocaleString()}人
                        </div>
                        {stream.startTime && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock size={14} />
                            {stream.status === 'live' ? '開始: ' : '時間: '}
                            {stream.status === 'live' ? formatDateTime(stream.startTime) : formatDuration(stream.duration || 0)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${stream.isPublic ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          {stream.isPublic ? '公開' : '非公開'}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${stream.isRecording ? 'bg-red-500' : 'bg-gray-400'}`}></span>
                          {stream.isRecording ? '録画中' : '録画停止'}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${stream.chatEnabled ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
                          {stream.chatEnabled ? 'チャット有効' : 'チャット無効'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {stream.status === 'offline' || stream.status === 'error' ? (
                          <button
                            onClick={() => handleStreamAction('start', stream.id)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="配信開始"
                          >
                            <Play size={10} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStreamAction('stop', stream.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="配信停止"
                          >
                            <Square size={10} />
                          </button>
                        )}
                        <button
                          onClick={() => handleStreamAction('view', stream.id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="プレビュー"
                        >
                          <Eye size={10} />
                        </button>
                        <button
                          onClick={() => handleStreamAction('edit', stream.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="編集"
                        >
                          <Edit size={10} />
                        </button>
                        <button
                          onClick={() => handleStreamAction('settings', stream.id)}
                          className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                          title="設定"
                        >
                          <Settings size={10} />
                        </button>
                        <button
                          onClick={() => handleStreamAction('delete', stream.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="削除"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredStreams.length === 0 && (
            <div className="text-center py-12">
              <Radio size={29} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                配信が見つかりません
              </h3>
              <p className="text-gray-600 mb-4">
                検索条件を変更するか、新しい配信を作成してください
              </p>
              <Link
                href="/admin/live/create"
                className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Radio size={18} />
                新規配信作成
              </Link>
            </div>
          )}
        </div>

        {/* Quick Setup Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Radio size={12} />
              配信開始ガイド
            </h3>
            <div className="space-y-3 text-blue-800 text-sm">
              <div className="flex items-start gap-3">
                <span className="bg-blue-200 text-blue-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">1</span>
                <div>
                  <p className="font-medium">配信設定作成</p>
                  <p className="text-blue-700">タイトル、説明、カテゴリーを設定します</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-blue-200 text-blue-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">2</span>
                <div>
                  <p className="font-medium">OBS設定</p>
                  <p className="text-blue-700">RTMP URLとストリームキーを配信ソフトに入力</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-blue-200 text-blue-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">3</span>
                <div>
                  <p className="font-medium">配信開始</p>
                  <p className="text-blue-700">「配信開始」ボタンでライブ配信を開始</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
              <Settings size={12} />
              推奨設定
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-1">
                  <Camera size={10} />
                  映像設定
                </h4>
                <ul className="space-y-1 text-green-700 text-sm">
                  <li>• 解像度: 1920x1080 (Full HD)</li>
                  <li>• フレームレート: 30fps</li>
                  <li>• ビットレート: 2500-6000 kbps</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-1">
                  <Mic size={10} />
                  音声設定
                </h4>
                <ul className="space-y-1 text-green-700 text-sm">
                  <li>• サンプルレート: 48kHz</li>
                  <li>• ビットレート: 128-320 kbps</li>
                  <li>• エンコーダ: AAC</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}