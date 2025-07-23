import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // セキュリティチェック: 管理者が既に存在する場合は作成を拒否
    const existingAdmins = await prisma.admin.count()
    if (existingAdmins > 0) {
      return NextResponse.json(
        { error: 'Admin already exists' },
        { status: 403 }
      )
    }

    // ユーザーレコードを作成または更新
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      create: {
        clerkId: userId,
        email: '', // Clerkから後で更新
        plan: 'PREMIUM',
        subscriptionStatus: 'ACTIVE'
      },
      update: {
        plan: 'PREMIUM',
        subscriptionStatus: 'ACTIVE'
      }
    })

    // 管理者レコードを作成
    const admin = await prisma.admin.create({
      data: {
        userId: userId,
        role: 'ADMIN'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin.id,
        role: admin.role,
        createdAt: admin.createdAt
      }
    })
    
  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json(
      { error: 'Failed to create admin' },
      { status: 500 }
    )
  }
}