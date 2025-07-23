import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

// 検索用のスコアリング関数
function calculateSearchScore(item: any, query: string, filters: any = {}): number {
  if (!query.trim()) return 0
  
  const queryLower = query.toLowerCase()
  let score = 0
  
  // タイトルマッチ（最高得点）
  if (item.title?.toLowerCase().includes(queryLower)) {
    score += 100
  }
  
  // 説明マッチ
  if (item.description?.toLowerCase().includes(queryLower)) {
    score += 50
  }
  
  // タグマッチ
  if (item.tags?.toLowerCase().includes(queryLower)) {
    score += 30
  }
  
  // カテゴリマッチ
  if (item.category?.toLowerCase().includes(queryLower)) {
    score += 20
  }
  
  return score
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all' // all, courses, seminars
    const limit = parseInt(searchParams.get('limit') || '10')
    
    let results: any[] = []
    
    if (type === 'all' || type === 'courses') {
      // コース検索
      const courses = await prisma.course.findMany({
        where: {
          isActive: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { tags: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: {
          department: {
            select: { name: true }
          }
        },
        take: limit
      })
      
      const courseResults = courses.map(course => ({
        id: course.id,
        type: 'course',
        title: course.title,
        description: course.description,
        department: course.department.name,
        level: course.level,
        duration: course.duration,
        isFree: course.isFree,
        url: `/courses/${course.id}`,
        score: calculateSearchScore(course, query)
      }))
      
      results.push(...courseResults)
    }
    
    if (type === 'all' || type === 'seminars') {
      // セミナー検索
      const seminars = await prisma.liveCourse.findMany({
        where: {
          isActive: true,
          isPublished: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { tags: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: limit
      })
      
      const seminarResults = seminars.map(seminar => ({
        id: seminar.id,
        type: 'seminar',
        title: seminar.title,
        description: seminar.description,
        instructor: seminar.instructor,
        category: seminar.category,
        level: seminar.level,
        price: seminar.price,
        startDate: seminar.startDate,
        url: `/seminars/${seminar.id}`,
        score: calculateSearchScore(seminar, query)
      }))
      
      results.push(...seminarResults)
    }
    
    // スコアでソート
    results.sort((a, b) => b.score - a.score)
    
    return NextResponse.json({
      query,
      total: results.length,
      results: results.slice(0, limit)
    })
    
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}