'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const pathname = usePathname()

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50 glass-effect">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            href={isAuthenticated ? "/dashboard" : "/"} 
            className="flex items-center space-x-3 hover-lift"
            title={isAuthenticated ? "ダッシュボードに移動" : "ホームに移動"}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">は</span>
            </div>
            <span className="text-xl font-bold text-gradient-blue hidden sm:block">
              はじめて.AI
            </span>
          </Link>

          <div className="flex items-center space-x-2">
            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="メニューを開く"
            >
              {showMobileMenu ? <X size={14} /> : <Menu size={14} />}
            </button>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && (
                <>
                  {/* Main Navigation Links */}
                  <nav className="flex items-center space-x-4 mr-4">
                    <Link 
                      href="/videos" 
                      className={`transition-colors font-medium text-sm ${
                        pathname.startsWith('/videos') 
                          ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      動画
                    </Link>
                    <Link 
                      href="/seminars" 
                      className={`transition-colors font-medium text-sm ${
                        pathname.startsWith('/seminars') 
                          ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      セミナー
                    </Link>
                    {user?.plan === 'premium' && (
                      <Link 
                        href="/live" 
                        className={`transition-colors font-medium text-sm ${
                          pathname.startsWith('/live') 
                            ? 'text-purple-600 border-b-2 border-purple-600 pb-1' 
                            : 'text-purple-700 hover:text-purple-600'
                        }`}
                      >
                        ライブ
                      </Link>
                    )}
                  </nav>
                </>
              )}
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
                  <span className="text-sm text-gray-600 hidden lg:block">
                    {user?.plan === 'premium' && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs mr-2">プレミアム</span>}
                    {user?.plan === 'basic' && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2">ベーシック</span>}
                    {user?.firstName} {user?.lastName}
                  </span>
                
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                      {user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link 
                        href="/dashboard" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        ダッシュボード
                      </Link>
                      <Link 
                        href="/plan-selection" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        プラン変更
                      </Link>
                      <Link 
                        href="/videos" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        動画一覧
                      </Link>
                      <Link 
                        href="/seminars" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        セミナー
                      </Link>
                      <Link 
                        href="/favorites" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        お気に入り
                      </Link>
                      {isAdmin() && (
                        <>
                          <hr className="my-1" />
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            管理機能
                          </div>
                          <Link 
                            href="/admin/dashboard" 
                            className="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-50"
                            onClick={() => setShowDropdown(false)}
                          >
                            📊 分析ダッシュボード
                          </Link>
                          <Link 
                            href="/admin/users" 
                            className="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-50"
                            onClick={() => setShowDropdown(false)}
                          >
                            👥 ユーザー管理
                          </Link>
                          <Link 
                            href="/admin/videos" 
                            className="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-50"
                            onClick={() => setShowDropdown(false)}
                          >
                            📹 動画管理
                          </Link>
                          <Link 
                            href="/admin/livestream" 
                            className="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-50"
                            onClick={() => setShowDropdown(false)}
                          >
                            🔴 ライブ配信管理
                          </Link>
                          <Link 
                            href="/cms" 
                            className="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-50"
                            onClick={() => setShowDropdown(false)}
                          >
                            ⚙️ CMS管理
                          </Link>
                        </>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          logout()
                          setShowDropdown(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                      >
                        ログアウト
                      </button>
                    </div>
                  )}
                </div>
              </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/sign-in">
                    <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                      ログイン
                    </button>
                  </Link>
                  <Link href="/sign-up">
                    <button className="schoo-btn-primary text-sm">
                      無料で始める
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile user avatar (always visible on mobile when authenticated) */}
            {isAuthenticated && (
              <div className="md:hidden">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-200 py-2">
            {isAuthenticated ? (
              <div className="space-y-1">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.plan === 'premium' && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">プレミアム</span>}
                    {user?.plan === 'basic' && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">ベーシック</span>}
                    {user?.plan === 'free' && <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">フリー</span>}
                  </div>
                </div>
                <Link 
                  href="/dashboard" 
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  📊 ダッシュボード
                </Link>
                <Link 
                  href="/videos" 
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  🎥 動画一覧
                </Link>
                <Link 
                  href="/seminars" 
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  📚 セミナー
                </Link>
                <Link 
                  href="/favorites" 
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  ❤️ お気に入り
                </Link>
                <Link 
                  href="/plan-selection" 
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  💎 プラン変更
                </Link>
                {isAdmin() && (
                  <>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                      管理機能
                    </div>
                    <Link 
                      href="/admin/dashboard" 
                      className="block px-4 py-3 text-purple-700 hover:bg-purple-50 border-b border-gray-100"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      📊 分析ダッシュボード
                    </Link>
                    <Link 
                      href="/admin/users" 
                      className="block px-4 py-3 text-purple-700 hover:bg-purple-50 border-b border-gray-100"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      👥 ユーザー管理
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    logout()
                    setShowMobileMenu(false)
                  }}
                  className="block w-full text-left px-4 py-3 text-red-700 hover:bg-red-50"
                >
                  🚪 ログアウト
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link 
                  href="/sign-in"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  🔐 ログイン
                </Link>
                <Link 
                  href="/sign-up"
                  className="block px-4 py-3 text-blue-600 font-medium hover:bg-blue-50"
                  onClick={() => setShowMobileMenu(false)}
                >
                  🚀 無料で始める
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}