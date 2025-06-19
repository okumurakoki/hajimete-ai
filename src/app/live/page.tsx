'use client'

import { useState, useEffect } from 'react'
// import { useUser } from '@clerk/nextjs'

export const dynamic = 'force-dynamic'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LiveChat from '@/components/LiveChat'
import UniversalPlayer, { StreamConfig } from '@/components/streaming/UniversalPlayer'
import { LiveStream, generateMockLiveStreams, isLiveNow, getTimeUntilStart, formatDateTime } from '@/lib/live'
import { 
  Radio,
  Calendar,
  Users,
  Clock,
  Star,
  Filter,
  Search,
  Play,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  List,
  ArrowRight,
  Video,
  Settings
} from 'lucide-react'

interface ExtendedLiveStream extends LiveStream {
  platform: 'zoom' | 'vimeo' | 'youtube' | 'twitch' | 'custom'
  streamConfig?: StreamConfig
}

export default function LivePage() {
  // const { user } = useUser()
  const user = { unsafeMetadata: { plan: 'basic' } } // Mock for build compatibility
  const [streams, setStreams] = useState<ExtendedLiveStream[]>([])
  const [selectedStream, setSelectedStream] = useState<ExtendedLiveStream | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [useUniversalPlayer, setUseUniversalPlayer] = useState(false)

  useEffect(() => {
    const mockStreams = generateMockLiveStreams()
    
    // 拡張配信データに変換
    const extendedStreams: ExtendedLiveStream[] = mockStreams.map((stream, index) => {
      const platforms = ['zoom', 'vimeo', 'youtube', 'twitch'] as const
      const platform = platforms[index % platforms.length]
      
      let streamConfig: StreamConfig = {
        platform,
        title: stream.title,
        description: stream.description,
        instructor: stream.instructor,
        scheduledTime: stream.startTime,
        duration: stream.duration,
        isLive: isLiveNow(stream),
        isPremium: stream.isPremium
      }

      // プラットフォーム別の設定
      switch (platform) {
        case 'zoom':
          streamConfig.zoom = {
            meetingNumber: '123-456-789',
            userName: 'ユーザー',
            userEmail: 'user@example.com',
            passWord: 'ai2024',
            role: 0,
            sdkKey: 'your-sdk-key',
            sdkSecret: 'your-sdk-secret',
            signature: 'your-signature'
          }
          break
        case 'vimeo':
          streamConfig.vimeo = {
            videoId: '76979871',
            autoplay: false,
            muted: false,
            controls: true
          }
          break
        case 'youtube':
          streamConfig.youtube = {
            videoId: 'dQw4w9WgXcQ',
            autoplay: false,
            muted: false,
            controls: true
          }
          break
      }

      return {
        ...stream,
        platform,
        streamConfig
      }
    })
    
    setStreams(extendedStreams)
    
    // 現在ライブ中の配信があれば自動選択
    const liveStream = extendedStreams.find(stream => isLiveNow(stream))
    if (liveStream) {
      setSelectedStream(liveStream)
    } else {
      setSelectedStream(extendedStreams[0])
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const userPlan = user?.unsafeMetadata?.plan as string

  if (!selectedStream) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">📺</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">配信情報を読み込み中...</h2>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const isCurrentlyLive = isLiveNow(selectedStream)
  const canWatch = !selectedStream.isPremium || userPlan === 'premium'

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'zoom': return 'Zoom'
      case 'vimeo': return 'Vimeo'
      case 'youtube': return 'YouTube'
      case 'twitch': return 'Twitch'
      default: return 'その他'
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'zoom': return 'bg-blue-100 text-blue-800'
      case 'vimeo': return 'bg-cyan-100 text-cyan-800'
      case 'youtube': return 'bg-red-100 text-red-800'
      case 'twitch': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Player Mode Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">ライブ配信・動画</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">配信プレイヤー:</span>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setUseUniversalPlayer(false)}
                className={`px-4 py-2 text-sm ${!useUniversalPlayer ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              >
                シンプル
              </button>
              <button
                onClick={() => setUseUniversalPlayer(true)}
                className={`px-4 py-2 text-sm ${useUniversalPlayer ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              >
                統合プレイヤー
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-3">
            {/* Video Player */}
            {useUniversalPlayer && selectedStream.streamConfig && canWatch ? (
              <div className="mb-6">
                <UniversalPlayer
                  config={selectedStream.streamConfig}
                  className="w-full"
                  showMetadata={true}
                  showChat={isCurrentlyLive}
                  showControls={true}
                  onStreamStart={() => console.log('Stream started')}
                  onStreamEnd={() => console.log('Stream ended')}
                />
              </div>
            ) : (
              <div className="bg-black rounded-lg overflow-hidden shadow-lg mb-6">
                <div className="relative aspect-video">
                  {canWatch ? (
                    <>
                      {/* Mock Video Player */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                        {isCurrentlyLive ? (
                          <div className="text-center text-white">
                            <div className="text-6xl mb-4">📡</div>
                            <h3 className="text-2xl font-bold mb-2">ライブ配信中</h3>
                            <p className="text-gray-300 mb-4">実際の配信では、ここに動画プレイヤーが表示されます</p>
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getPlatformColor(selectedStream.platform)}`}>
                                {getPlatformName(selectedStream.platform)}
                              </span>
                            </div>
                            <button
                              onClick={() => setUseUniversalPlayer(true)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              統合プレイヤーで視聴
                            </button>
                          </div>
                        ) : (
                          <div className="text-center text-white">
                            <div className="text-6xl mb-4">⏰</div>
                            <h3 className="text-2xl font-bold mb-2">配信準備中</h3>
                            <p className="text-gray-300 mb-4">{getTimeUntilStart(selectedStream)}に開始予定</p>
                            <div className="flex items-center justify-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getPlatformColor(selectedStream.platform)}`}>
                                {getPlatformName(selectedStream.platform)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Live Indicator */}
                      {isCurrentlyLive && (
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            LIVE
                          </div>
                          <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                            {selectedStream.currentParticipants}人視聴中
                          </div>
                        </div>
                      )}

                      {/* Premium Badge */}
                      {selectedStream.isPremium && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            プレミアム限定
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                      <div className="text-center text-white p-8">
                        <div className="text-6xl mb-4">🔒</div>
                        <h3 className="text-2xl font-bold mb-4">プレミアム限定配信</h3>
                        <p className="text-purple-100 mb-6">
                          この配信はプレミアムプランの方のみご視聴いただけます
                        </p>
                        <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                          プレミアムプランにアップグレード
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stream Info */}
            {!useUniversalPlayer && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPlatformColor(selectedStream.platform)}`}>
                        {getPlatformName(selectedStream.platform)}
                      </span>
                      {selectedStream.isPremium && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                          プレミアム
                        </span>
                      )}
                      {isCurrentlyLive && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium animate-pulse">
                          LIVE
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedStream.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        👨‍🏫 {selectedStream.instructor}
                      </span>
                      <span className="flex items-center gap-1">
                        🏫 {selectedStream.department}
                      </span>
                      <span className="flex items-center gap-1">
                        ⏱️ {selectedStream.duration}分
                      </span>
                    </div>
                    <p className="text-gray-700">
                      {selectedStream.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    {isCurrentlyLive ? (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{selectedStream.currentParticipants}</div>
                        <div className="text-sm text-gray-600">視聴者数</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatDateTime(selectedStream.startTime)}
                        </div>
                        <div className="text-sm text-gray-600">開始予定</div>
                      </div>
                    )}
                  </div>
                </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedStream.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

                {/* Stream Schedule Actions */}
                <div className="flex gap-3">
                  {isCurrentlyLive ? (
                    <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                      📺 視聴中
                    </button>
                  ) : (
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      🔔 リマインダー設定
                    </button>
                  )}
                  <button
                    onClick={() => setUseUniversalPlayer(true)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Video size={10} />
                    統合プレイヤー
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    📤 シェア
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Live Chat - only show if not using universal player */}
            {!useUniversalPlayer && (
              <div className="mb-6">
                <LiveChat streamId={selectedStream.id} isLive={isCurrentlyLive && canWatch} />
              </div>
            )}

            {/* Stream Schedule */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">配信スケジュール</h3>
              <div className="space-y-3">
                {streams.map((stream) => (
                  <div
                    key={stream.id}
                    onClick={() => setSelectedStream(stream)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedStream.id === stream.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {stream.title}
                      </h4>
                      <div className="flex items-center gap-1">
                        {isLiveNow(stream) && (
                          <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                            LIVE
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getPlatformColor(stream.platform)}`}>
                        {getPlatformName(stream.platform)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatDateTime(stream.startTime)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      👨‍🏫 {stream.instructor}
                    </div>
                    {stream.isPremium && (
                      <div className="mt-2">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                          プレミアム
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}