import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const image = formData.get('image') as File
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Check file size (max 5MB)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size too large' }, { status: 400 })
    }

    // Check file type
    if (!image.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Convert file to base64 for simple storage
    // In production, you'd typically upload to a service like AWS S3, Cloudinary, etc.
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`

    // Update user profile with image URL
    // Since we're using Clerk for profile images, we'll store this as backup
    // The actual profile image update happens via Clerk's API on the frontend
    await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        // Store as backup - primary image is handled by Clerk
        imageUrl: base64Image
      },
      create: {
        clerkId: userId,
        email: '', // Will be updated when user profile is synced
        imageUrl: base64Image
      }
    })

    return NextResponse.json({ 
      imageUrl: base64Image,
      message: 'Image uploaded successfully' 
    })

  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}