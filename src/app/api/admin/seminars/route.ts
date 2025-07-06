import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth, apiError, apiSuccess, handleDatabaseError } from '@/lib/api-helpers'

export async function GET() {
  try {
    // 管理者権限チェック
    const { error, userId, isAdmin } = await checkAdminAuth()
    if (error) return error

    // セミナー一覧取得
    try {
      const seminars = await prisma.liveCourse.findMany({
        orderBy: {
          createdAt: 'desc'
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

      return apiSuccess(seminarsWithParticipants)
    } catch (dbError) {
      return handleDatabaseError(dbError, 'fetch seminars')
    }
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/seminars:', error)
    return apiError('Internal server error')
  }
}

export async function POST(request: NextRequest) {
  try {
    // 管理者権限チェック
    const { error, userId, isAdmin } = await checkAdminAuth()
    if (error) return error

    const data = await request.json()

    // バリデーション
    if (!data.title || !data.instructor || !data.startDate || !data.endDate) {
      return apiError('Required fields missing: title, instructor, startDate, endDate', 400)
    }

    if (new Date(data.startDate) >= new Date(data.endDate)) {
      return apiError('End date must be after start date', 400)
    }

    // セミナー作成
    try {
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
          currentParticipants: 0,
          zoomUrl: data.zoomUrl || null,
          zoomId: data.zoomId || null,
          zoomPassword: data.zoomPassword || null,
          curriculum: data.curriculum || null,
          tags: data.tags || null,
          isPublished: data.isPublished || false,
          isActive: true
        }
      })

      return apiSuccess(seminar)
    } catch (dbError) {
      return handleDatabaseError(dbError, 'create seminar')
    }
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/seminars:', error)
    return apiError('Internal server error')
  }
}