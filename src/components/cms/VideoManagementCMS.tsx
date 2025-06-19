'use client'

import { useState, useEffect } from 'react'
import { 
  Video, 
  Edit, 
  Trash2, 
  Upload, 
  Eye, 
  EyeOff, 
  ExternalLink,
  Search,
  Filter,
  MoreVertical,
  PlayCircle
} from 'lucide-react'
import { VimeoVideo, getVimeoVideo, getVimeoVideos, updateVimeoVideo, deleteVimeoVideo } from '@/lib/vimeo'
import { VideoRecord } from '@/lib/database-schema'

interface VideoManagementCMSProps {
  onVideoSelect?: (video: VideoRecord) => void
}

export default function VideoManagementCMS({ onVideoSelect }: VideoManagementCMSProps) {
  const [videos, setVideos] = useState<VideoRecord[]>([])
  const [vimeoVideos, setVimeoVideos] = useState<VimeoVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterDepartment, setFilterDepartment] = useState<string>('all')
  const [selectedVideos, setSelectedVideos] = useState<string[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [editingVideo, setEditingVideo] = useState<VideoRecord | null>(null)

  const departments = [
    { id: 'ai-basics', name: 'AI基礎学部' },
    { id: 'productivity', name: '業務効率化学部' },
    { id: 'practical', name: '実践応用学部' },
    { id: 'ai-development', name: 'AI開発学部' }
  ]

  const statusOptions = [
    { value: 'all', label: 'すべて' },
    { value: 'draft', label: '下書き' },
    { value: 'published', label: '公開中' },
    { value: 'archived', label: 'アーカイブ' }
  ]

  // モックデータの生成
  useEffect(() => {
    const generateMockVideos = (): VideoRecord[] => {
      return [
        {
          id: '1',
          title: 'ChatGPT基礎講座 - プロンプトエンジニアリング',
          description: 'ChatGPTを効果的に使うためのプロンプト作成技術を学びます',
          vimeo_id: '123456789',
          vimeo_uri: '/videos/123456789',
          thumbnail_url: 'https://i.vimeocdn.com/video/123456789.jpg',
          duration: 1800,
          department: 'ai-basics',
          level: 'beginner',
          category: 'tutorial',
          is_premium: false,
          is_featured: true,
          is_popular: true,
          tags: ['ChatGPT', 'プロンプト', 'AI', '基礎'],
          instructor_name: '田中AI博士',
          upload_date: new Date('2024-01-20'),
          published_date: new Date('2024-01-22'),
          status: 'published',
          view_count: 15780,
          like_count: 892,
          created_at: new Date('2024-01-20'),
          updated_at: new Date('2024-01-22')
        },
        {
          id: '2',
          title: 'Excel VBA自動化マスター',
          description: 'VBAを使ってExcel作業を完全自動化する方法',
          vimeo_id: '234567890',
          vimeo_uri: '/videos/234567890',
          thumbnail_url: 'https://i.vimeocdn.com/video/234567890.jpg',
          duration: 2700,
          department: 'productivity',
          level: 'intermediate',
          category: 'workshop',
          is_premium: true,
          is_featured: false,
          is_popular: true,
          tags: ['Excel', 'VBA', '自動化', '業務効率'],
          instructor_name: '佐藤エクセル先生',
          upload_date: new Date('2024-01-22'),
          published_date: undefined,
          status: 'draft',
          view_count: 0,
          like_count: 0,
          created_at: new Date('2024-01-22'),
          updated_at: new Date('2024-01-22')
        },
        {
          id: '3',
          title: 'Python機械学習入門',
          description: 'Pythonとscikit-learnで始める機械学習の基礎',
          vimeo_id: '345678901',
          vimeo_uri: '/videos/345678901',
          thumbnail_url: 'https://i.vimeocdn.com/video/345678901.jpg',
          duration: 3600,
          department: 'ai-development',
          level: 'advanced',
          category: 'lecture',
          is_premium: true,
          is_featured: true,
          is_popular: false,
          tags: ['Python', '機械学習', 'scikit-learn', 'AI開発'],
          instructor_name: '山田ML研究員',
          upload_date: new Date('2024-01-23'),
          published_date: new Date('2024-01-25'),
          status: 'published',
          view_count: 9870,
          like_count: 612,
          created_at: new Date('2024-01-23'),
          updated_at: new Date('2024-01-25')
        }
      ]
    }

    setVideos(generateMockVideos())
    setLoading(false)
  }, [])

  // フィルタリングされた動画
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.instructor_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || video.status === filterStatus
    const matchesDepartment = filterDepartment === 'all' || video.department === filterDepartment
    
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const handleVideoStatusChange = async (videoId: string, newStatus: 'draft' | 'published' | 'archived') => {
    setVideos(videos.map(video => 
      video.id === videoId 
        ? { ...video, status: newStatus, updated_at: new Date() }
        : video
    ))
  }

  const handleVideoDelete = async (videoId: string) => {
    if (confirm('この動画を削除してもよろしいですか？削除されたデータは復元できません。')) {
      try {
        const video = videos.find(v => v.id === videoId)
        if (video) {
          // Vimeoからも削除
          await deleteVimeoVideo(video.vimeo_id)
        }
        setVideos(videos.filter(v => v.id !== videoId))
      } catch (error) {
        console.error('Delete error:', error)
        alert('削除に失敗しました。')
      }
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedVideos.length === 0) return

    switch (action) {
      case 'publish':
        selectedVideos.forEach(id => handleVideoStatusChange(id, 'published'))
        break
      case 'unpublish':
        selectedVideos.forEach(id => handleVideoStatusChange(id, 'draft'))
        break
      case 'archive':
        selectedVideos.forEach(id => handleVideoStatusChange(id, 'archived'))
        break
      case 'delete':
        if (confirm(`選択された${selectedVideos.length}件の動画を削除してもよろしいですか？`)) {
          selectedVideos.forEach(id => handleVideoDelete(id))
        }
        break
    }
    setSelectedVideos([])
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800'
    }
    const labels = {
      draft: '下書き',
      published: '公開中',
      archived: 'アーカイブ'
    }
    return { className: badges[status as keyof typeof badges], label: labels[status as keyof typeof labels] }
  }

  const getDepartmentName = (id: string) => {
    return departments.find(d => d.id === id)?.name || id
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">動画データを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">動画管理</h1>
          <p className="text-gray-600">Vimeoとの連携により動画コンテンツを管理</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Upload size={10} />
            動画アップロード
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{videos.length}</div>
          <div className="text-sm text-gray-600">総動画数</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {videos.filter(v => v.status === 'published').length}
          </div>
          <div className="text-sm text-gray-600">公開中</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {videos.filter(v => v.is_premium).length}
          </div>
          <div className="text-sm text-gray-600">プレミアム限定</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            {videos.reduce((sum, v) => sum + v.view_count, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">総視聴回数</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
              <input
                type="text"
                placeholder="動画タイトルや講師名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">すべての学部</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedVideos.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedVideos.length}件の動画が選択されています
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('publish')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  一括公開
                </button>
                <button
                  onClick={() => handleBulkAction('unpublish')}
                  className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                >
                  一括非公開
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  一括削除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedVideos.length === filteredVideos.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedVideos(filteredVideos.map(v => v.id))
                      } else {
                        setSelectedVideos([])
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  動画情報
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  統計
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  更新日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVideos.map((video) => {
                const statusBadge = getStatusBadge(video.status)
                return (
                  <tr key={video.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedVideos.includes(video.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedVideos([...selectedVideos, video.id])
                          } else {
                            setSelectedVideos(selectedVideos.filter(id => id !== video.id))
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {video.thumbnail_url ? (
                            <img 
                              src={video.thumbnail_url} 
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Video size={10} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{video.title}</h3>
                          <p className="text-sm text-gray-500">{video.instructor_name}</p>
                          <p className="text-sm text-gray-500">{getDepartmentName(video.department)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">
                              {Math.floor(video.duration / 60)}分
                            </span>
                            {video.is_premium && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
                                プレミアム
                              </span>
                            )}
                            {video.is_featured && (
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs">
                                特集
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.className}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div>👁️ {video.view_count.toLocaleString()}</div>
                        <div>👍 {video.like_count.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {video.updated_at.toLocaleDateString('ja-JP')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(`https://vimeo.com/${video.vimeo_id}`, '_blank')}
                          className="text-blue-600 hover:text-blue-700"
                          title="Vimeoで表示"
                        >
                          <ExternalLink size={10} />
                        </button>
                        <button
                          onClick={() => setEditingVideo(video)}
                          className="text-gray-600 hover:text-gray-700"
                          title="編集"
                        >
                          <Edit size={10} />
                        </button>
                        <button
                          onClick={() => {
                            const newStatus = video.status === 'published' ? 'draft' : 'published'
                            handleVideoStatusChange(video.id, newStatus)
                          }}
                          className="text-gray-600 hover:text-gray-700"
                          title={video.status === 'published' ? '非公開にする' : '公開する'}
                        >
                          {video.status === 'published' ? <EyeOff size={10} /> : <Eye size={10} />}
                        </button>
                        <button
                          onClick={() => handleVideoDelete(video.id)}
                          className="text-red-600 hover:text-red-700"
                          title="削除"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <Video size={29} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">動画が見つかりませんでした</h3>
          <p className="text-gray-600 mb-6">
            検索条件を変更するか、新しい動画をアップロードしてください
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            動画をアップロード
          </button>
        </div>
      )}
    </div>
  )
}