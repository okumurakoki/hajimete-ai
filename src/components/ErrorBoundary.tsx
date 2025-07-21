'use client'

import React, { useState, useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'
import { handleReactError } from '@/lib/error-logger'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Chrome拡張機能のエラーは無視
    if (error.message.includes('message channel closed') || 
        error.message.includes('Extension context invalidated') ||
        error.message.includes('chrome-extension') ||
        error.stack?.includes('chrome-extension')) {
      console.warn('Chrome extension error suppressed:', error.message)
      return { hasError: false }
    }
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Chrome拡張機能のエラーは無視
    if (error.message.includes('message channel closed') || 
        error.message.includes('Extension context invalidated') ||
        error.message.includes('chrome-extension') ||
        error.stack?.includes('chrome-extension')) {
      return
    }
    
    console.error('Application Error:', error, errorInfo)
    
    // エラーログに記録
    handleReactError(error, errorInfo, undefined, 'ErrorBoundary')
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent 
          error={this.state.error} 
          retry={() => this.setState({ hasError: false, error: undefined })}
        />
      )
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={19} className="text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          エラーが発生しました
        </h1>
        
        <p className="text-gray-600 mb-6">
          申し訳ございません。予期しないエラーが発生しました。
          しばらく時間をおいてから再度お試しください。
        </p>

        {isDevelopment && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-mono text-red-800">
              <strong>Error:</strong> {error.message}
            </p>
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-red-700">
                スタックトレースを表示
              </summary>
              <pre className="mt-2 text-xs text-red-600 overflow-auto">
                {error.stack}
              </pre>
            </details>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={retry}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={10} />
            再試行
          </button>
          
          <Link href="/">
            <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
              <Home size={10} />
              ホームに戻る
            </button>
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          問題が解決しない場合は、
          <a href="mailto:support@hajimete-ai.com" className="text-blue-600 hover:text-blue-700">
            サポートチーム
          </a>
          までお問い合わせください。
        </p>
      </div>
    </div>
  )
}

// Hook for error handling in components
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack: string }) => {
    // エラーログに記録
    handleReactError(error, errorInfo || { componentStack: '' }, undefined, 'useErrorHandler')
    
    console.error('Component error:', error, errorInfo)
    
    // You can also trigger error boundary here if needed
    throw error
  }
}

export default ErrorBoundary