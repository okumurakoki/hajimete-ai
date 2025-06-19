interface ZoomMeeting {
  id: number
  uuid: string
  host_id: string
  topic: string
  type: number // 1=Instant, 2=Scheduled, 3=Recurring with no fixed time, 8=Recurring with fixed time
  status: string
  start_time: string
  duration: number
  timezone: string
  created_at: string
  start_url: string
  join_url: string
  password?: string
  agenda?: string
  settings: {
    host_video: boolean
    participant_video: boolean
    cn_meeting: boolean
    in_meeting: boolean
    join_before_host: boolean
    mute_upon_entry: boolean
    watermark: boolean
    use_pmi: boolean
    approval_type: number
    audio: string
    auto_recording: string
    waiting_room: boolean
  }
}

interface ZoomWebinar {
  id: number
  uuid: string
  host_id: string
  topic: string
  type: number
  status: string
  start_time: string
  duration: number
  timezone: string
  created_at: string
  start_url: string
  join_url: string
  password?: string
  agenda?: string
  settings: {
    host_video: boolean
    panelists_video: boolean
    practice_session: boolean
    hd_video: boolean
    approval_type: number
    audio: string
    auto_recording: string
    registrants_email_notification: boolean
  }
}

interface ZoomCreateMeetingRequest {
  topic: string
  type: number
  start_time?: string
  duration?: number
  timezone?: string
  password?: string
  agenda?: string
  settings?: {
    host_video?: boolean
    participant_video?: boolean
    join_before_host?: boolean
    mute_upon_entry?: boolean
    waiting_room?: boolean
    auto_recording?: 'none' | 'local' | 'cloud'
  }
}

interface ZoomCreateWebinarRequest {
  topic: string
  type: number
  start_time?: string
  duration?: number
  timezone?: string
  password?: string
  agenda?: string
  settings?: {
    host_video?: boolean
    panelists_video?: boolean
    practice_session?: boolean
    auto_recording?: 'none' | 'local' | 'cloud'
    approval_type?: number
  }
}

export class ZoomAPI {
  private accountId: string
  private clientId: string
  private clientSecret: string
  private accessToken: string | null = null
  private tokenExpiry: number = 0
  private baseURL = 'https://api.zoom.us/v2'

  constructor() {
    this.accountId = process.env.ZOOM_ACCOUNT_ID || ''
    this.clientId = process.env.ZOOM_CLIENT_ID || ''
    this.clientSecret = process.env.ZOOM_CLIENT_SECRET || ''
  }

  private async getAccessToken(): Promise<string> {
    // トークンが有効な場合はそのまま返す
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    try {
      const response = await fetch('https://zoom.us/oauth/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'account_credentials',
          account_id: this.accountId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status}`)
      }

      const data = await response.json()
      this.accessToken = data.access_token
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000 // 1分前に期限切れとする
      
      return this.accessToken!
    } catch (error) {
      console.error('Failed to get Zoom access token:', error)
      throw error
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    if (!this.accountId || !this.clientId || !this.clientSecret) {
      throw new Error('Zoom OAuth credentials not configured')
    }

    const token = await this.getAccessToken()

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Zoom API error: ${response.status} ${response.statusText} - ${errorData}`)
    }

    return response.json()
  }

  // ミーティング作成
  async createMeeting(userId: string, meetingData: ZoomCreateMeetingRequest): Promise<ZoomMeeting> {
    return this.makeRequest(`/users/${userId}/meetings`, {
      method: 'POST',
      body: JSON.stringify(meetingData)
    })
  }

  // ウェビナー作成
  async createWebinar(userId: string, webinarData: ZoomCreateWebinarRequest): Promise<ZoomWebinar> {
    return this.makeRequest(`/users/${userId}/webinars`, {
      method: 'POST',
      body: JSON.stringify(webinarData)
    })
  }

  // ミーティング一覧取得
  async getMeetings(userId: string, type: 'scheduled' | 'live' | 'upcoming' = 'scheduled'): Promise<{
    meetings: ZoomMeeting[]
    page_count: number
    page_number: number
    page_size: number
    total_records: number
  }> {
    return this.makeRequest(`/users/${userId}/meetings?type=${type}`)
  }

  // ウェビナー一覧取得
  async getWebinars(userId: string): Promise<{
    webinars: ZoomWebinar[]
    page_count: number
    page_number: number
    page_size: number
    total_records: number
  }> {
    return this.makeRequest(`/users/${userId}/webinars`)
  }

  // 特定のミーティング取得
  async getMeeting(meetingId: string): Promise<ZoomMeeting> {
    return this.makeRequest(`/meetings/${meetingId}`)
  }

  // 特定のウェビナー取得
  async getWebinar(webinarId: string): Promise<ZoomWebinar> {
    return this.makeRequest(`/webinars/${webinarId}`)
  }

  // ミーティング更新
  async updateMeeting(meetingId: string, updateData: Partial<ZoomCreateMeetingRequest>): Promise<void> {
    await this.makeRequest(`/meetings/${meetingId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    })
  }

  // ウェビナー更新
  async updateWebinar(webinarId: string, updateData: Partial<ZoomCreateWebinarRequest>): Promise<void> {
    await this.makeRequest(`/webinars/${webinarId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    })
  }

  // ミーティング削除
  async deleteMeeting(meetingId: string): Promise<void> {
    await this.makeRequest(`/meetings/${meetingId}`, {
      method: 'DELETE'
    })
  }

  // ウェビナー削除
  async deleteWebinar(webinarId: string): Promise<void> {
    await this.makeRequest(`/webinars/${webinarId}`, {
      method: 'DELETE'
    })
  }

  // ミーティング参加者リスト取得
  async getMeetingParticipants(meetingId: string): Promise<{
    participants: Array<{
      id: string
      name: string
      user_email: string
      join_time: string
      leave_time: string
      duration: number
    }>
    page_count: number
    page_size: number
    total_records: number
  }> {
    return this.makeRequest(`/meetings/${meetingId}/participants`)
  }

  // ウェビナー登録者リスト取得
  async getWebinarRegistrants(webinarId: string): Promise<{
    registrants: Array<{
      id: string
      email: string
      first_name: string
      last_name: string
      address: string
      city: string
      country: string
      zip: string
      state: string
      phone: string
      industry: string
      org: string
      job_title: string
      purchasing_time_frame: string
      role_in_purchase_process: string
      no_of_employees: string
      comments: string
      create_time: string
      join_url: string
    }>
    page_count: number
    page_size: number
    total_records: number
  }> {
    return this.makeRequest(`/webinars/${webinarId}/registrants`)
  }

  // ウェビナー登録
  async registerForWebinar(webinarId: string, registrantData: {
    email: string
    first_name: string
    last_name: string
    address?: string
    city?: string
    country?: string
    zip?: string
    state?: string
    phone?: string
    industry?: string
    org?: string
    job_title?: string
    comments?: string
  }): Promise<{
    id: string
    join_url: string
    registrant_id: string
    start_time: string
    topic: string
  }> {
    return this.makeRequest(`/webinars/${webinarId}/registrants`, {
      method: 'POST',
      body: JSON.stringify(registrantData)
    })
  }

  // ミーティング録画一覧取得
  async getMeetingRecordings(meetingId: string): Promise<{
    account_id: string
    duration: number
    host_id: string
    id: number
    recording_count: number
    start_time: string
    topic: string
    total_size: number
    type: string
    uuid: string
    recording_files: Array<{
      id: string
      meeting_id: string
      recording_start: string
      recording_end: string
      file_type: string
      file_size: number
      play_url: string
      download_url: string
      status: string
      recording_type: string
    }>
  }> {
    return this.makeRequest(`/meetings/${meetingId}/recordings`)
  }
}

// フォールバック実装（API キーがない場合）
export class ZoomAPIFallback {
  async createMeeting(userId: string, meetingData: ZoomCreateMeetingRequest): Promise<ZoomMeeting> {
    const mockMeeting: ZoomMeeting = {
      id: Math.floor(Math.random() * 1000000000),
      uuid: `mock-uuid-${Date.now()}`,
      host_id: userId,
      topic: meetingData.topic,
      type: meetingData.type,
      status: 'waiting',
      start_time: meetingData.start_time || new Date().toISOString(),
      duration: meetingData.duration || 60,
      timezone: meetingData.timezone || 'Asia/Tokyo',
      created_at: new Date().toISOString(),
      start_url: `https://zoom.us/s/mock-${Date.now()}?pwd=mock-pwd`,
      join_url: `https://zoom.us/j/mock-${Date.now()}?pwd=mock-pwd`,
      password: meetingData.password,
      agenda: meetingData.agenda,
      settings: {
        host_video: true,
        participant_video: true,
        cn_meeting: false,
        in_meeting: false,
        join_before_host: false,
        mute_upon_entry: true,
        watermark: false,
        use_pmi: false,
        approval_type: 0,
        audio: 'both',
        auto_recording: 'none',
        waiting_room: true
      }
    }
    
    return Promise.resolve(mockMeeting)
  }

  async createWebinar(userId: string, webinarData: ZoomCreateWebinarRequest): Promise<ZoomWebinar> {
    const mockWebinar: ZoomWebinar = {
      id: Math.floor(Math.random() * 1000000000),
      uuid: `mock-webinar-uuid-${Date.now()}`,
      host_id: userId,
      topic: webinarData.topic,
      type: webinarData.type,
      status: 'waiting',
      start_time: webinarData.start_time || new Date().toISOString(),
      duration: webinarData.duration || 60,
      timezone: webinarData.timezone || 'Asia/Tokyo',
      created_at: new Date().toISOString(),
      start_url: `https://zoom.us/w/mock-${Date.now()}?pwd=mock-pwd`,
      join_url: `https://zoom.us/j/mock-${Date.now()}?pwd=mock-pwd`,
      password: webinarData.password,
      agenda: webinarData.agenda,
      settings: {
        host_video: true,
        panelists_video: true,
        practice_session: true,
        hd_video: true,
        approval_type: 0,
        audio: 'both',
        auto_recording: 'none',
        registrants_email_notification: true
      }
    }
    
    return Promise.resolve(mockWebinar)
  }

  async getMeetings(): Promise<any> {
    return Promise.resolve({
      meetings: [],
      page_count: 0,
      page_number: 1,
      page_size: 30,
      total_records: 0
    })
  }

  async getWebinars(): Promise<any> {
    return Promise.resolve({
      webinars: [],
      page_count: 0,
      page_number: 1,
      page_size: 30,
      total_records: 0
    })
  }
}

// API インスタンスの作成
export const zoomAPI = (process.env.ZOOM_ACCOUNT_ID && process.env.ZOOM_CLIENT_ID && process.env.ZOOM_CLIENT_SECRET) 
  ? new ZoomAPI() 
  : new ZoomAPIFallback()

// 型定義をエクスポート
export type { 
  ZoomMeeting, 
  ZoomWebinar, 
  ZoomCreateMeetingRequest, 
  ZoomCreateWebinarRequest 
}