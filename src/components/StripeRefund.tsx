'use client'

import { useState } from 'react'
import { 
  AlertCircle, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  CreditCard, 
  ArrowLeft,
  DollarSign,
  Calendar,
  FileText
} from 'lucide-react'

interface RefundData {
  id: string
  amount: number
  currency: string
  status: string
  created: number
  reason: string
  receipt_number?: string
}

interface StripeRefundProps {
  paymentIntentId: string
  originalAmount: number
  currency?: string
  description?: string
  onRefundComplete?: (refund: RefundData) => void
  onCancel?: () => void
}

export default function StripeRefund({
  paymentIntentId,
  originalAmount,
  currency = 'jpy',
  description,
  onRefundComplete,
  onCancel
}: StripeRefundProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [refundAmount, setRefundAmount] = useState(originalAmount)
  const [refundReason, setRefundReason] = useState('requested_by_customer')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<RefundData | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'jpy') {
      return `¥${amount.toLocaleString()}`
    }
    return `${amount / 100} ${currency.toUpperCase()}`
  }

  const handleRefundRequest = async () => {
    if (!showConfirmation) {
      setShowConfirmation(true)
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/stripe/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          amount: refundAmount,
          reason: refundReason
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Refund failed')
      }

      setSuccess(data.refund)
      onRefundComplete?.(data.refund)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    if (showConfirmation) {
      setShowConfirmation(false)
    } else {
      onCancel?.()
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            返金が完了しました
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            返金処理が正常に完了しました。お客様のアカウントに返金されます。
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">返金ID:</span>
                <span className="font-mono text-gray-900">{success.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">返金額:</span>
                <span className="font-medium text-gray-900">
                  {formatAmount(success.amount, success.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">処理日時:</span>
                <span className="text-gray-900">
                  {new Date(success.created * 1000).toLocaleDateString('ja-JP')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">理由:</span>
                <span className="text-gray-900">
                  {success.reason === 'requested_by_customer' ? 'お客様のご要望' :
                   success.reason === 'fraudulent' ? '不正利用' :
                   success.reason === 'duplicate' ? '重複決済' : success.reason}
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 mb-4">
            返金の反映には3-5営業日程度かかる場合があります。
          </div>

          <button
            onClick={onCancel}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        <button
          onClick={handleCancel}
          className="mr-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="text-lg font-medium text-gray-900">
          {showConfirmation ? '返金確認' : '返金申請'}
        </h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </div>
      )}

      {showConfirmation ? (
        <div>
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
              <div className="text-sm text-yellow-700">
                <strong>確認:</strong> 以下の内容で返金処理を実行します。この操作は取り消せません。
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                {description && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">商品/サービス:</span>
                    <span className="text-gray-900">{description}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">元の決済額:</span>
                  <span className="text-gray-900">{formatAmount(originalAmount, currency)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-600">返金額:</span>
                  <span className="text-gray-900">{formatAmount(refundAmount, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">返金理由:</span>
                  <span className="text-gray-900">
                    {refundReason === 'requested_by_customer' ? 'お客様のご要望' :
                     refundReason === 'fraudulent' ? '不正利用' :
                     refundReason === 'duplicate' ? '重複決済' : refundReason}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              disabled={isProcessing}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleRefundRequest}
              disabled={isProcessing}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                  処理中...
                </>
              ) : (
                '返金実行'
              )}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="space-y-4 mb-6">
            {description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  商品/サービス
                </label>
                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-900">
                  {description}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                返金額
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(parseInt(e.target.value) || 0)}
                  max={originalAmount}
                  min={0}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                最大: {formatAmount(originalAmount, currency)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                返金理由
              </label>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="requested_by_customer">お客様のご要望</option>
                <option value="duplicate">重複決済</option>
                <option value="fraudulent">不正利用</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleRefundRequest}
            disabled={isProcessing || refundAmount <= 0 || refundAmount > originalAmount}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            返金申請を送信
          </button>

          <div className="mt-4 text-xs text-gray-500 text-center">
            返金処理には3-5営業日程度かかる場合があります
          </div>
        </div>
      )}
    </div>
  )
}