import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'newest'
    const dateRange = searchParams.get('dateRange')

    // フィルター条件を構築
    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (dateRange && dateRange !== 'all') {
      const now = new Date()
      let startDate: Date
      
      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        default:
          startDate = new Date(0)
      }
      
      where.createdAt = {
        gte: startDate
      }
    }

    // ソート条件
    let orderBy: any = { createdAt: 'desc' }
    
    switch (sortBy) {
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'filename':
        orderBy = { filename: 'asc' }
        break
      case 'status':
        orderBy = { status: 'asc' }
        break
      case 'progress':
        orderBy = { progress: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    const uploads = await prisma.uploadTask.findMany({
      where,
      orderBy,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ uploads })

  } catch (error) {
    console.error('Error fetching upload tasks:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { filename, fileSize, mimeType, title, description, lessonId } = await request.json()

    if (!filename || !fileSize || !mimeType) {
      return NextResponse.json({ 
        error: 'Filename, fileSize, and mimeType are required' 
      }, { status: 400 })
    }

    // アップロードタスクを作成
    const uploadTask = await prisma.uploadTask.create({
      data: {
        userId,
        filename,
        fileSize,
        mimeType,
        title: title || null,
        description: description || null,
        lessonId: lessonId || null,
        status: 'PENDING',
        progress: 0
      }
    })

    return NextResponse.json({ uploadTask })

  } catch (error) {
    console.error('Error creating upload task:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}