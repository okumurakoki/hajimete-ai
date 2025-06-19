'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { ArrowLeft, Save, User } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface UserEditData {
  id: string
  name: string
  email: string
  plan: 'free' | 'basic' | 'premium'
  status: 'active' | 'suspended' | 'inactive'
  firstName: string
  lastName: string
  phone: string
  company: string
  jobTitle: string
  country: string
  timezone: string
}

export default function EditUserPage() {
  const params = useParams()
  const userId = params.id as string
  
  const [formData, setFormData] = useState<UserEditData>({
    id: '',
    name: '',
    email: '',
    plan: 'free',
    status: 'active',
    firstName: '',
    lastName: '',
    phone: '',
    company: '',
    jobTitle: '',
    country: 'JP',
    timezone: 'Asia/Tokyo'
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // デモデータの読み込み
    const demoUsers: Record<string, UserEditData> = {
      'user-1': {
        id: 'user-1',
        name: '田中太郎',
        email: 'tanaka@example.com',
        plan: 'premium',
        status: 'active',
        firstName: '太郎',
        lastName: '田中',
        phone: '090-1234-5678',
        company: '株式会社サンプル',
        jobTitle: 'エンジニア',
        country: 'JP',
        timezone: 'Asia/Tokyo'
      },
      'user-5': {
        id: 'user-5',
        name: '山田健太',
        email: 'yamada@example.com',
        plan: 'premium',
        status: 'active',
        firstName: '健太',
        lastName: '山田',
        phone: '080-9876-5432',
        company: 'テックコーポレーション',
        jobTitle: 'プロダクトマネージャー',
        country: 'JP',
        timezone: 'Asia/Tokyo'
      }
    }

    setTimeout(() => {
      const userData = demoUsers[userId]
      if (userData) {
        setFormData(userData)
      }
      setLoading(false)
    }, 500)
  }, [userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    // シミュレートされた保存処理
    setTimeout(() => {
      setSaving(false)
      alert('ユーザー情報が更新されました')
    }, 1000)
  }

  const handleInputChange = (field: keyof UserEditData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'firstName' || field === 'lastName' ? {
        name: field === 'firstName' ? `${value} ${prev.lastName}` : `${prev.firstName} ${value}`
      } : {})
    }))
  }

  if (loading) {
    return (
      <AdminLayout currentPage="users">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout currentPage="users">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href={`/admin/users/${userId}`}>
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                <ArrowLeft size={12} />
                戻る
              </button>
            </Link>
            <h1 className="text-2xl font-bold">ユーザー編集</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={10} />
            {saving ? '保存中...' : '保存'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">基本情報</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      名
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    電話番号
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="090-1234-5678"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">アカウント設定</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      プラン
                    </label>
                    <select
                      value={formData.plan}
                      onChange={(e) => handleInputChange('plan', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="free">フリー</option>
                      <option value="basic">ベーシック</option>
                      <option value="premium">プレミアム</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ステータス
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">アクティブ</option>
                      <option value="suspended">停止中</option>
                      <option value="inactive">非アクティブ</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">職業情報</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      会社名
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      職種
                    </label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">地域設定</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      国
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="JP">日本</option>
                      <option value="US">アメリカ</option>
                      <option value="GB">イギリス</option>
                      <option value="CN">中国</option>
                      <option value="KR">韓国</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      タイムゾーン
                    </label>
                    <select
                      value={formData.timezone}
                      onChange={(e) => handleInputChange('timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="Asia/Shanghai">Asia/Shanghai (CST)</option>
                      <option value="Asia/Seoul">Asia/Seoul (KST)</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">プレビュー</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg font-medium">
                  {formData.firstName?.charAt(0) || 'U'}
                </div>
                <div>
                  <h4 className="font-medium">{formData.name || 'ユーザー名'}</h4>
                  <p className="text-sm text-gray-600">{formData.email}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">プラン:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    formData.plan === 'premium' ? 'bg-purple-100 text-purple-800' :
                    formData.plan === 'basic' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {formData.plan === 'premium' ? 'プレミアム' : 
                     formData.plan === 'basic' ? 'ベーシック' : 'フリー'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ステータス:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    formData.status === 'active' ? 'bg-green-100 text-green-800' :
                    formData.status === 'suspended' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {formData.status === 'active' ? 'アクティブ' :
                     formData.status === 'suspended' ? '停止中' : '非アクティブ'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">パスワード管理</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 text-sm">
                  パスワードリセットメール送信
                </button>
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm">
                  一時パスワード生成
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">危険な操作</h3>
              <div className="space-y-3">
                <button className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 text-sm">
                  アカウント削除
                </button>
                <button className="w-full bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-200 text-sm">
                  データエクスポート
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}