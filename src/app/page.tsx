'use client'

import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { DEPARTMENTS } from '@/lib/departments'
import { Play, Users, BookOpen, Star, ChevronRight, TrendingUp, Clock, Award } from 'lucide-react'

export default function HomePage() {
  const { isSignedIn, user } = useUser()
  const userPlan = user?.unsafeMetadata?.plan as string

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
        <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 text-white overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full"></div>
          </div>
          
          <div className="relative container mx-auto px-4 py-20 lg:py-32">
            <div className="max-w-4xl mx-auto text-center fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                AIを学ぶなら
                <br />
                <span className="text-yellow-300">はじめて.AI</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-blue-100 leading-relaxed">
                日本最大級のAI学習プラットフォーム
                <br />
                基礎から実践まで、あなたのペースで学べる
              </p>
              
              {isSignedIn ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard" className="schoo-btn-primary bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                    ダッシュボードへ
                  </Link>
                  <Link href="/videos" className="schoo-btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                    動画を見る
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/sign-up" className="schoo-btn-primary bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                    無料で始める
                  </Link>
                  <Link href="/plan-selection" className="schoo-btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                    プランを見る
                  </Link>
                </div>
              )}
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
                      <Icon size={28} />
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
              {DEPARTMENTS.map((dept, index) => (
                <Link 
                  key={dept.id} 
                  href={isSignedIn ? `/${dept.slug}` : '/sign-up'}
                  className="group"
                >
                  <div className={`schoo-card h-full p-8 ${dept.plan === 'premium' ? 'schoo-card-premium' : ''} slide-up`} 
                       style={{ animationDelay: `${index * 0.2}s` }}>
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl ${
                        dept.id === 'ai-basics' ? 'dept-ai-basics' :
                        dept.id === 'productivity' ? 'dept-productivity' :
                        dept.id === 'practical-application' ? 'dept-practical' :
                        'dept-catchup'
                      }`}>
                        {dept.icon}
                      </div>
                      
                      {dept.plan === 'premium' && (
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          ⭐ プレミアム
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
                      <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
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
                      <Icon size={32} />
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
                {isSignedIn 
                  ? `${user?.firstName}さん、今日も新しいことを学びましょう！`
                  : '無料プランから始めて、AIの世界への第一歩を踏み出そう'
                }
              </p>
              
              {isSignedIn ? (
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
                  <Link href="/sign-up" className="schoo-btn-primary bg-white text-blue-600 hover:bg-gray-100">
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