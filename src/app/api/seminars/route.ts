import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

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

    // Mock seminars data - replace with actual database call when Prisma is properly configured
    const seminars = [
      {
        id: 'seminar-1',
        title: 'AI基礎セミナー',
        description: 'AI技術の基礎を学ぶセミナーです',
        date: new Date('2024-01-15'),
        duration: 120,
        capacity: 50,
        registeredCount: 25,
        status: 'upcoming',
        isPremium: false,
        instructor: {
          id: 'instructor-1',
          name: '田中太郎',
          bio: 'AI研究者',
          avatarUrl: '/avatars/instructor1.jpg',
          specialties: ['機械学習', '深層学習']
        },
        registrations: [],
        _count: {
          registrations: 25
        }
      }
    ].filter(s => s.status === status && (isPremium === null || s.isPremium.toString() === isPremium))

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
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { seminarId } = body

    // Mock user data - replace with actual database call when Prisma is properly configured
    const user = {
      id: 'mock-user-id',
      clerkId: userId,
      plan: 'premium'
    }

    // Mock seminar data - replace with actual database call when Prisma is properly configured
    const seminar = {
      id: seminarId,
      title: 'AI基礎セミナー',
      capacity: 50,
      isPremium: false,
      _count: {
        registrations: 25
      }
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

    // Mock registration check - replace with actual database call when Prisma is properly configured
    const existingRegistration = null

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Already registered for this seminar' },
        { status: 400 }
      )
    }

    // Mock registration creation - replace with actual database calls when Prisma is properly configured
    const registration = {
      id: 'mock-registration-id',
      userId: user.id,
      seminarId,
      registeredAt: new Date()
    }

    // Mock seminar update and notification creation
    // These would normally update the database

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