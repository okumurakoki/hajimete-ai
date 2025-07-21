'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoadingSpinner from '@/components/LoadingSpinner'
import { errorLogger } from '@/lib/error-logger'

interface SeminarDetail {
  id: string
  title: string
  description: string
  instructor: string
  startDate: string
  endDate: string
  duration: number
  price: number
  level: string
  category: string
  maxParticipants: number
  currentParticipants: number
  tags: string[]
  spotsLeft: number
  curriculum: string[]
  materials: string[]
}

export default function SeminarDetail() {
  const params = useParams()
  const [seminar, setSeminar] = useState<SeminarDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSeminar = async () => {
      try {
        const response = await fetch(`/api/seminars-mock/${params.id}`)
        if (!response.ok) {
          throw new Error('セミナー詳細の取得に失敗しました')
        }
        const data = await response.json()
        setSeminar(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '予期しないエラーが発生しました'
        setError(errorMessage)
        
        // エラーログに記録
        errorLogger.logError(
          `Seminar detail fetch failed: ${errorMessage}`,
          err instanceof Error ? err : new Error(String(err)),
          {
            component: 'SeminarDetailPage',
            url: window.location.href,
            seminarId: params.id as string
          }
        )
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchSeminar()
    }
  }, [params.id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'BEGINNER': return '初級'
      case 'INTERMEDIATE': return '中級'
      case 'ADVANCED': return '上級'
      default: return level
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !seminar) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 text-lg mb-4">{error || 'セミナーが見つかりません'}</div>
            <Link 
              href="/seminars"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              セミナー一覧に戻る
            </Link>
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
          {/* パンくずナビ */}
          <div className="mb-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">ホーム</Link>
            <span className="mx-2">/</span>
            <Link href="/seminars" className="hover:text-blue-600">セミナー一覧</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{seminar.title}</span>
          </div>

          {/* メインコンテンツ */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            {/* ヘッダー */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(seminar.level)}`}>
                  {getLevelText(seminar.level)}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {seminar.category}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{seminar.title}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-20 text-sm text-gray-500">開催日:</span>
                    <span>📅 {formatDate(seminar.startDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-20 text-sm text-gray-500">時間:</span>
                    <span>🕒 {formatTime(seminar.startDate)} - {formatTime(seminar.endDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-20 text-sm text-gray-500">時間:</span>
                    <span>⏱️ {seminar.duration}分</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-20 text-sm text-gray-500">講師:</span>
                    <span>👨‍🏫 {seminar.instructor}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-20 text-sm text-gray-500">料金:</span>
                    <span className="text-lg font-semibold text-green-600">💰 ¥{seminar.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-20 text-sm text-gray-500">定員:</span>
                    <span>👥 {seminar.currentParticipants}/{seminar.maxParticipants}人</span>
                    <span className={`ml-2 ${seminar.spotsLeft > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {seminar.spotsLeft > 0 ? `（残り${seminar.spotsLeft}席）` : '（満席）'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 説明 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">セミナー概要</h2>
              <p className="text-gray-700 leading-relaxed">{seminar.description}</p>
            </div>

            {/* タグ */}
            {seminar.tags.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">タグ</h2>
                <div className="flex flex-wrap gap-2">
                  {seminar.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* カリキュラム */}
            {seminar.curriculum && seminar.curriculum.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">カリキュラム</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <ul className="space-y-3">
                    {seminar.curriculum.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 提供資料 */}
            {seminar.materials && seminar.materials.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">提供資料</h2>
                <div className="bg-green-50 rounded-lg p-6">
                  <ul className="space-y-2">
                    {seminar.materials.map((material, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="text-green-600 mr-2">✓</span>
                        {material}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 申込ボタン */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  料金: ¥{seminar.price.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  {seminar.spotsLeft > 0 ? `残り${seminar.spotsLeft}席` : '満席'}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/seminars"
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  ← セミナー一覧に戻る
                </Link>
                
                {seminar.spotsLeft > 0 ? (
                  <Link 
                    href={`/payment/checkout?seminarId=${seminar.id}`}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    参加申込をする
                  </Link>
                ) : (
                  <button 
                    disabled 
                    className="bg-gray-400 text-white px-8 py-3 rounded-lg cursor-not-allowed font-semibold"
                  >
                    満席のため申込不可
                  </button>
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