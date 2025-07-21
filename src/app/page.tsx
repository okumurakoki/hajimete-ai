'use client'

export const dynamic = 'force-dynamic'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <HomePageContent />
}

function HomePageContent() {
  const { isSignedIn } = useUser()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* ナビゲーション */}
      <Navigation isSignedIn={isSignedIn || false} />
      
      {/* ヒーローセクション */}
      <HeroSection />
      
      {/* 特徴セクション */}
      <FeaturesSection />
      
      {/* 学部紹介セクション */}
      <DepartmentsSection />
      
      {/* 統計セクション */}
      <StatsSection />
      
      {/* 料金プランセクション */}
      <PricingSection />
      
      {/* お客様の声セクション */}
      <TestimonialsSection />
      
      {/* CTAセクション */}
      <CTASection />
      
      {/* フッター */}
      <Footer />
    </div>
  )
}

// ナビゲーションコンポーネント
function Navigation({ isSignedIn }: { isSignedIn: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* ロゴ */}
          <div className="flex items-center">
            <div className="text-2xl mr-2">🤖</div>
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">はじめて.AI</h1>
          </div>

          {/* デスクトップナビゲーション */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              特徴
            </a>
            <a href="#departments" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              学部紹介
            </a>
            <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              料金
            </a>
            
            {isSignedIn ? (
              <a
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                ダッシュボード
              </a>
            ) : (
              <div className="flex items-center space-x-4">
                <a
                  href="/auth/sign-in"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  サインイン
                </a>
                <a
                  href="/auth/sign-up"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  無料で始める
                </a>
              </div>
            )}
          </div>

          {/* モバイルメニューボタン */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium">特徴</a>
              <a href="#departments" className="text-gray-600 hover:text-blue-600 font-medium">学部紹介</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 font-medium">料金</a>
              <a href="/demo" className="text-gray-600 hover:text-blue-600 font-medium">デモ</a>
              {isSignedIn ? (
                <a href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-center">
                  ダッシュボード
                </a>
              ) : (
                <div className="flex flex-col space-y-2">
                  <a href="/auth/sign-in" className="text-gray-600 hover:text-blue-600 font-medium">サインイン</a>
                  <a href="/auth/sign-up" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-center">
                    無料で始める
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// ヒーローセクション
function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            AI学習の
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              新しいスタンダード
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            ChatGPTから実践的なAI活用まで、あなたのペースで学べる包括的なAI学習プラットフォーム。
            <br />
            初心者から上級者まで、段階的にスキルアップできます。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="/auth/sign-up"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
            >
              🚀 今すぐ無料で始める
            </a>
            <a
              href="/about"
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 px-8 py-4 rounded-lg text-lg font-semibold border border-gray-300 dark:border-gray-600 transition-colors shadow-lg hover:shadow-xl"
            >
              📖 詳しく見る
            </a>
          </div>

          {/* 信頼性インジケーター */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <span className="text-2xl mr-2">✅</span>
              <span>無料プランあり</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">⚡</span>
              <span>即座に学習開始</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">🎯</span>
              <span>実践的カリキュラム</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 他のセクション（簡略版）
function FeaturesSection() {
  const features = [
    {
      icon: '🎓',
      title: '段階的学習システム',
      description: '基礎から応用まで、あなたのレベルに合わせて段階的に学習できます。'
    },
    {
      icon: '🔥',
      title: '実践的コンテンツ',
      description: '実際の業務で使えるスキルを身につけられる実践的な学習内容です。'
    },
    {
      icon: '👥',
      title: 'コミュニティサポート',
      description: '同じ目標を持つ仲間と学習し、講師陣からの手厚いサポートを受けられます。'
    }
  ]

  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            なぜはじめて.AIが選ばれるのか
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            効果的なAI学習を実現する特徴
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-8 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DepartmentsSection() {
  return (
    <section id="departments" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            4つの学部で体系的に学習
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            あなたの目標とレベルに合わせて選択できる学習プログラム
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            { icon: '🎓', name: 'AI基礎学部', description: 'ChatGPTの使い方からAIの仕組みまで' },
            { icon: '⚡', name: '業務効率化学部', description: 'ExcelやOfficeツールとAI活用' },
            { icon: '🚀', name: '実践応用学部', description: 'プログラミングとAI開発' },
            { icon: '⭐', name: 'キャッチアップ学部', description: '最新AI技術とトレンド' }
          ].map((dept, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">{dept.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{dept.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{dept.description}</p>
                </div>
              </div>
              <button
                onClick={() => window.location.href = '/auth/sign-up'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                学習を開始する
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  const stats = [
    { value: '1,000+', label: '受講生数' },
    { value: '50+', label: '学習コンテンツ' },
    { value: '95%', label: '満足度' },
    { value: '24/7', label: 'サポート体制' }
  ]

  return (
    <section className="py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            数字で見るはじめて.AI
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-blue-100 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            シンプルで明確な料金プラン
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">無料プラン</h3>
            <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">¥0<span className="text-lg text-gray-600 dark:text-gray-400">/月</span></div>
            <button
              onClick={() => window.location.href = '/auth/sign-up'}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold"
            >
              無料で始める
            </button>
          </div>
          
          <div className="rounded-xl shadow-lg p-8 border-2 border-blue-500 bg-white dark:bg-gray-800 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              おすすめ
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">ベーシックプラン</h3>
            <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">¥3,500<span className="text-lg text-gray-600 dark:text-gray-400">/月</span></div>
            <button
              onClick={() => window.location.href = '/auth/sign-up'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold"
            >
              このプランを選択
            </button>
          </div>
          
          <div className="rounded-xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">プレミアムプラン</h3>
            <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">¥5,500<span className="text-lg text-gray-600 dark:text-gray-400">/月</span></div>
            <button
              onClick={() => window.location.href = '/auth/sign-up'}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold"
            >
              このプランを選択
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            受講生の声
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            { name: '田中 太郎', role: 'マーケティング担当', content: 'ChatGPTを使った業務効率化で、資料作成時間が70%短縮されました。' },
            { name: '佐藤 花子', role: 'データアナリスト', content: 'AI基礎から応用まで体系的に学べて、実際のプロジェクトですぐに活用できています。' },
            { name: '山田 次郎', role: 'フリーランス', content: '無料プランから始めて、今ではクライアントワークでAIを積極的に活用しています。' }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">👨‍💼</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{testimonial.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          今すぐAI学習を始めませんか？
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          無料プランから始めて、あなたのペースでAIスキルを身につけましょう。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/auth/sign-up"
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            🚀 無料で学習開始
          </a>
          <a
            href="/demo"
            className="bg-transparent hover:bg-white/10 text-white border border-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            📺 デモを見る
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-2">🤖</div>
              <h3 className="text-xl font-bold">はじめて.AI</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              AI学習プラットフォーム - 本番環境で動作中
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">学習コンテンツ</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">AI基礎学部</a></li>
              <li><a href="#" className="hover:text-white transition-colors">業務効率化学部</a></li>
              <li><a href="#" className="hover:text-white transition-colors">実践応用学部</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">サポート</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/demo" className="hover:text-white transition-colors">デモ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">お問い合わせ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">法的情報</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">利用規約</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 はじめて.AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}