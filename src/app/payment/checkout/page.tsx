'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { DashboardLayout } from '@/components/layout/Layout'
import CheckoutForm from '@/components/payment/CheckoutForm'
import {
  ShoppingCart,
  ArrowLeft,
  AlertCircle,
  Loader2
} from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Course {
  id: string
  title: string
  price: number
  startDate: string
}

interface PaymentData {
  clientSecret: string
  paymentId: string
  amount: number
  courses: Course[]
  discount?: {
    name: string
    amount: number
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoaded } = useUser()
  
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!isLoaded) return
    
    if (!user) {
      router.push('/auth/sign-in')
      return
    }

    // セミナーIDまたはコースIDsを取得
    const seminarId = searchParams.get('seminarId')
    const courseIdsParam = searchParams.get('courses')
    
    if (!seminarId && !courseIdsParam) {
      router.push('/seminars')
      return
    }

    const courseIds = seminarId ? [seminarId] : courseIdsParam!.split(',')
    createPaymentIntent(courseIds)
  }, [isLoaded, user, searchParams])

  const createPaymentIntent = async (courseIds: string[]) => {
    try {
      setLoading(true)
      setError('')

      const seminarId = searchParams.get('seminarId')
      
      if (seminarId) {
        // セミナー決済の場合
        const response = await fetch('/api/payment/seminar-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ seminarId }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create seminar payment intent')
        }

        const data = await response.json()
        // セミナーデータをコース形式に変換
        setPaymentData({
          clientSecret: data.clientSecret,
          paymentId: data.paymentId,
          amount: data.amount,
          courses: [{
            id: data.seminar.id,
            title: data.seminar.title,
            price: data.seminar.price,
            startDate: new Date().toISOString()
          }]
        })
      } else {
        // 通常の講座決済の場合
        const response = await fetch('/api/payment/create-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ courseIds }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create payment intent')
        }

        const data = await response.json()
        setPaymentData(data)
      }
    } catch (err) {
      console.error('Error creating payment intent:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    const seminarId = searchParams.get('seminarId')
    if (seminarId) {
      router.push('/payment/success-seminar')
    } else {
      router.push('/payment/success')
    }
  }

  const handleCancel = () => {
    const seminarId = searchParams.get('seminarId')
    if (seminarId) {
      router.push('/seminars')
    } else {
      router.push('/courses/live')
    }
  }

  const calculateTotal = () => {
    if (!paymentData) return { baseAmount: 0, discountAmount: 0, finalAmount: 0 }
    
    const baseAmount = paymentData.courses.reduce((sum, course) => sum + course.price, 0)
    const discountAmount = paymentData.discount?.amount || 0
    
    return {
      baseAmount,
      discountAmount,
      finalAmount: paymentData.amount,
      discount: paymentData.discount
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">決済情報を準備中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="決済エラー" description="決済処理でエラーが発生しました">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
                決済エラー
              </h2>
            </div>
            <p className="text-red-600 dark:text-red-400 mb-6">
              {error}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const seminarId = searchParams.get('seminarId')
                  router.push(seminarId ? '/seminars' : '/courses/live')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {searchParams.get('seminarId') ? 'セミナー一覧' : '講座一覧'}に戻る
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors"
              >
                再試行
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!paymentData) {
    return (
      <DashboardLayout title="決済情報が見つかりません" description="">
        <div className="max-w-md mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            決済情報が見つかりませんでした。
          </p>
          <button
            onClick={() => {
              const seminarId = searchParams.get('seminarId')
              router.push(seminarId ? '/seminars' : '/courses/live')
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            {searchParams.get('seminarId') ? 'セミナー一覧' : '講座一覧'}に戻る
          </button>
        </div>
      </DashboardLayout>
    )
  }

  const total = calculateTotal()

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#2563eb',
    },
  }

  const options = {
    clientSecret: paymentData.clientSecret,
    appearance,
  }

  return (
    <DashboardLayout 
      title="決済手続き" 
      description={`${paymentData.courses.length}講座の決済手続き`}
    >
      <div className="max-w-4xl mx-auto">
        {/* 戻るボタン */}
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {searchParams.get('seminarId') ? 'セミナー詳細' : '講座選択'}に戻る
          </button>
        </div>

        {/* 決済フォーム */}
        {paymentData.clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm
              courses={paymentData.courses}
              total={total}
              onSuccess={handlePaymentSuccess}
              onCancel={handleCancel}
            />
          </Elements>
        )}
      </div>
    </DashboardLayout>
  )
}