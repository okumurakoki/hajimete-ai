'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { DEPARTMENTS } from '@/lib/departments'
import { Play, Users, BookOpen, Star, ChevronRight, TrendingUp, Clock, Award, Brain } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  const { isAuthenticated, user } = useAuth()

  const stats = [
    {
      number: '10,000+',
      label: '受講生',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      number: '200+',
      label: '動画コンテンツ',
      icon: Play,
      color: 'text-green-600'
    },
    {
      number: '50+',
      label: 'ライブセミナー',
      icon: BookOpen,
      color: 'text-orange-600'
    },
    {
      number: '4.8',
      label: '満足度評価',
      icon: Star,
      color: 'text-purple-600'
    }
  ]

  const features = [
    {
      title: '実践的なAI学習',
      description: '現場で使えるスキルを体系的に学習',
      icon: TrendingUp,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'ライブセミナー',
      description: '専門家との双方向コミュニケーション',
      icon: Clock,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: '認定証取得',
      description: 'スキル習得の証明書を発行',
      icon: Award,
      color: 'bg-orange-50 text-orange-600'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* ヒーローセクション */}
        <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden min-h-[80vh] flex items-center">
          {/* 背景装飾 */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative container mx-auto px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center lg:text-left lg:flex lg:items-center lg:gap-16">
                <div className="lg:flex-1 fade-in">
                  <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8 border border-white/20">
                    <Star size={14} className="mr-2 text-yellow-300" />
                    日本最大級のAI学習プラットフォーム
                  </div>
                  
                  <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight">
                    AIを学ぶなら
                    <br />
                    <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                      はじめて.AI
                    </span>
                  </h1>
                  
                  <p className="text-xl lg:text-2xl mb-10 text-blue-100 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    基礎から実践まで、あなたのペースで学べる
                    <br className="hidden sm:block" />
                    <span className="text-white font-medium">実践的なAI学習体験</span>
                  </p>
              
                  {isAuthenticated ? (
                    <div className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center">
                      <Link href="/dashboard" className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 inline-flex items-center gap-2 justify-center">
                        <TrendingUp size={19} />
                        ダッシュボードへ
                      </Link>
                      <Link href="/videos" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 inline-flex items-center gap-2 justify-center">
                        <Play size={19} />
                        動画を見る
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center">
                      <Link href="/dashboard" className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 inline-flex items-center gap-2 justify-center">
                        <Star size={19} />
                        無料で始める
                      </Link>
                      <Link href="/plan-selection" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 inline-flex items-center gap-2 justify-center">
                        <Award size={19} />
                        プランを見る
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* 右側のビジュアル要素 */}
                <div className="lg:flex-1 lg:block hidden">
                  <div className="relative">
                    <div className="w-full max-w-md mx-auto">
                      <div className="relative aspect-square">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl backdrop-blur-sm border border-white/20 shadow-2xl"></div>
                        <div className="absolute inset-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                          <Brain size={120} className="text-white/80" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 統計セクション */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center ${stat.color}`}>
                      <Icon size={17} />
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 学部紹介セクション */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 fade-in">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                4つの専門学部で体系的に学ぶ
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                初心者から上級者まで、段階的にAIスキルを身につけられる学部制システム
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {DEPARTMENTS.map((dept, index) => {
                const IconComponent = dept.icon
                return (
                  <Link 
                    key={dept.id} 
                    href={isAuthenticated ? `/${dept.slug}` : '/dashboard'}
                    className="group"
                  >
                    <div className={`schoo-card h-full p-8 ${dept.plan === 'premium' ? 'schoo-card-premium' : ''} slide-up`} 
                         style={{ animationDelay: `${index * 0.2}s` }}>
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${dept.color.secondary} ${dept.color.text}`}>
                          <IconComponent size={19} />
                        </div>
                        
                        {dept.plan === 'premium' && (
                          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                            <Star size={10} />
                            プレミアム
                          </div>
                        )}
                      </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {dept.name}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {dept.description}
                    </p>

                    <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                      <span>詳しく見る</span>
                      <ChevronRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* 特徴セクション */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 fade-in">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                なぜはじめて.AIが選ばれるのか
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="text-center slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${feature.color} flex items-center justify-center`}>
                      <Icon size={19} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto fade-in">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                今すぐAI学習を始めよう
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                {isAuthenticated 
                  ? `${user?.firstName}さん、今日も新しいことを学びましょう！`
                  : '無料プランから始めて、AIの世界への第一歩を踏み出そう'
                }
              </p>
              
              {isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/videos" className="schoo-btn-primary bg-white text-blue-600 hover:bg-gray-100">
                    動画を見る
                  </Link>
                  <Link href="/seminars" className="schoo-btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600">
                    セミナーに参加
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard" className="schoo-btn-primary bg-white text-blue-600 hover:bg-gray-100">
                    無料で始める
                  </Link>
                  <Link href="/plan-selection" className="schoo-btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600">
                    プランを見る
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}