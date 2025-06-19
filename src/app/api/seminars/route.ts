import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { seminarDatabase, initializeDatabase } from '@/lib/database'

export async function GET(req: NextRequest) {
  try {
    // Initialize database with demo data
    await initializeDatabase()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'scheduled'
    const isPremium = searchParams.get('isPremium')
    const department = searchParams.get('department')
    const limit = parseInt(searchParams.get('limit') || '20')

    const filters: any = { limit }

    if (status && status !== 'upcoming') {
      filters.status = status
    } else if (status === 'upcoming') {
      filters.status = 'scheduled'
    }

    if (isPremium !== null) {
      filters.isPremium = isPremium === 'true'
    }

    if (department) {
      filters.department = department
    }

    // Get seminars from database
    const seminars = await seminarDatabase.findAll(filters)

    // Transform database records to API format
    const transformedSeminars = seminars.map(seminar => ({
      id: seminar.id,
      title: seminar.title,
      description: seminar.description,
      date: seminar.scheduled_date,
      duration: seminar.duration,
      capacity: seminar.max_participants || 50,
      registeredCount: Math.floor(Math.random() * (seminar.max_participants || 50)), // Mock
      status: seminar.status === 'scheduled' ? 'upcoming' : seminar.status,
      isPremium: seminar.is_premium,
      instructor: {
        id: 'instructor-1',
        name: seminar.instructor_name,
        bio: 'AI研究者',
        avatarUrl: '/avatars/instructor1.jpg',
        specialties: ['AI', 'ビジネス活用']
      },
      registrations: [],
      _count: {
        registrations: Math.floor(Math.random() * (seminar.max_participants || 50))
      }
    }))

    return NextResponse.json({ seminars: transformedSeminars })
  } catch (error) {
    console.error('Error fetching seminars:', error)
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
    
    // Check if this is a seminar registration (has seminarId) or seminar creation
    if (body.seminarId) {
      // This is a seminar registration request
      const { seminarId } = body

      // Mock user data
      const user = {
        id: 'mock-user-id',
        clerkId: userId,
        plan: 'premium'
      }

      // Mock seminar data
      const seminar = {
        id: seminarId,
        title: 'AI基礎セミナー',
        capacity: 50,
        isPremium: false,
        _count: {
          registrations: 25
        }
      }

      // Check if seminar is full
      if (seminar._count.registrations >= seminar.capacity) {
        return NextResponse.json(
          { error: 'Seminar is full' },
          { status: 400 }
        )
      }

      // Check if premium seminar and user has premium plan
      if (seminar.isPremium && user.plan !== 'premium') {
        return NextResponse.json(
          { error: 'Premium plan required for this seminar' },
          { status: 403 }
        )
      }

      // Mock registration creation
      const registration = {
        id: 'mock-registration-id',
        userId: user.id,
        seminarId,
        registeredAt: new Date()
      }

      return NextResponse.json({ 
        success: true,
        registration,
        seminar
      })
    } else {
      // This is a seminar creation request
      const {
        title,
        description,
        instructor,
        instructorEmail,
        department,
        type,
        scheduledDate,
        duration,
        capacity,
        isPremium,
        registrationRequired,
        autoRecording,
        waitingRoom,
        price,
        tags
      } = body

      if (!title || !instructor || !instructorEmail || !department || !scheduledDate) {
        return NextResponse.json(
          { error: 'Required fields: title, instructor, instructorEmail, department, scheduledDate' },
          { status: 400 }
        )
      }

      // Initialize database
      await initializeDatabase()

      // Create seminar record for database
      const seminarData = {
        id: `seminar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title,
        description: description || '',
        zoom_meeting_id: undefined,
        zoom_webinar_id: undefined,
        zoom_join_url: undefined,
        zoom_start_url: undefined,
        zoom_password: undefined,
        type: type as 'meeting' | 'webinar' || 'meeting',
        department,
        is_premium: isPremium || false,
        scheduled_date: new Date(scheduledDate),
        duration: duration || 120,
        max_participants: capacity || 50,
        instructor_name: instructor,
        instructor_email: instructorEmail,
        status: 'scheduled' as const,
        registration_required: registrationRequired !== false,
        auto_recording: autoRecording || false,
        waiting_room: waitingRoom !== false,
        price_free: price || 5500,
        price_basic: price || 5500,
        price_premium: isPremium ? Math.round((price || 5500) * 0.8) : (price || 5500)
      }

      // Save to database
      const savedSeminar = await seminarDatabase.create(seminarData)

      return NextResponse.json({
        success: true,
        data: {
          id: savedSeminar.id,
          title: savedSeminar.title,
          description: savedSeminar.description,
          department: savedSeminar.department,
          scheduledDate: savedSeminar.scheduled_date.toISOString(),
          duration: savedSeminar.duration,
          status: savedSeminar.status,
          isPremium: savedSeminar.is_premium
        }
      }, { status: 201 })
    }
  } catch (error) {
    console.error('Error in seminars API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}