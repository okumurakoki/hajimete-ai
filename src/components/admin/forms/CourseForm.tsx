'use client'

import { useState } from 'react'
import { X, Save, BookOpen, Upload, Clock, Star, Eye, EyeOff, Play, Image, Link, FileText, Monitor, Users, Trophy } from 'lucide-react'

interface CourseFormProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (courseData: any) => void  // 既存
  onSuccess?: (course: any) => void   // 追加 - これが必要！
  departments: { id: string; name: string; color?: string }[]
  initialData?: Partial<CourseFormData>
}

interface CourseFormData {
  id?: string
  title: string
  description: string
  departmentId: string
  thumbnail?: string
  thumbnailFile?: File | null
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number // 分単位
  videoUrl?: string
  status: 'draft' | 'published'
}

const difficultyConfig = {
  beginner: { label: '初級', color: 'bg-green-100 text-green-700', icon: '🌱' },
  intermediate: { label: '中級', color: 'bg-yellow-100 text-yellow-700', icon: '🚀' },
  advanced: { label: '上級', color: 'bg-red-100 text-red-700', icon: '⚡' }
}

export default function CourseForm({ isOpen, onClose, onSave, onSuccess, departments, initialData }: CourseFormProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    departmentId: initialData?.departmentId || departments[0]?.id || '',
    thumbnail: initialData?.thumbnail || '',
    thumbnailFile: null,
    difficulty: initialData?.difficulty || 'beginner',
    duration: initialData?.duration || 30,
    videoUrl: initialData?.videoUrl || '',
    status: initialData?.status || 'draft'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'settings'>('basic')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const courseData = {
        ...initialData ? { id: initialData.id } : {},
        title: formData.title,
        description: formData.description,
        departmentId: formData.departmentId,
        difficulty: formData.difficulty,
        duration: formData.duration,
        status: formData.status,
        videoUrl: formData.videoUrl || undefined,
        thumbnail: formData.thumbnail || undefined,
        thumbnailFile: thumbnailPreview || undefined,
      }

      console.log('📝 送信するデータ:', courseData)
      console.log('🔄 メソッド:', initialData ? 'PUT' : 'POST')

      const response = await fetch('/api/admin/courses', {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      })

      console.log('📡 レスポンスステータス:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('✅ API成功レスポンス:', result)

        // onSave コールバック（既存の処理）
        if (onSave) {
          console.log('🔄 onSave コールバック実行')
          onSave(result.course || courseData)
        }

        // onSuccess コールバック（新規追加）
        if (onSuccess) {
          console.log('🎉 onSuccess コールバック実行')
          onSuccess(result.course || courseData)
        }

        // フォームをリセット
        setFormData({
          title: '',
          description: '',
          departmentId: '',
          difficulty: 'beginner',
          duration: 30,
          status: 'draft',
          videoUrl: '',
          thumbnail: ''
        })
        setThumbnailPreview(null)
        setActiveTab('basic')

        console.log('🚪 フォームを閉じます')
        onClose()
      } else {
        const errorData = await response.json()
        console.error('❌ API エラーレスポンス:', errorData)
        alert(errorData.error || '講義の保存に失敗しました')
      }
    } catch (error) {
      console.error('💥 ネットワークエラー:', error)
      alert('講義の保存中にエラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({ 
      title: '', 
      description: '', 
      departmentId: departments[0]?.id || '', 
      thumbnail: '',
      thumbnailFile: null,
      difficulty: 'beginner',
      duration: 30,
      videoUrl: '',
      status: 'draft'
    })
    setThumbnailPreview(null)
    setActiveTab('basic')
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      resetForm()
    }
  }

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // ファイルサイズチェック (5MB以下)
      if (file.size > 5 * 1024 * 1024) {
        alert('ファイルサイズは5MB以下にしてください')
        return
      }
      
      // ファイル形式チェック
      if (!file.type.startsWith('image/')) {
        alert('画像ファイルを選択してください')
        return
      }

      setFormData({...formData, thumbnailFile: file, thumbnail: ''})
      
      // プレビュー用のURL作成
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
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

  const validateVideoUrl = (url: string) => {
    if (!url) return true
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
    const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+/
    return youtubeRegex.test(url) || vimeoRegex.test(url)
  }

  if (!isOpen) return null

  const selectedDepartment = departments.find(d => d.id === formData.departmentId)
  const isVideoUrlValid = validateVideoUrl(formData.videoUrl || '')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? '講義を編集' : '新しい講義を作成'}
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* 左側: フォーム */}
          <div className="flex-1 p-6">
            {/* タブナビゲーション */}
            <div className="flex space-x-2 mb-6 border-b border-gray-200">
              {[
                { id: 'basic', label: '基本情報', icon: FileText },
                { id: 'media', label: 'メディア', icon: Image },
                { id: 'settings', label: '設定', icon: Monitor }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 基本情報タブ */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  {/* 講義タイトル */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      講義タイトル <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                      placeholder="例: ChatGPTによるプロンプトエンジニアリング入門"
                      required
                      disabled={isSubmitting}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                      disabled={isSubmitting}
                    >
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 説明 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      講義の説明
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 resize-none"
                      placeholder="講義の内容、学習目標、対象者などを詳しく説明してください"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* 難易度選択 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <Star className="w-4 h-4 inline mr-1" />
                      難易度レベル
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(difficultyConfig).map(([key, config]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({ ...formData, difficulty: key as any })}
                          disabled={isSubmitting}
                          className={`p-4 rounded-lg border-2 transition-all text-center ${
                            formData.difficulty === key
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } disabled:opacity-50`}
                        >
                          <div className="text-2xl mb-1">{config.icon}</div>
                          <div className="font-medium text-gray-900">{config.label}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {key === 'beginner' && 'プログラミング未経験者向け'}
                            {key === 'intermediate' && '基本操作を理解している方向け'}
                            {key === 'advanced' && '実践的なスキルを求める方向け'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 所要時間設定 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <Clock className="w-4 h-4 inline mr-1" />
                      所要時間（分）
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="15"
                        max="180"
                        step="15"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                        className="flex-1"
                        disabled={isSubmitting}
                      />
                      <div className="bg-gray-100 px-3 py-2 rounded-lg min-w-[80px] text-center font-medium">
                        {formatDuration(formData.duration)}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>15分</span>
                      <span>3時間</span>
                    </div>
                  </div>
                </div>
              )}

              {/* メディアタブ */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  {/* サムネイル画像アップロード */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <Image className="w-4 h-4 inline mr-1" />
                      サムネイル画像
                    </label>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {thumbnailPreview || formData.thumbnail ? (
                        <div className="space-y-4">
                          <img 
                            src={thumbnailPreview || formData.thumbnail} 
                            alt="Thumbnail preview" 
                            className="w-32 h-24 mx-auto rounded-lg object-cover"
                          />
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                              {thumbnailPreview ? 'アップロード済み' : 'URL画像'}
                            </p>
                            <label className="inline-block px-4 py-2 bg-green-600 text-white text-sm rounded cursor-pointer hover:bg-green-700">
                              画像を変更
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailUpload}
                                className="hidden"
                                disabled={isSubmitting}
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="py-8">
                          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-600 mb-2">画像をアップロードしてください</p>
                          <p className="text-xs text-gray-500 mb-4">PNG, JPG, GIF (最大5MB)</p>
                          <label className="inline-block px-4 py-2 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700">
                            ファイルを選択
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleThumbnailUpload}
                              className="hidden"
                              disabled={isSubmitting}
                            />
                          </label>
                        </div>
                      )}
                    </div>

                    {/* サムネイルURL（代替手段） */}
                    <div className="mt-4">
                      <label className="block text-sm text-gray-600 mb-2">
                        または画像URLを入力:
                      </label>
                      <input
                        type="url"
                        value={formData.thumbnail}
                        onChange={(e) => {
                          setFormData({ ...formData, thumbnail: e.target.value })
                          setThumbnailPreview(null)
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="https://example.com/thumbnail.jpg"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* 動画URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <Play className="w-4 h-4 inline mr-1" />
                      動画URL（オプション）
                    </label>
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          formData.videoUrl && !isVideoUrlValid 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300'
                        }`}
                        placeholder="https://youtube.com/watch?v=... または https://vimeo.com/..."
                        disabled={isSubmitting}
                      />
                      {formData.videoUrl && !isVideoUrlValid && (
                        <p className="text-red-500 text-xs">YouTubeまたはVimeoのURLを入力してください</p>
                      )}
                      {formData.videoUrl && isVideoUrlValid && (
                        <p className="text-green-600 text-xs flex items-center">
                          <Link className="w-3 h-3 mr-1" />
                          動画URLが正常に設定されました
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 設定タブ */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {/* 公開設定 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      公開設定
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, status: 'draft' })}
                        disabled={isSubmitting}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.status === 'draft'
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } disabled:opacity-50`}
                      >
                        <div className="flex items-center mb-2">
                          <EyeOff className="w-5 h-5 text-yellow-600 mr-2" />
                          <span className="font-medium">下書き保存</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          非公開で保存し、後で編集・公開できます
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, status: 'published' })}
                        disabled={isSubmitting}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.status === 'published'
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } disabled:opacity-50`}
                      >
                        <div className="flex items-center mb-2">
                          <Eye className="w-5 h-5 text-green-600 mr-2" />
                          <span className="font-medium">即座に公開</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          保存と同時に受講者に公開されます
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* 追加設定の余白 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">今後の機能予定</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 受講制限の設定</li>
                      <li>• タグ付け機能</li>
                      <li>• 前提条件の設定</li>
                      <li>• 完了証明書の設定</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* ボタン */}
              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={!formData.title.trim() || !formData.departmentId || isSubmitting || (!!formData.videoUrl && !isVideoUrlValid)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {formData.status === 'published' ? '公開して作成' : '下書き保存'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* 右側: リアルタイムプレビュー */}
          <div className="lg:w-80 border-l border-gray-200 p-6 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              リアルタイムプレビュー
            </h3>
            
            {/* 講義カードプレビュー */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {/* サムネイル部分 */}
              <div className="relative h-32 bg-gray-200">
                {thumbnailPreview || formData.thumbnail ? (
                  <img 
                    src={thumbnailPreview || formData.thumbnail} 
                    alt="Thumbnail" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                {/* 難易度バッジ */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyConfig[formData.difficulty].color}`}>
                    {difficultyConfig[formData.difficulty].icon} {difficultyConfig[formData.difficulty].label}
                  </span>
                </div>
                
                {/* 所要時間バッジ */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDuration(formData.duration)}
                </div>

                {/* 動画アイコン */}
                {formData.videoUrl && isVideoUrlValid && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 rounded-full p-3">
                      <Play className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                )}
              </div>

              {/* カード内容 */}
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {formData.title || '講義タイトルを入力してください'}
                </h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {formData.description || '講義の説明を入力してください'}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-medium`} style={{ 
                    backgroundColor: selectedDepartment?.color ? `${selectedDepartment.color}20` : '#e5f3ff',
                    color: selectedDepartment?.color || '#3B82F6'
                  }}>
                    {selectedDepartment?.name || '学部を選択'}
                  </span>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    {formData.status === 'published' ? (
                      <><Eye className="w-3 h-3 mr-1" /> 公開</>
                    ) : (
                      <><EyeOff className="w-3 h-3 mr-1" /> 下書き</>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* プレビュー詳細情報 */}
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">状態:</span>
                <span className={formData.status === 'published' ? 'text-green-600' : 'text-yellow-600'}>
                  {formData.status === 'published' ? '公開' : '下書き'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">難易度:</span>
                <span>{difficultyConfig[formData.difficulty].label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">所要時間:</span>
                <span>{formatDuration(formData.duration)}</span>
              </div>
              {formData.videoUrl && isVideoUrlValid && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">動画:</span>
                  <span className="text-green-600">設定済み</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}