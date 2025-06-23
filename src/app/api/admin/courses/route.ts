import { NextResponse, NextRequest } from 'next/server'

// Mock data for now - will connect to database later
const mockCourses = [
  {
    id: '1',
    title: 'ChatGPTの基本操作',
    description: 'ChatGPTの基本的な使い方を学びます',
    thumbnail: null,
    difficulty: 'beginner',
    duration: 45,
    videoUrl: null,
    status: 'published',
    departmentId: '1',
    department: { name: 'AI基礎学部' },
    lessonsCount: 5,
    enrolledCount: 124,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: '2',
    title: 'プロンプトエンジニアリング入門',
    description: '効果的なプロンプトの作り方を学習します',
    thumbnail: null,
    difficulty: 'intermediate',
    duration: 60,
    videoUrl: 'https://youtube.com/watch?v=example',
    status: 'published',
    departmentId: '1', 
    department: { name: 'AI基礎学部' },
    lessonsCount: 8,
    enrolledCount: 89,
    createdAt: '2024-01-18T14:00:00Z',
    updatedAt: '2024-01-25T09:15:00Z'
  },
  {
    id: '3',
    title: 'AIとは何か？基本概念の理解',
    description: 'AI・機械学習・深層学習の基本概念を学びます',
    thumbnail: null,
    difficulty: 'beginner',
    duration: 30,
    videoUrl: null,
    status: 'published',
    departmentId: '1',
    department: { name: 'AI基礎学部' },
    lessonsCount: 6,
    enrolledCount: 156,
    createdAt: '2024-01-10T09:30:00Z',
    updatedAt: '2024-01-12T16:45:00Z'
  },
  {
    id: '4',
    title: 'Excel×AI自動化テクニック',
    description: 'ExcelとAIを組み合わせた業務効率化手法',
    thumbnail: null,
    difficulty: 'intermediate',
    duration: 90,
    videoUrl: null,
    status: 'published',
    departmentId: '2',
    department: { name: '業務効率化学部' },
    lessonsCount: 10,
    enrolledCount: 203,
    createdAt: '2024-01-22T11:00:00Z',
    updatedAt: '2024-01-28T14:20:00Z'
  },
  {
    id: '5',
    title: 'PowerPoint資料作成の自動化',
    description: 'AIを活用したプレゼン資料の効率的な作成方法',
    thumbnail: null,
    difficulty: 'beginner',
    duration: 75,
    videoUrl: null,
    status: 'draft',
    departmentId: '2',
    department: { name: '業務効率化学部' },
    lessonsCount: 7,
    enrolledCount: 0,
    createdAt: '2024-02-01T13:45:00Z',
    updatedAt: '2024-02-01T13:45:00Z'
  },
  {
    id: '6',
    title: 'Python×AI実践プロジェクト',
    description: 'Pythonを使ったAI開発の実践的なプロジェクト',
    thumbnail: null,
    difficulty: 'advanced',
    duration: 120,
    videoUrl: 'https://vimeo.com/example',
    status: 'published',
    departmentId: '3',
    department: { name: '実践応用学部' },
    lessonsCount: 15,
    enrolledCount: 67,
    createdAt: '2024-01-25T16:20:00Z',
    updatedAt: '2024-02-02T10:30:00Z'
  }
]

export async function GET() {
  try {
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

    // モックデータに追加（実際のプロジェクトではDBに保存）
    mockCourses.unshift(newCourse)
    
    console.log('📊 現在の講義数:', mockCourses.length)

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