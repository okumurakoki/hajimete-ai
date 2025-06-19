'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export const dynamic = 'force-dynamic'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SeminarCancellation from '@/components/SeminarCancellation'
import { Seminar, generateMockSeminars } from '@/lib/live'

export default function SeminarsPage() {
  const { user } = useAuth()
  const [seminars, setSeminars] = useState<Seminar[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [filter, setFilter] = useState<'all' | 'available' | 'registered'>('all')
  const [cancellingseminar, setCancellingS] = useState<{id: string, title: string} | null>(null)
  const [registeredSeminars, setRegisteredSeminars] = useState(new Set(['seminar-1', 'seminar-3']))

  useEffect(() => {
    const mockSeminars = generateMockSeminars()
    setSeminars(mockSeminars)
  }, [])

  const userPlan = user?.plan || 'free'

  const filteredSeminars = seminars.filter(seminar => {
    const seminarDate = new Date(seminar.date)
    const monthMatch = seminarDate.getMonth() === selectedMonth
    
    if (!monthMatch) return false
    
    switch (filter) {
      case 'available':
        return seminar.registered < seminar.capacity && 
               (!seminar.isPremium || userPlan === 'premium')
      case 'registered':
        return registeredSeminars.has(seminar.id)
      default:
        return true
    }
  })

  const canRegister = (seminar: Seminar) => {
    return seminar.registered < seminar.capacity && 
           (!seminar.isPremium || userPlan === 'premium') &&
           !registeredSeminars.has(seminar.id)
  }

  const getPriceForPlan = (planType: string) => {
    switch (planType) {
      case 'free': return 5500
      case 'basic': return 5500  
      case 'premium': return 4400
      default: return 5500
    }
  }

  const formatPrice = (price: number) => {
    return price === 0 ? '無料' : `¥${price.toLocaleString('ja-JP')}`
  }

  const handleCancelRegistration = (seminarId: string, seminarTitle: string) => {
    setCancellingS({ id: seminarId, title: seminarTitle })
  }

  const handleCancellationComplete = () => {
    if (cancellingseminar) {
      // Remove from registered seminars
      const newRegisteredSeminars = new Set(registeredSeminars)
      newRegisteredSeminars.delete(cancellingseminar.id)
      setRegisteredSeminars(newRegisteredSeminars)
      
      // Close modal
      setCancellingS(null)
      
      // Show success message
      alert('セミナーの参加をキャンセルしました')
    }
  }

  const handleRegister = (seminarId: string) => {
    // セミナー詳細ページに遷移
    window.location.href = `/seminars/${seminarId}`
  }

  const months = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return '初級'
      case 'intermediate': return '中級'
      case 'advanced': return '上級'
      default: return '初級'
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">セミナー予約</h1>
          <p className="text-gray-600">
            月8回開催される実践的なAIセミナーに参加しましょう。
            {userPlan === 'premium' ? 'プレミアムプランですべてのセミナーに参加できます。' : 'ベーシックプランでは基本セミナーに参加できます。'}
          </p>
        </div>

        {/* Plan Info */}
        <div className={`rounded-lg p-6 mb-8 ${
          userPlan === 'premium' 
            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' 
            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
        }`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {userPlan === 'premium' ? 'プレミアムプラン' : 'ベーシックプラン'}
              </h2>
              <p className="opacity-90">
                {userPlan === 'premium' 
                  ? '月8回すべてのセミナー + プレミアム限定セミナーに参加可能'
                  : '月4回の基本セミナーに参加可能'
                }
              </p>
            </div>
            {userPlan !== 'premium' && (
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                プランをアップグレード
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">月を選択</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">フィルター</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">すべてのセミナー</option>
                <option value="available">参加可能</option>
                <option value="registered">登録済み</option>
              </select>
            </div>

            <div className="ml-auto">
              <div className="text-sm text-gray-600">
                今月の参加可能セミナー: <span className="font-semibold">{filteredSeminars.filter(s => canRegister(s)).length}件</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seminars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSeminars.map((seminar) => {
            const isRegistered = registeredSeminars.has(seminar.id)
            const isFull = seminar.registered >= seminar.capacity
            const canUserRegister = canRegister(seminar)

            return (
              <div key={seminar.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {seminar.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {seminar.description}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-col gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(seminar.level)}`}>
                        {getLevelLabel(seminar.level)}
                      </span>
                      {seminar.isPremium && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          プレミアム
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Seminar Details */}
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{new Date(seminar.date).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>⏰</span>
                      <span>{seminar.startTime} - {seminar.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👨‍🏫</span>
                      <span>{seminar.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👥</span>
                      <span>{seminar.registered}/{seminar.capacity}名参加予定</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${isFull ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${(seminar.registered / seminar.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {isFull ? '満席' : `残り${seminar.capacity - seminar.registered}席`}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {seminar.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Price Info */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">参加料金</span>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatPrice(getPriceForPlan(userPlan))}
                        </div>
                        <div className="text-xs text-gray-500">
                          {userPlan === 'premium' ? 'プレミアム価格' : '通常価格'}
                        </div>
                      </div>
                    </div>
                    {userPlan !== 'premium' && (
                      <div className="text-xs text-purple-600 mt-1">
                        プレミアムプランなら {formatPrice(getPriceForPlan('premium'))} 
                        <span className="ml-1 text-gray-500">
                          ({formatPrice(getPriceForPlan(userPlan) - getPriceForPlan('premium'))}お得)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="flex gap-2">
                    {isRegistered ? (
                      <>
                        <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium">
                          ✓ 参加予定
                        </button>
                        <button
                          onClick={() => handleCancelRegistration(seminar.id, seminar.title)}
                          className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                        >
                          キャンセル
                        </button>
                      </>
                    ) : canUserRegister ? (
                      <button
                        onClick={() => handleRegister(seminar.id)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        詳細を見る・申し込み
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg font-medium cursor-not-allowed"
                      >
                        {isFull ? '満席' : seminar.isPremium && userPlan !== 'premium' ? 'プレミアム限定' : '参加不可'}
                      </button>
                    )}
                  </div>

                  {/* Zoom Info for registered seminars */}
                  {isRegistered && seminar.zoomMeetingId && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Zoom参加情報</h4>
                      <div className="text-sm text-blue-800">
                        <div>ミーティングID: {seminar.zoomMeetingId}</div>
                        {seminar.zoomPasscode && (
                          <div>パスコード: {seminar.zoomPasscode}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredSeminars.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              該当するセミナーが見つかりません
            </h3>
            <p className="text-gray-600">
              フィルターを変更するか、別の月を選択してください
            </p>
          </div>
        )}

        {/* Monthly Summary */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {months[selectedMonth]}のセミナー概要
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{seminars.length}</div>
              <div className="text-sm text-gray-600">総セミナー数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {seminars.filter(s => !s.isPremium).length}
              </div>
              <div className="text-sm text-gray-600">基本セミナー</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {seminars.filter(s => s.isPremium).length}
              </div>
              <div className="text-sm text-gray-600">プレミアム限定</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {Array.from(registeredSeminars).length}
              </div>
              <div className="text-sm text-gray-600">参加予定</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Cancellation Modal */}
      {cancellingseminar && (
        <SeminarCancellation
          seminarId={cancellingseminar.id}
          seminarTitle={cancellingseminar.title}
          onCancel={handleCancellationComplete}
          onClose={() => setCancellingS(null)}
        />
      )}
    </div>
  )
}