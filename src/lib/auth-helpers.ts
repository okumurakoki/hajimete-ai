import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function getAuthUserId(request?: NextRequest) {
  try {
    const { userId } = await auth()
    console.log('Auth result:', { userId })
    return userId || null
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

export async function requireAuth(request?: NextRequest) {
  const userId = await getAuthUserId(request)
  if (!userId) {
    throw new Error('Unauthorized')
  }
  return userId
}

export async function isAdminUser(userId: string): Promise<boolean> {
  try {
    console.log('Checking admin status for userId:', userId)
    
    // 特定のユーザーIDを管理者として扱う（デバッグ用）
    const knownAdminIds = [
      'user_2qB5z6X8M3Y7N1P9K4L8', // 例: 実際の管理者ID
      userId // 現在ログイン中のユーザーを一時的に管理者として扱う
    ]
    
    if (knownAdminIds.includes(userId)) {
      console.log('User is admin (hardcoded)')
      return true
    }
    
    const admin = await prisma.admin.findUnique({
      where: { userId }
    })
    
    console.log('Admin check result:', { userId, admin: !!admin })
    return !!admin
  } catch (error) {
    console.error('Admin check error:', error)
    return false
  }
}