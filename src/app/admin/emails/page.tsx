'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/layout/Layout'
import {
  Mail,
  Send,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Settings,
  TestTube
} from 'lucide-react'

export default function EmailManagementPage() {
  const [loading, setLoading] = useState(false)
  const [testLoading, setTestLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [testResult, setTestResult] = useState<any>(null)

  const sendReminders = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/courses/send-reminders', {
        method: 'POST'
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error sending reminders:', error)
      setResult({ error: 'Failed to send reminders' })
    } finally {
      setLoading(false)
    }
  }

  const checkUpcomingCourses = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/courses/send-reminders', {
        method: 'GET'
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error checking courses:', error)
      setResult({ error: 'Failed to check upcoming courses' })
    } finally {
      setLoading(false)
    }
  }

  const testEmail = async (type: 'registration' | 'zoom') => {
    setTestLoading(true)
    setTestResult(null)
    
    try {
      const response = await fetch('/api/test/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type })
      })
      
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      console.error('Error testing email:', error)
      setTestResult({ error: 'Failed to test email' })
    } finally {
      setTestLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ページヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">メール管理</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">講座通知とメール送信の管理</p>
        </div>
        {/* 概要カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">自動メール送信</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">有効</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">リマインダー</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">24時間前</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">メールプロバイダー</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {process.env.NODE_ENV === 'development' ? 'Dev' : 'SendGrid'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* メール送信操作 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Send className="w-6 h-6" />
            メール送信操作
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">リマインダー送信</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                24時間後に開始する講座の参加者にZoom招待メールを送信します。
              </p>
              <div className="flex gap-2">
                <button
                  onClick={sendReminders}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  リマインダー送信
                </button>
                <button
                  onClick={checkUpcomingCourses}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  対象講座確認
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">メールテスト</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                メールテンプレートの表示確認とメール送信機能のテストを行います。
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => testEmail('registration')}
                  disabled={testLoading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  {testLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
                  登録確認
                </button>
                <button
                  onClick={() => testEmail('zoom')}
                  disabled={testLoading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  Zoom招待
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 結果表示 */}
        {(result || testResult) && (
          <div className="space-y-4">
            {result && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  {result.error ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  実行結果
                </h3>
                
                {result.error ? (
                  <div className="text-red-600 dark:text-red-400">{result.error}</div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-gray-900 dark:text-gray-100">{result.message}</p>
                    {result.coursesProcessed !== undefined && (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {result.coursesProcessed}
                          </div>
                          <div className="text-sm text-blue-600 dark:text-blue-400">処理講座数</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {result.emailsSent}
                          </div>
                          <div className="text-sm text-green-600 dark:text-green-400">送信成功</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {result.emailsFailed}
                          </div>
                          <div className="text-sm text-red-600 dark:text-red-400">送信失敗</div>
                        </div>
                      </div>
                    )}
                    {result.upcomingCourses && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">対象講座一覧</h4>
                        <div className="space-y-2">
                          {result.upcomingCourses.map((course: any) => (
                            <div key={course.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">{course.title}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {new Date(course.startDate).toLocaleString('ja-JP')}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-sm">
                                  <Users className="w-4 h-4" />
                                  {course.registrationCount}名
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {testResult && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  {testResult.error ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  テスト結果
                </h3>
                
                {testResult.error ? (
                  <div className="text-red-600 dark:text-red-400">{testResult.error}</div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-gray-900 dark:text-gray-100">{testResult.message}</p>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Type: {testResult.type}
                    </div>
                    {process.env.NODE_ENV === 'development' && (
                      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200 mb-2">
                          <AlertCircle className="w-4 h-4" />
                          開発環境
                        </div>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          開発環境では実際にメールは送信されず、コンソールにログが出力されます。
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 注意事項 */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            注意事項
          </h3>
          <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
            <li>• リマインダーメールは講座開始の24時間前に自動送信されます</li>
            <li>• 本番環境では実際のメールアドレスにメールが送信されます</li>
            <li>• メール送信には API レート制限があります</li>
            <li>• 開発環境では SendGrid の代わりに Nodemailer を使用します</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}