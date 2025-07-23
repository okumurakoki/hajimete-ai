import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // ユーザーのサブスクリプション情報を取得
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        plan: true,
        subscriptionStatus: true,
        planExpiresAt: true,
        stripeCustomerId: true,
        subscriptionId: true
      }
    })

    if (!user) {
      // ユーザーが存在しない場合は作成
      const newUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: '', // Clerkから取得する必要がある場合は後で更新
          plan: 'FREE',
          subscriptionStatus: null
        },
        select: {
          plan: true,
          subscriptionStatus: true,
          planExpiresAt: true,
          stripeCustomerId: true,
          subscriptionId: true
        }
      })
      return NextResponse.json(newUser)
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user subscription:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    )
  }
}