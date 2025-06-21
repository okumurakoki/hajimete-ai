'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { jaJP } from '@clerk/localizations'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export const dynamic = 'force-dynamic'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // グローバルエラーハンドラー - Chrome拡張機能エラーを抑制
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.message.includes('message channel closed') ||
          event.message.includes('Extension context invalidated') ||
          event.filename?.includes('chrome-extension')) {
        event.preventDefault()
        console.warn('Chrome extension error suppressed:', event.message)
        return true
      }
    }

    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      if (reason?.message?.includes('message channel closed') ||
          reason?.message?.includes('Extension context invalidated') ||
          reason?.stack?.includes('chrome-extension')) {
        event.preventDefault()
        console.warn('Chrome extension promise rejection suppressed:', reason?.message)
      }
    }

    // Clerkの初期化エラーも処理
    const handleClerkError = (event: ErrorEvent) => {
      if (event.message.includes('ClerkJS') || 
          event.message.includes('clerk') ||
          event.error?.name === 'ClerkRuntimeError') {
        console.warn('Clerk initialization error, retrying...', event.message)
        // 少し遅延してからリロードを試行
        setTimeout(() => {
          if (!window.location.pathname.includes('/sign-')) {
            window.location.reload()
          }
        }, 1000)
      }
    }

    window.addEventListener('error', handleGlobalError)
    window.addEventListener('error', handleClerkError)
    window.addEventListener('unhandledrejection', handlePromiseRejection)

    return () => {
      window.removeEventListener('error', handleGlobalError)
      window.removeEventListener('error', handleClerkError)
      window.removeEventListener('unhandledrejection', handlePromiseRejection)
    }
  }, [])

  // マウント前は基本的なレンダリングのみ
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <ClerkProvider localization={jaJP}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </ClerkProvider>
  )
}