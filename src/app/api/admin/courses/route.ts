import { NextResponse } from 'next/server'

// Mock data for now - will connect to database later
const mockCourses = [
  {
    id: '1',
    title: 'ChatGPTの基本操作',
    description: 'ChatGPTの基本的な使い方を学びます',
    thumbnail: null,
    departmentId: '1',
    department: { name: 'AI基礎学部' },
    lessonsCount: 5
  },
  {
    id: '2',
    title: 'プロンプトエンジニアリング入門',
    description: '効果的なプロンプトの作り方を学習します',
    thumbnail: null,
    departmentId: '1', 
    department: { name: 'AI基礎学部' },
    lessonsCount: 8
  },
  {
    id: '3',
    title: 'AIとは何か？基本概念の理解',
    description: 'AI・機械学習・深層学習の基本概念を学びます',
    thumbnail: null,
    departmentId: '1',
    department: { name: 'AI基礎学部' },
    lessonsCount: 6
  },
  {
    id: '4',
    title: 'Excel×AI自動化テクニック',
    description: 'ExcelとAIを組み合わせた業務効率化手法',
    thumbnail: null,
    departmentId: '2',
    department: { name: '業務効率化学部' },
    lessonsCount: 10
  },
  {
    id: '5',
    title: 'PowerPoint資料作成の自動化',
    description: 'AIを活用したプレゼン資料の効率的な作成方法',
    thumbnail: null,
    departmentId: '2',
    department: { name: '業務効率化学部' },
    lessonsCount: 7
  },
  {
    id: '6',
    title: 'Python×AI実践プロジェクト',
    description: 'Pythonを使ったAI開発の実践的なプロジェクト',
    thumbnail: null,
    departmentId: '3',
    department: { name: '実践応用学部' },
    lessonsCount: 15
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, departmentId, thumbnail, thumbnailFile, difficulty, duration, videoUrl, status } = body

    // Basic validation
    if (!title || !departmentId) {
      return NextResponse.json({ error: 'タイトルと学部は必須です' }, { status: 400 })
    }

    // In the future, this will create in database:
    // const course = await prisma.course.create({
    //   data: { title, description, departmentId, thumbnail, difficulty, duration, videoUrl, status },
    //   include: { department: { select: { name: true } } }
    // })

    // Mock departments for now
    const mockDepartments = [
      { id: '1', name: 'AI基礎学部' },
      { id: '2', name: '業務効率化学部' },
      { id: '3', name: '実践応用学部' }
    ]

    const department = mockDepartments.find(d => d.id === departmentId)

    const newCourse = {
      id: Date.now().toString(),
      title,
      description,
      thumbnail,
      thumbnailFile,
      difficulty: difficulty || 'beginner',
      duration: duration || 30,
      videoUrl,
      status: status || 'draft',
      departmentId,
      department: { name: department?.name || 'Unknown Department' },
      lessonsCount: 0
    }

    return NextResponse.json(newCourse, { status: 201 })
  } catch (error) {
    console.error('Create course error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}