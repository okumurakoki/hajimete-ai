'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import VideoUpload from '@/components/VideoUpload'
import { ArrowLeft, Upload, Play, Save, X, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function VideoUploadPage() {
  const [uploadedVideo, setUploadedVideo] = useState<any>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const [formData, setFormData] = useState({
    department: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    tags: '',
    instructor: '',
    isPublic: true,
    isPremium: false
  })

  const handleUploadComplete = (videoData: any) => {
    setUploadedVideo(videoData)
    setUploadError(null)
  }

  const handleUploadError = (error: string) => {
    setUploadError(error)
    setUploadedVideo(null)
  }

  const handleSaveMetadata = async () => {
    if (!uploadedVideo) return

    setIsProcessing(true)
    try {
      // ここで API に動画のメタデータを保存
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...uploadedVideo,
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        })
      })

      if (!response.ok) {
        throw new Error('動画の保存に失敗しました')
      }

      alert('動画が正常に保存されました！')
    } catch (error) {
      console.error('Error saving video:', error)
      alert('動画の保存中にエラーが発生しました')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <AdminLayout currentPage="videos">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/videos">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                <ArrowLeft size={16} />
                戻る
              </button>
            </Link>
            <h1 className="text-2xl font-bold">動画アップロード</h1>
          </div>
          <button
            onClick={handleSaveMetadata}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={!uploadedVideo || isProcessing}
          >
            <Save size={16} />
            {isProcessing ? '保存中...' : '保存'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Video Upload Component */}
            <VideoUpload
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
            />

            {/* Upload Status */}
            {uploadError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <X size={16} />
                  <span className="font-medium">アップロードエラー</span>
                </div>
                <p className="text-red-700 mt-1">{uploadError}</p>
              </div>
            )}

            {uploadedVideo && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <CheckCircle size={16} />
                  <span className="font-medium">アップロード完了</span>
                </div>
                <div className="text-sm text-green-700">
                  <p><strong>タイトル:</strong> {uploadedVideo.title}</p>
                  <p><strong>サービス:</strong> {uploadedVideo.service === 'vimeo' ? 'Vimeo' : 'CloudFlare Stream'}</p>
                  {uploadedVideo.description && <p><strong>説明:</strong> {uploadedVideo.description}</p>}
                </div>
              </div>
            )}

            {/* Video Details Form */}
            {uploadedVideo && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">動画情報</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      講師名
                    </label>
                    <input
                      type="text"
                      value={formData.instructor}
                      onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="講師名を入力"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      学部
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">学部を選択</option>
                      <option value="AI基礎学部">AI基礎学部</option>
                      <option value="実践活用学部">実践活用学部</option>
                      <option value="エンジニアリング学部">エンジニアリング学部</option>
                      <option value="マーケティング学部">マーケティング学部</option>
                      <option value="ビジネス応用学部">ビジネス応用学部</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      レベル
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({...formData, level: e.target.value as any})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="beginner">初級</option>
                      <option value="intermediate">中級</option>
                      <option value="advanced">上級</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      タグ（カンマ区切り）
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="例: ChatGPT, ビジネス活用, 実践"
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isPublic}
                        onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">公開</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isPremium}
                        onChange={(e) => setFormData({...formData, isPremium: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">プレミアム限定</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Video Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">アップロード状況</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>動画ファイル:</span>
                  <span className={uploadedVideo ? 'text-green-600' : 'text-gray-400'}>
                    {uploadedVideo ? '✓' : '未アップロード'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>講師名:</span>
                  <span className={formData.instructor ? 'text-green-600' : 'text-gray-400'}>
                    {formData.instructor ? '✓' : '未入力'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>学部:</span>
                  <span className={formData.department ? 'text-green-600' : 'text-gray-400'}>
                    {formData.department ? '✓' : '未選択'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}