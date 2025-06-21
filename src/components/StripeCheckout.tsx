'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { CreditCard, Loader2 } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeCheckoutProps {
  seminarId: string
  seminarTitle: string
  seminarDescription: string
  amount: number
  userPlan?: string
  currency?: string
  className?: string
  children?: React.ReactNode
  disabled?: boolean
}

export default function StripeCheckout({
  seminarId,
  seminarTitle,
  seminarDescription,
  amount,
  userPlan = 'free',
  currency = 'jpy',
  className = '',
  children,
  disabled = false
}: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    if (disabled || isLoading) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seminarId,
          seminarTitle,
          seminarDescription,
          amount,
          userPlan,
          currency,
        }),
      })

      if (!response.ok) {
        let errorMessage = 'Failed to create checkout session'
        let details = ''
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
          details = errorData.details || ''
          console.error('Stripe API Error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData.error,
            details: errorData.details,
            requestData: { seminarId, seminarTitle, amount, userPlan }
          })
        } catch (parseError) {
          console.error('Error parsing response:', parseError)
          console.error('Response status:', response.status, response.statusText)
        }
        throw new Error(details ? `${errorMessage}: ${details}` : errorMessage)
      }

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert(error instanceof Error ? error.message : '決済エラーが発生しました。')
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number): string => {
    return price === 0 ? '無料' : `¥${price.toLocaleString('ja-JP')}`
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={disabled || isLoading}
      className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 size={10} className="animate-spin" />
          処理中...
        </>
      ) : children ? (
        children
      ) : (
        <>
          <CreditCard size={10} />
          {formatPrice(amount)}で申し込む
        </>
      )}
    </button>
  )
}