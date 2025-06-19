'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({ 
  size = 'md', 
  message = '読み込み中...',
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-4'

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className={`${sizeClasses[size]} border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto`} />
        {message && (
          <p className="mt-2 text-sm text-gray-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  )
}

// Export additional loading states
export function PageLoading({ message = 'ページを読み込み中...' }) {
  return <LoadingSpinner size="lg" message={message} fullScreen />
}

export function ButtonLoading({ message = '処理中...' }) {
  return <LoadingSpinner size="sm" message={message} />
}

export function ContentLoading({ message = 'コンテンツを読み込み中...' }) {
  return <LoadingSpinner size="md" message={message} />
}