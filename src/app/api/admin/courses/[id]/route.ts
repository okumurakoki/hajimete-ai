import { NextResponse } from 'next/server'
import { deleteCourse, updateCourseStatus, updateCourse } from '@/lib/mockData'

// DELETE /api/admin/courses/[id] - 講義削除
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const courseId = resolvedParams.id

    console.log(`🗑️ 削除要求: ${courseId}`)

    // 実際のデータ削除を実行
    const deleted = deleteCourse(courseId)
    
    if (deleted) {
      console.log(`✅ 講義 ${courseId} が正常に削除されました`)
      return NextResponse.json({ 
        message: '講義が正常に削除されました',
        id: courseId 
      })
    } else {
      console.log(`❌ 講義 ${courseId} が見つかりませんでした`)
      return NextResponse.json(
        { error: '指定された講義が見つかりません' }, 
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Delete course error:', error)
    return NextResponse.json(
      { error: '講義の削除に失敗しました' }, 
      { status: 500 }
    )
  }
}

// PATCH /api/admin/courses/[id] - 講義ステータス更新
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const courseId = resolvedParams.id
    const body = await request.json()
    const { status } = body

    console.log(`🔄 ステータス更新要求: ${courseId} → ${status}`)

    // バリデーション
    if (!status || !['draft', 'published'].includes(status)) {
      console.log(`❌ 無効なステータス: ${status}`)
      return NextResponse.json(
        { error: '有効なステータスを指定してください (draft または published)' },
        { status: 400 }
      )
    }

    // 実際のデータ更新を実行
    const updatedCourse = updateCourseStatus(courseId, status)
    
    if (updatedCourse) {
      console.log(`✅ ステータス更新成功: ${courseId} → ${status}`)
      return NextResponse.json({
        message: 'ステータスが正常に更新されました',
        course: updatedCourse
      })
    } else {
      console.log(`❌ 講義が見つかりません: ${courseId}`)
      return NextResponse.json(
        { error: '指定された講義が見つかりません' }, 
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Update course status error:', error)
    return NextResponse.json(
      { error: 'ステータスの更新に失敗しました' }, 
      { status: 500 }
    )
  }
}

// PUT /api/admin/courses/[id] - 講義情報更新 (編集用)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const courseId = resolvedParams.id
    const body = await request.json()
    const { 
      title, 
      description, 
      departmentId, 
      thumbnail, 
      difficulty, 
      duration, 
      videoUrl, 
      status 
    } = body

    console.log(`📝 講義更新要求: ${courseId}`)

    // バリデーション
    if (!title || !departmentId) {
      console.log(`❌ バリデーションエラー: title=${!!title}, departmentId=${!!departmentId}`)
      return NextResponse.json(
        { error: 'タイトルと学部は必須です' },
        { status: 400 }
      )
    }

    // Mock departments for response
    const mockDepartments = [
      { id: '1', name: 'AI基礎学部' },
      { id: '2', name: '業務効率化学部' },
      { id: '3', name: '実践応用学部' }
    ]

    const department = mockDepartments.find(d => d.id === departmentId)
    
    const updateData = {
      title,
      description,
      thumbnail,
      difficulty: difficulty || 'beginner',
      duration: duration || 30,
      videoUrl,
      status: status || 'draft',
      departmentId,
      department: { name: department?.name || 'Unknown Department' },
    }

    // 実際のデータ更新を実行
    const updatedCourse = updateCourse(courseId, updateData)
    
    if (updatedCourse) {
      console.log(`✅ 講義更新成功: ${courseId}`)
      return NextResponse.json(updatedCourse)
    } else {
      console.log(`❌ 講義が見つかりません: ${courseId}`)
      return NextResponse.json(
        { error: '指定された講義が見つかりません' }, 
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Update course error:', error)
    return NextResponse.json(
      { error: '講義の更新に失敗しました' }, 
      { status: 500 }
    )
  }
}