'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/Layout'
import { 
  Calendar, 
  Clock, 
  Users, 
  Star,
  BookOpen,
  ShoppingCart,
  Minus,
  Plus,
  Zap,
  TrendingUp,
  DollarSign
} from 'lucide-react'

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
  curriculum: string[]
  tags: string
}

interface CartItem {
  courseId: string
  course: LiveCourse
}

interface DiscountRule {
  id: string
  name: string
  description: string
  minCourses: number
  maxCourses?: number
  discountType: string
  discountValue: number
}

export default function LiveCoursesPage() {
  const [courses, setCourses] = useState<LiveCourse[]>([])
  const [discountRules, setDiscountRules] = useState<DiscountRule[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  useEffect(() => {
    fetchCourses()
    fetchDiscountRules()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses/live')
      if (response.ok) {
        const data = await response.json()
        setCourses(data.map((course: any) => ({
          ...course,
          curriculum: JSON.parse(course.curriculum || '[]')
        })))
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDiscountRules = async () => {
    try {
      const response = await fetch('/api/courses/discount-rules')
      if (response.ok) {
        const data = await response.json()
        setDiscountRules(data)
      }
    } catch (error) {
      console.error('Error fetching discount rules:', error)
    }
  }

  const addToCart = (course: LiveCourse) => {
    if (!cart.find(item => item.courseId === course.id)) {
      setCart([...cart, { courseId: course.id, course }])
    }
  }

  const removeFromCart = (courseId: string) => {
    setCart(cart.filter(item => item.courseId !== courseId))
  }

  const calculateTotal = () => {
    const baseAmount = cart.reduce((sum, item) => sum + item.course.price, 0)
    const applicableDiscount = getApplicableDiscount()
    const discountAmount = applicableDiscount ? applicableDiscount.discountValue : 0
    
    return {
      baseAmount,
      discountAmount,
      finalAmount: baseAmount - discountAmount,
      discount: applicableDiscount
    }
  }

  const getApplicableDiscount = () => {
    const courseCount = cart.length
    return discountRules
      .filter(rule => 
        courseCount >= rule.minCourses && 
        (!rule.maxCourses || courseCount <= rule.maxCourses)
      )
      .sort((a, b) => b.discountValue - a.discountValue)[0]
  }

  const filteredCourses = courses.filter(course => {
    const levelMatch = selectedLevel === 'ALL' || course.level === selectedLevel
    const categoryMatch = selectedCategory === 'ALL' || course.category === selectedCategory
    return levelMatch && categoryMatch
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    })
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

  const total = calculateTotal()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">講座データを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout 
      title="AI講座申し込み" 
      description="7/14〜7/25開催のライブAI講座"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 講座一覧 */}
          <div className="lg:col-span-2 space-y-6">
            {/* フィルター */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    レベル
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">全レベル</option>
                    <option value="BEGINNER">初級</option>
                    <option value="INTERMEDIATE">中級</option>
                    <option value="ADVANCED">上級</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    カテゴリ
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">全カテゴリ</option>
                    <option value="AI研究ツール">AI研究ツール</option>
                    <option value="生産性ツール">生産性ツール</option>
                    <option value="クリエイティブAI">クリエイティブAI</option>
                    <option value="AI開発">AI開発</option>
                    <option value="動画制作">動画制作</option>
                    <option value="文書作成">文書作成</option>
                    <option value="音楽制作">音楽制作</option>
                    <option value="コンサルティング">コンサルティング</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 講座カード */}
            <div className="space-y-4">
              {filteredCourses.map((course) => {
                const isInCart = cart.some(item => item.courseId === course.id)
                
                return (
                  <div
                    key={course.id}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all duration-200 p-6 ${
                      isInCart 
                        ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' 
                        : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {course.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                            {getLevelText(course.level)}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(course.startDate)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(course.startDate)}〜{formatTime(course.endDate)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.currentParticipants}/{course.maxParticipants}名
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {course.instructor}
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {course.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                          ¥{course.price.toLocaleString()}
                        </div>
                        <button
                          onClick={() => isInCart ? removeFromCart(course.id) : addToCart(course)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                            isInCart
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {isInCart ? (
                            <>
                              <Minus className="w-4 h-4" />
                              削除
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              追加
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* カリキュラム */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        カリキュラム
                      </h4>
                      <ul className="space-y-1">
                        {course.curriculum.map((item, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* カート */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                申し込み講座 ({cart.length})
              </h3>

              {cart.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  講座を選択してください
                </p>
              ) : (
                <>
                  {/* カート内講座 */}
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div key={item.courseId} className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                            {item.course.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(item.course.startDate)} {formatTime(item.course.startDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            ¥{item.course.price.toLocaleString()}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.courseId)}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 料金計算 */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">小計</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        ¥{total.baseAmount.toLocaleString()}
                      </span>
                    </div>
                    
                    {total.discount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {total.discount.name}
                        </span>
                        <span className="text-green-600 dark:text-green-400">
                          -¥{total.discountAmount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
                      <span className="text-gray-900 dark:text-gray-100">合計</span>
                      <span className="text-blue-600 dark:text-blue-400">
                        ¥{total.finalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* セット割引情報 */}
                  {cart.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        セット割引
                      </h4>
                      <div className="space-y-1 text-xs">
                        {discountRules.map((rule) => (
                          <div
                            key={rule.id}
                            className={`flex justify-between ${
                              cart.length >= rule.minCourses
                                ? 'text-green-700 dark:text-green-300 font-medium'
                                : 'text-blue-700 dark:text-blue-300'
                            }`}
                          >
                            <span>{rule.name}</span>
                            <span>-¥{rule.discountValue.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 決済ボタン */}
                  <button
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    onClick={() => {
                      const courseIds = cart.map(item => item.courseId)
                      const queryString = courseIds.join(',')
                      window.location.href = `/payment/checkout?courses=${queryString}`
                    }}
                  >
                    <DollarSign className="w-5 h-5" />
                    決済に進む
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}