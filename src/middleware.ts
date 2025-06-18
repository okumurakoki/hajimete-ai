import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  // 認証が不要なページ
  publicRoutes: [
    '/',
    '/sign-in',
    '/sign-up',
    '/api/webhooks(.*)'
  ],
  // 認証後のリダイレクト先
  afterAuth(auth, req, evt) {
    // ログインしているがプランが未選択の場合
    if (auth.userId && !auth.user?.publicMetadata?.plan && req.nextUrl.pathname !== '/plan-selection') {
      const planSelectionUrl = new URL('/plan-selection', req.url)
      return Response.redirect(planSelectionUrl)
    }

    // 未認証でプロテクトされたページにアクセスした場合
    if (!auth.userId && !publicRoutes.includes(req.nextUrl.pathname)) {
      const signInUrl = new URL('/sign-in', req.url)
      return Response.redirect(signInUrl)
    }
  },
})

const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/api/webhooks'
]

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}