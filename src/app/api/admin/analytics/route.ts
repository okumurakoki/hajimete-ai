import { NextResponse, NextRequest } from 'next/server'
import { getCourses } from '@/lib/mockData'
import { format, subDays, subMonths } from 'date-fns'

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

function generateDepartmentStats() {
  return [
    { name: 'AI基礎学部', students: 450, courses: 8, completion: 78 },
    { name: '業務効率化学部', students: 320, courses: 6, completion: 85 },
    { name: '実践応用学部', students: 180, courses: 4, completion: 72 }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'overview'

    console.log('📊 統計データ要求:', type)

    const courses = getCourses()

    switch (type) {
      case 'enrollment':
        // 受講者数推移データ
        const enrollmentData = {
          labels: generateTimeSeriesData(30).map(d => d.date),
          datasets: [{
            label: '新規受講者数',
            data: generateTimeSeriesData(30).map(d => d.value),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
          }]
        }
        return NextResponse.json({ type: 'enrollment', data: enrollmentData })

      case 'popular-courses':
        // 人気コースランキング
        const popularCourses = courses
          .sort((a, b) => b.enrolledCount - a.enrolledCount)
          .slice(0, 5)
          .map(course => ({
            id: course.id,
            title: course.title,
            enrolledCount: course.enrolledCount,
            department: course.department?.name,
            growth: Math.floor(Math.random() * 20) + 5 // ランダムな成長率
          }))
        return NextResponse.json({ type: 'popular-courses', data: popularCourses })

      case 'departments':
        // 部門別統計
        const departmentStats = generateDepartmentStats()
        return NextResponse.json({ type: 'departments', data: departmentStats })

      case 'kpi':
        // KPIメトリクス
        const totalStudents = courses.reduce((sum, course) => sum + course.enrolledCount, 0)
        const totalCourses = courses.length
        const avgCompletion = 79 // モック値
        const monthlyGrowth = 12.5 // モック値

        const kpiData = {
          totalStudents,
          totalCourses,
          avgCompletion,
          monthlyGrowth,
          activeCourses: courses.filter(c => c.status === 'published').length,
          draftCourses: courses.filter(c => c.status === 'draft').length
        }
        return NextResponse.json({ type: 'kpi', data: kpiData })

      case 'overview':
      default:
        // 概要データ
        const overviewData = {
          enrollmentTrend: generateTimeSeriesData(7),
          popularCourses: courses
            .sort((a, b) => b.enrolledCount - a.enrolledCount)
            .slice(0, 3),
          departmentStats: generateDepartmentStats(),
          kpi: {
            totalStudents: courses.reduce((sum, course) => sum + course.enrolledCount, 0),
            totalCourses: courses.length,
            avgCompletion: 79,
            monthlyGrowth: 12.5
          }
        }
        return NextResponse.json({ type: 'overview', data: overviewData })
    }

  } catch (error) {
    console.error('📊 統計API エラー:', error)
    return NextResponse.json(
      { error: '統計データの取得に失敗しました' },
      { status: 500 }
    )
  }
}