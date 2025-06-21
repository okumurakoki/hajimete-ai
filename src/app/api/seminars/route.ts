  import { NextResponse } from 'next/server'

  export async function GET() {
    try {
      const seminars = [
        {
          id: '1',
          title: 'ChatGPT Workshop',
          description: 'Learn ChatGPT for business efficiency',
          date: '2024-06-25',
          startTime: '14:00',
          endTime: '16:00',
          capacity: 50,
          registeredCount: 35,
          isPremium: false,
          status: 'upcoming'
        }
      ]

      return NextResponse.json(seminars)
    } catch (error) {
      console.error('Error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch seminars' },
        { status: 500 }
      )
    }
  }
