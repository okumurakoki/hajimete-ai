'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { ArrowLeft, Save, Play, Calendar, Clock, Users } from 'lucide-react'
import Link from 'next/link'

export default function CreateLivePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    platform: 'youtube',
    streamKey: '',
    maxParticipants: 100,
    isPublic: true,
    category: '',
    tags: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Creating live stream:', formData)
    alert('ライブ配信が作成されました')
  }

  return (
    <AdminLayout currentPage="live">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/live">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                <ArrowLeft size={12} />
                戻る
              </button>
            </Link>
            <h1 className="text-2xl font-bold">ライブ配信作成</h1>
          </div>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <Save size={10} />
            作成
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">基本情報</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      タイトル *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ライブ配信のタイトル"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      説明
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="配信の説明を入力してください"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        配信日
                      </label>
                      <input
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        配信時間
                      </label>
                      <input
                        type="time"
                        value={formData.scheduledTime}
                        onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">配信設定</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      配信プラットフォーム
                    </label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({...formData, platform: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="youtube">YouTube Live</option>
                      <option value="zoom">Zoom</option>
                      <option value="vimeo">Vimeo Live</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ストリームキー
                    </label>
                    <input
                      type="password"
                      value={formData.streamKey}
                      onChange={(e) => setFormData({...formData, streamKey: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="配信プラットフォームのストリームキー"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      最大参加者数
                    </label>
                    <input
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                      max="1000"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                      公開配信
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">配信プレビュー</h3>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Play size={29} className="text-gray-400" />
              </div>
              <h4 className="font-medium">{formData.title || 'タイトル未設定'}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {formData.description || '説明が入力されていません'}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">設定サマリー</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={10} className="text-gray-400" />
                  <span>{formData.scheduledDate || '日付未設定'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={10} className="text-gray-400" />
                  <span>{formData.scheduledTime || '時間未設定'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={10} className="text-gray-400" />
                  <span>最大 {formData.maxParticipants} 人</span>
                </div>
                <div className="flex items-center gap-2">
                  <Play size={10} className="text-gray-400" />
                  <span>{formData.platform}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}