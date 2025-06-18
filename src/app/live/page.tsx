'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LiveChat from '@/components/LiveChat'
import { LiveStream, generateMockLiveStreams, isLiveNow, getTimeUntilStart, formatDateTime } from '@/lib/live'

export default function LivePage() {
  const { user } = useUser()
  const [streams, setStreams] = useState<LiveStream[]>([])
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const mockStreams = generateMockLiveStreams()
    setStreams(mockStreams)
    
    // 現在ライブ中の配信があれば自動選択
    const liveStream = mockStreams.find(stream => isLiveNow(stream))
    if (liveStream) {
      setSelectedStream(liveStream)
    } else {
      setSelectedStream(mockStreams[0])
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-3">
            {/* Video Player */}
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
                          <p className="text-gray-300">実際の配信では、ここに動画プレイヤーが表示されます</p>
                        </div>
                      ) : (
                        <div className="text-center text-white">
                          <div className="text-6xl mb-4">⏰</div>
                          <h3 className="text-2xl font-bold mb-2">配信準備中</h3>
                          <p className="text-gray-300">{getTimeUntilStart(selectedStream)}に開始予定</p>
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

            {/* Stream Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
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
                <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  📤 シェア
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Live Chat */}
            <div className="mb-6">
              <LiveChat streamId={selectedStream.id} isLive={isCurrentlyLive && canWatch} />
            </div>

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
                      {isLiveNow(stream) && (
                        <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                          LIVE
                        </div>
                      )}
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