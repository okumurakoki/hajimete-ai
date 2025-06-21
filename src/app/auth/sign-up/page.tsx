'use client'

import { SignUp } from '@clerk/nextjs'

export default function AuthSignUpPage() {
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
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8">
            <SignUp 
              routing="path"
              path="/auth/sign-up"
              signInUrl="/auth/sign-in"
              redirectUrl="/dashboard"
              appearance={{
                variables: {
                  colorPrimary: "#8B5CF6",
                  colorText: "#374151",
                  colorTextSecondary: "#6B7280",
                  borderRadius: "12px",
                  fontFamily: "'Noto Sans JP', system-ui, sans-serif"
                },
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none border-0 p-0 rounded-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  
                  // ソーシャルボタン
                  socialButtonsBlockButton: "w-full mb-3 py-3.5 px-4 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md",
                  socialButtonsBlockButtonText: "text-gray-700 font-medium text-sm",
                  socialButtonsProviderIcon: "w-5 h-5",
                  
                  // 区切り線
                  dividerLine: "bg-gray-200 h-px",
                  dividerText: "text-gray-500 text-sm bg-white px-4 relative",
                  dividerRow: "my-6",
                  
                  // フォーム要素
                  formFieldInput: "w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500",
                  formFieldLabel: "text-gray-700 font-medium mb-2 text-sm block",
                  formFieldRow: "mb-4",
                  
                  // メインボタン
                  formButtonPrimary: "w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border-0 text-base",
                  
                  // リンク
                  footerActionLink: "text-purple-600 hover:text-purple-800 font-medium text-sm transition-colors underline-offset-2",
                  formResendCodeLink: "text-purple-600 hover:text-purple-800 text-sm transition-colors",
                  
                  // エラー表示
                  formFieldErrorText: "text-red-500 text-sm mt-1.5",
                  alertClerkError: "bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm mb-4",
                  
                  // その他
                  identityPreviewText: "text-gray-600 text-sm",
                  otpCodeFieldInput: "border border-gray-200 rounded-xl px-3 py-3 text-center focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg font-mono bg-white mr-2 last:mr-0",
                  formFieldInputShowPasswordButton: "text-gray-500 hover:text-gray-700 transition-colors absolute right-3 top-1/2 transform -translate-y-1/2",
                  
                  // フッター
                  footerAction: "text-center mt-6",
                  footerActionText: "text-gray-600 text-sm",
                  
                  // 日本語化用のテキスト要素
                  formFieldAction__forgotPassword: "text-purple-600 hover:text-purple-800 text-sm transition-colors",
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