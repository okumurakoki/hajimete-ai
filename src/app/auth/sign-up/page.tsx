'use client'

import { SignUp } from '@clerk/nextjs'

export default function AuthSignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* 装飾的な背景 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* ヘッダー部分 */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                🤖
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              はじめて.AI
            </h1>
            <p className="text-gray-600 text-lg">
              ようこそ！
            </p>
            <p className="text-sm text-gray-500 mt-1">
              AI学習を始めるためのアカウントを作成しましょう
            </p>
          </div>

          {/* カード部分 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
            <SignUp 
              routing="path"
              path="/auth/sign-up"
              signInUrl="/auth/sign-in"
              redirectUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none border-0 p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  
                  // ソーシャルボタン
                  socialButtonsBlockButton: "w-full mb-4 py-3 px-4 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm",
                  socialButtonsBlockButtonText: "text-gray-700 font-medium",
                  
                  // 区切り線
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-500 text-sm bg-white px-4",
                  
                  // フォーム要素
                  formFieldInput: "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50",
                  formFieldLabel: "text-gray-700 font-medium mb-2 text-sm",
                  
                  // メインボタン
                  formButtonPrimary: "w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border-0",
                  
                  // リンク
                  footerActionLink: "text-purple-600 hover:text-purple-800 font-medium text-sm transition-colors",
                  formResendCodeLink: "text-purple-600 hover:text-purple-800 text-sm transition-colors",
                  
                  // エラー表示
                  formFieldErrorText: "text-red-500 text-sm mt-1",
                  alertClerkError: "bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm",
                  
                  // その他
                  identityPreviewText: "text-gray-600 text-sm",
                  otpCodeFieldInput: "border border-gray-200 rounded-xl px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg font-mono bg-white/50",
                  formFieldInputShowPasswordButton: "text-gray-500 hover:text-gray-700 transition-colors"
                }
              }}
            />
          </div>

          {/* フッター */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              すでにアカウントをお持ちの方は{' '}
              <a 
                href="/auth/sign-in" 
                className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
              >
                サインイン
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