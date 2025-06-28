import { NextResponse, NextRequest } from 'next/server'
import { getCourses } from '@/lib/mockData'

// 検索用のスコアリング関数
function calculateSearchScore(item: any, query: string, filters: any = {}): number {
  if (!query.trim()) return 0
  
  const queryLower = query.toLowerCase()
  let score = 0
  
  // タイトルでの完全一致（最高スコア）
  if (item.title?.toLowerCase().includes(queryLower)) {
    score += 100
    if (item.title?.toLowerCase().startsWith(queryLower)) score += 50
  }
  
  // 説明文での一致
  if (item.description?.toLowerCase().includes(queryLower)) {
    score += 50
  }
  
  // 学部名での一致
  if (item.department?.name?.toLowerCase().includes(queryLower)) {
    score += 30
  }
  
  // 難易度での一致
  if (item.difficulty?.toLowerCase().includes(queryLower)) {
    score += 20
  }
  
  // ファジー検索（レーベンシュタイン距離の簡易版）
  const titleWords = item.title?.toLowerCase().split(' ') || []
  titleWords.forEach((word: string) => {
    if (word.includes(queryLower) || queryLower.includes(word)) {
      score += 10
    }
  })
  
  return score
}

// ファジー検索のためのレーベンシュタイン距離計算
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = []
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}

// 高度なフィルタリング関数
function applyFilters(courses: any[], filters: any): any[] {
  return courses.filter(course => {
    // 学部フィルター
    if (filters.departments && filters.departments.length > 0) {
      if (!filters.departments.includes(course.departmentId)) return false
    }
    
    // 難易度フィルター
    if (filters.difficulties && filters.difficulties.length > 0) {
      if (!filters.difficulties.includes(course.difficulty)) return false
    }
    
    // ステータスフィルター
    if (filters.status && filters.status !== 'all') {
      if (course.status !== filters.status) return false
    }
    
    // 期間フィルター
    if (filters.duration) {
      const { min, max } = filters.duration
      if (min && course.duration < min) return false
      if (max && course.duration > max) return false
    }
    
    // 受講者数フィルター
    if (filters.enrolledCount) {
      const { min, max } = filters.enrolledCount
      if (min && course.enrolledCount < min) return false
      if (max && course.enrolledCount > max) return false
    }
    
    // 作成日フィルター
    if (filters.dateRange) {
      const courseDate = new Date(course.createdAt)
      if (filters.dateRange.start && courseDate < new Date(filters.dateRange.start)) return false
      if (filters.dateRange.end && courseDate > new Date(filters.dateRange.end)) return false
    }
    
    return true
  })
}

// 検索候補生成
function generateSuggestions(query: string, courses: any[]): string[] {
  if (!query.trim()) return []
  
  const suggestions = new Set<string>()
  const queryLower = query.toLowerCase()
  
  courses.forEach(course => {
    // タイトルからの候補
    if (course.title?.toLowerCase().includes(queryLower)) {
      suggestions.add(course.title)
    }
    
    // 学部からの候補
    if (course.department?.name?.toLowerCase().includes(queryLower)) {
      suggestions.add(course.department.name)
    }
    
    // 難易度からの候補
    const difficultyLabels = {
      beginner: '初級',
      intermediate: '中級', 
      advanced: '上級'
    }
    const difficultyLabel = difficultyLabels[course.difficulty as keyof typeof difficultyLabels]
    if (difficultyLabel?.includes(queryLower)) {
      suggestions.add(difficultyLabel)
    }
  })
  
  return Array.from(suggestions).slice(0, 5)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'courses'
    const sortBy = searchParams.get('sort') || 'relevance'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // フィルター解析
    const filters = {
      departments: searchParams.get('departments')?.split(',').filter(Boolean) || [],
      difficulties: searchParams.get('difficulties')?.split(',').filter(Boolean) || [],
      status: searchParams.get('status') || 'all',
      duration: {
        min: searchParams.get('durationMin') ? parseInt(searchParams.get('durationMin')!) : null,
        max: searchParams.get('durationMax') ? parseInt(searchParams.get('durationMax')!) : null
      },
      enrolledCount: {
        min: searchParams.get('enrolledMin') ? parseInt(searchParams.get('enrolledMin')!) : null,
        max: searchParams.get('enrolledMax') ? parseInt(searchParams.get('enrolledMax')!) : null
      },
      dateRange: {
        start: searchParams.get('dateStart') || null,
        end: searchParams.get('dateEnd') || null
      }
    }

    console.log('🔍 検索クエリ:', { query, filters, sortBy, page, limit })

    const allCourses = getCourses()
    
    // 検索候補を生成（クエリがある場合）
    if (searchParams.get('suggestions') === 'true') {
      const suggestions = generateSuggestions(query, allCourses)
      return NextResponse.json({
        suggestions,
        query
      })
    }

    let results = [...allCourses]

    // フィルター適用
    results = applyFilters(results, filters)

    // 検索クエリがある場合はスコアリング
    if (query.trim()) {
      results = results
        .map(course => ({
          ...course,
          searchScore: calculateSearchScore(course, query, filters)
        }))
        .filter(course => course.searchScore > 0)
    }

    // ソート
    switch (sortBy) {
      case 'relevance':
        if (query.trim()) {
          results.sort((a, b) => {
            const getScore = (item: any) => item.searchScore || 0
            return getScore(b) - getScore(a)
          })
        } else {
          results.sort((a, b) => b.enrolledCount - a.enrolledCount)
        }
        break
      case 'title':
        results.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'date':
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'popularity':
        results.sort((a, b) => b.enrolledCount - a.enrolledCount)
        break
      case 'duration':
        results.sort((a, b) => a.duration - b.duration)
        break
    }

    // ページネーション
    const totalResults = results.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedResults = results.slice(startIndex, endIndex)

    // 検索結果のハイライト情報を追加
    const highlightedResults = paginatedResults.map(course => ({
      ...course,
      highlights: query.trim() ? {
        title: course.title?.toLowerCase().includes(query.toLowerCase()) ? query : null,
        description: course.description?.toLowerCase().includes(query.toLowerCase()) ? query : null,
        department: course.department?.name?.toLowerCase().includes(query.toLowerCase()) ? query : null
      } : null
    }))

    return NextResponse.json({
      results: highlightedResults,
      totalResults,
      currentPage: page,
      totalPages: Math.ceil(totalResults / limit),
      hasNextPage: page < Math.ceil(totalResults / limit),
      hasPrevPage: page > 1,
      query,
      filters,
      sortBy,
      suggestions: query.trim() ? generateSuggestions(query, allCourses) : []
    })

  } catch (error) {
    console.error('🔍 検索API エラー:', error)
    return NextResponse.json(
      { error: '検索処理に失敗しました' },
      { status: 500 }
    )
  }
}