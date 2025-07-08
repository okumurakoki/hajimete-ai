import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Simple admin endpoint called')
    
    return NextResponse.json({
      success: true,
      message: 'Simple endpoint working',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Simple endpoint error:', error)
    return NextResponse.json({
      error: 'Simple endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}