'use client'

import { useState } from 'react'
import { X, Save, BookOpen, Upload } from 'lucide-react'

interface CourseFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CourseFormData) => Promise<void>
  departments: { id: string; name: string }[]
  initialData?: Partial<CourseFormData>
}

interface CourseFormData {
  title: string
  description: string
  departmentId: string
  thumbnail?: string
}

export default function CourseForm({ isOpen, onClose, onSave, departments, initialData }: CourseFormProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    departmentId: initialData?.departmentId || departments[0]?.id || '',
    thumbnail: initialData?.thumbnail || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.departmentId) return

    setIsSubmitting(true)
    try {
      await onSave(formData)
      onClose()
      setFormData({ 
        title: '', 
        description: '', 
        departmentId: departments[0]?.id || '', 
        thumbnail: '' 
      })
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const selectedDepartment = departments.find(d => d.id === formData.departmentId)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? '講義を編集' : '新しい講義を作成'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 講義タイトル */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              講義タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="例: ChatGPTの基本操作"
              required
            />
          </div>

          {/* 説明 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              講義の説明
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 h-24 resize-none"
              placeholder="講義の内容や学習目標を入力してください"
            />
          </div>

          {/* 学部選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              所属学部 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* サムネイルURL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="w-4 h-4 inline mr-1" />
              サムネイル画像URL（オプション）
            </label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="https://example.com/thumbnail.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              空白の場合はデフォルトアイコンが表示されます
            </p>
          </div>

          {/* プレビュー */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-3">プレビュー:</p>
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                {formData.thumbnail ? (
                  <img 
                    src={formData.thumbnail} 
                    alt="Thumbnail" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <BookOpen className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {formData.title || '講義タイトル'}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {formData.description || '講義の説明'}
                </p>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                  {selectedDepartment?.name || '学部を選択'}
                </span>
              </div>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim() || !formData.departmentId || isSubmitting}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {initialData ? '更新' : '作成'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}