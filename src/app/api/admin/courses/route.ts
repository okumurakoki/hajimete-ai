import { NextResponse, NextRequest } from 'next/server'
import { mockCourses, addCourse } from '@/lib/mockData'

// Mock data moved to shared module - see /src/lib/mockData.ts

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 現在のmockCourses件数:', mockCourses.length)
    console.log('📋 mockCourses内容:', mockCourses.map(c => ({
      id: c.id, 
      title: c.title,
      createdAt: c.createdAt
    })))
    
    // In the future, this will fetch from database:
    // const courses = await prisma.course.findMany({
    //   include: {
    //     department: { select: { name: true } },
    //     _count: {
    //       select: { lessons: true }
    //     }
    //   }
    // })
    
    return NextResponse.json(mockCourses)
  } catch (error) {
    console.error('Courses API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log('📝 受信したデータ:', data)
    
    // バリデーション
    if (!data.title || !data.departmentId) {
      console.error('❌ バリデーションエラー: タイトルまたは学部が不足')
      return NextResponse.json(
        { success: false, error: 'タイトルと学部は必須です' },
        { status: 400 }
      )
    }

    // 学部情報を取得
    const mockDepartments = [
      { id: '1', name: 'AI基礎学部' },
      { id: '2', name: '業務効率化学部' },
      { id: '3', name: '実践応用学部' }
    ]
    
    const department = mockDepartments.find(d => d.id === data.departmentId)
    console.log('🏢 見つかった学部:', department)

    // 新しい講義を作成
    const newCourse = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description || '',
      thumbnail: data.thumbnail || null,
      thumbnailFile: data.thumbnailFile || null,
      difficulty: data.difficulty || 'beginner',
      duration: data.duration || 30,
      videoUrl: data.videoUrl || null,
      status: data.status || 'draft',
      departmentId: data.departmentId,
      department: { name: department?.name || 'Unknown Department' },
      lessonsCount: 0,
      enrolledCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    console.log('🆕 作成された講義:', newCourse)

    // 共有データストアに追加
    addCourse(newCourse)

    return NextResponse.json({
      success: true,
      message: '講義が作成されました',
      course: newCourse
    }, { status: 201 })

  } catch (error) {
    console.error('💥 講義作成エラー:', error)
    return NextResponse.json(
      { success: false, error: '講義の作成に失敗しました' },
      { status: 500 }
    )
  }
}