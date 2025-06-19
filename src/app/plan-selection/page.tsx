'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import StripeCheckout from '@/components/StripeCheckout'

export const dynamic = 'force-dynamic'

export default function PlanSelection() {
  const { user, isAuthenticated, updatePlan } = useAuth()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'basic' | 'premium' | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [loading, setLoading] = useState(false)

  const plans = [
    {
      id: 'free' as const,
      name: '無料プラン',
      price: '¥0',
      period: '月',
      description: 'まずは無料で始める',
      features: [
        'AI基礎学部（一部コンテンツ）',
        '基本動画視聴',
        'コミュニティアクセス',
        '学習進捗管理',
        '',
        '',
        ''
      ],
      departments: ['AI基礎学部（限定）'],
      recommended: false,
      isFree: true
    },
    {
      id: 'basic' as const,
      name: 'ベーシックプラン',
      price: '¥1,650',
      period: '月',
      description: 'AI学習の基礎を身につける',
      features: [
        'AI基礎学部（全コンテンツ）',
        '実践活用学部（全コンテンツ）',
        '基本セミナー参加権',
        'コミュニティアクセス',
        '学習進捗管理',
        'メール質問サポート',
        ''
      ],
      departments: ['AI基礎学部', '実践活用学部'],
      recommended: false,
      isFree: false
    },
    {
      id: 'premium' as const,
      name: 'プレミアムプラン',
      price: '¥5,500',
      period: '月',
      description: '全てのコンテンツにアクセス',
      features: [
        '全学部コンテンツアクセス',
        'ライブ配信視聴権',
        'プレミアムセミナー参加',
        '個別質問・サポート',
        '先行コンテンツアクセス',
        'ダウンロード機能',
        '修了証書発行'
      ],
      departments: ['全学部アクセス可能'],
      recommended: true,
      isFree: false
    }
  ]

  const handlePlanSelect = async (planId: 'free' | 'basic' | 'premium') => {
    if (!isAuthenticated) {
      router.push('/sign-up')
      return
    }
    
    setSelectedPlan(planId)
    
    if (planId === 'free') {
      // 無料プランは即座に適用
      setLoading(true)
      try {
        updatePlan(planId)
        alert('無料プランが適用されました！')
        router.push('/dashboard')
      } catch (error) {
        alert('プラン変更に失敗しました。もう一度お試しください。')
      } finally {
        setLoading(false)
      }
    } else {
      // 有料プランはStripe決済を表示
      setShowCheckout(true)
    }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="text-2xl font-bold text-blue-600">はじめて.AI</div>
            <div className="text-sm text-gray-600">
              こんにちは、{user?.firstName}さん
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            学習プランを選択してください
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            あなたの学習目標に合ったプランをお選びください
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg p-8 flex flex-col h-full ${
                plan.recommended ? 'ring-2 ring-blue-500 transform scale-105' : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    おすすめ
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">/{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-8 flex-grow">
                <h4 className="font-semibold text-gray-900 mb-4">プランに含まれるもの：</h4>
                <ul className="space-y-3 mb-8 min-h-[210px]">
                  {plan.features.filter(feature => feature.trim() !== '').map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Departments */}
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-4">アクセス可能な学部：</h4>
                  <div className="flex flex-wrap gap-2 min-h-[60px]">
                    {plan.departments.map((dept, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-auto">
                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={loading && selectedPlan === plan.id}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    plan.recommended
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : plan.isFree 
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                  } disabled:opacity-50`}
                >
                  {loading && selectedPlan === plan.id 
                    ? '処理中...' 
                    : plan.isFree 
                      ? '無料で始める' 
                      : `${plan.name}を選択`
                  }
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Trial Info */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            全てのプランで<span className="font-semibold">7日間の無料体験</span>が利用できます
          </p>
          <p className="text-sm text-gray-500 mt-2">
            体験期間中はいつでもキャンセル可能です
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">よくある質問</h3>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">プランの変更は可能ですか？</h4>
              <p className="text-gray-600">
                はい、いつでもプランの変更が可能です。アップグレードは即座に反映され、ダウングレードは次の更新日から適用されます。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">学部とは何ですか？</h4>
              <p className="text-gray-600">
                学部は学習テーマごとに分かれたコンテンツグループです。AI基礎学部では基本概念、業務効率化学部では実践的な活用方法を学べます。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">ライブ配信とは？</h4>
              <p className="text-gray-600">
                プレミアムプラン限定で、専門家によるリアルタイムセミナーに参加できます。質問も直接可能です。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe決済モーダル */}
      {showCheckout && selectedPlan && selectedPlan !== 'free' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                プラン加入手続き
              </h3>
              <p className="text-gray-600">
                {plans.find(p => p.id === selectedPlan)?.name}の決済を行います
              </p>
            </div>
            
            <div className="mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-900">
                  {plans.find(p => p.id === selectedPlan)?.price}
                </div>
                <div className="text-gray-600">月額料金</div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <StripeCheckout
                seminarId={`plan-${selectedPlan}`}
                seminarTitle={plans.find(p => p.id === selectedPlan)?.name || ''}
                seminarDescription={plans.find(p => p.id === selectedPlan)?.description || ''}
                amount={selectedPlan === 'basic' ? 1650 : 5500}
                userPlan={selectedPlan}
                currency="jpy"
              >
                決済手続きを開始
              </StripeCheckout>
              
              <button
                onClick={() => setShowCheckout(false)}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}