export interface LiveStream {
  id: string
  title: string
  description: string
  instructor: string
  department: string
  status: 'upcoming' | 'live' | 'ended'
  startTime: string
  endTime: string
  duration: number // minutes
  thumbnailUrl?: string
  streamUrl?: string
  chatEnabled: boolean
  maxParticipants: number
  currentParticipants: number
  tags: string[]
  level: 'beginner' | 'intermediate' | 'advanced'
  isPremium: boolean
  recordingUrl?: string
  zoomMeetingId?: string
  zoomPasscode?: string
}

export interface ChatMessage {
  id: string
  userId: string
  username: string
  message: string
  timestamp: string
  type: 'message' | 'system' | 'reaction'
  replyTo?: string
}

export interface Seminar {
  id: string
  title: string
  description: string
  instructor: string
  date: string
  startTime: string
  endTime: string
  capacity: number
  registered: number
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  tags: string[]
  level: 'beginner' | 'intermediate' | 'advanced'
  isPremium: boolean
  zoomMeetingId?: string
  zoomPasscode?: string
  materials?: string[]
}

export function isLiveNow(stream: LiveStream): boolean {
  const now = new Date()
  const start = new Date(stream.startTime)
  const end = new Date(stream.endTime)
  return now >= start && now <= end && stream.status === 'live'
}

export function getTimeUntilStart(stream: LiveStream): string {
  const now = new Date()
  const start = new Date(stream.startTime)
  const diff = start.getTime() - now.getTime()
  
  if (diff <= 0) return '配信中'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) return `${days}日後`
  if (hours > 0) return `${hours}時間後`
  return `${minutes}分後`
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ja-JP', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function generateMockLiveStreams(): LiveStream[] {
  return [
    {
      id: 'live-1',
      title: '【生放送】ChatGPT最新機能解説 - GPT-4o完全ガイド',
      description: 'ChatGPTの最新機能GPT-4oについて、実際の使用例を交えながら詳しく解説します。',
      instructor: '田中 AI太郎',
      department: 'AI基礎学部',
      status: 'live',
      startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30分前開始
      endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30分後終了
      duration: 60,
      chatEnabled: true,
      maxParticipants: 500,
      currentParticipants: 387,
      tags: ['ChatGPT', 'GPT-4o', '最新機能'],
      level: 'beginner',
      isPremium: false
    },
    {
      id: 'live-2',
      title: '【プレミアム生放送】AI開発実践 - LangChainハンズオン',
      description: 'LangChainを使ったAIアプリケーション開発を実際にコーディングしながら学びます。',
      instructor: '開発者 チェーン',
      department: 'AI開発学部',
      status: 'upcoming',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2時間後開始
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      duration: 120,
      chatEnabled: true,
      maxParticipants: 200,
      currentParticipants: 0,
      tags: ['LangChain', 'ハンズオン', '開発'],
      level: 'advanced',
      isPremium: true
    },
    {
      id: 'live-3',
      title: '業務効率化セミナー - Excel×AI活用術',
      description: 'ExcelとAIを組み合わせて業務効率を劇的に改善する実践的な方法を紹介。',
      instructor: '中村 効率化',
      department: '業務効率化学部',
      status: 'upcoming',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 明日
      endTime: new Date(Date.now() + 25.5 * 60 * 60 * 1000).toISOString(),
      duration: 90,
      chatEnabled: true,
      maxParticipants: 300,
      currentParticipants: 0,
      tags: ['Excel', '業務効率化', '実践'],
      level: 'beginner',
      isPremium: false
    }
  ]
}

export function generateMockSeminars(): Seminar[] {
  const baseDate = new Date()
  return Array.from({ length: 8 }, (_, i) => {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + (i + 1) * 3) // 3日おき
    
    return {
      id: `seminar-${i + 1}`,
      title: `AI学習セミナー 第${i + 1}回`,
      description: `AI学習に関する実践的なセミナーです。初心者から上級者まで幅広く対応。`,
      instructor: `講師${i + 1}`,
      date: date.toISOString().split('T')[0],
      startTime: '19:00',
      endTime: '20:30',
      capacity: 100,
      registered: Math.floor(Math.random() * 100),
      status: 'upcoming',
      tags: ['AI学習', 'セミナー'],
      level: i < 3 ? 'beginner' : i < 6 ? 'intermediate' : 'advanced',
      isPremium: i >= 4,
      zoomMeetingId: `123-456-${String(i + 1).padStart(3, '0')}`,
      zoomPasscode: `pass${i + 1}`
    }
  })
}