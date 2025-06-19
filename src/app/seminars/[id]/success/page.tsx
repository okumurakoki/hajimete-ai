'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { 
  CheckCircle, 
  Calendar,
  Clock,
  Video,
  Mail,
  Download,
  ExternalLink,
  ArrowLeft,
  Copy,
  Check
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface RegistrationData {
  seminarTitle: string
  seminarDate: string
  seminarDuration: string
  zoomLink: string
  amount: number
  paymentId: string
  confirmationEmail: string
}

export default function SeminarSuccessPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [registration, setRegistration] = useState<RegistrationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const sessionId = searchParams?.get('session_id')

  useEffect(() => {
    // Mock registration data - in production, fetch from API using sessionId
    const mockRegistration: RegistrationData = {
      seminarTitle: 'ChatGPT実践活用セミナー - ビジネス現場での効果的な活用法',
      seminarDate: '2024年7月15日（月）14:00-16:00',
      seminarDuration: '120分',
      zoomLink: 'https://zoom.us/j/123456789?pwd=abc123',
      amount: 5500,
      paymentId: sessionId || 'payment_test_12345',
      confirmationEmail: user?.email || 'user@example.com'
    }

    setRegistration(mockRegistration)
    setLoading(false)
  }, [sessionId, user?.email])

  const copyZoomLink = async () => {
    if (!registration?.zoomLink) return
    
    try {
      await navigator.clipboard.writeText(registration.zoomLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">登録情報を確認中...</h2>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!registration) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">登録情報が見つかりません</h2>
            <p className="text-gray-600 mb-4">セッションが無効か、登録が完了していない可能性があります。</p>
            <Link href="/seminars" className="text-blue-600 hover:text-blue-700">
              セミナー一覧に戻る
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Success Message */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={19} className="text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  セミナー申し込み完了！
                </h1>
                <p className="text-gray-600">
                  ご参加ありがとうございます。以下の情報をご確認ください。
                </p>
              </div>

              {/* Seminar Details */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">セミナー詳細</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">セミナー名</h3>
                    <p className="text-gray-700">{registration.seminarTitle}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar size={10} />
                    <span>{registration.seminarDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock size={10} />
                    <span>所要時間: {registration.seminarDuration}</span>
                  </div>
                </div>
              </div>

              {/* Zoom Information */}
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Video size={12} />
                  参加方法
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    セミナーはZoomで開催されます。開始時刻の5分前には以下のリンクからご参加ください。
                  </p>
                  <div className="flex items-center gap-3 p-3 bg-white rounded border border-green-200">
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-1">Zoom参加URL</div>
                      <div className="text-blue-600 break-all">{registration.zoomLink}</div>
                    </div>
                    <button
                      onClick={copyZoomLink}
                      className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      {copied ? <Check size={10} /> : <Copy size={10} />}
                      <span className="text-sm">{copied ? 'コピー済み' : 'コピー'}</span>
                    </button>
                  </div>
                  <a
                    href={registration.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <ExternalLink size={10} />
                    Zoomで参加
                  </a>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">お支払い情報</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">支払い金額:</span>
                    <span className="font-medium">¥{registration.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">決済ID:</span>
                    <span className="text-sm text-gray-500">{registration.paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">支払い状況:</span>
                    <span className="text-green-600 font-medium">✓ 完了</span>
                  </div>
                </div>
              </div>

              {/* Email Confirmation */}
              <div className="bg-amber-50 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail size={12} />
                  確認メール
                </h2>
                <p className="text-gray-700 mb-3">
                  登録確認メールを以下のアドレスに送信しました：
                </p>
                <div className="bg-white p-3 rounded border border-amber-200">
                  <span className="font-medium text-gray-900">{registration.confirmationEmail}</span>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  メールが届かない場合は、迷惑メールフォルダもご確認ください。
                </p>
              </div>

              {/* Next Steps */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">次のステップ</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">1</div>
                    <div>
                      <p className="font-medium text-gray-900">カレンダーに追加</p>
                      <p className="text-sm text-gray-600">セミナーの日時をカレンダーアプリに登録して、参加を忘れないようにしましょう。</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                    <div>
                      <p className="font-medium text-gray-900">事前準備</p>
                      <p className="text-sm text-gray-600">Zoomアプリのインストールと、安定したインターネット環境をご準備ください。</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                    <div>
                      <p className="font-medium text-gray-900">当日参加</p>
                      <p className="text-sm text-gray-600">開始5分前にZoomリンクからご参加ください。質問がございましたらチャットでお気軽にどうぞ。</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link href="/seminars" className="flex-1">
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    他のセミナーを見る
                  </button>
                </Link>
                <Link href="/dashboard" className="flex-1">
                  <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    マイダッシュボード
                  </button>
                </Link>
              </div>
            </div>

            {/* Back Link */}
            <div className="text-center">
              <Link 
                href={`/seminars/${params.id}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft size={10} className="mr-1" />
                セミナー詳細に戻る
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}