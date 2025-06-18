import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'upcoming'
    const isPremium = searchParams.get('isPremium')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {
      status
    }

    if (isPremium !== null) {
      where.isPremium = isPremium === 'true'
    }

    const seminars = await prisma.seminar.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            bio: true,
            avatarUrl: true,
            specialties: true
          }
        },
        registrations: {
          select: {
            id: true,
            userId: true,
            registeredAt: true
          }
        },
        _count: {
          select: {
            registrations: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      },
      take: limit
    })

    return NextResponse.json({ seminars })
  } catch (error) {
    console.error('Error fetching seminars:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { seminarId } = body

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get seminar details
    const seminar = await prisma.seminar.findUnique({
      where: { id: seminarId },
      include: {
        _count: {
          select: {
            registrations: true
          }
        }
      }
    })

    if (!seminar) {
      return NextResponse.json(
        { error: 'Seminar not found' },
        { status: 404 }
      )
    }

    // Check if seminar is full
    if (seminar._count.registrations >= seminar.capacity) {
      return NextResponse.json(
        { error: 'Seminar is full' },
        { status: 400 }
      )
    }

    // Check if premium seminar and user has premium plan
    if (seminar.isPremium && user.plan !== 'premium') {
      return NextResponse.json(
        { error: 'Premium plan required for this seminar' },
        { status: 403 }
      )
    }

    // Check if already registered
    const existingRegistration = await prisma.seminarRegistration.findUnique({
      where: {
        userId_seminarId: {
          userId: user.id,
          seminarId
        }
      }
    })

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Already registered for this seminar' },
        { status: 400 }
      )
    }

    // Register for seminar
    const registration = await prisma.seminarRegistration.create({
      data: {
        userId: user.id,
        seminarId
      }
    })

    // Update registered count
    await prisma.seminar.update({
      where: { id: seminarId },
      data: {
        registeredCount: {
          increment: 1
        }
      }
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: '📅 セミナー登録完了',
        message: `「${seminar.title}」への登録が完了しました。`,
        type: 'success',
        actionUrl: '/seminars'
      }
    })

    return NextResponse.json({ 
      success: true,
      registration,
      seminar
    })
  } catch (error) {
    console.error('Error registering for seminar:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}