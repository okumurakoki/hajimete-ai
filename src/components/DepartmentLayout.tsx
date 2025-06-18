'use client'

import { Department, VideoContent } from '@/lib/departments'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import VideoCard from '@/components/VideoCard'
import { useState } from 'react'

interface DepartmentLayoutProps {
  department: Department
  videos: VideoContent[]
}

export default function DepartmentLayout({ department, videos }: DepartmentLayoutProps) {
  const [selectedType, setSelectedType] = useState<'all' | 'recorded' | 'live' | 'archive'>('all')
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')

  const filteredVideos = videos.filter(video => {
    const typeMatch = selectedType === 'all' || video.type === selectedType
    const levelMatch = selectedLevel === 'all' || video.level === selectedLevel
    return typeMatch && levelMatch
  })

  const stats = {
    total: videos.length,
    recorded: videos.filter(v => v.type === 'recorded').length,
    live: videos.filter(v => v.type === 'live').length,
    archive: videos.filter(v => v.type === 'archive').length
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Department Hero */}
      <div className={`${department.color.background} border-b`}>
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-4">{department.icon}</span>
            <div>
              <h1 className={`text-4xl font-bold ${department.color.text} mb-2`}>
                {department.name}
              </h1>
              <p className="text-gray-700 text-lg">
                {department.description}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">総コンテンツ数</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.recorded}</div>
              <div className="text-sm text-gray-600">録画コンテンツ</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.live}</div>
              <div className="text-sm text-gray-600">ライブ配信</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.archive}</div>
              <div className="text-sm text-gray-600">アーカイブ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">コンテンツタイプ</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">すべて ({stats.total})</option>
                <option value="recorded">録画 ({stats.recorded})</option>
                <option value="live">ライブ ({stats.live})</option>
                <option value="archive">アーカイブ ({stats.archive})</option>
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">レベル</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">すべてのレベル</option>
                <option value="beginner">初級</option>
                <option value="intermediate">中級</option>
                <option value="advanced">上級</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">並び順</label>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="newest">新着順</option>
                <option value="popular">人気順</option>
                <option value="duration">再生時間順</option>
              </select>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              departmentColor={department.color}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              該当するコンテンツが見つかりません
            </h3>
            <p className="text-gray-600">
              フィルターを変更して再度お試しください
            </p>
          </div>
        )}

        {/* Load More */}
        {filteredVideos.length > 0 && (
          <div className="text-center mt-12">
            <button className={`${department.color.primary} text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity`}>
              さらに読み込む
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}