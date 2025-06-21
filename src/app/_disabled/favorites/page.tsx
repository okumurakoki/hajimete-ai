'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useUserFavorites } from '@/contexts/UserFavoritesContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Video, generateMockVideos } from '@/lib/videos'
import { 
  Heart, 
  Clock, 
  BookOpen, 
  Eye, 
  Calendar,
  PlayCircle,
  Star,
  ArrowLeft,
  Trash2,
  Filter
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function FavoritesPage() {
  const { user, isAuthenticated } = useAuth()
  const { 
    favorites, 
    isFavorited, 
    isInWatchLater, 
    toggleVideoFavorite, 
    toggleVideoWatchLater,
    getFavoriteVideosCount,
    getWatchLaterCount
  } = useUserFavorites()
  
  const [activeTab, setActiveTab] = useState<'favorites' | 'watchlater'>('favorites')
  const [videos, setVideos] = useState<Video[]>([])
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')

  useEffect(() => {
    const mockVideos = generateMockVideos()
    setVideos(mockVideos)
  }, [])

  useEffect(() => {
    if (videos.length > 0) {
      let targetList: string[]
      
      if (activeTab === 'favorites') {
        targetList = favorites.favoriteVideos
      } else {
        targetList = favorites.watchLaterVideos
      }

      let filtered = videos.filter(video => targetList.includes(video.id))
      
      if (departmentFilter !== 'all') {
        filtered = filtered.filter(video => video.department === departmentFilter)
      }
      
      setFilteredVideos(filtered)
    }
  }, [videos, favorites, activeTab, departmentFilter])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <Heart size={64} className="mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              お気に入り機能をご利用いただくには
            </h2>
            <p className="text-gray-600 mb-6">
              動画をお気に入りに追加したり、後で見るリストに保存するにはログインが必要です。
            </p>
            <div className="space-y-3">
              <Link href="/sign-in">
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  ログイン
                </button>
              </Link>
              <Link href="/sign-up">
                <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  新規登録
                </button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const departments = ['all', ...Array.from(new Set(videos.map(video => video.department)))]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Back Navigation */}
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            ダッシュボードに戻る
          </Link>
        </div>

        <div className="container mx-auto px-4 pb-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              マイリスト
            </h1>
            <p className="text-gray-600">
              お気に入りの動画と後で見る動画を管理できます
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-sm border">
              <button
                onClick={() => setActiveTab('favorites')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'favorites'
                    ? 'bg-red-50 text-red-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Heart size={16} className="inline mr-2" />
                お気に入り ({getFavoriteVideosCount()})
              </button>
              <button
                onClick={() => setActiveTab('watchlater')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'watchlater'
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Clock size={16} className="inline mr-2" />
                後で見る ({getWatchLaterCount()})
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center gap-4">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">全ての学部</option>
                  {departments.filter(dept => dept !== 'all').map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="max-w-7xl mx-auto">
            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <PlayCircle size={48} className="text-gray-500" />
                      </div>
                      
                      {/* Duration */}
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                        {video.duration}
                      </div>
                      
                      {/* Premium Badge */}
                      {video.isPremium && (
                        <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs">
                          プレミアム
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="absolute top-2 left-2 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            toggleVideoFavorite(video.id)
                          }}
                          className={`p-2 rounded-full transition-all ${
                            isFavorited(video.id)
                              ? 'bg-red-100 text-red-600 hover:bg-red-200'
                              : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                          }`}
                          title={isFavorited(video.id) ? 'お気に入りから削除' : 'お気に入りに追加'}
                        >
                          <Heart size={14} className={isFavorited(video.id) ? 'fill-current' : ''} />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            toggleVideoWatchLater(video.id)
                          }}
                          className={`p-2 rounded-full transition-all ${
                            isInWatchLater(video.id)
                              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                              : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                          }`}
                          title={isInWatchLater(video.id) ? '後で見るから削除' : '後で見るに追加'}
                        >
                          <Clock size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          video.level === 'beginner' ? 'bg-green-100 text-green-800' :
                          video.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {video.level === 'beginner' ? '初級' : 
                           video.level === 'intermediate' ? '中級' : '上級'}
                        </span>
                        {video.isNew && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            NEW
                          </span>
                        )}
                      </div>
                      
                      <Link href={`/videos/${video.id}`}>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
                          {video.title}
                        </h3>
                      </Link>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <BookOpen size={12} />
                          <span>{video.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye size={12} />
                          <span>{video.viewCount.toLocaleString()}回再生</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={12} />
                          <span>{video.uploadDate}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Link href={`/videos/${video.id}`}>
                          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            視聴する
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">
                  {activeTab === 'favorites' ? '💝' : '📚'}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {activeTab === 'favorites' 
                    ? 'お気に入りの動画がありません' 
                    : '後で見る動画がありません'
                  }
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {activeTab === 'favorites'
                    ? '気になる動画をお気に入りに追加して、いつでも簡単にアクセスできるようにしましょう。'
                    : '興味のある動画を「後で見る」に追加して、時間のある時にまとめて視聴しましょう。'
                  }
                </p>
                <Link href="/videos">
                  <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    動画を探す
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}