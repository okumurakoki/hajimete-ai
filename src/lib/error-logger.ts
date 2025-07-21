// エラーログ収集システム
interface ErrorLog {
  id: string
  timestamp: string
  level: 'error' | 'warn' | 'info'
  message: string
  stack?: string
  userId?: string
  userAgent?: string
  url?: string
  component?: string
  metadata?: Record<string, any>
}

class ErrorLogger {
  private static instance: ErrorLogger
  private logs: ErrorLog[] = []
  private maxLogs = 1000 // メモリ上に保持する最大ログ数

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  /**
   * エラーをログに記録
   */
  logError(
    message: string,
    error?: Error | unknown,
    metadata?: {
      userId?: string
      component?: string
      url?: string
      userAgent?: string
      [key: string]: any
    }
  ): void {
    const log: ErrorLog = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      stack: error instanceof Error ? error.stack : undefined,
      userId: metadata?.userId,
      userAgent: metadata?.userAgent || (typeof window !== 'undefined' ? window.navigator?.userAgent : undefined),
      url: metadata?.url || (typeof window !== 'undefined' ? window.location?.href : undefined),
      component: metadata?.component,
      metadata
    }

    this.addLog(log)
    
    // コンソールにも出力
    console.error('🚨 Error logged:', log)
    
    // 本番環境では外部サービスに送信
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(log)
    }
  }

  /**
   * 警告をログに記録
   */
  logWarning(
    message: string,
    metadata?: {
      userId?: string
      component?: string
      url?: string
      [key: string]: any
    }
  ): void {
    const log: ErrorLog = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      userId: metadata?.userId,
      userAgent: typeof window !== 'undefined' ? window.navigator?.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location?.href : undefined,
      component: metadata?.component,
      metadata
    }

    this.addLog(log)
    console.warn('⚠️ Warning logged:', log)
  }

  /**
   * 情報をログに記録
   */
  logInfo(
    message: string,
    metadata?: {
      userId?: string
      component?: string
      [key: string]: any
    }
  ): void {
    const log: ErrorLog = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      userId: metadata?.userId,
      component: metadata?.component,
      metadata
    }

    this.addLog(log)
    console.info('ℹ️ Info logged:', log)
  }

  /**
   * ログ一覧を取得
   */
  getLogs(options?: {
    level?: 'error' | 'warn' | 'info'
    userId?: string
    component?: string
    limit?: number
  }): ErrorLog[] {
    let filteredLogs = [...this.logs]

    if (options?.level) {
      filteredLogs = filteredLogs.filter(log => log.level === options.level)
    }

    if (options?.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === options.userId)
    }

    if (options?.component) {
      filteredLogs = filteredLogs.filter(log => log.component === options.component)
    }

    // 新しい順にソート
    filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    if (options?.limit) {
      filteredLogs = filteredLogs.slice(0, options.limit)
    }

    return filteredLogs
  }

  /**
   * エラー統計を取得
   */
  getErrorStats(): {
    total: number
    byLevel: Record<string, number>
    byComponent: Record<string, number>
    recent24h: number
  } {
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const byLevel = this.logs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byComponent = this.logs.reduce((acc, log) => {
      if (log.component) {
        acc[log.component] = (acc[log.component] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const recent24h = this.logs.filter(log => 
      new Date(log.timestamp) > last24h
    ).length

    return {
      total: this.logs.length,
      byLevel,
      byComponent,
      recent24h
    }
  }

  /**
   * ログをクリア
   */
  clearLogs(): void {
    this.logs = []
    console.info('🗑️ Error logs cleared')
  }

  private addLog(log: ErrorLog): void {
    this.logs.push(log)
    
    // メモリ制限を超えた場合は古いログを削除
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private async sendToExternalService(log: ErrorLog): Promise<void> {
    try {
      // 本番環境では外部ログサービス（Sentry、LogRocket等）に送信
      // 現在はAPIエンドポイントに送信
      await fetch('/api/admin/error-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log)
      })
    } catch (error) {
      console.error('Failed to send error log to external service:', error)
    }
  }
}

// React Error Boundary用のエラーハンドラー
export function handleReactError(error: Error, errorInfo: any, userId?: string, component?: string): void {
  errorLogger.logError(
    `React Error: ${error.message}`,
    error,
    {
      userId,
      component,
      errorInfo: errorInfo.componentStack
    }
  )
}

// Promise rejection用のエラーハンドラー
export function handleUnhandledRejection(reason: any, userId?: string): void {
  errorLogger.logError(
    `Unhandled Promise Rejection: ${reason}`,
    reason instanceof Error ? reason : new Error(String(reason)),
    {
      userId,
      component: 'UnhandledPromiseRejection'
    }
  )
}

// グローバルエラーハンドラー用
export function handleGlobalError(error: ErrorEvent, userId?: string): void {
  errorLogger.logError(
    `Global Error: ${error.message}`,
    new Error(error.message),
    {
      userId,
      component: 'GlobalErrorHandler',
      url: error.filename,
      metadata: {
        line: error.lineno,
        column: error.colno
      }
    }
  )
}

export const errorLogger = ErrorLogger.getInstance()
export default errorLogger