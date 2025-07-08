import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function apiError(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status })
}

function apiSuccess(data: any) {
  return NextResponse.json(data)
}

export async function GET() {
  console.log('🔍 GET /api/admin/seminars-bypass - No auth version')
  
  try {
    // 認証をバイパス - 開発/テスト用
    console.log('⚠️ BYPASSING AUTH FOR TESTING')
    
    // セミナー一覧取得
    console.log('📊 Fetching seminars from database...')
    try {
      // より安全なデータベース接続
      console.log('Database URL exists:', !!process.env.DATABASE_URL)
      
      const seminars = await prisma.liveCourse.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          registrations: {
            where: {
              status: 'CONFIRMED'
            }
          }
        }
      })
      
      console.log(`📋 Found ${seminars.length} seminars`)

      // currentParticipants を計算して追加
      const seminarsWithParticipants = seminars.map(seminar => ({
        ...seminar,
        currentParticipants: seminar.registrations.length
      }))

      return apiSuccess(seminarsWithParticipants)
    } catch (dbError) {
      console.error('💥 Database error in seminar fetch:', dbError)
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error'
      return apiError(`Database error: ${errorMessage}`, 500)
    }
  } catch (error) {
    console.error('💥 Unexpected error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return apiError(`Internal server error: ${errorMessage}`, 500)
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('⚠️ POST BYPASSING AUTH FOR TESTING')
    
    const data = await request.json()

    // バリデーション
    if (!data.title || !data.instructor || !data.startDate || !data.endDate) {
      return apiError('Required fields missing: title, instructor, startDate, endDate', 400)
    }

    if (new Date(data.startDate) >= new Date(data.endDate)) {
      return apiError('End date must be after start date', 400)
    }

    // セミナー作成
    try {
      const seminar = await prisma.liveCourse.create({
        data: {
          title: data.title,
          description: data.description,
          instructor: data.instructor,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          duration: data.duration,
          price: data.price,
          level: data.level,
          category: data.category,
          maxParticipants: data.maxParticipants,
          zoomUrl: data.zoomUrl || null,
          zoomId: data.zoomId || null,
          zoomPassword: data.zoomPassword || null,
          curriculum: data.curriculum || null,
          tags: data.tags || null,
          isPublished: data.isPublished || false,
          isActive: true
        }
      })

      return apiSuccess(seminar)
    } catch (dbError) {
      console.error('💥 Database error in seminar creation:', dbError)
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error'
      return apiError(`Database error: ${errorMessage}`, 500)
    }
  } catch (error) {
    console.error('💥 Unexpected error in POST:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return apiError(`Internal server error: ${errorMessage}`, 500)
  } finally {
    await prisma.$disconnect()
  }
}