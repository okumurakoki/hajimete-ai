'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminData } from '@/contexts/AdminDataContext'
import Link from 'next/link'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  Calendar, 
  Crown,
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  Shield,
  Ban,
  AlertTriangle
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  plan: 'free' | 'basic' | 'premium'
  status: 'active' | 'inactive' | 'suspended'
  joinDate: string
  lastLogin?: string
  totalSpent: number
  coursesCompleted: number
  seminarsAttended: number
  isAdmin: boolean
  avatar?: string
  location?: string
  company?: string
  notes?: string
}

export default function AdminUsers() {
  const data = useAdminData()
  const [users, setUsers] = useState<UserData[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('joinDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  useEffect(() => {
    // モックユーザーデータの生成
    const mockUsers: UserData[] = [
      {
        id: 'user-1',
        firstName: '田中',
        lastName: '太郎',
        email: 'tanaka@example.com',
        phone: '090-1234-5678',
        plan: 'premium',
        status: 'active',
        joinDate: '2024-01-15',
        lastLogin: '2024-06-18',
        totalSpent: 89800,
        coursesCompleted: 15,
        seminarsAttended: 8,
        isAdmin: false,
        location: '東京都',
        company: '株式会社ABC'
      },
      {
        id: 'user-2',
        firstName: '山田',
        lastName: '花子',
        email: 'yamada@example.com',
        phone: '080-9876-5432',
        plan: 'basic',
        status: 'active',
        joinDate: '2024-02-20',
        lastLogin: '2024-06-17',
        totalSpent: 34500,
        coursesCompleted: 8,
        seminarsAttended: 3,
        isAdmin: false,
        location: '大阪府',
        company: 'XYZ株式会社'
      },
      {
        id: 'user-3',
        firstName: '佐藤',
        lastName: '次郎',
        email: 'sato@example.com',
        plan: 'free',
        status: 'inactive',
        joinDate: '2024-03-10',
        lastLogin: '2024-05-20',
        totalSpent: 0,
        coursesCompleted: 2,
        seminarsAttended: 0,
        isAdmin: false,
        location: '愛知県'
      },
      {
        id: 'user-4',
        firstName: '鈴木',
        lastName: '美咲',
        email: 'suzuki@example.com',
        phone: '070-1111-2222',
        plan: 'premium',
        status: 'active',
        joinDate: '2023-12-05',
        lastLogin: '2024-06-18',
        totalSpent: 156700,
        coursesCompleted: 28,
        seminarsAttended: 15,
        isAdmin: false,
        location: '福岡県',
        company: 'DEF Corporation'
      },
      {
        id: 'user-5',
        firstName: '高橋',
        lastName: '一郎',
        email: 'takahashi@example.com',
        plan: 'basic',
        status: 'suspended',
        joinDate: '2024-04-01',
        lastLogin: '2024-06-10',
        totalSpent: 12300,
        coursesCompleted: 3,
        seminarsAttended: 1,
        isAdmin: false,
        location: '北海道',
        notes: '利用規約違反のため一時停止中'
      }
    ]
    
    setUsers(mockUsers)
    setFilteredUsers(mockUsers)
  }, [])

  useEffect(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (user.company?.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesPlan = selectedPlan === 'all' || user.plan === selectedPlan
      const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus
      
      return matchesSearch && matchesPlan && matchesStatus
    })

    // ソート
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof UserData]
      let bValue: any = b[sortBy as keyof UserData]
      
      if (sortBy === 'joinDate' || sortBy === 'lastLogin') {
        aValue = new Date(aValue || 0).getTime()
        bValue = new Date(bValue || 0).getTime()
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredUsers(filtered)
  }, [users, searchQuery, selectedPlan, selectedStatus, sortBy, sortOrder])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString('ja-JP')}`
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800'
      case 'basic': return 'bg-blue-100 text-blue-800'
      case 'premium': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'free': return 'フリー'
      case 'basic': return 'ベーシック'
      case 'premium': return 'プレミアム'
      default: return 'フリー'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'アクティブ'
      case 'inactive': return '非アクティブ'
      case 'suspended': return '停止中'
      default: return 'アクティブ'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <UserCheck size={10} className="text-green-600" />
      case 'inactive': return <UserX size={10} className="text-gray-600" />
      case 'suspended': return <Ban size={10} className="text-red-600" />
      default: return <UserCheck size={10} className="text-green-600" />
    }
  }

  const handleUserAction = (action: string, userId: string) => {
    switch (action) {
      case 'edit':
        window.location.href = `/admin/users/${userId}/edit`
        break
      case 'view':
        window.location.href = `/admin/users/${userId}`
        break
      case 'suspend':
        if (confirm('このユーザーを停止しますか？')) {
          setUsers(users.map(user => 
            user.id === userId ? { ...user, status: 'suspended' } : user
          ))
        }
        break
      case 'activate':
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: 'active' } : user
        ))
        break
      case 'delete':
        if (confirm('このユーザーを削除しますか？この操作は取り消せません。')) {
          setUsers(users.filter(user => user.id !== userId))
        }
        break
    }
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id))
    }
  }

  // AdminDataContextからの統計データを使用
  const stats = {
    total: (data as any).users?.total || 0,
    active: (data as any).users?.active || 0,
    inactive: ((data as any).users?.total || 0) - ((data as any).users?.active || 0),
    suspended: Math.floor(((data as any).users?.total || 0) * 0.05), // 5%を停止中とする
    free: (data as any).users?.free || 0,
    basic: (data as any).users?.basic || 0,
    premium: (data as any).users?.premium || 0,
    totalRevenue: (data as any).revenue?.total || 0,
    avgSpent: (data as any).revenue?.avgPerUser || 0
  }

  return (
    <AdminLayout currentPage="users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
            <p className="text-gray-600">プラットフォーム利用者のアカウント管理・分析を行います</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/users/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              新規追加
            </Link>
            <Link
              href="/admin/users/export"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Users size={18} />
              エクスポート
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総ユーザー数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users size={12} className="text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">アクティブ</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <UserCheck size={12} className="text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">非アクティブ</p>
                <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
              </div>
              <UserX size={12} className="text-gray-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">停止中</p>
                <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
              </div>
              <Ban size={12} className="text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">フリー</p>
                <p className="text-2xl font-bold text-gray-600">{stats.free}</p>
              </div>
              <Shield size={12} className="text-gray-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ベーシック</p>
                <p className="text-2xl font-bold text-blue-600">{stats.basic}</p>
              </div>
              <Star size={12} className="text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">プレミアム</p>
                <p className="text-2xl font-bold text-purple-600">{stats.premium}</p>
              </div>
              <Crown size={12} className="text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総売上</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <DollarSign size={12} className="text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">平均支払額</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.avgSpent)}</p>
              </div>
              <TrendingUp size={12} className="text-orange-600" />
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
                  placeholder="ユーザー名、メールアドレス、会社名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">すべてのプラン</option>
                <option value="free">フリー</option>
                <option value="basic">ベーシック</option>
                <option value="premium">プレミアム</option>
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">すべてのステータス</option>
                <option value="active">アクティブ</option>
                <option value="inactive">非アクティブ</option>
                <option value="suspended">停止中</option>
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
                <option value="joinDate-desc">登録日 (新しい順)</option>
                <option value="joinDate-asc">登録日 (古い順)</option>
                <option value="lastLogin-desc">最終ログイン (新しい順)</option>
                <option value="lastLogin-asc">最終ログイン (古い順)</option>
                <option value="totalSpent-desc">支払額 (多い順)</option>
                <option value="totalSpent-asc">支払額 (少ない順)</option>
                <option value="firstName-asc">名前 (A-Z)</option>
                <option value="firstName-desc">名前 (Z-A)</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {filteredUsers.length}件のユーザーを表示中 (全{users.length}件)
            </div>
            
            {selectedUsers.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {selectedUsers.length}件選択中
                </span>
                <div className="flex gap-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                    一括編集
                  </button>
                  <button className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors">
                    プラン変更
                  </button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                    一括停止
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ユーザー情報
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    プラン・ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクティビティ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    支払情報
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    登録・ログイン
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </h3>
                            {user.isAdmin && (
                              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                                管理者
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 space-y-1">
                            <div className="flex items-center gap-1">
                              <Mail size={12} />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-1">
                                <Phone size={12} />
                                {user.phone}
                              </div>
                            )}
                            {user.company && (
                              <div className="text-xs text-gray-400">
                                {user.company}
                              </div>
                            )}
                            {user.location && (
                              <div className="text-xs text-gray-400">
                                📍 {user.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getPlanColor(user.plan)}`}>
                          {getPlanLabel(user.plan)}
                        </span>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(user.status)}
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(user.status)}`}>
                            {getStatusLabel(user.status)}
                          </span>
                        </div>
                        {user.notes && (
                          <div className="flex items-center gap-1 text-xs text-orange-600">
                            <AlertTriangle size={12} />
                            メモあり
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Users size={14} />
                          コース: {user.coursesCompleted}件
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar size={14} />
                          セミナー: {user.seminarsAttended}件
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-medium text-green-600">
                          {formatCurrency(user.totalSpent)}
                        </div>
                        <div className="text-xs text-gray-500">
                          累計支払額
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          登録: {formatDate(user.joinDate)}
                        </div>
                        {user.lastLogin && (
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            最終: {formatDate(user.lastLogin)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUserAction('view', user.id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="詳細表示"
                        >
                          <Eye size={10} />
                        </button>
                        <button
                          onClick={() => handleUserAction('edit', user.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="編集"
                        >
                          <Edit size={10} />
                        </button>
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleUserAction('suspend', user.id)}
                            className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                            title="停止"
                          >
                            <Ban size={10} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction('activate', user.id)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="有効化"
                          >
                            <UserCheck size={10} />
                          </button>
                        )}
                        <button
                          onClick={() => handleUserAction('delete', user.id)}
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
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users size={29} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ユーザーが見つかりません
              </h3>
              <p className="text-gray-600 mb-4">
                検索条件を変更するか、新しいユーザーを追加してください
              </p>
              <Link
                href="/admin/users/create"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                ユーザーを追加
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}