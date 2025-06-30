import { Vimeo } from '@vimeo/vimeo'
import { prisma } from '@/lib/prisma'
import { VideoPrivacy, VideoStatus, UploadStatus } from '@prisma/client'

interface VimeoConfig {
  clientId: string
  clientSecret: string
  accessToken: string
}

interface UploadResponse {
  uri: string
  upload: {
    upload_link: string
    form: string
    approach: string
    size: number
  }
}

export interface VideoDetails {
  uri: string
  name: string
  description: string | null
  duration: number
  width: number
  height: number
  status: string
  privacy: {
    view: string
    embed: string
  }
  pictures: {
    sizes: Array<{
      width: number
      height: number
      link: string
      link_with_play_button?: string
    }>
  }
  embed: {
    html: string
    badges: {
      hdr: boolean
      live: {
        streaming: boolean
        archived: boolean
      }
    }
  }
  stats: {
    plays: number
  }
}

export class VimeoService {
  private vimeo: Vimeo | null = null
  private static instance: VimeoService

  constructor(config?: VimeoConfig) {
    if (config) {
      this.vimeo = new Vimeo(config.clientId, config.clientSecret, config.accessToken)
    }
  }

  public static getInstance(): VimeoService {
    if (!VimeoService.instance) {
      try {
        const config = {
          clientId: process.env.VIMEO_CLIENT_ID!,
          clientSecret: process.env.VIMEO_CLIENT_SECRET!,
          accessToken: process.env.VIMEO_ACCESS_TOKEN!
        }
        
        if (config.clientId && config.clientSecret && config.accessToken) {
          VimeoService.instance = new VimeoService(config)
        } else {
          console.warn('Vimeo credentials not configured. Running in fallback mode.')
          VimeoService.instance = new VimeoService()
        }
      } catch (error) {
        console.warn('Error initializing Vimeo service:', error)
        VimeoService.instance = new VimeoService()
      }
    }
    return VimeoService.instance
  }

  /**
   * アップロードリンクを作成
   */
  async createUploadLink(fileSize: number, filename: string): Promise<{
    uploadUrl: string
    vimeoUri: string
    ticket: string
  }> {
    if (!this.vimeo) {
      // フォールバック実装（開発環境用）
      const mockId = Date.now().toString()
      return {
        uploadUrl: `https://1234567890.cloud.vimeo.com/upload?ticket=${mockId}`,
        vimeoUri: `/videos/${mockId}`,
        ticket: mockId
      }
    }

    return new Promise((resolve, reject) => {
      this.vimeo!.request({
        method: 'POST',
        path: '/me/videos',
        query: {
          type: 'upload',
          approach: 'tus',
          size: fileSize.toString(),
          name: filename
        }
      }, (error: any, body: any) => {
        if (error) {
          reject(new Error(`Failed to create upload link: ${error.message}`))
          return
        }

        const response = body as UploadResponse
        resolve({
          uploadUrl: response.upload.upload_link,
          vimeoUri: response.uri,
          ticket: response.upload.upload_link.split('/').pop() || ''
        })
      })
    })
  }

  /**
   * 動画メタデータを更新
   */
  async updateVideoMetadata(vimeoId: string, metadata: {
    name?: string
    description?: string
    privacy?: VideoPrivacy
    password?: string
  }): Promise<boolean> {
    if (!this.vimeo) {
      console.log('Vimeo service not available, skipping metadata update')
      return true
    }

    return new Promise((resolve, reject) => {
      const updateData: any = {}
      
      if (metadata.name) updateData.name = metadata.name
      if (metadata.description) updateData.description = metadata.description
      
      // プライバシー設定の変換
      if (metadata.privacy) {
        updateData.privacy = {
          view: this.convertPrivacyToVimeo(metadata.privacy),
          embed: 'public'
        }
        
        if (metadata.privacy === 'PASSWORD' && metadata.password) {
          updateData.password = metadata.password
        }
      }

      this.vimeo!.request({
        method: 'PATCH',
        path: `/videos/${vimeoId}`,
        query: updateData
      }, (error: any) => {
        if (error) {
          reject(new Error(`Failed to update video metadata: ${error.message}`))
          return
        }
        resolve(true)
      })
    })
  }

  /**
   * 動画詳細を取得
   */
  async getVideoDetails(vimeoId: string): Promise<VideoDetails> {
    if (!this.vimeo) {
      // フォールバック実装
      return {
        uri: `/videos/${vimeoId}`,
        name: 'Demo Video',
        description: 'This is a demo video',
        duration: 600,
        width: 1920,
        height: 1080,
        status: 'available',
        privacy: { view: 'unlisted', embed: 'public' },
        pictures: {
          sizes: [
            {
              width: 640,
              height: 360,
              link: `https://i.vimeocdn.com/video/${vimeoId}.jpg`
            }
          ]
        },
        embed: {
          html: `<iframe src="https://player.vimeo.com/video/${vimeoId}" width="640" height="360" frameborder="0"></iframe>`,
          badges: { hdr: false, live: { streaming: false, archived: false } }
        },
        stats: { plays: 0 }
      }
    }

    return new Promise((resolve, reject) => {
      this.vimeo!.request({
        method: 'GET',
        path: `/videos/${vimeoId}`,
        query: {
          fields: 'uri,name,description,duration,width,height,status,privacy,pictures,embed,stats'
        }
      }, (error: any, body: any) => {
        if (error) {
          reject(new Error(`Failed to get video details: ${error.message}`))
          return
        }
        resolve(body as VideoDetails)
      })
    })
  }

  /**
   * 動画を削除
   */
  async deleteVideo(vimeoId: string): Promise<boolean> {
    if (!this.vimeo) {
      console.log('Vimeo service not available, skipping video deletion')
      return true
    }

    return new Promise((resolve, reject) => {
      this.vimeo!.request({
        method: 'DELETE',
        path: `/videos/${vimeoId}`
      }, (error: any) => {
        if (error) {
          reject(new Error(`Failed to delete video: ${error.message}`))
          return
        }
        resolve(true)
      })
    })
  }

  /**
   * 埋め込みURLを生成
   */
  generateEmbedUrl(vimeoId: string, options?: {
    autoplay?: boolean
    loop?: boolean
    byline?: boolean
    portrait?: boolean
    title?: boolean
    color?: string
  }): string {
    const baseUrl = `https://player.vimeo.com/video/${vimeoId}`
    const params = new URLSearchParams()

    if (options?.autoplay) params.append('autoplay', '1')
    if (options?.loop) params.append('loop', '1')
    if (options?.byline === false) params.append('byline', '0')
    if (options?.portrait === false) params.append('portrait', '0')
    if (options?.title === false) params.append('title', '0')
    if (options?.color) params.append('color', options.color.replace('#', ''))

    const queryString = params.toString()
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  }

  /**
   * 最適なサムネイルURLを取得
   */
  getBestThumbnail(pictures: VideoDetails['pictures'], preferredWidth = 640): string | null {
    if (!pictures.sizes || pictures.sizes.length === 0) {
      return null
    }

    // 希望する幅に最も近いサイズを見つける
    const bestSize = pictures.sizes.reduce((best, current) => {
      const bestDiff = Math.abs(best.width - preferredWidth)
      const currentDiff = Math.abs(current.width - preferredWidth)
      return currentDiff < bestDiff ? current : best
    })

    return bestSize.link_with_play_button || bestSize.link
  }

  /**
   * Vimeo URI から動画IDを抽出
   */
  extractVideoId(vimeoUri: string): string {
    return vimeoUri.replace('/videos/', '')
  }

  /**
   * 動画の処理状況をチェック
   */
  async checkVideoStatus(vimeoId: string): Promise<{
    status: VideoStatus
    isReady: boolean
  }> {
    try {
      const details = await this.getVideoDetails(vimeoId)
      
      let status: VideoStatus = 'PROCESSING'
      let isReady = false
      
      switch (details.status) {
        case 'available':
          status = 'READY'
          isReady = true
          break
        case 'uploading':
        case 'transcode_starting':
        case 'transcoding':
          status = 'PROCESSING'
          break
        case 'upload_error':
        case 'transcode_error':
          status = 'ERROR'
          break
        default:
          status = 'PROCESSING'
      }

      return { status, isReady }
    } catch (error) {
      console.error(`Error checking video status for ${vimeoId}:`, error)
      return { status: 'ERROR', isReady: false }
    }
  }

  /**
   * 動画統計を取得
   */
  async getVideoStats(vimeoId: string): Promise<{
    plays: number
    uniqueViewers?: number
    avgPlayDuration?: number
  }> {
    try {
      const details = await this.getVideoDetails(vimeoId)
      return {
        plays: details.stats.plays || 0
      }
    } catch (error) {
      console.error(`Error getting video stats for ${vimeoId}:`, error)
      return { plays: 0 }
    }
  }

  /**
   * アップロードタスクを作成してデータベースに保存
   */
  async createUploadTask(userId: string, fileData: {
    filename: string
    fileSize: number
    mimeType: string
    title?: string
    description?: string
    lessonId?: string
  }): Promise<string> {
    try {
      // Vimeoアップロードリンクを作成
      const uploadLink = await this.createUploadLink(fileData.fileSize, fileData.filename)
      
      // データベースにアップロードタスクを作成
      const uploadTask = await prisma.uploadTask.create({
        data: {
          userId,
          filename: fileData.filename,
          fileSize: fileData.fileSize,
          mimeType: fileData.mimeType,
          title: fileData.title,
          description: fileData.description,
          lessonId: fileData.lessonId,
          vimeoUploadUrl: uploadLink.uploadUrl,
          vimeoTicket: uploadLink.ticket,
          status: 'PENDING'
        }
      })

      return uploadTask.id
    } catch (error) {
      console.error('Error creating upload task:', error)
      throw error
    }
  }

  /**
   * アップロード完了後の処理
   */
  async processUploadCompletion(uploadTaskId: string): Promise<void> {
    try {
      const uploadTask = await prisma.uploadTask.findUnique({
        where: { id: uploadTaskId }
      })

      if (!uploadTask || !uploadTask.vimeoTicket) {
        throw new Error('Upload task not found or missing Vimeo ticket')
      }

      // アップロードタスクのステータスを更新
      await prisma.uploadTask.update({
        where: { id: uploadTaskId },
        data: { 
          status: 'PROCESSING',
          progress: 100
        }
      })

      // Vimeo動画IDを取得（通常はアップロード完了通知で提供される）
      const vimeoVideoId = uploadTask.vimeoTicket
      
      if (vimeoVideoId) {
        // VideoContentレコードを作成
        const videoContent = await prisma.videoContent.create({
          data: {
            vimeoId: vimeoVideoId,
            vimeoUri: `/videos/${vimeoVideoId}`,
            embedUrl: this.generateEmbedUrl(vimeoVideoId),
            title: uploadTask.title || uploadTask.filename,
            description: uploadTask.description,
            duration: 0, // 後で更新
            uploadedBy: uploadTask.userId,
            originalFilename: uploadTask.filename,
            fileSize: uploadTask.fileSize,
            lessonId: uploadTask.lessonId,
            status: 'PROCESSING'
          }
        })

        // アップロードタスクを完了に更新
        await prisma.uploadTask.update({
          where: { id: uploadTaskId },
          data: { 
            status: 'COMPLETED',
            vimeoVideoId: vimeoVideoId
          }
        })

        console.log(`✅ Upload task ${uploadTaskId} completed. VideoContent created: ${videoContent.id}`)
      }
    } catch (error) {
      console.error(`Error processing upload completion for task ${uploadTaskId}:`, error)
      
      // エラー状態に更新
      await prisma.uploadTask.update({
        where: { id: uploadTaskId },
        data: { 
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }
      }).catch(console.error)
    }
  }

  /**
   * 動画メタデータを同期
   */
  async syncVideoMetadata(videoContentId: string): Promise<void> {
    try {
      const videoContent = await prisma.videoContent.findUnique({
        where: { id: videoContentId }
      })

      if (!videoContent) {
        throw new Error('VideoContent not found')
      }

      const details = await this.getVideoDetails(videoContent.vimeoId)
      const status = await this.checkVideoStatus(videoContent.vimeoId)
      const thumbnailUrl = this.getBestThumbnail(details.pictures)

      // データベースを更新
      await prisma.videoContent.update({
        where: { id: videoContentId },
        data: {
          duration: details.duration,
          thumbnailUrl,
          status: status.status,
          viewCount: details.stats.plays || 0
        }
      })

      console.log(`✅ Video metadata synced for VideoContent ${videoContentId}`)
    } catch (error) {
      console.error(`Error syncing video metadata for ${videoContentId}:`, error)
      throw error
    }
  }

  /**
   * プライバシー設定をVimeo形式に変換
   */
  private convertPrivacyToVimeo(privacy: VideoPrivacy): string {
    switch (privacy) {
      case 'PUBLIC':
        return 'anybody'
      case 'UNLISTED':
        return 'unlisted'
      case 'PRIVATE':
        return 'nobody'
      case 'PASSWORD':
        return 'password'
      default:
        return 'unlisted'
    }
  }

  /**
   * 進捗トラッキング用のビデオセッションを開始
   */
  async startWatchSession(userId: string, videoId: string, deviceType?: string, ipAddress?: string): Promise<string> {
    try {
      const existingSession = await prisma.watchSession.findUnique({
        where: {
          userId_videoId: {
            userId,
            videoId
          }
        }
      })

      if (existingSession) {
        // 既存セッションを更新
        await prisma.watchSession.update({
          where: { id: existingSession.id },
          data: {
            sessionStart: new Date(),
            sessionEnd: null,
            deviceType,
            ipAddress
          }
        })
        return existingSession.id
      } else {
        // 新しいセッションを作成
        const newSession = await prisma.watchSession.create({
          data: {
            userId,
            videoId,
            deviceType,
            ipAddress,
            sessionStart: new Date()
          }
        })
        return newSession.id
      }
    } catch (error) {
      console.error('Error starting watch session:', error)
      throw error
    }
  }

  /**
   * 視聴進捗を更新
   */
  async updateWatchProgress(sessionId: string, watchTime: number, currentPosition: number): Promise<void> {
    try {
      const session = await prisma.watchSession.findUnique({
        where: { id: sessionId },
        include: { video: true }
      })

      if (!session) {
        throw new Error('Watch session not found')
      }

      const progressPercent = session.video.duration > 0 
        ? Math.min((currentPosition / session.video.duration) * 100, 100) 
        : 0

      const isCompleted = progressPercent >= 90 // 90%以上で完了とみなす

      await prisma.watchSession.update({
        where: { id: sessionId },
        data: {
          watchTime: Math.max(session.watchTime, watchTime),
          lastPosition: currentPosition,
          progressPercent,
          completed: isCompleted,
          completedAt: isCompleted && !session.completed ? new Date() : session.completedAt
        }
      })
    } catch (error) {
      console.error('Error updating watch progress:', error)
      throw error
    }
  }

  /**
   * 視聴セッションを終了
   */
  async endWatchSession(sessionId: string): Promise<void> {
    try {
      await prisma.watchSession.update({
        where: { id: sessionId },
        data: {
          sessionEnd: new Date()
        }
      })
    } catch (error) {
      console.error('Error ending watch session:', error)
      throw error
    }
  }
}

// Type alias for backward compatibility
export type VimeoVideo = VideoDetails

// Legacy function exports for backward compatibility
export async function createVimeoUpload(size: number, name: string, description?: string) {
  const service = VimeoService.getInstance()
  const result = await service.createUploadLink(size, name)
  return {
    uri: result.vimeoUri,
    upload: {
      upload_link: result.uploadUrl,
      form: {}
    }
  }
}

export async function getVimeoVideo(videoId: string) {
  const service = VimeoService.getInstance()
  return await service.getVideoDetails(videoId)
}

export async function getVimeoVideos(page = 1, perPage = 25) {
  // This would need implementation for fetching from database
  return { data: [], total: 0 }
}

export async function updateVimeoVideo(videoId: string, data: any) {
  const service = VimeoService.getInstance()
  await service.updateVideoMetadata(videoId, data)
  // Return updated video details
  return await service.getVideoDetails(videoId)
}

export async function deleteVimeoVideo(videoId: string) {
  const service = VimeoService.getInstance()
  return await service.deleteVideo(videoId)
}

export function extractVimeoId(uri: string): string {
  return uri.split('/').pop() || ''
}

export function generateVimeoEmbed(videoId: string, width = 640, height = 360, autoplay = false): string {
  const service = VimeoService.getInstance()
  return `<iframe src="${service.generateEmbedUrl(videoId, { autoplay })}" width="${width}" height="${height}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`
}

export const vimeoService = VimeoService.getInstance()