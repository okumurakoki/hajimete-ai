export interface Video {
  id: string
  title: string
  description: string
  instructor: string
  department: string
  duration: string // "HH:MM:SS" format
  durationMinutes: number
  thumbnailUrl?: string
  vimeoId?: string
  videoUrl?: string
  tags: string[]
  level: 'beginner' | 'intermediate' | 'advanced'
  isPremium: boolean
  isNew?: boolean
  isPopular?: boolean
  isFeatured?: boolean
  viewCount: number
  likeCount: number
  uploadDate: string
  category: 'tutorial' | 'lecture' | 'workshop' | 'webinar'
  materials?: {
    name: string
    url: string
    type: 'pdf' | 'zip' | 'link'
  }[]
  chapters?: {
    title: string
    startTime: number // seconds
    duration: number // seconds
    description?: string // optional description for each chapter
  }[]
}

export interface WatchProgress {
  videoId: string
  userId: string
  watchedDuration: number // seconds
  totalDuration: number // seconds
  completed: boolean
  lastWatchedAt: string
}

export interface Playlist {
  id: string
  name: string
  description: string
  videos: string[] // video IDs
  isPublic: boolean
  createdBy: string
  createdAt: string
}

export function getVideoDurationInMinutes(duration: string): number {
  const parts = duration.split(':').map(Number)
  if (parts.length === 3) {
    return parts[0] * 60 + parts[1] + parts[2] / 60
  } else if (parts.length === 2) {
    return parts[0] + parts[1] / 60
  }
  return 0
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export function getWatchProgress(watchedSeconds: number, totalSeconds: number): number {
  return Math.min(100, (watchedSeconds / totalSeconds) * 100)
}

export function canAccessVideo(video: Video, userPlan: string | null): boolean {
  if (!video.isPremium) return true
  return userPlan === 'premium'
}

export function filterVideosByDepartment(videos: Video[], department: string): Video[] {
  return videos.filter(video => video.department === department)
}

export function searchVideos(videos: Video[], query: string): Video[] {
  const searchTerm = query.toLowerCase()
  return videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm) ||
    video.description.toLowerCase().includes(searchTerm) ||
    video.instructor.toLowerCase().includes(searchTerm) ||
    video.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}

export function sortVideos(videos: Video[], sortBy: 'newest' | 'popular' | 'duration' | 'title'): Video[] {
  return [...videos].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      case 'popular':
        return b.viewCount - a.viewCount
      case 'duration':
        return a.durationMinutes - b.durationMinutes
      case 'title':
        return a.title.localeCompare(b.title, 'ja')
      default:
        return 0
    }
  })
}

export function generateMockVideos(): Video[] {
  return [
    {
      id: 'video-1',
      title: 'ChatGPT完全入門 - 基本的な使い方から応用まで',
      description: 'ChatGPTの基本機能から効果的なプロンプト作成まで、初心者向けに丁寧に解説します。実際の使用例を交えながら、日常業務での活用方法を学びましょう。',
      instructor: '田中 AI太郎',
      department: 'AI基礎学部',
      duration: '45:30',
      durationMinutes: 45.5,
      vimeoId: '123456789',
      tags: ['ChatGPT', '基礎', 'プロンプト', '初心者'],
      level: 'beginner',
      isPremium: false,
      isNew: true,
      isPopular: true,
      viewCount: 15420,
      likeCount: 1230,
      uploadDate: '2024-06-15',
      category: 'tutorial',
      materials: [
        { name: 'プロンプト集.pdf', url: '#', type: 'pdf' },
        { name: '練習用データ.zip', url: '#', type: 'zip' }
      ],
      chapters: [
        { title: 'ChatGPTとは', startTime: 0, duration: 300, description: 'ChatGPTの概要と基本概念について学びます。AIの基礎知識から始めて、ChatGPTの特徴や可能性を理解しましょう。' },
        { title: '基本的な使い方', startTime: 300, duration: 600, description: 'ChatGPTの画面操作と基本的な会話方法を実践的に学習します。効果的な質問の仕方とレスポンスの読み方を身につけます。' },
        { title: 'プロンプトのコツ', startTime: 900, duration: 900, description: '高品質な回答を得るためのプロンプト作成テクニックを詳しく解説。具体的な例文と改善方法を通じて実践的なスキルを習得します。' },
        { title: '実践演習', startTime: 1800, duration: 1020, description: '実際のビジネスシーンでの活用例を通じて、学んだスキルを定着させます。様々な場面でのChatGPT活用法を体験しましょう。' }
      ]
    },
    {
      id: 'video-2',
      title: 'Excel×AI で業務効率10倍アップ！実践テクニック',
      description: 'ExcelにAIを組み合わせて、データ分析や資料作成を劇的に効率化する方法を学びます。実際の業務シーンを想定した具体的な手法を紹介。',
      instructor: '中村 効率化',
      department: '業務効率化学部',
      duration: '42:30',
      durationMinutes: 42.5,
      vimeoId: '987654321',
      tags: ['Excel', 'データ分析', '効率化', '実践'],
      level: 'beginner',
      isPremium: false,
      isNew: true,
      isPopular: true,
      viewCount: 18750,
      likeCount: 1456,
      uploadDate: '2024-06-16',
      category: 'workshop',
      materials: [
        { name: 'サンプルファイル.xlsx', url: '#', type: 'zip' },
        { name: 'マクロ集.xlsm', url: '#', type: 'zip' }
      ]
    },
    {
      id: 'video-3',
      title: 'Python×AI入門 - データ分析の第一歩',
      description: 'PythonとAIライブラリを使った基本的なデータ分析手法を実践的に学びます。プログラミング初心者でも理解できるよう丁寧に解説。',
      instructor: '博士 データ',
      department: 'データサイエンス学部',
      duration: '56:30',
      durationMinutes: 56.5,
      vimeoId: '456789123',
      tags: ['Python', 'データ分析', 'pandas', 'プログラミング'],
      level: 'beginner',
      isPremium: true,
      isNew: true,
      viewCount: 12450,
      likeCount: 890,
      uploadDate: '2024-06-15',
      category: 'lecture',
      materials: [
        { name: 'Pythonコード.zip', url: '#', type: 'zip' },
        { name: 'データセット.csv', url: '#', type: 'zip' },
        { name: 'Jupyter Notebook', url: '#', type: 'link' }
      ]
    },
    {
      id: 'video-4',
      title: 'ChatGPT API完全活用ガイド - アプリ開発入門',
      description: 'OpenAI APIを使ったWebアプリケーション開発の基礎から応用まで。実際にコードを書きながら学ぶハンズオン形式の講座。',
      instructor: 'エンジニア API',
      department: 'AI開発学部',
      duration: '64:30',
      durationMinutes: 64.5,
      vimeoId: '789123456',
      tags: ['ChatGPT API', 'Web開発', 'JavaScript', 'Node.js'],
      level: 'intermediate',
      isPremium: true,
      isPopular: true,
      viewCount: 8450,
      likeCount: 720,
      uploadDate: '2024-06-15',
      category: 'workshop'
    },
    {
      id: 'video-5',
      title: 'AI戦略策定ガイド - 経営者のためのAI導入論',
      description: '企業におけるAI導入戦略の立案から実行まで、経営視点で解説。ROI計算や組織変革のポイントも詳しく説明します。',
      instructor: 'CEO ストラテジー',
      department: 'ビジネスAI学部',
      duration: '67:30',
      durationMinutes: 67.5,
      vimeoId: '321654987',
      tags: ['AI戦略', '経営', 'DX', 'ROI'],
      level: 'intermediate',
      isPremium: true,
      isFeatured: true,
      viewCount: 9450,
      likeCount: 654,
      uploadDate: '2024-06-15',
      category: 'lecture'
    },
    {
      id: 'video-6',
      title: 'AIライティング実践 - 文章作成の効率化',
      description: 'AIを使った文章作成、校正、翻訳の実践的なテクニックを学びます。ビジネス文書からクリエイティブライティングまで幅広くカバー。',
      instructor: '佐藤 みらい',
      department: 'AI基礎学部',
      duration: '47:35',
      durationMinutes: 47.6,
      vimeoId: '654987321',
      tags: ['ライティング', '文章作成', '校正', 'AI活用'],
      level: 'intermediate',
      isPremium: false,
      viewCount: 7650,
      likeCount: 567,
      uploadDate: '2024-05-28',
      category: 'tutorial'
    },
    {
      id: 'video-7',
      title: 'Notion×AI でタスク管理革命',
      description: 'NotionとAIツールを組み合わせた次世代のタスク管理とプロジェクト運営。実際の設定方法から応用まで詳しく解説。',
      instructor: '山田 タスク',
      department: '業務効率化学部',
      duration: '44:15',
      durationMinutes: 44.25,
      vimeoId: '147258369',
      tags: ['Notion', 'タスク管理', 'プロジェクト', '自動化'],
      level: 'intermediate',
      isPremium: false,
      viewCount: 11230,
      likeCount: 823,
      uploadDate: '2024-06-05',
      category: 'workshop'
    },
    {
      id: 'video-8',
      title: '機械学習アルゴリズム完全ガイド',
      description: '回帰、分類、クラスタリングなど主要な機械学習アルゴリズムを体系的に解説。理論から実装まで包括的にカバーします。',
      instructor: '教授 ML',
      department: 'データサイエンス学部',
      duration: '78:20',
      durationMinutes: 78.33,
      vimeoId: '963852741',
      tags: ['機械学習', 'アルゴリズム', 'scikit-learn', 'Python'],
      level: 'intermediate',
      isPremium: true,
      isPopular: true,
      viewCount: 8960,
      likeCount: 678,
      uploadDate: '2024-06-10',
      category: 'lecture'
    }
  ]
}