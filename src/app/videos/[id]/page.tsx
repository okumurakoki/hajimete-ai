'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useUserFavorites } from '@/contexts/UserFavoritesContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Video, generateMockVideos, canAccessVideo, formatDuration } from '@/lib/videos'
import VimeoIntegration from '@/components/streaming/VimeoIntegration'
import Link from 'next/link'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Settings,
  Maximize,
  Heart,
  Clock,
  Share2,
  Download,
  BookOpen,
  Eye,
  ThumbsUp,
  MessageCircle,
  Star,
  Bookmark,
  Users,
  Calendar,
  ChevronRight,
  PlayCircle,
  FileText,
  ExternalLink,
  CheckCircle,
  ArrowLeft
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function VideoDetailPage() {
  const { user } = useAuth()
  const { isFavorited, isInWatchLater, toggleVideoFavorite, toggleVideoWatchLater } = useUserFavorites()
  const params = useParams()
  const [video, setVideo] = useState<Video | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([])
  const [currentChapter, setCurrentChapter] = useState(0)
  const [watchProgress, setWatchProgress] = useState(15) // 15% watched for demo
  const [isPlaying, setIsPlaying] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)
  const [completedChapters, setCompletedChapters] = useState<number[]>([])
  const [chapterSearchTerm, setChapterSearchTerm] = useState('')
  const [showChapterDetails, setShowChapterDetails] = useState(false)

  const userPlan = user?.plan || 'free'

  useEffect(() => {
    // Get video data from mock
    const mockVideos = generateMockVideos()
    const foundVideo = mockVideos.find(v => v.id === params.id) || mockVideos[0]
    
    setVideo(foundVideo)
    
    // Get related videos (same department, different video)
    const related = mockVideos
      .filter(v => v.department === foundVideo.department && v.id !== foundVideo.id)
      .slice(0, 5)
    setRelatedVideos(related)

    // Simulate user data
    setUserRating(Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : 0)
    setIsCompleted(watchProgress > 95)
  }, [params.id, watchProgress])

  const hasAccess = video ? canAccessVideo(video, userPlan) : false

  const handlePlay = () => {
    if (hasAccess) {
      setIsPlaying(!isPlaying)
    }
  }

  const handleChapterClick = (index: number) => {
    if (!hasAccess) return
    setCurrentChapter(index)
    // Simulate progress update
    const chapter = video?.chapters?.[index]
    if (chapter) {
      const progressPercent = ((chapter.startTime / (video?.durationMinutes * 60)) * 100)
      setWatchProgress(Math.max(watchProgress, progressPercent))
      
      // Mark previous chapters as completed
      const newCompletedChapters = [...completedChapters]
      for (let i = 0; i < index; i++) {
        if (!newCompletedChapters.includes(i)) {
          newCompletedChapters.push(i)
        }
      }
      setCompletedChapters(newCompletedChapters)
    }
  }

  const toggleChapterComplete = (index: number) => {
    setCompletedChapters(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const handleToggleFavorite = () => {
    if (video) {
      toggleVideoFavorite(video.id)
    }
  }

  const handleToggleWatchLater = () => {
    if (video) {
      toggleVideoWatchLater(video.id)
    }
  }

  const handleRating = (rating: number) => {
    setUserRating(rating)
  }

  const markAsCompleted = () => {
    setIsCompleted(true)
    setWatchProgress(100)
  }

  if (!video) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">動画を読み込み中...</h2>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const getLevelInfo = (level: string) => {
    switch (level) {
      case 'beginner': 
        return { label: '初級', color: 'bg-green-100 text-green-800', icon: '🌱' }
      case 'intermediate': 
        return { label: '中級', color: 'bg-yellow-100 text-yellow-800', icon: '🌿' }
      case 'advanced': 
        return { label: '上級', color: 'bg-red-100 text-red-800', icon: '🌳' }
      default: 
        return { label: '初級', color: 'bg-gray-100 text-gray-800', icon: '🌱' }
    }
  }

  const levelInfo = getLevelInfo(video.level)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Back Navigation */}
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/videos" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={10} className="mr-1" />
            動画一覧に戻る
          </Link>
        </div>

        <div className="container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-3">
              {/* Video Player */}
              <div className="bg-black rounded-lg overflow-hidden shadow-xl mb-6">
                <div className="relative aspect-video">
                  {hasAccess ? (
                    <>
                      {/* Video Player Area */}
                      {video.vimeoId ? (
                        <VimeoIntegration
                          config={{
                            videoId: video.vimeoId,
                            autoplay: false,
                            muted: false,
                            controls: true,
                            responsive: true,
                            quality: 'auto'
                          }}
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onTimeUpdate={(time) => {
                            const progress = (time / (video.durationMinutes * 60)) * 100
                            setWatchProgress(Math.max(watchProgress, progress))
                          }}
                          onEnded={() => {
                            setIsCompleted(true)
                            setWatchProgress(100)
                          }}
                          className="absolute inset-0"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                          <div className="text-center text-white">
                            <PlayCircle size={80} className="mx-auto mb-4 text-blue-400" />
                            <h3 className="text-2xl font-bold mb-2">プレミアム動画プレイヤー</h3>
                            <p className="text-gray-300 mb-6 max-w-md">
                              高品質な学習体験をお届けするプレミアム動画プレイヤー
                            </p>
                            <button
                              onClick={handlePlay}
                              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                            >
                              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                              {isPlaying ? '一時停止' : '再生開始'}
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                      <div className="text-center text-white p-8 max-w-md">
                        <div className="text-6xl mb-6">🔒</div>
                        <h3 className="text-2xl font-bold mb-4">プレミアム限定動画</h3>
                        <p className="text-purple-100 mb-6 leading-relaxed">
                          この高品質な学習コンテンツは、プレミアムプランの方のみご視聴いただけます。
                          より深い学びと実践的なスキルを身につけましょう。
                        </p>
                        <Link href="/plan-selection">
                          <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                            プレミアムプランにアップグレード
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Video Information */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelInfo.color}`}>
                    {levelInfo.icon} {levelInfo.label}
                  </span>
                  {video.isPremium && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      ⭐ プレミアム
                    </span>
                  )}
                  {video.isNew && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      🆕 NEW
                    </span>
                  )}
                  {video.isPopular && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                      🔥 人気
                    </span>
                  )}
                  {video.isFeatured && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      ⭐ おすすめ
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {video.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Users size={10} />
                    <span className="font-medium">{video.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen size={10} />
                    <span>{video.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={10} />
                    <span>{video.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye size={10} />
                    <span>{video.viewCount.toLocaleString()}回再生</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={10} />
                    <span>{video.uploadDate}</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  {video.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {video.tags.map((tag, index) => (
                    <Link 
                      key={index}
                      href={`/videos?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleToggleFavorite}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      video && isFavorited(video.id)
                        ? 'bg-red-50 text-red-700 border-2 border-red-200 hover:bg-red-100'
                        : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <Heart size={10} className={video && isFavorited(video.id) ? 'fill-current' : ''} />
                    {video && isFavorited(video.id) ? 'お気に入り済み' : 'お気に入りに追加'}
                  </button>
                  
                  <button
                    onClick={handleToggleWatchLater}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      video && isInWatchLater(video.id)
                        ? 'bg-blue-50 text-blue-700 border-2 border-blue-200 hover:bg-blue-100'
                        : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <Bookmark size={10} className={video && isInWatchLater(video.id) ? 'fill-current' : ''} />
                    {video && isInWatchLater(video.id) ? '後で見る済み' : '後で見る'}
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 border-2 border-gray-200 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    <Share2 size={10} />
                    シェア
                  </button>

                  {hasAccess && !isCompleted && (
                    <button 
                      onClick={markAsCompleted}
                      className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border-2 border-green-200 rounded-lg font-medium hover:bg-green-100 transition-colors"
                    >
                      <CheckCircle size={10} />
                      完了にする
                    </button>
                  )}
                </div>

                {/* Rating Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">この動画を評価</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRating(star)}
                          className={`transition-colors ${
                            star <= userRating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          <Star size={14} className={star <= userRating ? 'fill-current' : ''} />
                        </button>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {userRating > 0 ? `${userRating}つ星で評価済み` : '評価してください'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Learning Materials */}
              {video.materials && video.materials.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={12} />
                    学習教材・資料
                  </h3>
                  <div className="grid gap-3">
                    {video.materials.map((material, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {material.type === 'pdf' ? '📄' : 
                             material.type === 'zip' ? '📦' : 
                             '🔗'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{material.name}</div>
                            <div className="text-sm text-gray-500">
                              {material.type === 'pdf' ? 'PDFファイル' : 
                               material.type === 'zip' ? 'ZIPアーカイブ' : 
                               'リンク'}
                            </div>
                          </div>
                        </div>
                        {hasAccess ? (
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <Download size={10} />
                            ダウンロード
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm px-4 py-2">プレミアム限定</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chapters */}
              {video.chapters && video.chapters.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <BookOpen size={16} />
                      チャプター一覧
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {completedChapters.length}/{video.chapters.length}
                      </span>
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowChapterDetails(!showChapterDetails)}
                        className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {showChapterDetails ? '詳細を非表示' : '詳細を表示'}
                      </button>
                    </div>
                  </div>

                  {/* Chapter Search */}
                  <div className="mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="チャプターを検索..."
                        value={chapterSearchTerm}
                        onChange={(e) => setChapterSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>学習進捗</span>
                      <span>{Math.round((completedChapters.length / video.chapters.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(completedChapters.length / video.chapters.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {video.chapters
                      .filter(chapter => 
                        chapterSearchTerm === '' || 
                        chapter.title.toLowerCase().includes(chapterSearchTerm.toLowerCase())
                      )
                      .map((chapter, index) => {
                        const originalIndex = video.chapters?.findIndex(c => c === chapter) ?? -1
                        const isCompleted = completedChapters.includes(originalIndex)
                        const isCurrent = currentChapter === originalIndex
                        
                        return (
                          <div
                            key={originalIndex}
                            className={`p-4 rounded-lg transition-all border-2 ${
                              isCurrent
                                ? 'bg-blue-50 border-blue-200'
                                : hasAccess 
                                  ? 'hover:bg-gray-50 border-gray-200 cursor-pointer'
                                  : 'border-gray-100 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div 
                                className="flex-1 cursor-pointer"
                                onClick={() => handleChapterClick(originalIndex)}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                                    isCurrent 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {originalIndex + 1}
                                  </span>
                                  <h4 className="font-medium text-gray-900 flex-1">{chapter.title}</h4>
                                  {isCompleted && (
                                    <CheckCircle size={16} className="text-green-600" />
                                  )}
                                  {isCurrent && hasAccess && (
                                    <PlayCircle size={16} className="text-blue-600" />
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                  <span>
                                    {formatDuration(chapter.startTime)} - {formatDuration(chapter.startTime + chapter.duration)}
                                  </span>
                                  <span className="font-medium">
                                    {formatDuration(chapter.duration)}
                                  </span>
                                </div>

                                {showChapterDetails && chapter.description && (
                                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                    {chapter.description}
                                  </p>
                                )}
                              </div>

                              {hasAccess && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleChapterComplete(originalIndex)
                                  }}
                                  className={`ml-3 p-2 rounded-full transition-colors ${
                                    isCompleted
                                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                  }`}
                                  title={isCompleted ? '完了をキャンセル' : '完了にする'}
                                >
                                  <CheckCircle size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>

                  {video.chapters.filter(chapter => 
                    chapterSearchTerm === '' || 
                    chapter.title.toLowerCase().includes(chapterSearchTerm.toLowerCase())
                  ).length === 0 && chapterSearchTerm !== '' && (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen size={32} className="mx-auto mb-2 text-gray-300" />
                      <p>「{chapterSearchTerm}」に一致するチャプターが見つかりませんでした</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1">
              {/* Related Videos */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <PlayCircle size={12} />
                  関連動画
                </h3>
                <div className="space-y-4">
                  {relatedVideos.map((relatedVideo) => (
                    <Link key={relatedVideo.id} href={`/videos/${relatedVideo.id}`}>
                      <div className="group flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="relative w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                            <PlayCircle size={12} className="text-gray-500" />
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
                          <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                            {relatedVideo.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-1">{relatedVideo.instructor}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{relatedVideo.viewCount.toLocaleString()}回</span>
                            {relatedVideo.isNew && (
                              <span className="bg-green-100 text-green-800 px-1 py-0.5 rounded">NEW</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <Link href={`/${video.department.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                  <button className="w-full mt-4 bg-blue-50 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                    {video.department}の動画をもっと見る
                    <ChevronRight size={10} />
                  </button>
                </Link>
              </div>

              {/* Learning Progress */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle size={12} />
                  学習進捗
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">視聴進捗</span>
                      <span className="font-medium">{Math.round(watchProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${watchProgress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 space-y-2">
                      <div className="flex justify-between">
                        <span>視聴済み時間:</span>
                        <span className="font-medium">
                          {formatDuration(Math.floor((video.durationMinutes * 60 * watchProgress) / 100))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>残り時間:</span>
                        <span className="font-medium">
                          {formatDuration(Math.floor((video.durationMinutes * 60 * (100 - watchProgress)) / 100))}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!isCompleted && hasAccess && (
                    <button 
                      onClick={markAsCompleted}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={10} />
                      完了にする
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}