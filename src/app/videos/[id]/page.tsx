'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useParams, useRouter } from 'next/navigation'
import { ContentLayout } from '@/components/layout/Layout'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward,
  Star,
  StarIcon,
  Eye,
  Clock,
  ArrowLeft,
  Share2,
  Download,
  MessageCircle,
  ThumbsUp,
  Settings,
  MoreVertical
} from 'lucide-react'
import Link from 'next/link'

interface VideoContent {
  id: string
  title: string
  description: string | null
  duration: number
  thumbnailUrl: string | null
  embedUrl: string
  privacy: string
  status: string
  uploadedBy: string
  uploadDate: string
  viewCount: number
  avgRating: number | null
  lesson?: {
    id: string
    title: string
    course: {
      id: string
      title: string
      department: {
        name: string
      }
    }
  }
  userWatchSession?: {
    id: string
    completed: boolean
    progressPercent: number
    lastPosition: number
    watchTime: number
  }
  userRating?: {
    rating: number
    comment: string | null
  }
}

interface RatingData {
  userRating: any
  stats: {
    avgRating: number | null
    totalRatings: number
    distribution: Record<number, number>
  }
}

export default function VideoPlayerPage() {
  const { userId } = useAuth()
  const params = useParams()
  const router = useRouter()
  const videoId = params.id as string
  
  const [video, setVideo] = useState<VideoContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [ratingData, setRatingData] = useState<RatingData | null>(null)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState('')

  const playerRef = useRef<HTMLIFrameElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (userId && videoId) {
      fetchVideo()
      fetchRatingData()
    }
  }, [userId, videoId])

  useEffect(() => {
    if (video && userId) {
      startWatchSession()
    }
  }, [video, userId])

  const fetchVideo = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/videos/${videoId}`)
      
      if (response.ok) {
        const data = await response.json()
        setVideo(data.video)
        
        // 前回の視聴位置がある場合は設定
        if (data.video.userWatchSession?.lastPosition > 0) {
          setCurrentTime(data.video.userWatchSession.lastPosition)
        }
      } else {
        console.error('Failed to fetch video')
        router.push('/videos')
      }
    } catch (error) {
      console.error('Error fetching video:', error)
      router.push('/videos')
    } finally {
      setLoading(false)
    }
  }

  const fetchRatingData = async () => {
    try {
      const response = await fetch(`/api/videos/${videoId}/rate`)
      if (response.ok) {
        const data = await response.json()
        setRatingData(data)
      }
    } catch (error) {
      console.error('Error fetching rating data:', error)
    }
  }

  const startWatchSession = async () => {
    try {
      const response = await fetch(`/api/videos/${videoId}/watch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          deviceType: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setSessionId(data.sessionId)
      }
    } catch (error) {
      console.error('Error starting watch session:', error)
    }
  }

  const updateProgress = async (watchTime: number, currentPosition: number) => {
    if (!sessionId) return
    
    try {
      await fetch(`/api/videos/${videoId}/watch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'progress',
          sessionId,
          watchTime,
          currentPosition
        })
      })
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const endSession = async () => {
    if (!sessionId) return
    
    try {
      await fetch(`/api/videos/${videoId}/watch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'end',
          sessionId
        })
      })
    } catch (error) {
      console.error('Error ending session:', error)
    }
  }

  const submitRating = async () => {
    if (!newRating) return
    
    try {
      const response = await fetch(`/api/videos/${videoId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: newRating,
          comment: newComment
        })
      })
      
      if (response.ok) {
        setShowRatingModal(false)
        setNewRating(0)
        setNewComment('')
        fetchRatingData()
        fetchVideo() // 平均評価を再取得
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        onClick={() => interactive && onStarClick?.(i + 1)}
        className={`${interactive ? 'cursor-pointer hover:scale-110' : ''} transition-transform`}
        disabled={!interactive}
      >
        <Star
          className={`w-5 h-5 ${
            i < rating 
              ? 'fill-current text-yellow-400' 
              : 'text-gray-300 dark:text-gray-600'
          }`}
        />
      </button>
    ))
  }

  // セッション終了のクリーンアップ
  useEffect(() => {
    return () => {
      endSession()
    }
  }, [sessionId])

  // 進捗更新のタイマー
  useEffect(() => {
    if (isPlaying && sessionId) {
      const interval = setInterval(() => {
        const newTime = currentTime + 1
        setCurrentTime(newTime)
        
        // 10秒ごとに進捗を保存
        if (newTime % 10 === 0) {
          updateProgress(newTime, newTime)
        }
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [isPlaying, currentTime, sessionId])

  if (loading) {
    return (
      <ContentLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ContentLayout>
    )
  }

  if (!video) {
    return (
      <ContentLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">動画が見つかりません</h2>
          <Link href="/videos" className="text-blue-600 hover:text-blue-800">
            動画一覧に戻る
          </Link>
        </div>
      </ContentLayout>
    )
  }

  return (
    <ContentLayout>
      <div className="container mx-auto px-4 py-6">
        {/* 戻るボタン */}
        <div className="mb-6">
          <Link 
            href="/videos"
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            動画一覧に戻る
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2">
            {/* 動画プレイヤー */}
            <div className="bg-black rounded-lg overflow-hidden mb-6 relative aspect-video">
              {video.status === 'READY' ? (
                <iframe
                  ref={playerRef}
                  src={video.embedUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={video.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">
                      {video.status === 'PROCESSING' ? '動画を処理中です...' : '動画は現在利用できません'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 動画情報 */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {video.title}
                </h1>
                
                <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {video.viewCount} 回視聴
                    </span>
                    <span>{formatDate(video.uploadDate)}</span>
                    {video.avgRating && (
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                        {video.avgRating.toFixed(1)} ({ratingData?.stats.totalRatings || 0} 評価)
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setShowRatingModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      評価する
                    </button>
                  </div>
                </div>

                {/* コース情報 */}
                {video.lesson && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                      この動画は以下のコースに含まれています
                    </p>
                    <Link 
                      href={`/courses/${video.lesson.course.id}`}
                      className="font-medium text-blue-700 dark:text-blue-300 hover:underline"
                    >
                      {video.lesson.course.department.name} / {video.lesson.course.title}
                    </Link>
                  </div>
                )}

                {/* 進捗情報 */}
                {video.userWatchSession && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        視聴進捗
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {Math.round(video.userWatchSession.progressPercent)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${video.userWatchSession.progressPercent}%` }}
                      />
                    </div>
                    {video.userWatchSession.completed && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                        <StarIcon className="w-4 h-4 mr-1" />
                        完了済み
                      </p>
                    )}
                  </div>
                )}

                {/* 説明 */}
                {video.description && (
                  <div className="prose dark:prose-invert max-w-none">
                    <h3 className="text-lg font-semibold mb-2">説明</h3>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {video.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 評価統計 */}
            {ratingData && ratingData.stats.totalRatings > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">評価</h3>
                
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {ratingData.stats.avgRating?.toFixed(1) || '0.0'}
                  </div>
                  <div className="flex items-center justify-center mb-1">
                    {renderStars(Math.round(ratingData.stats.avgRating || 0))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {ratingData.stats.totalRatings} 件の評価
                  </p>
                </div>

                {/* 評価分布 */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = ratingData.stats.distribution[rating] || 0
                    const percentage = ratingData.stats.totalRatings > 0 
                      ? (count / ratingData.stats.totalRatings) * 100 
                      : 0
                    
                    return (
                      <div key={rating} className="flex items-center text-sm">
                        <span className="w-6 text-gray-600 dark:text-gray-400">{rating}</span>
                        <Star className="w-4 h-4 fill-current text-yellow-400 mr-2" />
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-gray-600 dark:text-gray-400">{count}</span>
                      </div>
                    )
                  })}
                </div>

                {/* ユーザーの評価 */}
                {ratingData.userRating && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      あなたの評価
                    </p>
                    <div className="flex items-center mb-2">
                      {renderStars(ratingData.userRating.rating)}
                    </div>
                    {ratingData.userRating.comment && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {ratingData.userRating.comment}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 関連動画（プレースホルダー） */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">関連動画</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                関連動画機能は準備中です
              </p>
            </div>
          </div>
        </div>

        {/* 評価モーダル */}
        {showRatingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">動画を評価</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">評価（必須）</p>
                <div className="flex items-center space-x-1">
                  {renderStars(newRating, true, setNewRating)}
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">コメント（任意）</p>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="この動画についてのコメントを書いてください..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRatingModal(false)
                    setNewRating(0)
                    setNewComment('')
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={submitRating}
                  disabled={!newRating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  評価を送信
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ContentLayout>
  )
}