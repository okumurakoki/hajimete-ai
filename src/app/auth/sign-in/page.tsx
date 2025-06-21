'use client'

import { SignIn } from '@clerk/nextjs'

export default function AuthSignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {/* 装飾的な背景 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-indigo-400/15 to-purple-400/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* ヘッダー部分 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              はじめて.AI
            </h1>
            <p className="text-gray-600 text-lg font-medium">
              おかえりなさい
            </p>
            <p className="text-sm text-gray-500 mt-2">
              アカウントにサインインして学習を続けましょう
            </p>
          </div>

          {/* カード部分 */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8">
            <SignIn 
              routing="path"
              path="/auth/sign-in"
              signUpUrl="/auth/sign-up"
              redirectUrl="/dashboard"
            />
          </div>

          {/* フッター */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              アカウントをお持ちでない方は{' '}
              <a 
                href="/auth/sign-up" 
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                新規登録
              </a>
            </p>
            <div className="mt-4">
              <a 
                href="/" 
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                ホームに戻る
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}