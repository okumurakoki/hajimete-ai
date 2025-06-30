import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const discountRules = await prisma.discountRule.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        minCourses: 'asc'
      }
    })

    return NextResponse.json(discountRules)
  } catch (error) {
    console.error('Error fetching discount rules:', error)
    return NextResponse.json({ error: 'Failed to fetch discount rules' }, { status: 500 })
  }
}