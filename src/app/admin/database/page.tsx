'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminData } from '@/contexts/AdminDataContext'
import { useState, useEffect } from 'react'
import { database, videoDatabase, seminarDatabase, initializeDatabase } from '@/lib/database'
import { 
  Database, 
  RefreshCw, 
  Download, 
  Upload, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Activity,
  HardDrive,
  Users,
  FileText,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Settings,
  Info,
  Zap,
  Archive,
  Clock,
  Server,
  Shield,
  TrendingUp,
  Eye,
  AlertCircle,
  Wifi,
  Cpu
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface TableDetail {
  name: string
  rows: number
  size: string
  status: 'healthy' | 'warning' | 'error'
  lastModified: string
  indexCount: number
  avgQueryTime: number
  type: 'core' | 'cache' | 'analytics' | 'logs'
  description: string
}

interface BackupHistory {
  id: string
  timestamp: string
  size: string
  type: 'auto' | 'manual'
  status: 'completed' | 'failed' | 'in_progress'
  duration: string
}

interface DatabaseMetrics {
  performance: {
    queryTime: number
    cacheHitRate: number
    connectionCount: number
    transactionRate: number
  }
  storage: {
    dataSize: string
    indexSize: string
    freeSpace: string
    fragmentationLevel: number
  }
  activity: {
    readOps: number
    writeOps: number
    activeConnections: number
    locksWaiting: number
  }
}

export default function AdminDatabasePage() {
  const { data, refreshData } = useAdminData()
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'tables' | 'backups' | 'performance' | 'maintenance'>('overview')
  const [realStats, setRealStats] = useState({
    videos: 0,
    seminars: 0,
    videoProgress: 0,
    userActivities: 0,
    totalSize: '0 KB'
  })
  const [metrics, setMetrics] = useState<DatabaseMetrics>({
    performance: {
      queryTime: 12.5,
      cacheHitRate: 94.2,
      connectionCount: 23,
      transactionRate: 145
    },
    storage: {
      dataSize: data.system.database.size,
      indexSize: '23.4 MB',
      freeSpace: '1.2 GB',
      fragmentationLevel: 3.2
    },
    activity: {
      readOps: 1247,
      writeOps: 345,
      activeConnections: 12,
      locksWaiting: 0
    }
  })

  // Initialize and load real database stats
  useEffect(() => {
    const loadDatabaseStats = async () => {
      await initializeDatabase()
      
      // Get real data from in-memory database
      const videos = await videoDatabase.findAll()
      const seminars = await seminarDatabase.findAll()
      
      setRealStats({
        videos: videos.length,
        seminars: seminars.length,
        videoProgress: database.videoProgress.size,
        userActivities: database.userActivities.size,
        totalSize: calculateDatabaseSize()
      })
    }
    
    loadDatabaseStats()
  }, [])

  const calculateDatabaseSize = (): string => {
    // Rough calculation of in-memory database size
    const totalEntries = database.videos.size + database.seminars.size + 
                        database.videoProgress.size + database.userActivities.size
    const estimatedSize = totalEntries * 2 // KB per entry estimate
    
    if (estimatedSize < 1024) return `${estimatedSize} KB`
    return `${(estimatedSize / 1024).toFixed(1)} MB`
  }

  // Use real database stats
  const stats = {
    totalSize: realStats.totalSize,
    tables: 5, // videos, seminars, videoProgress, userActivities, seminarRegistrations
    users: data.users.total,
    videos: realStats.videos,
    seminars: realStats.seminars,
    lastBackup: data.system.database.lastBackup
  }

  const tables: TableDetail[] = [
    { 
      name: 'videos', 
      rows: realStats.videos, 
      size: `${Math.max(1, realStats.videos * 2)} KB`, 
      status: 'healthy',
      lastModified: new Date().toLocaleString('ja-JP'),
      indexCount: 6,
      avgQueryTime: 15.3,
      type: 'core',
      description: '動画メタデータとコンテンツ情報 (In-Memory)'
    },
    { 
      name: 'seminars', 
      rows: realStats.seminars, 
      size: `${Math.max(1, realStats.seminars * 2)} KB`, 
      status: 'healthy',
      lastModified: new Date().toLocaleString('ja-JP'),
      indexCount: 4,
      avgQueryTime: 6.7,
      type: 'core',
      description: 'セミナー情報とスケジュール管理 (In-Memory)'
    },
    { 
      name: 'video_progress', 
      rows: realStats.videoProgress, 
      size: `${Math.max(1, realStats.videoProgress * 1)} KB`, 
      status: 'healthy',
      lastModified: new Date().toLocaleString('ja-JP'),
      indexCount: 3,
      avgQueryTime: 8.5,
      type: 'core',
      description: 'ユーザー動画視聴進捗 (In-Memory)'
    },
    { 
      name: 'user_activities', 
      rows: realStats.userActivities, 
      size: `${Math.max(1, realStats.userActivities * 1)} KB`, 
      status: 'healthy',
      lastModified: new Date().toLocaleString('ja-JP'),
      indexCount: 2,
      avgQueryTime: 12.1,
      type: 'analytics',
      description: 'ユーザー活動ログ (In-Memory)'
    },
    { 
      name: 'seminar_registrations', 
      rows: 0, // Not implemented yet
      size: '0 KB', 
      status: 'healthy',
      lastModified: new Date().toLocaleString('ja-JP'),
      indexCount: 3,
      avgQueryTime: 5.2,
      type: 'core',
      description: 'セミナー登録情報 (In-Memory)'
    }
  ]

  const backupHistory: BackupHistory[] = [
    {
      id: 'backup-001',
      timestamp: '2024-06-18 14:30:00',
      size: '156.7 MB',
      type: 'auto',
      status: 'completed',
      duration: '2分 34秒'
    },
    {
      id: 'backup-002',
      timestamp: '2024-06-17 14:30:00',
      size: '154.2 MB',
      type: 'auto',
      status: 'completed',
      duration: '2分 18秒'
    },
    {
      id: 'backup-003',
      timestamp: '2024-06-16 14:30:00',
      size: '152.8 MB',
      type: 'auto',
      status: 'completed',
      duration: '2分 45秒'
    },
    {
      id: 'backup-004',
      timestamp: '2024-06-15 09:15:23',
      size: '151.5 MB',
      type: 'manual',
      status: 'completed',
      duration: '3分 12秒'
    }
  ]

  // リアルタイムメトリクス更新をシミュレート
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        performance: {
          ...prev.performance,
          queryTime: prev.performance.queryTime + (Math.random() - 0.5) * 2,
          connectionCount: Math.max(0, prev.performance.connectionCount + Math.floor(Math.random() * 6 - 3))
        },
        activity: {
          ...prev.activity,
          readOps: prev.activity.readOps + Math.floor(Math.random() * 20),
          writeOps: prev.activity.writeOps + Math.floor(Math.random() * 8)
        }
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle size={10} className="text-green-500" />
      case 'warning':
        return <AlertCircle size={10} className="text-yellow-500" />
      case 'error':
        return <AlertTriangle size={10} className="text-red-500" />
      default:
        return <CheckCircle size={10} className="text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'core':
        return 'bg-blue-100 text-blue-800'
      case 'cache':
        return 'bg-green-100 text-green-800'
      case 'analytics':
        return 'bg-purple-100 text-purple-800'
      case 'logs':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleBackup = async () => {
    setIsBackingUp(true)
    // Simulate backup
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsBackingUp(false)
  }

  const handleRestore = async () => {
    if (confirm('データベースを復元しますか？現在のデータは失われます。')) {
      setIsRestoring(true)
      // Simulate restore
      await new Promise(resolve => setTimeout(resolve, 5000))
      setIsRestoring(false)
    }
  }

  const handleOptimizeTable = async (tableName: string) => {
    if (confirm(`テーブル「${tableName}」を最適化しますか？`)) {
      // Simulate optimization
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(`テーブル「${tableName}」の最適化が完了しました`)
    }
  }

  return (
    <AdminLayout currentPage="database">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">データベース管理</h1>
            <p className="text-gray-600">
              データベースのバックアップ、復元、監視、メンテナンスを行います
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={refreshData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={10} />
              データ更新
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <Download size={10} />
              レポート出力
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: '概要', icon: Database },
                { id: 'tables', label: 'テーブル管理', icon: Settings },
                { id: 'backups', label: 'バックアップ', icon: Archive },
                { id: 'performance', label: 'パフォーマンス', icon: Activity },
                { id: 'maintenance', label: 'メンテナンス', icon: Zap }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={10} />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">データベースサイズ</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalSize}</p>
                      </div>
                      <HardDrive size={12} className="text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">テーブル数</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.tables}</p>
                      </div>
                      <Database size={12} className="text-green-600" />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">ユーザー数</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.users.toLocaleString()}</p>
                      </div>
                      <Users size={12} className="text-purple-600" />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">動画数</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.videos}</p>
                      </div>
                      <FileText size={12} className="text-orange-600" />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">セミナー数</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.seminars}</p>
                      </div>
                      <Calendar size={12} className="text-red-600" />
                    </div>
                  </div>
                </div>

                {/* Real-time Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Activity size={12} />
                      リアルタイム活動
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">読み取り操作/秒</span>
                        <span className="text-lg font-bold text-blue-600">{metrics.activity.readOps}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">書き込み操作/秒</span>
                        <span className="text-lg font-bold text-green-600">{metrics.activity.writeOps}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">アクティブ接続</span>
                        <span className="text-lg font-bold text-purple-600">{metrics.activity.activeConnections}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">待機中ロック</span>
                        <span className="text-lg font-bold text-red-600">{metrics.activity.locksWaiting}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Cpu size={12} />
                      パフォーマンス
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">平均クエリ時間</span>
                        <span className="text-lg font-bold text-blue-600">{metrics.performance.queryTime.toFixed(1)}ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">キャッシュヒット率</span>
                        <span className="text-lg font-bold text-green-600">{metrics.performance.cacheHitRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">接続数</span>
                        <span className="text-lg font-bold text-purple-600">{metrics.performance.connectionCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">トランザクション/秒</span>
                        <span className="text-lg font-bold text-orange-600">{metrics.performance.transactionRate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <HardDrive size={12} />
                      ストレージ
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">データサイズ</span>
                        <span className="text-lg font-bold text-blue-600">{metrics.storage.dataSize}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">インデックスサイズ</span>
                        <span className="text-lg font-bold text-green-600">{metrics.storage.indexSize}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">空き容量</span>
                        <span className="text-lg font-bold text-purple-600">{metrics.storage.freeSpace}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">断片化レベル</span>
                        <span className="text-lg font-bold text-yellow-600">{metrics.storage.fragmentationLevel}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Database Health */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="text-green-500" size={12} />
                    <h3 className="text-lg font-semibold text-gray-900">データベースヘルス</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <CheckCircle size={14} className="text-green-600 mx-auto mb-2" />
                      <h4 className="font-medium text-green-900">接続状態</h4>
                      <p className="text-sm text-green-700">正常</p>
                    </div>
                    
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <Activity size={14} className="text-blue-600 mx-auto mb-2" />
                      <h4 className="font-medium text-blue-900">パフォーマンス</h4>
                      <p className="text-sm text-blue-700">良好</p>
                    </div>
                    
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <HardDrive size={14} className="text-green-600 mx-auto mb-2" />
                      <h4 className="font-medium text-green-900">ディスク使用量</h4>
                      <p className="text-sm text-green-700">25% 使用中</p>
                    </div>

                    <div className="text-center p-4 bg-white rounded-lg border">
                      <Wifi size={14} className="text-green-600 mx-auto mb-2" />
                      <h4 className="font-medium text-green-900">ネットワーク</h4>
                      <p className="text-sm text-green-700">安定</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tables Tab */}
            {activeTab === 'tables' && (
              <div className="space-y-6">
                {/* Search and Filter */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search size={12} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="テーブルを検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Filter size={10} />
                      フィルター
                    </button>
                  </div>
                  <button 
                    onClick={() => alert('テーブル作成機能は開発中です')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    新しいテーブル
                  </button>
                </div>

                {/* Tables List */}
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            テーブル名
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            種類
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            レコード数
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            サイズ
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            インデックス
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            平均クエリ時間
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ステータス
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            アクション
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTables.map((table) => (
                          <tr key={table.name} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Database size={10} className="text-gray-400 mr-2" />
                                <div>
                                  <div className="font-medium text-gray-900">{table.name}</div>
                                  <div className="text-sm text-gray-500">{table.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(table.type)}`}>
                                {table.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {table.rows.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {table.size}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {table.indexCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {table.avgQueryTime.toFixed(1)}ms
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getStatusIcon(table.status)}
                                <span className={`text-sm ml-2 ${
                                  table.status === 'healthy' ? 'text-green-600' :
                                  table.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {table.status === 'healthy' ? '正常' :
                                   table.status === 'warning' ? '警告' : 'エラー'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => setSelectedTable(table.name)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  詳細
                                </button>
                                <button 
                                  onClick={() => handleOptimizeTable(table.name)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  最適化
                                </button>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <MoreVertical size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Backups Tab */}
            {activeTab === 'backups' && (
              <div className="space-y-6">
                {/* Backup Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-2">データベースバックアップ</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      現在のデータベースを安全にバックアップします
                    </p>
                    <button
                      onClick={handleBackup}
                      disabled={isBackingUp}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {isBackingUp ? <RefreshCw size={10} className="animate-spin" /> : <Download size={10} />}
                      {isBackingUp ? 'バックアップ中...' : 'バックアップ作成'}
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      最終バックアップ: {stats.lastBackup}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-2">データベース復元</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      バックアップファイルからデータベースを復元します
                    </p>
                    <button
                      onClick={handleRestore}
                      disabled={isRestoring}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {isRestoring ? <RefreshCw size={10} className="animate-spin" /> : <Upload size={10} />}
                      {isRestoring ? '復元中...' : 'バックアップから復元'}
                    </button>
                    <div className="flex items-center gap-1 mt-2">
                      <AlertTriangle size={12} className="text-orange-500" />
                      <p className="text-xs text-orange-600">
                        復元すると現在のデータは失われます
                      </p>
                    </div>
                  </div>
                </div>

                {/* Backup History */}
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200 bg-white">
                    <h3 className="text-lg font-semibold text-gray-900">バックアップ履歴</h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            作成日時
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            種類
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            サイズ
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            所要時間
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ステータス
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            アクション
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {backupHistory.map((backup) => (
                          <tr key={backup.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {backup.timestamp}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                backup.type === 'auto' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {backup.type === 'auto' ? '自動' : '手動'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {backup.size}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {backup.duration}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <CheckCircle size={10} className="text-green-500 mr-2" />
                                <span className="text-sm text-green-600">完了</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button className="text-blue-600 hover:text-blue-900">
                                  ダウンロード
                                </button>
                                <button 
                                  onClick={() => confirm('このバックアップで復元しますか？') && handleRestore()}
                                  className="text-orange-600 hover:text-orange-900"
                                >
                                  復元
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  削除
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">クエリパフォーマンス</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">平均応答時間</span>
                        <span className="text-lg font-bold text-blue-600">{metrics.performance.queryTime.toFixed(1)}ms</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">スロークエリ数</span>
                        <span className="text-lg font-bold text-yellow-600">12</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">最も重いクエリ</span>
                        <span className="text-lg font-bold text-red-600">245ms</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">接続とキャッシュ</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">アクティブ接続</span>
                        <span className="text-lg font-bold text-green-600">{metrics.performance.connectionCount}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">キャッシュヒット率</span>
                        <span className="text-lg font-bold text-blue-600">{metrics.performance.cacheHitRate}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">バッファプール使用率</span>
                        <span className="text-lg font-bold text-purple-600">87%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Maintenance Tab */}
            {activeTab === 'maintenance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">データベース最適化</h3>
                    <div className="space-y-4">
                      <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors">
                        全テーブルを最適化
                      </button>
                      <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors">
                        インデックスを再構築
                      </button>
                      <button className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors">
                        統計情報を更新
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">ログ管理</h3>
                    <div className="space-y-4">
                      <button className="w-full bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700 transition-colors">
                        古いログを削除
                      </button>
                      <button className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors">
                        エラーログを確認
                      </button>
                      <button className="w-full bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors">
                        ログローテーション設定
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="text-yellow-600" size={12} />
                    <h3 className="text-lg font-semibold text-yellow-900">メンテナンス スケジュール</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900">次回自動バックアップ</h4>
                      <p className="text-sm text-gray-600">2024-06-19 14:30:00</p>
                    </div>
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900">次回最適化</h4>
                      <p className="text-sm text-gray-600">2024-06-20 02:00:00</p>
                    </div>
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900">次回ログクリーンアップ</h4>
                      <p className="text-sm text-gray-600">2024-06-22 03:00:00</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}