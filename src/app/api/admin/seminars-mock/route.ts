import { NextRequest, NextResponse } from 'next/server'

function apiError(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status })
}

function apiSuccess(data: any) {
  return NextResponse.json(data)
}

// モックデータ
const mockSeminars = [
  {
    id: '1',
    title: 'ChatGPT活用セミナー 基礎編',
    description: 'ChatGPTを使った効率的な業務改善方法を学びます',
    instructor: '山田太郎',
    startDate: '2025-07-15T19:00:00.000Z',
    endDate: '2025-07-15T20:30:00.000Z',
    duration: 90,
    price: 3000,
    level: 'BEGINNER',
    category: 'AI基礎',
    maxParticipants: 50,
    currentParticipants: 12,
    tags: 'ChatGPT,AI,基礎',
    isActive: true,
    isPublished: true,
    zoomUrl: 'https://zoom.us/j/example1',
    zoomId: '123456789',
    zoomPassword: 'ai2025',
    curriculum: null,
    registrations: [],
    createdAt: '2025-07-08T00:00:00.000Z',
    updatedAt: '2025-07-08T00:00:00.000Z'
  },
  {
    id: '2',
    title: 'Notion AI 実践活用術',
    description: 'Notion AIを活用したドキュメント作成とデータ管理の効率化',
    instructor: '佐藤花子',
    startDate: '2025-07-20T14:00:00.000Z',
    endDate: '2025-07-20T16:00:00.000Z',
    duration: 120,
    price: 5000,
    level: 'INTERMEDIATE',
    category: '生産性向上',
    maxParticipants: 30,
    currentParticipants: 8,
    tags: 'Notion,AI,生産性',
    isActive: true,
    isPublished: true,
    zoomUrl: 'https://zoom.us/j/example2',
    zoomId: '987654321',
    zoomPassword: 'notion2025',
    curriculum: null,
    registrations: [],
    createdAt: '2025-07-08T01:00:00.000Z',
    updatedAt: '2025-07-08T01:00:00.000Z'
  },
  {
    id: '3',
    title: 'AIプロンプト エンジニアリング',
    description: '効果的なAIプロンプトの書き方とテクニック',
    instructor: '田中一郎',
    startDate: '2025-07-25T19:30:00.000Z',
    endDate: '2025-07-25T21:00:00.000Z',
    duration: 90,
    price: 4000,
    level: 'ADVANCED',
    category: 'AI開発',
    maxParticipants: 25,
    currentParticipants: 18,
    tags: 'プロンプト,AI,上級',
    isActive: true,
    isPublished: true,
    zoomUrl: 'https://zoom.us/j/example3',
    zoomId: '555666777',
    zoomPassword: 'prompt2025',
    curriculum: null,
    registrations: [],
    createdAt: '2025-07-08T02:00:00.000Z',
    updatedAt: '2025-07-08T02:00:00.000Z'
  }
]

export async function GET() {
  console.log('🔍 GET /api/admin/seminars-mock - Mock data version')
  
  try {
    console.log('📊 Returning mock seminar data...')
    
    // モックデータにcurrentParticipantsを追加
    const seminarsWithParticipants = mockSeminars.map(seminar => ({
      ...seminar,
      currentParticipants: seminar.registrations.length
    }))

    console.log(`📋 Returning ${seminarsWithParticipants.length} mock seminars`)
    return apiSuccess(seminarsWithParticipants)
    
  } catch (error) {
    console.error('💥 Unexpected error in mock endpoint:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return apiError(`Internal server error: ${errorMessage}`, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 POST /api/admin/seminars-mock - Creating mock seminar')
    
    const data = await request.json()

    // バリデーション
    if (!data.title || !data.instructor || !data.startDate || !data.endDate) {
      return apiError('Required fields missing: title, instructor, startDate, endDate', 400)
    }

    if (new Date(data.startDate) >= new Date(data.endDate)) {
      return apiError('End date must be after start date', 400)
    }

    // 新しいモックセミナーを作成
    const newSeminar = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description || '',
      instructor: data.instructor,
      startDate: data.startDate,
      endDate: data.endDate,
      duration: data.duration || 90,
      price: data.price || 0,
      level: data.level || 'BEGINNER',
      category: data.category || 'その他',
      maxParticipants: data.maxParticipants || 50,
      currentParticipants: 0,
      tags: data.tags || '',
      isActive: true,
      isPublished: data.isPublished || false,
      zoomUrl: data.zoomUrl || null,
      zoomId: data.zoomId || null,
      zoomPassword: data.zoomPassword || null,
      curriculum: data.curriculum || null,
      registrations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // メモリ内のモックデータに追加（実際のDBには保存されない）
    mockSeminars.push(newSeminar)

    console.log('✅ Mock seminar created:', newSeminar.title)
    return apiSuccess(newSeminar)
    
  } catch (error) {
    console.error('💥 Unexpected error in POST mock endpoint:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return apiError(`Internal server error: ${errorMessage}`, 500)
  }
}