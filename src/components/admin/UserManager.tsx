'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface UserData {
  id: string
  email: string
  firstName: string
  lastName: string
  plan: 'free' | 'basic' | 'premium'
  role: 'user' | 'admin' | 'instructor'
  status: 'active' | 'suspended' | 'inactive'
  registrationDate: string
  lastLoginDate: string
  totalWatchTime: number
  completedCourses: number
  subscriptionStatus: 'active' | 'cancelled' | 'expired'
  paymentMethod?: string
  departments: string[]
}

export default function UserManager() {
  const { isAdmin } = useAuth()
  const [users, setUsers] = useState<UserData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlan, setFilterPlan] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)

  // モックユーザーデータを初期化
  useEffect(() => {
    const mockUsers: UserData[] = [
      {
        id: '1',
        email: 'admin@hajimete-ai.com',
        firstName: '管理者',
        lastName: 'AI',
        plan: 'premium',
        role: 'admin',
        status: 'active',
        registrationDate: '2024-01-01',
        lastLoginDate: '2024-01-23',
        totalWatchTime: 18750,
        completedCourses: 25,
        subscriptionStatus: 'active',
        paymentMethod: 'クレジットカード',
        departments: ['ai-basics', 'productivity', 'practical', 'ai-development']
      },
      {
        id: '2',
        email: 'tanaka@example.com',
        firstName: '太郎',
        lastName: '田中',
        plan: 'premium',
        role: 'user',
        status: 'active',
        registrationDate: '2024-01-15',
        lastLoginDate: '2024-01-22',
        totalWatchTime: 12450,
        completedCourses: 8,
        subscriptionStatus: 'active',
        paymentMethod: 'クレジットカード',
        departments: ['ai-basics', 'productivity']
      },
      {
        id: '3',
        email: 'sato@company.com',
        firstName: '花子',
        lastName: '佐藤',
        plan: 'basic',
        role: 'user',
        status: 'active',
        registrationDate: '2024-01-10',
        lastLoginDate: '2024-01-20',
        totalWatchTime: 8930,
        completedCourses: 5,
        subscriptionStatus: 'active',
        paymentMethod: 'PayPal',
        departments: ['productivity']
      },
      {
        id: '4',
        email: 'yamada@startup.jp',
        firstName: '次郎',
        lastName: '山田',
        plan: 'free',
        role: 'user',
        status: 'inactive',
        registrationDate: '2024-01-05',
        lastLoginDate: '2024-01-18',
        totalWatchTime: 2340,
        completedCourses: 1,
        subscriptionStatus: 'expired',
        departments: []
      },
      {
        id: '5',
        email: 'instructor@hajimete-ai.com',
        firstName: '専門',
        lastName: '講師',
        plan: 'premium',
        role: 'instructor',
        status: 'active',
        registrationDate: '2023-12-01',
        lastLoginDate: '2024-01-23',
        totalWatchTime: 45600,
        completedCourses: 15,
        subscriptionStatus: 'active',
        departments: ['ai-development', 'practical']
      }
    ]
    setUsers(mockUsers)
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    
    return matchesSearch && matchesPlan && matchesStatus
  })

  const handleUserAction = (userId: string, action: 'suspend' | 'activate' | 'delete' | 'upgrade' | 'downgrade') => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        switch (action) {
          case 'suspend':
            return { ...user, status: 'suspended' as const }
          case 'activate':
            return { ...user, status: 'active' as const }
          case 'upgrade':
            return { ...user, plan: user.plan === 'free' ? 'basic' : 'premium' }
          case 'downgrade':
            return { ...user, plan: user.plan === 'premium' ? 'basic' : 'free' }
          default:
            return user
        }
      }
      return user
    }))

    if (action === 'delete') {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const getPlanBadge = (plan: string) => {
    const badges = {
      free: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800'
    }
    return badges[plan as keyof typeof badges] || badges.free
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      inactive: 'bg-yellow-100 text-yellow-800'
    }
    return badges[status as keyof typeof badges] || badges.inactive
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
        <h1 className="text-3xl font-bold text-gray-900">ユーザー管理</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">総ユーザー数: {users.length}</span>
        </div>
      </div>

      {/* フィルターとサーチ */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">検索</label>
            <input
              type="text"
              placeholder="メールアドレスまたは名前で検索"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">プラン</label>
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">すべて</option>
              <option value="free">無料</option>
              <option value="basic">ベーシック</option>
              <option value="premium">プレミアム</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">すべて</option>
              <option value="active">アクティブ</option>
              <option value="inactive">非アクティブ</option>
              <option value="suspended">停止</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterPlan('all')
                setFilterStatus('all')
              }}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              リセット
            </button>
          </div>
        </div>
      </div>

      {/* ユーザー一覧 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ユーザー
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  プラン
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  学習状況
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最終ログイン
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.role !== 'user' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                            {user.role === 'admin' ? '管理者' : '講師'}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanBadge(user.plan)}`}>
                      {user.plan === 'free' ? '無料' : user.plan === 'basic' ? 'ベーシック' : 'プレミアム'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                      {user.status === 'active' ? 'アクティブ' : user.status === 'suspended' ? '停止' : '非アクティブ'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>⏱️ {Math.floor(user.totalWatchTime / 60)}時間</div>
                    <div>📚 {user.completedCourses}コース完了</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.lastLoginDate).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowUserModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        詳細
                      </button>
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleUserAction(user.id, 'suspend')}
                          className="text-red-600 hover:text-red-900"
                        >
                          停止
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserAction(user.id, 'activate')}
                          className="text-green-600 hover:text-green-900"
                        >
                          復活
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ユーザー詳細モーダル */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">ユーザー詳細</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">基本情報</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>名前:</strong> {selectedUser.firstName} {selectedUser.lastName}</div>
                  <div><strong>メール:</strong> {selectedUser.email}</div>
                  <div><strong>プラン:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${getPlanBadge(selectedUser.plan)}`}>
                      {selectedUser.plan === 'free' ? '無料' : selectedUser.plan === 'basic' ? 'ベーシック' : 'プレミアム'}
                    </span>
                  </div>
                  <div><strong>役割:</strong> {selectedUser.role === 'admin' ? '管理者' : selectedUser.role === 'instructor' ? '講師' : 'ユーザー'}</div>
                  <div><strong>登録日:</strong> {new Date(selectedUser.registrationDate).toLocaleDateString('ja-JP')}</div>
                  <div><strong>支払い方法:</strong> {selectedUser.paymentMethod || 'なし'}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">学習状況</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>総学習時間:</strong> {Math.floor(selectedUser.totalWatchTime / 60)}時間{selectedUser.totalWatchTime % 60}分</div>
                  <div><strong>完了コース:</strong> {selectedUser.completedCourses}コース</div>
                  <div><strong>最終ログイン:</strong> {new Date(selectedUser.lastLoginDate).toLocaleDateString('ja-JP')}</div>
                  <div><strong>サブスクリプション:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      selectedUser.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedUser.subscriptionStatus === 'active' ? 'アクティブ' : selectedUser.subscriptionStatus === 'cancelled' ? 'キャンセル' : '期限切れ'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">アクション</h3>
              <div className="flex flex-wrap gap-2">
                {selectedUser.plan !== 'premium' && (
                  <button
                    onClick={() => {
                      handleUserAction(selectedUser.id, 'upgrade')
                      setShowUserModal(false)
                    }}
                    className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                  >
                    プラン昇格
                  </button>
                )}
                {selectedUser.plan !== 'free' && (
                  <button
                    onClick={() => {
                      handleUserAction(selectedUser.id, 'downgrade')
                      setShowUserModal(false)
                    }}
                    className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                  >
                    プラン降格
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm('このユーザーを削除しますか？')) {
                      handleUserAction(selectedUser.id, 'delete')
                      setShowUserModal(false)
                    }
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  ユーザー削除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}