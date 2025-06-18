'use client'

import { useState } from 'react'

// Disable static generation for auth pages
export const dynamic = 'force-dynamic'
import Link from 'next/link'
// import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  // const { isLoaded, signUp, setActive } = useSignUp()
  const isLoaded = true // Mock for build compatibility
  const signUp = null // Mock for build compatibility
  const setActive = null // Mock for build compatibility
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded || !signUp) return

    setLoading(true)
    try {
      // Mock sign up - in real implementation, this would use Clerk
      console.log('Mock sign up attempt with:', email)
      // Simulate successful sign up
      setVerifying(true)
    } catch (err: any) {
      console.error('Sign up error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded || !signUp || !setActive) return

    setLoading(true)
    try {
      // Mock verification - in real implementation, this would use Clerk
      console.log('Mock verification attempt with code:', code)
      // Simulate successful verification
      router.push('/plan-selection')
    } catch (err: any) {
      console.error('Verification error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <Link href="/" className="text-3xl font-bold text-blue-600">
              はじめて.AI
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              メール認証
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {email} に送信された認証コードを入力してください
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleVerification}>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  認証コード
                </label>
                <div className="mt-1">
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="6桁のコードを入力"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? '認証中...' : '認証する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Sign Up Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link href="/" className="text-3xl font-bold text-blue-600">
              はじめて.AI
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              アカウント作成
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              AI学習を始めるためのアカウントを作成しましょう
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    名前（姓）
                  </label>
                  <div className="mt-1">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="田中"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    名前（名）
                  </label>
                  <div className="mt-1">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="太郎"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  メールアドレス
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  パスワード
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="8文字以上のパスワード"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  8文字以上、大文字・小文字・数字を含む
                </p>
              </div>

              <div className="flex items-center">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                  <a href="#" className="text-blue-600 hover:text-blue-500">利用規約</a>
                  および
                  <a href="#" className="text-blue-600 hover:text-blue-500">プライバシーポリシー</a>
                  に同意します
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'アカウント作成中...' : 'アカウント作成'}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              すでにアカウントをお持ちの方は{' '}
              <Link href="/sign-in" className="font-medium text-blue-600 hover:text-blue-500">
                ログイン
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Benefits */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-blue-700 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h3 className="text-2xl font-bold mb-6">学習プランを選択</h3>
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
                <h4 className="font-semibold mb-2">ベーシックプラン ¥1,650/月</h4>
                <ul className="text-sm space-y-1">
                  <li>• AI基礎学部</li>
                  <li>• 業務効率化学部</li>
                  <li>• 基本セミナー参加</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/30">
                <h4 className="font-semibold mb-2">プレミアムプラン ¥5,500/月</h4>
                <ul className="text-sm space-y-1">
                  <li>• 全学部アクセス</li>
                  <li>• ライブ配信視聴</li>
                  <li>• 個別サポート</li>
                  <li>• 専用コンテンツ</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}