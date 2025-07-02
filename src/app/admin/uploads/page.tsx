'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { DashboardLayout } from '@/components/layout/Layout'
import { 
  Upload, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Trash2,
  RefreshCw,
  Filter,
  Search,
  Download,
  Video,
  FileText,
  Calendar,
  User
} from 'lucide-react'

interface UploadTask {
  id: string
  userId: string
  filename: string
  fileSize: number
  mimeType: string
  vimeoUploadUrl: string | null
  vimeoTicket: string | null
  vimeoVideoId: string | null
  status: 'PENDING' | 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  progress: number
  errorMessage: string | null
  title: string | null
  description: string | null
  lessonId: string | null
  createdAt: string
  updatedAt: string
  user: {
    firstName: string | null
    lastName: string | null
    email: string
  }
}

interface FilterOptions {
  status: string
  search: string
  sortBy: string
  dateRange: string
}

export default function UploadManagementPage() {
  const { userId } = useAuth()
  const [uploads, setUploads] = useState<UploadTask[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    search: '',
    sortBy: 'newest',
    dateRange: 'all'
  })
  const [selectedUploads, setSelectedUploads] = useState<Set<string>>(new Set())
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (userId) {
      fetchUploads()
    }
  }, [userId, filters])

  const fetchUploads = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.status !== 'all') params.append('status', filters.status)
      if (filters.search) params.append('search', filters.search)
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.dateRange !== 'all') params.append('dateRange', filters.dateRange)
      
      const response = await fetch(`/api/upload-tasks?${params.toString()}`)
      
      if (response.ok) {
        const data = await response.json()
        setUploads(data.uploads || [])
      } else {
        console.error('Failed to fetch uploads')
      }
    } catch (error) {
      console.error('Error fetching uploads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedUploads.size === 0) return
    
    try {
      const deletePromises = Array.from(selectedUploads).map(uploadId =>
        fetch(`/api/upload-tasks/${uploadId}`, { method: 'DELETE' })
      )
      
      await Promise.all(deletePromises)
      setSelectedUploads(new Set())
      setShowDeleteModal(false)
      fetchUploads()
    } catch (error) {
      console.error('Error deleting uploads:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'UPLOADING':
        return <Upload className="w-4 h-4 text-blue-500" />
      case 'PROCESSING':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
      case 'UPLOADING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
      case 'FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
    }
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500'
      case 'FAILED':
        return 'bg-red-500'
      case 'UPLOADING':
      case 'PROCESSING':
        return 'bg-blue-500'
      default:
        return 'bg-gray-300'
    }
  }

  const toggleSelectUpload = (uploadId: string) => {
    const newSelected = new Set(selectedUploads)
    if (newSelected.has(uploadId)) {
      newSelected.delete(uploadId)
    } else {
      newSelected.add(uploadId)
    }
    setSelectedUploads(newSelected)
  }

  const selectAllUploads = () => {
    if (selectedUploads.size === uploads.length) {
      setSelectedUploads(new Set())
    } else {
      setSelectedUploads(new Set(uploads.map(upload => upload.id)))
    }
  }

  return (
    <DashboardLayout title="アップロード管理" description="動画アップロードタスクの管理と監視">
      <div className="space-y-6">
        {/* フィルターとアクション */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* 検索 */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ファイル名やタイトルで検索..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            {/* ステータスフィルター */}
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">全てのステータス</option>
              <option value="PENDING">待機中</option>
              <option value="UPLOADING">アップロード中</option>
              <option value="PROCESSING">処理中</option>
              <option value="COMPLETED">完了</option>
              <option value="FAILED">失敗</option>
            </select>
            
            {/* ソート */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="newest">新しい順</option>
              <option value="oldest">古い順</option>
              <option value="filename">ファイル名順</option>
              <option value="status">ステータス順</option>
              <option value="progress">進捗順</option>
            </select>
            
            {/* 期間フィルター */}
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">全期間</option>
              <option value="today">今日</option>
              <option value="week">1週間</option>
              <option value="month">1ヶ月</option>
            </select>
          </div>
          
          {/* アクションボタン */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedUploads.size === uploads.length && uploads.length > 0}
                  onChange={selectAllUploads}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  全て選択 ({selectedUploads.size}/{uploads.length})
                </span>
              </label>
              
              {selectedUploads.size > 0 && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  削除 ({selectedUploads.size})
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={fetchUploads}
                className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                更新
              </button>
            </div>
          </div>
        </div>

        {/* アップロード統計 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <Upload className="w-5 h-5 text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">総アップロード数</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {uploads.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">完了</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {uploads.filter(u => u.status === 'COMPLETED').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <RefreshCw className="w-5 h-5 text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">処理中</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {uploads.filter(u => ['UPLOADING', 'PROCESSING'].includes(u.status)).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-yellow-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">待機中</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {uploads.filter(u => u.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">失敗</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {uploads.filter(u => u.status === 'FAILED').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* アップロード一覧 */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : uploads.length === 0 ? (
          <div className="text-center py-12">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              アップロードタスクがありません
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filters.search || filters.status !== 'all' 
                ? '検索条件に一致するアップロードが見つかりませんでした。' 
                : 'まだアップロードタスクがありません。'}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedUploads.size === uploads.length && uploads.length > 0}
                        onChange={selectAllUploads}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ファイル
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ユーザー
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      進捗
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      作成日時
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {uploads.map((upload) => (
                    <tr key={upload.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedUploads.has(upload.id)}
                          onChange={() => toggleSelectUpload(upload.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                              <Video className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {upload.title || upload.filename}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {formatFileSize(upload.fileSize)} • {upload.mimeType}
                            </div>
                            {upload.lessonId && (
                              <div className="text-xs text-blue-600 dark:text-blue-400">
                                レッスンID: {upload.lessonId}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {upload.user.firstName} {upload.user.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {upload.user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(upload.status)}`}>
                          {getStatusIcon(upload.status)}
                          <span className="ml-1">{upload.status}</span>
                        </span>
                        {upload.errorMessage && (
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                            {upload.errorMessage}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(upload.status)}`}
                            style={{ width: `${upload.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {upload.progress}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(upload.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {upload.vimeoVideoId && (
                            <button
                              onClick={() => window.open(`/videos/${upload.vimeoVideoId}`, '_blank')}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedUploads(new Set([upload.id]))}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 削除確認モーダル */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-500" />
                アップロードタスクを削除
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                選択した{selectedUploads.size}個のアップロードタスクを削除してもよろしいですか？
                この操作は元に戻せません。
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  削除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}