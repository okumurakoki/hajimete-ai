import { NextResponse } from 'next/server'
  import { PrismaClient } from '@prisma/client'

  const prisma = new PrismaClient()

  export async function GET() {
    try {
      const videos = await prisma.video.findMany({
        include: {
          department: true
        },
        orderBy: { publishedAt: 'desc' }
      })

      return NextResponse.json(videos)
    } catch (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch videos' },
        { status: 500 }
      )
    }
  }
