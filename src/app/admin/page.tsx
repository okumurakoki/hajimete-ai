'use client'

import { useState, useEffect } from 'react'
import { Plus, BookOpen, Users, Video, BarChart3, Settings, Brain, Laptop, Code, Zap, Target, Trophy, Lightbulb, Rocket, Globe, Star, Crown, Diamond, Sparkles, Gift, Calculator, Camera, Music, Heart, Palette as PaletteIcon, Eye, EyeOff, Clock, Play, Mail, Calendar } from 'lucide-react'
import { AdminLayout } from '@/components/layout/Layout'
import DepartmentForm from '@/components/admin/forms/DepartmentForm'
import CourseForm from '@/components/admin/forms/CourseForm'
import SeminarForm from '@/components/admin/forms/SeminarForm'
import CourseManagement from '@/components/admin/CourseManagement'
import SeminarManagement from '@/components/admin/SeminarManagement'
import AnalyticsDashboard from '@/components/admin/analytics/AnalyticsDashboard'
import { Seminar, SeminarFormData, Department, Course } from '@/types'
import toast, { Toaster } from 'react-hot-toast'

// 型定義は /types/index.ts から import

// アイコンセット（DepartmentFormと同じ）
const iconSets = {
  tech: [
    { icon: Brain, name: 'AI・機械学習', value: 'brain' },
    { icon: Code, name: 'プログラミング', value: 'code' },
    { icon: Laptop, name: 'IT・デジタル', value: 'laptop' },
    { icon: Zap, name: '自動化・効率化', value: 'zap' },
    { icon: Settings, name: 'システム開発', value: 'settings' },
    { icon: BarChart3, name: 'データ分析', value: 'chart-bar' }
  ],
  business: [
    { icon: Target, name: 'マーケティング', value: 'target' },
    { icon: Users, name: 'チームワーク', value: 'users' },
    { icon: Trophy, name: '成果・実績', value: 'trophy' },
    { icon: Globe, name: 'グローバル', value: 'globe' },
    { icon: Rocket, name: 'スタートアップ', value: 'rocket' },
    { icon: Star, name: '品質管理', value: 'star' }
  ],
  creative: [
    { icon: PaletteIcon, name: 'デザイン・アート', value: 'palette' },
    { icon: Camera, name: '写真・映像', value: 'camera' },
    { icon: Music, name: '音楽・サウンド', value: 'music' },
    { icon: Lightbulb, name: 'アイデア・企画', value: 'lightbulb' },
    { icon: Sparkles, name: 'クリエイティブ', value: 'sparkles' },
    { icon: Gift, name: 'エンターテインメント', value: 'gift' }
  ],
  academic: [
    { icon: BookOpen, name: '教育・学習', value: 'book-open' },
    { icon: Calculator, name: '数学・統計', value: 'calculator' },
    { icon: Heart, name: '健康・医療', value: 'heart' },
    { icon: Crown, name: 'リーダーシップ', value: 'crown' },
    { icon: Diamond, name: 'プレミアム', value: 'diamond' }
  ]
}

// グラデーションアイコンセット（DepartmentFormと同じ）
const gradientIcons = {
  tech: [
    { name: 'AI Neural', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', symbol: '🧠' },
    { name: 'Code Matrix', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', symbol: '</>' },
    { name: 'Digital Wave', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', symbol: '∿' },
    { name: 'Tech Circuit', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', symbol: '⚡' },
    { name: 'Quantum', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', symbol: '◆' },
    { name: 'Binary', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', symbol: '01' }
  ],
  business: [
    { name: 'Growth', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', symbol: '📈' },
    { name: 'Success', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', symbol: '🎯' },
    { name: 'Innovation', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', symbol: '💡' },
    { name: 'Leadership', gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', symbol: '👑' },
    { name: 'Strategy', gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', symbol: '🎲' },
    { name: 'Global', gradient: 'linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)', symbol: '🌍' }
  ],
  creative: [
    { name: 'Art Brush', gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', symbol: '🎨' },
    { name: 'Design Studio', gradient: 'linear-gradient(135deg, #ff9ff3 0%, #f368e0 100%)', symbol: '✨' },
    { name: 'Creative Mind', gradient: 'linear-gradient(135deg, #54a0ff 0%, #5f27cd 100%)', symbol: '🎭' },
    { name: 'Visual Arts', gradient: 'linear-gradient(135deg, #00dbde 0%, #fc00ff 100%)', symbol: '🎪' },
    { name: 'Color Splash', gradient: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)', symbol: '🌈' },
    { name: 'Inspiration', gradient: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)', symbol: '💫' }
  ],
  academic: [
    { name: 'Knowledge', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', symbol: '📚' },
    { name: 'Research', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', symbol: '🔬' },
    { name: 'Analytics', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', symbol: '📊' },
    { name: 'Medical', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', symbol: '⚕️' },
    { name: 'Education', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', symbol: '🎓' },
    { name: 'Science', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', symbol: '🧪' }
  ]
}

export default function AdminDashboard() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [seminars, setSeminars] = useState<Seminar[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'departments' | 'courses' | 'seminars'>('overview')
  const [showDepartmentForm, setShowDepartmentForm] = useState(false)
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [showSeminarForm, setShowSeminarForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [editingSeminar, setEditingSeminar] = useState<Seminar | null>(null)

  // アイコンレンダリング関数
  const renderDepartmentIcon = (dept: Department) => {
    if (dept.iconType === 'upload' && dept.uploadedImage) {
      return (
        <img 
          src={dept.uploadedImage} 
          alt={`${dept.name} icon`} 
          className="w-6 h-6 rounded-lg object-cover"
        />
      )
    } else if (dept.iconType === 'gradient') {
      // カテゴリを推測（実際のカテゴリ情報がない場合）
      const allGradients = Object.values(gradientIcons).flat()
      const gradientIcon = allGradients.find(icon => icon.name === dept.iconValue)
      return (
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ background: gradientIcon?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          {gradientIcon?.symbol || '?'}
        </div>
      )
    } else if (dept.iconType === 'lucide') {
      // 全アイコンセットから該当するアイコンを検索
      const allIcons = Object.values(iconSets).flat()
      const iconItem = allIcons.find(icon => icon.value === dept.iconValue)
      if (iconItem) {
        const IconComponent = iconItem.icon
        return <IconComponent className="w-6 h-6 text-white" />
      }
    }
    // フォールバック: 学部名の最初の文字
    return <div className="text-white font-bold">{dept.name.charAt(0)}</div>
  }

  // データ取得
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // 全APIを並行実行（エラーがあっても他は継続）
      const [deptRes, courseRes, seminarRes] = await Promise.all([
        fetch('/api/admin/departments').catch(err => {
          console.error('Department API error:', err)
          return null
        }),
        fetch('/api/admin/courses').catch(err => {
          console.error('Course API error:', err)
          return null
        }),
        fetch('/api/admin/seminars-mock').catch(err => {
          console.error('Seminar API error:', err)
          return null
        })
      ])
      
      // 各レスポンスを処理
      if (deptRes?.ok) {
        const deptData = await deptRes.json()
        setDepartments(deptData)
      } else if (deptRes) {
        console.error('Department fetch failed:', await deptRes.text())
      }
      
      if (courseRes?.ok) {
        const courseData = await courseRes.json()
        setCourses(courseData)
      } else if (courseRes) {
        console.error('Course fetch failed:', await courseRes.text())
      }

      if (seminarRes?.ok) {
        const seminarData = await seminarRes.json()
        console.log('✅ Seminars loaded:', seminarData.length)
        setSeminars(seminarData)
      } else if (seminarRes) {
        const errorText = await seminarRes.text()
        console.error('❌ Seminar API failed:', {
          status: seminarRes.status,
          statusText: seminarRes.statusText,
          error: errorText,
          url: seminarRes.url
        })
        
        // エラー詳細をユーザーに表示
        toast.error(`セミナーAPI エラー: ${seminarRes.status} - ${errorText}`)
        setSeminars([]) // エラー時は空配列
      }
    } catch (error) {
      console.error('データ取得エラー:', error)
      toast.error('データの取得中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDepartment = async (formData: { name: string; description: string; color: string; iconType: string; iconValue: string; uploadedImage?: File | null }) => {
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
        setDepartments(prev => [...prev, newDepartment])
        setShowDepartmentForm(false)
      } else {
        throw new Error('Failed to create department')
      }
    } catch (error) {
      console.error('学部作成エラー:', error)
      alert('学部の作成に失敗しました。もう一度お試しください。')
    }
  }

  const handleCreateCourse = async (formData: { title: string; description: string; departmentId: string; thumbnail?: string; thumbnailFile?: File | null; difficulty: string; duration: number; videoUrl?: string; status: string }) => {
    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newCourse = await response.json()
        console.log('新しい講義が作成されました:', newCourse)
        setShowCourseForm(false)
        setEditingCourse(null)
        // データを再読み込みして最新状態を取得
        await fetchData()
      } else {
        const errorData = await response.json()
        console.error('講義作成失敗:', errorData)
        throw new Error(errorData.error || 'Failed to create course')
      }
    } catch (error) {
      console.error('講義作成エラー:', error)
      alert('講義の作成に失敗しました。もう一度お試しください。')
    }
  }

  const handleCourseCreated = async (newCourse: any) => {
    console.log('新しい講義が作成されました:', newCourse)
    
    // ローカル状態に新しい講義を追加
    setCourses(prev => [newCourse, ...prev])
    
    // フォームを閉じる
    setShowCourseForm(false)
    setEditingCourse(null)
    
    // サーバーから最新データを取得して確実に同期
    await fetchData()
  }

  const handleEditCourse = (course: any) => {
    setEditingCourse(course)
    setShowCourseForm(true)
  }

  const handleDeleteCourse = async (courseId: string) => {
    try {
      console.log('🗑️ 削除開始:', courseId)
      
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      })

      console.log('📡 削除レスポンス:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ 削除成功:', result)
        
        // 重要：ローカル状態を即座に更新
        setCourses(prev => {
          const filtered = prev.filter(course => course.id !== courseId)
          console.log('🔄 状態更新:', `${prev.length} → ${filtered.length}`)
          return filtered
        })
        
        // サーバーから最新データを取得（念のため）
        console.log('🔄 サーバーデータ再取得中...')
        await fetchData()
        
        console.log('🎉 削除処理完了')
      } else {
        const errorData = await response.json()
        console.error('❌ 削除失敗:', errorData)
        alert(`削除に失敗しました: ${errorData.error || '不明なエラー'}`)
      }
    } catch (error) {
      console.error('💥 削除エラー:', error)
      alert('講義の削除中にエラーが発生しました')
    }
  }

  const handleToggleStatus = async (courseId: string, newStatus: 'draft' | 'published') => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // ローカル状態を更新
        setCourses(prev => prev.map(course => 
          course.id === courseId 
            ? { ...course, status: newStatus }
            : course
        ))
        
        // サーバーから最新データを取得
        await fetchData()
        
        console.log(`ステータスが ${newStatus} に更新されました`)
      } else {
        const errorData = await response.json()
        alert(`ステータス更新に失敗しました: ${errorData.error || '不明なエラー'}`)
      }
    } catch (error) {
      console.error('Error updating course status:', error)
      alert('ステータス更新中にエラーが発生しました')
    }
  }

  // セミナー管理関数
  const handleCreateSeminar = async (formData: SeminarFormData) => {
    try {
      const response = await fetch('/api/admin/seminars-mock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newSeminar = await response.json()
        setSeminars(prev => [newSeminar, ...prev])
        setShowSeminarForm(false)
        setEditingSeminar(null)
        await fetchData()
        toast.success('セミナーを作成しました')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create seminar')
      }
    } catch (error) {
      console.error('セミナー作成エラー:', error)
      toast.error('セミナーの作成に失敗しました')
    }
  }

  const handleEditSeminar = (seminar: Seminar) => {
    setEditingSeminar(seminar)
    setShowSeminarForm(true)
  }

  const handleDeleteSeminar = async (seminarId: string) => {
    try {
      const response = await fetch(`/api/admin/seminars/${seminarId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSeminars(prev => prev.filter(seminar => seminar.id !== seminarId))
        await fetchData()
        toast.success('セミナーを削除しました')
      } else {
        const errorData = await response.json()
        toast.error(`削除に失敗しました: ${errorData.error || '不明なエラー'}`)
      }
    } catch (error) {
      console.error('セミナー削除エラー:', error)
      toast.error('セミナーの削除中にエラーが発生しました')
    }
  }

  const handleToggleSeminarStatus = async (seminarId: string, newStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/seminars/${seminarId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublished: newStatus }),
      })

      if (response.ok) {
        setSeminars(prev => prev.map(seminar => 
          seminar.id === seminarId 
            ? { ...seminar, isPublished: newStatus }
            : seminar
        ))
        await fetchData()
        toast.success(`セミナーを${newStatus ? '公開' : '非公開'}にしました`)
      } else {
        const errorData = await response.json()
        toast.error(`ステータス更新に失敗しました: ${errorData.error || '不明なエラー'}`)
      }
    } catch (error) {
      console.error('Error updating seminar status:', error)
      toast.error('ステータス更新中にエラーが発生しました')
    }
  }

  return (
    <AdminLayout>
      {/* 管理者ヘッダー */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-purple-200 dark:border-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🤖 はじめて.AI 管理画面
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">管理者モード</span>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ナビゲーション */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: '概要', icon: BarChart3 },
              { id: 'analytics', label: '統計分析', icon: BarChart3 },
              { id: 'departments', label: '学部管理', icon: BookOpen },
              { id: 'courses', label: '講義管理', icon: Video },
              { id: 'seminars', label: 'セミナー管理', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300'
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
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">学部数</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{departments.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <Video className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">講義数</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{courses.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">総レッスン数</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {courses.reduce((sum, course) => sum + (course.lessonsCount || 0), 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* クイックアクション */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">クイックアクション</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button
                      onClick={() => setActiveTab('departments')}
                      className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="font-medium text-blue-700 dark:text-blue-300">新しい学部を作成</span>
                    </button>
                    <button
                      onClick={() => setShowCourseForm(true)}
                      className="flex items-center p-4 bg-green-50 dark:bg-green-900/10 rounded-lg hover:bg-green-100 dark:bg-green-900/20 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-green-600 mr-3" />
                      <span className="font-medium text-green-700 dark:text-green-300">新しい講義を作成</span>
                    </button>
                    <button
                      onClick={() => setShowSeminarForm(true)}
                      className="flex items-center p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg hover:bg-orange-100 dark:bg-orange-900/20 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-orange-600 mr-3" />
                      <span className="font-medium text-orange-700 dark:text-orange-300">新しいセミナーを作成</span>
                    </button>
                    <button
                      onClick={() => window.location.href = '/admin/emails'}
                      className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg hover:bg-purple-100 dark:bg-purple-900/20 transition-colors"
                    >
                      <Mail className="w-5 h-5 text-purple-600 mr-3" />
                      <span className="font-medium text-purple-700 dark:text-purple-300">メール管理</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 統計分析タブ */}
            {activeTab === 'analytics' && (
              <AnalyticsDashboard />
            )}

            {/* 学部管理タブ */}
            {activeTab === 'departments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">学部管理</h2>
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
                    <div key={dept.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: dept.color || '#3B82F6' }}
                        >
                          {renderDepartmentIcon(dept)}
                        </div>
                        <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 dark:text-gray-400 dark:text-gray-500">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{dept.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-4">{dept.description || '説明なし'}</p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        <Video className="w-4 h-4 mr-1" />
                        <span>{dept.coursesCount || 0} 講義</span>
                      </div>
                    </div>
                  ))}

                  {departments.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">学部がありません</h3>
                      <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-4">最初の学部を作成して始めましょう</p>
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
              <CourseManagement
                courses={courses as any[]}
                departments={departments.map(dept => ({
                  id: dept.id,
                  name: dept.name,
                  color: dept.color || undefined
                }))}
                onCreateCourse={() => {
                  setEditingCourse(null)
                  setShowCourseForm(true)
                }}
                onEditCourse={handleEditCourse}
                onDeleteCourse={handleDeleteCourse}
                onToggleStatus={handleToggleStatus}
              />
            )}

            {/* セミナー管理タブ */}
            {activeTab === 'seminars' && (
              <SeminarManagement
                seminars={seminars}
                onCreateSeminar={() => {
                  setEditingSeminar(null)
                  setShowSeminarForm(true)
                }}
                onEditSeminar={handleEditSeminar}
                onDeleteSeminar={handleDeleteSeminar}
                onToggleStatus={handleToggleSeminarStatus}
              />
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

      {/* 講義作成フォーム */}
      <CourseForm
        isOpen={showCourseForm}
        onClose={() => {
          setShowCourseForm(false)
          setEditingCourse(null)
        }}
        onSave={handleCreateCourse}
        onSuccess={handleCourseCreated}
        departments={departments.map(dept => ({
          id: dept.id,
          name: dept.name,
          color: dept.color || undefined
        }))}
        initialData={editingCourse}
      />

      {/* セミナー作成フォーム */}
      <SeminarForm
        isOpen={showSeminarForm}
        onClose={() => {
          setShowSeminarForm(false)
          setEditingSeminar(null)
        }}
        onSave={handleCreateSeminar}
        initialData={editingSeminar}
      />
      
      {/* Toast通知 */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
          }
        }}
      />
    </AdminLayout>
  )
}