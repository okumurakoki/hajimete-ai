import { NextRequest, NextResponse } from 'next/server'
import { createAuthChecker } from '@/lib/api-helpers'

export async function GET() {
  try {
    // 動的import を使ってClerk認証を読み込み
    const { auth, currentUser } = await import('@clerk/nextjs/server')
    
    const checkAuth = createAuthChecker()
    const { error, userId } = await checkAuth(auth)
    
    if (error) {
      return error
    }
    
    const user = await currentUser()
    
    return NextResponse.json({
      userId,
      userDetails: user ? {
        id: user.id,
        emailAddresses: user.emailAddresses,
        firstName: user.firstName,
        lastName: user.lastName
      } : null
    })
  } catch (error) {
    console.error('Error getting user info:', error)
    return NextResponse.json(
      { error: 'Failed to get user info', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}