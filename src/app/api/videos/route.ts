import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const department = searchParams.get('department')
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      status: 'published'
    }

    if (department) {
      where.department = {
        slug: department
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ]
    }

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        include: {
          department: true,
          instructor: {
            select: {
              name: true,
              avatarUrl: true
            }
          },
          progress: {
            where: {
              user: {
                clerkId: auth().userId || ''
              }
            }
          },
          _count: {
            select: {
              ratings: true,
              progress: true
            }
          }
        },
        orderBy: [
          { publishedAt: 'desc' },
          { viewCount: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.video.count({ where })
    ])

    return NextResponse.json({
      videos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user || user.plan !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const {
      title,
      description,
      departmentId,
      level,
      isPremium,
      instructorName,
      tags,
      vimeoId,
      thumbnailUrl,
      duration
    } = body

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const video = await prisma.video.create({
      data: {
        title,
        description,
        slug,
        departmentId,
        level,
        isPremium,
        instructorName,
        tags,
        vimeoId,
        thumbnailUrl,
        duration,
        status: 'draft',
        instructorId: user.id
      },
      include: {
        department: true,
        instructor: {
          select: {
            name: true,
            avatarUrl: true
          }
        }
      }
    })

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}