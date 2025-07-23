import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clerkId, email } = body
    
    if (!clerkId || !email) {
      return NextResponse.json(
        { error: 'ClerkId and email are required' },
        { status: 400 }
      )
    }
    
    console.log('🚀 Creating admin for:', { clerkId, email })
    
    // ユーザーレコードを作成または更新
    const user = await prisma.user.upsert({
      where: { clerkId },
      create: {
        clerkId,
        email,
        plan: 'PREMIUM',
        subscriptionStatus: 'ACTIVE'
      },
      update: {
        email,
        plan: 'PREMIUM',
        subscriptionStatus: 'ACTIVE'
      }
    })
    
    console.log('✅ User record:', user.id)
    
    // 管理者レコードを作成
    const admin = await prisma.admin.upsert({
      where: { userId: clerkId },
      create: {
        userId: clerkId,
        role: 'ADMIN'
      },
      update: {
        role: 'ADMIN'
      }
    })
    
    console.log('✅ Admin record created:', admin.id)
    
    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      user: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        plan: user.plan
      },
      admin: {
        id: admin.id,
        role: admin.role,
        createdAt: admin.createdAt
      }
    })
    
  } catch (error) {
    console.error('❌ Error creating admin:', error)
    return NextResponse.json(
      { error: 'Failed to create admin', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}