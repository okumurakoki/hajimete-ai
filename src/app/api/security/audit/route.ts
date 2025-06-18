import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { AccessControl, InputValidator } from '@/lib/security'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check admin access
    const isAdmin = await AccessControl.isAdmin(userId)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const { page, limit } = InputValidator.validatePaginationParams(
      searchParams.get('page') || undefined,
      searchParams.get('limit') || undefined
    )
    const action = searchParams.get('action')
    const resourceType = searchParams.get('resourceType')
    const userId_filter = searchParams.get('userId')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (action) where.action = { contains: action }
    if (resourceType) where.resourceType = resourceType
    if (userId_filter) where.userId = userId_filter

    // Mock audit logs data - replace with actual database call when Prisma is properly configured
    const logs = [
      {
        id: 'log-1',
        action: 'user.login',
        resourceType: 'user',
        resourceId: 'user-123',
        details: { ip: '192.168.1.1' },
        createdAt: new Date(),
        userId: 'user-123',
        user: {
          id: 'user-123',
          email: 'user@example.com',
          profile: {
            firstName: '太郎',
            lastName: '田中'
          }
        }
      }
    ].filter(log => {
      if (action && !log.action.includes(action)) return false
      if (resourceType && log.resourceType !== resourceType) return false
      if (userId_filter && log.userId !== userId_filter) return false
      return true
    }).slice(skip, skip + limit)
    
    const total = 1

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { action, resourceType, resourceId, details } = body

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    // Mock audit log creation - replace with actual database call when Prisma is properly configured
    const auditLog = {
      id: 'mock-audit-log-id',
      userId,
      action: InputValidator.sanitizeString(action, 100),
      resourceType: resourceType ? InputValidator.sanitizeString(resourceType, 50) : null,
      resourceId: resourceId ? InputValidator.sanitizeString(resourceId, 100) : null,
      details: details || {},
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || null,
      createdAt: new Date()
    }

    return NextResponse.json({ success: true, id: auditLog.id })
  } catch (error) {
    console.error('Error creating audit log:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}