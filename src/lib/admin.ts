export interface AdminStats {
  users: {
    total: number
    basic: number
    premium: number
    newThisMonth: number
    activeToday: number
  }
  videos: {
    total: number
    published: number
    draft: number
    totalViews: number
    totalDuration: number
  }
  seminars: {
    total: number
    upcoming: number
    completed: number
    totalParticipants: number
    averageRating: number
  }
  revenue: {
    thisMonth: number
    lastMonth: number
    growth: number
    totalSubscribers: number
  }
}

export interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  plan: 'basic' | 'premium'
  status: 'active' | 'inactive' | 'suspended'
  joinDate: string
  lastLogin: string
  totalWatchTime: number
  videosWatched: number
  seminarsAttended: number
  subscriptionStatus: 'active' | 'cancelled' | 'expired'
  nextBillingDate?: string
  totalRevenue: number
}

export interface AdminVideo {
  id: string
  title: string
  description: string
  instructor: string
  department: string
  duration: string
  status: 'published' | 'draft' | 'archived'
  level: 'beginner' | 'intermediate' | 'advanced'
  isPremium: boolean
  vimeoId?: string
  thumbnailUrl?: string
  tags: string[]
  viewCount: number
  likeCount: number
  averageRating: number
  uploadDate: string
  lastModified: string
  createdBy: string
}

export interface AdminSeminar {
  id: string
  title: string
  description: string
  instructor: string
  date: string
  startTime: string
  endTime: string
  capacity: number
  registered: number
  attended?: number
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  isPremium: boolean
  zoomMeetingId?: string
  zoomPasscode?: string
  materials?: string[]
  averageRating?: number
  createdBy: string
  createdAt: string
}

export function generateMockAdminStats(): AdminStats {
  return {
    users: {
      total: 1247,
      basic: 823,
      premium: 424,
      newThisMonth: 156,
      activeToday: 89
    },
    videos: {
      total: 142,
      published: 127,
      draft: 15,
      totalViews: 487352,
      totalDuration: 8943 // minutes
    },
    seminars: {
      total: 64,
      upcoming: 8,
      completed: 56,
      totalParticipants: 3421,
      averageRating: 4.6
    },
    revenue: {
      thisMonth: 1247000,
      lastMonth: 1189000,
      growth: 4.9,
      totalSubscribers: 1247
    }
  }
}

export function generateMockAdminUsers(): AdminUser[] {
  const users: AdminUser[] = []
  const firstNames = ['田中', '佐藤', '山田', '鈴木', '高橋', '中村', '小林', '加藤', '吉田', '渡辺']
  const lastNames = ['太郎', '花子', '次郎', '美咲', '健太', '由美', '大輔', '麻衣', '浩二', '恵子']
  
  for (let i = 1; i <= 50; i++) {
    users.push({
      id: `user-${i}`,
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      email: `user${i}@example.com`,
      plan: Math.random() > 0.6 ? 'premium' : 'basic',
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      totalWatchTime: Math.floor(Math.random() * 10000),
      videosWatched: Math.floor(Math.random() * 50),
      seminarsAttended: Math.floor(Math.random() * 20),
      subscriptionStatus: Math.random() > 0.1 ? 'active' : 'cancelled',
      nextBillingDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      totalRevenue: Math.floor(Math.random() * 50000)
    })
  }
  
  return users
}

export function generateMockAdminVideos(): AdminVideo[] {
  const titles = [
    'ChatGPT完全入門',
    'Python×AI基礎',
    'Excel業務効率化',
    'データサイエンス実践',
    'AI戦略策定ガイド',
    'プロンプトエンジニアリング',
    'ノーコードAI開発',
    'ビジネスAI活用術'
  ]
  
  const instructors = ['田中AI太郎', '佐藤みらい', '中村効率化', '博士データ', 'CEOストラテジー']
  const departments = ['AI基礎学部', '業務効率化学部', 'データサイエンス学部', 'AI開発学部', 'ビジネスAI学部']
  
  return titles.map((title, i) => ({
    id: `video-${i + 1}`,
    title: `${title} 第${i + 1}回`,
    description: `${title}について詳しく解説する実践的な講座です。`,
    instructor: instructors[Math.floor(Math.random() * instructors.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    duration: `${Math.floor(Math.random() * 60 + 20)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    status: Math.random() > 0.1 ? 'published' : 'draft' as any,
    level: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)] as any,
    isPremium: Math.random() > 0.4,
    vimeoId: `12345678${i}`,
    tags: ['AI', 'ChatGPT', 'Python', 'Excel'].slice(0, Math.floor(Math.random() * 3) + 1),
    viewCount: Math.floor(Math.random() * 50000),
    likeCount: Math.floor(Math.random() * 1000),
    averageRating: 3.5 + Math.random() * 1.5,
    uploadDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    lastModified: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'admin'
  }))
}

export function generateMockAdminSeminars(): AdminSeminar[] {
  const titles = [
    'AI基礎セミナー',
    'ChatGPT活用講座',
    'データ分析入門',
    'プロンプト実践',
    'ビジネスAI戦略',
    'Excel自動化セミナー',
    'Python実習',
    'AI最新動向'
  ]
  
  const instructors = ['田中AI太郎', '佐藤みらい', '中村効率化', '博士データ']
  
  return titles.map((title, i) => {
    const date = new Date()
    date.setDate(date.getDate() + (i - 4) * 7) // 過去4週間から未来4週間
    
    return {
      id: `seminar-${i + 1}`,
      title: `${title} 第${i + 1}回`,
      description: `${title}の実践的な内容を学ぶセミナーです。`,
      instructor: instructors[Math.floor(Math.random() * instructors.length)],
      date: date.toISOString().split('T')[0],
      startTime: '19:00',
      endTime: '20:30',
      capacity: 100,
      registered: Math.floor(Math.random() * 100),
      attended: i < 4 ? Math.floor(Math.random() * 80) : undefined,
      status: i < 4 ? 'completed' : i === 4 ? 'ongoing' : 'upcoming' as any,
      isPremium: Math.random() > 0.5,
      zoomMeetingId: `123-456-${String(i + 1).padStart(3, '0')}`,
      zoomPasscode: `pass${i + 1}`,
      averageRating: i < 4 ? 3.5 + Math.random() * 1.5 : undefined,
      createdBy: 'admin',
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ja-JP').format(num)
}

export function formatDurationFromMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}時間${mins}分` : `${mins}分`
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
    case 'published':
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'inactive':
    case 'draft':
    case 'cancelled':
      return 'bg-gray-100 text-gray-800'
    case 'suspended':
    case 'archived':
      return 'bg-red-100 text-red-800'
    case 'upcoming':
    case 'ongoing':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'active': return 'アクティブ'
    case 'inactive': return '非アクティブ'
    case 'suspended': return '停止中'
    case 'published': return '公開中'
    case 'draft': return '下書き'
    case 'archived': return 'アーカイブ'
    case 'upcoming': return '予定'
    case 'ongoing': return '進行中'
    case 'completed': return '完了'
    case 'cancelled': return 'キャンセル'
    default: return status
  }
}