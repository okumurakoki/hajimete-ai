'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Users, 
  Video, 
  Edit, 
  Trash2, 
  Plus, 
  ExternalLink,
  Search,
  Filter,
  Clock,
  UserCheck,
  UserX,
  Settings
} from 'lucide-react'
import { ZoomMeeting, ZoomWebinar, zoomAPI } from '@/lib/zoom'
import { SeminarRecord, SeminarRegistration } from '@/lib/database-schema'

interface SeminarManagementCMSProps {
  onSeminarSelect?: (seminar: SeminarRecord) => void
}

export default function SeminarManagementCMS({ onSeminarSelect }: SeminarManagementCMSProps) {
  const [seminars, setSeminars] = useState<SeminarRecord[]>([])
  const [registrations, setRegistrations] = useState<SeminarRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [selectedSeminars, setSelectedSeminars] = useState<string[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingSeminar, setEditingSeminar] = useState<SeminarRecord | null>(null)
  const [showRegistrations, setShowRegistrations] = useState<string | null>(null)

  const statusOptions = [
    { value: 'all', label: 'すべて' },
    { value: 'scheduled', label: '予定' },
    { value: 'live', label: '配信中' },
    { value: 'completed', label: '完了' },
    { value: 'cancelled', label: 'キャンセル' }
  ]

  const typeOptions = [
    { value: 'all', label: 'すべて' },
    { value: 'meeting', label: 'ミーティング' },
    { value: 'webinar', label: 'ウェビナー' }
  ]

  const departments = [
    { id: 'ai-basics', name: 'AI基礎学部' },
    { id: 'productivity', name: '業務効率化学部' },
    { id: 'practical', name: '実践応用学部' },
    { id: 'ai-development', name: 'AI開発学部' }
  ]

  // モックデータの生成
  useEffect(() => {
    const generateMockSeminars = (): SeminarRecord[] => {
      return [
        {
          id: '1',
          title: 'ChatGPT実践活用セミナー',
          description: 'ビジネスシーンでのChatGPT活用法をライブで解説します',
          zoom_meeting_id: '123456789',
          zoom_webinar_id: undefined,
          zoom_join_url: 'https://zoom.us/j/123456789?pwd=abc123',
          zoom_start_url: 'https://zoom.us/s/123456789?pwd=abc123',
          zoom_password: 'chatgpt2024',
          type: 'meeting',
          department: 'ai-basics',
          is_premium: false,
          scheduled_date: new Date('2024-02-15T10:00:00'),
          duration: 90,
          max_participants: 100,
          instructor_name: '田中AI博士',
          instructor_email: 'tanaka@hajimete-ai.com',
          status: 'scheduled',
          registration_required: true,
          auto_recording: true,
          waiting_room: true,
          price_free: 5500,
          price_basic: 5500,
          price_premium: 4400,
          created_at: new Date('2024-01-20'),
          updated_at: new Date('2024-01-20')
        },
        {
          id: '2',
          title: 'プレミアム限定：AI開発者向け技術セッション',
          description: 'TensorFlowを使った機械学習モデルの構築を実践的に学びます',
          zoom_meeting_id: undefined,
          zoom_webinar_id: '987654321',
          zoom_join_url: 'https://zoom.us/j/987654321?pwd=def456',
          zoom_start_url: 'https://zoom.us/s/987654321?pwd=def456',
          zoom_password: 'aidev2024',
          type: 'webinar',
          department: 'ai-development',
          is_premium: true,
          scheduled_date: new Date('2024-02-20T14:00:00'),
          duration: 120,
          max_participants: 500,
          instructor_name: '山田ML研究員',
          instructor_email: 'yamada@hajimete-ai.com',
          status: 'scheduled',
          registration_required: true,
          auto_recording: true,
          waiting_room: false,
          price_free: 5500,
          price_basic: 5500,
          price_premium: 4400,
          created_at: new Date('2024-01-22'),
          updated_at: new Date('2024-01-22')
        },
        {
          id: '3',
          title: 'Excel業務効率化マスタークラス',
          description: 'Excel関数とマクロで作業時間を50%短縮する方法',
          zoom_meeting_id: '456789123',
          zoom_webinar_id: undefined,
          zoom_join_url: 'https://zoom.us/j/456789123?pwd=ghi789',
          zoom_start_url: 'https://zoom.us/s/456789123?pwd=ghi789',
          zoom_password: 'excel2024',
          type: 'meeting',
          department: 'productivity',
          is_premium: false,
          scheduled_date: new Date('2024-01-25T15:00:00'),
          duration: 60,
          max_participants: 150,
          instructor_name: '佐藤エクセル先生',
          instructor_email: 'sato@hajimete-ai.com',
          status: 'completed',
          registration_required: true,
          auto_recording: true,
          waiting_room: true,
          price_free: 5500,
          price_basic: 5500,
          price_premium: 4400,
          created_at: new Date('2024-01-10'),
          updated_at: new Date('2024-01-25')
        }
      ]
    }

    const generateMockRegistrations = (): SeminarRegistration[] => {
      return [
        {
          id: '1',
          seminar_id: '1',
          user_id: 'user1',
          user_email: 'user1@example.com',
          user_name: '太郎 田中',
          user_plan: 'basic',
          registration_date: new Date('2024-01-21'),
          attendance_status: 'registered',
          payment_status: 'paid',
          payment_amount: 5500,
          zoom_registrant_id: 'reg_123',
          created_at: new Date('2024-01-21'),
          updated_at: new Date('2024-01-21')
        },
        {
          id: '2',
          seminar_id: '1',
          user_id: 'user2',
          user_email: 'user2@example.com',
          user_name: '花子 佐藤',
          user_plan: 'premium',
          registration_date: new Date('2024-01-22'),
          attendance_status: 'registered',
          payment_status: 'paid',
          payment_amount: 4400,
          zoom_registrant_id: 'reg_456',
          created_at: new Date('2024-01-22'),
          updated_at: new Date('2024-01-22')
        },
        {
          id: '3',
          seminar_id: '3',
          user_id: 'user3',
          user_email: 'user3@example.com',
          user_name: '次郎 山田',
          user_plan: 'free',
          registration_date: new Date('2024-01-15'),
          attendance_status: 'attended',
          payment_status: 'paid',
          payment_amount: 5500,
          zoom_registrant_id: 'reg_789',
          created_at: new Date('2024-01-15'),
          updated_at: new Date('2024-01-25')
        }
      ]
    }

    setSeminars(generateMockSeminars())
    setRegistrations(generateMockRegistrations())
    setLoading(false)
  }, [])

  // フィルタリングされたセミナー
  const filteredSeminars = seminars.filter(seminar => {
    const matchesSearch = seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         seminar.instructor_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || seminar.status === filterStatus
    const matchesType = filterType === 'all' || seminar.type === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const handleSeminarStatusChange = async (seminarId: string, newStatus: 'scheduled' | 'live' | 'completed' | 'cancelled') => {
    setSeminars(seminars.map(seminar => 
      seminar.id === seminarId 
        ? { ...seminar, status: newStatus, updated_at: new Date() }
        : seminar
    ))
  }

  const handleSeminarDelete = async (seminarId: string) => {
    if (confirm('このセミナーを削除してもよろしいですか？削除されたデータは復元できません。')) {
      try {
        const seminar = seminars.find(s => s.id === seminarId)
        if (seminar) {
          // Zoomからも削除
          if (seminar.zoom_meeting_id) {
            // await zoomAPI.deleteMeeting(seminar.zoom_meeting_id)
          }
          if (seminar.zoom_webinar_id) {
            // await zoomAPI.deleteWebinar(seminar.zoom_webinar_id)
          }
        }
        setSeminars(seminars.filter(s => s.id !== seminarId))
        // 関連する登録も削除
        setRegistrations(registrations.filter(r => r.seminar_id !== seminarId))
      } catch (error) {
        console.error('Delete error:', error)
        alert('削除に失敗しました。')
      }
    }
  }

  const createZoomMeeting = async (seminarData: Partial<SeminarRecord>) => {
    try {
      // Zoom ミーティング/ウェビナーを作成
      const meetingData = {
        topic: seminarData.title || '',
        type: 2, // Scheduled meeting
        start_time: seminarData.scheduled_date?.toISOString(),
        duration: seminarData.duration || 60,
        timezone: 'Asia/Tokyo',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          waiting_room: seminarData.waiting_room || true,
          auto_recording: (seminarData.auto_recording ? 'cloud' : 'none') as 'none' | 'local' | 'cloud'
        }
      }

      if (seminarData.type === 'webinar') {
        const webinar = await zoomAPI.createWebinar('me', meetingData)
        return {
          zoom_webinar_id: webinar.id.toString(),
          zoom_join_url: webinar.join_url,
          zoom_start_url: webinar.start_url,
          zoom_password: webinar.password
        }
      } else {
        const meeting = await zoomAPI.createMeeting('me', meetingData)
        return {
          zoom_meeting_id: meeting.id.toString(),
          zoom_join_url: meeting.join_url,
          zoom_start_url: meeting.start_url,
          zoom_password: meeting.password
        }
      }
    } catch (error) {
      console.error('Zoom API error:', error)
      // フォールバック: モックデータを返す
      return {
        zoom_meeting_id: `mock_${Date.now()}`,
        zoom_join_url: `https://zoom.us/j/mock${Date.now()}`,
        zoom_start_url: `https://zoom.us/s/mock${Date.now()}`,
        zoom_password: 'mock2024'
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      scheduled: 'bg-blue-100 text-blue-800',
      live: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }
    const labels = {
      scheduled: '予定',
      live: '配信中',
      completed: '完了',
      cancelled: 'キャンセル'
    }
    return { className: badges[status as keyof typeof badges], label: labels[status as keyof typeof labels] }
  }

  const getTypeBadge = (type: string) => {
    const badges = {
      meeting: 'bg-purple-100 text-purple-800',
      webinar: 'bg-orange-100 text-orange-800'
    }
    const labels = {
      meeting: 'ミーティング',
      webinar: 'ウェビナー'
    }
    return { className: badges[type as keyof typeof badges], label: labels[type as keyof typeof labels] }
  }

  const getDepartmentName = (id: string) => {
    return departments.find(d => d.id === id)?.name || id
  }

  const getSeminarRegistrations = (seminarId: string) => {
    return registrations.filter(r => r.seminar_id === seminarId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">セミナーデータを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">セミナー管理</h1>
          <p className="text-gray-600">Zoomとの連携によりオンラインセミナーを管理</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={10} />
            セミナー作成
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{seminars.length}</div>
          <div className="text-sm text-gray-600">総セミナー数</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {seminars.filter(s => s.status === 'scheduled').length}
          </div>
          <div className="text-sm text-gray-600">予定</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">
            {seminars.filter(s => s.status === 'live').length}
          </div>
          <div className="text-sm text-gray-600">配信中</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {registrations.length}
          </div>
          <div className="text-sm text-gray-600">総参加登録数</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
              <input
                type="text"
                placeholder="セミナータイトルや講師名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Seminar List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  セミナー情報
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日時・時間
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス・種別
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  参加者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSeminars.map((seminar) => {
                const statusBadge = getStatusBadge(seminar.status)
                const typeBadge = getTypeBadge(seminar.type)
                const seminarRegistrations = getSeminarRegistrations(seminar.id)
                
                return (
                  <tr key={seminar.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar size={12} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900">{seminar.title}</h3>
                          <p className="text-sm text-gray-500">{seminar.instructor_name}</p>
                          <p className="text-sm text-gray-500">{getDepartmentName(seminar.department)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {seminar.is_premium && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
                                プレミアム
                              </span>
                            )}
                            {seminar.auto_recording && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                                録画あり
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {seminar.scheduled_date.toLocaleDateString('ja-JP')}
                        </div>
                        <div className="text-gray-500">
                          {seminar.scheduled_date.toLocaleTimeString('ja-JP', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 mt-1">
                          <Clock size={12} />
                          {seminar.duration}分
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.className}`}>
                          {statusBadge.label}
                        </span>
                        <br />
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeBadge.className}`}>
                          {typeBadge.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Users size={10} className="text-gray-400" />
                          <span className="font-medium">
                            {seminarRegistrations.length}
                            {seminar.max_participants && ` / ${seminar.max_participants}`}
                          </span>
                        </div>
                        <button
                          onClick={() => setShowRegistrations(
                            showRegistrations === seminar.id ? null : seminar.id
                          )}
                          className="text-blue-600 hover:text-blue-700 text-xs mt-1"
                        >
                          参加者一覧
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {seminar.zoom_join_url && (
                          <button
                            onClick={() => window.open(seminar.zoom_join_url, '_blank')}
                            className="text-blue-600 hover:text-blue-700"
                            title="Zoomで参加"
                          >
                            <ExternalLink size={10} />
                          </button>
                        )}
                        <button
                          onClick={() => setEditingSeminar(seminar)}
                          className="text-gray-600 hover:text-gray-700"
                          title="編集"
                        >
                          <Edit size={10} />
                        </button>
                        <button
                          onClick={() => {
                            const newStatus = seminar.status === 'scheduled' ? 'cancelled' : 'scheduled'
                            handleSeminarStatusChange(seminar.id, newStatus)
                          }}
                          className="text-gray-600 hover:text-gray-700"
                          title={seminar.status === 'scheduled' ? 'キャンセル' : '再開'}
                        >
                          <Settings size={10} />
                        </button>
                        <button
                          onClick={() => handleSeminarDelete(seminar.id)}
                          className="text-red-600 hover:text-red-700"
                          title="削除"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registrations Panel */}
      {showRegistrations && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              参加者一覧 - {seminars.find(s => s.id === showRegistrations)?.title}
            </h3>
            <button
              onClick={() => setShowRegistrations(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            {getSeminarRegistrations(showRegistrations).map((registration) => (
              <div key={registration.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {registration.user_name.split(' ')[0].charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{registration.user_name}</div>
                    <div className="text-sm text-gray-500">{registration.user_email}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        registration.user_plan === 'premium' ? 'bg-purple-100 text-purple-800' :
                        registration.user_plan === 'basic' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {registration.user_plan === 'premium' ? 'プレミアム' :
                         registration.user_plan === 'basic' ? 'ベーシック' : '無料'}プラン
                      </span>
                      <span className="text-xs text-gray-600">
                        ¥{registration.payment_amount.toLocaleString('ja-JP')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    registration.attendance_status === 'attended' ? 'bg-green-100 text-green-800' :
                    registration.attendance_status === 'no_show' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {registration.attendance_status === 'attended' ? '参加済み' :
                     registration.attendance_status === 'no_show' ? '欠席' : '登録済み'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    registration.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                    registration.payment_status === 'free' ? 'bg-gray-100 text-gray-800' :
                    registration.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {registration.payment_status === 'paid' ? '支払い完了' :
                     registration.payment_status === 'free' ? '無料' :
                     registration.payment_status === 'pending' ? '支払い待ち' : '支払い失敗'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {registration.registration_date.toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </div>
            ))}
            
            {getSeminarRegistrations(showRegistrations).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                まだ参加者はいません
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredSeminars.length === 0 && (
        <div className="text-center py-12">
          <Calendar size={29} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">セミナーが見つかりませんでした</h3>
          <p className="text-gray-600 mb-6">
            検索条件を変更するか、新しいセミナーを作成してください
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            セミナーを作成
          </button>
        </div>
      )}
    </div>
  )
}