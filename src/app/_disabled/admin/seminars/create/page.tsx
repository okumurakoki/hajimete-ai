'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { ArrowLeft, Save, Calendar, Clock, Users, Globe, Lock, Video, Zap, Settings } from 'lucide-react'

export default function CreateSeminarPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    instructorEmail: '',
    department: '',
    type: 'meeting' as 'meeting' | 'webinar',
    date: '',
    startTime: '',
    endTime: '',
    capacity: 50,
    isPremium: false,
    registrationRequired: true,
    autoRecording: false,
    waitingRoom: true,
    price: 5500,
    tags: ''
  })

  const departments = [
    { id: 'ai-basics', name: 'AI基礎学部' },
    { id: 'practical-application', name: '実践活用学部' },
    { id: 'business-strategy', name: 'ビジネス戦略学部' },
    { id: 'data-science', name: 'データサイエンス学部' },
    { id: 'productivity', name: '生産性向上学部' },
    { id: 'catchup', name: 'キャッチアップ学部' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // セミナー作成データの準備
      const seminarData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        scheduledDate: `${formData.date}T${formData.startTime}:00.000Z`,
        duration: calculateDuration(formData.startTime, formData.endTime),
        status: 'scheduled',
        maxParticipants: formData.capacity
      }

      const response = await fetch('/api/seminars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(seminarData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('API Error:', response.status, errorData)
        throw new Error(`セミナーの作成に失敗しました: ${errorData.error || response.statusText}`)
      }

      const result = await response.json()
      console.log('Seminar created successfully:', result)

      alert('セミナーが正常に作成されました！')
      // リダイレクト
      window.location.href = '/admin/seminars'
    } catch (error) {
      console.error('Error creating seminar:', error)
      alert('セミナーの作成中にエラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateDuration = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 120 // デフォルト2時間

    const start = new Date(`2000-01-01T${startTime}:00`)
    const end = new Date(`2000-01-01T${endTime}:00`)
    
    if (end <= start) {
      // 翌日にまたがる場合
      end.setDate(end.getDate() + 1)
    }
    
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60)) // 分単位
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const minDate = new Date().toISOString().split('T')[0]

  return (
    <AdminLayout currentPage="seminars">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/seminars">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                <ArrowLeft size={16} />
                戻る
              </button>
            </Link>
            <h1 className="text-2xl font-bold">新規セミナー作成</h1>
          </div>
          <button
            type="submit"
            form="seminar-form"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={16} />
            {isSubmitting ? '作成中...' : '作成'}
          </button>
        </div>

        {/* Form */}
        <form id="seminar-form" onSubmit={handleSubmit} className="space-y-8">
          {/* 基本情報 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings size={18} />
              基本情報
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  セミナータイトル *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例: ChatGPT活用実践セミナー"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  セミナー説明
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="セミナーの内容や学習目標を記入してください"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  講師名 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.instructor}
                  onChange={(e) => handleInputChange('instructor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="講師の名前"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  講師メールアドレス *
                </label>
                <input
                  type="email"
                  required
                  value={formData.instructorEmail}
                  onChange={(e) => handleInputChange('instructorEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="instructor@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  学部 *
                </label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">学部を選択</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  セミナー形式
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="meeting">会議形式（双方向）</option>
                  <option value="webinar">ウェビナー形式（講義）</option>
                </select>
              </div>
            </div>
          </div>

          {/* 日程・時間 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar size={18} />
              日程・時間
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  開催日 *
                </label>
                <input
                  type="date"
                  required
                  min={minDate}
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  開始時間 *
                </label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  終了時間 *
                </label>
                <input
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {formData.startTime && formData.endTime && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800 flex items-center gap-2">
                  <Clock size={14} />
                  予定時間: {calculateDuration(formData.startTime, formData.endTime)}分
                </p>
              </div>
            )}
          </div>

          {/* 参加者設定 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users size={18} />
              参加者設定
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  定員 *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="1000"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  参加費用 (円)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タグ
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="カンマ区切りでタグを入力 (例: ChatGPT, ビジネス, 実践)"
                />
              </div>
            </div>
          </div>

          {/* セミナー設定 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Video size={18} />
              セミナー設定
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">プレミアム限定</h3>
                  <p className="text-sm text-gray-600">プレミアムプラン会員のみが参加可能</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPremium}
                    onChange={(e) => handleInputChange('isPremium', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">事前登録必須</h3>
                  <p className="text-sm text-gray-600">参加前にユーザー登録が必要</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.registrationRequired}
                    onChange={(e) => handleInputChange('registrationRequired', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">自動録画</h3>
                  <p className="text-sm text-gray-600">セミナーを自動的に録画して保存</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoRecording}
                    onChange={(e) => handleInputChange('autoRecording', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">待機室</h3>
                  <p className="text-sm text-gray-600">参加者を待機室で一時停止</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.waitingRoom}
                    onChange={(e) => handleInputChange('waitingRoom', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* プレビュー */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">プレビュー</h2>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {formData.title || 'セミナータイトル'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.instructor || '講師名'} | {departments.find(d => d.id === formData.department)?.name || '学部未選択'}
                  </p>
                </div>
                {formData.isPremium && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    プレミアム
                  </span>
                )}
              </div>
              
              <div className="text-sm text-gray-700 mb-4">
                {formData.description || 'セミナーの説明がここに表示されます'}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {formData.date && (
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(formData.date).toLocaleDateString('ja-JP')}
                  </div>
                )}
                {formData.startTime && formData.endTime && (
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {formData.startTime} - {formData.endTime}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  定員 {formData.capacity}名
                </div>
                {formData.type === 'meeting' ? (
                  <div className="flex items-center gap-1">
                    <Video size={14} />
                    会議形式
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Globe size={14} />
                    ウェビナー形式
                  </div>
                )}
              </div>

              {formData.tags && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {formData.tags.split(',').map(tag => tag.trim()).filter(Boolean).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}