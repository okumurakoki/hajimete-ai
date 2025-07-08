import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const seminars = await prisma.liveCourse.findMany({
      where: {
        isActive: true,
        isPublished: true,
        startDate: {
          gte: new Date()
        }
      },
      orderBy: {
        startDate: 'asc'
      },
      select: {
        id: true,
        title: true,
        description: true,
        instructor: true,
        startDate: true,
        endDate: true,
        duration: true,
        price: true,
        level: true,
        category: true,
        maxParticipants: true,
        currentParticipants: true,
        tags: true,
        registrations: {
          where: {
            status: 'CONFIRMED'
          },
          select: {
            id: true
          }
        }
      }
    })

    const formattedSeminars = seminars.map(seminar => ({
      id: seminar.id,
      title: seminar.title,
      description: seminar.description,
      instructor: seminar.instructor,
      startDate: seminar.startDate.toISOString(),
      endDate: seminar.endDate.toISOString(),
      duration: seminar.duration,
      price: seminar.price,
      level: seminar.level,
      category: seminar.category,
      maxParticipants: seminar.maxParticipants,
      currentParticipants: seminar.registrations.length,
      tags: seminar.tags?.split(',').map(tag => tag.trim()) || [],
      spotsLeft: seminar.maxParticipants - seminar.registrations.length
    }))

    return NextResponse.json(formattedSeminars)
  } catch (error) {
    console.error('Error fetching seminars:', error)
    return NextResponse.json(
      { error: 'Failed to fetch seminars' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
