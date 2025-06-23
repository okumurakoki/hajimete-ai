// src/components/admin/CourseManagement.tsx
'use client'

import React, { useState } from 'react'
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  Video, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  MoreVertical,
  Clock, 
  BookOpen, 
  Play,
  Settings
} from 'lucide-react'

interface Course {
  id: string
  title: string
  description?: string
  thumbnail?: string
  thumbnailFile?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  videoUrl?: string
  status: 'draft' | 'published'
  departmentId: string
  department?: { name: string }
  lessonsCount: number
  enrolledCount: number
  createdAt: string
  updatedAt: string
}

interface Department {
  id: string
  name: string
  color?: string
}

interface CourseManagementProps {
  courses: Course[]
  departments: Department[]
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
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // フィルタリングとソート
  const filteredAndSortedCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartment = !selectedDepartment || course.departmentId === selectedDepartment
      const matchesStatus = !selectedStatus || course.status === selectedStatus
      const matchesDifficulty = !selectedDifficulty || course.difficulty === selectedDifficulty
      
      return matchesSearch && matchesDepartment && matchesStatus && matchesDifficulty
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'duration':
          return a.duration - b.duration
        case 'enrolledCount':
          return b.enrolledCount - a.enrolledCount
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const handleToggleStatusClick = async (courseId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    
    try {
      // 修正: 正しいAPIエンドポイントを使用
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // 楽観的更新
        onToggleStatus(courseId, newStatus as 'draft' | 'published')
      } else {
        alert('ステータスの更新に失敗しました')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('ステータス更新中にエラーが発生しました')
    }
    
    setOpenMenuId(null)
  }

  const handleDeleteClick = async (courseId: string) => {
    if (confirm('この講義を削除してもよろしいですか？')) {
      try {
        // 修正: 正しいAPIエンドポイントを使用
        const response = await fetch(`/api/admin/courses/${courseId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          onDeleteCourse(courseId)
        } else {
          alert('講義の削除に失敗しました')
        }
      } catch (error) {
        console.error('Error deleting course:', error)
        alert('講義の削除中にエラーが発生しました')
      }
      setOpenMenuId(null)
    }
  }

  const handleEditClick = (course: Course) => {
    onEditCourse(course)
    setOpenMenuId(null)
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '🌱 初級'
      case 'intermediate': return '🚀 中級'
      case 'advanced': return '⚡ 上級'
      default: return difficulty
    }
  }

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (hours > 0) {
      return `${hours}時間${remainingMinutes > 0 ? remainingMinutes + '分' : ''}`
    }
    return `${minutes}分`
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">講義管理</h2>
        <button
          onClick={onCreateCourse}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          講義を作成
        </button>
      </div>

      {/* 検索・フィルター */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 検索 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="講義を検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 学部フィルター */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全学部</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>

          {/* ステータスフィルター */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全ステータス</option>
            <option value="published">公開</option>
            <option value="draft">下書き</option>
          </select>

          {/* 難易度フィルター */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全難易度</option>
            <option value="beginner">初級</option>
            <option value="intermediate">中級</option>
            <option value="advanced">上級</option>
          </select>

          {/* ソート */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="createdAt">作成日順</option>
            <option value="title">タイトル順</option>
            <option value="duration">所要時間順</option>
            <option value="enrolledCount">受講者数順</option>
          </select>
        </div>

        {/* 表示モード切り替え */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <div className="text-sm text-gray-600">
            {filteredAndSortedCourses.length}件の講義
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 講義一覧 */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {filteredAndSortedCourses.length === 0 ? (
          <div className="text-center py-12">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {courses.length === 0 ? '講義がありません' : '条件に一致する講義がありません'}
            </h3>
            <p className="text-gray-600 mb-4">
              {courses.length === 0 ? '最初の講義を作成して始めましょう' : '検索条件を変更してください'}
            </p>
            {courses.length === 0 && (
              <button
                onClick={onCreateCourse}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                講義を作成
              </button>
            )}
          </div>
        ) : viewMode === 'list' ? (
          <div className="divide-y">
            {filteredAndSortedCourses.map((course) => (
              <div key={course.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {course.thumbnail || course.thumbnailFile ? (
                        <img
                          src={course.thumbnail || course.thumbnailFile}
                          alt={course.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Video className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{course.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full flex items-center ${
                            course.status === 'published' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {course.status === 'published' ? (
                              <>
                                <Eye className="w-3 h-3 mr-1" />
                                公開
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3 mr-1" />
                                下書き
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {course.description || '説明なし'}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                          {course.department?.name || '未分類'}
                        </span>
                        <span className={`px-2 py-1 rounded font-medium ${getDifficultyClass(course.difficulty)}`}>
                          {getDifficultyLabel(course.difficulty)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDuration(course.duration)}
                        </span>
                        <span className="flex items-center">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {course.lessonsCount || 0} レッスン
                        </span>
                        {course.videoUrl && (
                          <span className="flex items-center text-green-600">
                            <Play className="w-3 h-3 mr-1" />
                            動画
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* アクションメニュー */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === course.id ? null : course.id)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {openMenuId === course.id && (
                      <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border py-1 z-10 min-w-[160px]">
                        <button
                          onClick={() => handleEditClick(course)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          編集
                        </button>
                        <button
                          onClick={() => handleToggleStatusClick(course.id, course.status)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          {course.status === 'published' ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              下書きに変更
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              公開する
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(course.id)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          削除
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // グリッドビュー
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredAndSortedCourses.map((course) => (
              <div key={course.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  {course.thumbnail || course.thumbnailFile ? (
                    <img
                      src={course.thumbnail || course.thumbnailFile}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Video className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      course.status === 'published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {course.status === 'published' ? '公開' : '下書き'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {course.description || '説明なし'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className={`px-2 py-1 rounded ${getDifficultyClass(course.difficulty)}`}>
                        {getDifficultyLabel(course.difficulty)}
                      </span>
                      <span>{formatDuration(course.duration)}</span>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === course.id ? null : course.id)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {openMenuId === course.id && (
                        <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border py-1 z-10 min-w-[160px]">
                          <button
                            onClick={() => handleEditClick(course)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            編集
                          </button>
                          <button
                            onClick={() => handleToggleStatusClick(course.id, course.status)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            {course.status === 'published' ? (
                              <>
                                <EyeOff className="w-4 h-4 mr-2" />
                                下書きに変更
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 mr-2" />
                                公開する
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(course.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            削除
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* クリック時にメニューを閉じる */}
      {openMenuId && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setOpenMenuId(null)}
        />
      )}
    </div>
  )
}