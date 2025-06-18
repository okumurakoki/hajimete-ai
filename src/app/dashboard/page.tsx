'use client'

import { useUser } from '@clerk/nextjs'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { DEPARTMENTS } from '@/lib/departments'
import Link from 'next/link'
import { BookOpen, Play, Calendar, TrendingUp, Award, Clock, ChevronRight } from 'lucide-react'

export default function Dashboard() {
  const { user } = useUser()
  const userPlan = user?.unsafeMetadata?.plan as string || 'basic'
  
  const accessibleDepartments = userPlan === 'premium' 
    ? DEPARTMENTS 
    : DEPARTMENTS.filter(dept => dept.plan === 'basic')

  const quickStats = [
    {
      title: '学習時間',
      value: '24時間',
      change: '+5時間',
      icon: Clock,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: '完了コース',
      value: '12コース',
      change: '+3コース',
      icon: BookOpen,
      color: 'text-green-600 bg-green-50'
    },
    {
      title: '視聴動画',
      value: '48本',
      change: '+8本',
      icon: Play,
      color: 'text-orange-600 bg-orange-50'
    },
    {
      title: '学習ランク',
      value: 'B+',
      change: '前月比',
      icon: Award,
      color: 'text-purple-600 bg-purple-50'
    }
  ]

  const recentVideos = [
    {
      title: 'ChatGPT API完全活用ガイド',
      duration: '45分',
      progress: 65,
      department: 'AI基礎学部'
    },
    {
      title: 'Excel×AI で業務効率10倍アップ',
      duration: '38分',
      progress: 90,
      department: '業務効率化学部'
    },
    {
      title: 'Python×AI入門講座',
      duration: '52分',
      progress: 30,
      department: '実践応用学部'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 fade-in">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            おかえりなさい、{user?.firstName || 'ユーザー'}さん！
          </h1>
          <p className="text-lg text-gray-600">
            今日も新しいAIスキルを身につけましょう 🚀
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="schoo-card p-4 slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 mb-1">{stat.title}</div>
                <div className="text-xs text-green-600 font-medium">{stat.change}</div>
              </div>
            )
          })}
        </div>

        {/* Plan Info */}
        <div className={`rounded-xl p-6 text-white mb-8 slide-up ${
          userPlan === 'premium' 
            ? 'bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800' 
            : 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-bold">
                  {userPlan === 'premium' ? '⭐ プレミアムプラン' : '🎓 ベーシックプラン'}
                </h2>
              </div>
              <p className="opacity-90">
                {accessibleDepartments.length}個の学部にアクセス可能
                {userPlan === 'premium' && ' • ライブ配信視聴可能'}
              </p>
            </div>
            {userPlan === 'basic' && (
              <Link href="/plan-selection">
                <button className="schoo-btn-premium text-sm">
                  プランをアップグレード
                </button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Accessible Departments */}
            <div className="fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">学部別コンテンツ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accessibleDepartments.map((dept, index) => (
                  <Link key={dept.id} href={`/${dept.slug}`} className="group">
                    <div className={`schoo-card p-6 h-full ${dept.plan === 'premium' ? 'schoo-card-premium' : ''} slide-up`}
                         style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                          dept.id === 'ai-basics' ? 'dept-ai-basics' :
                          dept.id === 'productivity' ? 'dept-productivity' :
                          dept.id === 'practical-application' ? 'dept-practical' :
                          'dept-catchup'
                        }`}>
                          {dept.icon}
                        </div>
                        {dept.plan === 'premium' && (
                          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                            プレミアム
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {dept.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {dept.description}
                      </p>
                      
                      <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                        コンテンツを見る
                        <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Continue Learning */}
            <div className="fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">学習を続ける</h2>
              <div className="space-y-4">
                {recentVideos.map((video, index) => (
                  <div key={index} className="schoo-card p-4 hover-lift">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                        <Play size={16} className="text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{video.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{video.department}</span>
                          <span>•</span>
                          <span>{video.duration}</span>
                          <span>•</span>
                          <span className="text-blue-600">{video.progress}% 完了</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${video.progress}%` }}
                          />
                        </div>
                      </div>
                      <button className="schoo-btn-secondary text-sm">
                        続きを見る
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="schoo-card p-6 fade-in">
              <h3 className="font-bold text-gray-900 mb-4">クイックアクション</h3>
              <div className="space-y-3">
                <Link href="/videos" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <Play size={16} />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-blue-600">動画を見る</span>
                </Link>
                
                <Link href="/seminars" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                    <Calendar size={16} />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-green-600">セミナー予約</span>
                </Link>
                
                {userPlan === 'premium' && (
                  <Link href="/live" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                      <TrendingUp size={16} />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-orange-600">ライブ配信</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Learning Goal */}
            <div className="schoo-card p-6 fade-in">
              <h3 className="font-bold text-gray-900 mb-4">今月の目標</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">学習時間</span>
                    <span className="font-medium">24 / 30時間</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">動画視聴</span>
                    <span className="font-medium">48 / 50本</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade CTA for Basic Users */}
            {userPlan === 'basic' && (
              <div className="schoo-card-premium p-6 fade-in">
                <div className="text-center">
                  <div className="text-3xl mb-3">⭐</div>
                  <h3 className="font-bold text-purple-900 mb-2">プレミアムにアップグレード</h3>
                  <p className="text-purple-700 text-sm mb-4">
                    全学部とライブ配信にアクセス
                  </p>
                  <Link href="/plan-selection">
                    <button className="schoo-btn-premium w-full text-sm">
                      今すぐアップグレード
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}