import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔍 Admin test endpoint called')
    
    // 認証テスト
    const authResult = await auth()
    console.log('Auth result:', !!authResult?.userId)
    
    if (!authResult?.userId) {
      return NextResponse.json({ 
        error: 'No auth',
        details: 'User not authenticated' 
      }, { status: 401 })
    }
    
    // データベーステスト
    try {
      await prisma.$connect()
      console.log('Database connected successfully')
      
      const userCount = await prisma.user.count()
      console.log('User count:', userCount)
      
      return NextResponse.json({
        success: true,
        userId: authResult.userId,
        userCount,
        timestamp: new Date().toISOString()
      })
      
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({
        error: 'Database error',
        details: dbError.message
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json({
      error: 'Internal error',
      details: error.message
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}