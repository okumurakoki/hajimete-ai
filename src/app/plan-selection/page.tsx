'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'

export default function PlanSelectionPage() {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)

  // 決済処理（一時的に無効化）
  const handlePlanSelection = async (planType: string) => {
    if (!user) return
    
    setLoading(true)
    
    try {
      // 一時的にアラート表示（Stripe設定完了まで）
      alert(`${planType}プランの選択ありがとうございます。\n決済機能は現在設定中です。\nしばらくお待ちください。`)
    } catch (error) {
      console.error('Plan selection error:', error)
      alert('エラーが発生しました。しばらく時間をおいてからお試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            プランを選択してください
          </h1>
          <p className="text-gray-600">
            あなたの学習スタイルに合ったプランをお選びください
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* 無料プラン */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">無料プラン</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">¥0</span>
              <span className="text-gray-600 ml-2">/ 月</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                AI基礎学部のみアクセス
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                基本的な学習コンテンツ
              </li>
            </ul>
            <button
              disabled
              className="w-full bg-gray-100 text-gray-500 py-3 px-6 rounded-lg font-medium cursor-not-allowed"
            >
              現在のプラン
            </button>
          </div>

          {/* ベーシックプラン */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                おすすめ
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">ベーシックプラン</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">¥3,500</span>
              <span className="text-gray-600 ml-2">/ 月</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                全学部アクセス
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                実践的な課題
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                コミュニティアクセス
              </li>
            </ul>
            <button
              onClick={() => handlePlanSelection('ベーシック')}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? '処理中...' : 'このプランを選択'}
            </button>
          </div>

          {/* プレミアムプラン */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-purple-500">
            <h3 className="text-xl font-bold text-gray-900 mb-4">プレミアムプラン</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">¥5,500</span>
              <span className="text-gray-600 ml-2">/ 月</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                全学部アクセス
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                1on1メンタリング
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                最新コンテンツ優先アクセス
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                修了証明書発行
              </li>
            </ul>
            <button
              onClick={() => handlePlanSelection('プレミアム')}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? '処理中...' : 'このプランを選択'}
            </button>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← ダッシュボードに戻る
          </a>
        </div>
      </div>
    </div>
  )
}