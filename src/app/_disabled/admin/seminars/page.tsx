'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2, 
  Users, 
  Clock, 
  Video, 
  Star,
  Play,
  Pause,
  UserCheck,
  Globe,
  Lock,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface SeminarData {
  id: string
  title: string
  description: string
  instructor: string
  date: string
  startTime: string
  endTime: string
  capacity: number
  registered: number
  attended?: number
  isPremium: boolean
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  zoomMeetingId?: string
  zoomPasscode?: string
  averageRating?: number
  tags: string[]
  revenue?: number
  feedback?: number
}

export default function AdminSeminars() {
  const [seminars, setSeminars] = useState<SeminarData[]>([])
  const [filteredSeminars, setFilteredSeminars] = useState<SeminarData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [dateFilter, setDateFilter] = useState<string>('all')

  const [showModal, setShowModal] = useState(false)
  const [editingSeminar, setEditingSeminar] = useState<SeminarData | null>(null)
  const [selectedSeminars, setSelectedSeminars] = useState<string[]>([])

  useEffect(() => {
    // モックセミナーデータの生成
    const mockSeminars: SeminarData[] = [
      {
        id: 'seminar-1',
        title: 'ChatGPT活用実践セミナー',
        description: 'ビジネスでのChatGPT活用法を実践的に学ぶセミナーです。',
        instructor: '田中AI博士',
        date: '2024-06-20',
        startTime: '14:00',
        endTime: '16:00',
        capacity: 100,
        registered: 85,
        attended: 78,
        isPremium: false,
        status: 'completed',
        zoomMeetingId: '123-456-789',
        zoomPasscode: 'ai2024',
        averageRating: 4.5,
        tags: ['ChatGPT', 'ビジネス', '実践'],
        revenue: 425000,
        feedback: 75
      },
      {
        id: 'seminar-2',
        title: 'AI画像生成ワークショップ',
        description: 'Midjourney、DALL-Eを使った画像生成技術を体験できます。',
        instructor: '山田クリエイター',
        date: '2024-06-25',
        startTime: '10:00',
        endTime: '12:00',
        capacity: 50,
        registered: 45,
        isPremium: true,
        status: 'upcoming',
        zoomMeetingId: '987-654-321',
        zoomPasscode: 'create2024',
        tags: ['AI画像', 'Midjourney', 'DALL-E'],
        revenue: 0
      },
      {
        id: 'seminar-3',
        title: 'プロンプトエンジニアリング上級編',
        description: '高度なプロンプト設計技術とテクニックを学びます。',
        instructor: '佐藤プロンプター',
        date: '2024-06-22',
        startTime: '19:00',
        endTime: '21:00',
        capacity: 30,
        registered: 28,
        isPremium: true,
        status: 'ongoing',
        zoomMeetingId: '555-123-456',
        zoomPasscode: 'prompt2024',
        tags: ['プロンプト', '上級', 'エンジニアリング'],
        revenue: 0
      },
      {
        id: 'seminar-4',
        title: 'AI開発者向けPython講座',
        description: 'AI開発に必要なPython技術を基礎から応用まで学習します。',
        instructor: '鈴木開発者',
        date: '2024-06-30',
        startTime: '13:00',
        endTime: '17:00',
        capacity: 80,
        registered: 12,
        isPremium: false,
        status: 'upcoming',
        zoomMeetingId: '444-789-123',
        zoomPasscode: 'python2024',
        tags: ['Python', 'AI開発', 'プログラミング']
      },
      {
        id: 'seminar-5',
        title: '機械学習モデル構築セミナー',
        description: '実際のデータを使って機械学習モデルを構築する実践セミナーです。',
        instructor: '高橋ML研究員',
        date: '2024-06-18',
        startTime: '15:00',
        endTime: '18:00',
        capacity: 60,
        registered: 60,
        isPremium: true,
        status: 'cancelled',
        tags: ['機械学習', 'モデル構築', '実践']
      }
    ]
    
    setSeminars(mockSeminars)
    setFilteredSeminars(mockSeminars)
    setLoading(false)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    })
  }

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString('ja-JP')}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'ongoing': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming': return '予定'
      case 'ongoing': return '進行中'
      case 'completed': return '完了'
      case 'cancelled': return 'キャンセル'
      default: return '予定'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Clock size={10} className="text-blue-600" />
      case 'ongoing': return <Play size={10} className="text-green-600" />
      case 'completed': return <CheckCircle size={10} className="text-gray-600" />
      case 'cancelled': return <XCircle size={10} className="text-red-600" />
      default: return <Clock size={10} className="text-blue-600" />
    }
  }

  const getCapacityColor = (registered: number, capacity: number) => {
    const ratio = registered / capacity
    if (ratio >= 1.0) return 'text-red-600'
    if (ratio >= 0.8) return 'text-yellow-600'
    return 'text-green-600'
  }

  const handleEdit = (seminar: SeminarData) => {
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

  const handleSeminarAction = (action: string, seminarId: string) => {
    switch (action) {
      case 'edit':
        const seminar = seminars.find(s => s.id === seminarId)
        if (seminar) handleEdit(seminar)
        break
      case 'view':
        window.open(`/seminars/${seminarId}`, '_blank')
        break
      case 'join':
        const joinSeminar = seminars.find(s => s.id === seminarId)
        if (joinSeminar?.zoomMeetingId) {
          alert(`Zoom Meeting ID: ${joinSeminar.zoomMeetingId}`)
        }
        break
      case 'delete':
        if (confirm('このセミナーを削除しますか？')) {
          setSeminars(seminars.filter(s => s.id !== seminarId))
        }
        break
    }
  }

  const handleSelectSeminar = (seminarId: string) => {
    setSelectedSeminars(prev => 
      prev.includes(seminarId)
        ? prev.filter(id => id !== seminarId)
        : [...prev, seminarId]
    )
  }

  const handleSelectAll = () => {
    if (selectedSeminars.length === filteredSeminars.length) {
      setSelectedSeminars([])
    } else {
      setSelectedSeminars(filteredSeminars.map(seminar => seminar.id))
    }
  }

  const stats = {
    total: seminars.length,
    upcoming: seminars.filter(s => s.status === 'upcoming').length,
    ongoing: seminars.filter(s => s.status === 'ongoing').length,
    completed: seminars.filter(s => s.status === 'completed').length,
    cancelled: seminars.filter(s => s.status === 'cancelled').length,
    premium: seminars.filter(s => s.isPremium).length,
    totalRegistered: seminars.reduce((sum, s) => sum + s.registered, 0),
    totalRevenue: seminars.reduce((sum, s) => sum + (s.revenue || 0), 0)
  }

  if (loading) {
    return (
      <AdminLayout currentPage="seminars">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Calendar size={29} className="mx-auto text-gray-400 mb-4" />
            <div className="text-lg font-medium text-gray-600">セミナーデータを読み込み中...</div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout currentPage="seminars">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">セミナー管理</h1>
            <p className="text-gray-600">ライブセミナー・ウェビナーの管理・運営を行います</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/seminars/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              新規作成
            </Link>
            <Link
              href="/admin/seminars/bulk-import"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Calendar size={18} />
              一括インポート
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総セミナー数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Calendar size={12} className="text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">予定</p>
                <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
              </div>
              <Clock size={12} className="text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">進行中</p>
                <p className="text-2xl font-bold text-green-600">{stats.ongoing}</p>
              </div>
              <Play size={12} className="text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">完了</p>
                <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
              </div>
              <CheckCircle size={12} className="text-gray-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">キャンセル</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <XCircle size={12} className="text-red-600" />
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
                <p className="text-sm font-medium text-gray-600">総参加者</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalRegistered.toLocaleString()}</p>
              </div>
              <Users size={12} className="text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総売上</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <TrendingUp size={12} className="text-green-600" />
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
                  placeholder="セミナータイトル、講師名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">すべての日程</option>
                <option value="today">今日</option>
                <option value="this_week">今週</option>
                <option value="this_month">今月</option>
              </select>
              
              <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg">
                <input
                  type="checkbox"
                  checked={showPremiumOnly}
                  onChange={(e) => setShowPremiumOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">プレミアムのみ</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {filteredSeminars.length}件のセミナーを表示中 (全{seminars.length}件)
            </div>
            
            {selectedSeminars.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {selectedSeminars.length}件選択中
                </span>
                <div className="flex gap-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                    一括編集
                  </button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                    一括削除
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seminars Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedSeminars.length === filteredSeminars.length && filteredSeminars.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    セミナー情報
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日時・講師
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    参加状況
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    売上・評価
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSeminars.map((seminar) => (
                  <tr key={seminar.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedSeminars.includes(seminar.id)}
                        onChange={() => handleSelectSeminar(seminar.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {seminar.date.split('-')[2]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">
                              {seminar.title}
                            </h3>
                            {seminar.isPremium && (
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                                プレミアム
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {seminar.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {seminar.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                            {seminar.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{seminar.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {formatDate(seminar.date)}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock size={14} />
                          {seminar.startTime} - {seminar.endTime}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <UserCheck size={14} />
                          {seminar.instructor}
                        </div>
                        {seminar.zoomMeetingId && (
                          <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                            <Video size={12} />
                            Zoom: {seminar.zoomMeetingId}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className={`text-sm font-medium ${getCapacityColor(seminar.registered, seminar.capacity)}`}>
                          {seminar.registered.toLocaleString()} / {seminar.capacity.toLocaleString()}名
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              seminar.registered / seminar.capacity >= 1.0 ? 'bg-red-500' :
                              seminar.registered / seminar.capacity >= 0.8 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min((seminar.registered / seminar.capacity) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round((seminar.registered / seminar.capacity) * 100)}% 埋まり
                        </div>
                        {seminar.attended !== undefined && (
                          <div className="text-xs text-green-600">
                            実参加: {seminar.attended.toLocaleString()}名
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(seminar.status)}
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(seminar.status)}`}>
                            {getStatusLabel(seminar.status)}
                          </span>
                        </div>
                        {seminar.averageRating && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Star size={12} className="text-yellow-500" />
                            {seminar.averageRating.toFixed(1)}
                            <span className="text-gray-400">({seminar.feedback}件)</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        {seminar.revenue !== undefined && (
                          <div className="font-medium text-green-600">
                            {formatCurrency(seminar.revenue)}
                          </div>
                        )}
                        {seminar.status === 'completed' && seminar.averageRating && (
                          <div className="text-xs text-gray-500">
                            満足度: {(seminar.averageRating * 20).toFixed(0)}%
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSeminarAction('view', seminar.id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="プレビュー"
                        >
                          <Eye size={10} />
                        </button>
                        <button
                          onClick={() => handleSeminarAction('edit', seminar.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="編集"
                        >
                          <Edit size={10} />
                        </button>
                        {seminar.zoomMeetingId && seminar.status === 'ongoing' && (
                          <button
                            onClick={() => handleSeminarAction('join', seminar.id)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Zoom参加"
                          >
                            <Video size={10} />
                          </button>
                        )}
                        <button
                          onClick={() => handleSeminarAction('delete', seminar.id)}
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
          
          {filteredSeminars.length === 0 && (
            <div className="text-center py-12">
              <Calendar size={29} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                セミナーが見つかりません
              </h3>
              <p className="text-gray-600 mb-4">
                検索条件を変更するか、新しいセミナーを作成してください
              </p>
              <Link
                href="/admin/seminars/create"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                セミナーを作成
              </Link>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  )
}