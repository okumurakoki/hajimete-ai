'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, 
  X, 
  Search, 
  User, 
  Settings, 
  BarChart3, 
  BookOpen, 
  Users, 
  Bell,
  ChevronDown,
  LogOut,
  UserCircle,
  Crown,
  Moon,
  Sun,
  Calendar
} from 'lucide-react'
import GlobalSearch from '@/components/search/GlobalSearch'
import { useTheme } from '@/contexts/ThemeContext'

interface HeaderProps {
  className?: string
}

export default function Header({ className = '' }: HeaderProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <HeaderWithoutTheme className={className} />
  }

  return <HeaderWithTheme className={className} />
}

function HeaderWithoutTheme({ className }: { className: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const pathname = usePathname()

  // ナビゲーションアイテム
  const navigationItems = [
    {
      name: 'ダッシュボード',
      href: '/dashboard',
      icon: BarChart3,
      description: 'メインダッシュボード'
    },
    {
      name: 'コース',
      href: '/courses',
      icon: BookOpen,
      description: 'コース一覧'
    },
    {
      name: 'セミナー',
      href: '/seminars',
      icon: Users,
      description: 'ライブセミナー'
    },
    {
      name: 'AI講座申し込み',
      href: '/courses/live',
      icon: Calendar,
      description: 'ライブAI講座申し込み'
    },
    {
      name: '検索',
      href: '/search',
      icon: Search,
      description: '高度な検索'
    }
  ]

  // 管理者メニュー
  const adminItems = [
    {
      name: '管理者',
      href: '/admin',
      icon: Settings,
      description: '管理者ダッシュボード'
    }
  ]

  // ユーザーメニュー
  const userMenuItems = [
    {
      name: 'プロフィール',
      href: '/profile',
      icon: UserCircle,
      description: 'プロフィール設定'
    },
    {
      name: 'サブスクリプション',
      href: '/subscription',
      icon: Crown,
      description: 'プラン管理'
    },
    {
      name: '設定',
      href: '/settings',
      icon: Settings,
      description: 'アカウント設定'
    }
  ]

  // アクティブリンクかどうかの判定
  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <header className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">はじめて.AI</span>
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActiveLink(item.href)
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                title={item.description}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            ))}
            
            {/* 管理者メニュー */}
            {adminItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActiveLink(item.href)
                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                title={item.description}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 検索バー（デスクトップ） */}
          <div className="hidden lg:block flex-1 max-w-lg mx-8">
            <GlobalSearch 
              placeholder="コース、セミナーを検索..." 
              size="sm"
            />
          </div>

          {/* 右側メニュー */}
          <div className="flex items-center space-x-4">
            {/* ダークモード切り替えボタン (SSR時は表示しない) */}
            <div className="w-10 h-10" />

            {/* 通知ベル */}
            <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {/* 通知バッジ */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </button>

            {/* ユーザーメニュー */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* ユーザードロップダウン */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50">
                  {/* ユーザー情報 */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">田中太郎</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Premium会員</div>
                      </div>
                    </div>
                  </div>

                  {/* メニューアイテム */}
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                      </div>
                    </Link>
                  ))}

                  <hr className="my-1 border-gray-200 dark:border-gray-600" />

                  {/* ログアウト */}
                  <button className="w-full flex items-center px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <LogOut className="w-4 h-4 mr-3" />
                    ログアウト
                  </button>
                </div>
              )}
            </div>

            {/* モバイルメニューボタン */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* モバイル検索バー */}
        <div className="lg:hidden py-3 border-t border-gray-200 dark:border-gray-700">
          <GlobalSearch 
            placeholder="コース、セミナーを検索..." 
            size="sm"
          />
        </div>
      </div>

      {/* モバイルメニュー */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActiveLink(item.href)
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
            
            {/* 管理者メニュー（モバイル） */}
            {adminItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActiveLink(item.href)
                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 背景オーバーレイ（ユーザーメニューが開いている時） */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  )
}

function HeaderWithTheme({ className }: { className: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const { toggleMode, isDark } = useTheme()

  // ナビゲーションアイテム
  const navigationItems = [
    {
      name: 'ダッシュボード',
      href: '/dashboard',
      icon: BarChart3,
      description: 'メインダッシュボード'
    },
    {
      name: 'コース',
      href: '/courses',
      icon: BookOpen,
      description: 'コース一覧'
    },
    {
      name: 'セミナー',
      href: '/seminars',
      icon: Users,
      description: 'ライブセミナー'
    },
    {
      name: 'AI講座申し込み',
      href: '/courses/live',
      icon: Calendar,
      description: 'ライブAI講座申し込み'
    },
    {
      name: '検索',
      href: '/search',
      icon: Search,
      description: '高度な検索'
    }
  ]

  // 管理者メニュー
  const adminItems = [
    {
      name: '管理者',
      href: '/admin',
      icon: Settings,
      description: '管理者ダッシュボード'
    }
  ]

  // ユーザーメニュー
  const userMenuItems = [
    {
      name: 'プロフィール',
      href: '/profile',
      icon: UserCircle,
      description: 'プロフィール設定'
    },
    {
      name: 'サブスクリプション',
      href: '/subscription',
      icon: Crown,
      description: 'プラン管理'
    },
    {
      name: '設定',
      href: '/settings',
      icon: Settings,
      description: 'アカウント設定'
    }
  ]

  // アクティブリンクかどうかの判定
  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <header className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">はじめて.AI</span>
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActiveLink(item.href)
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                title={item.description}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            ))}
            
            {/* 管理者メニュー */}
            {adminItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActiveLink(item.href)
                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                title={item.description}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 検索バー（デスクトップ） */}
          <div className="hidden lg:block flex-1 max-w-lg mx-8">
            <GlobalSearch 
              placeholder="コース、セミナーを検索..." 
              size="sm"
            />
          </div>

          {/* 右側メニュー */}
          <div className="flex items-center space-x-4">
            {/* ダークモード切り替えボタン */}
            <button
              onClick={toggleMode}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              title="テーマ切り替え"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* 通知ベル */}
            <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {/* 通知バッジ */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </button>

            {/* ユーザーメニュー */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* ユーザードロップダウン */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50">
                  {/* ユーザー情報 */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">田中太郎</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Premium会員</div>
                      </div>
                    </div>
                  </div>

                  {/* メニューアイテム */}
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                      </div>
                    </Link>
                  ))}

                  <hr className="my-1 border-gray-200 dark:border-gray-600" />

                  {/* ログアウト */}
                  <button className="w-full flex items-center px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <LogOut className="w-4 h-4 mr-3" />
                    ログアウト
                  </button>
                </div>
              )}
            </div>

            {/* モバイルメニューボタン */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* モバイル検索バー */}
        <div className="lg:hidden py-3 border-t border-gray-200 dark:border-gray-700">
          <GlobalSearch 
            placeholder="コース、セミナーを検索..." 
            size="sm"
          />
        </div>
      </div>

      {/* モバイルメニュー */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActiveLink(item.href)
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
            
            {/* 管理者メニュー（モバイル） */}
            {adminItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActiveLink(item.href)
                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 背景オーバーレイ（ユーザーメニューが開いている時） */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  )
}