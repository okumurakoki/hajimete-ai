# 🗄️ はじめて.AI データベース設定ガイド

## 🚀 Supabase セットアップ

### 1. Supabaseプロジェクト作成

1. [Supabase Dashboard](https://supabase.com/dashboard) にアクセス
2. "New Project" をクリック
3. プロジェクト設定:
   - **Name**: `hajimete-ai`
   - **Database Password**: 強力なパスワードを設定
   - **Region**: `Northeast Asia (Tokyo)`

### 2. 環境変数設定

```env
# .env.local に追加
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@db.project-id.supabase.co:5432/postgres
```

## 📊 データベーススキーマ実装

### 1. ユーザー関連テーブル

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Clerk integration)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id VARCHAR UNIQUE NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    plan VARCHAR DEFAULT 'basic' CHECK (plan IN ('basic', 'premium')),
    subscription_id VARCHAR,
    status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    avatar_url VARCHAR,
    department_preferences TEXT[] DEFAULT '{}',
    learning_goals JSONB DEFAULT '{}',
    timezone VARCHAR DEFAULT 'Asia/Tokyo',
    language VARCHAR DEFAULT 'ja',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    video_quality VARCHAR DEFAULT 'auto' CHECK (video_quality IN ('auto', '720p', '1080p')),
    playback_speed DECIMAL DEFAULT 1.0,
    auto_continue BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);
```

### 2. コンテンツ関連テーブル

```sql
-- Departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color_primary VARCHAR(7), -- HEX color
    color_secondary VARCHAR(7),
    icon VARCHAR(10),
    access_level VARCHAR DEFAULT 'basic' CHECK (access_level IN ('basic', 'premium')),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default departments
INSERT INTO departments (name, slug, description, color_primary, color_secondary, icon, access_level, sort_order) VALUES
('AI基礎学部', 'ai-basics', 'AIの基本概念から実践的な活用方法まで学ぶ', '#3B82F6', '#93C5FD', '🤖', 'basic', 1),
('業務効率化学部', 'productivity', '日常業務にAIを活用して生産性を向上させる方法', '#10B981', '#6EE7B7', '⚡', 'basic', 2),
('実践応用学部', 'practical-application', '実際のビジネス現場でのAI活用事例と実践', '#F97316', '#FB923C', '🚀', 'basic', 3),
('キャッチアップ学部', 'catchup', '最新のAI技術とトレンドを学ぶプレミアム講座', '#8B5CF6', '#A78BFA', '⭐', 'premium', 4);

-- Videos
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    slug VARCHAR(200) UNIQUE,
    vimeo_id VARCHAR UNIQUE,
    thumbnail_url VARCHAR,
    duration INTEGER, -- seconds
    department_id UUID REFERENCES departments(id),
    level VARCHAR DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    is_premium BOOLEAN DEFAULT false,
    instructor_id UUID REFERENCES users(id),
    instructor_name VARCHAR(100),
    status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    tags TEXT[] DEFAULT '{}',
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    upload_date TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Video chapters
CREATE TABLE video_chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    start_time INTEGER NOT NULL, -- seconds
    duration INTEGER NOT NULL, -- seconds
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Video materials
CREATE TABLE video_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    file_url VARCHAR NOT NULL,
    file_type VARCHAR(10), -- pdf, zip, etc
    file_size BIGINT, -- bytes
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. 学習進捗テーブル

```sql
-- Learning progress
CREATE TABLE learning_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    completed_at TIMESTAMP WITH TIME ZONE,
    watch_time INTEGER DEFAULT 0, -- seconds
    last_position INTEGER DEFAULT 0, -- seconds
    completion_rate DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, video_id)
);

-- User achievements
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    badge_color VARCHAR(7),
    criteria JSONB, -- JSON criteria for earning
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User earned achievements
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Video ratings
CREATE TABLE video_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, video_id)
);
```

### 4. セミナー関連テーブル

```sql
-- Instructors
CREATE TABLE instructors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR,
    specialties TEXT[] DEFAULT '{}',
    social_links JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seminars
CREATE TABLE seminars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructor_id UUID REFERENCES instructors(id),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    timezone VARCHAR DEFAULT 'Asia/Tokyo',
    capacity INTEGER DEFAULT 100,
    registered_count INTEGER DEFAULT 0,
    zoom_meeting_id VARCHAR,
    zoom_passcode VARCHAR,
    zoom_join_url VARCHAR,
    is_premium BOOLEAN DEFAULT false,
    status VARCHAR DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    recording_url VARCHAR,
    materials JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seminar registrations
CREATE TABLE seminar_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    seminar_id UUID REFERENCES seminars(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    attended BOOLEAN DEFAULT false,
    attendance_duration INTEGER DEFAULT 0, -- seconds
    feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_comment TEXT,
    UNIQUE(user_id, seminar_id)
);
```

### 5. ライブ配信テーブル

```sql
-- Live streams
CREATE TABLE live_streams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructor_id UUID REFERENCES instructors(id),
    cloudflare_stream_id VARCHAR UNIQUE,
    stream_key VARCHAR UNIQUE,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
    is_premium BOOLEAN DEFAULT true,
    max_viewers INTEGER DEFAULT 1000,
    current_viewers INTEGER DEFAULT 0,
    peak_viewers INTEGER DEFAULT 0,
    recording_url VARCHAR,
    thumbnail_url VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stream viewers (for analytics)
CREATE TABLE stream_viewers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    watch_duration INTEGER DEFAULT 0, -- seconds
    ip_address INET,
    user_agent TEXT
);

-- Chat messages
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    username VARCHAR(50),
    message TEXT NOT NULL,
    message_type VARCHAR DEFAULT 'text' CHECK (message_type IN ('text', 'emoji', 'system')),
    is_moderator BOOLEAN DEFAULT false,
    is_highlighted BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    deleted_by UUID REFERENCES users(id),
    deleted_reason VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat reactions
CREATE TABLE chat_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reaction VARCHAR(10) NOT NULL, -- emoji
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(message_id, user_id, reaction)
);
```

### 6. 決済・サブスクリプションテーブル

```sql
-- Subscription plans
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    price_monthly INTEGER NOT NULL, -- in cents (JPY)
    price_yearly INTEGER, -- in cents (JPY)
    stripe_price_id_monthly VARCHAR,
    stripe_price_id_yearly VARCHAR,
    features JSONB DEFAULT '[]',
    max_simultaneous_streams INTEGER DEFAULT 1,
    download_enabled BOOLEAN DEFAULT false,
    offline_viewing BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default plans
INSERT INTO subscription_plans (name, slug, description, price_monthly, price_yearly, features, sort_order) VALUES
('ベーシック', 'basic', 'AI学習の基礎を身につける', 165000, 1650000, '["AI基礎学部", "業務効率化学部", "実践応用学部", "基本セミナー参加権", "コミュニティアクセス"]', 1),
('プレミアム', 'premium', '全てのコンテンツにアクセス', 550000, 5500000, '["全学部アクセス", "ライブ配信視聴", "プレミアムセミナー", "個別サポート", "先行コンテンツ", "ダウンロード機能", "修了証書"]', 2);

-- Subscriptions (Stripe integration)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    stripe_subscription_id VARCHAR UNIQUE,
    stripe_customer_id VARCHAR,
    status VARCHAR NOT NULL CHECK (status IN ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment history
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    subscription_id UUID REFERENCES subscriptions(id),
    stripe_payment_intent_id VARCHAR UNIQUE,
    amount INTEGER NOT NULL, -- in cents
    currency VARCHAR(3) DEFAULT 'JPY',
    status VARCHAR NOT NULL,
    payment_method VARCHAR,
    invoice_url VARCHAR,
    receipt_url VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. 分析・ログテーブル

```sql
-- Video analytics
CREATE TABLE video_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR NOT NULL CHECK (event_type IN ('view', 'pause', 'resume', 'seek', 'complete', 'exit')),
    timestamp_in_video INTEGER, -- seconds
    watched_duration INTEGER DEFAULT 0, -- seconds
    session_id VARCHAR,
    ip_address INET,
    user_agent TEXT,
    referrer VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR UNIQUE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration INTEGER DEFAULT 0, -- seconds
    pages_viewed INTEGER DEFAULT 0,
    videos_watched INTEGER DEFAULT 0,
    ip_address INET,
    user_agent TEXT,
    device_type VARCHAR,
    browser VARCHAR,
    os VARCHAR
);

-- Audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR NOT NULL,
    resource_type VARCHAR,
    resource_id VARCHAR,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT false,
    action_url VARCHAR,
    action_text VARCHAR,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8. インデックスとパフォーマンス最適化

```sql
-- Performance indexes
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_plan ON users(plan);

CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_department ON videos(department_id);
CREATE INDEX idx_videos_is_premium ON videos(is_premium);
CREATE INDEX idx_videos_published_at ON videos(published_at DESC);

CREATE INDEX idx_learning_progress_user ON learning_progress(user_id);
CREATE INDEX idx_learning_progress_video ON learning_progress(video_id);
CREATE INDEX idx_learning_progress_completed ON learning_progress(completed_at);

CREATE INDEX idx_seminars_date ON seminars(date);
CREATE INDEX idx_seminars_status ON seminars(status);
CREATE INDEX idx_seminar_registrations_user ON seminar_registrations(user_id);

CREATE INDEX idx_live_streams_status ON live_streams(status);
CREATE INDEX idx_live_streams_scheduled ON live_streams(scheduled_at);
CREATE INDEX idx_chat_messages_stream ON chat_messages(stream_id, created_at);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

CREATE INDEX idx_video_analytics_video ON video_analytics(video_id, created_at);
CREATE INDEX idx_video_analytics_user ON video_analytics(user_id, created_at);

-- Full-text search indexes
CREATE INDEX idx_videos_search ON videos USING gin(to_tsvector('japanese', title || ' ' || description));
CREATE INDEX idx_seminars_search ON seminars USING gin(to_tsvector('japanese', title || ' ' || description));
```

### 9. RLS (Row Level Security) 設定

```sql
-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE seminar_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY users_own_data ON users FOR ALL USING (auth.uid()::text = clerk_id);
CREATE POLICY user_profiles_own_data ON user_profiles FOR ALL USING (
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text)
);
CREATE POLICY learning_progress_own_data ON learning_progress FOR ALL USING (
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text)
);
CREATE POLICY seminar_registrations_own_data ON seminar_registrations FOR ALL USING (
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text)
);
CREATE POLICY subscriptions_own_data ON subscriptions FOR ALL USING (
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text)
);
CREATE POLICY notifications_own_data ON notifications FOR ALL USING (
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text)
);

-- Public read access for content
CREATE POLICY videos_public_read ON videos FOR SELECT USING (status = 'published');
CREATE POLICY departments_public_read ON departments FOR SELECT USING (is_active = true);
CREATE POLICY seminars_public_read ON seminars FOR SELECT USING (status IN ('upcoming', 'ongoing'));
```

### 10. 関数とトリガー

```sql
-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for auto-updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_progress_updated_at BEFORE UPDATE ON learning_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seminars_updated_at BEFORE UPDATE ON seminars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate user progress
CREATE OR REPLACE FUNCTION calculate_user_progress(user_uuid UUID)
RETURNS TABLE(
    total_videos INTEGER,
    completed_videos INTEGER,
    total_watch_time INTEGER,
    completion_rate DECIMAL,
    department_progress JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_videos,
        COUNT(CASE WHEN lp.completed_at IS NOT NULL THEN 1 END)::INTEGER as completed_videos,
        COALESCE(SUM(lp.watch_time), 0)::INTEGER as total_watch_time,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND(COUNT(CASE WHEN lp.completed_at IS NOT NULL THEN 1 END)::DECIMAL / COUNT(*) * 100, 2)
            ELSE 0
        END as completion_rate,
        COALESCE(
            jsonb_object_agg(
                d.name, 
                json_build_object(
                    'completed', COUNT(CASE WHEN lp.completed_at IS NOT NULL THEN 1 END),
                    'total', COUNT(*)
                )
            ), 
            '{}'::jsonb
        ) as department_progress
    FROM learning_progress lp
    JOIN videos v ON lp.video_id = v.id
    JOIN departments d ON v.department_id = d.id
    WHERE lp.user_id = user_uuid AND v.status = 'published'
    GROUP BY d.name;
END;
$$ LANGUAGE plpgsql;

-- Function to update video view count
CREATE OR REPLACE FUNCTION increment_video_view_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.event_type = 'view' THEN
        UPDATE videos 
        SET view_count = view_count + 1 
        WHERE id = NEW.video_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_video_views 
    AFTER INSERT ON video_analytics 
    FOR EACH ROW 
    EXECUTE FUNCTION increment_video_view_count();
```

## 🔧 Prisma ORM 設定

### 1. Prisma インストール

```bash
npm install prisma @prisma/client
npx prisma init
```

### 2. Prisma Schema 設定

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String   @id @default(uuid()) @db.Uuid
  clerkId        String   @unique @map("clerk_id")
  email          String   @unique
  plan           String   @default("basic")
  subscriptionId String?  @map("subscription_id")
  status         String   @default("active")
  createdAt      DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime @default(now()) @map("updated_at") @db.Timestamptz(6)

  profile       UserProfile?
  preferences   UserPreferences?
  progress      LearningProgress[]
  registrations SeminarRegistration[]
  subscriptions Subscription[]
  achievements  UserAchievement[]
  ratings       VideoRating[]
  notifications Notification[]
  sessions      UserSession[]

  @@map("users")
}

model Video {
  id             String    @id @default(uuid()) @db.Uuid
  title          String    @db.VarChar(200)
  description    String?
  slug           String?   @unique @db.VarChar(200)
  vimeoId        String?   @unique @map("vimeo_id")
  thumbnailUrl   String?   @map("thumbnail_url")
  duration       Int?
  departmentId   String    @map("department_id") @db.Uuid
  level          String    @default("beginner")
  isPremium      Boolean   @default(false) @map("is_premium")
  instructorId   String?   @map("instructor_id") @db.Uuid
  instructorName String?   @map("instructor_name") @db.VarChar(100)
  status         String    @default("draft")
  tags           String[]  @default([])
  viewCount      Int       @default(0) @map("view_count")
  likeCount      Int       @default(0) @map("like_count")
  averageRating  Decimal   @default(0.0) @map("average_rating") @db.Decimal(3, 2)
  uploadDate     DateTime? @map("upload_date") @db.Timestamptz(6)
  publishedAt    DateTime? @map("published_at") @db.Timestamptz(6)
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime  @default(now()) @map("updated_at") @db.Timestamptz(6)

  department Department       @relation(fields: [departmentId], references: [id])
  progress   LearningProgress[]
  chapters   VideoChapter[]
  materials  VideoMaterial[]
  ratings    VideoRating[]
  analytics  VideoAnalytics[]

  @@map("videos")
}

// ... 他のモデル定義
```

### 3. Prisma Client セットアップ

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## 🚀 初期データ投入

### 1. シードデータ作成

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Departments
  const aiBasics = await prisma.department.create({
    data: {
      name: 'AI基礎学部',
      slug: 'ai-basics',
      description: 'AIの基本概念から実践的な活用方法まで学ぶ',
      colorPrimary: '#3B82F6',
      colorSecondary: '#93C5FD',
      icon: '🤖',
      accessLevel: 'basic',
      sortOrder: 1
    }
  })

  // Sample videos
  await prisma.video.createMany({
    data: [
      {
        title: 'ChatGPT完全入門',
        description: 'ChatGPTの基本的な使い方から応用まで',
        departmentId: aiBasics.id,
        level: 'beginner',
        isPremium: false,
        instructorName: '田中AI太郎',
        status: 'published',
        duration: 2730, // 45:30
        tags: ['ChatGPT', '基礎', 'AI']
      },
      // ... more videos
    ]
  })

  // Subscription plans
  await prisma.subscriptionPlan.createMany({
    data: [
      {
        name: 'ベーシック',
        slug: 'basic',
        description: 'AI学習の基礎を身につける',
        priceMonthly: 165000, // ¥1,650
        priceYearly: 1650000,  // ¥16,500
        features: ['AI基礎学部', '業務効率化学部', '実践応用学部'],
        sortOrder: 1
      },
      {
        name: 'プレミアム',
        slug: 'premium',
        description: '全てのコンテンツにアクセス',
        priceMonthly: 550000, // ¥5,500
        priceYearly: 5500000, // ¥55,000
        features: ['全学部アクセス', 'ライブ配信', 'プレミアムセミナー'],
        sortOrder: 2
      }
    ]
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### 2. シード実行

```bash
npx prisma db push
npx prisma db seed
```

## 📊 データベース分析クエリ

### 1. ユーザー分析

```sql
-- アクティブユーザー数（月別）
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as new_users,
    COUNT(*) FILTER (WHERE plan = 'premium') as premium_users
FROM users 
WHERE created_at >= NOW() - INTERVAL '12 months'
GROUP BY month
ORDER BY month;

-- 学習進捗ランキング
SELECT 
    u.email,
    COUNT(lp.id) as videos_watched,
    SUM(lp.watch_time) as total_watch_time,
    COUNT(CASE WHEN lp.completed_at IS NOT NULL THEN 1 END) as completed_videos
FROM users u
LEFT JOIN learning_progress lp ON u.id = lp.user_id
GROUP BY u.id, u.email
ORDER BY completed_videos DESC, total_watch_time DESC
LIMIT 20;
```

### 2. コンテンツ分析

```sql
-- 人気動画ランキング
SELECT 
    v.title,
    v.view_count,
    v.average_rating,
    d.name as department,
    COUNT(lp.id) as enrolled_users,
    AVG(lp.progress_percentage) as avg_progress
FROM videos v
JOIN departments d ON v.department_id = d.id
LEFT JOIN learning_progress lp ON v.id = lp.video_id
WHERE v.status = 'published'
GROUP BY v.id, v.title, v.view_count, v.average_rating, d.name
ORDER BY v.view_count DESC
LIMIT 20;

-- 学部別視聴統計
SELECT 
    d.name as department,
    COUNT(DISTINCT v.id) as total_videos,
    COUNT(DISTINCT lp.user_id) as unique_viewers,
    SUM(v.view_count) as total_views,
    AVG(v.average_rating) as avg_rating
FROM departments d
LEFT JOIN videos v ON d.id = v.department_id AND v.status = 'published'
LEFT JOIN learning_progress lp ON v.id = lp.video_id
GROUP BY d.id, d.name
ORDER BY total_views DESC;
```

### 3. 売上分析

```sql
-- 月別売上
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as subscriptions,
    SUM(CASE 
        WHEN sp.slug = 'basic' THEN sp.price_monthly 
        WHEN sp.slug = 'premium' THEN sp.price_monthly
    END) / 100.0 as revenue_jpy
FROM subscriptions s
JOIN subscription_plans sp ON s.plan_id = sp.id
WHERE s.status = 'active'
GROUP BY month
ORDER BY month;

-- チャーン率分析
SELECT 
    DATE_TRUNC('month', canceled_at) as month,
    COUNT(*) as canceled_subscriptions,
    LAG(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', canceled_at)) as previous_month_cancellations
FROM subscriptions 
WHERE canceled_at IS NOT NULL
GROUP BY month
ORDER BY month;
```

## 🔄 バックアップ・メンテナンス

### 1. 自動バックアップ設定

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_hajimete_ai_$DATE.sql
aws s3 cp backup_hajimete_ai_$DATE.sql s3://hajimete-ai-backups/
rm backup_hajimete_ai_$DATE.sql
```

### 2. パフォーマンス監視

```sql
-- スロークエリ監視
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- テーブルサイズ監視
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

これでSupabaseデータベースの完全なセットアップが完了します！