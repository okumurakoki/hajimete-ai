import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { AccessControl, InputValidator } from '@/lib/security'

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth()
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

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.auditLog.count({ where })
    ])

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
    const { userId } = auth()
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

    // Log the audit event
    const auditLog = await prisma.auditLog.create({
      data: {
        userId,
        action: InputValidator.sanitizeString(action, 100),
        resourceType: resourceType ? InputValidator.sanitizeString(resourceType, 50) : null,
        resourceId: resourceId ? InputValidator.sanitizeString(resourceId, 100) : null,
        details: details || {},
        ipAddress: req.ip || req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null
      }
    })

    return NextResponse.json({ success: true, id: auditLog.id })
  } catch (error) {
    console.error('Error creating audit log:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}