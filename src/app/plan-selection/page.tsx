'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export default function PlanSelection() {
  const { user } = useUser()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | null>(null)
  const [loading, setLoading] = useState(false)

  const plans = [
    {
      id: 'basic' as const,
      name: 'ベーシックプラン',
      price: '¥1,650',
      period: '月',
      description: 'AI学習の基礎を身につける',
      features: [
        'AI基礎学部（全コンテンツ）',
        '業務効率化学部（全コンテンツ）',
        '基本セミナー参加権',
        'コミュニティアクセス',
        '学習進捗管理'
      ],
      departments: ['AI基礎学部', '業務効率化学部'],
      recommended: false
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
      departments: ['AI基礎学部', '業務効率化学部', 'データサイエンス学部', 'AI開発学部', 'ビジネスAI学部'],
      recommended: true
    }
  ]

  const handlePlanSelect = async (planId: 'basic' | 'premium') => {
    setLoading(true)
    setSelectedPlan(planId)

    try {
      // ここでプラン情報をユーザーメタデータに保存
      await user?.update({
        publicMetadata: {
          plan: planId,
          departments: plans.find(p => p.id === planId)?.departments || []
        }
      })

      // ダッシュボードにリダイレクト
      router.push('/dashboard')
    } catch (error) {
      console.error('Plan selection error:', error)
    } finally {
      setLoading(false)
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
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
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">プランに含まれるもの：</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Departments */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">アクセス可能な学部：</h4>
                <div className="flex flex-wrap gap-2">
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

              {/* CTA Button */}
              <button
                onClick={() => handlePlanSelect(plan.id)}
                disabled={loading && selectedPlan === plan.id}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  plan.recommended
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                } disabled:opacity-50`}
              >
                {loading && selectedPlan === plan.id ? '選択中...' : `${plan.name}を選択`}
              </button>
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
    </div>
  )
}