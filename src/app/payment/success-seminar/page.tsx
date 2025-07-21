'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  CheckCircle,
  Calendar,
  Clock,
  Mail,
  Download,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react'

interface SeminarRegistration {
  id: string
  course: {
    id: string
    title: string
    description: string
    instructor: string
    startDate: string
    endDate: string
    zoomUrl?: string
    zoomId?: string
    zoomPassword?: string
  }
  payment: {
    id: string
    amount: number
    receiptUrl?: string
  }
  status: string
}

export default function SeminarPaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoaded } = useUser()
  
  const [registration, setRegistration] = useState<SeminarRegistration | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!isLoaded) return
    
    if (!user) {
      router.push('/auth/sign-in')
      return
    }

    fetchSeminarRegistration()
  }, [isLoaded, user, searchParams])

  const fetchSeminarRegistration = async () => {
    try {
      setLoading(true)
      const paymentIntentId = searchParams.get('payment_intent')
      const url = paymentIntentId 
        ? `/api/registrations/seminar-mock?payment_intent=${paymentIntentId}`
        : '/api/registrations/seminar-mock'
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch seminar registration')
      }
      
      const data = await response.json()
      setRegistration(data[0]) // APIは配列で返すので最初の要素を取得
    } catch (err) {
      console.error('Error fetching seminar registration:', err)
      setError('登録情報の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">決済結果を確認中...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !registration) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-red-800 mb-2">
                エラーが発生しました
              </h2>
              <p className="text-red-600 mb-6">{error || '登録情報が見つかりません'}</p>
              <button
                onClick={() => router.push('/seminars')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                セミナー一覧に戻る
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 成功メッセージ */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  お申し込みが完了しました！
                </h1>
                <p className="text-green-100">
                  セミナーのお申し込みを承りました。確認メールをお送りしています。
                </p>
              </div>
            </div>
          </div>

          {/* セミナー情報 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {registration.course.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {registration.course.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{formatDate(registration.course.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{formatTime(registration.course.startDate)}〜{formatTime(registration.course.endDate)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">講師:</span>
                      <span>{registration.course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">料金:</span>
                      <span className="text-lg font-semibold text-blue-600">
                        ¥{registration.payment.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                申込完了
              </span>
            </div>

            {/* Zoom情報 */}
            {registration.course.zoomUrl && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3">
                  セミナー参加情報
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Zoom URL:</span>
                    <a 
                      href={registration.course.zoomUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 underline hover:no-underline"
                    >
                      参加リンク
                    </a>
                  </div>
                  {registration.course.zoomId && (
                    <div>
                      <span className="text-blue-700 font-medium">ミーティングID:</span>
                      <span className="ml-2">{registration.course.zoomId}</span>
                    </div>
                  )}
                  {registration.course.zoomPassword && (
                    <div>
                      <span className="text-blue-700 font-medium">パスワード:</span>
                      <span className="ml-2">{registration.course.zoomPassword}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 次のステップ */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              次のステップ
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">
                    確認メールをご確認ください
                  </p>
                  <p className="text-sm text-blue-700">
                    セミナーの詳細情報とZoom参加リンクをメールでお送りしています。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">
                    カレンダーに予定を追加
                  </p>
                  <p className="text-sm text-blue-700">
                    セミナーの開始時間をお忘れなく！カレンダーアプリに予定を追加することをお勧めします。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ホームに戻る
            </button>
            <button
              onClick={() => router.push('/seminars')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 transition-colors flex items-center justify-center gap-2"
            >
              他のセミナーを見る
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}