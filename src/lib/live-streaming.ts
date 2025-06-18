import { prisma } from './prisma'

export interface CreateStreamRequest {
  title: string
  description?: string
  instructorId: string
  scheduledAt: Date
  isPremium?: boolean
  maxViewers?: number
}

export interface StreamConfig {
  streamKey: string
  rtmpUrl: string
  playbackUrl: string
  embedCode: string
}

export class LiveStreamingService {
  private cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID
  private cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN
  private apiBase = 'https://api.cloudflare.com/client/v4'

  constructor() {
    if (!this.cloudflareAccountId || !this.cloudflareApiToken) {
      throw new Error('CloudFlare credentials are required for live streaming')
    }
  }

  /**
   * Create a new live stream
   */
  async createStream(streamData: CreateStreamRequest): Promise<StreamConfig> {
    try {
      // Create CloudFlare Stream Live Input
      const response = await fetch(
        `${this.apiBase}/accounts/${this.cloudflareAccountId}/stream/live_inputs`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.cloudflareApiToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            meta: {
              name: streamData.title
            },
            recording: {
              mode: 'automatic',
              timeoutSeconds: 10,
              requireSignedURLs: true
            },
            defaultCreator: process.env.CLOUDFLARE_DEFAULT_CREATOR || '',
            deleteRecordingAfterDays: 365
          })
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`CloudFlare API error: ${error.errors?.[0]?.message || response.statusText}`)
      }

      const streamInfo = await response.json()
      const result = streamInfo.result

      // Save to database
      const liveStream = await prisma.liveStream.create({
        data: {
          title: streamData.title,
          description: streamData.description,
          instructorId: streamData.instructorId,
          cloudflareStreamId: result.uid,
          streamKey: result.rtmps.streamKey,
          scheduledAt: streamData.scheduledAt,
          isPremium: streamData.isPremium || true,
          maxViewers: streamData.maxViewers || 1000,
          status: 'scheduled'
        }
      })

      return {
        streamKey: result.rtmps.streamKey,
        rtmpUrl: result.rtmps.url,
        playbackUrl: `https://customer-${this.cloudflareAccountId}.cloudflarestream.com/${result.uid}/manifest/video.m3u8`,
        embedCode: this.generateEmbedCode(result.uid, streamData.title)
      }
    } catch (error) {
      console.error('Error creating live stream:', error)
      throw new Error('Failed to create live stream')
    }
  }

  /**
   * Start a live stream
   */
  async startStream(streamId: string): Promise<void> {
    try {
      await prisma.liveStream.update({
        where: { id: streamId },
        data: {
          status: 'live',
          startedAt: new Date()
        }
      })

      // Notify subscribers
      await this.notifyStreamStart(streamId)
    } catch (error) {
      console.error('Error starting stream:', error)
      throw error
    }
  }

  /**
   * End a live stream
   */
  async endStream(streamId: string): Promise<void> {
    try {
      const stream = await prisma.liveStream.update({
        where: { id: streamId },
        data: {
          status: 'ended',
          endedAt: new Date()
        }
      })

      // Get recording URL from CloudFlare
      if (stream.cloudflareStreamId) {
        const recordingUrl = await this.getRecordingUrl(stream.cloudflareStreamId)
        if (recordingUrl) {
          await prisma.liveStream.update({
            where: { id: streamId },
            data: { recordingUrl }
          })
        }
      }

      // Notify end
      await this.notifyStreamEnd(streamId)
    } catch (error) {
      console.error('Error ending stream:', error)
      throw error
    }
  }

  /**
   * Get live stream status
   */
  async getStreamStatus(cloudflareStreamId: string) {
    try {
      const response = await fetch(
        `${this.apiBase}/accounts/${this.cloudflareAccountId}/stream/live_inputs/${cloudflareStreamId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.cloudflareApiToken}`
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to get stream status: ${response.statusText}`)
      }

      const data = await response.json()
      return data.result
    } catch (error) {
      console.error('Error getting stream status:', error)
      throw error
    }
  }

  /**
   * Get recording URL after stream ends
   */
  private async getRecordingUrl(cloudflareStreamId: string): Promise<string | null> {
    try {
      const response = await fetch(
        `${this.apiBase}/accounts/${this.cloudflareAccountId}/stream/${cloudflareStreamId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.cloudflareApiToken}`
          }
        }
      )

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return data.result?.playback?.hls || null
    } catch (error) {
      console.error('Error getting recording URL:', error)
      return null
    }
  }

  /**
   * Generate embed code for live stream
   */
  generateEmbedCode(cloudflareStreamId: string, title: string): string {
    return `
      <div class="live-stream-container" style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%;">
        <iframe
          src="https://iframe.cloudflarestream.com/${cloudflareStreamId}"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowfullscreen="true"
          title="${title}">
        </iframe>
      </div>
    `
  }

  /**
   * Update viewer count
   */
  async updateViewerCount(streamId: string, count: number): Promise<void> {
    try {
      await prisma.liveStream.update({
        where: { id: streamId },
        data: {
          currentViewers: count,
          peakViewers: {
            max: count
          }
        }
      })
    } catch (error) {
      console.error('Error updating viewer count:', error)
    }
  }

  /**
   * Track stream viewer
   */
  async trackViewer(streamId: string, userId?: string, userAgent?: string, ipAddress?: string): Promise<void> {
    try {
      await prisma.streamViewer.create({
        data: {
          streamId,
          userId,
          userAgent,
          ipAddress,
          joinedAt: new Date()
        }
      })
    } catch (error) {
      console.error('Error tracking viewer:', error)
    }
  }

  /**
   * Notify stream start to subscribers
   */
  private async notifyStreamStart(streamId: string): Promise<void> {
    try {
      const stream = await prisma.liveStream.findUnique({
        where: { id: streamId },
        include: {
          instructor: true
        }
      })

      if (!stream) return

      // Get users who should be notified (premium users for premium streams)
      const whereClause = stream.isPremium 
        ? { plan: 'premium', status: 'active' }
        : { status: 'active' }

      const users = await prisma.user.findMany({
        where: whereClause,
        select: { id: true }
      })

      // Create notifications
      const notifications = users.map(user => ({
        userId: user.id,
        title: '🔴 ライブ配信開始',
        message: `${stream.instructor.name}による「${stream.title}」が開始されました`,
        type: 'info' as const,
        actionUrl: `/live/${streamId}`
      }))

      await prisma.notification.createMany({
        data: notifications
      })
    } catch (error) {
      console.error('Error notifying stream start:', error)
    }
  }

  /**
   * Notify stream end
   */
  private async notifyStreamEnd(streamId: string): Promise<void> {
    try {
      // Update viewer end times
      await prisma.streamViewer.updateMany({
        where: {
          streamId,
          leftAt: null
        },
        data: {
          leftAt: new Date()
        }
      })
    } catch (error) {
      console.error('Error notifying stream end:', error)
    }
  }

  /**
   * Get live streams
   */
  async getLiveStreams(status: 'live' | 'scheduled' | 'ended' = 'live') {
    return await prisma.liveStream.findMany({
      where: { status },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            bio: true
          }
        },
        _count: {
          select: {
            viewers: true,
            chatMessages: true
          }
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    })
  }

  /**
   * Check if user can access live stream
   */
  async checkStreamAccess(userId: string, streamId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) return false

      const stream = await prisma.liveStream.findUnique({
        where: { id: streamId }
      })

      if (!stream) return false

      // Free access to non-premium streams
      if (!stream.isPremium) return true

      // Premium streams require premium plan
      return user.plan === 'premium'
    } catch (error) {
      console.error('Error checking stream access:', error)
      return false
    }
  }
}

/**
 * Real-time chat system for live streams
 */
export class StreamChatService {
  /**
   * Send chat message
   */
  async sendMessage(streamId: string, userId: string, message: string): Promise<any> {
    try {
      // Get user info
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: {
            select: {
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          }
        }
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Create message
      const chatMessage = await prisma.chatMessage.create({
        data: {
          streamId,
          userId,
          username: `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || 'Anonymous',
          message,
          messageType: 'text'
        }
      })

      return {
        id: chatMessage.id,
        message: chatMessage.message,
        username: chatMessage.username,
        timestamp: chatMessage.createdAt,
        user: {
          id: user.id,
          avatarUrl: user.profile?.avatarUrl
        }
      }
    } catch (error) {
      console.error('Error sending chat message:', error)
      throw error
    }
  }

  /**
   * Get chat messages
   */
  async getMessages(streamId: string, limit: number = 50) {
    return await prisma.chatMessage.findMany({
      where: {
        streamId,
        isDeleted: false
      },
      include: {
        user: {
          include: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })
  }

  /**
   * Moderate chat message
   */
  async moderateMessage(messageId: string, action: 'delete' | 'highlight', moderatorId: string) {
    try {
      if (action === 'delete') {
        await prisma.chatMessage.update({
          where: { id: messageId },
          data: {
            isDeleted: true,
            deletedBy: moderatorId,
            deletedReason: 'Moderated content'
          }
        })
      } else if (action === 'highlight') {
        await prisma.chatMessage.update({
          where: { id: messageId },
          data: {
            isHighlighted: true
          }
        })
      }

      return true
    } catch (error) {
      console.error('Error moderating message:', error)
      throw error
    }
  }
}