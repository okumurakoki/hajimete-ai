import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createVimeoUpload } from '@/lib/vimeo'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { size, name, description } = body

    if (!size || !name) {
      return NextResponse.json(
        { error: 'Size and name are required' },
        { status: 400 }
      )
    }

    // Vimeoへのアップロード作成
    const uploadResponse = await createVimeoUpload(size, name, description)

    return NextResponse.json({
      success: true,
      data: {
        vimeoUri: uploadResponse.uri,
        uploadLink: uploadResponse.upload.upload_link,
        form: uploadResponse.upload.form
      }
    })
  } catch (error) {
    console.error('Vimeo upload creation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create upload',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET: アップロード状態確認
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 実装例: アップロード状態一覧取得
    return NextResponse.json({
      success: true,
      data: {
        uploads: []
      }
    })
  } catch (error) {
    console.error('Get upload status error:', error)
    return NextResponse.json(
      { error: 'Failed to get upload status' },
      { status: 500 }
    )
  }
}