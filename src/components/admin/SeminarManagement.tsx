'use client'

import { useState } from 'react'
import { 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  DollarSign,
  BarChart3,
  MapPin,
  Star,
  BookOpen
} from 'lucide-react'

interface Seminar {
  id: string
  title: string
  description: string
  instructor: string
  startDate: string
  endDate: string
  duration: number
  price: number
  level: string
  category: string
  maxParticipants: number
  currentParticipants: number
  curriculum: string
  tags: string
  isActive: boolean
  isPublished: boolean
  zoomUrl?: string
  zoomId?: string
  zoomPassword?: string
  createdAt: string
  updatedAt: string
}

interface SeminarManagementProps {
  seminars: Seminar[]
  onCreateSeminar: () => void
  onEditSeminar: (seminar: Seminar) => void
  onDeleteSeminar: (seminarId: string) => void
  onToggleStatus: (seminarId: string, newStatus: boolean) => void
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'BEGINNER': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
    case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
    case 'ADVANCED': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
  }
}

const getLevelText = (level: string) => {
  switch (level) {
    case 'BEGINNER': return '初級'
    case 'INTERMEDIATE': return '中級'
    case 'ADVANCED': return '上級'
    default: return level
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function SeminarManagement({
  seminars,
  onCreateSeminar,
  onEditSeminar,
  onDeleteSeminar,
  onToggleStatus
}: SeminarManagementProps) {
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [search, setSearch] = useState('')

  const filteredSeminars = seminars.filter(seminar => {
    const matchesFilter = filter === 'all' || 
      (filter === 'published' && seminar.isPublished) ||
      (filter === 'draft' && !seminar.isPublished)
    
    const matchesSearch = search === '' ||
      seminar.title.toLowerCase().includes(search.toLowerCase()) ||
      seminar.instructor.toLowerCase().includes(search.toLowerCase()) ||
      seminar.category.toLowerCase().includes(search.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: seminars.length,
    published: seminars.filter(s => s.isPublished).length,
    draft: seminars.filter(s => !s.isPublished).length,
    participants: seminars.reduce((sum, s) => sum + s.currentParticipants, 0),
    revenue: seminars.reduce((sum, s) => sum + (s.price * s.currentParticipants), 0)
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">セミナー管理</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            ライブセミナーの作成・編集・公開管理
          </p>
        </div>
        <button
          onClick={onCreateSeminar}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          セミナーを作成
        </button>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">総セミナー数</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">公開中</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.published}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <EyeOff className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">下書き</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.draft}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">総参加者</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.participants}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">総売上</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                ¥{stats.revenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* フィルターと検索 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'すべて' },
              { key: 'published', label: '公開中' },
              { key: 'draft', label: '下書き' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1">
            <input
              type="text"
              placeholder="セミナー名、講師名、カテゴリで検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* セミナー一覧 */}
      {filteredSeminars.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {search ? '検索結果がありません' : 'セミナーがありません'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {search ? '別のキーワードで検索してみてください' : '最初のセミナーを作成しましょう'}
          </p>
          {!search && (
            <button
              onClick={onCreateSeminar}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              セミナーを作成
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSeminars.map((seminar) => (
            <div
              key={seminar.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {seminar.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(seminar.level)}`}>
                      {getLevelText(seminar.level)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      seminar.isPublished 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {seminar.isPublished ? '公開中' : '下書き'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {seminar.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(seminar.startDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {seminar.duration}分
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {seminar.currentParticipants}/{seminar.maxParticipants}名
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {seminar.instructor}
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      {seminar.category}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ¥{seminar.price.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => onToggleStatus(seminar.id, !seminar.isPublished)}
                    className={`p-2 rounded-lg transition-colors ${
                      seminar.isPublished
                        ? 'text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20'
                        : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'
                    }`}
                    title={seminar.isPublished ? '非公開にする' : '公開する'}
                  >
                    {seminar.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => onEditSeminar(seminar)}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="編集"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => {
                      if (confirm('このセミナーを削除しますか？この操作は取り消せません。')) {
                        onDeleteSeminar(seminar.id)
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* カリキュラム表示 */}
              {seminar.curriculum && seminar.curriculum !== '[]' && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    カリキュラム
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(seminar.curriculum).slice(0, 3).map((item: string, index: number) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                      >
                        {item}
                      </span>
                    ))}
                    {JSON.parse(seminar.curriculum).length > 3 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{JSON.parse(seminar.curriculum).length - 3}項目
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}