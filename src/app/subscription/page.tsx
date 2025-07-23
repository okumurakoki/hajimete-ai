'use client'

export const dynamic = 'force-dynamic'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/Layout'
import { 
  Crown, 
  Check, 
  X, 
  CreditCard, 
  Calendar,
  AlertCircle,
  Zap,
  Star,
  Sparkles
} from 'lucide-react'

interface UserSubscription {
  plan: 'FREE' | 'BASIC' | 'PREMIUM'
  subscriptionStatus?: string
  planExpiresAt?: string
  stripeCustomerId?: string
  subscriptionId?: string
}

export default function SubscriptionPage() {
  const { user, isLoaded } = useUser()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isLoaded && user) {
      fetchSubscription()
    }
  }, [isLoaded, user])

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/user/subscription')
      if (response.ok) {
        const data = await response.json()
        setSubscription(data)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (planType: 'basic' | 'premium') => {
    if (!user) return
    
    setUpgradeLoading(planType)
    
    try {
      const response = await fetch('/api/payments/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType,
          userId: user.id,
          userEmail: user.emailAddresses[0]?.emailAddress
        })
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      window.location.href = data.checkoutUrl
      
    } catch (error) {
      console.error('Upgrade error:', error)
      alert('エラーが発生しました。しばらく時間をおいてからお試しください。')
    } finally {
      setUpgradeLoading(null)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('サブスクリプションをキャンセルしますか？')) return

    try {
      const response = await fetch('/api/user/cancel-subscription', {
        method: 'POST'
      })

      if (response.ok) {
        await fetchSubscription()
        alert('サブスクリプションをキャンセルしました。')
      } else {
        throw new Error('キャンセルに失敗しました')
      }
    } catch (error) {
      console.error('Cancel error:', error)
      alert('エラーが発生しました。')
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isLoaded || loading) {
    return (
      <DashboardLayout title="サブスクリプション管理" description="プラン管理">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  const currentPlan = subscription?.plan || 'FREE'
  const isActive = subscription?.subscriptionStatus === 'ACTIVE'

  return (
    <DashboardLayout title="サブスクリプション管理" description="プラン管理とアップグレード">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 現在のプラン状況 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">現在のプラン</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {currentPlan === 'FREE' && <Crown className="w-6 h-6 text-gray-500" />}
              {currentPlan === 'BASIC' && <Star className="w-6 h-6 text-blue-500" />}
              {currentPlan === 'PREMIUM' && <Sparkles className="w-6 h-6 text-purple-500" />}
              
              <div>
                <h3 className="font-medium text-gray-900">
                  {currentPlan === 'FREE' && '無料プラン'}
                  {currentPlan === 'BASIC' && 'ベーシックプラン'}
                  {currentPlan === 'PREMIUM' && 'プレミアムプラン'}
                </h3>
                <p className="text-sm text-gray-500">
                  {currentPlan === 'FREE' && '基本機能のみ利用可能'}
                  {currentPlan === 'BASIC' && `¥1,650/月 - ${isActive ? '有効' : '無効'}`}
                  {currentPlan === 'PREMIUM' && `¥5,500/月 - ${isActive ? '有効' : '無効'}`}
                </p>
              </div>
            </div>
            
            {currentPlan !== 'FREE' && (
              <div className="text-right">
                {subscription?.planExpiresAt && (
                  <p className="text-sm text-gray-500">
                    次回更新: {new Date(subscription.planExpiresAt).toLocaleDateString('ja-JP')}
                  </p>
                )}
                <button
                  onClick={handleCancelSubscription}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  キャンセル
                </button>
              </div>
            )}
          </div>
        </div>

        {/* プラン比較 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 無料プラン */}
          <div className={`bg-white rounded-xl shadow-sm border-2 p-6 ${
            currentPlan === 'FREE' ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-gray-200'
          }`}>
            <div className="text-center mb-6">
              <Crown className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-gray-900">無料プラン</h3>
              <div className="text-3xl font-bold text-gray-900 mt-2">¥0</div>
              <div className="text-gray-500">/ 月</div>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                AI基礎学部のみアクセス
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                基本的な学習コンテンツ
              </li>
              <li className="flex items-center">
                <X className="w-5 h-5 text-red-500 mr-3" />
                セミナー参加
              </li>
              <li className="flex items-center">
                <X className="w-5 h-5 text-red-500 mr-3" />
                コミュニティアクセス
              </li>
            </ul>
            
            {currentPlan === 'FREE' ? (
              <div className="w-full bg-gray-100 text-gray-500 py-3 px-4 rounded-lg text-center font-medium">
                現在のプラン
              </div>
            ) : (
              <button
                disabled
                className="w-full bg-gray-100 text-gray-500 py-3 px-4 rounded-lg font-medium cursor-not-allowed"
              >
                ダウングレード不可
              </button>
            )}
          </div>

          {/* ベーシックプラン */}
          <div className={`bg-white rounded-xl shadow-sm border-2 p-6 relative ${
            currentPlan === 'BASIC' ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-blue-500'
          }`}>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                おすすめ
              </span>
            </div>
            
            <div className="text-center mb-6">
              <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-gray-900">ベーシックプラン</h3>
              <div className="text-3xl font-bold text-gray-900 mt-2">¥1,650</div>
              <div className="text-gray-500">/ 月</div>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                全学部アクセス
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                実践的な課題
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                セミナー参加
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                コミュニティアクセス
              </li>
            </ul>
            
            {currentPlan === 'BASIC' ? (
              <div className="w-full bg-blue-100 text-blue-700 py-3 px-4 rounded-lg text-center font-medium">
                現在のプラン
              </div>
            ) : (
              <button
                onClick={() => handleUpgrade('basic')}
                disabled={upgradeLoading === 'basic'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {upgradeLoading === 'basic' ? '処理中...' : 
                 currentPlan === 'PREMIUM' ? 'ダウングレード' : 'アップグレード'}
              </button>
            )}
          </div>

          {/* プレミアムプラン */}
          <div className={`bg-white rounded-xl shadow-sm border-2 p-6 ${
            currentPlan === 'PREMIUM' ? 'border-purple-500 ring-2 ring-purple-500 ring-opacity-20' : 'border-purple-500'
          }`}>
            <div className="text-center mb-6">
              <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-gray-900">プレミアムプラン</h3>
              <div className="text-3xl font-bold text-gray-900 mt-2">¥5,500</div>
              <div className="text-gray-500">/ 月</div>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                全学部アクセス
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                1on1メンタリング
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                優先セミナー参加
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                修了証明書発行
              </li>
            </ul>
            
            {currentPlan === 'PREMIUM' ? (
              <div className="w-full bg-purple-100 text-purple-700 py-3 px-4 rounded-lg text-center font-medium">
                現在のプラン
              </div>
            ) : (
              <button
                onClick={() => handleUpgrade('premium')}
                disabled={upgradeLoading === 'premium'}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {upgradeLoading === 'premium' ? '処理中...' : 'アップグレード'}
              </button>
            )}
          </div>
        </div>

        {/* 請求履歴 */}
        {currentPlan !== 'FREE' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">請求履歴</h2>
            <div className="text-gray-500 text-center py-8">
              請求履歴はStripeダッシュボードでご確認いただけます。
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}