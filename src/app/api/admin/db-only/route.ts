import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('DB-only endpoint called')
    
    await prisma.$connect()
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      success: true,
      userCount,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('DB-only endpoint error:', error)
    return NextResponse.json({
      error: 'DB-only endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}