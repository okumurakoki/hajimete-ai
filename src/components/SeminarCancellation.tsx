'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Clock, DollarSign, X, RefreshCw } from 'lucide-react'

interface SeminarCancellationProps {
  seminarId: string
  seminarTitle: string
  onCancel?: () => void
  onClose?: () => void
}

interface CancellationInfo {
  canCancel: boolean
  hoursUntilSeminar: number
  refundPercentage: number
  seminar: {
    id: string
    title: string
    date: string
    startTime: string
  }
}

export default function SeminarCancellation({
  seminarId,
  seminarTitle,
  onCancel,
  onClose
}: SeminarCancellationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [cancellationInfo, setCancellationInfo] = useState<CancellationInfo | null>(null)
  const [step, setStep] = useState<'check' | 'confirm' | 'processing' | 'success'>('check')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCancellationInfo()
  }, [seminarId])

  const fetchCancellationInfo = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/seminars/${seminarId}/cancel`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch cancellation info')
      }

      setCancellationInfo(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelConfirm = async () => {
    try {
      setStep('processing')
      setError(null)

      const response = await fetch(`/api/seminars/${seminarId}/cancel`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Cancellation failed')
      }

      setStep('success')
      // Call parent callback after a short delay
      setTimeout(() => {
        onCancel?.()
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStep('confirm')
    }
  }

  const formatTime = (hours: number) => {
    if (hours < 1) {
      return `${Math.floor(hours * 60)}分`
    } else if (hours < 24) {
      return `${Math.floor(hours)}時間${Math.floor((hours % 1) * 60)}分`
    } else {
      const days = Math.floor(hours / 24)
      const remainingHours = Math.floor(hours % 24)
      return `${days}日${remainingHours}時間`
    }
  }

  if (isLoading && !cancellationInfo) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <RefreshCw size={24} className="animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">キャンセル情報を確認しています...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !cancellationInfo) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertTriangle size={24} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">エラーが発生しました</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={fetchCancellationInfo}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                再試行
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!cancellationInfo) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            セミナーキャンセル
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'check' && (
            <>
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">{seminarTitle}</h4>
                <div className="text-sm text-gray-600">
                  {new Date(cancellationInfo.seminar.date).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })} {cancellationInfo.seminar.startTime}〜
                </div>
              </div>

              {/* Cancellation Status */}
              <div className={`p-4 rounded-lg mb-6 ${
                cancellationInfo.canCancel 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start gap-3">
                  {cancellationInfo.canCancel ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  ) : (
                    <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className={`font-medium ${
                      cancellationInfo.canCancel ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {cancellationInfo.canCancel 
                        ? 'キャンセル可能' 
                        : 'キャンセル不可'
                      }
                    </div>
                    <div className={`text-sm ${
                      cancellationInfo.canCancel ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {cancellationInfo.canCancel 
                        ? `開始まで${formatTime(cancellationInfo.hoursUntilSeminar)}あります` 
                        : 'セミナー開始の2時間前を過ぎているため、キャンセルできません'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Refund Information */}
              {cancellationInfo.canCancel && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                  <div className="flex items-start gap-3">
                    <DollarSign size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-800 mb-1">返金について</div>
                      <div className="text-sm text-blue-700">
                        {cancellationInfo.refundPercentage === 100 && (
                          <span>24時間前のキャンセルのため、<strong>全額返金</strong>いたします。</span>
                        )}
                        {cancellationInfo.refundPercentage === 50 && (
                          <span>2-24時間前のキャンセルのため、<strong>50%返金</strong>いたします。</span>
                        )}
                        {cancellationInfo.refundPercentage === 0 && (
                          <span>キャンセル期限を過ぎているため、返金はございません。</span>
                        )}
                      </div>
                      {cancellationInfo.refundPercentage > 0 && (
                        <div className="text-xs text-blue-600 mt-1">
                          返金処理には3-5営業日かかります
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Cancellation Policy */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Clock size={16} />
                  キャンセルポリシー
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 24時間前まで: 全額返金</li>
                  <li>• 2-24時間前: 50%返金</li>
                  <li>• 2時間前以降: 返金なし・キャンセル不可</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {cancellationInfo.canCancel ? (
                  <>
                    <button
                      onClick={() => setStep('confirm')}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      キャンセルする
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      戻る
                    </button>
                  </>
                ) : (
                  <button
                    onClick={onClose}
                    className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    閉じる
                  </button>
                )}
              </div>
            </>
          )}

          {step === 'confirm' && (
            <>
              <div className="text-center mb-6">
                <AlertTriangle size={48} className="text-orange-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  本当にキャンセルしますか？
                </h4>
                <p className="text-gray-600">
                  この操作は取り消すことができません。
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="text-sm">
                  <div className="font-medium text-gray-900 mb-1">{seminarTitle}</div>
                  <div className="text-gray-600">
                    {new Date(cancellationInfo.seminar.date).toLocaleDateString('ja-JP')} {cancellationInfo.seminar.startTime}〜
                  </div>
                  {cancellationInfo.refundPercentage > 0 && (
                    <div className="text-blue-600 mt-2">
                      返金率: {cancellationInfo.refundPercentage}%
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-4">
                  <div className="text-red-800 text-sm">{error}</div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleCancelConfirm}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  はい、キャンセルします
                </button>
                <button
                  onClick={() => setStep('check')}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  戻る
                </button>
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <RefreshCw size={48} className="animate-spin mx-auto mb-4 text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                キャンセル処理中...
              </h4>
              <p className="text-gray-600">
                しばらくお待ちください
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">✓</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                キャンセル完了
              </h4>
              <p className="text-gray-600 mb-4">
                セミナーの参加をキャンセルしました。
              </p>
              {cancellationInfo.refundPercentage > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-800">
                  返金処理を開始しました。3-5営業日でお支払い方法に返金されます。
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}