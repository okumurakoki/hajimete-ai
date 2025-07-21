// 自動メール送信スケジューラー
import { emailService } from './email'
import { errorLogger } from './error-logger'

interface ScheduledEmail {
  id: string
  type: 'reminder' | 'follow-up' | 'marketing' | 'feedback'
  recipientEmail: string
  recipientName: string
  scheduledAt: Date
  seminarId?: string
  courseId?: string
  status: 'pending' | 'sent' | 'failed' | 'cancelled'
  data?: Record<string, any>
  createdAt: Date
  sentAt?: Date
  errorMessage?: string
}

interface ReminderEmailData {
  userEmail: string
  userName: string
  seminar: {
    id: string
    title: string
    instructor: string
    startDate: string
    endDate: string
    zoomUrl?: string
    zoomId?: string
    zoomPassword?: string
  }
  timeUntilStart: string
}

class EmailScheduler {
  private static instance: EmailScheduler
  private scheduledEmails: ScheduledEmail[] = []
  private intervalId: NodeJS.Timeout | null = null
  private isRunning = false

  public static getInstance(): EmailScheduler {
    if (!EmailScheduler.instance) {
      EmailScheduler.instance = new EmailScheduler()
    }
    return EmailScheduler.instance
  }

  /**
   * スケジューラーを開始
   */
  start(): void {
    if (this.isRunning) return
    
    this.isRunning = true
    // 1分ごとにチェック
    this.intervalId = setInterval(() => {
      this.processScheduledEmails()
    }, 60 * 1000)
    
    console.log('📧 Email scheduler started')
    errorLogger.logInfo('Email scheduler started', { component: 'EmailScheduler' })
  }

  /**
   * スケジューラーを停止
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isRunning = false
    
    console.log('📧 Email scheduler stopped')
    errorLogger.logInfo('Email scheduler stopped', { component: 'EmailScheduler' })
  }

  /**
   * セミナーリマインダーメールをスケジュール
   */
  scheduleReminderEmail(
    userEmail: string,
    userName: string,
    seminar: {
      id: string
      title: string
      instructor: string
      startDate: string
      endDate: string
      zoomUrl?: string
      zoomId?: string
      zoomPassword?: string
    },
    reminderTime: number = 24 // hours before
  ): void {
    const seminarStart = new Date(seminar.startDate)
    const reminderAt = new Date(seminarStart.getTime() - reminderTime * 60 * 60 * 1000)
    
    // 既に過去の時間の場合はスケジュールしない
    if (reminderAt <= new Date()) {
      console.warn('Reminder time is in the past, skipping:', reminderAt)
      return
    }

    const emailId = this.generateId()
    const scheduledEmail: ScheduledEmail = {
      id: emailId,
      type: 'reminder',
      recipientEmail: userEmail,
      recipientName: userName,
      scheduledAt: reminderAt,
      seminarId: seminar.id,
      status: 'pending',
      data: { seminar, reminderTime },
      createdAt: new Date()
    }

    this.scheduledEmails.push(scheduledEmail)
    
    console.log(`📧 Reminder email scheduled for ${userName} at ${reminderAt.toISOString()}`)
    errorLogger.logInfo(
      `Reminder email scheduled for seminar: ${seminar.title}`,
      {
        component: 'EmailScheduler',
        seminarId: seminar.id,
        userEmail,
        scheduledAt: reminderAt.toISOString()
      }
    )
  }

  /**
   * フォローアップメールをスケジュール（セミナー終了後）
   */
  scheduleFollowUpEmail(
    userEmail: string,
    userName: string,
    seminar: {
      id: string
      title: string
      instructor: string
      endDate: string
    },
    delayHours: number = 2 // hours after seminar ends
  ): void {
    const seminarEnd = new Date(seminar.endDate)
    const followUpAt = new Date(seminarEnd.getTime() + delayHours * 60 * 60 * 1000)

    const emailId = this.generateId()
    const scheduledEmail: ScheduledEmail = {
      id: emailId,
      type: 'follow-up',
      recipientEmail: userEmail,
      recipientName: userName,
      scheduledAt: followUpAt,
      seminarId: seminar.id,
      status: 'pending',
      data: { seminar, delayHours },
      createdAt: new Date()
    }

    this.scheduledEmails.push(scheduledEmail)
    
    console.log(`📧 Follow-up email scheduled for ${userName} at ${followUpAt.toISOString()}`)
    errorLogger.logInfo(
      `Follow-up email scheduled for seminar: ${seminar.title}`,
      {
        component: 'EmailScheduler',
        seminarId: seminar.id,
        userEmail,
        scheduledAt: followUpAt.toISOString()
      }
    )
  }

  /**
   * マーケティングメールをスケジュール
   */
  scheduleMarketingEmail(
    userEmail: string,
    userName: string,
    templateType: 'new-seminar' | 'special-offer' | 'newsletter',
    scheduledAt: Date,
    data?: Record<string, any>
  ): void {
    const emailId = this.generateId()
    const scheduledEmail: ScheduledEmail = {
      id: emailId,
      type: 'marketing',
      recipientEmail: userEmail,
      recipientName: userName,
      scheduledAt,
      status: 'pending',
      data: { templateType, ...data },
      createdAt: new Date()
    }

    this.scheduledEmails.push(scheduledEmail)
    
    console.log(`📧 Marketing email (${templateType}) scheduled for ${userName} at ${scheduledAt.toISOString()}`)
    errorLogger.logInfo(
      `Marketing email scheduled: ${templateType}`,
      {
        component: 'EmailScheduler',
        userEmail,
        templateType,
        scheduledAt: scheduledAt.toISOString()
      }
    )
  }

  /**
   * スケジュールされたメールを処理
   */
  private async processScheduledEmails(): Promise<void> {
    const now = new Date()
    const pendingEmails = this.scheduledEmails.filter(
      email => email.status === 'pending' && email.scheduledAt <= now
    )

    if (pendingEmails.length === 0) return

    console.log(`📧 Processing ${pendingEmails.length} scheduled emails`)

    for (const email of pendingEmails) {
      try {
        await this.sendScheduledEmail(email)
        email.status = 'sent'
        email.sentAt = new Date()
        
        console.log(`✅ Email sent successfully: ${email.id}`)
      } catch (error) {
        email.status = 'failed'
        email.errorMessage = error instanceof Error ? error.message : 'Unknown error'
        
        console.error(`❌ Failed to send email: ${email.id}`, error)
        errorLogger.logError(
          `Failed to send scheduled email: ${email.type}`,
          error instanceof Error ? error : new Error(String(error)),
          {
            component: 'EmailScheduler',
            emailId: email.id,
            emailType: email.type,
            recipientEmail: email.recipientEmail
          }
        )
      }
    }
  }

  /**
   * 個別メール送信処理
   */
  private async sendScheduledEmail(email: ScheduledEmail): Promise<void> {
    switch (email.type) {
      case 'reminder':
        await this.sendReminderEmail(email)
        break
      case 'follow-up':
        await this.sendFollowUpEmail(email)
        break
      case 'marketing':
        await this.sendMarketingEmail(email)
        break
      case 'feedback':
        await this.sendFeedbackEmail(email)
        break
      default:
        throw new Error(`Unknown email type: ${email.type}`)
    }
  }

  /**
   * リマインダーメール送信
   */
  private async sendReminderEmail(email: ScheduledEmail): Promise<void> {
    const { seminar, reminderTime } = email.data!
    
    const timeUntilStart = this.calculateTimeUntilStart(seminar.startDate)
    
    const reminderData: ReminderEmailData = {
      userEmail: email.recipientEmail,
      userName: email.recipientName,
      seminar,
      timeUntilStart
    }

    const emailContent = this.generateReminderEmailContent(reminderData)
    
    const success = await emailService.sendWithNodemailer(
      email.recipientEmail,
      `【リマインダー】${seminar.title} 開始まで${reminderTime}時間`,
      emailContent.text,
      emailContent.html
    )

    if (!success) {
      throw new Error('Failed to send reminder email')
    }
  }

  /**
   * フォローアップメール送信
   */
  private async sendFollowUpEmail(email: ScheduledEmail): Promise<void> {
    const { seminar } = email.data!
    
    const emailContent = this.generateFollowUpEmailContent({
      userName: email.recipientName,
      seminar
    })
    
    const success = await emailService.sendWithNodemailer(
      email.recipientEmail,
      `【ありがとうございました】${seminar.title} フォローアップ`,
      emailContent.text,
      emailContent.html
    )

    if (!success) {
      throw new Error('Failed to send follow-up email')
    }
  }

  /**
   * マーケティングメール送信
   */
  private async sendMarketingEmail(email: ScheduledEmail): Promise<void> {
    const { templateType } = email.data!
    
    const subject = this.getMarketingEmailSubject(templateType)
    const emailContent = this.generateMarketingEmailContent(templateType, email.recipientName, email.data!)
    
    const success = await emailService.sendWithNodemailer(
      email.recipientEmail,
      subject,
      emailContent.text,
      emailContent.html
    )

    if (!success) {
      throw new Error('Failed to send marketing email')
    }
  }

  /**
   * フィードバックメール送信
   */
  private async sendFeedbackEmail(email: ScheduledEmail): Promise<void> {
    // フィードバック依頼メールの実装
    const emailContent = this.generateFeedbackEmailContent(email.recipientName, email.data!)
    
    const success = await emailService.sendWithNodemailer(
      email.recipientEmail,
      'ご感想をお聞かせください - はじめてAI',
      emailContent.text,
      emailContent.html
    )

    if (!success) {
      throw new Error('Failed to send feedback email')
    }
  }

  /**
   * スケジュールされたメール一覧を取得
   */
  getScheduledEmails(options?: {
    status?: ScheduledEmail['status']
    type?: ScheduledEmail['type']
    limit?: number
  }): ScheduledEmail[] {
    let filtered = [...this.scheduledEmails]

    if (options?.status) {
      filtered = filtered.filter(email => email.status === options.status)
    }

    if (options?.type) {
      filtered = filtered.filter(email => email.type === options.type)
    }

    // 新しい順にソート
    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    if (options?.limit) {
      filtered = filtered.slice(0, options.limit)
    }

    return filtered
  }

  /**
   * メール統計を取得
   */
  getEmailStats(): {
    total: number
    byStatus: Record<string, number>
    byType: Record<string, number>
    pending: number
    recentSent: number
  } {
    const byStatus = this.scheduledEmails.reduce((acc, email) => {
      acc[email.status] = (acc[email.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byType = this.scheduledEmails.reduce((acc, email) => {
      acc[email.type] = (acc[email.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const recentSent = this.scheduledEmails.filter(
      email => email.status === 'sent' && email.sentAt && email.sentAt > last24h
    ).length

    return {
      total: this.scheduledEmails.length,
      byStatus,
      byType,
      pending: byStatus.pending || 0,
      recentSent
    }
  }

  /**
   * 特定のメールをキャンセル
   */
  cancelEmail(emailId: string): boolean {
    const email = this.scheduledEmails.find(e => e.id === emailId)
    if (email && email.status === 'pending') {
      email.status = 'cancelled'
      return true
    }
    return false
  }

  // ヘルパーメソッド
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private calculateTimeUntilStart(startDate: string): string {
    const now = new Date()
    const start = new Date(startDate)
    const diff = start.getTime() - now.getTime()
    
    if (diff <= 0) return 'まもなく開始'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}時間${minutes}分後`
    } else {
      return `${minutes}分後`
    }
  }

  private generateReminderEmailContent(data: ReminderEmailData) {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const text = `
${data.userName}様

【${data.seminar.title}】の開始が近づいてまいりました。

開始予定時刻: ${formatDate(data.seminar.startDate)}
講師: ${data.seminar.instructor}
開始まで: ${data.timeUntilStart}

${data.seminar.zoomUrl ? `
【参加情報】
Zoom URL: ${data.seminar.zoomUrl}
${data.seminar.zoomId ? `ミーティングID: ${data.seminar.zoomId}` : ''}
${data.seminar.zoomPassword ? `パスワード: ${data.seminar.zoomPassword}` : ''}
` : ''}

【準備のお願い】
• 開始15分前にはZoomに接続してください
• カメラとマイクの動作確認をお願いします
• 筆記用具をご準備ください

皆様のご参加をお待ちしております！

――――――――――――――――――――
はじめてAI
――――――――――――――――――――
`

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>セミナー開始リマインダー</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">はじめてAI</h1>
    <p style="color: #6b7280; margin: 5px 0 0 0;">セミナー開始リマインダー</p>
  </div>

  <div style="background-color: #fef3c7; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
    <h2 style="color: #92400e; margin: 0 0 10px 0;">まもなく開始です！</h2>
    <p style="margin: 0; color: #92400e;"><strong>${data.userName}</strong>様、<strong>【${data.seminar.title}】</strong>の開始が近づいてまいりました。</p>
  </div>

  <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="color: #1f2937; margin: 0 0 10px 0;">セミナー情報</h3>
    <p style="margin: 5px 0;"><strong>開始予定:</strong> ${formatDate(data.seminar.startDate)}</p>
    <p style="margin: 5px 0;"><strong>講師:</strong> ${data.seminar.instructor}</p>
    <p style="margin: 5px 0;"><strong>開始まで:</strong> <span style="color: #f59e0b; font-weight: bold;">${data.timeUntilStart}</span></p>
  </div>

  ${data.seminar.zoomUrl ? `
  <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #10b981;">
    <h3 style="color: #1f2937; margin: 0 0 15px 0;">参加情報</h3>
    <p style="margin: 10px 0;"><strong>Zoom URL:</strong><br><a href="${data.seminar.zoomUrl}" style="color: #2563eb; word-break: break-all;">${data.seminar.zoomUrl}</a></p>
    ${data.seminar.zoomId ? `<p style="margin: 10px 0;"><strong>ミーティングID:</strong> <code style="background-color: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${data.seminar.zoomId}</code></p>` : ''}
    ${data.seminar.zoomPassword ? `<p style="margin: 10px 0;"><strong>パスワード:</strong> <code style="background-color: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${data.seminar.zoomPassword}</code></p>` : ''}
  </div>
  ` : ''}

  <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 20px;">
    <h3 style="color: #92400e; margin: 0 0 10px 0;">準備のお願い</h3>
    <ul style="margin: 0; padding-left: 20px; color: #92400e;">
      <li>開始15分前にはZoomに接続してください</li>
      <li>カメラとマイクの動作確認をお願いします</li>
      <li>筆記用具をご準備ください</li>
    </ul>
  </div>

  <p style="margin-top: 30px; text-align: center; font-size: 18px; color: #2563eb;">
    <strong>皆様のご参加をお待ちしております！</strong>
  </p>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
  
  <div style="text-align: center; color: #6b7280; font-size: 14px;">
    <p style="margin: 5px 0;"><strong>はじめてAI</strong></p>
  </div>
</body>
</html>
`

    return { text, html }
  }

  private generateFollowUpEmailContent(data: { userName: string; seminar: any }) {
    // フォローアップメールの内容生成
    const text = `
${data.userName}様

本日は「${data.seminar.title}」にご参加いただき、誠にありがとうございました。

セミナーはいかがでしたでしょうか？
ご不明な点やご質問がございましたら、お気軽にお問い合わせください。

また、今後のセミナー情報をお送りさせていただきます。
引き続き、はじめてAIをよろしくお願いいたします。
`

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>フォローアップ</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">はじめてAI</h1>
    <p style="color: #6b7280; margin: 5px 0 0 0;">ありがとうございました</p>
  </div>
  
  <p>${data.userName}様</p>
  <p>本日は「${data.seminar.title}」にご参加いただき、誠にありがとうございました。</p>
  <p>セミナーはいかがでしたでしょうか？<br>ご不明な点やご質問がございましたら、お気軽にお問い合わせください。</p>
  <p>また、今後のセミナー情報をお送りさせていただきます。<br>引き続き、はじめてAIをよろしくお願いいたします。</p>
</body>
</html>
`

    return { text, html }
  }

  private generateMarketingEmailContent(templateType: string, userName: string, data: any) {
    // マーケティングメールの内容生成（簡易版）
    const text = `${userName}様\n\n新しいセミナーのお知らせです。\n\nはじめてAI`
    const html = `<p>${userName}様</p><p>新しいセミナーのお知らせです。</p><p>はじめてAI</p>`
    return { text, html }
  }

  private generateFeedbackEmailContent(userName: string, data: any) {
    // フィードバック依頼メールの内容生成（簡易版）
    const text = `${userName}様\n\nご感想をお聞かせください。\n\nはじめてAI`
    const html = `<p>${userName}様</p><p>ご感想をお聞かせください。</p><p>はじめてAI</p>`
    return { text, html }
  }

  private getMarketingEmailSubject(templateType: string): string {
    switch (templateType) {
      case 'new-seminar': return '【新着】おすすめセミナーのご案内 - はじめてAI'
      case 'special-offer': return '【特別価格】限定セミナーのお知らせ - はじめてAI'
      case 'newsletter': return '【週刊】はじめてAI ニュースレター'
      default: return 'はじめてAI からのお知らせ'
    }
  }

  /**
   * バッチ処理：全ユーザーにマーケティングメールを送信
   */
  scheduleBulkMarketingEmail(
    users: Array<{ email: string; name: string }>,
    templateType: 'new-seminar' | 'special-offer' | 'newsletter',
    scheduledAt: Date,
    data?: Record<string, any>
  ): void {
    users.forEach(user => {
      this.scheduleMarketingEmail(user.email, user.name, templateType, scheduledAt, data)
    })
    
    console.log(`📧 Bulk marketing email scheduled for ${users.length} users`)
    errorLogger.logInfo(
      `Bulk marketing email scheduled: ${templateType} for ${users.length} users`,
      {
        component: 'EmailScheduler',
        templateType,
        userCount: users.length,
        scheduledAt: scheduledAt.toISOString()
      }
    )
  }
}

export const emailScheduler = EmailScheduler.getInstance()
export default emailScheduler