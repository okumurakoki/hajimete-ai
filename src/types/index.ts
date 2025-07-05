// セミナー関連の型定義
export interface Seminar {
  id: string
  title: string
  description: string
  instructor: string
  startDate: string
  endDate: string
  duration: number
  price: number
  level: string
  category: string
  maxParticipants: number
  currentParticipants: number
  curriculum: string
  tags: string
  isActive: boolean
  isPublished: boolean
  zoomUrl?: string
  zoomId?: string
  zoomPassword?: string
  createdAt: string
  updatedAt: string
}

export interface SeminarFormData {
  title: string
  description: string
  instructor: string
  startDate: string
  endDate: string
  price: number
  level: string
  category: string
  maxParticipants: number
  curriculum: string[]
  tags: string
  isPublished: boolean
  zoomUrl?: string
  zoomId?: string
  zoomPassword?: string
}

// 部署関連の型定義
export interface Department {
  id: string
  name: string
  description: string | null
  image: string | null
  color: string | null
  iconType?: 'lucide' | 'gradient' | 'upload'
  iconValue?: string
  uploadedImage?: string | null
  coursesCount?: number
}

// コース関連の型定義
export interface Course {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  departmentId: string
  department?: { name: string }
  lessonsCount?: number
  status?: string
}

// API レスポンス型
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

// セミナー統計型
export interface SeminarStats {
  total: number
  published: number
  draft: number
  participants: number
  revenue: number
}

// セミナーレベル型
export type SeminarLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

// セミナーカテゴリ型
export type SeminarCategory = 
  | 'AI研究ツール'
  | '生産性ツール'
  | 'クリエイティブAI'
  | 'AI開発'
  | '動画制作'
  | '文書作成'
  | '音楽制作'
  | 'コンサルティング'
  | 'ビジネス活用'
  | 'データ分析'