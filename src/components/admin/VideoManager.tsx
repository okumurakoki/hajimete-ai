'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface Video {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  videoUrl?: string
  duration: number
  status: 'draft' | 'published' | 'processing'
  department: string
  level: 'beginner' | 'intermediate' | 'advanced'
  isPremium: boolean
  views: number
  likes: number
  uploadDate: string
  instructorName: string
  tags: string[]
}

export default function VideoManager() {
  const { isAdmin } = useAuth()
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    department: 'ai-basics',
    level: 'beginner' as const,
    isPremium: false,
    instructorName: '',
    tags: ''
  })

  // モックデータを初期化
  useEffect(() => {
    setVideos([
      {
        id: '1',
        title: 'ChatGPT基礎講座 - プロンプトエンジニアリング',
        description: 'ChatGPTを効果的に使うためのプロンプト作成技術を学びます',
        thumbnailUrl: '/api/placeholder/video-thumb-1.jpg',
        videoUrl: 'https://vimeo.com/123456789',
        duration: 1800,
        status: 'published',
        department: 'ai-basics',
        level: 'beginner',
        isPremium: false,
        views: 2340,
        likes: 187,
        uploadDate: '2024-01-20',
        instructorName: '田中AI博士',
        tags: ['ChatGPT', 'プロンプト', '基礎']
      },
      {
        id: '2',
        title: 'Excel VBA自動化マスター',
        description: 'VBAを使ってExcel作業を完全自動化する方法',
        thumbnailUrl: '/api/placeholder/video-thumb-2.jpg',
        duration: 2700,
        status: 'processing',
        department: 'productivity',
        level: 'intermediate',
        isPremium: true,
        views: 0,
        likes: 0,
        uploadDate: '2024-01-22',
        instructorName: '佐藤エクセル先生',
        tags: ['Excel', 'VBA', '自動化']
      },
      {
        id: '3',
        title: '機械学習アルゴリズム入門',
        description: 'Python/scikit-learnで始める機械学習の基礎',
        thumbnailUrl: '/api/placeholder/video-thumb-3.jpg',
        duration: 3600,
        status: 'draft',
        department: 'ai-development',
        level: 'advanced',
        isPremium: true,
        views: 0,
        likes: 0,
        uploadDate: '2024-01-23',
        instructorName: '山田ML研究員',
        tags: ['Python', '機械学習', 'scikit-learn']
      }
    ])
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadFile(file)
    }
  }

  const simulateUpload = async () => {
    setIsUploading(true)
    setUploadProgress(0)

    // アップロードをシミュレート
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setUploadProgress(i)
    }

    // 新しい動画を追加
    const video: Video = {
      id: Date.now().toString(),
      ...newVideo,
      thumbnailUrl: '/api/placeholder/video-thumb-new.jpg',
      videoUrl: `https://vimeo.com/${Math.random().toString(36).substr(2, 9)}`,
      duration: 1800,
      status: 'processing',
      views: 0,
      likes: 0,
      uploadDate: new Date().toISOString().split('T')[0],
      tags: newVideo.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    }

    setVideos([video, ...videos])
    setIsUploading(false)
    setUploadProgress(0)
    setUploadFile(null)
    setShowUploadForm(false)
    setNewVideo({
      title: '',
      description: '',
      department: 'ai-basics',
      level: 'beginner',
      isPremium: false,
      instructorName: '',
      tags: ''
    })
  }

  const handleStatusChange = (videoId: string, newStatus: Video['status']) => {
    setVideos(videos.map(video => 
      video.id === videoId ? { ...video, status: newStatus } : video
    ))
  }

  const handleDeleteVideo = (videoId: string) => {
    if (confirm('この動画を削除しますか？')) {
      setVideos(videos.filter(video => video.id !== videoId))
    }
  }

  if (!isAdmin) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">アクセス拒否</h2>
        <p className="text-gray-600 mt-2">管理者権限が必要です</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">動画管理</h1>
        <button
          onClick={() => setShowUploadForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          動画アップロード
        </button>
      </div>

      {/* アップロードフォーム */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">新規動画アップロード</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">動画ファイル</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {uploadFile && (
                  <p className="text-sm text-green-600 mt-1">
                    選択されたファイル: {uploadFile.name}
                  </p>
                )}
              </div>

              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                  <p className="text-sm text-gray-600 mt-1">アップロード中... {uploadProgress}%</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">動画タイトル</label>
                  <input
                    type="text"
                    value={newVideo.title}
                    onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="動画のタイトルを入力"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">講師名</label>
                  <input
                    type="text"
                    value={newVideo.instructorName}
                    onChange={(e) => setNewVideo({...newVideo, instructorName: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="講師名を入力"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">説明</label>
                <textarea
                  value={newVideo.description}
                  onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="動画の説明を入力"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">学部</label>
                  <select
                    value={newVideo.department}
                    onChange={(e) => setNewVideo({...newVideo, department: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="ai-basics">AI基礎学部</option>
                    <option value="productivity">業務効率化学部</option>
                    <option value="practical">実践応用学部</option>
                    <option value="ai-development">AI開発学部</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">レベル</label>
                  <select
                    value={newVideo.level}
                    onChange={(e) => setNewVideo({...newVideo, level: e.target.value as any})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="beginner">初級</option>
                    <option value="intermediate">中級</option>
                    <option value="advanced">上級</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newVideo.isPremium}
                      onChange={(e) => setNewVideo({...newVideo, isPremium: e.target.checked})}
                      className="mr-2"
                    />
                    プレミアム限定
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">タグ（カンマ区切り）</label>
                <input
                  type="text"
                  value={newVideo.tags}
                  onChange={(e) => setNewVideo({...newVideo, tags: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="例: ChatGPT, AI, 基礎"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowUploadForm(false)}
                disabled={isUploading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={simulateUpload}
                disabled={!uploadFile || !newVideo.title || !newVideo.description || isUploading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isUploading ? 'アップロード中...' : 'アップロード開始'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 動画一覧 */}
      <div className="grid gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex gap-4">
              {/* サムネイル */}
              <div className="w-48 h-28 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">📹 サムネイル</span>
              </div>
              
              {/* 動画情報 */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold">{video.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    video.status === 'published' ? 'bg-green-100 text-green-800' :
                    video.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {video.status === 'published' ? '✅ 公開済み' :
                     video.status === 'processing' ? '⏳ 処理中' : '📝 下書き'}
                  </span>
                  {video.isPremium && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      ⭐ プレミアム
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-2">{video.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <span>👨‍🏫 {video.instructorName}</span>
                  <span>🏫 {video.department}</span>
                  <span>📊 {video.level}</span>
                  <span>⏱️ {Math.floor(video.duration / 60)}分</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>👁️ {video.views.toLocaleString()} 回視聴</span>
                  <span>👍 {video.likes.toLocaleString()} いいね</span>
                  <span>📅 {video.uploadDate}</span>
                </div>
                
                {video.tags.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {video.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* アクションボタン */}
              <div className="flex flex-col gap-2">
                {video.status === 'draft' && (
                  <button
                    onClick={() => handleStatusChange(video.id, 'published')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                  >
                    公開
                  </button>
                )}
                {video.status === 'published' && (
                  <button
                    onClick={() => handleStatusChange(video.id, 'draft')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
                  >
                    非公開
                  </button>
                )}
                <button
                  onClick={() => setSelectedVideo(video)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDeleteVideo(video.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}