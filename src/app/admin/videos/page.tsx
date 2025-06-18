'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { 
  AdminVideo, 
  generateMockAdminVideos,
  getStatusColor,
  getStatusLabel,
  formatNumber
} from '@/lib/admin'

export default function AdminVideos() {
  const [videos, setVideos] = useState<AdminVideo[]>([])
  const [filteredVideos, setFilteredVideos] = useState<AdminVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [editingVideo, setEditingVideo] = useState<AdminVideo | null>(null)

  useEffect(() => {
    setTimeout(() => {
      const mockVideos = generateMockAdminVideos()
      setVideos(mockVideos)
      setFilteredVideos(mockVideos)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = videos

    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(video => video.status === statusFilter)
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(video => video.department === departmentFilter)
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(video => video.level === levelFilter)
    }

    if (showPremiumOnly) {
      filtered = filtered.filter(video => video.isPremium)
    }

    setFilteredVideos(filtered)
  }, [videos, searchQuery, statusFilter, departmentFilter, levelFilter, showPremiumOnly])

  const handleDelete = (id: string) => {
    if (confirm('この動画を削除してもよろしいですか？')) {
      setVideos(videos.filter(v => v.id !== id))
    }
  }

  const handleEdit = (video: AdminVideo) => {
    setEditingVideo(video)
    setShowModal(true)
  }

  const handleCreate = () => {
    setEditingVideo(null)
    setShowModal(true)
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    setVideos(videos.map(v => 
      v.id === id ? { ...v, status: newStatus as any } : v
    ))
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-4xl mb-4">🎬</div>
            <div className="text-lg font-medium text-gray-600">動画データを読み込み中...</div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">動画管理</h1>
            <p className="text-gray-600">プラットフォームの動画コンテンツを管理</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            新しい動画
          </button>
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
            <div className="text-2xl font-bold text-yellow-600">
              {videos.filter(v => v.status === 'draft').length}
            </div>
            <div className="text-sm text-gray-600">下書き</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {videos.filter(v => v.isPremium).length}
            </div>
            <div className="text-sm text-gray-600">プレミアム</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <input
              type="text"
              placeholder="動画を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">すべてのステータス</option>
              <option value="published">公開中</option>
              <option value="draft">下書き</option>
              <option value="archived">アーカイブ</option>
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">すべての学部</option>
              <option value="AI基礎学部">AI基礎学部</option>
              <option value="業務効率化学部">業務効率化学部</option>
              <option value="データサイエンス学部">データサイエンス学部</option>
              <option value="AI開発学部">AI開発学部</option>
              <option value="ビジネスAI学部">ビジネスAI学部</option>
            </select>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">すべてのレベル</option>
              <option value="beginner">初級</option>
              <option value="intermediate">中級</option>
              <option value="advanced">上級</option>
            </select>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showPremiumOnly}
                onChange={(e) => setShowPremiumOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">プレミアムのみ</span>
            </label>
          </div>

          <div className="text-sm text-gray-600">
            {filteredVideos.length}件の動画が見つかりました
          </div>
        </div>

        {/* Video Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    動画情報
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    講師・学部
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    統計
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVideos.map((video) => (
                  <tr key={video.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">🎬</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {video.title}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {video.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{video.duration}</span>
                            {video.isPremium && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
                                プレミアム
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              video.level === 'beginner' ? 'bg-green-100 text-green-800' :
                              video.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {video.level === 'beginner' ? '初級' : 
                               video.level === 'intermediate' ? '中級' : '上級'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{video.instructor}</div>
                        <div className="text-sm text-gray-500">{video.department}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={video.status}
                        onChange={(e) => handleStatusChange(video.id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-medium border-none ${getStatusColor(video.status)}`}
                      >
                        <option value="published">公開中</option>
                        <option value="draft">下書き</option>
                        <option value="archived">アーカイブ</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div>👁️ {formatNumber(video.viewCount)}</div>
                        <div>👍 {formatNumber(video.likeCount)}</div>
                        <div>⭐ {video.averageRating.toFixed(1)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(video)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(video.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          削除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              動画が見つかりませんでした
            </h3>
            <p className="text-gray-600 mb-6">
              検索条件を変更するか、新しい動画を作成してください
            </p>
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              新しい動画を作成
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingVideo ? '動画を編集' : '新しい動画を作成'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    タイトル
                  </label>
                  <input
                    type="text"
                    defaultValue={editingVideo?.title || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="動画のタイトルを入力"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    説明
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={editingVideo?.description || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="動画の説明を入力"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      講師
                    </label>
                    <input
                      type="text"
                      defaultValue={editingVideo?.instructor || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      学部
                    </label>
                    <select
                      defaultValue={editingVideo?.department || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">学部を選択</option>
                      <option value="AI基礎学部">AI基礎学部</option>
                      <option value="業務効率化学部">業務効率化学部</option>
                      <option value="データサイエンス学部">データサイエンス学部</option>
                      <option value="AI開発学部">AI開発学部</option>
                      <option value="ビジネスAI学部">ビジネスAI学部</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      レベル
                    </label>
                    <select
                      defaultValue={editingVideo?.level || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="beginner">初級</option>
                      <option value="intermediate">中級</option>
                      <option value="advanced">上級</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ステータス
                    </label>
                    <select
                      defaultValue={editingVideo?.status || 'draft'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="draft">下書き</option>
                      <option value="published">公開中</option>
                      <option value="archived">アーカイブ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vimeo ID
                    </label>
                    <input
                      type="text"
                      defaultValue={editingVideo?.vimeoId || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="123456789"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked={editingVideo?.isPremium || false}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">プレミアム限定</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingVideo ? '更新' : '作成'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}