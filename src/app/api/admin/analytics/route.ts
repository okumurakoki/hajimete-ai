import { NextResponse, NextRequest } from 'next/server'
import { format, subDays, subMonths } from 'date-fns'
import { prisma } from '@/lib/prisma'
import { createAdminAuthChecker } from '@/lib/api-helpers'
import { auth } from '@clerk/nextjs/server'

// 統計データ生成用の補助関数
function generateTimeSeriesData(days: number) {
  const data = []
  for (let i = days; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const baseValue = Math.floor(Math.random() * 50) + 100
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      value: baseValue + Math.floor(Math.random() * 20)
    })
  }
  return data
}

export async function GET(request: NextRequest) {
  try {
    // 管理者権限チェック
    const checkAdminAuth = createAdminAuthChecker()
    const { error } = await checkAdminAuth(auth)
    if (error) return error

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'overview'

    switch (type) {
      case 'overview':
        // 基本統計の取得
        const [
          totalUsers,
          totalCourses,
          totalSeminars,
          totalRegistrations,
          recentUsers,
          recentEnrollments
        ] = await Promise.all([
          prisma.user.count(),
          prisma.course.count({ where: { isActive: true } }),
          prisma.liveCourse.count({ where: { isActive: true } }),
          prisma.registration.count(),
          prisma.user.count({
            where: {
              createdAt: {
                gte: subDays(new Date(), 30)
              }
            }
          }),
          prisma.enrollment.count({
            where: {
              createdAt: {
                gte: subDays(new Date(), 30)
              }
            }
          })
        ])

        return NextResponse.json({
          type: 'overview',
          data: {
            totalUsers,
            totalCourses,
            totalSeminars,
            totalRegistrations,
            recentUsers,
            recentEnrollments,
            userGrowth: generateTimeSeriesData(30),
            enrollmentGrowth: generateTimeSeriesData(30)
          }
        })

      case 'popular-courses':
        // 人気コースランキング
        const popularCourses = await prisma.course.findMany({
          where: { isActive: true },
          include: {
            department: { select: { name: true } },
            enrollments: { select: { id: true } }
          },
          orderBy: {
            enrollments: {
              _count: 'desc'
            }
          },
          take: 5
        })

        const courseData = popularCourses.map(course => ({
          id: course.id,
          title: course.title,
          enrolledCount: course.enrollments.length,
          department: course.department.name,
          growth: Math.floor(Math.random() * 20) + 5
        }))

        return NextResponse.json({ type: 'popular-courses', data: courseData })

      case 'departments':
        // 部門別統計
        const departments = await prisma.department.findMany({
          include: {
            courses: {
              include: {
                enrollments: { select: { id: true } }
              }
            }
          }
        })

        const departmentStats = departments.map(dept => ({
          name: dept.name,
          coursesCount: dept.courses.length,
          totalEnrollments: dept.courses.reduce((sum, course) => sum + course.enrollments.length, 0),
          color: dept.color || '#3B82F6'
        }))

        return NextResponse.json({ type: 'departments', data: departmentStats })

      case 'seminars':
        // セミナー統計
        const seminars = await prisma.liveCourse.findMany({
          where: { isActive: true },
          include: {
            registrations: {
              where: { status: 'CONFIRMED' }
            }
          }
        })

        const seminarStats = seminars.map(seminar => ({
          id: seminar.id,
          title: seminar.title,
          registrations: seminar.registrations.length,
          capacity: seminar.maxParticipants,
          utilizationRate: Math.round((seminar.registrations.length / seminar.maxParticipants) * 100),
          startDate: seminar.startDate
        }))

        return NextResponse.json({ type: 'seminars', data: seminarStats })

      default:
        return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 })
    }

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}