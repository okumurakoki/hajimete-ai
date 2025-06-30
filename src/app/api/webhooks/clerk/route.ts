import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { prisma } from '@/lib/prisma'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

type ClerkEvent = {
  type: string
  data: {
    id: string
    email_addresses: Array<{
      email_address: string
      id: string
    }>
    first_name?: string
    last_name?: string
    image_url?: string
    username?: string
    created_at: number
    updated_at: number
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!webhookSecret) {
      console.warn('CLERK_WEBHOOK_SECRET not configured, skipping webhook verification')
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 501 })
    }

    // Get headers
    const headerPayload = await headers()
    const svixId = headerPayload.get('svix-id')
    const svixTimestamp = headerPayload.get('svix-timestamp')
    const svixSignature = headerPayload.get('svix-signature')

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
    }

    // Get body
    const payload = await req.text()

    // Verify webhook
    const wh = new Webhook(webhookSecret)
    let evt: ClerkEvent

    try {
      evt = wh.verify(payload, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as ClerkEvent
    } catch (err) {
      console.error('Error verifying webhook:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('📧 Clerk webhook received:', evt.type)

    // Handle different event types
    switch (evt.type) {
      case 'user.created':
        await handleUserCreated(evt.data)
        break
      case 'user.updated':
        await handleUserUpdated(evt.data)
        break
      case 'user.deleted':
        await handleUserDeleted(evt.data.id)
        break
      default:
        console.log(`🤷‍♂️ Unhandled event type: ${evt.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleUserCreated(userData: ClerkEvent['data']) {
  try {
    const primaryEmail = userData.email_addresses.find(email => email.id === userData.email_addresses[0]?.id)

    if (!primaryEmail) {
      console.error('❌ No primary email found for user:', userData.id)
      return
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userData.id }
    })

    if (existingUser) {
      console.log('👤 User already exists:', userData.id)
      return
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        clerkId: userData.id,
        email: primaryEmail.email_address,
        firstName: userData.first_name || null,
        lastName: userData.last_name || null,
        imageUrl: userData.image_url || null,
      }
    })

    console.log('✅ User created in database:', newUser.id)
  } catch (error) {
    console.error('❌ Error creating user:', error)
  }
}

async function handleUserUpdated(userData: ClerkEvent['data']) {
  try {
    const primaryEmail = userData.email_addresses.find(email => email.id === userData.email_addresses[0]?.id)

    if (!primaryEmail) {
      console.error('❌ No primary email found for user:', userData.id)
      return
    }

    // Update existing user
    const updatedUser = await prisma.user.update({
      where: { clerkId: userData.id },
      data: {
        email: primaryEmail.email_address,
        firstName: userData.first_name || null,
        lastName: userData.last_name || null,
        imageUrl: userData.image_url || null,
        lastActiveAt: new Date(),
      }
    })

    console.log('✅ User updated in database:', updatedUser.id)
  } catch (error) {
    console.error('❌ Error updating user:', error)
  }
}

async function handleUserDeleted(userId: string) {
  try {
    await prisma.user.delete({
      where: { clerkId: userId }
    })

    console.log('✅ User deleted from database:', userId)
  } catch (error) {
    console.error('❌ Error deleting user:', error)
  }
}