// 共有モックデータストア
export let mockCourses = [
  {
    id: '1',
    title: 'ChatGPTの基本操作',
    description: 'ChatGPTの基本的な使い方を学びます',
    thumbnail: null,
    difficulty: 'beginner',
    duration: 45,
    videoUrl: null,
    status: 'published',
    departmentId: '1',
    department: { name: 'AI基礎学部' },
    lessonsCount: 5,
    enrolledCount: 124,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: '2',
    title: 'プロンプトエンジニアリング入門',
    description: '効果的なプロンプトの作り方を学習します',
    thumbnail: null,
    difficulty: 'intermediate',
    duration: 60,
    videoUrl: 'https://youtube.com/watch?v=example',
    status: 'published',
    departmentId: '1', 
    department: { name: 'AI基礎学部' },
    lessonsCount: 8,
    enrolledCount: 89,
    createdAt: '2024-01-18T14:00:00Z',
    updatedAt: '2024-01-25T09:15:00Z'
  },
  {
    id: '3',
    title: 'AIとは何か？基本概念の理解',
    description: 'AI・機械学習・深層学習の基本概念を学びます',
    thumbnail: null,
    difficulty: 'beginner',
    duration: 30,
    videoUrl: null,
    status: 'published',
    departmentId: '1',
    department: { name: 'AI基礎学部' },
    lessonsCount: 6,
    enrolledCount: 156,
    createdAt: '2024-01-10T09:30:00Z',
    updatedAt: '2024-01-12T16:45:00Z'
  },
  {
    id: '4',
    title: 'Excel×AI自動化テクニック',
    description: 'ExcelとAIを組み合わせた業務効率化手法',
    thumbnail: null,
    difficulty: 'intermediate',
    duration: 90,
    videoUrl: null,
    status: 'published',
    departmentId: '2',
    department: { name: '業務効率化学部' },
    lessonsCount: 10,
    enrolledCount: 203,
    createdAt: '2024-01-22T11:00:00Z',
    updatedAt: '2024-01-28T14:20:00Z'
  },
  {
    id: '5',
    title: 'PowerPoint資料作成の自動化',
    description: 'AIを活用したプレゼン資料の効率的な作成方法',
    thumbnail: null,
    difficulty: 'beginner',
    duration: 75,
    videoUrl: null,
    status: 'draft',
    departmentId: '2',
    department: { name: '業務効率化学部' },
    lessonsCount: 7,
    enrolledCount: 0,
    createdAt: '2024-02-01T13:45:00Z',
    updatedAt: '2024-02-01T13:45:00Z'
  },
  {
    id: '6',
    title: 'Python×AI実践プロジェクト',
    description: 'Pythonを使ったAI開発の実践的なプロジェクト',
    thumbnail: null,
    difficulty: 'advanced',
    duration: 120,
    videoUrl: 'https://vimeo.com/example',
    status: 'published',
    departmentId: '3',
    department: { name: '実践応用学部' },
    lessonsCount: 15,
    enrolledCount: 67,
    createdAt: '2024-01-25T16:20:00Z',
    updatedAt: '2024-02-02T10:30:00Z'
  }
]

// データ操作用のヘルパー関数
export const addCourse = (course: any) => {
  mockCourses.unshift(course)
  console.log('📊 コース追加後の件数:', mockCourses.length)
}

export const deleteCourse = (courseId: string) => {
  const beforeCount = mockCourses.length
  mockCourses = mockCourses.filter(course => course.id !== courseId)
  console.log('🗑️ コース削除:', `${beforeCount} → ${mockCourses.length}`)
  return mockCourses.length < beforeCount
}

export const updateCourseStatus = (courseId: string, status: string) => {
  const course = mockCourses.find(c => c.id === courseId)
  if (course) {
    course.status = status
    course.updatedAt = new Date().toISOString()
    console.log('🔄 ステータス更新:', courseId, '→', status)
    return course
  }
  return null
}

export const updateCourse = (courseId: string, updateData: any) => {
  const index = mockCourses.findIndex(c => c.id === courseId)
  if (index !== -1) {
    mockCourses[index] = { ...mockCourses[index], ...updateData, updatedAt: new Date().toISOString() }
    console.log('📝 コース更新:', courseId)
    return mockCourses[index]
  }
  return null
}