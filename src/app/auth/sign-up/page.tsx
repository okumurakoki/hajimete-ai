'use client'

import { SignUp } from '@clerk/nextjs'

export default function AuthSignUpPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <span className="text-3xl mr-2">🤖</span>
              <h1 className="text-2xl font-bold text-gray-900">はじめて.AI</h1>
            </div>
            <p className="text-gray-600 mt-2">AI学習を始めるためのアカウントを作成しましょう</p>
          </div>
          <SignUp 
            routing="path"
            path="/auth/sign-up"
            signInUrl="/auth/sign-in"
          />
        </div>
      </div>
    </div>
  )
}