'use client'

import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [mounted, setMounted] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const pathname = usePathname()

  // ハイドレーションエラーを防ぐ
  useEffect(() => {
    setMounted(true)
  }, [])

  // ローディング状態の処理
  if (!mounted || !isLoaded) {
    return (
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold">
              はじめて.AI
            </Link>
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50 glass-effect">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            href={isSignedIn ? "/dashboard" : "/"} 
            className="flex items-center space-x-3 hover-lift"
            title={isSignedIn ? "ダッシュボードに移動" : "ホームに移動"}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">は</span>
            </div>
            <span className="text-xl font-bold text-gradient-blue hidden sm:block">
              はじめて.AI
            </span>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
              プライバシー
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
              利用規約
            </Link>
            {isSignedIn && (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                  ダッシュボード
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  {user?.firstName || user?.username || 'ユーザー'}さん
                </span>
                <UserButton 
                  afterSignOutUrl="/"
                  userProfileMode="navigation"
                  userProfileUrl="/profile"
                />
              </div>
            ) : (
              <div className="flex gap-2">
                <SignInButton mode="modal">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    サインイン
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    サインアップ
                  </button>
                </SignUpButton>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t bg-white py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors px-4">
                プライバシー
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors px-4">
                利用規約
              </Link>
              {isSignedIn && (
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors px-4">
                  ダッシュボード
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}