'use client'

import { useUser, useAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { getToken } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // ページ固有のエラーハンドリング
    const handlePageError = (error: ErrorEvent) => {
      if (error.message.includes('message channel closed') ||
          error.filename?.includes('chrome-extension')) {
        console.warn('Chrome extension conflict detected, continuing...')
        return true
      }
    }

    window.addEventListener('error', handlePageError)

    return () => {
      window.removeEventListener('error', handlePageError)
    }
  }, [])

  // 認証状態をチェック
  useEffect(() => {
    if (mounted && isLoaded) {
      setAuthChecked(true)
      if (!isSignedIn) {
        redirect('/sign-in')
      }
    }
  }, [mounted, isLoaded, isSignedIn])

  // マウント前のローディング
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // 認証チェック中
  if (!authChecked || !isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">認証状態を確認中...</p>
        </div>
      </div>
    )
  }

  // 未サインイン時
  if (!isSignedIn) {
    return null // redirect が実行される
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                ダッシュボード
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                こんにちは、{user?.firstName || user?.emailAddresses?.[0]?.emailAddress}さん
              </span>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                設定
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          
          {/* アクセス可能な学部セクション - 余白修正 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                アクセス可能な学部:
              </h2>
              <div className="text-sm text-gray-600">
                アクセス可能な学部:
              </div>
            </div>
            
            {/* 学部カード - 余白調整 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* AI基礎学部 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="text-4xl mb-3">🎓</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    AI基礎学部
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    ChatGPTの使い方からAIの仕組みまで、基礎から丁寧に学習
                  </p>
                  <div className="flex flex-col space-y-2">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                      学習を開始
                    </button>
                    <div className="text-xs text-gray-500">
                      進捗: 0%
                    </div>
                  </div>
                </div>
              </div>

              {/* 業務効率化学部 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="text-4xl mb-3">⚡</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    業務効率化学部
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    ExcelやOfficeツールとAIを組み合わせた実践的スキル
                  </p>
                  <div className="flex flex-col space-y-2">
                    <button className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md text-sm font-medium cursor-not-allowed">
                      プレミアム限定
                    </button>
                    <div className="text-xs text-gray-500">
                      プレミアムプランでアクセス可能
                    </div>
                  </div>
                </div>
              </div>

              {/* 実践応用学部 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="text-4xl mb-3">🚀</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    実践応用学部
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    プログラミングとAIを活用した高度な課題解決手法
                  </p>
                  <div className="flex flex-col space-y-2">
                    <button className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md text-sm font-medium cursor-not-allowed">
                      プレミアム限定
                    </button>
                    <div className="text-xs text-gray-500">
                      プレミアムプランでアクセス可能
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* プラン選択セクション */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              プランをアップグレード
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 無料プラン */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">無料プラン</h4>
                <p className="text-2xl font-bold text-gray-900 mb-2">¥0</p>
                <p className="text-sm text-gray-600 mb-4">月額</p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• AI基礎学部のみアクセス</li>
                  <li>• 基本的な学習コンテンツ</li>
                </ul>
                <button className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md text-sm font-medium">
                  現在のプラン
                </button>
              </div>

              {/* ベーシックプラン */}
              <div className="border border-blue-500 rounded-lg p-4 relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    おすすめ
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">ベーシックプラン</h4>
                <p className="text-2xl font-bold text-gray-900 mb-2">¥3,500</p>
                <p className="text-sm text-gray-600 mb-4">月額</p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• 全学部アクセス</li>
                  <li>• 実践的な課題</li>
                  <li>• コミュニティアクセス</li>
                </ul>
                <button 
                  onClick={() => window.location.href = '/plan-selection'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                >
                  アップグレード
                </button>
              </div>

              {/* プレミアムプラン */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">プレミアムプラン</h4>
                <p className="text-2xl font-bold text-gray-900 mb-2">¥5,500</p>
                <p className="text-sm text-gray-600 mb-4">月額</p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• 全学部アクセス</li>
                  <li>• 1on1メンタリング</li>
                  <li>• 最新コンテンツ優先アクセス</li>
                  <li>• 修了証明書発行</li>
                </ul>
                <button 
                  onClick={() => window.location.href = '/plan-selection'}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                >
                  アップグレード
                </button>
              </div>
            </div>
          </div>

          {/* 学習進捗 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              学習進捗
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">AI基礎</span>
                  <span className="text-sm text-gray-500">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">業務効率化</span>
                  <span className="text-sm text-gray-500">プレミアム限定</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">実践応用</span>
                  <span className="text-sm text-gray-500">プレミアム限定</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}