'use client'

import Link from 'next/link'
import { useUser, UserButton, SignInButton } from '@clerk/nextjs'
import { useState } from 'react'
import { Menu, X, BookOpen, Play, Calendar, Radio, Settings } from 'lucide-react'

export default function Header() {
  const { isSignedIn, user } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // ユーザーのプランを取得
  const userPlan = user?.publicMetadata?.plan as string
  const userDepartments = user?.publicMetadata?.departments as string[] || []

  const navigation = [
    {
      name: 'ダッシュボード',
      href: '/dashboard',
      icon: BookOpen,
      show: isSignedIn
    },
    {
      name: '動画',
      href: '/videos',
      icon: Play,
      show: isSignedIn
    },
    {
      name: 'セミナー',
      href: '/seminars',
      icon: Calendar,
      show: isSignedIn
    },
    {
      name: 'ライブ配信',
      href: '/live',
      icon: Radio,
      show: isSignedIn && userPlan === 'premium'
    },
    {
      name: '管理',
      href: '/admin/dashboard',
      icon: Settings,
      show: isSignedIn && user?.publicMetadata?.role === 'admin'
    }
  ]

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50 glass-effect">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <Link href="/" className="flex items-center space-x-3 hover-lift">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">は</span>
            </div>
            <span className="text-xl font-bold text-gradient-blue hidden sm:block">
              はじめて.AI
            </span>
          </Link>
          
          {/* デスクトップナビゲーション */}
          {isSignedIn && (
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.filter(item => item.show).map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          )}

          {/* 右側のアクション */}
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                {/* プラン表示 */}
                {userPlan && (
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    userPlan === 'premium' 
                      ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200' 
                      : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200'
                  }`}>
                    {userPlan === 'premium' ? '⭐ プレミアム' : '🎓 ベーシック'}
                  </div>
                )}
                
                {/* モバイルメニューボタン */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {isMobileMenuOpen ? (
                    <X size={20} className="text-gray-600" />
                  ) : (
                    <Menu size={20} className="text-gray-600" />
                  )}
                </button>

                {/* ユーザーボタン */}
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-9 h-9 rounded-full border-2 border-gray-200 hover:border-blue-300 transition-colors',
                      userButtonPopoverCard: 'shadow-xl border border-gray-200',
                      userButtonPopoverActionButton: 'hover:bg-gray-50'
                    }
                  }}
                  userProfileProps={{
                    appearance: {
                      elements: {
                        rootBox: 'bg-white rounded-xl shadow-xl'
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <SignInButton mode="modal">
                  <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    ログイン
                  </button>
                </SignInButton>
                <Link href="/sign-up">
                  <button className="schoo-btn-primary text-sm">
                    無料で始める
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* モバイルメニュー */}
        {isMobileMenuOpen && isSignedIn && (
          <div className="md:hidden py-4 border-t border-gray-100 fade-in">
            <nav className="space-y-2">
              {navigation.filter(item => item.show).map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}