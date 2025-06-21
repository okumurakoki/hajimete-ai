'use client'

import { SignIn } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function SignInPage() {
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* ロゴとタイトル */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="text-3xl mr-2">🤖</div>
            <h1 className="text-3xl font-bold text-blue-600">はじめて.AI</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">サインイン</h2>
          <p className="text-gray-600">
            アカウントにサインインして学習を続けましょう
          </p>
        </div>
        
        {/* Clerkフォームを美しくカスタマイズ */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <SignIn 
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
                showOptionalFields: false,
              }
            }}
            routing="path"
            path="/sign-in"
            redirectUrl="/dashboard"
            signUpUrl="/sign-up"
          />
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            アカウントをお持ちでない方は{' '}
            <a href="/sign-up" className="font-medium text-blue-600 hover:text-blue-800">
              新規登録
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
  )
}