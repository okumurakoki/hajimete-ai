'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { 
  Video, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Eye, 
  Trash2, 
  Upload, 
  Calendar, 
  Users, 
  Play, 
  Pause, 
  Download,
  Star,
  Globe,
  Lock,
  TrendingUp
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface VideoData {
  id: string
  title: string
  description: string
  vimeoId: string
  thumbnail: string
  instructor: string
  department: string
  level: 'beginner' | 'intermediate' | 'advanced'
  category: 'lecture' | 'tutorial' | 'seminar'
  durationMinutes: number
  tags: string[]
  isPremium: boolean
  isPublished: boolean
  isNew: boolean
  viewCount: number
  likeCount: number
  uploadDate: string
  publishDate?: string
  status: 'draft' | 'published' | 'archived'
}

export default function AdminVideos() {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('uploadDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedVideos, setSelectedVideos] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)

  useEffect(() => {
    // モック動画データの生成
    const mockVideos: VideoData[] = [
      {
        id: 'video-1',
        title: 'ChatGPT基礎講座 - プロンプトエンジニアリング',
        description: 'ChatGPTを効果的に活用するためのプロンプト作成技術を体系的に学びます。',
        vimeoId: '76979871',
        thumbnail: 'https://i.vimeocdn.com/video/76979871_295x166.jpg',
        instructor: '田中AI博士',
        department: 'AI基礎学部',
        level: 'beginner',
        category: 'lecture',
        durationMinutes: 45,
        tags: ['ChatGPT', 'プロンプト', 'AI', '基礎'],
        isPremium: false,
        isPublished: true,
        isNew: true,
        viewCount: 12543,
        likeCount: 892,
        uploadDate: '2024-06-15',
        publishDate: '2024-06-15',
        status: 'published'
      },
      {
        id: 'video-2',
        title: 'AI プログラミング入門 - Python基礎',
        description: 'PythonでAIプログラミングを始めるための基礎知識を学習します。',
        vimeoId: '76979871',
        thumbnail: 'https://i.vimeocdn.com/video/76979871_295x166.jpg',
        instructor: '山田先生',
        department: 'AI基礎学部',
        level: 'beginner',
        category: 'tutorial',
        durationMinutes: 30,
        tags: ['Python', 'AI', 'プログラミング'],
        isPremium: false,
        isPublished: true,
        isNew: false,
        viewCount: 8654,
        likeCount: 543,
        uploadDate: '2024-06-10',
        publishDate: '2024-06-10',
        status: 'published'
      },
      {
        id: 'video-3',
        title: '機械学習アルゴリズム解説 - 深層学習入門',
        description: '深層学習の基本概念とアルゴリズムについて詳しく解説します。',
        vimeoId: '76979871',
        thumbnail: 'https://i.vimeocdn.com/video/76979871_295x166.jpg',
        instructor: '佐藤ML博士',
        department: 'AI応用学部',
        level: 'advanced',
        category: 'lecture',
        durationMinutes: 60,
        tags: ['機械学習', '深層学習', 'アルゴリズム'],
        isPremium: true,
        isPublished: true,
        isNew: false,
        viewCount: 5432,
        likeCount: 234,
        uploadDate: '2024-06-05',
        publishDate: '2024-06-05',
        status: 'published'
      },
      {
        id: 'video-4',
        title: 'データサイエンス実践講座',
        description: '実際のデータを使用したデータ分析の実践的な手法を学びます。',
        vimeoId: '76979871',
        thumbnail: 'https://i.vimeocdn.com/video/76979871_295x166.jpg',
        instructor: '鈴木データ博士',
        department: 'データサイエンス学部',
        level: 'intermediate',
        category: 'seminar',
        durationMinutes: 90,
        tags: ['データサイエンス', '統計', '分析'],
        isPremium: true,
        isPublished: false,
        isNew: false,
        viewCount: 0,
        likeCount: 0,
        uploadDate: '2024-06-12',
        status: 'draft'
      },
      {
        id: 'video-5',
        title: 'AI倫理とガバナンス',
        description: 'AI技術の倫理的な問題とガバナンスについて議論します。',
        vimeoId: '76979871',
        thumbnail: 'https://i.vimeocdn.com/video/76979871_295x166.jpg',
        instructor: '高橋倫理学者',
        department: 'AI倫理学部',
        level: 'intermediate',
        category: 'lecture',
        durationMinutes: 40,
        tags: ['AI倫理', 'ガバナンス', '社会問題'],
        isPremium: false,
        isPublished: true,
        isNew: false,
        viewCount: 3210,
        likeCount: 156,
        uploadDate: '2024-06-08',
        publishDate: '2024-06-08',
        status: 'published'
      }
    ]
    
    setVideos(mockVideos)
    setFilteredVideos(mockVideos)
  }, [])

  useEffect(() => {
    let filtered = videos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           video.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory
      const matchesStatus = selectedStatus === 'all' || video.status === selectedStatus
      const matchesLevel = selectedLevel === 'all' || video.level === selectedLevel
      
      return matchesSearch && matchesCategory && matchesStatus && matchesLevel
    })

    // ソート
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof VideoData]
      let bValue: any = b[sortBy as keyof VideoData]
      
      if (sortBy === 'uploadDate' || sortBy === 'publishDate') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredVideos(filtered)
  }, [videos, searchQuery, selectedCategory, selectedStatus, selectedLevel, sortBy, sortOrder])

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}:${mins.toString().padStart(2, '0')}` : `${mins}分`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'lecture': return '講義'
      case 'tutorial': return 'チュートリアル'
      case 'seminar': return 'セミナー'
      default: return '講義'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'archived': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return '公開中'
      case 'draft': return '下書き'
      case 'archived': return 'アーカイブ'
      default: return '下書き'
    }
  }

  const handleVideoAction = (action: string, videoId: string) => {
    switch (action) {
      case 'edit':
        // 編集ページに遷移
        window.location.href = `/admin/videos/${videoId}/edit`
        break
      case 'view':
        // 動画詳細ページに遷移
        window.open(`/videos/${videoId}`, '_blank')
        break
      case 'publish':
        // 公開状態を切り替え
        setVideos(videos.map(video => 
          video.id === videoId 
            ? { ...video, status: video.status === 'published' ? 'draft' : 'published', isPublished: !video.isPublished }
            : video
        ))
        break
      case 'delete':
        if (confirm('この動画を削除しますか？')) {
          setVideos(videos.filter(video => video.id !== videoId))
        }
        break
    }
  }

  const handleBulkAction = (action: string) => {
    if (selectedVideos.length === 0) {
      alert('動画を選択してください')
      return
    }

    switch (action) {
      case 'publish':
        setVideos(videos.map(video => 
          selectedVideos.includes(video.id)
            ? { ...video, status: 'published', isPublished: true }
            : video
        ))
        break
      case 'unpublish':
        setVideos(videos.map(video => 
          selectedVideos.includes(video.id)
            ? { ...video, status: 'draft', isPublished: false }
            : video
        ))
        break
      case 'delete':
        if (confirm(`選択した${selectedVideos.length}件の動画を削除しますか？`)) {
          setVideos(videos.filter(video => !selectedVideos.includes(video.id)))
        }
        break
    }
    
    setSelectedVideos([])
    setShowBulkActions(false)
  }

  const handleSelectVideo = (videoId: string) => {
    setSelectedVideos(prev => 
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    )
  }

  const handleSelectAll = () => {
    if (selectedVideos.length === filteredVideos.length) {
      setSelectedVideos([])
    } else {
      setSelectedVideos(filteredVideos.map(video => video.id))
    }
  }

  const stats = {
    total: videos.length,
    published: videos.filter(v => v.status === 'published').length,
    drafts: videos.filter(v => v.status === 'draft').length,
    premium: videos.filter(v => v.isPremium).length,
    totalViews: videos.reduce((sum, v) => sum + v.viewCount, 0),
    totalLikes: videos.reduce((sum, v) => sum + v.likeCount, 0)
  }

  return (
    <AdminLayout currentPage="videos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">動画管理</h1>
            <p className="text-gray-600">動画コンテンツの管理・編集・公開状態を管理できます</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/videos/upload"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Upload size={18} />
              新規アップロード
            </Link>
            <Link
              href="/admin/videos/bulk-upload"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              一括アップロード
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総動画数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Video size={12} className="text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">公開中</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <Globe size={12} className="text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">下書き</p>
                <p className="text-2xl font-bold text-gray-600">{stats.drafts}</p>
              </div>
              <Edit size={12} className="text-gray-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">プレミアム</p>
                <p className="text-2xl font-bold text-purple-600">{stats.premium}</p>
              </div>
              <Star size={12} className="text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総視聴数</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalViews.toLocaleString()}</p>
              </div>
              <Eye size={12} className="text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総いいね</p>
                <p className="text-2xl font-bold text-red-600">{stats.totalLikes.toLocaleString()}</p>
              </div>
              <TrendingUp size={12} className="text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search size={12} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="動画タイトル、講師名、タグで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">すべてのカテゴリー</option>
                <option value="lecture">講義</option>
                <option value="tutorial">チュートリアル</option>
                <option value="seminar">セミナー</option>
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">すべてのステータス</option>
                <option value="published">公開中</option>
                <option value="draft">下書き</option>
                <option value="archived">アーカイブ</option>
              </select>
              
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">すべてのレベル</option>
                <option value="beginner">初級</option>
                <option value="intermediate">中級</option>
                <option value="advanced">上級</option>
              </select>
              
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortBy(field)
                  setSortOrder(order as 'asc' | 'desc')
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="uploadDate-desc">アップロード日 (新しい順)</option>
                <option value="uploadDate-asc">アップロード日 (古い順)</option>
                <option value="viewCount-desc">視聴数 (多い順)</option>
                <option value="viewCount-asc">視聴数 (少ない順)</option>
                <option value="title-asc">タイトル (A-Z)</option>
                <option value="title-desc">タイトル (Z-A)</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {filteredVideos.length}件の動画を表示中 (全{videos.length}件)
            </div>
            
            {selectedVideos.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {selectedVideos.length}件選択中
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('publish')}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    一括公開
                  </button>
                  <button
                    onClick={() => handleBulkAction('unpublish')}
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                  >
                    一括非公開
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    一括削除
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Videos Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedVideos.length === filteredVideos.length && filteredVideos.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    動画情報
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    講師・学部
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    カテゴリー・レベル
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    統計
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アップロード日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVideos.map((video) => (
                  <tr key={video.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedVideos.includes(video.id)}
                        onChange={() => handleSelectVideo(video.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                            <Video size={10} className="text-gray-500" />
                          </div>
                          <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white px-1 py-0.5 rounded text-xs">
                            {formatDuration(video.durationMinutes)}
                          </div>
                          {video.isPremium && (
                            <div className="absolute top-1 right-1">
                              <Lock size={12} className="text-purple-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 truncate">
                              {video.title}
                            </h3>
                            {video.isNew && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                NEW
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {video.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {video.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                            {video.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{video.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{video.instructor}</div>
                        <div className="text-sm text-gray-500">{video.department}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                          {getCategoryLabel(video.category)}
                        </span>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getLevelColor(video.level)}`}>
                          {getLevelLabel(video.level)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(video.status)}`}>
                          {getStatusLabel(video.status)}
                        </span>
                        {video.isPremium && (
                          <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                            プレミアム
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Eye size={14} />
                          {video.viewCount.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <TrendingUp size={14} />
                          {video.likeCount.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>{formatDate(video.uploadDate)}</div>
                      {video.publishDate && (
                        <div className="text-xs text-green-600">
                          公開: {formatDate(video.publishDate)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVideoAction('view', video.id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="プレビュー"
                        >
                          <Eye size={10} />
                        </button>
                        <button
                          onClick={() => handleVideoAction('edit', video.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="編集"
                        >
                          <Edit size={10} />
                        </button>
                        <button
                          onClick={() => handleVideoAction('publish', video.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            video.status === 'published'
                              ? 'text-gray-600 hover:bg-gray-100'
                              : 'text-green-600 hover:bg-green-100'
                          }`}
                          title={video.status === 'published' ? '非公開にする' : '公開する'}
                        >
                          {video.status === 'published' ? <Pause size={10} /> : <Play size={10} />}
                        </button>
                        <button
                          onClick={() => handleVideoAction('delete', video.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="削除"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <Video size={29} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                動画が見つかりません
              </h3>
              <p className="text-gray-600 mb-4">
                検索条件を変更するか、新しい動画をアップロードしてください
              </p>
              <Link
                href="/admin/videos/upload"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload size={18} />
                動画をアップロード
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}