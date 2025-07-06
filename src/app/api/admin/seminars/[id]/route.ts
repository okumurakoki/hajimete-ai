import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth, apiError, apiSuccess, handleDatabaseError } from '@/lib/api-helpers'

// Next.js 15 compatible route handlers

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 管理者権限チェック
    const { error, userId, isAdmin } = await checkAdminAuth()
    if (error) return error

    const data = await request.json()
    const params = await context.params
    const { id } = params

    // セミナーの存在確認
    try {
      const existingSeminar = await prisma.liveCourse.findUnique({ where: { id } })
      if (!existingSeminar) {
        return apiError('Seminar not found', 404)
      }

      const seminar = await prisma.liveCourse.update({
        where: { id },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.instructor && { instructor: data.instructor }),
          ...(data.startDate && { startDate: new Date(data.startDate) }),
          ...(data.endDate && { endDate: new Date(data.endDate) }),
          ...(data.duration !== undefined && { duration: data.duration }),
          ...(data.price !== undefined && { price: data.price }),
          ...(data.level && { level: data.level }),
          ...(data.category && { category: data.category }),
          ...(data.maxParticipants !== undefined && { maxParticipants: data.maxParticipants }),
          ...(data.zoomUrl !== undefined && { zoomUrl: data.zoomUrl }),
          ...(data.zoomId !== undefined && { zoomId: data.zoomId }),
          ...(data.zoomPassword !== undefined && { zoomPassword: data.zoomPassword }),
          ...(data.curriculum !== undefined && { curriculum: data.curriculum }),
          ...(data.tags !== undefined && { tags: data.tags }),
          ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
          ...(data.isActive !== undefined && { isActive: data.isActive })
        }
      })

      return apiSuccess(seminar)
    } catch (dbError) {
      return handleDatabaseError(dbError, 'update seminar')
    }
  } catch (error) {
    console.error('Unexpected error in PATCH /api/admin/seminars/[id]:', error)
    return apiError('Internal server error')
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 管理者権限チェック
    const { error, userId, isAdmin } = await checkAdminAuth()
    if (error) return error

    const params = await context.params
    const { id } = params

    try {
      // セミナーの存在確認
      const existingSeminar = await prisma.liveCourse.findUnique({ where: { id } })
      if (!existingSeminar) {
        return apiError('Seminar not found', 404)
      }

      // 関連する登録があるかチェック
      const registrationCount = await prisma.registration.count({
        where: { courseId: id }
      })

      if (registrationCount > 0) {
        return apiError(
          `Cannot delete seminar with ${registrationCount} existing registrations`, 
          400
        )
      }

      await prisma.liveCourse.delete({
        where: { id }
      })

      return apiSuccess({ success: true, message: 'Seminar deleted successfully' })
    } catch (dbError) {
      return handleDatabaseError(dbError, 'delete seminar')
    }
  } catch (error) {
    console.error('Unexpected error in DELETE /api/admin/seminars/[id]:', error)
    return apiError('Internal server error')
  }
}