'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { jaJP } from '@clerk/localizations'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // マウント前はSSR対応でシンプル表示
  if (!mounted) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ClerkProvider localization={jaJP}>
      <ThemeProvider>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </ThemeProvider>
    </ClerkProvider>
  )
}