import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const seminar = await prisma.liveCourse.findUnique({
      where: {
        id: params.id,
        isActive: true,
        isPublished: true
      },
      include: {
        registrations: {
          where: {
            status: 'CONFIRMED'
          },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                displayName: true
              }
            }
          }
        }
      }
    })

    if (!seminar) {
      return NextResponse.json(
        { error: 'セミナーが見つかりません' },
        { status: 404 }
      )
    }

    const formattedSeminar = {
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
      spotsLeft: seminar.maxParticipants - seminar.registrations.length,
      curriculum: seminar.curriculum ? JSON.parse(seminar.curriculum) : null,
      materials: seminar.materials ? JSON.parse(seminar.materials) : null,
      zoomUrl: seminar.zoomUrl,
      participants: seminar.registrations.map(reg => ({
        name: reg.user.displayName || `${reg.user.firstName || ''} ${reg.user.lastName || ''}`.trim() || '名前未設定',
        registeredAt: reg.createdAt.toISOString()
      }))
    }

    return NextResponse.json(formattedSeminar)
  } catch (error) {
    console.error('Error fetching seminar:', error)
    return NextResponse.json(
      { error: 'セミナー詳細の取得に失敗しました' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}