import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { emailService } from '@/lib/email'

export async function POST() {
  try {
    console.log('📅 Checking for courses that need reminder emails...')

    // 24時間後から25時間後の間に開始する講座を取得
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const dayAfterTomorrow = new Date(now.getTime() + 25 * 60 * 60 * 1000)

    const upcomingCourses = await prisma.liveCourse.findMany({
      where: {
        startDate: {
          gte: tomorrow,
          lt: dayAfterTomorrow
        },
        isActive: true,
        isPublished: true
      },
      include: {
        registrations: {
          where: {
            status: 'CONFIRMED'
          },
          include: {
            user: true
          }
        }
      }
    })

    console.log(`Found ${upcomingCourses.length} courses starting in 24 hours`)

    let emailsSent = 0
    let emailsFailed = 0

    for (const course of upcomingCourses) {
      console.log(`Processing course: ${course.title}`)
      
      for (const registration of course.registrations) {
        try {
          const emailData = {
            userEmail: registration.user.email,
            userName: registration.user.displayName || 
                     `${registration.user.firstName || ''} ${registration.user.lastName || ''}`.trim() || 
                     '受講者',
            course: {
              id: course.id,
              title: course.title,
              instructor: course.instructor,
              startDate: course.startDate.toISOString(),
              endDate: course.endDate.toISOString(),
              zoomUrl: course.zoomUrl || undefined,
              zoomId: course.zoomId || undefined,
              zoomPassword: course.zoomPassword || undefined
            }
          }

          const emailSent = await emailService.sendZoomInvite(emailData)
          
          if (emailSent) {
            emailsSent++
            console.log(`✅ Reminder sent to: ${registration.user.email}`)
          } else {
            emailsFailed++
            console.error(`❌ Failed to send reminder to: ${registration.user.email}`)
          }

          // API レート制限を避けるため少し待機
          await new Promise(resolve => setTimeout(resolve, 100))

        } catch (error) {
          emailsFailed++
          console.error(`❌ Error sending reminder to ${registration.user.email}:`, error)
        }
      }
    }

    return NextResponse.json({
      success: true,
      coursesProcessed: upcomingCourses.length,
      emailsSent,
      emailsFailed,
      message: `Processed ${upcomingCourses.length} courses, sent ${emailsSent} emails, ${emailsFailed} failed`
    })

  } catch (error) {
    console.error('❌ Error in send-reminders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 手動で即座にリマインダーを送信（開発・テスト用）
export async function GET() {
  try {
    console.log('🔧 Manual reminder check triggered')

    // 今日から7日後までの講座を取得（テスト用）
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const upcomingCourses = await prisma.liveCourse.findMany({
      where: {
        startDate: {
          gte: now,
          lt: nextWeek
        },
        isActive: true,
        isPublished: true
      },
      include: {
        registrations: {
          where: {
            status: 'CONFIRMED'
          },
          include: {
            user: true
          }
        }
      },
      take: 5 // テスト用に最大5講座まで
    })

    const courseInfo = upcomingCourses.map(course => ({
      id: course.id,
      title: course.title,
      startDate: course.startDate,
      registrationCount: course.registrations.length
    }))

    return NextResponse.json({
      success: true,
      upcomingCourses: courseInfo,
      message: `Found ${upcomingCourses.length} upcoming courses with ${upcomingCourses.reduce((sum, c) => sum + c.registrations.length, 0)} total registrations`
    })

  } catch (error) {
    console.error('❌ Error in manual reminder check:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}