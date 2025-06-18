import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const includeVideos = searchParams.get('includeVideos') === 'true'

    const departments = await prisma.department.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        ...(includeVideos && {
          videos: {
            where: { status: 'published' },
            orderBy: { viewCount: 'desc' },
            take: 6,
            include: {
              instructor: {
                select: {
                  name: true,
                  avatarUrl: true
                }
              },
              _count: {
                select: {
                  progress: true,
                  ratings: true
                }
              }
            }
          }
        }),
        _count: {
          select: {
            videos: {
              where: { status: 'published' }
            }
          }
        }
      }
    })

    return NextResponse.json({ departments })
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // This would require admin authentication
    // For now, returning method not allowed
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  } catch (error) {
    console.error('Error creating department:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}