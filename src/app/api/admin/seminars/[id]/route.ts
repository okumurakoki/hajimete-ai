import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

// Next.js 15 compatible route handlers

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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
    const params = await context.params
    const { id } = params

    // セミナーの存在確認
    const existingSeminar = await prisma.liveCourse.findUnique({ where: { id } })
    if (!existingSeminar) {
      return NextResponse.json({ error: 'Seminar not found' }, { status: 404 })
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

    return NextResponse.json(seminar)
  } catch (error) {
    console.error('Error updating seminar:', error)
    return NextResponse.json({ error: 'Failed to update seminar' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const params = await context.params
    const { id } = params

    // セミナーの存在確認
    const existingSeminar = await prisma.liveCourse.findUnique({ where: { id } })
    if (!existingSeminar) {
      return NextResponse.json({ error: 'Seminar not found' }, { status: 404 })
    }

    // 関連する登録があるかチェック
    const registrationCount = await prisma.registration.count({
      where: { courseId: id }
    })

    if (registrationCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete seminar with existing registrations' }, 
        { status: 400 }
      )
    }

    await prisma.liveCourse.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting seminar:', error)
    return NextResponse.json({ error: 'Failed to delete seminar' }, { status: 500 })
  }
}