'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Video, generateMockVideos, canAccessVideo, formatDuration } from '@/lib/videos'
import Link from 'next/link'

export default function VideoDetailPage() {
  const { user } = useUser()
  const params = useParams()
  const [video, setVideo] = useState<Video | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([])
  const [currentChapter, setCurrentChapter] = useState(0)
  const [watchProgress, setWatchProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isWatchLater, setIsWatchLater] = useState(false)

  const userPlan = user?.publicMetadata?.plan as string

  useEffect(() => {
    const videos = generateMockVideos()
    const currentVideo = videos.find(v => v.id === params.id)
    
    if (currentVideo) {
      setVideo(currentVideo)
      
      // Get related videos from same department
      const related = videos
        .filter(v => v.id !== currentVideo.id && v.department === currentVideo.department)
        .slice(0, 4)
      setRelatedVideos(related)
    }
  }, [params.id])

  const hasAccess = video ? canAccessVideo(video, userPlan) : false

  const handlePlay = () => {
    if (hasAccess) {
      setIsPlaying(true)
      // ここで実際の動画再生ロジックを実装
    }
  }

  const handleChapterClick = (index: number) => {
    setCurrentChapter(index)
    // ここで動画の該当時間にシーク
  }

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited)
    // ここでお気に入り状態をAPIに保存
  }

  const toggleWatchLater = () => {
    setIsWatchLater(!isWatchLater)
    // ここで後で見る状態をAPIに保存
  }

  if (!video) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">📺</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">動画を読み込み中...</h2>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return '初級'
      case 'intermediate': return '中級'
      case 'advanced': return '上級'
      default: return '初級'
    }
  }

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
                {hasAccess ? (
                  <>
                    {/* Vimeo Embed or Mock Player */}
                    {video.vimeoId ? (
                      <iframe
                        src={`https://player.vimeo.com/video/${video.vimeoId}?h=0&badge=0&autopause=0&player_id=0&app_id=58479`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title={video.title}
                        className="absolute inset-0"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-6xl mb-4">🎬</div>
                          <h3 className="text-2xl font-bold mb-2">動画プレイヤー</h3>
                          <p className="text-gray-300 mb-4">実際の実装では、ここにVimeoプレイヤーが表示されます</p>
                          <button
                            onClick={handlePlay}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            {isPlaying ? '再生中' : '再生開始'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
                      <div className="w-full bg-gray-600 rounded-full h-1 mb-2">
                        <div
                          className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${watchProgress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-white text-sm">
                        <span>{formatDuration(Math.floor(video.durationMinutes * 60 * watchProgress / 100))}</span>
                        <span>{video.duration}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <div className="text-6xl mb-4">🔒</div>
                      <h3 className="text-2xl font-bold mb-4">プレミアム限定動画</h3>
                      <p className="text-purple-100 mb-6">
                        この動画はプレミアムプランの方のみご視聴いただけます
                      </p>
                      <Link href="/plan-selection">
                        <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                          プレミアムプランにアップグレード
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Video Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(video.level)}`}>
                      {getLevelLabel(video.level)}
                    </span>
                    {video.isPremium && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                        プレミアム
                      </span>
                    )}
                    {video.isNew && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        NEW
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    {video.title}
                  </h1>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      👨‍🏫 {video.instructor}
                    </span>
                    <span className="flex items-center gap-1">
                      🏫 {video.department}
                    </span>
                    <span className="flex items-center gap-1">
                      ⏱️ {video.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      👁️ {video.viewCount.toLocaleString()}回再生
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">
                    {video.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="ml-6 text-center">
                  <div className="text-2xl font-bold text-green-600">{video.likeCount}</div>
                  <div className="text-sm text-gray-600">いいね</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={toggleFavorite}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isFavorited
                      ? 'bg-red-100 text-red-800 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isFavorited ? '❤️' : '🤍'} お気に入り
                </button>
                
                <button
                  onClick={toggleWatchLater}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isWatchLater
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isWatchLater ? '📝' : '🕒'} 後で見る
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  📤 シェア
                </button>
              </div>
            </div>

            {/* Materials */}
            {video.materials && video.materials.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">教材・資料</h3>
                <div className="space-y-3">
                  {video.materials.map((material, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {material.type === 'pdf' ? '📄' : material.type === 'zip' ? '📦' : '🔗'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{material.name}</div>
                          <div className="text-sm text-gray-500">
                            {material.type === 'pdf' ? 'PDFファイル' : material.type === 'zip' ? 'ZIPアーカイブ' : 'リンク'}
                          </div>
                        </div>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        ダウンロード
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chapters */}
            {video.chapters && video.chapters.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">チャプター</h3>
                <div className="space-y-2">
                  {video.chapters.map((chapter, index) => (
                    <div
                      key={index}
                      onClick={() => handleChapterClick(index)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        currentChapter === index
                          ? 'bg-blue-100 border border-blue-300'
                          : 'hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{chapter.title}</div>
                          <div className="text-sm text-gray-500">
                            {formatDuration(chapter.startTime)} - {formatDuration(chapter.startTime + chapter.duration)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDuration(chapter.duration)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related Videos */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">関連動画</h3>
              <div className="space-y-4">
                {relatedVideos.map((relatedVideo) => (
                  <Link key={relatedVideo.id} href={`/videos/${relatedVideo.id}`}>
                    <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="relative w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                          <div className="text-lg text-gray-500">🎬</div>
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white px-1 py-0.5 rounded text-xs">
                          {relatedVideo.duration}
                        </div>
                        {relatedVideo.isPremium && (
                          <div className="absolute top-1 right-1">
                            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                          {relatedVideo.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-1">{relatedVideo.instructor}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{relatedVideo.viewCount.toLocaleString()}回再生</span>
                          {relatedVideo.isNew && (
                            <span className="bg-green-100 text-green-800 px-1 py-0.5 rounded">NEW</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
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