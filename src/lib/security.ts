import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from './prisma'

// Rate limiting configuration
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // limit each IP to 100 requests per windowMs
  premium: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 200 // premium users get higher limits
  }
}

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Rate limiting middleware
 */
export function rateLimit(req: NextRequest, userPlan?: string): { allowed: boolean; remaining: number } {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const key = `rate_limit:${ip}`
  const now = Date.now()
  
  const config = userPlan === 'premium' ? rateLimitConfig.premium : rateLimitConfig
  const windowMs = config.windowMs
  const maxRequests = config.maxRequests

  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  rateLimitStore.set(key, record)
  
  return { allowed: true, remaining: maxRequests - record.count }
}

/**
 * Input validation utilities
 */
export class InputValidator {
  static sanitizeString(input: string, maxLength: number = 1000): string {
    if (typeof input !== 'string') return ''
    
    return input
      .trim()
      .slice(0, maxLength)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static validateVideoId(videoId: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(videoId)
  }

  static validatePaginationParams(page?: string, limit?: string): { page: number; limit: number } {
    const pageNum = Math.max(1, parseInt(page || '1'))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit || '20')))
    
    return { page: pageNum, limit: limitNum }
  }

  static validateVideoProgress(progress: any): boolean {
    return (
      typeof progress.progressPercentage === 'number' &&
      progress.progressPercentage >= 0 &&
      progress.progressPercentage <= 100 &&
      typeof progress.watchTime === 'number' &&
      progress.watchTime >= 0 &&
      typeof progress.lastPosition === 'number' &&
      progress.lastPosition >= 0
    )
  }
}

/**
 * Access control utilities
 */
export class AccessControl {
  /**
   * Check if user can access admin features
   */
  static async isAdmin(userId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkId: userId }
      })

      return user?.plan === 'admin' || user?.email?.endsWith('@hajimete-ai.com') || false
    } catch (error) {
      console.error('Error checking admin access:', error)
      return false
    }
  }

  /**
   * Check if user can access premium content
   */
  static async canAccessPremiumContent(userId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        include: {
          subscriptions: {
            where: { status: 'active' },
            include: { plan: true }
          }
        }
      })

      if (!user) return false

      const activeSubscription = user.subscriptions.find(sub => sub.status === 'active')
      return activeSubscription?.plan.slug === 'premium' || false
    } catch (error) {
      console.error('Error checking premium access:', error)
      return false
    }
  }

  /**
   * Check if user can access specific video
   */
  static async canAccessVideo(userId: string, videoId: string): Promise<boolean> {
    try {
      const video = await prisma.video.findUnique({
        where: { id: videoId },
        include: { department: true }
      })

      if (!video || video.status !== 'published') return false

      // Public videos are accessible to all authenticated users
      if (!video.isPremium) return true

      // Premium videos require premium subscription
      return await this.canAccessPremiumContent(userId)
    } catch (error) {
      console.error('Error checking video access:', error)
      return false
    }
  }

  /**
   * Check if user can access live stream
   */
  static async canAccessLiveStream(userId: string, streamId: string): Promise<boolean> {
    try {
      const stream = await prisma.liveStream.findUnique({
        where: { id: streamId }
      })

      if (!stream) return false

      // Free streams are accessible to all
      if (!stream.isPremium) return true

      // Premium streams require premium subscription
      return await this.canAccessPremiumContent(userId)
    } catch (error) {
      console.error('Error checking stream access:', error)
      return false
    }
  }
}

/**
 * Audit logging
 */
export class AuditLogger {
  static async log(
    userId: string | null,
    action: string,
    resourceType?: string,
    resourceId?: string,
    details?: any,
    req?: NextRequest
  ): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action,
          resourceType,
          resourceId,
          details: details || {},
          ipAddress: req?.headers.get('x-forwarded-for') || req?.headers.get('x-real-ip') || null,
          userAgent: req?.headers.get('user-agent') || null
        }
      })
    } catch (error) {
      console.error('Error logging audit event:', error)
    }
  }

  static async logVideoAccess(userId: string, videoId: string, action: string, req?: NextRequest) {
    await this.log(userId, action, 'video', videoId, { action }, req)
  }

  static async logAdminAction(userId: string, action: string, details?: any, req?: NextRequest) {
    await this.log(userId, `admin:${action}`, 'admin', undefined, details, req)
  }

  static async logPaymentEvent(userId: string, action: string, details?: any) {
    await this.log(userId, `payment:${action}`, 'payment', undefined, details)
  }
}

/**
 * Content Security Policy
 */
export const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.com *.clerk.dev *.clerk.com *.stripe.com",
  "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
  "font-src 'self' fonts.gstatic.com",
  "img-src 'self' data: blob: *.vimeo.com *.vimeocdn.com *.cloudflarestream.com *.unsplash.com",
  "media-src 'self' *.vimeo.com *.vimeocdn.com *.cloudflarestream.com",
  "connect-src 'self' *.clerk.dev *.clerk.com *.stripe.com *.vimeo.com *.cloudflarestream.com",
  "frame-src 'self' *.vimeo.com *.cloudflarestream.com player.vimeo.com iframe.cloudflarestream.com",
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests"
].join('; ')

/**
 * Security headers
 */
export const SECURITY_HEADERS = {
  'Content-Security-Policy': CSP_HEADER,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
}

/**
 * Data encryption utilities
 */
export class DataEncryption {
  private static readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'fallback-key-change-in-production'

  static encrypt(text: string): string {
    // In production, use proper encryption library like crypto
    // This is a simplified example
    return Buffer.from(text).toString('base64')
  }

  static decrypt(encryptedText: string): string {
    // In production, use proper decryption
    return Buffer.from(encryptedText, 'base64').toString()
  }

  static hashPassword(password: string): string {
    // This should use bcrypt or similar in production
    return Buffer.from(password).toString('base64')
  }
}

/**
 * Session security
 */
export class SessionSecurity {
  /**
   * Track user session
   */
  static async trackSession(
    userId: string,
    sessionId: string,
    req: NextRequest
  ): Promise<void> {
    try {
      const userAgent = req.headers.get('user-agent') || ''
      const deviceType = this.detectDeviceType(userAgent)
      const browser = this.detectBrowser(userAgent)
      const os = this.detectOS(userAgent)

      await prisma.userSession.upsert({
        where: { sessionId },
        update: {
          pagesViewed: { increment: 1 }
        },
        create: {
          userId,
          sessionId,
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null,
          userAgent,
          deviceType,
          browser,
          os
        }
      })
    } catch (error) {
      console.error('Error tracking session:', error)
    }
  }

  /**
   * End user session
   */
  static async endSession(sessionId: string): Promise<void> {
    try {
      const session = await prisma.userSession.findUnique({
        where: { sessionId }
      })

      if (session && !session.endedAt) {
        const duration = Math.floor((Date.now() - session.startedAt.getTime()) / 1000)
        
        await prisma.userSession.update({
          where: { sessionId },
          data: {
            endedAt: new Date(),
            duration
          }
        })
      }
    } catch (error) {
      console.error('Error ending session:', error)
    }
  }

  private static detectDeviceType(userAgent: string): string {
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet'
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile'
    return 'desktop'
  }

  private static detectBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Unknown'
  }

  private static detectOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('iOS')) return 'iOS'
    return 'Unknown'
  }
}

/**
 * API Security middleware
 */
export async function withSecurity(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<Response>
): Promise<Response> {
  try {
    // Get user info
    const { userId } = await auth()
    const userPlan = userId ? await getUserPlan(userId) : undefined

    // Rate limiting
    const rateLimitResult = rateLimit(req, userPlan)
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { 
          status: 429,
          headers: { 
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + rateLimitConfig.windowMs).toISOString()
          }
        }
      )
    }

    // Track session if user is authenticated
    if (userId) {
      const sessionId = req.headers.get('x-session-id') || `session_${Date.now()}`
      await SessionSecurity.trackSession(userId, sessionId, req)
    }

    // Execute handler
    const response = await handler(req)

    // Add security headers
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // Add rate limit headers
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())

    return response
  } catch (error) {
    console.error('Security middleware error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

async function getUserPlan(userId: string): Promise<string | undefined> {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { plan: true }
    })
    return user?.plan
  } catch (error) {
    console.error('Error getting user plan:', error)
    return undefined
  }
}