import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 最新の登録を取得（過去1時間以内）
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    
    const registrations = await prisma.registration.findMany({
      where: {
        userId,
        createdAt: {
          gte: oneHourAgo
        }
      },
      include: {
        course: true,
        payment: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    return NextResponse.json(registrations)
  } catch (error) {
    console.error('Error fetching latest registrations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}