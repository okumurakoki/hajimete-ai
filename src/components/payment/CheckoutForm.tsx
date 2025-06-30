'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import {
  CreditCard,
  Lock,
  Check,
  X,
  AlertCircle,
  Loader2
} from 'lucide-react'

interface Course {
  id: string
  title: string
  price: number
  startDate: string
}

interface CheckoutFormProps {
  courses: Course[]
  total: {
    baseAmount: number
    discountAmount: number
    finalAmount: number
    discount?: {
      name: string
      amount: number
    }
  }
  onSuccess: () => void
  onCancel: () => void
}

export default function CheckoutForm({ courses, total, onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { user } = useUser()
  
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setMessage('')

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
        receipt_email: user?.emailAddresses[0]?.emailAddress,
      },
    })

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || '決済エラーが発生しました')
      } else {
        setMessage('予期しないエラーが発生しました')
      }
    }

    setIsLoading(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            決済情報の入力
          </h2>
          <p className="text-blue-100 mt-1">
            安全な決済環境でお支払いください
          </p>
        </div>

        <div className="p-6">
          {/* 注文サマリー */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              注文内容
            </h3>
            <div className="space-y-2">
              {courses.map((course, index) => (
                <div key={course.id} className="flex justify-between items-start text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {course.title}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      {formatDate(course.startDate)}
                    </p>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    ¥{course.price.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-600 mt-3 pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">小計</span>
                <span className="text-gray-900 dark:text-gray-100">
                  ¥{total.baseAmount.toLocaleString()}
                </span>
              </div>
              
              {total.discount && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 dark:text-green-400">
                    {total.discount.name}
                  </span>
                  <span className="text-green-600 dark:text-green-400">
                    -¥{total.discountAmount.toLocaleString()}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-600 pt-2">
                <span className="text-gray-900 dark:text-gray-100">合計</span>
                <span className="text-blue-600 dark:text-blue-400">
                  ¥{total.finalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* 決済フォーム */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* セキュリティ情報 */}
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div className="text-sm">
                <p className="font-medium text-green-800 dark:text-green-200">
                  SSL暗号化通信で保護されています
                </p>
                <p className="text-green-600 dark:text-green-400">
                  お客様の決済情報は安全に処理されます
                </p>
              </div>
            </div>

            {/* Stripe Elements */}
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <PaymentElement 
                options={{
                  layout: "tabs"
                }}
              />
            </div>

            {/* エラーメッセージ */}
            {message && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
              </div>
            )}

            {/* ボタン */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={isLoading}
              >
                キャンセル
              </button>
              
              <button
                type="submit"
                disabled={isLoading || !stripe || !elements}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    処理中...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    ¥{total.finalAmount.toLocaleString()}を支払う
                  </>
                )}
              </button>
            </div>
          </form>

          {/* 利用規約 */}
          <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
            <p>
              決済ボタンをクリックすることで、
              <a href="/terms" className="text-blue-600 hover:underline">利用規約</a>
              および
              <a href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</a>
              に同意したものとみなされます。
            </p>
            <p>
              決済は Stripe によって安全に処理されます。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}