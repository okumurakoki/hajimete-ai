export interface Department {
  id: string
  name: string
  slug: string
  description: string
  color: {
    primary: string
    secondary: string
    background: string
    text: string
  }
  icon: string
  plan: 'basic' | 'premium'
}

export const DEPARTMENTS: Department[] = [
  {
    id: 'ai-basics',
    name: 'AI基礎学部',
    slug: 'ai-basics',
    description: 'AIの基本概念から実践的な活用方法まで学ぶ',
    color: {
      primary: 'bg-blue-600',
      secondary: 'bg-blue-100',
      background: 'bg-blue-50',
      text: 'text-blue-600'
    },
    icon: '🤖',
    plan: 'basic'
  },
  {
    id: 'productivity',
    name: '業務効率化学部',
    slug: 'productivity',
    description: '日常業務にAIを活用して生産性を向上させる方法',
    color: {
      primary: 'bg-green-600',
      secondary: 'bg-green-100',
      background: 'bg-green-50',
      text: 'text-green-600'
    },
    icon: '⚡',
    plan: 'basic'
  },
  {
    id: 'practical-application',
    name: '実践応用学部',
    slug: 'practical-application',
    description: '実際のビジネス現場でのAI活用事例と実践',
    color: {
      primary: 'bg-orange-600',
      secondary: 'bg-orange-100',
      background: 'bg-orange-50',
      text: 'text-orange-600'
    },
    icon: '🚀',
    plan: 'basic'
  },
  {
    id: 'catchup',
    name: 'キャッチアップ学部',
    slug: 'catchup',
    description: '最新のAI技術とトレンドを学ぶプレミアム講座',
    color: {
      primary: 'bg-purple-600',
      secondary: 'bg-purple-100',
      background: 'bg-purple-50',
      text: 'text-purple-600'
    },
    icon: '⭐',
    plan: 'premium'
  },
  {
    id: 'business-ai',
    name: 'ビジネスAI学部',
    slug: 'business-ai',
    description: '経営戦略とAI活用の最適化を学ぶ',
    color: {
      primary: 'bg-red-600',
      secondary: 'bg-red-100',
      background: 'bg-red-50',
      text: 'text-red-600'
    },
    icon: '💼',
    plan: 'premium'
  },
  {
    id: 'data-science',
    name: 'データサイエンス学部',
    slug: 'data-science',
    description: 'データ分析とAIモデル構築の実践',
    color: {
      primary: 'bg-indigo-600',
      secondary: 'bg-indigo-100',
      background: 'bg-indigo-50',
      text: 'text-indigo-600'
    },
    icon: '📊',
    plan: 'premium'
  },
  {
    id: 'ai-development',
    name: 'AI開発学部',
    slug: 'ai-development',
    description: 'AIアプリケーション開発とエンジニアリング',
    color: {
      primary: 'bg-gray-600',
      secondary: 'bg-gray-100',
      background: 'bg-gray-50',
      text: 'text-gray-600'
    },
    icon: '🔧',
    plan: 'premium'
  }
]

export interface VideoContent {
  id: string
  title: string
  description: string
  duration: string
  thumbnail: string
  instructor: string
  type: 'recorded' | 'live' | 'archive'
  department: string
  tags: string[]
  level: 'beginner' | 'intermediate' | 'advanced'
  viewCount: number
  uploadDate: string
  isNew?: boolean
  isPopular?: boolean
  isPremium?: boolean
}

export function getDepartmentBySlug(slug: string): Department | undefined {
  return DEPARTMENTS.find(dept => dept.slug === slug)
}

export function getDepartmentsByPlan(plan: 'basic' | 'premium'): Department[] {
  if (plan === 'premium') {
    return DEPARTMENTS
  }
  return DEPARTMENTS.filter(dept => dept.plan === 'basic')
}