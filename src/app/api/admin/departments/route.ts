import { NextResponse } from 'next/server'

// Mock data for now - will connect to database later
const mockDepartments = [
  {
    id: '1',
    name: 'AI基礎学部',
    description: 'ChatGPTの使い方からAIの仕組みまで、基礎から丁寧に学習',
    image: null,
    color: '#3B82F6',
    coursesCount: 5
  },
  {
    id: '2', 
    name: '業務効率化学部',
    description: 'ExcelやOfficeツールとAIを組み合わせた実践的スキル',
    image: null,
    color: '#10B981',
    coursesCount: 8
  },
  {
    id: '3',
    name: '実践応用学部', 
    description: 'プログラミングとAIを活用した高度な課題解決手法',
    image: null,
    color: '#8B5CF6',
    coursesCount: 12
  }
]

export async function GET() {
  try {
    // In the future, this will fetch from database:
    // const departments = await prisma.department.findMany({
    //   include: {
    //     _count: {
    //       select: { courses: true }
    //     }
    //   }
    // })
    
    return NextResponse.json(mockDepartments)
  } catch (error) {
    console.error('Departments API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, color } = body

    // Basic validation
    if (!name) {
      return NextResponse.json({ error: '学部名は必須です' }, { status: 400 })
    }

    // In the future, this will create in database:
    // const department = await prisma.department.create({
    //   data: { name, description, color }
    // })

    const newDepartment = {
      id: Date.now().toString(),
      name,
      description,
      image: null,
      color: color || '#3B82F6',
      coursesCount: 0
    }

    return NextResponse.json(newDepartment, { status: 201 })
  } catch (error) {
    console.error('Create department error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}