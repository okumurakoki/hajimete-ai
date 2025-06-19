'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  Video, 
  Play, 
  Square, 
  Users, 
  Calendar, 
  Eye, 
  Settings, 
  Copy,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  Radio,
  Monitor,
  Wifi,
  BarChart3,
  MessageSquare,
  Heart,
  TrendingUp,
  RefreshCw,
  Filter,
  Search,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Zap,
  Shield,
  Download,
  Upload
} from 'lucide-react'

interface LiveStream {
  id: string
  title: string
  description: string
  status: 'scheduled' | 'live' | 'ended' | 'preparing'
  scheduledAt: string
  startedAt?: string
  endedAt?: string
  viewers: number
  maxViewers: number
  totalViews: number
  department: string
  isPremium: boolean
  streamKey?: string
  streamUrl?: string
  recordingUrl?: string
  chatEnabled: boolean
  chatMessages: number
  qualitySettings: {
    resolution: string
    bitrate: number
    fps: number
  }
  analytics: {
    averageWatchTime: number
    engagementRate: number
    dropoffRate: number
  }
}

interface StreamAnalytics {
  totalStreams: number
  activeStreams: number
  totalViewers: number
  totalWatchTime: number
  averageEngagement: number
}

export default function LiveStreamManager() {
  const { isAdmin } = useAuth()
  const [streams, setStreams] = useState<LiveStream[]>([])
  const [analytics, setAnalytics] = useState<StreamAnalytics>({
    totalStreams: 0,
    activeStreams: 0,
    totalViewers: 0,
    totalWatchTime: 0,
    averageEngagement: 0
  })
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)

  const [newStream, setNewStream] = useState({
    title: '',
    description: '',
    department: 'AI基礎学部',
    isPremium: false,
    scheduledAt: '',
    chatEnabled: true,
    resolution: '1080p',
    bitrate: 4000,
    fps: 30
  })

  // モックデータを初期化
  useEffect(() => {
    const mockStreams: LiveStream[] = [
      {
        id: '1',
        title: 'ChatGPT実践活用セミナー',
        description: 'ビジネスシーンでのChatGPT活用法をライブ解説します。プロンプトエンジニアリングの基礎から応用まで、実際の事例を交えながら学習できます。',
        status: 'live',
        scheduledAt: new Date().toISOString(),
        startedAt: new Date(Date.now() - 1800000).toISOString(),
        viewers: 245,
        maxViewers: 287,
        totalViews: 892,
        department: 'AI基礎学部',
        isPremium: false,
        streamKey: 'live_sk_abcd1234efgh5678',
        streamUrl: 'rtmp://live.hajimete-ai.com/live/abcd1234efgh5678',
        chatEnabled: true,
        chatMessages: 156,
        qualitySettings: {
          resolution: '1080p',
          bitrate: 4000,
          fps: 30
        },
        analytics: {
          averageWatchTime: 34.5,
          engagementRate: 78.5,
          dropoffRate: 15.2
        }
      },
      {
        id: '2',
        title: 'プレミアム限定：AI開発者向け技術セッション',
        description: 'TensorFlowを使った機械学習モデルの構築方法を詳しく解説します。実際のコーディングセッションを含む技術者向けコンテンツです。',
        status: 'scheduled',
        scheduledAt: new Date(Date.now() + 3600000).toISOString(),
        viewers: 0,
        maxViewers: 0,
        totalViews: 0,
        department: 'エンジニアリング学部',
        isPremium: true,
        streamKey: 'live_sk_efgh5678ijkl9012',
        streamUrl: 'rtmp://live.hajimete-ai.com/live/efgh5678ijkl9012',
        chatEnabled: true,
        chatMessages: 0,
        qualitySettings: {
          resolution: '1080p',
          bitrate: 6000,
          fps: 60
        },
        analytics: {
          averageWatchTime: 0,
          engagementRate: 0,
          dropoffRate: 0
        }
      },
      {
        id: '3',
        title: 'Excel業務効率化マスタークラス',
        description: 'Excel関数とマクロを活用して、日常業務の作業時間を50%短縮する実践的な方法を学びます。',
        status: 'ended',
        scheduledAt: new Date(Date.now() - 7200000).toISOString(),
        startedAt: new Date(Date.now() - 7200000).toISOString(),
        endedAt: new Date(Date.now() - 3600000).toISOString(),
        viewers: 0,
        maxViewers: 158,
        totalViews: 412,
        department: '実践活用学部',
        isPremium: false,
        recordingUrl: 'https://vimeo.com/123456789',
        chatEnabled: true,
        chatMessages: 89,
        qualitySettings: {
          resolution: '720p',
          bitrate: 2500,
          fps: 30
        },
        analytics: {
          averageWatchTime: 42.3,
          engagementRate: 65.8,
          dropoffRate: 22.1
        }
      },
      {
        id: '4',
        title: 'AI×マーケティング戦略講座',
        description: 'AIツールを活用したマーケティング戦略の立案と実行方法について解説します。',
        status: 'preparing',
        scheduledAt: new Date(Date.now() + 1800000).toISOString(),
        viewers: 0,
        maxViewers: 0,
        totalViews: 0,
        department: 'マーケティング学部',
        isPremium: false,
        streamKey: 'live_sk_ijkl9012mnop3456',
        streamUrl: 'rtmp://live.hajimete-ai.com/live/ijkl9012mnop3456',
        chatEnabled: true,
        chatMessages: 0,
        qualitySettings: {
          resolution: '1080p',
          bitrate: 3500,
          fps: 30
        },
        analytics: {
          averageWatchTime: 0,
          engagementRate: 0,
          dropoffRate: 0
        }
      }
    ]

    setStreams(mockStreams)
    
    // 分析データを計算
    const totalViewers = mockStreams.reduce((sum, stream) => sum + stream.viewers, 0)
    const activeStreams = mockStreams.filter(stream => stream.status === 'live' || stream.status === 'preparing').length
    const totalWatchTime = mockStreams.reduce((sum, stream) => sum + (stream.analytics.averageWatchTime * stream.totalViews), 0)
    const averageEngagement = mockStreams.reduce((sum, stream) => sum + stream.analytics.engagementRate, 0) / mockStreams.length

    setAnalytics({
      totalStreams: mockStreams.length,
      activeStreams,
      totalViewers,
      totalWatchTime: Math.round(totalWatchTime / 60), // 時間に変換
      averageEngagement: Math.round(averageEngagement * 10) / 10
    })
  }, [])

  const filteredStreams = streams.filter(stream => {
    const matchesSearch = stream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stream.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || stream.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateStream = async () => {
    setIsLoading(true)
    
    // API呼び出しをシミュレート
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const stream: LiveStream = {
      id: Date.now().toString(),
      title: newStream.title,
      description: newStream.description,
      status: 'scheduled',
      scheduledAt: newStream.scheduledAt,
      viewers: 0,
      maxViewers: 0,
      totalViews: 0,
      department: newStream.department,
      isPremium: newStream.isPremium,
      streamKey: `live_sk_${Math.random().toString(36).substr(2, 16)}`,
      streamUrl: `rtmp://live.hajimete-ai.com/live/${Math.random().toString(36).substr(2, 16)}`,
      chatEnabled: newStream.chatEnabled,
      chatMessages: 0,
      qualitySettings: {
        resolution: newStream.resolution,
        bitrate: newStream.bitrate,
        fps: newStream.fps
      },
      analytics: {
        averageWatchTime: 0,
        engagementRate: 0,
        dropoffRate: 0
      }
    }

    setStreams([stream, ...streams])
    setNewStream({
      title: '',
      description: '',
      department: 'AI基礎学部',
      isPremium: false,
      scheduledAt: '',
      chatEnabled: true,
      resolution: '1080p',
      bitrate: 4000,
      fps: 30
    })
    setShowCreateForm(false)
    setIsLoading(false)
  }

  const handleStreamAction = (streamId: string, action: 'start' | 'end' | 'prepare') => {
    setStreams(streams.map(stream => {
      if (stream.id === streamId) {
        const now = new Date().toISOString()
        switch (action) {
          case 'prepare':
            return { ...stream, status: 'preparing' as const }
          case 'start':
            return { 
              ...stream, 
              status: 'live' as const, 
              startedAt: now,
              viewers: Math.floor(Math.random() * 100) + 50
            }
          case 'end':
            return { 
              ...stream, 
              status: 'ended' as const, 
              endedAt: now,
              viewers: 0,
              recordingUrl: 'https://vimeo.com/123456789'
            }
          default:
            return stream
        }
      }
      return stream
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('クリップボードにコピーしました')
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      live: { color: 'bg-red-100 text-red-800', icon: Radio, text: 'ライブ中' },
      scheduled: { color: 'bg-blue-100 text-blue-800', icon: Calendar, text: '予定' },
      ended: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle, text: '終了' },
      preparing: { color: 'bg-yellow-100 text-yellow-800', icon: Settings, text: '準備中' }
    }
    
    const badge = badges[status as keyof typeof badges]
    const IconComponent = badge.icon

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <IconComponent size={10} />
        {badge.text}
      </span>
    )
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}時間${minutes}分`
    }
    return `${minutes}分`
  }

  if (!isAdmin) {
    return (
      <AdminLayout currentPage="livestream">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">アクセス権限がありません</h2>
            <p className="text-gray-600">この機能は管理者のみ利用できます。</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout currentPage="livestream">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ライブ配信管理</h1>
            <p className="text-gray-600 mt-1">ライブ配信の作成、管理、分析を行います</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            新しい配信を作成
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総配信数</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalStreams}</p>
              </div>
              <Video className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">アクティブ配信</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.activeStreams}</p>
              </div>
              <Radio className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">現在の視聴者</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalViewers}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総視聴時間</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalWatchTime}h</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">平均エンゲージメント</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.averageEngagement}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="配信を検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">全ステータス</option>
                <option value="live">ライブ中</option>
                <option value="scheduled">予定</option>
                <option value="preparing">準備中</option>
                <option value="ended">終了</option>
              </select>
            </div>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Streams List */}
        <div className="space-y-4">
          {filteredStreams.map((stream) => (
            <div key={stream.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{stream.title}</h3>
                    {getStatusBadge(stream.status)}
                    {stream.isPremium && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                        <Shield size={10} className="inline mr-1" />
                        プレミアム
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{stream.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{stream.department}</span>
                    <span>•</span>
                    <span>{new Date(stream.scheduledAt).toLocaleString('ja-JP')}</span>
                    {stream.status === 'live' && stream.startedAt && (
                      <>
                        <span>•</span>
                        <span>配信時間: {formatDuration((Date.now() - new Date(stream.startedAt).getTime()) / 1000)}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {stream.status === 'scheduled' && (
                    <button
                      onClick={() => handleStreamAction(stream.id, 'prepare')}
                      className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg text-sm hover:bg-yellow-200 transition-colors"
                    >
                      準備開始
                    </button>
                  )}
                  {stream.status === 'preparing' && (
                    <button
                      onClick={() => handleStreamAction(stream.id, 'start')}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition-colors flex items-center gap-1"
                    >
                      <Play size={12} />
                      配信開始
                    </button>
                  )}
                  {stream.status === 'live' && (
                    <button
                      onClick={() => handleStreamAction(stream.id, 'end')}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center gap-1"
                    >
                      <Square size={12} />
                      配信終了
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedStream(selectedStream?.id === stream.id ? null : stream)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {selectedStream?.id === stream.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
                    <Users size={16} />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{stream.viewers}</div>
                  <div className="text-xs text-gray-500">現在の視聴者</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
                    <TrendingUp size={16} />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{stream.maxViewers}</div>
                  <div className="text-xs text-gray-500">最大視聴者数</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-purple-600 mb-1">
                    <MessageSquare size={16} />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{stream.chatMessages}</div>
                  <div className="text-xs text-gray-500">チャット数</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-orange-600 mb-1">
                    <BarChart3 size={16} />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{stream.analytics.engagementRate}%</div>
                  <div className="text-xs text-gray-500">エンゲージメント</div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedStream?.id === stream.id && (
                <div className="border-t pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Stream Settings */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Settings size={16} />
                        配信設定
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">解像度:</span>
                          <span className="font-medium">{stream.qualitySettings.resolution}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ビットレート:</span>
                          <span className="font-medium">{stream.qualitySettings.bitrate} kbps</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">フレームレート:</span>
                          <span className="font-medium">{stream.qualitySettings.fps} fps</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">チャット:</span>
                          <span className="font-medium">{stream.chatEnabled ? '有効' : '無効'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stream URLs */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <ExternalLink size={16} />
                        配信情報
                      </h4>
                      <div className="space-y-3">
                        {stream.streamUrl && (
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">配信URL</label>
                            <div className="flex gap-2">
                              <input
                                value={stream.streamUrl}
                                readOnly
                                className="flex-1 text-xs bg-gray-50 border border-gray-300 rounded px-2 py-1 font-mono"
                              />
                              <button
                                onClick={() => copyToClipboard(stream.streamUrl!)}
                                className="p-1 text-gray-500 hover:text-gray-700"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {stream.streamKey && (
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">ストリームキー</label>
                            <div className="flex gap-2">
                              <input
                                value={stream.streamKey}
                                readOnly
                                className="flex-1 text-xs bg-gray-50 border border-gray-300 rounded px-2 py-1 font-mono"
                              />
                              <button
                                onClick={() => copyToClipboard(stream.streamKey!)}
                                className="p-1 text-gray-500 hover:text-gray-700"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                          </div>
                        )}

                        {stream.recordingUrl && (
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">録画URL</label>
                            <div className="flex gap-2">
                              <input
                                value={stream.recordingUrl}
                                readOnly
                                className="flex-1 text-xs bg-gray-50 border border-gray-300 rounded px-2 py-1 font-mono"
                              />
                              <a
                                href={stream.recordingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-gray-500 hover:text-gray-700"
                              >
                                <ExternalLink size={14} />
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Analytics */}
                  {stream.status === 'ended' && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <BarChart3 size={16} />
                        分析結果
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-blue-800 font-medium">平均視聴時間</div>
                          <div className="text-blue-900 text-lg font-bold">{stream.analytics.averageWatchTime}分</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="text-green-800 font-medium">エンゲージメント率</div>
                          <div className="text-green-900 text-lg font-bold">{stream.analytics.engagementRate}%</div>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                          <div className="text-red-800 font-medium">離脱率</div>
                          <div className="text-red-900 text-lg font-bold">{stream.analytics.dropoffRate}%</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredStreams.length === 0 && (
          <div className="text-center py-12">
            <Video size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">配信が見つかりません</h3>
            <p className="text-gray-600">検索条件を変更するか、新しい配信を作成してください。</p>
          </div>
        )}

        {/* Create Stream Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">新しい配信を作成</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">配信タイトル</label>
                    <input
                      type="text"
                      value={newStream.title}
                      onChange={(e) => setNewStream({...newStream, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="配信のタイトルを入力"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">説明</label>
                    <textarea
                      value={newStream.description}
                      onChange={(e) => setNewStream({...newStream, description: e.target.value})}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="配信の内容説明"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">学部</label>
                      <select
                        value={newStream.department}
                        onChange={(e) => setNewStream({...newStream, department: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="AI基礎学部">AI基礎学部</option>
                        <option value="実践活用学部">実践活用学部</option>
                        <option value="エンジニアリング学部">エンジニアリング学部</option>
                        <option value="マーケティング学部">マーケティング学部</option>
                        <option value="ビジネス応用学部">ビジネス応用学部</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">開始予定時刻</label>
                      <input
                        type="datetime-local"
                        value={newStream.scheduledAt}
                        onChange={(e) => setNewStream({...newStream, scheduledAt: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">解像度</label>
                      <select
                        value={newStream.resolution}
                        onChange={(e) => setNewStream({...newStream, resolution: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="720p">720p</option>
                        <option value="1080p">1080p</option>
                        <option value="1440p">1440p</option>
                        <option value="4K">4K</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ビットレート (kbps)</label>
                      <input
                        type="number"
                        value={newStream.bitrate}
                        onChange={(e) => setNewStream({...newStream, bitrate: parseInt(e.target.value)})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1000"
                        max="10000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">FPS</label>
                      <select
                        value={newStream.fps}
                        onChange={(e) => setNewStream({...newStream, fps: parseInt(e.target.value)})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={24}>24</option>
                        <option value={30}>30</option>
                        <option value={60}>60</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newStream.isPremium}
                        onChange={(e) => setNewStream({...newStream, isPremium: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">プレミアム限定</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newStream.chatEnabled}
                        onChange={(e) => setNewStream({...newStream, chatEnabled: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">チャット機能</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleCreateStream}
                    disabled={!newStream.title || !newStream.scheduledAt || isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        作成中...
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        配信を作成
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}