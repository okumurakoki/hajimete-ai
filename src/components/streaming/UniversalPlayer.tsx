'use client'

import { useState, useEffect } from 'react'
import ZoomIntegration from './ZoomIntegration'
import VimeoIntegration from './VimeoIntegration'
import { 
  Video,
  Radio,
  Calendar,
  ExternalLink,
  Settings,
  Monitor,
  Users,
  MessageCircle,
  Share2,
  Bookmark,
  Download,
  MoreVertical
} from 'lucide-react'

export type StreamingPlatform = 'zoom' | 'vimeo' | 'youtube' | 'twitch' | 'custom'

export interface StreamConfig {
  platform: StreamingPlatform
  title: string
  description?: string
  instructor?: string
  scheduledTime?: string
  duration?: number
  isLive?: boolean
  isPremium?: boolean
  
  // Platform-specific configs
  zoom?: {
    meetingNumber: string
    userName: string
    userEmail: string
    passWord?: string
    role: 0 | 1
    sdkKey: string
    sdkSecret: string
    signature: string
  }
  
  vimeo?: {
    videoId: string
    accessToken?: string
    autoplay?: boolean
    muted?: boolean
    loop?: boolean
    controls?: boolean
    responsive?: boolean
    width?: number
    height?: number
    quality?: 'auto' | '240p' | '360p' | '480p' | '720p' | '1080p'
  }
  
  youtube?: {
    videoId: string
    channelId?: string
    apiKey?: string
    autoplay?: boolean
    muted?: boolean
    controls?: boolean
    modestbranding?: boolean
  }
  
  custom?: {
    embedUrl: string
    width?: number
    height?: number
    allowFullscreen?: boolean
  }
}

interface UniversalPlayerProps {
  config: StreamConfig
  onStreamStart?: () => void
  onStreamEnd?: () => void
  onUserJoin?: (userId: string) => void
  onUserLeave?: (userId: string) => void
  className?: string
  showMetadata?: boolean
  showChat?: boolean
  showControls?: boolean
}

export default function UniversalPlayer({
  config,
  onStreamStart,
  onStreamEnd,
  onUserJoin,
  onUserLeave,
  className = "",
  showMetadata = true,
  showChat = true,
  showControls = true
}: UniversalPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [viewerCount, setViewerCount] = useState(0)
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string
    user: string
    message: string
    timestamp: Date
  }>>([])
  const [newMessage, setNewMessage] = useState('')
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    // モック視聴者数の更新
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 3) - 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const renderPlayer = () => {
    switch (config.platform) {
      case 'zoom':
        if (!config.zoom) {
          return <div className="text-red-500">Zoom設定が見つかりません</div>
        }
        return (
          <ZoomIntegration
            config={config.zoom}
            onJoinSuccess={() => {
              setIsLoading(false)
              onStreamStart?.()
            }}
            onJoinError={() => setIsLoading(false)}
            onLeave={onStreamEnd}
            className="w-full h-full"
          />
        )

      case 'vimeo':
        if (!config.vimeo) {
          return <div className="text-red-500">Vimeo設定が見つかりません</div>
        }
        return (
          <VimeoIntegration
            config={config.vimeo}
            onPlay={() => {
              setIsLoading(false)
              onStreamStart?.()
            }}
            onEnded={onStreamEnd}
            className="w-full h-full"
          />
        )

      case 'youtube':
        return (
          <div className="w-full h-full">
            <iframe
              src={`https://www.youtube.com/embed/${config.youtube?.videoId}?autoplay=${config.youtube?.autoplay ? 1 : 0}&mute=${config.youtube?.muted ? 1 : 0}&controls=${config.youtube?.controls ? 1 : 0}&modestbranding=${config.youtube?.modestbranding ? 1 : 0}`}
              className="w-full h-full min-h-96"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; encrypted-media"
              onLoad={() => setIsLoading(false)}
            />
          </div>
        )

      case 'custom':
        if (!config.custom) {
          return <div className="text-red-500">カスタム設定が見つかりません</div>
        }
        return (
          <div className="w-full h-full">
            <iframe
              src={config.custom.embedUrl}
              className="w-full h-full min-h-96"
              width={config.custom.width}
              height={config.custom.height}
              frameBorder="0"
              allowFullScreen={config.custom.allowFullscreen}
              onLoad={() => setIsLoading(false)}
            />
          </div>
        )

      default:
        return <div className="text-gray-500">サポートされていないプラットフォームです</div>
    }
  }

  const getPlatformIcon = () => {
    switch (config.platform) {
      case 'zoom':
        return <Video className="text-blue-600" size={12} />
      case 'vimeo':
        return <Video className="text-blue-500" size={12} />
      case 'youtube':
        return <Video className="text-red-600" size={12} />
      case 'twitch':
        return <Radio className="text-purple-600" size={12} />
      default:
        return <Monitor className="text-gray-600" size={12} />
    }
  }

  const getPlatformName = () => {
    switch (config.platform) {
      case 'zoom':
        return 'Zoom'
      case 'vimeo':
        return 'Vimeo'
      case 'youtube':
        return 'YouTube'
      case 'twitch':
        return 'Twitch'
      case 'custom':
        return 'カスタム配信'
      default:
        return '配信'
    }
  }

  const sendChatMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now().toString(),
      user: 'あなた',
      message: newMessage,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      {showMetadata && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getPlatformIcon()}
                <span className="text-sm font-medium text-gray-600">{getPlatformName()}</span>
                {config.isLive && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                    LIVE
                  </span>
                )}
                {config.isPremium && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    プレミアム
                  </span>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-1">{config.title}</h2>
              
              {config.description && (
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{config.description}</p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {config.instructor && (
                  <span>👨‍🏫 {config.instructor}</span>
                )}
                {config.scheduledTime && (
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatTime(config.scheduledTime)}
                  </div>
                )}
                {config.duration && (
                  <span>{config.duration}分</span>
                )}
                {viewerCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    {viewerCount.toLocaleString()}人視聴中
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="ブックマーク"
              >
                <Bookmark size={10} />
              </button>
              
              <button 
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                title="共有"
              >
                <Share2 size={10} />
              </button>
              
              <button 
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                title="外部で開く"
              >
                <ExternalLink size={10} />
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                title="設定"
              >
                <MoreVertical size={10} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Player Area */}
        <div className="flex-1">
          {renderPlayer()}
        </div>

        {/* Chat Sidebar */}
        {showChat && config.isLive && (
          <div className="w-80 border-l border-gray-200 flex flex-col">
            <div className="p-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <MessageCircle size={10} />
                ライブチャット
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-96">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{msg.user}</span>
                    <span className="text-xs text-gray-500">
                      {msg.timestamp.toLocaleTimeString('ja-JP', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700">{msg.message}</p>
                </div>
              ))}
              
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-8">
                  まだチャットメッセージがありません
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="メッセージを入力..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  送信
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-lg border-l border-gray-200 z-10">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">設定</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                画質
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>自動</option>
                <option>1080p</option>
                <option>720p</option>
                <option>480p</option>
                <option>360p</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                再生速度
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>0.5x</option>
                <option selected>1x</option>
                <option>1.25x</option>
                <option>1.5x</option>
                <option>2x</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">自動再生</span>
              <input type="checkbox" className="rounded border-gray-300" />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">字幕</span>
              <input type="checkbox" className="rounded border-gray-300" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}