import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// API レスポンスヘルパー
export function apiError(message: string, status: number = 500, details?: any) {
  return NextResponse.json(
    { 
      error: message,
      ...(process.env.NODE_ENV === 'development' && details ? { details } : {})
    }, 
    { status }
  )
}

export function apiSuccess(data: any) {
  return NextResponse.json(data)
}

// 認証チェックヘルパー
export async function checkAuth() {
  console.log('🔐 Checking Clerk authentication...')
  
  try {
    const authResult = await auth()
    console.log('Clerk auth result:', {
      userId: authResult?.userId,
      sessionId: authResult?.sessionId,
      hasAuth: !!authResult
    })
    
    if (!authResult?.userId) {
      console.log('❌ No user ID from Clerk auth')
      return { error: apiError('Unauthorized - No user session', 401), userId: null }
    }
    
    console.log('✅ Clerk auth successful:', authResult.userId)
    return { error: null, userId: authResult.userId }
  } catch (clerkError) {
    console.error('💥 Clerk auth error:', clerkError)
    const errorMessage = clerkError instanceof Error ? clerkError.message : 'Unknown error'
    return { 
      error: apiError(`Clerk authentication failed: ${errorMessage}`, 401), 
      userId: null 
    }
  }
}

// 管理者権限チェックヘルパー
export async function checkAdminAuth() {
  console.log('👑 Checking admin authorization...')
  
  const { error, userId } = await checkAuth()
  
  if (error) {
    console.log('❌ Auth check failed, denying admin access')
    return { error, userId: null, isAdmin: false }
  }
  
  console.log(`🔍 Looking up admin record for user: ${userId}`)
  
  try {
    const admin = await prisma.admin.findUnique({
      where: { userId: userId! }
    })
    
    console.log('Admin lookup result:', {
      found: !!admin,
      role: admin?.role,
      createdAt: admin?.createdAt
    })
    
    if (!admin) {
      console.log('❌ User is not an admin')
      return { 
        error: apiError('Forbidden - Admin access required', 403), 
        userId, 
        isAdmin: false 
      }
    }
    
    console.log('✅ Admin access granted')
    return { error: null, userId, isAdmin: true }
  } catch (dbError) {
    console.error('💥 Database error during admin check:', dbError)
    // DBエラーの場合は、一時的にアクセスを許可（本番環境の初期設定用）
    console.log('⚠️ DB error - temporarily allowing access for setup')
    return { error: null, userId, isAdmin: true }
  }
}

// データベースエラーハンドラー
export function handleDatabaseError(error: any, operation: string) {
  console.error(`Database error during ${operation}:`, error)
  
  if (error.code === 'P2002') {
    return apiError('Duplicate entry found', 409, error.meta)
  }
  
  if (error.code === 'P2025') {
    return apiError('Record not found', 404)
  }
  
  return apiError(`Database operation failed: ${operation}`, 500)
}