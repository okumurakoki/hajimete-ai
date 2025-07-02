'use client'

import { useUser, useAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/Layout'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return <DashboardContent />
}

function DashboardContent() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { getToken } = useAuth()
  const [authChecked, setAuthChecked] = useState(false)
  const [userStats, setUserStats] = useState({
    totalLessonsCompleted: 0,
    currentStreak: 0,
    totalStudyTime: 0,
    level: 1,
    experiencePoints: 0,
    joinedDate: null as Date | null
  })

  useEffect(() => {
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
    if (isLoaded) {
      setAuthChecked(true)
      if (!isSignedIn) {
        redirect('/sign-in')
      } else {
        // ユーザー統計を初期化（実際の実装では API から取得）
        setUserStats({
          totalLessonsCompleted: 3,
          currentStreak: 5,
          totalStudyTime: 120, // 分
          level: 2,
          experiencePoints: 340,
          joinedDate: new Date(user?.createdAt || Date.now())
        })
      }
    }
  }, [isLoaded, isSignedIn, user])

  // 認証チェック中
  if (!authChecked || !isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">認証状態を確認中...</p>
        </div>
      </div>
    )
  }

  // 未サインイン時
  if (!isSignedIn) {
    return null // redirect が実行される
  }

  return (
    <DashboardLayout 
      title="ダッシュボード"
      description={`こんにちは、${user?.firstName || user?.emailAddresses?.[0]?.emailAddress}さん`}
      actions={
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
          設定
        </button>
      }
    >
          
          {/* ユーザー統計セクション */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              学習統計
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 完了レッスン数 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="text-3xl mr-3">📚</div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{userStats.totalLessonsCompleted}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">完了レッスン数</p>
                  </div>
                </div>
              </div>

              {/* 連続学習日数 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="text-3xl mr-3">🔥</div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{userStats.currentStreak}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">連続学習日数</p>
                  </div>
                </div>
              </div>

              {/* 総学習時間 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="text-3xl mr-3">⏰</div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{Math.floor(userStats.totalStudyTime / 60)}h {userStats.totalStudyTime % 60}m</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">総学習時間</p>
                  </div>
                </div>
              </div>

              {/* レベル・経験値 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="text-3xl mr-3">⭐</div>
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-purple-600">Lv.{userStats.level}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{userStats.experiencePoints} XP</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(userStats.experiencePoints % 500) / 5}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      次のレベルまで {500 - (userStats.experiencePoints % 500)} XP
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 返金・キャンセル管理 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              返金・キャンセル管理
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">💰</div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      返金リクエスト
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      講座のキャンセルや返金については、決済完了ページから申請できます
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => window.location.href = '/payment/success'}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                >
                  返金申請
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                    返金条件
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    講座開始24時間前までキャンセル可能
                  </p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
                    返金期間
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    申請後3-5営業日で返金完了
                  </p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                    返金方法
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    決済時と同じカードに返金
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* おすすめコンテンツ */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                あなたにおすすめのコンテンツ
              </h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                もっと見る
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* おすすめレッスン1 */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-lg p-6 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-3xl">🚀</div>
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    新着
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  ChatGPTで作業効率を上げる10のコツ
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  日常業務ですぐに使える実践的なテクニックを学びましょう
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    15分
                  </div>
                  <div className="flex items-center text-xs text-yellow-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    4.8
                  </div>
                </div>
              </div>

              {/* おすすめレッスン2 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 rounded-lg p-6 border border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-3xl">💡</div>
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    人気
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  AIツールでプレゼン資料作成
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  パワーポイントやデザイン作成をAIで効率化する方法
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    20分
                  </div>
                  <div className="flex items-center text-xs text-yellow-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    4.9
                  </div>
                </div>
              </div>

              {/* おすすめレッスン3 */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 rounded-lg p-6 border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-3xl">📊</div>
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    おすすめ
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  データ分析でビジネスを改善
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  ExcelやGoogleシートでできるシンプルなデータ分析手法
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    25分
                  </div>
                  <div className="flex items-center text-xs text-yellow-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    4.7
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* アクセス可能な学部セクション - 余白修正 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                アクセス可能な学部:
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                アクセス可能な学部:
              </div>
            </div>
            
            {/* 学部カード - 余白調整 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* AI基礎学部 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800 p-6 hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full -mr-8 -mt-8"></div>
                <div className="text-center relative z-10">
                  <div className="text-4xl mb-3">🎓</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    AI基礎学部
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    ChatGPTの使い方からAIの仕組みまで、基礎から丁寧に学習
                  </p>
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: '25%' }}></div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 flex justify-between">
                      <span>3/12 レッスン完了</span>
                      <span>25%</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                      学習を続ける
                    </button>
                    <div className="text-xs text-green-600 font-medium">
                      最終学習: 1時間前
                    </div>
                  </div>
                </div>
              </div>

              {/* 業務効率化学部 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="text-4xl mb-3">⚡</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    業務効率化学部
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    ExcelやOfficeツールとAIを組み合わせた実践的スキル
                  </p>
                  <div className="flex flex-col space-y-2">
                    <button className="w-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 py-2 px-4 rounded-md text-sm font-medium cursor-not-allowed">
                      プレミアム限定
                    </button>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      プレミアムプランでアクセス可能
                    </div>
                  </div>
                </div>
              </div>

              {/* 実践応用学部 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="text-4xl mb-3">🚀</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    実践応用学部
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    プログラミングとAIを活用した高度な課題解決手法
                  </p>
                  <div className="flex flex-col space-y-2">
                    <button className="w-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 py-2 px-4 rounded-md text-sm font-medium cursor-not-allowed">
                      プレミアム限定
                    </button>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      プレミアムプランでアクセス可能
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 最近の学習履歴 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                最近の学習履歴
              </h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                すべて見る
              </button>
            </div>
            
            <div className="space-y-4">
              {/* 学習履歴アイテム */}
              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="text-2xl mr-4">📚</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">ChatGPTの基本操作</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI基礎学部 • レッスン3</p>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center text-xs text-green-600 mr-4">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      完了
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">1時間前</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-600">+50 XP</span>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="text-2xl mr-4">🎯</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">プロンプトエンジニアリング入門</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI基礎学部 • レッスン2</p>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center text-xs text-green-600 mr-4">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      完了
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">昨日</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-600">+75 XP</span>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="text-2xl mr-4">🤖</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">AIとは何か？基本概念の理解</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI基礎学部 • レッスン1</p>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center text-xs text-green-600 mr-4">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      完了
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">2日前</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-600">+100 XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* お気に入り・後で見る */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                お気に入り・後で見る
              </h3>
              <div className="flex space-x-2">
                <button className="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                  お気に入り (3)
                </button>
                <button className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium">
                  後で見る (2)
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* お気に入りアイテム */}
              <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="text-2xl mr-4">📊</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">データ分析でビジネスを改善</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI基礎学部 • 25分</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                    学習開始
                  </button>
                </div>
              </div>

              <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="text-2xl mr-4">🚀</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">ChatGPTで作業効率を上げる10のコツ</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI基礎学部 • 15分</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/50 rounded-full">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                    学習開始
                  </button>
                </div>
              </div>

              <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="text-2xl mr-4">💡</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">AIツールでプレゼン資料作成</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI基礎学部 • 20分</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                    学習開始
                  </button>
                </div>
              </div>

              <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="text-2xl mr-4">📈</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">ビジネスメールをAIで效率化</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI基礎学部 • 18分</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-full">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                    学習開始
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* プラン選択セクション */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              プランをアップグレード
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 無料プラン */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">無料プラン</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">¥0</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">月額</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4">
                  <li>• AI基礎学部のみアクセス</li>
                  <li>• 基本的な学習コンテンツ</li>
                </ul>
                <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 py-2 px-4 rounded-md text-sm font-medium">
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
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">ベーシックプラン</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">¥3,500</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">月額</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4">
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
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">プレミアムプラン</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">¥5,500</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">月額</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4">
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

          {/* 詳細学習進捗管理 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                学習進捗管理
              </h3>
              <button className="bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/70 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-md text-sm font-medium transition-colors">
                詳細表示
              </button>
            </div>
            
            <div className="space-y-6">
              {/* AI基礎学部 */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">🎓</div>
                    <div>
                      <span className="text-base font-semibold text-gray-900 dark:text-gray-100">AI基礎学部</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">基礎コンセプトから実践まで</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-600">25%</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">3/12 レッスン完了</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                  <div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: '25%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>次のレッスン: 「ChatGPTの基本操作」</span>
                  <span>推定残り時間: 2時間</span>
                </div>
              </div>

              {/* 業務効率化学部 */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 opacity-60">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">⚡</div>
                    <div>
                      <span className="text-base font-semibold text-gray-900 dark:text-gray-100">業務効率化学部</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">ExcelやOfficeツールとAIの連携</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-orange-600 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/50 px-2 py-1 rounded-full">
                      プレミアム限定
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                  <div className="bg-gray-400 h-3 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>プレミアムプランでアンロック</span>
                  <span>0/15 レッスン</span>
                </div>
              </div>

              {/* 実践応用学部 */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 opacity-60">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">🚀</div>
                    <div>
                      <span className="text-base font-semibold text-gray-900 dark:text-gray-100">実践応用学部</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">プログラミングとAIの高度な活用</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded-full">
                      プレミアム限定
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                  <div className="bg-gray-400 h-3 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>プレミアムプランでアンロック</span>
                  <span>0/20 レッスン</span>
                </div>
              </div>
            </div>
            
            {/* 今日の目標 */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                <div className="text-lg mr-2">🎯</div>
                今日の学習目標
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700">
                  <span>レッスンを1つ完了する</span>
                  <div className="w-5 h-5 border-2 border-blue-500 rounded"></div>
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700">
                  <span>15分以上学習する</span>
                  <div className="w-5 h-5 border-2 border-blue-500 rounded"></div>
                </div>
              </div>
            </div>
          </div>
    </DashboardLayout>
  )
}