'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/Layout'
import { 
  Calendar,
  Clock,
  Users,
  DollarSign,
  Video,
  FileText,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react'

interface CourseForm {
  title: string
  description: string
  instructor: string
  startDate: string
  endDate: string
  duration: number
  price: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category: string
  maxParticipants: number
  zoomUrl: string
  zoomId: string
  zoomPassword: string
  curriculum: string[]
  materials: string[]
  tags: string[]
  isPublished: boolean
}

export default function CreateCoursePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<CourseForm>({
    title: '',
    description: '',
    instructor: '',
    startDate: '',
    endDate: '',
    duration: 120,
    price: 5000,
    level: 'BEGINNER',
    category: 'AI基礎',
    maxParticipants: 50,
    zoomUrl: '',
    zoomId: '',
    zoomPassword: '',
    curriculum: [''],
    materials: [''],
    tags: [''],
    isPublished: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          curriculum: JSON.stringify(form.curriculum.filter(item => item.trim())),
          materials: JSON.stringify(form.materials.filter(item => item.trim())),
          tags: form.tags.filter(tag => tag.trim()).join(',')
        }),
      })

      if (response.ok) {
        router.push('/admin/courses')
      } else {
        const error = await response.json()
        alert(`講座作成に失敗しました: ${error.message}`)
      }
    } catch (error) {
      console.error('Error creating course:', error)
      alert('講座作成中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const addArrayItem = (field: 'curriculum' | 'materials' | 'tags') => {
    setForm(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const updateArrayItem = (field: 'curriculum' | 'materials' | 'tags', index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const removeArrayItem = (field: 'curriculum' | 'materials' | 'tags', index: number) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  return (
    <DashboardLayout title="新規講座作成" description="AI講座・セミナーの新規作成">
      <div className="max-w-4xl mx-auto">
        {/* 戻るボタン */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            講座管理に戻る
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 基本情報 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              基本情報
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  講座タイトル *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="例: ChatGPT活用実践講座"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  講座説明 *
                </label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-24 resize-none"
                  placeholder="講座の内容や学習目標を詳しく説明してください"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  講師名 *
                </label>
                <input
                  type="text"
                  required
                  value={form.instructor}
                  onChange={(e) => setForm(prev => ({ ...prev, instructor: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="講師名"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  カテゴリ *
                </label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="AI基礎">AI基礎</option>
                  <option value="ChatGPT活用">ChatGPT活用</option>
                  <option value="ビジネスAI">ビジネスAI</option>
                  <option value="プログラミング">プログラミング</option>
                  <option value="データ分析">データ分析</option>
                  <option value="その他">その他</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  難易度 *
                </label>
                <select
                  required
                  value={form.level}
                  onChange={(e) => setForm(prev => ({ ...prev, level: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="BEGINNER">初級</option>
                  <option value="INTERMEDIATE">中級</option>
                  <option value="ADVANCED">上級</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  料金（円） *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* 日程・時間 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              日程・時間
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  開始日時 *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={form.startDate}
                  onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  終了日時 *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={form.endDate}
                  onChange={(e) => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  継続時間（分） *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.duration}
                  onChange={(e) => setForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  最大参加者数 *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.maxParticipants}
                  onChange={(e) => setForm(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Zoom設定 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <Video className="w-5 h-5 mr-2" />
              オンライン会議設定
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Zoom URL
                </label>
                <input
                  type="url"
                  value={form.zoomUrl}
                  onChange={(e) => setForm(prev => ({ ...prev, zoomUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="https://zoom.us/j/..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ミーティングID
                </label>
                <input
                  type="text"
                  value={form.zoomId}
                  onChange={(e) => setForm(prev => ({ ...prev, zoomId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="123 456 7890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  パスワード
                </label>
                <input
                  type="text"
                  value={form.zoomPassword}
                  onChange={(e) => setForm(prev => ({ ...prev, zoomPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="パスワード"
                />
              </div>
            </div>
          </div>

          {/* カリキュラム */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                カリキュラム
              </h2>
              <button
                type="button"
                onClick={() => addArrayItem('curriculum')}
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                追加
              </button>
            </div>
            
            <div className="space-y-3">
              {form.curriculum.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateArrayItem('curriculum', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder={`カリキュラム ${index + 1}`}
                  />
                  {form.curriculum.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('curriculum', index)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 公開設定 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              公開設定
            </h2>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublished"
                checked={form.isPublished}
                onChange={(e) => setForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                この講座を公開する
              </label>
            </div>
            
            {!form.isPublished && (
              <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    公開されていない講座は受講者には表示されません。後から公開設定を変更できます。
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? '作成中...' : '講座を作成'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}