'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { ArrowLeft, Edit, Trash2, Shield, User, Mail, Calendar, Award } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface UserDetail {
  id: string
  name: string
  email: string
  plan: 'free' | 'basic' | 'premium'
  status: 'active' | 'suspended' | 'inactive'
  registeredAt: string
  lastLogin: string
  totalVideosWatched: number
  totalSeminarsAttended: number
  achievements: string[]
}

export default function UserDetailPage() {
  const params = useParams()
  const userId = params.id as string
  
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // デモデータ
    const demoUsers: Record<string, UserDetail> = {
      'user-1': {
        id: 'user-1',
        name: '田中太郎',
        email: 'tanaka@example.com',
        plan: 'premium',
        status: 'active',
        registeredAt: '2024-01-15',
        lastLogin: '2024-03-15',
        totalVideosWatched: 45,
        totalSeminarsAttended: 12,
        achievements: ['初回ログイン', 'プレミアム会員', '動画マスター']
      },
      'user-2': {
        id: 'user-2',
        name: '佐藤花子',
        email: 'sato@example.com',
        plan: 'basic',
        status: 'active',
        registeredAt: '2024-02-01',
        lastLogin: '2024-03-14',
        totalVideosWatched: 23,
        totalSeminarsAttended: 5,
        achievements: ['初回ログイン', 'ベーシック会員']
      },
      'user-3': {
        id: 'user-3',
        name: '鈴木一郎',
        email: 'suzuki@example.com',
        plan: 'free',
        status: 'suspended',
        registeredAt: '2024-01-20',
        lastLogin: '2024-02-28',
        totalVideosWatched: 8,
        totalSeminarsAttended: 1,
        achievements: ['初回ログイン']
      },
      'user-4': {
        id: 'user-4',
        name: '高橋美咲',
        email: 'takahashi@example.com',
        plan: 'basic',
        status: 'active',
        registeredAt: '2024-02-10',
        lastLogin: '2024-03-12',
        totalVideosWatched: 31,
        totalSeminarsAttended: 8,
        achievements: ['初回ログイン', 'ベーシック会員', 'セミナー常連']
      },
      'user-5': {
        id: 'user-5',
        name: '山田健太',
        email: 'yamada@example.com',
        plan: 'premium',
        status: 'active',
        registeredAt: '2024-01-05',
        lastLogin: '2024-03-16',
        totalVideosWatched: 67,
        totalSeminarsAttended: 18,
        achievements: ['初回ログイン', 'プレミアム会員', '動画マスター', 'セミナー常連', 'アーリーアダプター']
      }
    }

    setTimeout(() => {
      setUser(demoUsers[userId] || null)
      setLoading(false)
    }, 500)
  }, [userId])

  const handleStatusChange = (newStatus: 'active' | 'suspended') => {
    if (user) {
      setUser({...user, status: newStatus})
      alert(`ユーザーのステータスを「${newStatus === 'active' ? 'アクティブ' : '停止'}」に変更しました`)
    }
  }

  const handleDeleteUser = () => {
    if (confirm('本当にこのユーザーを削除しますか？')) {
      alert('ユーザーが削除されました')
      // In real app, navigate back to users list
    }
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

  if (!user) {
    return (
      <AdminLayout currentPage="users">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/admin/users">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                <ArrowLeft size={12} />
                戻る
              </button>
            </Link>
            <h1 className="text-2xl font-bold">ユーザーが見つかりません</h1>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">指定されたユーザーは存在しません。</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'premium': return 'bg-purple-100 text-purple-800'
      case 'basic': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AdminLayout currentPage="users">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/users">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                <ArrowLeft size={12} />
                戻る
              </button>
            </Link>
            <h1 className="text-2xl font-bold">{user.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/admin/users/${user.id}/edit`}>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Edit size={10} />
                編集
              </button>
            </Link>
            <button
              onClick={handleDeleteUser}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <Trash2 size={10} />
              削除
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">基本情報</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User size={12} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">ユーザー名</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail size={12} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">メールアドレス</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">プラン</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(user.plan)}`}>
                      {user.plan === 'premium' ? 'プレミアム' : user.plan === 'basic' ? 'ベーシック' : 'フリー'}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">ステータス</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                      {user.status === 'active' ? 'アクティブ' : user.status === 'suspended' ? '停止中' : '非アクティブ'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">利用統計</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{user.totalVideosWatched}</div>
                  <div className="text-sm text-gray-600">視聴動画数</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{user.totalSeminarsAttended}</div>
                  <div className="text-sm text-gray-600">参加セミナー数</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{user.achievements.length}</div>
                  <div className="text-sm text-gray-600">獲得バッジ数</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {Math.floor((new Date().getTime() - new Date(user.registeredAt).getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-sm text-gray-600">利用日数</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">獲得バッジ</h2>
              <div className="flex flex-wrap gap-2">
                {user.achievements.map((achievement, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                  >
                    <Award size={14} />
                    {achievement}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">アカウント操作</h2>
              <div className="flex gap-4">
                {user.status === 'active' ? (
                  <button
                    onClick={() => handleStatusChange('suspended')}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200"
                  >
                    アカウントを停止
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange('active')}
                    className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200"
                  >
                    アカウントを有効化
                  </button>
                )}
                <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200">
                  パスワードリセットメール送信
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">アカウント情報</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={10} className="text-gray-400" />
                  <div>
                    <p className="text-gray-600">登録日</p>
                    <p>{new Date(user.registeredAt).toLocaleDateString('ja-JP')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={10} className="text-gray-400" />
                  <div>
                    <p className="text-gray-600">最終ログイン</p>
                    <p>{new Date(user.lastLogin).toLocaleDateString('ja-JP')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">クイックアクション</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  メール送信
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  ログイン履歴を表示
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  支払い履歴を表示
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  サポートチケットを作成
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}