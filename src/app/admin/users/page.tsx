'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { 
  AdminUser, 
  generateMockAdminUsers,
  formatCurrency,
  formatNumber,
  getStatusColor,
  getStatusLabel
} from '@/lib/admin'

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all')

  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)

  useEffect(() => {
    setTimeout(() => {
      const mockUsers = generateMockAdminUsers()
      setUsers(mockUsers)
      setFilteredUsers(mockUsers)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = users

    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (planFilter !== 'all') {
      filtered = filtered.filter(user => user.plan === planFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    if (subscriptionFilter !== 'all') {
      filtered = filtered.filter(user => user.subscriptionStatus === subscriptionFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchQuery, planFilter, statusFilter, subscriptionFilter])

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user)
    setShowModal(true)
  }

  const handleCreate = () => {
    setEditingUser(null)
    setShowModal(true)
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: newStatus as any } : u
    ))
  }

  const handlePlanChange = (id: string, newPlan: string) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, plan: newPlan as any } : u
    ))
  }

  const handleDelete = (id: string) => {
    if (confirm('このユーザーを削除してもよろしいですか？')) {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  const getActivityColor = (lastLogin: string) => {
    const loginDate = new Date(lastLogin)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'text-green-600'
    if (diffDays <= 7) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getActivityLabel = (lastLogin: string) => {
    const loginDate = new Date(lastLogin)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return '今日'
    if (diffDays === 1) return '昨日'
    if (diffDays <= 7) return `${diffDays}日前`
    return `${diffDays}日以上前`
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-4xl mb-4">👥</div>
            <div className="text-lg font-medium text-gray-600">ユーザーデータを読み込み中...</div>
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
            <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
            <p className="text-gray-600">プラットフォームのユーザーアカウントを管理</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            新しいユーザー
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{formatNumber(users.length)}</div>
            <div className="text-sm text-gray-600">総ユーザー数</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.plan === 'basic').length}
            </div>
            <div className="text-sm text-gray-600">ベーシック</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.plan === 'premium').length}
            </div>
            <div className="text-sm text-gray-600">プレミアム</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">アクティブ</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <input
              type="text"
              placeholder="ユーザーを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />

            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">すべてのプラン</option>
              <option value="basic">ベーシック</option>
              <option value="premium">プレミアム</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">すべてのステータス</option>
              <option value="active">アクティブ</option>
              <option value="inactive">非アクティブ</option>
              <option value="suspended">停止中</option>
            </select>

            <select
              value={subscriptionFilter}
              onChange={(e) => setSubscriptionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">すべての契約状態</option>
              <option value="active">契約中</option>
              <option value="cancelled">解約済み</option>
              <option value="expired">期限切れ</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {filteredUsers.length}名のユーザーが見つかりました
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ユーザー情報
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    プラン・ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    利用状況
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクティビティ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {user.lastName} {user.firstName}
                          </h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-xs text-gray-400">
                            登録: {new Date(user.joinDate).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <select
                          value={user.plan}
                          onChange={(e) => handlePlanChange(user.id, e.target.value)}
                          className={`px-2 py-1 rounded text-xs font-medium border-none ${
                            user.plan === 'premium' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          <option value="basic">ベーシック</option>
                          <option value="premium">プレミアム</option>
                        </select>
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusChange(user.id, e.target.value)}
                          className={`px-2 py-1 rounded text-xs font-medium border-none ${getStatusColor(user.status)}`}
                        >
                          <option value="active">アクティブ</option>
                          <option value="inactive">非アクティブ</option>
                          <option value="suspended">停止中</option>
                        </select>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          user.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' :
                          user.subscriptionStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.subscriptionStatus === 'active' ? '契約中' :
                           user.subscriptionStatus === 'cancelled' ? '解約済み' : '期限切れ'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        <div>📺 {user.videosWatched}本視聴</div>
                        <div>⏱️ {Math.floor(user.totalWatchTime / 60)}時間</div>
                        <div>📅 {user.seminarsAttended}回参加</div>
                        <div className="text-xs text-gray-500">
                          売上: {formatCurrency(user.totalRevenue)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className={`text-sm font-medium ${getActivityColor(user.lastLogin)}`}>
                          {getActivityLabel(user.lastLogin)}
                        </div>
                        <div className="text-xs text-gray-500">
                          最終ログイン
                        </div>
                        {user.nextBillingDate && (
                          <div className="text-xs text-gray-500 mt-1">
                            次回課金: {new Date(user.nextBillingDate).toLocaleDateString('ja-JP')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          編集
                        </button>
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                          詳細
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
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
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ユーザーが見つかりませんでした
            </h3>
            <p className="text-gray-600 mb-6">
              検索条件を変更するか、新しいユーザーを作成してください
            </p>
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              新しいユーザーを作成
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingUser ? 'ユーザーを編集' : '新しいユーザーを作成'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓
                    </label>
                    <input
                      type="text"
                      defaultValue={editingUser?.lastName || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="山田"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      名
                    </label>
                    <input
                      type="text"
                      defaultValue={editingUser?.firstName || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="太郎"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    defaultValue={editingUser?.email || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="user@example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      プラン
                    </label>
                    <select
                      defaultValue={editingUser?.plan || 'basic'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="basic">ベーシック</option>
                      <option value="premium">プレミアム</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ステータス
                    </label>
                    <select
                      defaultValue={editingUser?.status || 'active'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">アクティブ</option>
                      <option value="inactive">非アクティブ</option>
                      <option value="suspended">停止中</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    契約状態
                  </label>
                  <select
                    defaultValue={editingUser?.subscriptionStatus || 'active'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">契約中</option>
                    <option value="cancelled">解約済み</option>
                    <option value="expired">期限切れ</option>
                  </select>
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
                    {editingUser ? '更新' : '作成'}
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