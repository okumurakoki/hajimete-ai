'use client'

import { VideoContent } from '@/lib/departments'
import Link from 'next/link'

interface VideoCardProps {
  video: VideoContent
  departmentColor: {
    primary: string
    secondary: string
    background: string
    text: string
  }
}

export default function VideoCard({ video, departmentColor }: VideoCardProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'live': return { label: '生放送', color: 'bg-red-500' }
      case 'archive': return { label: 'アーカイブ', color: 'bg-gray-500' }
      default: return { label: '録画', color: 'bg-blue-500' }
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

  const typeInfo = getTypeLabel(video.type)

  return (
    <Link href={`/videos/${video.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-200 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <div className="text-6xl text-gray-500">🎬</div>
          </div>
          
          {/* Video Type Badge */}
          <div className={`absolute top-3 left-3 ${typeInfo.color} text-white px-2 py-1 rounded text-xs font-medium`}>
            {typeInfo.label}
          </div>

          {/* Duration */}
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
            {video.duration}
          </div>

          {/* New/Popular badges */}
          <div className="absolute top-3 right-3 flex gap-1">
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
            {video.isPremium && (
              <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium">
                プレミアム
              </span>
            )}
          </div>

          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <div className="w-16 h-16 bg-white bg-opacity-0 group-hover:bg-opacity-90 rounded-full flex items-center justify-center transition-all duration-300">
              <svg className="w-6 h-6 text-transparent group-hover:text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {video.title}
          </h3>

          {/* Instructor */}
          <p className="text-sm text-gray-600 mb-2">{video.instructor}</p>

          {/* Description */}
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {video.description}
          </p>

          {/* Meta info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded ${departmentColor.secondary} ${departmentColor.text} font-medium`}>
                {getLevelLabel(video.level)}
              </span>
              <span>{video.viewCount.toLocaleString()}回再生</span>
            </div>
            <span>{new Date(video.uploadDate).toLocaleDateString('ja-JP')}</span>
          </div>

          {/* Tags */}
          {video.tags.length > 0 && (
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
          )}
        </div>
      </div>
    </Link>
  )
}