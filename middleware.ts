import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// 保護するルートを明確に定義
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/ai-basics(.*)',
  '/productivity(.*)',
  '/practical-application(.*)',
  '/catchup(.*)',
  '/data-science(.*)',
  '/business-ai(.*)',
  '/ai-development(.*)',
  '/admin(.*)',
  '/profile(.*)',
  '/favorites(.*)',
  '/videos(.*)',
  '/seminars(.*)',
  '/live(.*)',
  '/api/protected(.*)'
])

// パブリックルートを定義
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/demo',
  '/test(.*)',
  '/debug(.*)',
  '/api/public(.*)',
  '/api/webhooks(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  // Chrome拡張機能のリクエストをスキップ
  const userAgent = req.headers.get('user-agent') || ''
  if (userAgent.includes('Chrome-Extension') || userAgent.includes('chrome-extension')) {
    return
  }

  // 開発環境でのデバッグ
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware executing for:', req.nextUrl.pathname)
  }

  try {
    // 保護されたルートの場合、認証を要求
    if (isProtectedRoute(req)) {
      await auth.protect()
    }
  } catch (error) {
    // Clerk認証エラーをキャッチして適切に処理
    console.warn('Clerk middleware error:', error)
    // 認証エラーの場合はサインインページにリダイレクト
    if (isProtectedRoute(req)) {
      const signInUrl = new URL('/sign-in', req.url)
      return Response.redirect(signInUrl)
    }
  }
})

export const config = {
  matcher: [
    // Next.js内部ファイルと静的ファイルをスキップ
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // APIルートは常に実行
    '/(api|trpc)(.*)',
  ],
}