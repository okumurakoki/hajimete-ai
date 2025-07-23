import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createAdminAuthChecker, apiError, apiSuccess, handleDatabaseError } from '@/lib/api-helpers'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    // 管理者権限チェック
    const checkAdminAuth = createAdminAuthChecker()
    const { error } = await checkAdminAuth(auth)
    if (error) return error

    const courses = await prisma.course.findMany({
      include: {
        department: {
          select: { name: true }
        },
        enrollments: {
          select: { id: true }
        },
        lessons: {
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      departmentId: course.departmentId,
      department: { name: course.department.name },
      lessonsCount: course.lessons.length,
      enrolledCount: course.enrollments.length,
      level: course.level,
      duration: course.duration,
      isActive: course.isActive,
      isFree: course.isFree,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    }))
    
    return NextResponse.json(formattedCourses)
  } catch (error) {
    console.error('Courses API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // 管理者権限チェック
    const checkAdminAuth = createAdminAuthChecker()
    const { error } = await checkAdminAuth(auth)
    if (error) return error

    const data = await request.json()
    
    // バリデーション
    if (!data.title || !data.departmentId) {
      return apiError('タイトルと学部は必須です', 400)
    }

    // 学部の存在確認
    const department = await prisma.department.findUnique({
      where: { id: data.departmentId }
    })
    
    if (!department) {
      return apiError('指定された学部が見つかりません', 404)
    }

    // 新しい講義を作成
    const newCourse = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description || '',
        departmentId: data.departmentId,
        level: data.level || 'BEGINNER',
        duration: data.duration || 30,
        videoUrl: data.videoUrl || null,
        thumbnail: data.thumbnail || null,
        isActive: data.isActive ?? true,
        isFree: data.isFree ?? false
      },
      include: {
        department: {
          select: { name: true }
        }
      }
    })

    return apiSuccess({
      success: true,
      message: '講義が作成されました',
      course: newCourse
    })

  } catch (error) {
    console.error('講義作成エラー:', error)
    return handleDatabaseError(error, 'create course')
  }
}