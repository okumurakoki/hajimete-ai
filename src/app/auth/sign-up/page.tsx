'use client'

export const dynamic = 'force-dynamic'

import { SignUp } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

export default function AuthSignUpPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 relative">
      {/* 装飾的な背景 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-300/15 to-blue-300/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* ヘッダー部分 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              はじめて.AI
            </h1>
            <p className="text-gray-600 text-lg font-medium">
              ようこそ！
            </p>
            <p className="text-sm text-gray-500 mt-2">
              AI学習を始めるためのアカウントを作成しましょう
            </p>
          </div>

          {/* カード部分 */}
          <div className="bg-transparent p-8">
            <SignUp 
              routing="path"
              path="/auth/sign-up"
              signInUrl="/auth/sign-in"
              redirectUrl="/dashboard"
              appearance={{
                variables: {
                  colorPrimary: "#8B5CF6",
                  colorText: "#1F2937",
                  fontFamily: "'Noto Sans JP', system-ui, sans-serif",
                  borderRadius: "8px"
                },
                elements: {
                  // カード全体
                  card: "bg-transparent shadow-none border-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  
                  // フォーム要素
                  formFieldInput: "border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500",
                  formFieldLabel: "text-gray-700 font-medium text-sm",
                  formButtonPrimary: "bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5",
                  
                  // ソーシャルボタン
                  socialButtonsBlockButton: "border border-gray-300 hover:bg-gray-50 text-gray-700",
                  
                  // リンク
                  footerActionLink: "text-purple-600 hover:text-purple-700 font-medium"
                }
              }}
            />
          </div>

          {/* フッター */}
          <div className="text-center mt-8">
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

          {/* 特典表示 */}
          <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-200/30">
            <div className="text-center">
              <div className="text-2xl mb-2">✨</div>
              <h3 className="font-semibold text-gray-800 mb-2">登録特典</h3>
              <p className="text-sm text-gray-600">
                無料プランで基本的なAI学習コンテンツに<br />
                すぐにアクセスできます！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}