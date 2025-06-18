import { NextResponse } from 'next/server'
  import { PrismaClient } from '@prisma/client'

  const prisma = new PrismaClient()

  export async function GET() {
    try {
      const departments = await prisma.department.findMany({
        orderBy: { sortOrder: 'asc' }
      })

      return NextResponse.json(departments)
    } catch (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch departments' },
        { status: 500 }
      )
    }
  }
