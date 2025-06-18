import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/videos(.*)',
  '/seminars(.*)',
  '/live(.*)',
  '/admin(.*)',
  '/ai-basics(.*)',
  '/productivity(.*)',
  '/practical-application(.*)',
  '/catchup(.*)',
  '/plan-selection'
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}