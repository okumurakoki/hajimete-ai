// CloudFlare Stream API client
const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4'
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!

export interface CloudFlareStreamVideo {
  uid: string
  thumbnail: string
  thumbnailTimestampPct: number
  readyToStream: boolean
  status: {
    state: string
    pctComplete: string
  }
  meta: {
    name: string
    description?: string
  }
  created: string
  modified: string
  size: number
  preview: string
  allowed_origins: string[]
  requireSignedURLs: boolean
  uploaded: string
  uploadExpiry: string
  maxSizeBytes: number
  maxDurationSeconds: number
  duration: number
  input: {
    width: number
    height: number
  }
  playback: {
    hls: string
    dash: string
  }
  watermark?: {
    uid: string
  }
}

export interface CloudFlareLiveInput {
  uid: string
  rtmps: {
    url: string
    streamKey: string
  }
  rtmpsPlayback: {
    url: string
    streamKey: string
  }
  srt: {
    url: string
    streamId: string
  }
  webRTC: {
    url: string
  }
  status: string
  meta: {
    name: string
  }
  created: string
  modified: string
}

class CloudFlareStreamAPI {
  private async request(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
      body?: any
      params?: Record<string, string>
    } = {}
  ) {
    const { method = 'GET', body, params } = options
    
    let url = `${CLOUDFLARE_API_BASE}/accounts/${ACCOUNT_ID}/stream${endpoint}`
    
    if (params) {
      const searchParams = new URLSearchParams(params)
      url += `?${searchParams.toString()}`
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    })

    if (!response.ok) {
      throw new Error(`CloudFlare API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // 動画一覧取得
  async getVideos(page = 1, limit = 25): Promise<{ result: CloudFlareStreamVideo[], success: boolean }> {
    return this.request('/videos', {
      params: {
        page: page.toString(),
        per_page: limit.toString()
      }
    })
  }

  // 動画詳細取得
  async getVideo(videoId: string): Promise<{ result: CloudFlareStreamVideo, success: boolean }> {
    return this.request(`/videos/${videoId}`)
  }

  // 動画アップロードURL取得
  async createDirectUpload(
    maxDurationSeconds = 3600
  ): Promise<{ 
    result: { 
      uploadURL: string
      uid: string 
    }, 
    success: boolean 
  }> {
    return this.request('/direct_upload', {
      method: 'POST',
      body: {
        maxDurationSeconds,
        allowedOrigins: ['hajimete-ai.vercel.app', 'localhost:3000'],
        requireSignedURLs: false
      }
    })
  }

  // ライブ入力作成
  async createLiveInput(
    name: string,
    recording = true
  ): Promise<{ result: CloudFlareLiveInput, success: boolean }> {
    return this.request('/live_inputs', {
      method: 'POST',
      body: {
        meta: { name },
        recording: {
          mode: recording ? 'automatic' : 'off',
          timeoutSeconds: 10
        }
      }
    })
  }

  // ライブ入力一覧取得
  async getLiveInputs(): Promise<{ result: CloudFlareLiveInput[], success: boolean }> {
    return this.request('/live_inputs')
  }

  // ライブ入力詳細取得
  async getLiveInput(inputId: string): Promise<{ result: CloudFlareLiveInput, success: boolean }> {
    return this.request(`/live_inputs/${inputId}`)
  }

  // ライブ入力削除
  async deleteLiveInput(inputId: string): Promise<{ success: boolean }> {
    return this.request(`/live_inputs/${inputId}`, {
      method: 'DELETE'
    })
  }

  // 動画削除
  async deleteVideo(videoId: string): Promise<{ success: boolean }> {
    return this.request(`/videos/${videoId}`, {
      method: 'DELETE'
    })
  }
}

export const cloudflareStream = new CloudFlareStreamAPI()

// 埋め込み用iframe HTML生成
export function generateCloudFlareEmbed(
  videoId: string,
  autoplay = false,
  muted = false,
  controls = true
): string {
  const params = new URLSearchParams()
  if (autoplay) params.set('autoplay', 'true')
  if (muted) params.set('muted', 'true')
  if (!controls) params.set('controls', 'false')
  
  const queryString = params.toString()
  const src = `https://iframe.cloudflarestream.com/${videoId}${queryString ? '?' + queryString : ''}`
  
  return `<iframe
    src="${src}"
    style="border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"
    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
    allowfullscreen="true"
  ></iframe>`
}

// ライブ配信用プレイヤーHTML生成
export function generateLiveStreamEmbed(
  liveInputId: string,
  autoplay = false
): string {
  const autoplayParam = autoplay ? '?autoplay=true' : ''
  
  return `<iframe
    src="https://iframe.cloudflarestream.com/live/${liveInputId}${autoplayParam}"
    style="border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"
    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
    allowfullscreen="true"
  ></iframe>`
}

export default cloudflareStream