import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { prisma } from '@/lib/prisma'

type EventType = 'user.created' | 'user.updated' | 'user.deleted'

interface ClerkEvent {
  data: {
    id: string
    email_addresses: { email_address: string }[]
    first_name?: string
    last_name?: string
    image_url?: string
    unsafe_metadata?: {
      plan?: string
    }
  }
  type: EventType
}

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: ClerkEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as ClerkEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type
  const { id: clerkId, email_addresses, first_name, last_name, image_url, unsafe_metadata } = evt.data

  try {
    switch (eventType) {
      case 'user.created':
        const email = email_addresses[0]?.email_address
        if (!email) {
          return new Response('No email found', { status: 400 })
        }

        // Create user in database
        const newUser = await prisma.user.create({
          data: {
            clerkId,
            email,
            plan: unsafe_metadata?.plan || 'basic',
            status: 'active'
          }
        })

        // Create user profile
        await prisma.userProfile.create({
          data: {
            userId: newUser.id,
            firstName: first_name || '',
            lastName: last_name || '',
            avatarUrl: image_url || ''
          }
        })

        // Create user preferences
        await prisma.userPreferences.create({
          data: {
            userId: newUser.id
          }
        })

        console.log(`✅ User created: ${email}`)
        break

      case 'user.updated':
        await prisma.user.update({
          where: { clerkId },
          data: {
            plan: unsafe_metadata?.plan || 'basic'
          }
        })

        // Update profile if exists
        await prisma.userProfile.upsert({
          where: { userId: clerkId },
          update: {
            firstName: first_name || '',
            lastName: last_name || '',
            avatarUrl: image_url || ''
          },
          create: {
            userId: clerkId,
            firstName: first_name || '',
            lastName: last_name || '',
            avatarUrl: image_url || ''
          }
        })

        console.log(`✅ User updated: ${clerkId}`)
        break

      case 'user.deleted':
        await prisma.user.delete({
          where: { clerkId }
        })
        console.log(`✅ User deleted: ${clerkId}`)
        break

      default:
        console.log(`Unknown event type: ${eventType}`)
    }

    return NextResponse.json({ message: 'Webhook processed successfully' })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}