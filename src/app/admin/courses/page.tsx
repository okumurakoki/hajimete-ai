'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { DashboardLayout } from '@/components/layout/Layout'
import { 
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Users,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface LiveCourse {
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
  isActive: boolean
  isPublished: boolean
  createdAt: string
  _count: {
    registrations: number
  }
}

interface FilterOptions {
  search: string
  category: string
  level: string
  status: string
}

export default function AdminCoursesPage() {
  const { userId } = useAuth()
  const [courses, setCourses] = useState<LiveCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: 'all',
    level: 'all',
    status: 'all'
  })

  useEffect(() => {
    if (userId) {
      fetchCourses()
    }
  }, [userId, filters])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.search) params.append('search', filters.search)
      if (filters.category !== 'all') params.append('category', filters.category)
      if (filters.level !== 'all') params.append('level', filters.level)
      if (filters.status !== 'all') params.append('status', filters.status)
      
      const response = await fetch(`/api/admin/courses?${params.toString()}`)
      
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses || [])
      } else {
        console.error('Failed to fetch courses')
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const togglePublished = async (courseId: string, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublished: !isPublished }),
      })

      if (response.ok) {
        fetchCourses()
      }
    } catch (error) {
      console.error('Error updating course:', error)
    }
  }

  const deleteCourse = async (courseId: string) => {
    if (!confirm('この講座を削除してもよろしいですか？この操作は元に戻せません。')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchCourses()
      }
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (course: LiveCourse) => {
    const now = new Date()
    const startDate = new Date(course.startDate)
    const endDate = new Date(course.endDate)

    if (!course.isPublished) {
      return <XCircle className="w-4 h-4 text-gray-500" />
    } else if (now < startDate) {
      return <Clock className="w-4 h-4 text-blue-500" />
    } else if (now >= startDate && now <= endDate) {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    } else {
      return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusText = (course: LiveCourse) => {
    const now = new Date()
    const startDate = new Date(course.startDate)
    const endDate = new Date(course.endDate)

    if (!course.isPublished) {
      return '非公開'
    } else if (now < startDate) {
      return '開催予定'
    } else if (now >= startDate && now <= endDate) {
      return '開催中'
    } else {
      return '終了済み'
    }
  }

  return (
    <DashboardLayout title="講座管理" description="AI講座・セミナーの管理">
      <div className="space-y-6">
        {/* ヘッダーアクション */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">講座管理</h1>
            <p className="text-gray-600 dark:text-gray-400">AI講座・セミナーの作成・管理を行います</p>
          </div>
          <Link
            href="/admin/courses/create"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            新規講座作成
          </Link>
        </div>

        {/* フィルター */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="講座名、講師名で検索..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">全カテゴリ</option>
              <option value="AI基礎">AI基礎</option>
              <option value="ChatGPT活用">ChatGPT活用</option>
              <option value="ビジネスAI">ビジネスAI</option>
              <option value="プログラミング">プログラミング</option>
              <option value="データ分析">データ分析</option>
            </select>
            
            <select
              value={filters.level}
              onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">全レベル</option>
              <option value="BEGINNER">初級</option>
              <option value="INTERMEDIATE">中級</option>
              <option value="ADVANCED">上級</option>
            </select>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">全ステータス</option>
              <option value="published">公開中</option>
              <option value="unpublished">非公開</option>
              <option value="upcoming">開催予定</option>
              <option value="ongoing">開催中</option>
              <option value="completed">終了済み</option>
            </select>
          </div>
        </div>

        {/* 講座一覧 */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">講座がありません</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              新しい講座を作成して始めましょう
            </p>
            <Link
              href="/admin/courses/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              新規講座作成
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      講座情報
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      日程
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      参加者
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      料金
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {course.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            講師: {course.instructor}
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-400">
                            {course.category} • {course.level}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {formatDate(course.startDate)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {course.duration}分
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {course._count.registrations} / {course.maxParticipants}
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ 
                              width: `${Math.min((course._count.registrations / course.maxParticipants) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          ¥{course.price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(course)}
                          <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                            {getStatusText(course)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/courses/live`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/courses/${course.id}/edit`}
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => togglePublished(course.id, course.isPublished)}
                            className={`${
                              course.isPublished 
                                ? 'text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300' 
                                : 'text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300'
                            }`}
                            title={course.isPublished ? '非公開にする' : '公開する'}
                          >
                            {course.isPublished ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => deleteCourse(course.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}