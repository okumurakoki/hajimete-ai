'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/Layout'
import { 
  User, 
  Mail, 
  Calendar, 
  Settings, 
  Edit3, 
  Save,
  X,
  Camera,
  Clock,
  Trophy,
  Target,
  Zap
} from 'lucide-react'

interface UserProfile {
  id: string
  clerkId: string
  email: string
  firstName: string | null
  lastName: string | null
  imageUrl: string | null
  displayName: string | null
  bio: string | null
  theme: string
  language: string
  timezone: string
  emailNotifications: boolean
  courseNotifications: boolean
  marketingEmails: boolean
  plan: string
  totalStudyTime: number
  currentStreak: number
  longestStreak: number
  totalCoursesCompleted: number
  createdAt: string
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    emailNotifications: true,
    courseNotifications: true,
    marketingEmails: false
  })

  // ユーザープロフィールデータを取得
  useEffect(() => {
    if (isLoaded && user) {
      fetchUserProfile()
    }
  }, [isLoaded, user])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const profile = await response.json()
        setUserProfile(profile)
        setEditForm({
          displayName: profile.displayName || '',
          bio: profile.bio || '',
          emailNotifications: profile.emailNotifications,
          courseNotifications: profile.courseNotifications,
          marketingEmails: profile.marketingEmails
        })
      } else {
        console.error('Failed to fetch user profile')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setUserProfile(updatedProfile)
        setIsEditing(false)
      } else {
        console.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">プロフィールを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">サインインが必要です</p>
        </div>
      </div>
    )
  }

  const displayName = userProfile?.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'ユーザー'
  const joinedDate = userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('ja-JP') : new Date().toLocaleDateString('ja-JP')

  return (
    <DashboardLayout 
      title="プロフィール" 
      description="アカウント情報と設定を管理"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* プロフィールヘッダー */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={user.imageUrl || '/default-avatar.png'}
                  alt="プロフィール画像"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900"
                />
                <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{displayName}</h1>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  {user.emailAddresses[0]?.emailAddress}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  参加日: {joinedDate}
                </div>
                {userProfile?.bio && (
                  <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md">{userProfile.bio}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  キャンセル
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  編集
                </>
              )}
            </button>
          </div>
        </div>

        {/* 編集フォーム */}
        {isEditing && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">プロフィールを編集</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  表示名
                </label>
                <input
                  type="text"
                  value={editForm.displayName}
                  onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="表示名を入力"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  自己紹介
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                  placeholder="自己紹介を入力"
                />
              </div>
              
              {/* 通知設定 */}
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">通知設定</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editForm.emailNotifications}
                      onChange={(e) => setEditForm({ ...editForm, emailNotifications: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">メール通知を受け取る</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editForm.courseNotifications}
                      onChange={(e) => setEditForm({ ...editForm, courseNotifications: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">コース関連通知</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editForm.marketingEmails}
                      onChange={(e) => setEditForm({ ...editForm, marketingEmails: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">マーケティングメール</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 学習統計 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">総学習時間</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {userProfile?.totalStudyTime || 0}分
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">現在の連続日数</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {userProfile?.currentStreak || 0}日
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">完了コース数</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {userProfile?.totalCoursesCompleted || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                <Target className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">プラン</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {userProfile?.plan || 'FREE'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* アカウント設定 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            アカウント設定
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">プラン管理</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">現在のプラン: {userProfile?.plan || 'FREE'}</p>
              </div>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                変更
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">セキュリティ</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">パスワードとセキュリティ設定</p>
              </div>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                設定
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">データのエクスポート</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">学習データをダウンロード</p>
              </div>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                エクスポート
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}