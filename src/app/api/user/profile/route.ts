import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ユーザープロフィールを取得（存在しない場合は作成）
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      // Clerkからユーザー情報を取得してデータベースに作成
      const client = await clerkClient()
      const clerkUser = await client.users.getUser(userId)
      
      const primaryEmail = clerkUser.emailAddresses.find(email => email.id === clerkUser.primaryEmailAddressId)

      if (!primaryEmail) {
        return NextResponse.json({ error: 'No email found' }, { status: 400 })
      }

      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: primaryEmail.emailAddress,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
        }
      })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { displayName, bio, emailNotifications, courseNotifications, marketingEmails } = body

    // ユーザープロフィールを更新
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        displayName: displayName || null,
        bio: bio || null,
        emailNotifications: emailNotifications ?? true,
        courseNotifications: courseNotifications ?? true,
        marketingEmails: marketingEmails ?? false,
        lastActiveAt: new Date(),
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ユーザーとすべての関連データを削除
    await prisma.user.delete({
      where: { clerkId: userId }
    })

    // Clerkからもユーザーを削除
    const client = await clerkClient()
    await client.users.deleteUser(userId)

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}