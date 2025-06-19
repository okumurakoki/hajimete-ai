'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Lock, User, Eye, EyeOff, Shield } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 管理者メールアドレスかチェック
      const isAdminEmail = email.includes('admin') || 
                          email.includes('管理') || 
                          email === 'admin@hajimete-ai.com' ||
                          email === 'cms@hajimete-ai.com'

      if (!isAdminEmail) {
        setError('管理者権限のあるメールアドレスを入力してください')
        setLoading(false)
        return
      }

      // 管理者認証をシミュレート
      if ((email.includes('admin') || email === 'admin@hajimete-ai.com') && password) {
        signIn()
        router.push('/cms')
      } else {
        setError('ログインに失敗しました')
      }
    } catch (err) {
      setError('ログインエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const quickAdminLogin = async () => {
    setLoading(true)
    setError('')
    try {
      signIn()
      router.push('/cms')
    } catch (err) {
      setError('ログインエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-purple-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center mb-4">
            <Shield size={19} className="text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            管理者ログイン
          </h2>
          <p className="text-blue-200">
            はじめて.AI CMS管理画面
          </p>
        </div>

        {/* Quick Login Button */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <button
            onClick={quickAdminLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? '認証中...' : '🚀 ワンクリック管理者ログイン'}
          </button>
          <p className="text-xs text-blue-200 text-center">
            開発・デモ用の簡単ログイン
          </p>
        </div>

        {/* Manual Login Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                管理者メールアドレス
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@hajimete-ai.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                パスワード
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="管理者パスワード"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-blue-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '認証中...' : 'ログイン'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-blue-200">
              管理者権限のあるアカウントのみログイン可能です
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <h3 className="text-white font-medium mb-2">デモ用認証情報</h3>
          <div className="text-sm text-blue-200 space-y-1">
            <div>メール: admin@hajimete-ai.com</div>
            <div>パスワード: 任意（何でもOK）</div>
          </div>
        </div>
      </div>
    </div>
  )
}