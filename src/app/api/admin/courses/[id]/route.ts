import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createAdminAuthChecker, apiError, apiSuccess, handleDatabaseError } from '@/lib/api-helpers'

// DELETE /api/admin/courses/[id] - 講義削除
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 管理者権限チェック
    const checkAdminAuth = createAdminAuthChecker()
    const { error } = await checkAdminAuth(auth)
    if (error) return error

    const params = await context.params
    const { id } = params

    // 講義の存在確認
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        enrollments: { select: { id: true } },
        lessons: { select: { id: true } }
      }
    })

    if (!course) {
      return apiError('講義が見つかりません', 404)
    }

    // 受講者がいる場合は削除を拒否
    if (course.enrollments.length > 0) {
      return apiError('受講者がいる講義は削除できません', 400)
    }

    // 講義を削除
    await prisma.course.delete({
      where: { id }
    })

    return apiSuccess({
      success: true,
      message: '講義が削除されました'
    })

  } catch (error) {
    console.error('講義削除エラー:', error)
    return handleDatabaseError(error, 'delete course')
  }
}

// PATCH /api/admin/courses/[id] - 講義更新
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 管理者権限チェック
    const checkAdminAuth = createAdminAuthChecker()
    const { error } = await checkAdminAuth(auth)
    if (error) return error

    const params = await context.params
    const { id } = params
    const data = await request.json()

    // 講義の存在確認
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    })

    if (!existingCourse) {
      return apiError('講義が見つかりません', 404)
    }

    // 講義を更新
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.departmentId && { departmentId: data.departmentId }),
        ...(data.level && { level: data.level }),
        ...(data.duration !== undefined && { duration: data.duration }),
        ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
        ...(data.thumbnail !== undefined && { thumbnail: data.thumbnail }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.isFree !== undefined && { isFree: data.isFree })
      },
      include: {
        department: {
          select: { name: true }
        }
      }
    })

    return apiSuccess(updatedCourse)

  } catch (error) {
    console.error('講義更新エラー:', error)
    return handleDatabaseError(error, 'update course')
  }
}