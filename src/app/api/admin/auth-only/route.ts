import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    console.log('Auth-only endpoint called')
    
    const authResult = await auth()
    
    return NextResponse.json({
      success: true,
      hasAuth: !!authResult,
      userId: authResult?.userId || null,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Auth-only endpoint error:', error)
    return NextResponse.json({
      error: 'Auth-only endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}