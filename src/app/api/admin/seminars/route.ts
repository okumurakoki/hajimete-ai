import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 管理者権限チェック
    const admin = await prisma.admin.findUnique({
      where: { userId: userId }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const seminars = await prisma.liveCourse.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(seminars)
  } catch (error) {
    console.error('Error fetching seminars:', error)
    return NextResponse.json({ error: 'Failed to fetch seminars' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 管理者権限チェック
    const admin = await prisma.admin.findUnique({
      where: { userId: userId }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()

    // バリデーション
    if (!data.title || !data.instructor || !data.startDate || !data.endDate) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }

    if (new Date(data.startDate) >= new Date(data.endDate)) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 })
    }

    const seminar = await prisma.liveCourse.create({
      data: {
        title: data.title,
        description: data.description,
        instructor: data.instructor,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        duration: data.duration,
        price: data.price,
        level: data.level,
        category: data.category,
        maxParticipants: data.maxParticipants,
        zoomUrl: data.zoomUrl || null,
        zoomId: data.zoomId || null,
        zoomPassword: data.zoomPassword || null,
        curriculum: data.curriculum || null,
        tags: data.tags || null,
        isPublished: data.isPublished || false,
        isActive: true
      }
    })

    return NextResponse.json(seminar)
  } catch (error) {
    console.error('Error creating seminar:', error)
    return NextResponse.json({ error: 'Failed to create seminar' }, { status: 500 })
  }
}