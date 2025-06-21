'use client'

import { useState } from 'react'
import { X, Save, Palette, Upload, Search } from 'lucide-react'
import { 
  Brain, 
  Laptop, 
  Palette as PaletteIcon, 
  Code, 
  BookOpen, 
  Calculator, 
  Camera, 
  Music, 
  Heart, 
  Zap,
  Target,
  Trophy,
  Lightbulb,
  Rocket,
  Globe,
  Users,
  BarChart3,
  Settings,
  Star,
  Crown,
  Diamond,
  Sparkles,
  Gift
} from 'lucide-react'

interface DepartmentFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: DepartmentFormData) => Promise<void>
  initialData?: Partial<DepartmentFormData>
}

interface DepartmentFormData {
  name: string
  description: string
  color: string
  iconType: 'lucide' | 'gradient' | 'upload'
  iconValue: string
  uploadedImage?: File | null
}

// プリセットアイコンセット
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

// モダンなグラデーションアイコンセット（CSS背景で実装）
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

const colorOptions = [
  '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
]

export default function DepartmentForm({ isOpen, onClose, onSave, initialData }: DepartmentFormProps) {
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    color: initialData?.color || '#3B82F6',
    iconType: initialData?.iconType || 'lucide',
    iconValue: initialData?.iconValue || 'brain',
    uploadedImage: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeIconCategory, setActiveIconCategory] = useState<'tech' | 'business' | 'creative' | 'academic'>('tech')
  const [searchTerm, setSearchTerm] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setIsSubmitting(true)
    try {
      await onSave(formData)
      onClose()
      setFormData({ 
        name: '', 
        description: '', 
        color: '#3B82F6',
        iconType: 'lucide',
        iconValue: 'brain',
        uploadedImage: null
      })
      setImagePreview(null)
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      setFormData({ 
        name: '', 
        description: '', 
        color: '#3B82F6',
        iconType: 'lucide',
        iconValue: 'brain'
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // ファイルサイズチェック (2MB以下)
      if (file.size > 2 * 1024 * 1024) {
        alert('ファイルサイズは2MB以下にしてください')
        return
      }
      
      // ファイル形式チェック
      if (!file.type.startsWith('image/')) {
        alert('画像ファイルを選択してください')
        return
      }

      setFormData({...formData, uploadedImage: file, iconType: 'upload'})
      
      // プレビュー用のURL作成
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const renderIcon = () => {
    if (formData.iconType === 'upload' && imagePreview) {
      return (
        <img 
          src={imagePreview} 
          alt="Uploaded icon" 
          className="w-6 h-6 rounded-lg object-cover"
        />
      )
    } else if (formData.iconType === 'gradient') {
      const gradientIcon = gradientIcons[activeIconCategory].find(icon => icon.name === formData.iconValue)
      return (
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ background: gradientIcon?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          {gradientIcon?.symbol || '?'}
        </div>
      )
    } else if (formData.iconType === 'lucide') {
      const IconComponent = iconSets[activeIconCategory].find(icon => icon.value === formData.iconValue)?.icon || Brain
      return <IconComponent className="w-6 h-6 text-white" />
    }
    return <div className="text-white font-bold">{formData.name.charAt(0) || '?'}</div>
  }

  const filteredIcons = iconSets[activeIconCategory].filter(icon =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredGradients = gradientIcons[activeIconCategory]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? '学部を編集' : '新しい学部を作成'}
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 学部名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              学部名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              placeholder="例: AI・機械学習"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* 説明 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              説明
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              placeholder="学部の概要や学習内容について説明してください"
              disabled={isSubmitting}
            />
          </div>

          {/* アイコン選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              学部アイコン
            </label>
            
            {/* アイコンタイプ選択 */}
            <div className="flex space-x-2 mb-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, iconType: 'lucide', iconValue: 'brain'})}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.iconType === 'lucide' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-1" />
                アイコン
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, iconType: 'gradient', iconValue: gradientIcons.tech[0].name})}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.iconType === 'gradient' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Sparkles className="w-4 h-4 inline mr-1" />
                グラデーション
              </button>
              <label className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                formData.iconType === 'upload' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
                <Upload className="w-4 h-4 inline mr-1" />
                画像アップロード
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* カテゴリ選択 */}
            <div className="flex space-x-2 mb-4">
              {Object.keys(iconSets).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveIconCategory(category as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    activeIconCategory === category
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category === 'tech' ? 'テック' : 
                   category === 'business' ? 'ビジネス' :
                   category === 'creative' ? 'クリエイティブ' : 'アカデミック'}
                </button>
              ))}
            </div>

            {/* 検索（Lucideアイコン用） */}
            {formData.iconType === 'lucide' && (
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="アイコンを検索..."
                />
              </div>
            )}

            {/* 画像アップロード表示 */}
            {formData.iconType === 'upload' && (
              <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                {imagePreview ? (
                  <div className="space-y-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-16 h-16 mx-auto rounded-lg object-cover"
                    />
                    <p className="text-sm text-gray-600">画像がアップロードされました</p>
                    <label className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded cursor-pointer hover:bg-blue-700">
                      画像を変更
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="py-4">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">画像をアップロードしてください</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF (最大2MB)</p>
                  </div>
                )}
              </div>
            )}

            {/* アイコン選択グリッド */}
            {formData.iconType !== 'upload' && (
              <div className="border border-gray-200 rounded-lg p-4 max-h-40 overflow-y-auto">
                {formData.iconType === 'lucide' ? (
                  <div className="grid grid-cols-6 gap-2">
                    {filteredIcons.map((iconItem) => {
                      const IconComponent = iconItem.icon
                      return (
                        <button
                          key={iconItem.value}
                          type="button"
                          onClick={() => setFormData({...formData, iconValue: iconItem.value})}
                          className={`p-3 rounded-lg border-2 transition-all hover:scale-110 ${
                            formData.iconValue === iconItem.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          title={iconItem.name}
                        >
                          <IconComponent className="w-5 h-5 mx-auto text-gray-600" />
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {filteredGradients.map((gradientIcon) => (
                      <button
                        key={gradientIcon.name}
                        type="button"
                        onClick={() => setFormData({...formData, iconValue: gradientIcon.name})}
                        className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                          formData.iconValue === gradientIcon.name
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        title={gradientIcon.name}
                      >
                        <div 
                          className="w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-white font-bold text-sm"
                          style={{ background: gradientIcon.gradient }}
                        >
                          {gradientIcon.symbol}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{gradientIcon.name}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* カラー選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Palette className="w-4 h-4 inline mr-1" />
              テーマカラー
            </label>
            <div className="grid grid-cols-5 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({...formData, color})}
                  disabled={isSubmitting}
                  className={`w-12 h-12 rounded-lg border-2 transition-all ${
                    formData.color === color
                      ? 'border-gray-800 scale-110'
                      : 'border-gray-300 hover:border-gray-400'
                  } disabled:opacity-50`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* プレビュー */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">プレビュー:</p>
            <div className="flex items-center">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mr-3"
                style={{ backgroundColor: formData.color }}
              >
                {renderIcon()}
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {formData.name || '学部名'}
                </div>
                <div className="text-sm text-gray-600">
                  {formData.description || '説明なし'}
                </div>
              </div>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex space-x-3 pt-4">
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
              disabled={!formData.name.trim() || isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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