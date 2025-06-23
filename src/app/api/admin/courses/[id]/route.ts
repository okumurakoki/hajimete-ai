import { NextResponse } from 'next/server'

// DELETE /api/admin/courses/[id] - 講義削除
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const courseId = resolvedParams.id

    // 実際のデータベースでは以下のようになります:
    // await prisma.course.delete({
    //   where: { id: courseId }
    // })

    console.log(`講義 ${courseId} が削除されました`)
    
    return NextResponse.json({ 
      message: '講義が正常に削除されました',
      id: courseId 
    })
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

    // バリデーション
    if (!status || !['draft', 'published'].includes(status)) {
      return NextResponse.json(
        { error: '有効なステータスを指定してください (draft または published)' },
        { status: 400 }
      )
    }

    // 実際のデータベースでは以下のようになります:
    // const updatedCourse = await prisma.course.update({
    //   where: { id: courseId },
    //   data: { status },
    //   include: { department: { select: { name: true } } }
    // })

    const updatedCourse = {
      id: courseId,
      status,
      updatedAt: new Date().toISOString()
    }

    console.log(`講義 ${courseId} のステータスが ${status} に更新されました`)
    
    return NextResponse.json({
      message: 'ステータスが正常に更新されました',
      course: updatedCourse
    })
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

    // バリデーション
    if (!title || !departmentId) {
      return NextResponse.json(
        { error: 'タイトルと学部は必須です' },
        { status: 400 }
      )
    }

    // 実際のデータベースでは以下のようになります:
    // const updatedCourse = await prisma.course.update({
    //   where: { id: courseId },
    //   data: { 
    //     title, 
    //     description, 
    //     departmentId, 
    //     thumbnail, 
    //     difficulty, 
    //     duration, 
    //     videoUrl, 
    //     status,
    //     updatedAt: new Date()
    //   },
    //   include: { department: { select: { name: true } } }
    // })

    // Mock departments for response
    const mockDepartments = [
      { id: '1', name: 'AI基礎学部' },
      { id: '2', name: '業務効率化学部' },
      { id: '3', name: '実践応用学部' }
    ]

    const department = mockDepartments.find(d => d.id === departmentId)

    const updatedCourse = {
      id: courseId,
      title,
      description,
      thumbnail,
      difficulty: difficulty || 'beginner',
      duration: duration || 30,
      videoUrl,
      status: status || 'draft',
      departmentId,
      department: { name: department?.name || 'Unknown Department' },
      lessonsCount: 0, // 実際の値は DB から取得
      enrolledCount: 0, // 実際の値は DB から取得
      updatedAt: new Date().toISOString()
    }

    console.log(`講義 ${courseId} が更新されました:`, updatedCourse)
    
    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.error('Update course error:', error)
    return NextResponse.json(
      { error: '講義の更新に失敗しました' }, 
      { status: 500 }
    )
  }
}