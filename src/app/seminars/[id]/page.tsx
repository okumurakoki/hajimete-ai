'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StripeCheckout from '@/components/StripeCheckout'
import { getSeminarPricing } from '@/lib/stripe-pricing'
import Link from 'next/link'
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Video,
  Star,
  CreditCard,
  CheckCircle,
  AlertCircle,
  User,
  ArrowLeft,
  ExternalLink,
  Download,
  FileText,
  Monitor,
  Mic,
  Camera,
  Shield,
  Gift,
  Bookmark,
  Share2,
  Heart,
  UserPlus,
  Bell,
  PlayCircle,
  Award,
  TrendingUp,
  BookOpen,
  Zap
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Seminar {
  id: string
  title: string
  description: string
  fullDescription: string
  instructor: {
    name: string
    email: string
    avatar: string
    bio: string
    expertise: string[]
    experience: string
  }
  schedule: {
    date: Date
    duration: number
    timezone: string
  }
  pricing: {
    free: number
    basic: number
    premium: number
    originalPrice: number
  }
  features: {
    type: 'meeting' | 'webinar'
    maxParticipants: number
    autoRecording: boolean
    waitingRoom: boolean
    materials: boolean
    certificate: boolean
    qna: boolean
    breakoutRooms: boolean
  }
  department: string
  level: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  prerequisites: string[]
  learningOutcomes: string[]
  isPremium: boolean
  isPopular: boolean
  isNew: boolean
  registrationCount: number
  rating: number
  reviews: number
}

interface UserRegistration {
  id: string
  status: 'registered' | 'cancelled' | 'completed'
  paymentStatus: 'free' | 'paid' | 'pending' | 'failed'
  paymentAmount: number
  registrationDate: Date
  zoomJoinUrl?: string
}

export default function SeminarDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const [seminar, setSeminar] = useState<Seminar | null>(null)
  const [userRegistration, setUserRegistration] = useState<UserRegistration | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  const userPlan = user?.plan || 'free'

  useEffect(() => {
    // Generate mock seminar data
    const mockSeminar: Seminar = {
      id: params.id as string,
      title: 'ChatGPT実践活用セミナー - ビジネス現場での効果的な活用法',
      description: 'ビジネスシーンでのChatGPT活用法をライブで解説します。プロンプトエンジニアリングの基礎から応用まで、実際の事例を交えながら学習できます。',
      fullDescription: `
        本セミナーでは、ChatGPTを業務で効果的に活用するための実践的なテクニックを学びます。

        【セミナー内容】
        ・ChatGPTの基本機能と特徴の理解
        ・効果的なプロンプト作成のコツ
        ・ビジネス文書作成での活用法
        ・データ分析支援での使い方
        ・マーケティング活動での応用
        ・チーム協働での活用事例
        ・セキュリティ面での注意点

        【実践演習】
        ・実際のビジネスケースを用いたハンズオン
        ・参加者同士でのディスカッション
        ・質疑応答セッション

        ライブ配信なので、リアルタイムで質問も可能です。
      `,
      instructor: {
        name: '田中 AI太郎',
        email: 'tanaka@hajimete-ai.com',
        avatar: '',
        bio: 'AI活用コンサルタント。大手IT企業でAI導入プロジェクトを多数手がけ、現在は企業のDX推進を支援。',
        expertise: ['ChatGPT', 'プロンプトエンジニアリング', 'ビジネス活用', 'DX推進'],
        experience: '10年以上のAI・機械学習経験'
      },
      schedule: {
        date: new Date('2024-07-15T14:00:00'),
        duration: 120,
        timezone: 'JST'
      },
      pricing: getSeminarPricing(),
      features: {
        type: 'meeting',
        maxParticipants: 50,
        autoRecording: true,
        waitingRoom: true,
        materials: true,
        certificate: true,
        qna: true,
        breakoutRooms: true
      },
      department: 'AI基礎学部',
      level: 'intermediate',
      tags: ['ChatGPT', 'ビジネス活用', 'プロンプト', '実践', 'DX'],
      prerequisites: [
        'ChatGPTの基本的な使用経験',
        'ビジネス経験（業界問わず）',
        'PCでのZoom参加環境'
      ],
      learningOutcomes: [
        'ChatGPTを業務で効果的に活用できるようになる',
        '高品質なプロンプトを作成できるようになる',
        'ビジネス文書作成の効率が向上する',
        'チームでのAI活用を推進できるようになる',
        'セキュリティを考慮したAI活用ができるようになる'
      ],
      isPremium: false,
      isPopular: true,
      isNew: true,
      registrationCount: 42,
      rating: 4.8,
      reviews: 156
    }

    setSeminar(mockSeminar)
    
    // Simulate user data
    setIsFavorited(Math.random() > 0.7)
    setIsBookmarked(Math.random() > 0.8)
    
    // Check if user is already registered
    if (user && Math.random() > 0.7) {
      setUserRegistration({
        id: 'reg_' + Date.now(),
        status: 'registered',
        paymentStatus: mockSeminar.pricing[userPlan as keyof typeof mockSeminar.pricing] === 0 ? 'free' : 'paid',
        paymentAmount: mockSeminar.pricing[userPlan as keyof typeof mockSeminar.pricing],
        registrationDate: new Date(),
        zoomJoinUrl: 'https://zoom.us/j/123456789?pwd=abc123'
      })
    }
    
    setLoading(false)
  }, [params.id, user, userPlan])

  const getPriceForUser = () => {
    if (!seminar) return 0
    return seminar.pricing[userPlan as keyof typeof seminar.pricing]
  }

  const getDiscountPercentage = () => {
    if (!seminar) return 0
    const userPrice = getPriceForUser()
    const originalPrice = seminar.pricing.originalPrice
    return Math.round(((originalPrice - userPrice) / originalPrice) * 100)
  }

  const handleRegistration = async () => {
    if (!seminar || !user) return

    setRegistering(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      const newRegistration: UserRegistration = {
        id: 'reg_' + Date.now(),
        status: 'registered',
        paymentStatus: getPriceForUser() === 0 ? 'free' : 'paid',
        paymentAmount: getPriceForUser(),
        registrationDate: new Date(),
        zoomJoinUrl: 'https://zoom.us/j/123456789?pwd=abc123'
      }

      setUserRegistration(newRegistration)
      alert('セミナーへの参加申し込みが完了しました！')
    } catch (error) {
      console.error('Registration error:', error)
      alert('申し込みに失敗しました。もう一度お試しください。')
    } finally {
      setRegistering(false)
    }
  }

  const formatPrice = (price: number): string => {
    return price === 0 ? '無料' : `¥${price.toLocaleString('ja-JP')}`
  }

  const formatDateTime = (date: Date): string => {
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'long'
    })
  }

  const getDaysUntil = (date: Date): number => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const getLevelInfo = (level: string) => {
    switch (level) {
      case 'beginner': 
        return { label: '初級', color: 'bg-green-100 text-green-800', icon: '🌱' }
      case 'intermediate': 
        return { label: '中級', color: 'bg-yellow-100 text-yellow-800', icon: '🌿' }
      case 'advanced': 
        return { label: '上級', color: 'bg-red-100 text-red-800', icon: '🌳' }
      default: 
        return { label: '初級', color: 'bg-gray-100 text-gray-800', icon: '🌱' }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">セミナー情報を読み込み中...</h2>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!seminar) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">セミナーが見つかりません</h2>
            <p className="text-gray-600 mb-4">指定されたセミナーは存在しないか、削除されている可能性があります。</p>
            <Link href="/seminars" className="text-blue-600 hover:text-blue-700">
              セミナー一覧に戻る
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const userPrice = getPriceForUser()
  const isRegistered = userRegistration !== null
  const daysUntil = getDaysUntil(seminar.schedule.date)
  const levelInfo = getLevelInfo(seminar.level)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Back Navigation */}
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/seminars" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={10} className="mr-1" />
            セミナー一覧に戻る
          </Link>
        </div>

        <div className="container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-2">
              {/* Hero Section */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="relative">
                  {/* Header Image/Gradient */}
                  <div className="h-40 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                  
                  {/* Status Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {seminar.isNew && (
                      <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">
                        🆕 NEW
                      </span>
                    )}
                    {seminar.isPopular && (
                      <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-sm font-medium">
                        🔥 人気
                      </span>
                    )}
                    {seminar.isPremium && (
                      <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
                        ⭐ プレミアム
                      </span>
                    )}
                  </div>

                  {/* Registration Status */}
                  {isRegistered && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium flex items-center gap-1">
                        <CheckCircle size={10} />
                        参加登録済み
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelInfo.color}`}>
                      {levelInfo.icon} {levelInfo.label}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {seminar.department}
                    </span>
                    {daysUntil > 0 && (
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                        🕒 {daysUntil}日後開催
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {seminar.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <Users size={10} />
                      <span className="font-medium">{seminar.instructor.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={10} />
                      <span>{formatDateTime(seminar.schedule.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={10} />
                      <span>{seminar.schedule.duration}分</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserPlus size={10} />
                      <span>{seminar.registrationCount}名参加予定</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={10} 
                            className={i < Math.floor(seminar.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{seminar.rating}</span>
                      <span className="text-sm text-gray-500">({seminar.reviews}件のレビュー)</span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    {seminar.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setIsFavorited(!isFavorited)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        isFavorited
                          ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <Heart size={10} className={isFavorited ? 'fill-current' : ''} />
                      {isFavorited ? 'お気に入り済み' : 'お気に入り'}
                    </button>
                    
                    <button
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        isBookmarked
                          ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <Bookmark size={10} className={isBookmarked ? 'fill-current' : ''} />
                      {isBookmarked ? 'ブックマーク済み' : 'ブックマーク'}
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 border-2 border-gray-200 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      <Share2 size={10} />
                      シェア
                    </button>
                  </div>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen size={12} />
                  セミナー詳細
                </h2>
                <div className="prose prose-gray max-w-none">
                  <div className={`${!showFullDescription ? 'line-clamp-6' : ''}`}>
                    {seminar.fullDescription.split('\n').map((line, index) => (
                      <p key={index} className="mb-2">{line}</p>
                    ))}
                  </div>
                  {!showFullDescription && (
                    <button 
                      onClick={() => setShowFullDescription(true)}
                      className="text-blue-600 hover:text-blue-700 font-medium mt-2"
                    >
                      詳細を表示 ▼
                    </button>
                  )}
                </div>
              </div>

              {/* Learning Outcomes */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award size={12} />
                  学習成果
                </h3>
                <div className="grid gap-3">
                  {seminar.learningOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle size={10} className="text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prerequisites */}
              {seminar.prerequisites.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle size={12} />
                    参加要件
                  </h3>
                  <div className="grid gap-3">
                    {seminar.prerequisites.map((prereq, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{prereq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructor Profile */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={12} />
                  講師プロフィール
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {seminar.instructor.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{seminar.instructor.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{seminar.instructor.experience}</p>
                    <p className="text-gray-700 mb-3">{seminar.instructor.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {seminar.instructor.expertise.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1">
              {/* Registration Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6 sticky top-4">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-gray-900">
                      {formatPrice(userPrice)}
                    </div>
                    {userPrice > 0 && userPrice < seminar.pricing.originalPrice && (
                      <div className="text-sm text-gray-500">
                        <span className="line-through">¥{seminar.pricing.originalPrice.toLocaleString()}</span>
                        <span className="ml-2 text-green-600 font-medium">
                          {getDiscountPercentage()}%OFF
                        </span>
                      </div>
                    )}
                    <div className="text-sm text-gray-600 mt-1">
                      {userPlan === 'premium' ? 'プレミアムプラン' : 
                       userPlan === 'basic' ? 'ベーシックプラン' : 
                       'フリープラン'}での料金
                    </div>
                  </div>

                  {!user ? (
                    <div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 text-amber-800 text-sm">
                          <AlertCircle size={10} />
                          <span>ログインが必要です</span>
                        </div>
                      </div>
                      <Link href="/sign-in">
                        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                          ログインして申し込む
                        </button>
                      </Link>
                    </div>
                  ) : isRegistered ? (
                    <div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 text-green-800 mb-2">
                          <CheckCircle size={12} />
                          <span className="font-medium">参加登録完了</span>
                        </div>
                        <div className="text-sm text-green-700 mb-3">
                          セミナーへの参加申し込みが完了しています。開催日が近づきましたら、参加URLをメールでお送りします。
                        </div>
                        <div className="text-xs text-green-600">
                          支払い: {userRegistration?.paymentStatus === 'paid' ? '完了' : 
                                   userRegistration?.paymentStatus === 'free' ? '無料' : 
                                   userRegistration?.paymentStatus === 'pending' ? '待機中' : '失敗'}
                        </div>
                      </div>
                      {userRegistration?.zoomJoinUrl && (
                        <div className="space-y-3">
                          <a 
                            href={userRegistration.zoomJoinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-blue-600 text-white py-4 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-3 shadow-lg"
                          >
                            <Video size={20} />
                            <div className="text-center">
                              <div className="font-bold">Zoomで参加する</div>
                              <div className="text-xs text-blue-100">セミナー開始15分前から入室可能</div>
                            </div>
                          </a>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => navigator.clipboard.writeText(userRegistration.zoomJoinUrl || '')}
                              className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                            >
                              <FileText size={14} />
                              URLコピー
                            </button>
                            <button
                              onClick={() => {
                                const meetingId = userRegistration.zoomJoinUrl?.match(/\/j\/(\d+)/)?.[1]
                                if (meetingId) {
                                  alert(`ミーティングID: ${meetingId}`)
                                }
                              }}
                              className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                            >
                              <Monitor size={14} />
                              ID表示
                            </button>
                          </div>
                          
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <AlertCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                              <div className="text-sm text-blue-800">
                                <div className="font-medium mb-1">参加時の注意事項</div>
                                <ul className="text-xs space-y-1 text-blue-700">
                                  <li>• マイクはミュートでご参加ください</li>
                                  <li>• 質問はチャット機能をご利用ください</li>
                                  <li>• 録画は禁止とさせていただきます</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <StripeCheckout
                      seminarId={seminar.id}
                      seminarTitle={seminar.title}
                      seminarDescription={seminar.description}
                      amount={userPrice}
                      userPlan={userPlan}
                      disabled={registering}
                    />
                  )}

                  <p className="text-xs text-gray-500 text-center mt-3">
                    申し込み後、キャンセルは開催24時間前まで可能
                  </p>
                </div>

                {/* Features */}
                <div className="border-t border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">セミナー特典</h4>
                  <div className="space-y-3 text-sm">
                    {seminar.features.autoRecording && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Video size={10} className="text-green-600" />
                        <span>録画視聴可能</span>
                      </div>
                    )}
                    {seminar.features.materials && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <FileText size={10} className="text-blue-600" />
                        <span>資料ダウンロード</span>
                      </div>
                    )}
                    {seminar.features.certificate && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Award size={10} className="text-purple-600" />
                        <span>修了証明書</span>
                      </div>
                    )}
                    {seminar.features.qna && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Bell size={10} className="text-orange-600" />
                        <span>Q&Aセッション</span>
                      </div>
                    )}
                    {seminar.features.breakoutRooms && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users size={10} className="text-indigo-600" />
                        <span>グループワーク</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Plan Comparison */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="font-semibold text-gray-900 mb-4">プラン別料金</h4>
                <div className="space-y-3">
                  <div className={`p-3 border rounded-lg ${userPlan === 'free' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">フリープラン</span>
                      <span className="font-bold">{formatPrice(seminar.pricing.free)}</span>
                    </div>
                    {userPlan === 'free' && (
                      <div className="text-xs text-blue-600 mt-1">現在のプラン</div>
                    )}
                  </div>
                  
                  <div className={`p-3 border rounded-lg ${userPlan === 'basic' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">ベーシック</span>
                      <span className="font-bold">{formatPrice(seminar.pricing.basic)}</span>
                    </div>
                    {userPlan === 'basic' && (
                      <div className="text-xs text-blue-600 mt-1">現在のプラン</div>
                    )}
                  </div>
                  
                  <div className={`p-3 border rounded-lg ${userPlan === 'premium' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">プレミアム</span>
                      <span className="font-bold text-purple-600">{formatPrice(seminar.pricing.premium)}</span>
                    </div>
                    <div className="text-xs text-purple-600 mt-1">
                      {userPlan === 'premium' ? '現在のプラン' : '最もお得！'}
                    </div>
                  </div>
                </div>

                {userPlan !== 'premium' && (
                  <Link href="/plan-selection">
                    <button className="w-full mt-4 bg-purple-50 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-100 transition-colors text-sm">
                      プランをアップグレード
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}