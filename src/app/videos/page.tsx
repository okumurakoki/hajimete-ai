'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Video, generateMockVideos, canAccessVideo, searchVideos, sortVideos } from '@/lib/videos'
import { DEPARTMENTS } from '@/lib/departments'
import Link from 'next/link'

export default function Videos() {
  const { user } = useUser()
  const [videos, setVideos] = useState<Video[]>([])
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'duration' | 'title'>('newest')
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)

  const userPlan = user?.publicMetadata?.plan as string

  useEffect(() => {
    const mockVideos = generateMockVideos()
    setVideos(mockVideos)
    setFilteredVideos(mockVideos)
  }, [])

  useEffect(() => {
    let filtered = videos

    // Search filter
    if (searchQuery) {
      filtered = searchVideos(filtered, searchQuery)
    }

    // Department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(video => video.department === selectedDepartment)
    }

    // Level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(video => video.level === selectedLevel)
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(video => video.category === selectedCategory)
    }

    // Premium filter
    if (showPremiumOnly) {
      filtered = filtered.filter(video => video.isPremium)
    }

    // Sort
    filtered = sortVideos(filtered, sortBy)

    setFilteredVideos(filtered)
  }, [videos, searchQuery, selectedDepartment, selectedLevel, selectedCategory, sortBy, showPremiumOnly])

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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'tutorial': return 'チュートリアル'
      case 'lecture': return '講義'
      case 'workshop': return 'ワークショップ'
      case 'webinar': return 'ウェビナー'
      default: return 'チュートリアル'
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">動画一覧</h1>
          <p className="text-gray-600">
            豊富なAI学習コンテンツからあなたに最適な動画を見つけましょう。
            {userPlan === 'premium' ? 'プレミアムプランですべての動画をご視聴いただけます。' : 'ベーシックプランでは基本動画をご視聴いただけます。'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{videos.length}</div>
            <div className="text-sm text-gray-600">総動画数</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {videos.filter(v => !v.isPremium).length}
            </div>
            <div className="text-sm text-gray-600">無料動画</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {videos.filter(v => v.isPremium).length}
            </div>
            <div className="text-sm text-gray-600">プレミアム動画</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600">
              {videos.filter(v => v.isNew).length}
            </div>
            <div className="text-sm text-gray-600">新着動画</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="動画を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">学部</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">すべての学部</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">レベル</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">すべてのレベル</option>
                <option value="beginner">初級</option>
                <option value="intermediate">中級</option>
                <option value="advanced">上級</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">すべてのカテゴリ</option>
                <option value="tutorial">チュートリアル</option>
                <option value="lecture">講義</option>
                <option value="workshop">ワークショップ</option>
                <option value="webinar">ウェビナー</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">並び順</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">新着順</option>
                <option value="popular">人気順</option>
                <option value="duration">再生時間順</option>
                <option value="title">タイトル順</option>
              </select>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showPremiumOnly}
                onChange={(e) => setShowPremiumOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">プレミアム動画のみ</span>
            </label>

            <div className="ml-auto text-sm text-gray-600">
              {filteredVideos.length}件の動画が見つかりました
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => {
            const hasAccess = canAccessVideo(video, userPlan)
            
            return (
              <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/videos/${video.id}`}>
                  <div className="cursor-pointer">
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gray-200 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <div className="text-4xl text-gray-500">🎬</div>
                      </div>
                      
                      {/* Duration */}
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                        {video.duration}
                      </div>

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex gap-1">
                        {video.isNew && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                            NEW
                          </span>
                        )}
                        {video.isPopular && (
                          <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                            人気
                          </span>
                        )}
                        {video.isFeatured && (
                          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                            特集
                          </span>
                        )}
                      </div>

                      {/* Premium Badge */}
                      {video.isPremium && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                            プレミアム
                          </span>
                        </div>
                      )}

                      {/* Lock Overlay for inaccessible videos */}
                      {!hasAccess && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="text-2xl mb-2">🔒</div>
                            <div className="text-xs">プレミアム限定</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(video.level)}`}>
                          {getLevelLabel(video.level)}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {getCategoryLabel(video.category)}
                        </span>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                        {video.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-2">{video.instructor}</p>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{video.description}</p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <span>{video.viewCount.toLocaleString()}回再生</span>
                          <span>👍 {video.likeCount}</span>
                        </div>
                        <span>{new Date(video.uploadDate).toLocaleDateString('ja-JP')}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {video.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                        {video.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{video.tags.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              動画が見つかりませんでした
            </h3>
            <p className="text-gray-600">
              検索条件やフィルターを変更して再度お試しください
            </p>
          </div>
        )}

        {/* Load More */}
        {filteredVideos.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              さらに読み込む
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}