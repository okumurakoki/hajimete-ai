import { prisma } from './prisma'

export interface VideoMetadata {
  title: string
  description: string
  departmentId: string
  level: 'beginner' | 'intermediate' | 'advanced'
  isPremium: boolean
  instructorName: string
  tags: string[]
}

export interface VimeoUploadResponse {
  vimeoId: string
  uri: string
  thumbnailUrl?: string
  duration?: number
}

export class VimeoService {
  private apiBase = 'https://api.vimeo.com'
  private accessToken = process.env.VIMEO_ACCESS_TOKEN

  constructor() {
    if (!this.accessToken) {
      throw new Error('Vimeo access token is required')
    }
  }

  /**
   * Upload video to Vimeo Pro
   */
  async uploadVideo(filePath: string, metadata: VideoMetadata): Promise<VimeoUploadResponse> {
    try {
      // Step 1: Create video object
      const createResponse = await fetch(`${this.apiBase}/me/videos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: metadata.title,
          description: metadata.description,
          privacy: {
            view: 'password', // Secure by default
            embed: 'private',
            download: false
          },
          embed: {
            buttons: {
              like: false,
              watchlater: false,
              share: false,
              embed: true,
              hd: true,
              fullscreen: true
            },
            logos: {
              vimeo: false,
              custom: {
                active: true,
                link: process.env.NEXT_PUBLIC_APP_URL,
                sticky: true
              }
            },
            title: {
              name: 'show',
              owner: 'show',
              portrait: 'show'
            }
          }
        })
      })

      if (!createResponse.ok) {
        throw new Error(`Failed to create video: ${createResponse.statusText}`)
      }

      const videoData = await createResponse.json()
      const vimeoId = videoData.uri.split('/').pop()

      // Step 2: Upload file (simplified - in production use tus upload)
      // For demo purposes, we'll simulate this step
      const uploadUrl = videoData.upload.upload_link
      
      // In production, implement actual file upload here
      // using tus-js-client or direct upload to Vimeo
      console.log(`Upload URL: ${uploadUrl}`)

      // Step 3: Set video password
      const password = this.generateSecurePassword()
      await this.setVideoPassword(vimeoId, password)

      // Step 4: Get video details after upload
      const videoDetails = await this.getVideoDetails(vimeoId)

      return {
        vimeoId,
        uri: videoData.uri,
        thumbnailUrl: videoDetails.pictures?.base_link,
        duration: videoDetails.duration
      }
    } catch (error) {
      console.error('Error uploading to Vimeo:', error)
      throw new Error('Failed to upload video to Vimeo')
    }
  }

  /**
   * Get video details from Vimeo
   */
  async getVideoDetails(vimeoId: string) {
    try {
      const response = await fetch(`${this.apiBase}/videos/${vimeoId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get video details: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting video details:', error)
      throw error
    }
  }

  /**
   * Generate embed code with access control
   */
  async getEmbedCode(vimeoId: string, userPlan: string, hasAccess: boolean): Promise<string> {
    if (!hasAccess) {
      return `
        <div class="locked-video-container">
          <div class="locked-video-overlay">
            <div class="lock-icon">🔒</div>
            <h3>プレミアムコンテンツ</h3>
            <p>${userPlan === 'basic' ? 'このコンテンツを視聴するにはプレミアムプランが必要です' : 'アクセス権限がありません'}</p>
            <a href="/plan-selection" class="upgrade-button">プランをアップグレード</a>
          </div>
        </div>
      `
    }

    const video = await this.getVideoDetails(vimeoId)
    const embedUrl = `https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&quality_selector=1&pip=1`

    return `
      <div class="video-container" style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%;">
        <iframe 
          src="${embedUrl}"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          frameborder="0" 
          allow="autoplay; fullscreen; picture-in-picture" 
          allowfullscreen
          title="${video.name}"
          data-video-id="${vimeoId}">
        </iframe>
      </div>
    `
  }

  /**
   * Set video password for security
   */
  private async setVideoPassword(vimeoId: string, password: string) {
    try {
      const response = await fetch(`${this.apiBase}/videos/${vimeoId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          privacy: {
            view: 'password',
            password: password
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to set video password: ${response.statusText}`)
      }

      return password
    } catch (error) {
      console.error('Error setting video password:', error)
      throw error
    }
  }

  /**
   * Generate secure password for video protection
   */
  private generateSecurePassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  /**
   * Update video metadata
   */
  async updateVideoMetadata(vimeoId: string, metadata: Partial<VideoMetadata>) {
    try {
      const response = await fetch(`${this.apiBase}/videos/${vimeoId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: metadata.title,
          description: metadata.description
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to update video metadata: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating video metadata:', error)
      throw error
    }
  }

  /**
   * Delete video from Vimeo
   */
  async deleteVideo(vimeoId: string) {
    try {
      const response = await fetch(`${this.apiBase}/videos/${vimeoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to delete video: ${response.statusText}`)
      }

      return true
    } catch (error) {
      console.error('Error deleting video:', error)
      throw error
    }
  }

  /**
   * Get video analytics from Vimeo
   */
  async getVideoAnalytics(vimeoId: string, timeframe: '7days' | '30days' | '90days' = '30days') {
    try {
      const response = await fetch(`${this.apiBase}/videos/${vimeoId}/stats?timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get video analytics: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting video analytics:', error)
      throw error
    }
  }
}

/**
 * Helper function to check user video access
 */
export async function checkVideoAccess(userId: string, videoId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          where: { status: 'active' },
          include: { plan: true }
        }
      }
    })

    if (!user) return false

    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: { department: true }
    })

    if (!video) return false

    // Free access to non-premium content
    if (!video.isPremium) return true

    // Check subscription for premium content
    const activeSubscription = user.subscriptions.find(sub => sub.status === 'active')
    if (!activeSubscription) return false

    // Premium plan has access to all content
    if (activeSubscription.plan.slug === 'premium') return true

    // Basic plan has limited access
    if (activeSubscription.plan.slug === 'basic') {
      return video.department.accessLevel === 'basic'
    }

    return false
  } catch (error) {
    console.error('Error checking video access:', error)
    return false
  }
}