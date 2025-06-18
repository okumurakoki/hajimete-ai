# 🏗️ はじめて.AI 本格サービス アーキテクチャ設計

## 📋 システム全体図

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js App] --> B[Clerk Auth]
        A --> C[Stripe Payment]
        A --> D[CDN Assets]
    end
    
    subgraph "API Layer"
        E[Next.js API Routes] --> F[tRPC/GraphQL]
        E --> G[WebSocket Server]
    end
    
    subgraph "Database Layer"
        H[Supabase PostgreSQL] --> I[Prisma ORM]
        J[Redis Cache] --> K[Session Store]
    end
    
    subgraph "Media Services"
        L[Vimeo Pro] --> M[Video Streaming]
        N[AWS S3] --> O[File Storage]
        P[CloudFlare Stream] --> Q[Live Streaming]
    end
    
    subgraph "External Services"
        R[Zoom SDK] --> S[Webinar Integration]
        T[SendGrid] --> U[Email Service]
        V[Discord Bot] --> W[Community]
    end
    
    subgraph "Infrastructure"
        X[Vercel Hosting] --> Y[Edge Functions]
        Z[AWS Lambda] --> AA[Background Jobs]
        BB[Monitoring] --> CC[Analytics]
    end
```

## 🛠 必要なサービス・技術スタック

### 1. **フロントエンド（既存）**
- ✅ Next.js 15 + TypeScript
- ✅ Tailwind CSS + Schoo Design System
- ✅ Clerk Authentication
- 🔄 Stripe Payment Integration
- 🔄 Real-time WebSocket Connection

### 2. **バックエンド・データベース**
```typescript
// Database Schema
interface User {
  id: string
  email: string
  plan: 'basic' | 'premium'
  subscription: Subscription
  profile: UserProfile
  progress: LearningProgress[]
}

interface Video {
  id: string
  title: string
  vimeoId: string
  department: Department
  access: AccessLevel
  analytics: VideoAnalytics
}

interface LiveStream {
  id: string
  title: string
  streamKey: string
  chatChannel: string
  participants: User[]
  recording: boolean
}
```

### 3. **動画配信システム**
- **Vimeo Pro**: メイン動画ホスティング
- **CloudFlare Stream**: ライブ配信
- **AWS S3**: ファイルストレージ
- **CDN**: 高速配信

### 4. **決済・サブスクリプション**
- **Stripe**: 決済処理
- **Webhook**: サブスク状態同期
- **Invoice**: 請求書管理

### 5. **リアルタイム機能**
- **WebSocket**: ライブチャット
- **Pusher/Ably**: リアルタイム通知
- **Redis**: セッション・キャッシュ

## 📊 データベース設計

### Supabase PostgreSQL Schema

```sql
-- Users table (Clerk integration)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id VARCHAR UNIQUE NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    plan VARCHAR DEFAULT 'basic',
    subscription_id VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User profiles
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    first_name VARCHAR,
    last_name VARCHAR,
    avatar_url VARCHAR,
    department_preferences TEXT[],
    learning_goals JSONB
);

-- Videos
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    description TEXT,
    vimeo_id VARCHAR UNIQUE,
    thumbnail_url VARCHAR,
    duration INTEGER, -- seconds
    department VARCHAR NOT NULL,
    level VARCHAR DEFAULT 'beginner',
    is_premium BOOLEAN DEFAULT false,
    instructor_id UUID REFERENCES users(id),
    status VARCHAR DEFAULT 'draft',
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Learning progress
CREATE TABLE learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    video_id UUID REFERENCES videos(id),
    progress_percentage INTEGER DEFAULT 0,
    completed_at TIMESTAMP,
    watch_time INTEGER DEFAULT 0,
    last_position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seminars
CREATE TABLE seminars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    description TEXT,
    instructor_id UUID REFERENCES users(id),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    capacity INTEGER DEFAULT 100,
    zoom_meeting_id VARCHAR,
    zoom_passcode VARCHAR,
    is_premium BOOLEAN DEFAULT false,
    status VARCHAR DEFAULT 'upcoming'
);

-- Seminar registrations
CREATE TABLE seminar_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    seminar_id UUID REFERENCES seminars(id),
    registered_at TIMESTAMP DEFAULT NOW(),
    attended BOOLEAN DEFAULT false,
    UNIQUE(user_id, seminar_id)
);

-- Live streams
CREATE TABLE live_streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    description TEXT,
    instructor_id UUID REFERENCES users(id),
    stream_key VARCHAR UNIQUE,
    cloudflare_stream_id VARCHAR,
    scheduled_at TIMESTAMP,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    status VARCHAR DEFAULT 'scheduled',
    is_premium BOOLEAN DEFAULT true,
    max_viewers INTEGER DEFAULT 1000
);

-- Chat messages
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stream_id UUID REFERENCES live_streams(id),
    user_id UUID REFERENCES users(id),
    message TEXT NOT NULL,
    message_type VARCHAR DEFAULT 'text',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions (Stripe integration)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    stripe_subscription_id VARCHAR UNIQUE,
    stripe_customer_id VARCHAR,
    plan_id VARCHAR NOT NULL,
    status VARCHAR NOT NULL,
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎬 動画配信システム詳細設計

### 1. **Vimeo Pro Integration**
```typescript
// lib/vimeo.ts
import { Vimeo } from 'vimeo'

export class VimeoService {
  private client: Vimeo
  
  constructor() {
    this.client = new Vimeo(
      process.env.VIMEO_CLIENT_ID!,
      process.env.VIMEO_CLIENT_SECRET!,
      process.env.VIMEO_ACCESS_TOKEN!
    )
  }

  async uploadVideo(filePath: string, metadata: VideoMetadata) {
    return new Promise((resolve, reject) => {
      this.client.upload(
        filePath,
        {
          name: metadata.title,
          description: metadata.description,
          privacy: {
            view: 'password',
            password: generateSecurePassword()
          },
          embed: {
            buttons: {
              like: false,
              watchlater: false,
              share: false
            },
            logos: {
              vimeo: false
            }
          }
        },
        (uri) => {
          const videoId = uri.split('/').pop()
          resolve({ vimeoId: videoId, uri })
        },
        (bytesUploaded, bytesTotal) => {
          const percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
          console.log(`Upload progress: ${percentage}%`)
        },
        (error) => reject(error)
      )
    })
  }

  async getVideoEmbedCode(vimeoId: string, userAccess: boolean) {
    if (!userAccess) {
      return `<div class="locked-video">プレミアムプランが必要です</div>`
    }
    
    return `
      <iframe 
        src="https://player.vimeo.com/video/${vimeoId}?h=0&badge=0&autopause=0&player_id=0&app_id=58479"
        width="100%" 
        height="100%" 
        frameborder="0" 
        allow="autoplay; fullscreen; picture-in-picture" 
        allowfullscreen>
      </iframe>
    `
  }
}
```

### 2. **進捗追跡システム**
```typescript
// lib/progress-tracker.ts
export class ProgressTracker {
  async updateProgress(userId: string, videoId: string, progress: ProgressData) {
    const { data, error } = await supabase
      .from('learning_progress')
      .upsert({
        user_id: userId,
        video_id: videoId,
        progress_percentage: progress.percentage,
        last_position: progress.currentTime,
        watch_time: progress.watchTime,
        completed_at: progress.percentage >= 90 ? new Date() : null
      })
    
    // リアルタイム進捗更新
    await this.broadcastProgress(userId, progress)
    
    // 達成バッジチェック
    await this.checkAchievements(userId)
  }

  async getProgressStats(userId: string) {
    const { data } = await supabase
      .from('learning_progress')
      .select(`
        *,
        videos:video_id (
          title,
          department,
          duration
        )
      `)
      .eq('user_id', userId)
    
    return {
      totalWatchTime: data?.reduce((sum, p) => sum + p.watch_time, 0) || 0,
      completedVideos: data?.filter(p => p.completed_at).length || 0,
      totalVideos: data?.length || 0,
      departmentProgress: this.calculateDepartmentProgress(data)
    }
  }
}
```

## 📺 ライブ配信システム

### 1. **CloudFlare Stream Integration**
```typescript
// lib/live-streaming.ts
export class LiveStreamingService {
  async createStream(streamData: CreateStreamRequest) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          meta: {
            name: streamData.title
          },
          recording: {
            mode: 'automatic',
            timeoutSeconds: 10
          }
        })
      }
    )
    
    const streamInfo = await response.json()
    
    // データベースに保存
    const { data } = await supabase
      .from('live_streams')
      .insert({
        title: streamData.title,
        description: streamData.description,
        instructor_id: streamData.instructorId,
        cloudflare_stream_id: streamInfo.result.uid,
        stream_key: streamInfo.result.rtmps.streamKey,
        scheduled_at: streamData.scheduledAt,
        status: 'scheduled'
      })
      .select()
      .single()
    
    return data
  }

  async getStreamEmbedCode(streamId: string) {
    return `
      <iframe
        src="https://iframe.cloudflarestream.com/${streamId}"
        style="border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowfullscreen="true">
      </iframe>
    `
  }
}
```

### 2. **リアルタイムチャット**
```typescript
// lib/chat-system.ts
export class ChatSystem {
  private pusher: Pusher

  constructor() {
    this.pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true
    })
  }

  async sendMessage(streamId: string, userId: string, message: string) {
    // データベースに保存
    const { data } = await supabase
      .from('chat_messages')
      .insert({
        stream_id: streamId,
        user_id: userId,
        message: message,
        message_type: 'text'
      })
      .select(`
        *,
        users:user_id (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .single()

    // リアルタイム配信
    await this.pusher.trigger(`stream-${streamId}`, 'new-message', {
      id: data.id,
      message: data.message,
      user: data.users,
      timestamp: data.created_at
    })

    return data
  }

  async moderateMessage(messageId: string, action: 'approve' | 'delete') {
    // メッセージの削除・承認処理
    if (action === 'delete') {
      await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId)
    }
  }
}
```

## 💳 決済・サブスクリプション

### 1. **Stripe Integration**
```typescript
// lib/stripe-service.ts
import Stripe from 'stripe'

export class StripeService {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16'
    })
  }

  async createCustomer(userEmail: string, userName: string) {
    const customer = await this.stripe.customers.create({
      email: userEmail,
      name: userName,
      metadata: {
        app: 'hajimete-ai'
      }
    })
    return customer
  }

  async createSubscription(customerId: string, planId: string) {
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: planId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent']
    })

    return subscription
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break
      
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
        
      case 'customer.subscription.deleted':
        await this.handleSubscriptionCanceled(event.data.object as Stripe.Subscription)
        break
        
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
    }
  }

  private async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    // ユーザーのプラン情報を更新
    const customerId = subscription.customer as string
    const { data: customer } = await this.stripe.customers.retrieve(customerId)
    
    await supabase
      .from('subscriptions')
      .insert({
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        plan_id: subscription.items.data[0].price.id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000)
      })
  }
}
```

### 2. **プラン管理**
```typescript
// lib/subscription-manager.ts
export class SubscriptionManager {
  async upgradePlan(userId: string, newPlanId: string) {
    const { data: user } = await supabase
      .from('users')
      .select('subscription_id')
      .eq('id', userId)
      .single()

    const stripeService = new StripeService()
    
    // Stripeでプラン変更
    await stripeService.updateSubscription(user.subscription_id, newPlanId)
    
    // データベース更新
    await supabase
      .from('users')
      .update({ plan: this.getPlanNameFromId(newPlanId) })
      .eq('id', userId)

    // Clerkメタデータ更新
    await clerkClient.users.updateUserMetadata(userId, {
      unsafeMetadata: {
        plan: this.getPlanNameFromId(newPlanId)
      }
    })
  }

  async cancelSubscription(userId: string) {
    // Stripe側でキャンセル
    // データベース更新
    // 猶予期間の設定
  }
}
```

## 🔗 API設計

### 1. **Next.js API Routes Structure**
```
/api
├── auth/
│   ├── webhook.ts          # Clerk webhook
│   └── session.ts          # Session management
├── videos/
│   ├── [id]/
│   │   ├── progress.ts     # 進捗更新
│   │   └── analytics.ts    # 視聴分析
│   ├── upload.ts           # 動画アップロード
│   └── search.ts           # 動画検索
├── live/
│   ├── streams/
│   │   ├── create.ts       # ライブ配信作成
│   │   ├── [id]/start.ts   # 配信開始
│   │   └── [id]/end.ts     # 配信終了
│   └── chat/
│       ├── send.ts         # チャット送信
│       └── moderate.ts     # チャット管理
├── seminars/
│   ├── register.ts         # セミナー登録
│   ├── cancel.ts           # キャンセル
│   └── zoom-webhook.ts     # Zoom連携
├── payments/
│   ├── create-intent.ts    # 決済開始
│   ├── webhook.ts          # Stripe webhook
│   └── subscription/
│       ├── create.ts       # サブスク作成
│       ├── update.ts       # プラン変更
│       └── cancel.ts       # キャンセル
└── admin/
    ├── users/              # ユーザー管理
    ├── content/            # コンテンツ管理
    ├── analytics/          # 分析データ
    └── system/             # システム管理
```

### 2. **WebSocket Events**
```typescript
// lib/websocket-events.ts
export const WS_EVENTS = {
  // ライブ配信
  STREAM_START: 'stream:start',
  STREAM_END: 'stream:end',
  VIEWER_COUNT: 'stream:viewer_count',
  
  // チャット
  CHAT_MESSAGE: 'chat:message',
  CHAT_DELETE: 'chat:delete',
  CHAT_MODERATE: 'chat:moderate',
  
  // 学習進捗
  PROGRESS_UPDATE: 'progress:update',
  ACHIEVEMENT_UNLOCK: 'achievement:unlock',
  
  // 通知
  NOTIFICATION: 'notification',
  SEMINAR_REMINDER: 'seminar:reminder'
} as const
```

## 🚀 デプロイ・インフラ

### 1. **本番環境構成**
```yaml
# docker-compose.production.yml
version: '3.8'
services:
  app:
    build: .
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    ports:
      - "3000:3000"
  
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

### 2. **環境変数設定**
```env
# Production Environment Variables

# Database
DATABASE_URL=postgresql://user:pass@host:5432/hajimete_ai
REDIS_URL=redis://localhost:6379

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Payments
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Media Services
VIMEO_CLIENT_ID=...
VIMEO_CLIENT_SECRET=...
VIMEO_ACCESS_TOKEN=...

CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_API_TOKEN=...

# Real-time
PUSHER_APP_ID=...
PUSHER_KEY=...
PUSHER_SECRET=...
PUSHER_CLUSTER=...

# External Services
ZOOM_API_KEY=...
ZOOM_API_SECRET=...
SENDGRID_API_KEY=...

# AWS
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...

# Monitoring
SENTRY_DSN=...
DATADOG_API_KEY=...
```

## 📊 監視・分析

### 1. **Analytics Implementation**
```typescript
// lib/analytics.ts
export class AnalyticsService {
  async trackVideoView(userId: string, videoId: string, duration: number) {
    // 内部分析
    await supabase.from('video_analytics').insert({
      user_id: userId,
      video_id: videoId,
      watched_duration: duration,
      timestamp: new Date()
    })

    // Google Analytics
    gtag('event', 'video_view', {
      video_id: videoId,
      duration: duration,
      user_id: userId
    })
  }

  async trackLearningProgress(userId: string, completedVideo: string) {
    // 学習分析
    const progress = await this.calculateUserProgress(userId)
    
    // 推奨システム更新
    await this.updateRecommendations(userId, progress)
  }

  async generateBusinessReport() {
    // 売上分析
    // ユーザー行動分析
    // コンテンツ人気度
    // 解約率分析
  }
}
```

### 2. **Monitoring Setup**
```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs'

export function setupMonitoring() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    
    beforeSend(event) {
      // PII情報の除去
      if (event.user) {
        delete event.user.email
      }
      return event
    }
  })
}

export class HealthCheck {
  async checkServices() {
    const services = [
      { name: 'Database', check: this.checkDatabase },
      { name: 'Redis', check: this.checkRedis },
      { name: 'Vimeo', check: this.checkVimeo },
      { name: 'Stripe', check: this.checkStripe }
    ]

    const results = await Promise.all(
      services.map(async service => ({
        name: service.name,
        status: await service.check(),
        timestamp: new Date()
      }))
    )

    return results
  }
}
```

## 🔐 セキュリティ強化

### 1. **API Security**
```typescript
// middleware/security.ts
export function securityMiddleware() {
  return async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    // Rate limiting
    const rateLimitResult = await rateLimiter.check(req)
    if (!rateLimitResult.allowed) {
      return res.status(429).json({ error: 'Rate limit exceeded' })
    }

    // Input validation
    const validationResult = validateInput(req.body, req.route)
    if (!validationResult.valid) {
      return res.status(400).json({ errors: validationResult.errors })
    }

    // Authentication check
    const user = await authenticateRequest(req)
    if (!user && isProtectedRoute(req.route)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    req.user = user
    next()
  }
}
```

### 2. **Data Protection**
```typescript
// lib/data-protection.ts
export class DataProtection {
  static encryptSensitiveData(data: string): string {
    // 個人情報の暗号化
    return encrypt(data, process.env.ENCRYPTION_KEY!)
  }

  static async auditLog(action: string, userId: string, details: any) {
    // 操作ログの記録
    await supabase.from('audit_logs').insert({
      action,
      user_id: userId,
      details,
      ip_address: getClientIP(),
      timestamp: new Date()
    })
  }

  static async gdprDataExport(userId: string) {
    // GDPR対応データエクスポート
    const userData = await this.collectAllUserData(userId)
    return {
      personal_data: userData.profile,
      learning_data: userData.progress,
      subscription_data: userData.subscription
    }
  }
}
```

## 🎯 サービス開始チェックリスト

### Phase 1: 基盤構築 (1-2週間)
- [ ] Supabaseプロジェクト作成・設定
- [ ] データベーススキーマ実装
- [ ] Stripe設定・プラン作成
- [ ] Vimeo Pro契約・設定
- [ ] CloudFlare Stream設定

### Phase 2: コア機能実装 (2-3週間)
- [ ] 動画アップロード・管理システム
- [ ] サブスクリプション決済フロー
- [ ] ライブ配信システム
- [ ] リアルタイムチャット
- [ ] 進捗追跡システム

### Phase 3: 管理・運用システム (1-2週間)
- [ ] 管理者ダッシュボード完全実装
- [ ] 分析・レポートシステム
- [ ] ユーザーサポートツール
- [ ] 監視・アラートシステム

### Phase 4: セキュリティ・最適化 (1週間)
- [ ] セキュリティ監査
- [ ] パフォーマンス最適化
- [ ]負荷テスト
- [ ] バックアップシステム

### Phase 5: サービス開始準備 (1週間)
- [ ] 利用規約・プライバシーポリシー
- [ ] サポートドキュメント
- [ ] マーケティングサイト
- [ ] 公開前テスト

## 💰 想定運用コスト

### 月間ランニングコスト
- **Supabase Pro**: $25/月
- **Vimeo Pro**: $50-200/月
- **CloudFlare Stream**: $5/1000分
- **Stripe**: 売上の3.6%
- **Pusher**: $20-100/月
- **Vercel Pro**: $20/月
- **AWS S3**: $10-50/月
- **監視ツール**: $30-100/月

**合計: 約$160-545/月** (+ 売上連動費用)

## 🚀 次のアクション

1. **Supabaseプロジェクト作成**
2. **Stripeアカウント設定**
3. **Vimeo Pro契約**
4. **CloudFlare設定**
5. **データベーススキーマ実装**

このアーキテクチャで本格的なAI学習プラットフォームサービスを開始できます！