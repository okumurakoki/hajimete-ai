'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { DashboardLayout } from '@/components/layout/Layout'
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

interface Registration {
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

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoaded } = useUser()
  
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!isLoaded) return
    
    if (!user) {
      router.push('/auth/sign-in')
      return
    }

    const paymentIntentId = searchParams.get('payment_intent')
    if (paymentIntentId) {
      fetchRegistrations(paymentIntentId)
    } else {
      // payment_intent がない場合は最新の登録を取得
      fetchLatestRegistrations()
    }
  }, [isLoaded, user, searchParams])

  const fetchRegistrations = async (paymentIntentId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/registrations/by-payment-intent?payment_intent=${paymentIntentId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch registrations')
      }
      
      const data = await response.json()
      setRegistrations(data)
    } catch (err) {
      console.error('Error fetching registrations:', err)
      setError('登録情報の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const fetchLatestRegistrations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/registrations/latest')
      
      if (!response.ok) {
        throw new Error('Failed to fetch latest registrations')
      }
      
      const data = await response.json()
      setRegistrations(data)
    } catch (err) {
      console.error('Error fetching latest registrations:', err)
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">決済結果を確認中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="エラー" description="登録情報の取得でエラーが発生しました">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800 p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              エラーが発生しました
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              ダッシュボードに戻る
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (registrations.length === 0) {
    return (
      <DashboardLayout title="登録情報が見つかりません" description="">
        <div className="max-w-md mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            登録情報が見つかりませんでした。
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            ダッシュボードに戻る
          </button>
        </div>
      </DashboardLayout>
    )
  }

  const totalAmount = registrations.reduce((sum, reg) => sum + reg.payment.amount, 0)

  return (
    <DashboardLayout title="決済完了" description="講座のお申し込みが完了しました">
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
                {registrations.length}講座のお申し込みを承りました。確認メールをお送りしています。
              </p>
            </div>
          </div>
        </div>

        {/* 登録講座一覧 */}
        <div className="space-y-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            お申し込み講座
          </h2>
          
          {registrations.map((registration) => (
            <div
              key={registration.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {registration.course.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {registration.course.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(registration.course.startDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(registration.course.startDate)}〜{formatTime(registration.course.endDate)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                    申込完了
                  </span>
                </div>
              </div>

              {/* Zoom情報（あれば） */}
              {registration.course.zoomUrl && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    参加情報
                  </h4>
                  <div className="text-sm space-y-1">
                    <p className="text-blue-700 dark:text-blue-300">
                      <strong>Zoom URL:</strong> 
                      <a 
                        href={registration.course.zoomUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 underline hover:no-underline"
                      >
                        参加リンク
                      </a>
                    </p>
                    {registration.course.zoomId && (
                      <p className="text-blue-700 dark:text-blue-300">
                        <strong>ミーティングID:</strong> {registration.course.zoomId}
                      </p>
                    )}
                    {registration.course.zoomPassword && (
                      <p className="text-blue-700 dark:text-blue-300">
                        <strong>パスワード:</strong> {registration.course.zoomPassword}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 決済情報 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            決済情報
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">講座数</span>
              <span className="text-gray-900 dark:text-gray-100">{registrations.length}講座</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-gray-900 dark:text-gray-100">お支払い金額</span>
              <span className="text-blue-600 dark:text-blue-400">
                ¥{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
          
          {registrations[0]?.payment.receiptUrl && (
            <div className="mt-4">
              <a
                href={registrations[0].payment.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
              >
                <Download className="w-4 h-4" />
                領収書をダウンロード
              </a>
            </div>
          )}
        </div>

        {/* 次のステップ */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
            次のステップ
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  確認メールをご確認ください
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  講座の詳細情報とZoom参加リンクをメールでお送りしています。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  カレンダーに予定を追加
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  講座の開始時間をお忘れなく！カレンダーアプリに予定を追加することをお勧めします。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ボタン */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            ダッシュボードに戻る
          </button>
          <button
            onClick={() => router.push('/courses/live')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 transition-colors flex items-center justify-center gap-2"
          >
            他の講座を見る
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}