import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createAdminAuthChecker, apiError, apiSuccess, handleDatabaseError } from '@/lib/api-helpers'

export async function GET() {
  console.log('🔍 GET /api/admin/seminars - Request started (v2 - Auth Fixed)')
  
  try {
    // 詳細ログ: リクエスト情報
    console.log('Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      CLERK_KEY_EXISTS: !!process.env.CLERK_SECRET_KEY,
      CLERK_PUB_KEY_EXISTS: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      DATABASE_URL_EXISTS: !!process.env.DATABASE_URL
    })

    // 管理者権限チェック
    console.log('🔐 Checking admin authentication...')
    
    // 直接認証チェック
    const authResult = await auth()
    if (!authResult?.userId) {
      return apiError('Unauthorized - No user session', 401)
    }
    
    console.log('✅ Basic auth successful:', authResult.userId)
    
    // 管理者権限チェック
    const admin = await prisma.admin.findUnique({
      where: { userId: authResult.userId }
    })
    
    if (!admin) {
      return apiError('Forbidden - Admin access required', 403)
    }
    
    console.log('✅ Admin access granted:', admin.role)

    // セミナー一覧取得
    console.log('📊 Fetching seminars from database...')
    try {
      // データベース接続テスト
      await prisma.$connect()
      console.log('✅ Prisma connected successfully')
      
      const seminars = await prisma.liveCourse.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          _count: {
            select: {
              registrations: {
                where: {
                  status: 'CONFIRMED'
                }
              }
            }
          }
        }
      })
      
      console.log(`📋 Found ${seminars.length} seminars`)

      // currentParticipants を計算して追加
      const seminarsWithParticipants = seminars.map(seminar => ({
        ...seminar,
        currentParticipants: seminar._count.registrations
      }))

      return apiSuccess(seminarsWithParticipants)
    } catch (dbError) {
      return handleDatabaseError(dbError, 'fetch seminars')
    }
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/seminars:', error)
    return apiError('Internal server error')
  }
}

export async function POST(request: NextRequest) {
  try {
    // 管理者権限チェック
    const authResult = await auth()
    if (!authResult?.userId) {
      return apiError('Unauthorized - No user session', 401)
    }
    
    const admin = await prisma.admin.findUnique({
      where: { userId: authResult.userId }
    })
    
    if (!admin) {
      return apiError('Forbidden - Admin access required', 403)
    }

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
          currentParticipants: 0,
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
      return handleDatabaseError(dbError, 'create seminar')
    }
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/seminars:', error)
    return apiError('Internal server error')
  }
}