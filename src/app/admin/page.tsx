'use client'

import { useState, useEffect } from 'react'
import { Plus, BookOpen, Users, Video, BarChart3, Settings } from 'lucide-react'
import DepartmentForm from '@/components/admin/forms/DepartmentForm'

interface Department {
  id: string
  name: string
  description: string | null
  image: string | null
  color: string | null
  coursesCount?: number
}

interface Course {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  departmentId: string
  department?: { name: string }
  lessonsCount?: number
}

export default function AdminDashboard() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'courses'>('overview')
  const [showDepartmentForm, setShowDepartmentForm] = useState(false)

  // データ取得
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [deptRes, courseRes] = await Promise.all([
        fetch('/api/admin/departments'),
        fetch('/api/admin/courses')
      ])
      
      if (deptRes.ok) {
        const deptData = await deptRes.json()
        setDepartments(deptData)
      }
      
      if (courseRes.ok) {
        const courseData = await courseRes.json()
        setCourses(courseData)
      }
    } catch (error) {
      console.error('データ取得エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDepartment = async (formData: { name: string; description: string; color: string }) => {
    try {
      const response = await fetch('/api/admin/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newDepartment = await response.json()
        setDepartments(prev => [...prev, { ...newDepartment, coursesCount: 0 }])
        setShowDepartmentForm(false)
      } else {
        throw new Error('Failed to create department')
      }
    } catch (error) {
      console.error('学部作成エラー:', error)
      alert('学部の作成に失敗しました。もう一度お試しください。')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🤖 はじめて.AI 管理画面
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">管理者モード</span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ナビゲーション */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: '概要', icon: BarChart3 },
              { id: 'departments', label: '学部管理', icon: BookOpen },
              { id: 'courses', label: '講義管理', icon: Video }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* 概要タブ */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 統計カード */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">学部数</p>
                        <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Video className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">講義数</p>
                        <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">総レッスン数</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {courses.reduce((sum, course) => sum + (course.lessonsCount || 0), 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* クイックアクション */}
                <div className="bg-white rounded-xl shadow-sm p-6 border">
                  <h3 className="text-lg font-semibold mb-4">クイックアクション</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setActiveTab('departments')}
                      className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="font-medium text-blue-700">新しい学部を作成</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('courses')}
                      className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-green-600 mr-3" />
                      <span className="font-medium text-green-700">新しい講義を作成</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 学部管理タブ */}
            {activeTab === 'departments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">学部管理</h2>
                  <button 
                    onClick={() => setShowDepartmentForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    学部を作成
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {departments.map((dept) => (
                    <div key={dept.id} className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: dept.color || '#3B82F6' }}
                        >
                          {dept.name.charAt(0)}
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{dept.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{dept.description || '説明なし'}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Video className="w-4 h-4 mr-1" />
                        <span>{dept.coursesCount || 0} 講義</span>
                      </div>
                    </div>
                  ))}

                  {departments.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">学部がありません</h3>
                      <p className="text-gray-600 mb-4">最初の学部を作成して始めましょう</p>
                      <button 
                        onClick={() => setShowDepartmentForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        学部を作成
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 講義管理タブ */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">講義管理</h2>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    講義を作成
                  </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="px-6 py-4 border-b">
                    <h3 className="font-semibold text-gray-900">全講義</h3>
                  </div>
                  <div className="divide-y">
                    {courses.map((course) => (
                      <div key={course.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              {course.thumbnail ? (
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <Video className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">{course.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{course.description || '説明なし'}</p>
                              <div className="flex items-center text-sm text-gray-500">
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium mr-2">
                                  {course.department?.name || '未分類'}
                                </span>
                                <span>{course.lessonsCount || 0} レッスン</span>
                              </div>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {courses.length === 0 && (
                      <div className="text-center py-12">
                        <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">講義がありません</h3>
                        <p className="text-gray-600 mb-4">最初の講義を作成して始めましょう</p>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                          講義を作成
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* 学部作成フォーム */}
      <DepartmentForm
        isOpen={showDepartmentForm}
        onClose={() => setShowDepartmentForm(false)}
        onSave={handleCreateDepartment}
      />
    </div>
  )
}