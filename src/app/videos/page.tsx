'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { ContentLayout } from '@/components/layout/Layout'
import { 
  Play, 
  Clock, 
  Star, 
  Eye, 
  Filter, 
  Search, 
  LayoutGrid, 
  List,
  ChevronDown,
  PlayCircle,
  StarIcon
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

interface FilterOptions {
  status: string
  sortBy: string
  search: string
  department: string
}

export default function VideosPage() {
  const { userId } = useAuth()
  const [videos, setVideos] = useState<VideoContent[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    sortBy: 'newest',
    search: '',
    department: 'all'
  })

  useEffect(() => {
    if (userId) {
      fetchVideos()
    }
  }, [userId, filters])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.status !== 'all') params.append('status', filters.status)
      if (filters.search) params.append('search', filters.search)
      if (filters.sortBy) params.append('sortBy', filters.sortBy === 'newest' ? 'createdAt' : filters.sortBy)
      params.append('sortOrder', filters.sortBy === 'oldest' ? 'asc' : 'desc')
      
      const response = await fetch(`/api/videos?${params.toString()}`)
      
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos || [])
      } else {
        console.error('Failed to fetch videos')
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
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
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return 'bg-green-500'
    if (percent >= 50) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const VideoCard = ({ video }: { video: VideoContent }) => (
    <Link href={`/videos/${video.id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200">
        {/* サムネイル部分 */}
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-700">
          {video.thumbnailUrl ? (
            <img 
              src={video.thumbnailUrl} 
              alt={video.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PlayCircle className="w-16 h-16 text-gray-400" />
            </div>
          )}
          
          {/* プレイオーバーレイ */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
          
          {/* 進捗バー */}
          {video.userWatchSession && video.userWatchSession.progressPercent > 0 && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300">
              <div 
                className={`h-full ${getProgressColor(video.userWatchSession.progressPercent)}`}
                style={{ width: `${video.userWatchSession.progressPercent}%` }}
              />
            </div>
          )}
          
          {/* 動画時間 */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
          
          {/* ステータスバッジ */}
          {video.status !== 'READY' && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
              {video.status === 'PROCESSING' ? '処理中' : video.status}
            </div>
          )}
        </div>
        
        {/* コンテンツ部分 */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {video.title}
          </h3>
          
          {video.lesson && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
              {video.lesson.course.department.name} / {video.lesson.course.title}
            </p>
          )}
          
          {video.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {video.description}
            </p>
          )}
          
          {/* メタ情報 */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                {video.viewCount}
              </span>
              
              {video.avgRating && (
                <span className="flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
                  {video.avgRating.toFixed(1)}
                </span>
              )}
            </div>
            
            <span>{formatDate(video.uploadDate)}</span>
          </div>
          
          {/* 進捗表示 */}
          {video.userWatchSession && (
            <div className="mt-2 flex items-center text-xs">
              {video.userWatchSession.completed ? (
                <span className="text-green-600 dark:text-green-400 flex items-center">
                  <StarIcon className="w-3 h-3 mr-1" />
                  完了済み
                </span>
              ) : (
                <span className="text-blue-600 dark:text-blue-400">
                  進捗: {Math.round(video.userWatchSession.progressPercent)}%
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )

  const VideoListItem = ({ video }: { video: VideoContent }) => (
    <Link href={`/videos/${video.id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200">
        <div className="flex gap-4">
          {/* サムネイル */}
          <div className="relative w-40 aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
            {video.thumbnailUrl ? (
              <img 
                src={video.thumbnailUrl} 
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <PlayCircle className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
              {formatDuration(video.duration)}
            </div>
          </div>
          
          {/* コンテンツ */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {video.title}
            </h3>
            
            {video.lesson && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                {video.lesson.course.department.name} / {video.lesson.course.title}
              </p>
            )}
            
            {video.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {video.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {video.viewCount}
                </span>
                
                {video.avgRating && (
                  <span className="flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
                    {video.avgRating.toFixed(1)}
                  </span>
                )}
                
                <span>{formatDate(video.uploadDate)}</span>
              </div>
              
              {video.userWatchSession && (
                <div className="flex items-center">
                  {video.userWatchSession.completed ? (
                    <span className="text-green-600 dark:text-green-400">完了済み</span>
                  ) : (
                    <span className="text-blue-600 dark:text-blue-400">
                      {Math.round(video.userWatchSession.progressPercent)}%
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )

  return (
    <ContentLayout>
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">動画一覧</h1>
            <p className="text-gray-600 dark:text-gray-400">学習動画を探して視聴しましょう</p>
          </div>
          
          {/* ビューモード切替 */}
          <div className="flex items-center mt-4 md:mt-0 space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* フィルター */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 検索 */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="動画を検索..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            {/* ステータスフィルター */}
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">全てのステータス</option>
              <option value="READY">視聴可能</option>
              <option value="PROCESSING">処理中</option>
            </select>
            
            {/* ソート */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="newest">新しい順</option>
              <option value="oldest">古い順</option>
              <option value="title">タイトル順</option>
              <option value="viewCount">視聴回数順</option>
              <option value="avgRating">評価順</option>
            </select>
            
            {/* リセット */}
            <button
              onClick={() => setFilters({ status: 'all', sortBy: 'newest', search: '', department: 'all' })}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              リセット
            </button>
          </div>
        </div>
        
        {/* 動画一覧 */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12">
            <PlayCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">動画がありません</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filters.search || filters.status !== 'all' 
                ? '検索条件に一致する動画が見つかりませんでした。' 
                : 'まだ動画がアップロードされていません。'}
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          }>
            {videos.map((video) => 
              viewMode === 'grid' ? (
                <VideoCard key={video.id} video={video} />
              ) : (
                <VideoListItem key={video.id} video={video} />
              )
            )}
          </div>
        )}
      </main>
    </ContentLayout>
  )
}