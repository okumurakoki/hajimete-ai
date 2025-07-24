import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserId, isAdminUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const isAdmin = await isAdminUser(userId)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // セミナーデータの取得
    const seminars = await prisma.liveCourse.findMany({
      include: {
        registrations: true,
        _count: {
          select: {
            registrations: {
              where: {
                status: 'CONFIRMED'
              }
            }
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    const formattedSeminars = seminars.map(seminar => ({
      id: seminar.id,
      title: seminar.title,
      description: seminar.description,
      instructor: seminar.instructor,
      startDate: seminar.startDate,
      endDate: seminar.endDate,
      duration: seminar.duration,
      maxParticipants: seminar.maxParticipants,
      currentParticipants: seminar._count.registrations,
      price: seminar.price,
      category: seminar.category,
      level: seminar.level,
      isPublished: seminar.isPublished,
      status: seminar.startDate > new Date() ? 'upcoming' : 'completed'
    }))

    return NextResponse.json({ seminars: formattedSeminars })
  } catch (error) {
    console.error('Admin seminars API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const isAdmin = await isAdminUser(userId)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      instructor,
      startDate,
      endDate,
      duration,
      maxParticipants,
      price,
      category,
      level,
      zoomUrl,
      zoomId,
      zoomPassword,
      curriculum,
      tags,
      isPublished
    } = body

    // バリデーション
    if (!title || !instructor || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Required fields missing: title, instructor, startDate, endDate' },
        { status: 400 }
      )
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // 新しいセミナーを作成
    const newSeminar = await prisma.liveCourse.create({
      data: {
        title,
        description: description || '',
        instructor,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        duration: duration || 60,
        maxParticipants: parseInt(maxParticipants) || 50,
        currentParticipants: 0,
        price: parseFloat(price) || 0,
        category: category || 'general',
        level: level || 'beginner',
        zoomUrl: zoomUrl || null,
        zoomId: zoomId || null,
        zoomPassword: zoomPassword || null,
        curriculum: curriculum || null,
        tags: tags || null,
        isPublished: isPublished || false,
        isActive: true
      }
    })

    return NextResponse.json({ 
      message: 'Seminar created successfully',
      seminar: newSeminar 
    })
  } catch (error) {
    console.error('Seminar creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create seminar' }, 
      { status: 500 }
    )
  }
}