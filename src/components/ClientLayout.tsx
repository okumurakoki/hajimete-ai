'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { jaJP } from '@clerk/localizations'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { useState, useEffect } from 'react'
import nextDynamic from 'next/dynamic'

export const dynamic = 'force-dynamic'

// Dynamically import ClerkProvider to avoid SSR issues
const DynamicClerkProvider = nextDynamic(
  () => import('@clerk/nextjs').then(mod => mod.ClerkProvider),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }
)

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <ThemeProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </ErrorBoundary>
      </ThemeProvider>
    )
  }

  return (
    <DynamicClerkProvider localization={jaJP}>
      <ThemeProvider>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </ThemeProvider>
    </DynamicClerkProvider>
  )
}