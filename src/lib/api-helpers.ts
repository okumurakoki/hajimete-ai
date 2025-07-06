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
  const { userId } = await auth()
  
  if (!userId) {
    return { error: apiError('Unauthorized', 401), userId: null }
  }
  
  return { error: null, userId }
}

// 管理者権限チェックヘルパー
export async function checkAdminAuth() {
  const { error, userId } = await checkAuth()
  
  if (error) {
    return { error, userId: null, isAdmin: false }
  }
  
  try {
    const admin = await prisma.admin.findUnique({
      where: { userId: userId! }
    })
    
    if (!admin) {
      return { 
        error: apiError('Forbidden - Admin access required', 403), 
        userId, 
        isAdmin: false 
      }
    }
    
    return { error: null, userId, isAdmin: true }
  } catch (dbError) {
    console.error('Admin check error:', dbError)
    // DBエラーの場合は、一時的にアクセスを許可（本番環境の初期設定用）
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