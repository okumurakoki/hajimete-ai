'use client'

import { SignUp } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function SignUpPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-full">
        {/* 左側: アカウント作成フォーム */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {/* ロゴとタイトル */}
            <div className="mb-8">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="text-3xl mr-2">🤖</div>
                <h1 className="text-3xl font-bold text-blue-600">はじめて.AI</h1>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                アカウント作成
              </h2>
              <p className="mt-2 text-gray-600">
                AI学習を始めるためのアカウントを作成しましょう
              </p>
            </div>

            {/* Clerkフォームを美しくカスタマイズ */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <SignUp 
                appearance={{
                  elements: {
                    formButtonPrimary: 
                      'bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors w-full border-0 shadow-sm',
                    card: 
                      'shadow-none border-0 bg-transparent p-0',
                    headerTitle: 
                      'hidden',
                    headerSubtitle: 
                      'hidden',
                    socialButtonsBlockButton: 
                      'border border-gray-300 hover:bg-gray-50 rounded-lg py-3 px-4 w-full transition-colors mb-4 shadow-sm font-medium',
                    socialButtonsBlockButtonText: 
                      'text-gray-700 font-medium text-sm',
                    dividerLine: 
                      'bg-gray-200',
                    dividerText: 
                      'text-gray-500 text-sm px-4',
                    formFieldInput: 
                      'border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-all text-sm',
                    formFieldLabel: 
                      'text-gray-700 font-medium mb-2 block text-sm',
                    footerActionLink: 
                      'text-blue-600 hover:text-blue-800 font-medium text-sm',
                    identityPreviewText: 
                      'text-gray-600 text-sm',
                    formResendCodeLink: 
                      'text-blue-600 hover:text-blue-800 text-sm',
                    otpCodeFieldInput: 
                      'border border-gray-300 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-mono',
                    formFieldSuccessText: 
                      'text-green-600 text-sm',
                    formFieldErrorText: 
                      'text-red-600 text-sm',
                    alertClerkError: 
                      'bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm',
                    formFieldInputShowPasswordButton: 
                      'text-gray-500 hover:text-gray-700',
                  },
                  layout: {
                    socialButtonsPlacement: 'top',
                    showOptionalFields: false
                  }
                }}
                routing="path"
                path="/sign-up"
                redirectUrl="/dashboard"
                signInUrl="/sign-in"
              />
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                すでにアカウントをお持ちの方は{' '}
                <a href="/sign-in" className="font-medium text-blue-600 hover:text-blue-800">
                  サインイン
                </a>
              </p>
            </div>

            {/* ホームに戻るリンク */}
            <div className="text-center mt-4">
              <a href="/" className="text-sm text-gray-500 hover:text-gray-700">
                ← ホームに戻る
              </a>
            </div>
          </div>
        </div>

        {/* 右側: 学習コンテンツ紹介 */}
        <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-blue-600 to-purple-700">
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-white text-center max-w-lg">
              <h3 className="text-2xl font-bold mb-8">
                はじめて.AIで学べること
              </h3>
              
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                  <div className="text-4xl mb-4">🎓</div>
                  <h4 className="font-semibold mb-2">AI基礎学部</h4>
                  <p className="text-sm opacity-90">
                    ChatGPTの使い方からAIの仕組みまで、基礎から丁寧に学習
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                  <div className="text-4xl mb-4">⚡</div>
                  <h4 className="font-semibold mb-2">業務効率化学部</h4>
                  <p className="text-sm opacity-90">
                    ExcelやOfficeツールとAIを組み合わせた実践的スキル
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                  <div className="text-4xl mb-4">🚀</div>
                  <h4 className="font-semibold mb-2">実践応用学部</h4>
                  <p className="text-sm opacity-90">
                    プログラミングとAIを活用した高度な課題解決手法
                  </p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-white/10 backdrop-blur rounded-lg">
                <p className="text-sm">
                  ✨ 特典: 登録後すぐに基本コンテンツにアクセス可能
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}