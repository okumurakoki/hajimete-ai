import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const seminars = await prisma.liveCourse.findMany({
      where: {
        isActive: true,
        isPublished: true,
        startDate: {
          gte: new Date() // 今後開催予定のセミナーのみ
        }
      },
      orderBy: {
        startDate: 'asc'
      },
      include: {
        _count: {
          select: {
            registrations: {
              where: {
                status: 'CONFIRMED'
              }
            }
          }
        }
      }
    })

    // currentParticipants を計算して追加
    const seminarsWithParticipants = seminars.map(seminar => ({
      ...seminar,
      currentParticipants: seminar._count.registrations
    }))

    return NextResponse.json(seminarsWithParticipants)
  } catch (error) {
    console.error('Error fetching live seminars:', error)
    return NextResponse.json({ error: 'Failed to fetch seminars' }, { status: 500 })
  }
}