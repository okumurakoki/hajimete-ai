 import { NextResponse } from 'next/server'
  import { PrismaClient } from '@prisma/client'

  const prisma = new PrismaClient()

  export async function GET() {
    try {
      const seminars = await prisma.seminar.findMany({
        include: {
          instructor: true
        },
        orderBy: { date: 'asc' }
      })

      return NextResponse.json(seminars)
    } catch (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch seminars' },
        { status: 500 }
      )
    }
  }
