import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const courses = await prisma.liveCourse.findMany({
      where: {
        isActive: true,
        isPublished: true
      },
      orderBy: {
        startDate: 'asc'
      }
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching live courses:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}