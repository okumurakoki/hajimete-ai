'use client'

import React from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
  className?: string
  headerClassName?: string
  footerClassName?: string
  showHeader?: boolean
  showFooter?: boolean
  containerClassName?: string
}

export default function Layout({
  children,
  className = '',
  headerClassName = '',
  footerClassName = '',
  showHeader = true,
  showFooter = true,
  containerClassName = ''
}: LayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* ヘッダー */}
      {showHeader && (
        <Header className={headerClassName} />
      )}

      {/* メインコンテンツ */}
      <main className={`flex-1 min-h-[calc(100vh-200px)] ${containerClassName}`}>
        <div className="min-h-full">
          {children}
        </div>
      </main>

      {/* フッター */}
      {showFooter && (
        <Footer className={footerClassName} />
      )}
    </div>
  )
}

// レイアウトバリエーション用のコンポーネント

// 管理者レイアウト
export function AdminLayout({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <Layout
      className={className}
      containerClassName="bg-gray-50 dark:bg-gray-900"
      headerClassName="border-b-2 border-purple-200 dark:border-purple-800"
    >
      {children}
    </Layout>
  )
}

// 認証レイアウト（ヘッダー・フッターなし）
export function AuthLayout({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <Layout
      className={`bg-gradient-to-br from-blue-50 to-purple-50 ${className}`}
      showHeader={false}
      showFooter={false}
    >
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </Layout>
  )
}

// フルスクリーンレイアウト
export function FullscreenLayout({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <Layout
      className={className}
      showHeader={false}
      showFooter={false}
      containerClassName="h-screen"
    >
      {children}
    </Layout>
  )
}

// コンテンツ中心レイアウト
export function ContentLayout({ 
  children, 
  className = '',
  maxWidth = 'max-w-7xl',
  padding = 'px-4 sm:px-6 lg:px-8 py-8'
}: { 
  children: React.ReactNode
  className?: string
  maxWidth?: string
  padding?: string
}) {
  return (
    <Layout
      className={className}
      containerClassName="bg-gray-50 dark:bg-gray-900"
    >
      <div className={`${maxWidth} mx-auto ${padding} min-h-[calc(100vh-300px)]`}>
        {children}
      </div>
    </Layout>
  )
}

// ダッシュボードレイアウト
export function DashboardLayout({ 
  children, 
  className = '',
  title,
  description,
  actions
}: { 
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <Layout
      className={className}
      containerClassName="bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-300px)]">
        {/* ページヘッダー */}
        {(title || description || actions) && (
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {(title || description) && (
                <div>
                  {title && (
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
                  )}
                  {description && (
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{description}</p>
                  )}
                </div>
              )}
              {actions && (
                <div className="flex items-center space-x-3">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}

        {/* メインコンテンツ */}
        {children}
      </div>
    </Layout>
  )
}

// 検索レイアウト
export function SearchLayout({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <Layout
      className={className}
      containerClassName="bg-gray-50 dark:bg-gray-900"
    >
      {children}
    </Layout>
  )
}

// エラーレイアウト
export function ErrorLayout({ 
  children, 
  className = '',
  showBackToHome = true
}: { 
  children: React.ReactNode
  className?: string
  showBackToHome?: boolean
}) {
  return (
    <Layout
      className={className}
      containerClassName="bg-gray-50"
    >
      <div className="min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {children}
          {showBackToHome && (
            <div className="mt-8">
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ホームへ戻る
              </a>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}