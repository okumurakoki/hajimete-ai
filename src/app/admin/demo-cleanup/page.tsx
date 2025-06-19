'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Database, 
  Users, 
  Video, 
  Calendar, 
  FileText,
  Settings,
  Download,
  RefreshCw,
  Shield
} from 'lucide-react'

interface DemoDataItem {
  id: string
  name: string
  description: string
  type: 'users' | 'videos' | 'seminars' | 'content' | 'analytics' | 'settings'
  count: number
  size: string
  canDelete: boolean
  isSelected: boolean
}

export default function DemoCleanupPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [cleanupComplete, setCleanupComplete] = useState(false)
  
  const [demoData, setDemoData] = useState<DemoDataItem[]>([
    {
      id: 'demo-users',
      name: 'デモユーザーアカウント',
      description: '田中太郎、佐藤花子など5つのテストアカウント',
      type: 'users',
      count: 5,
      size: '2.4KB',
      canDelete: true,
      isSelected: true
    },
    {
      id: 'demo-videos',
      name: 'デモ動画コンテンツ',
      description: 'サンプル動画とメタデータ',
      type: 'videos',
      count: 12,
      size: '1.2MB',
      canDelete: true,
      isSelected: true
    },
    {
      id: 'demo-seminars',
      name: 'デモセミナー情報',
      description: 'サンプルライブセミナーとアーカイブ',
      type: 'seminars',
      count: 8,
      size: '856KB',
      canDelete: true,
      isSelected: true
    },
    {
      id: 'sample-analytics',
      name: 'サンプル分析データ',
      description: '模擬的な視聴統計と利用データ',
      type: 'analytics',
      count: 150,
      size: '45KB',
      canDelete: true,
      isSelected: true
    },
    {
      id: 'test-content',
      name: 'テストコンテンツ',
      description: 'Lorem Ipsum等のプレースホルダーテキスト',
      type: 'content',
      count: 23,
      size: '12KB',
      canDelete: true,
      isSelected: true
    },
    {
      id: 'auth-context',
      name: 'デモ認証設定',
      description: 'demo@hajimete-ai.com アカウント設定',
      type: 'settings',
      count: 1,
      size: '1.2KB',
      canDelete: false,
      isSelected: false
    }
  ])

  const handleSelectAll = () => {
    const selectableItems = demoData.filter(item => item.canDelete)
    const allSelected = selectableItems.every(item => item.isSelected)
    
    setDemoData(prev => prev.map(item => ({
      ...item,
      isSelected: item.canDelete ? !allSelected : item.isSelected
    })))
  }

  const handleSelectItem = (id: string) => {
    setDemoData(prev => prev.map(item => 
      item.id === id ? { ...item, isSelected: !item.isSelected } : item
    ))
  }

  const handleCleanup = async () => {
    const selectedItems = demoData.filter(item => item.isSelected)
    
    if (selectedItems.length === 0) {
      alert('削除するアイテムを選択してください')
      return
    }

    const confirmed = confirm(
      `${selectedItems.length}個のデモデータアイテムを削除します。\n\nこの操作は取り消せません。本当によろしいですか？`
    )

    if (!confirmed) return

    setIsProcessing(true)

    // シミュレートされた削除プロセス
    for (let i = 0; i < selectedItems.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setDemoData(prev => prev.map(item => 
        selectedItems[i].id === item.id 
          ? { ...item, isSelected: false, count: 0, size: '0KB' }
          : item
      ))
    }

    setIsProcessing(false)
    setCleanupComplete(true)
  }

  const handleExportBeforeCleanup = () => {
    alert('デモデータがJSONファイルとしてエクスポートされます（実装時）')
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'users': return <Users size={12} className="text-blue-600" />
      case 'videos': return <Video size={12} className="text-green-600" />
      case 'seminars': return <Calendar size={12} className="text-purple-600" />
      case 'content': return <FileText size={12} className="text-orange-600" />
      case 'analytics': return <Database size={12} className="text-red-600" />
      case 'settings': return <Settings size={12} className="text-gray-600" />
      default: return <FileText size={12} className="text-gray-600" />
    }
  }

  const selectedCount = demoData.filter(item => item.isSelected).length
  const totalSize = demoData
    .filter(item => item.isSelected)
    .reduce((total, item) => {
      const size = parseFloat(item.size.replace(/[^\d.]/g, ''))
      const unit = item.size.includes('MB') ? 1000 : 1
      return total + (size * unit)
    }, 0)

  return (
    <AdminLayout currentPage="demo">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">デモデータ削除</h1>
          <p className="text-gray-600">
            本番環境に移行する前に、デモデータとテスト用コンテンツを削除します。
          </p>
        </div>

        {!cleanupComplete ? (
          <>
            {/* Warning Banner */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle size={14} className="text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">重要な注意事項</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    この操作は取り消すことができません。削除前にデータのバックアップを取ることをお勧めします。
                    本番環境で実際の顧客データが存在する場合は、この機能を使用しないでください。
                  </p>
                </div>
              </div>
            </div>

            {/* Export Option */}
            <div className="bg-white rounded-lg border p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Download size={12} />
                削除前のバックアップ
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                削除するデモデータをJSONファイルとしてエクスポートできます。
              </p>
              <button
                onClick={handleExportBeforeCleanup}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Download size={10} />
                デモデータをエクスポート
              </button>
            </div>

            {/* Data Selection */}
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">削除対象の選択</h3>
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    全て選択/解除
                  </button>
                </div>
              </div>

              <div className="divide-y">
                {demoData.map((item) => (
                  <div key={item.id} className="p-4">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={item.isSelected}
                        onChange={() => handleSelectItem(item.id)}
                        disabled={!item.canDelete}
                        className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(item.type)}
                          <span className="font-medium text-gray-900">{item.name}</span>
                          {!item.canDelete && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs flex items-center gap-1">
                              <Shield size={8} />
                              保護済み
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{item.count}個のアイテム</span>
                          <span>{item.size}</span>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            {selectedCount > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h4 className="font-medium text-blue-900 mb-2">削除サマリー</h4>
                <div className="text-sm text-blue-800">
                  <p>{selectedCount}個のデータカテゴリ</p>
                  <p>合計サイズ: {totalSize > 1000 ? `${(totalSize/1000).toFixed(1)}MB` : `${totalSize.toFixed(0)}KB`}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => window.history.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleCleanup}
                disabled={selectedCount === 0 || isProcessing}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw size={10} className="animate-spin" />
                    削除中...
                  </>
                ) : (
                  <>
                    <Trash2 size={10} />
                    {selectedCount}個のアイテムを削除
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={19} className="text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              デモデータの削除が完了しました
            </h2>
            <p className="text-gray-600 mb-6">
              選択されたデモデータが正常に削除されました。<br />
              システムは本番環境で使用する準備ができました。
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => window.location.href = '/admin/dashboard'}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                管理画面に戻る
              </button>
              <button
                onClick={() => setCleanupComplete(false)}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                その他のクリーンアップ
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}