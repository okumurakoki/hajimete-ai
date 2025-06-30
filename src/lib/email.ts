import sgMail from '@sendgrid/mail'
import nodemailer from 'nodemailer'

// SendGridの設定
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

// Nodemailerの設定（開発環境用）
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface CourseInfo {
  id: string
  title: string
  instructor: string
  startDate: string
  endDate: string
  zoomUrl?: string
  zoomId?: string
  zoomPassword?: string
}

interface RegistrationEmailData {
  userEmail: string
  userName: string
  courses: CourseInfo[]
  paymentAmount: number
  receiptUrl?: string
}

interface ZoomInviteData {
  userEmail: string
  userName: string
  course: CourseInfo
}

export class EmailService {
  private static instance: EmailService
  private useProduction: boolean

  constructor() {
    this.useProduction = !!process.env.SENDGRID_API_KEY
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  /**
   * 決済完了・講座登録確認メールを送信
   */
  async sendRegistrationConfirmation(data: RegistrationEmailData): Promise<boolean> {
    try {
      const emailContent = this.generateRegistrationEmailContent(data)
      
      if (this.useProduction) {
        return await this.sendWithSendGrid(
          data.userEmail,
          'AI講座申し込み完了のお知らせ',
          emailContent.text,
          emailContent.html
        )
      } else {
        return await this.sendWithNodemailer(
          data.userEmail,
          'AI講座申し込み完了のお知らせ',
          emailContent.text,
          emailContent.html
        )
      }
    } catch (error) {
      console.error('Failed to send registration confirmation email:', error)
      return false
    }
  }

  /**
   * Zoom招待メールを送信
   */
  async sendZoomInvite(data: ZoomInviteData): Promise<boolean> {
    try {
      const emailContent = this.generateZoomInviteContent(data)
      
      if (this.useProduction) {
        return await this.sendWithSendGrid(
          data.userEmail,
          `【${data.course.title}】Zoom参加情報`,
          emailContent.text,
          emailContent.html
        )
      } else {
        return await this.sendWithNodemailer(
          data.userEmail,
          `【${data.course.title}】Zoom参加情報`,
          emailContent.text,
          emailContent.html
        )
      }
    } catch (error) {
      console.error('Failed to send zoom invite email:', error)
      return false
    }
  }

  /**
   * SendGridでメール送信
   */
  private async sendWithSendGrid(
    to: string,
    subject: string,
    text: string,
    html: string
  ): Promise<boolean> {
    try {
      const msg = {
        to,
        from: {
          email: process.env.FROM_EMAIL || 'noreply@oku-ai.co.jp',
          name: 'おく AI'
        },
        subject,
        text,
        html,
      }

      await sgMail.send(msg)
      console.log(`✅ SendGrid email sent to: ${to}`)
      return true
    } catch (error) {
      console.error('SendGrid error:', error)
      return false
    }
  }

  /**
   * Nodemailerでメール送信（開発環境用）
   */
  private async sendWithNodemailer(
    to: string,
    subject: string,
    text: string,
    html: string
  ): Promise<boolean> {
    try {
      const info = await transporter.sendMail({
        from: `"おく AI" <${process.env.FROM_EMAIL || 'noreply@oku-ai.co.jp'}>`,
        to,
        subject,
        text,
        html,
      })

      console.log(`✅ Nodemailer email sent: ${info.messageId}`)
      return true
    } catch (error) {
      console.error('Nodemailer error:', error)
      // 開発環境ではログ出力のみでエラーを返さない
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Email content (dev mode):')
        console.log('To:', to)
        console.log('Subject:', subject)
        console.log('Text:', text)
        return true
      }
      return false
    }
  }

  /**
   * 登録確認メールのコンテンツ生成
   */
  private generateRegistrationEmailContent(data: RegistrationEmailData) {
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

    const coursesText = data.courses.map(course => 
      `・${course.title}\n  講師: ${course.instructor}\n  日時: ${formatDate(course.startDate)}`
    ).join('\n\n')

    const coursesHtml = data.courses.map(course => `
      <div style="margin: 20px 0; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h3 style="color: #2563eb; margin: 0 0 10px 0;">${course.title}</h3>
        <p style="margin: 5px 0;"><strong>講師:</strong> ${course.instructor}</p>
        <p style="margin: 5px 0;"><strong>日時:</strong> ${formatDate(course.startDate)}</p>
        ${course.zoomUrl ? `
          <div style="margin-top: 15px; padding: 10px; background-color: #f0f9ff; border-radius: 6px;">
            <h4 style="color: #1e40af; margin: 0 0 10px 0;">参加情報</h4>
            <p style="margin: 5px 0;"><strong>Zoom URL:</strong> <a href="${course.zoomUrl}" style="color: #2563eb;">${course.zoomUrl}</a></p>
            ${course.zoomId ? `<p style="margin: 5px 0;"><strong>ミーティングID:</strong> ${course.zoomId}</p>` : ''}
            ${course.zoomPassword ? `<p style="margin: 5px 0;"><strong>パスワード:</strong> ${course.zoomPassword}</p>` : ''}
          </div>
        ` : ''}
      </div>
    `).join('')

    const text = `
${data.userName}様

この度は、AI講座にお申し込みいただき、誠にありがとうございます。
決済が完了し、以下の講座へのご登録が確定いたしました。

【お申し込み講座】
${coursesText}

【お支払い情報】
合計金額: ¥${data.paymentAmount.toLocaleString()}
${data.receiptUrl ? `領収書: ${data.receiptUrl}` : ''}

【重要なお知らせ】
・講座開始の15分前にはZoomにアクセスしてください
・カメラとマイクの設定を事前にご確認ください
・資料がある場合は講座開始前にメールでお送りします

ご不明な点がございましたら、お気軽にお問い合わせください。

――――――――――――――――――――
おく AI
Email: support@oku-ai.co.jp
Website: https://app.oku-ai.co.jp
――――――――――――――――――――
`

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>AI講座申し込み完了</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">おく AI</h1>
    <p style="color: #6b7280; margin: 5px 0 0 0;">AI講座申し込み完了のお知らせ</p>
  </div>

  <div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
    <p style="margin: 0 0 10px 0;"><strong>${data.userName}</strong>様</p>
    <p style="margin: 0;">この度は、AI講座にお申し込みいただき、誠にありがとうございます。<br>
    決済が完了し、以下の講座へのご登録が確定いたしました。</p>
  </div>

  <h2 style="color: #1f2937; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">お申し込み講座</h2>
  ${coursesHtml}

  <h2 style="color: #1f2937; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">お支払い情報</h2>
  <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <p style="margin: 5px 0;"><strong>合計金額:</strong> ¥${data.paymentAmount.toLocaleString()}</p>
    ${data.receiptUrl ? `<p style="margin: 5px 0;"><strong>領収書:</strong> <a href="${data.receiptUrl}" style="color: #2563eb;">ダウンロード</a></p>` : ''}
  </div>

  <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 20px;">
    <h3 style="color: #92400e; margin: 0 0 10px 0;">重要なお知らせ</h3>
    <ul style="margin: 0; padding-left: 20px; color: #92400e;">
      <li>講座開始の15分前にはZoomにアクセスしてください</li>
      <li>カメラとマイクの設定を事前にご確認ください</li>
      <li>資料がある場合は講座開始前にメールでお送りします</li>
    </ul>
  </div>

  <p style="margin-top: 30px;">ご不明な点がございましたら、お気軽にお問い合わせください。</p>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
  
  <div style="text-align: center; color: #6b7280; font-size: 14px;">
    <p style="margin: 5px 0;"><strong>おく AI</strong></p>
    <p style="margin: 5px 0;">Email: support@oku-ai.co.jp</p>
    <p style="margin: 5px 0;">Website: <a href="https://app.oku-ai.co.jp" style="color: #2563eb;">https://app.oku-ai.co.jp</a></p>
  </div>
</body>
</html>
`

    return { text, html }
  }

  /**
   * Zoom招待メールのコンテンツ生成
   */
  private generateZoomInviteContent(data: ZoomInviteData) {
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

【${data.course.title}】の開始が近づいてまいりました。
以下の情報でZoomミーティングにご参加ください。

【講座情報】
講座名: ${data.course.title}
講師: ${data.course.instructor}
日時: ${formatDate(data.course.startDate)}

【Zoom参加情報】
${data.course.zoomUrl ? `参加URL: ${data.course.zoomUrl}` : ''}
${data.course.zoomId ? `ミーティングID: ${data.course.zoomId}` : ''}
${data.course.zoomPassword ? `パスワード: ${data.course.zoomPassword}` : ''}

【参加時の注意事項】
・講座開始の10-15分前に接続することをお勧めします
・カメラとマイクの動作を事前にご確認ください
・安定したインターネット接続をご用意ください

皆様のご参加をお待ちしております。

――――――――――――――――――――
おく AI
Email: support@oku-ai.co.jp
――――――――――――――――――――
`

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Zoom参加情報</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">おく AI</h1>
    <p style="color: #6b7280; margin: 5px 0 0 0;">Zoom参加情報</p>
  </div>

  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #3b82f6;">
    <p style="margin: 0 0 10px 0;"><strong>${data.userName}</strong>様</p>
    <p style="margin: 0;"><strong>【${data.course.title}】</strong>の開始が近づいてまいりました。<br>
    以下の情報でZoomミーティングにご参加ください。</p>
  </div>

  <h2 style="color: #1f2937; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">講座情報</h2>
  <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <p style="margin: 5px 0;"><strong>講座名:</strong> ${data.course.title}</p>
    <p style="margin: 5px 0;"><strong>講師:</strong> ${data.course.instructor}</p>
    <p style="margin: 5px 0;"><strong>日時:</strong> ${formatDate(data.course.startDate)}</p>
  </div>

  <h2 style="color: #1f2937; border-bottom: 2px solid #10b981; padding-bottom: 10px;">Zoom参加情報</h2>
  <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #10b981;">
    ${data.course.zoomUrl ? `<p style="margin: 10px 0;"><strong>参加URL:</strong><br><a href="${data.course.zoomUrl}" style="color: #2563eb; word-break: break-all;">${data.course.zoomUrl}</a></p>` : ''}
    ${data.course.zoomId ? `<p style="margin: 10px 0;"><strong>ミーティングID:</strong> <code style="background-color: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${data.course.zoomId}</code></p>` : ''}
    ${data.course.zoomPassword ? `<p style="margin: 10px 0;"><strong>パスワード:</strong> <code style="background-color: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${data.course.zoomPassword}</code></p>` : ''}
  </div>

  <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 20px;">
    <h3 style="color: #92400e; margin: 0 0 10px 0;">参加時の注意事項</h3>
    <ul style="margin: 0; padding-left: 20px; color: #92400e;">
      <li>講座開始の10-15分前に接続することをお勧めします</li>
      <li>カメラとマイクの動作を事前にご確認ください</li>
      <li>安定したインターネット接続をご用意ください</li>
    </ul>
  </div>

  <p style="margin-top: 30px; text-align: center; font-size: 18px; color: #2563eb;">
    <strong>皆様のご参加をお待ちしております。</strong>
  </p>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
  
  <div style="text-align: center; color: #6b7280; font-size: 14px;">
    <p style="margin: 5px 0;"><strong>おく AI</strong></p>
    <p style="margin: 5px 0;">Email: support@oku-ai.co.jp</p>
  </div>
</body>
</html>
`

    return { text, html }
  }
}

export const emailService = EmailService.getInstance()