// Production-safe logging utility

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogContext {
  userId?: string
  sessionId?: string
  action?: string
  metadata?: Record<string, any>
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` | ${JSON.stringify(context)}` : ''
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`
  }

  info(message: string, context?: LogContext) {
    if (!this.isProduction) {
      console.log(this.formatMessage('info', message, context))
    }
    // In production, send to monitoring service (Sentry, LogRocket, etc.)
  }

  warn(message: string, context?: LogContext) {
    if (!this.isProduction) {
      console.warn(this.formatMessage('warn', message, context))
    }
    // In production, send to monitoring service
  }

  error(message: string, error?: Error, context?: LogContext) {
    const errorContext = {
      ...context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined
    }

    if (!this.isProduction) {
      console.error(this.formatMessage('error', message, errorContext))
    }
    
    // In production, always log errors to monitoring service
    if (this.isProduction) {
      // Send to Sentry or similar
      this.sendToMonitoring('error', message, errorContext)
    }
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, context))
    }
  }

  // Performance logging
  time(label: string) {
    if (!this.isProduction) {
      console.time(label)
    }
  }

  timeEnd(label: string) {
    if (!this.isProduction) {
      console.timeEnd(label)
    }
  }

  // User action tracking
  track(event: string, properties?: Record<string, any>) {
    if (this.isDevelopment) {
      console.log(`🔍 Track: ${event}`, properties)
    }
    
    // In production, send to analytics service
    if (this.isProduction) {
      this.sendToAnalytics(event, properties)
    }
  }

  private sendToMonitoring(level: LogLevel, message: string, context?: LogContext) {
    // Integration with monitoring services
    // Example: Sentry.captureMessage(message, level)
  }

  private sendToAnalytics(event: string, properties?: Record<string, any>) {
    // Integration with analytics services
    // Example: Analytics.track(event, properties)
  }
}

// Create singleton instance
export const logger = new Logger()

// Export specific logging functions for convenience
export const log = {
  info: (message: string, context?: LogContext) => logger.info(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  error: (message: string, error?: Error, context?: LogContext) => logger.error(message, error, context),
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  track: (event: string, properties?: Record<string, any>) => logger.track(event, properties),
  time: (label: string) => logger.time(label),
  timeEnd: (label: string) => logger.timeEnd(label),
}

export default logger