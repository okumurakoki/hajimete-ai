import { auth as clerkAuth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function getAuthUserId(request?: NextRequest) {
  try {
    const authResult = await clerkAuth()
    return authResult?.userId || null
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
    const admin = await prisma.admin.findUnique({
      where: { userId }
    })
    return !!admin
  } catch (error) {
    console.error('Admin check error:', error)
    return false
  }
}