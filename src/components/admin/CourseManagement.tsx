// src/components/admin/CourseManagement.tsx
'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  Clock, 
  Play, 
  BookOpen,
  Grid,
  List,
  Star,
  Users,
  Calendar,
  MoreHorizontal
} from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  videoUrl?: string
  status: 'draft' | 'published'
  departmentId: string
  department?: { name: string }
  lessonsCount: number
  enrolledCount?: number
  createdAt?: string
}

interface CourseManagementProps {
  courses: Course[]
  departments: Array<{ id: string; name: string; color?: string }>
  onCreateCourse: () => void
  onEditCourse: (course: Course) => void
  onDeleteCourse: (courseId: string) => void
  onToggleStatus: (courseId: string, newStatus: 'draft' | 'published') => void
}

export default function CourseManagement({ 
  courses, 
  departments, 
  onCreateCourse, 
  onEditCourse, 
  onDeleteCourse, 
  onToggleStatus 
}: CourseManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'title' | 'created' | 'duration' | 'enrolled'>('created')

  // フィルタリング
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter
    const matchesDepartment = departmentFilter === 'all' || course.departmentId === departmentFilter
    const matchesDifficulty = difficultyFilter === 'all' || course.difficulty === difficultyFilter
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesDifficulty
  })

  // ソート
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'duration':
        return a.duration - b.duration
      case 'enrolled':
        return (b.enrolledCount || 0) - (a.enrolledCount || 0)
      default:
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
    }
  })

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '🌱'
      case 'intermediate': return '🚀'
      case 'advanced': return '⚡'
      default: return '📚'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}時間${mins > 0 ? mins + '分' : ''}`
    }
    return `${mins}分`
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">講義管理</h2>
          <p className="text-gray-600">{filteredCourses.length}件の講義</p>
        </div>
        <button
          onClick={onCreateCourse}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          新しい講義を作成
        </button>
      </div>

      {/* フィルターバー */}
      <div className="bg-white rounded-lg border p-4 space-y-4">
        {/* 検索バー */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="講義名や説明で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* フィルター */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* 公開状態フィルター */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">状態:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="all">すべて</option>
              <option value="published">公開</option>
              <option value="draft">下書き</option>
            </select>
          </div>

          {/* 学部フィルター */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">学部:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="all">すべて</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          {/* 難易度フィルター */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">難易度:</span>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as any)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="all">すべて</option>
              <option value="beginner">初級</option>
              <option value="intermediate">中級</option>
              <option value="advanced">上級</option>
            </select>
          </div>

          {/* ソート */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">並び順:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="created">作成日時</option>
              <option value="title">タイトル</option>
              <option value="duration">所要時間</option>
              <option value="enrolled">受講者数</option>
            </select>
          </div>

          {/* 表示切り替え */}
          <div className="flex items-center space-x-1 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 講義一覧 */}
      {sortedCourses.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' || departmentFilter !== 'all' || difficultyFilter !== 'all' 
              ? '条件に一致する講義がありません' 
              : '講義がありません'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' || departmentFilter !== 'all' || difficultyFilter !== 'all' 
              ? 'フィルターを変更してお試しください' 
              : '最初の講義を作成して始めましょう'}
          </p>
          <button
            onClick={onCreateCourse}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            講義を作成
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {sortedCourses.map((course) => (
            <div key={course.id} className={`bg-white rounded-lg border hover:shadow-md transition-shadow ${
              viewMode === 'list' ? 'p-4' : 'overflow-hidden'
            }`}>
              {viewMode === 'grid' ? (
                <>
                  {/* グリッドビュー */}
                  <div className="aspect-video bg-gray-200 relative">
                    {course.thumbnail ? (
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    
                    {/* ステータスバッジ */}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
                        course.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {course.status === 'published' ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                        {course.status === 'published' ? '公開' : '下書き'}
                      </span>
                    </div>

                    {/* 所要時間 */}
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDuration(course.duration)}
                    </div>

                    {/* 動画アイコン */}
                    {course.videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 rounded-full p-3">
                          <Play className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
                      <div className="relative ml-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-1 rounded font-medium ${getDifficultyColor(course.difficulty)}`}>
                          {getDifficultyIcon(course.difficulty)} {course.difficulty === 'beginner' ? '初級' : course.difficulty === 'intermediate' ? '中級' : '上級'}
                        </span>
                        <span className="text-gray-500 flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {course.enrolledCount || 0}人
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{course.department?.name || '未分類'}</span>
                        <span className="flex items-center">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {course.lessonsCount}レッスン
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEditCourse(course)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="編集"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onToggleStatus(course.id, course.status === 'published' ? 'draft' : 'published')}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title={course.status === 'published' ? '下書きに戻す' : '公開する'}
                        >
                          {course.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => onDeleteCourse(course.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="削除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <span className="text-xs text-gray-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {course.createdAt ? new Date(course.createdAt).toLocaleDateString('ja-JP') : '今日'}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                /* リストビュー */
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-24 h-16 bg-gray-200 rounded overflow-hidden">
                    {course.thumbnail ? (
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                        <p className="text-sm text-gray-600 truncate">{course.description}</p>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.status === 'published' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {course.status === 'published' ? '公開' : '下書き'}
                        </span>
                        
                        <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(course.difficulty)}`}>
                          {getDifficultyIcon(course.difficulty)} {course.difficulty === 'beginner' ? '初級' : course.difficulty === 'intermediate' ? '中級' : '上級'}
                        </span>
                        
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDuration(course.duration)}
                        </span>
                        
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {course.enrolledCount || 0}
                        </span>

                        <div className="flex space-x-1">
                          <button
                            onClick={() => onEditCourse(course)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="編集"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onToggleStatus(course.id, course.status === 'published' ? 'draft' : 'published')}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title={course.status === 'published' ? '下書きに戻す' : '公開する'}
                          >
                            {course.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => onDeleteCourse(course.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="削除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
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