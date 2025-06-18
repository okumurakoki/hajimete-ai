'use client'

import { useState, useEffect } from 'react'

// Disable static generation for admin pages
export const dynamic = 'force-dynamic'
import AdminLayout from '@/components/AdminLayout'
import { 
  AdminSeminar, 
  generateMockAdminSeminars,
  getStatusColor,
  getStatusLabel,
  formatNumber
} from '@/lib/admin'

export default function AdminSeminars() {
  const [seminars, setSeminars] = useState<AdminSeminar[]>([])
  const [filteredSeminars, setFilteredSeminars] = useState<AdminSeminar[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [dateFilter, setDateFilter] = useState<string>('all')

  const [showModal, setShowModal] = useState(false)
  const [editingSeminar, setEditingSeminar] = useState<AdminSeminar | null>(null)

  useEffect(() => {
    setTimeout(() => {
      const mockSeminars = generateMockAdminSeminars()
      setSeminars(mockSeminars)
      setFilteredSeminars(mockSeminars)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = seminars

    if (searchQuery) {
      filtered = filtered.filter(seminar =>
        seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seminar.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seminar.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(seminar => seminar.status === statusFilter)
    }

    if (showPremiumOnly) {
      filtered = filtered.filter(seminar => seminar.isPremium)
    }

    if (dateFilter !== 'all') {
      const today = new Date()
      const todayStr = today.toISOString().split('T')[0]
      
      filtered = filtered.filter(seminar => {
        const seminarDate = new Date(seminar.date)
        switch (dateFilter) {
          case 'today':
            return seminar.date === todayStr
          case 'this_week':
            const weekFromNow = new Date(today)
            weekFromNow.setDate(today.getDate() + 7)
            return seminarDate >= today && seminarDate <= weekFromNow
          case 'this_month':
            return seminarDate.getMonth() === today.getMonth() && 
                   seminarDate.getFullYear() === today.getFullYear()
          default:
            return true
        }
      })
    }

    setFilteredSeminars(filtered)
  }, [seminars, searchQuery, statusFilter, showPremiumOnly, dateFilter])

  const handleDelete = (id: string) => {
    if (confirm('このセミナーを削除してもよろしいですか？')) {
      setSeminars(seminars.filter(s => s.id !== id))
    }
  }

  const handleEdit = (seminar: AdminSeminar) => {
    setEditingSeminar(seminar)
    setShowModal(true)
  }

  const handleCreate = () => {
    setEditingSeminar(null)
    setShowModal(true)
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    setSeminars(seminars.map(s => 
      s.id === id ? { ...s, status: newStatus as any } : s
    ))
  }

  const getCapacityColor = (registered: number, capacity: number) => {
    const ratio = registered / capacity
    if (ratio >= 0.9) return 'text-red-600'
    if (ratio >= 0.7) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-4xl mb-4">📅</div>
            <div className="text-lg font-medium text-gray-600">セミナーデータを読み込み中...</div>
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
            <h1 className="text-2xl font-bold text-gray-900">セミナー管理</h1>
            <p className="text-gray-600">ライブセミナー・ウェビナーの管理</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            新しいセミナー
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{seminars.length}</div>
            <div className="text-sm text-gray-600">総セミナー数</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {seminars.filter(s => s.status === 'upcoming').length}
            </div>
            <div className="text-sm text-gray-600">予定</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {seminars.filter(s => s.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">完了</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {seminars.filter(s => s.isPremium).length}
            </div>
            <div className="text-sm text-gray-600">プレミアム</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <input
              type="text"
              placeholder="セミナーを検索..."
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
              <option value="upcoming">予定</option>
              <option value="ongoing">進行中</option>
              <option value="completed">完了</option>
              <option value="cancelled">キャンセル</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">すべての日程</option>
              <option value="today">今日</option>
              <option value="this_week">今週</option>
              <option value="this_month">今月</option>
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
            {filteredSeminars.length}件のセミナーが見つかりました
          </div>
        </div>

        {/* Seminars Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    セミナー情報
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日時・講師
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    参加者
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSeminars.map((seminar) => (
                  <tr key={seminar.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {seminar.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {seminar.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {seminar.isPremium && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
                              プレミアム
                            </span>
                          )}
                          {seminar.zoomMeetingId && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                              Zoom
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(seminar.date).toLocaleDateString('ja-JP')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {seminar.startTime} - {seminar.endTime}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          👨‍🏫 {seminar.instructor}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className={`text-sm font-medium ${getCapacityColor(seminar.registered, seminar.capacity)}`}>
                          {seminar.registered} / {seminar.capacity}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round((seminar.registered / seminar.capacity) * 100)}% 埋まり
                        </div>
                        {seminar.attended !== undefined && (
                          <div className="text-xs text-gray-500 mt-1">
                            実参加: {seminar.attended}名
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <select
                          value={seminar.status}
                          onChange={(e) => handleStatusChange(seminar.id, e.target.value)}
                          className={`px-2 py-1 rounded text-xs font-medium border-none ${getStatusColor(seminar.status)}`}
                        >
                          <option value="upcoming">予定</option>
                          <option value="ongoing">進行中</option>
                          <option value="completed">完了</option>
                          <option value="cancelled">キャンセル</option>
                        </select>
                        {seminar.averageRating && (
                          <div className="text-xs text-gray-500">
                            ⭐ {seminar.averageRating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(seminar)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          編集
                        </button>
                        {seminar.zoomMeetingId && (
                          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                            参加
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(seminar.id)}
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
        {filteredSeminars.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              セミナーが見つかりませんでした
            </h3>
            <p className="text-gray-600 mb-6">
              検索条件を変更するか、新しいセミナーを作成してください
            </p>
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              新しいセミナーを作成
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingSeminar ? 'セミナーを編集' : '新しいセミナーを作成'}
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
                    defaultValue={editingSeminar?.title || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="セミナーのタイトルを入力"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    説明
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={editingSeminar?.description || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="セミナーの説明を入力"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      講師
                    </label>
                    <input
                      type="text"
                      defaultValue={editingSeminar?.instructor || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      定員
                    </label>
                    <input
                      type="number"
                      defaultValue={editingSeminar?.capacity || 100}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      日付
                    </label>
                    <input
                      type="date"
                      defaultValue={editingSeminar?.date || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      開始時間
                    </label>
                    <input
                      type="time"
                      defaultValue={editingSeminar?.startTime || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      終了時間
                    </label>
                    <input
                      type="time"
                      defaultValue={editingSeminar?.endTime || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zoom Meeting ID
                    </label>
                    <input
                      type="text"
                      defaultValue={editingSeminar?.zoomMeetingId || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="123-456-789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zoom パスコード
                    </label>
                    <input
                      type="text"
                      defaultValue={editingSeminar?.zoomPasscode || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ステータス
                    </label>
                    <select
                      defaultValue={editingSeminar?.status || 'upcoming'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="upcoming">予定</option>
                      <option value="ongoing">進行中</option>
                      <option value="completed">完了</option>
                      <option value="cancelled">キャンセル</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked={editingSeminar?.isPremium || false}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">プレミアム限定</span>
                    </label>
                  </div>
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
                    {editingSeminar ? '更新' : '作成'}
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