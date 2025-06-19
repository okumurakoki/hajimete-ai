// データベーススキーマ定義

export interface VideoRecord {
  id: string
  title: string
  description?: string
  vimeo_id: string
  vimeo_uri: string
  thumbnail_url?: string
  duration: number
  department: string
  level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  is_premium: boolean
  is_featured: boolean
  is_popular: boolean
  tags: string[]
  instructor_name: string
  upload_date: Date
  published_date?: Date
  status: 'draft' | 'published' | 'archived'
  view_count: number
  like_count: number
  created_at: Date
  updated_at: Date
}

export interface SeminarRecord {
  id: string
  title: string
  description?: string
  zoom_meeting_id?: string
  zoom_webinar_id?: string
  zoom_join_url?: string
  zoom_start_url?: string
  zoom_password?: string
  type: 'meeting' | 'webinar'
  department: string
  is_premium: boolean
  scheduled_date: Date
  duration: number // 分単位
  max_participants?: number
  instructor_name: string
  instructor_email: string
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  registration_required: boolean
  auto_recording: boolean
  waiting_room: boolean
  // 料金設定
  price_free: number // 無料プランの料金（通常5500円）
  price_basic: number // ベーシックプランの料金（通常5500円）
  price_premium: number // プレミアムプランの料金（通常4400円）
  created_at: Date
  updated_at: Date
}

export interface SeminarRegistration {
  id: string
  seminar_id: string
  user_id: string
  user_email: string
  user_name: string
  user_plan: 'free' | 'basic' | 'premium' // ユーザーのプラン
  registration_date: Date
  attendance_status: 'registered' | 'attended' | 'no_show'
  payment_status: 'pending' | 'paid' | 'failed' | 'free' // 支払い状況
  payment_amount: number // 実際の支払い金額
  zoom_registrant_id?: string
  created_at: Date
  updated_at: Date
}

export interface VideoProgress {
  id: string
  user_id: string
  video_id: string
  progress_percentage: number
  current_time: number // 秒単位
  last_watched: Date
  completed: boolean
  created_at: Date
  updated_at: Date
}

export interface ContentCollection {
  id: string
  name: string
  description?: string
  type: 'course' | 'playlist' | 'series'
  department: string
  is_premium: boolean
  video_ids: string[] // 順序付きの動画ID配列
  estimated_duration: number // 分単位
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  instructor_name: string
  thumbnail_url?: string
  created_at: Date
  updated_at: Date
}

export interface UserActivity {
  id: string
  user_id: string
  activity_type: 'video_view' | 'seminar_join' | 'seminar_register' | 'course_complete'
  content_id: string // video_id, seminar_id, collection_id
  metadata?: Record<string, any>
  timestamp: Date
  created_at: Date
}

// Prismaスキーマ形式での定義（参考用）
export const PRISMA_SCHEMA = `
model Video {
  id             String   @id @default(cuid())
  title          String
  description    String?
  vimeoId        String   @map("vimeo_id")
  vimeoUri       String   @map("vimeo_uri")
  thumbnailUrl   String?  @map("thumbnail_url")
  duration       Int
  department     String
  level          Level
  category       String
  isPremium      Boolean  @map("is_premium")
  isFeatured     Boolean  @map("is_featured")
  isPopular      Boolean  @map("is_popular")
  tags           String[]
  instructorName String   @map("instructor_name")
  uploadDate     DateTime @map("upload_date")
  publishedDate  DateTime? @map("published_date")
  status         VideoStatus
  viewCount      Int      @map("view_count") @default(0)
  likeCount      Int      @map("like_count") @default(0)
  createdAt      DateTime @map("created_at") @default(now())
  updatedAt      DateTime @map("updated_at") @updatedAt

  // Relations
  progress       VideoProgress[]
  collections    VideoCollectionItem[]

  @@map("videos")
}

model Seminar {
  id                   String    @id @default(cuid())
  title                String
  description          String?
  zoomMeetingId        String?   @map("zoom_meeting_id")
  zoomWebinarId        String?   @map("zoom_webinar_id")
  zoomJoinUrl          String?   @map("zoom_join_url")
  zoomStartUrl         String?   @map("zoom_start_url")
  zoomPassword         String?   @map("zoom_password")
  type                 SeminarType
  department           String
  isPremium            Boolean   @map("is_premium")
  scheduledDate        DateTime  @map("scheduled_date")
  duration             Int       // 分単位
  maxParticipants      Int?      @map("max_participants")
  instructorName       String    @map("instructor_name")
  instructorEmail      String    @map("instructor_email")
  status               SeminarStatus
  registrationRequired Boolean   @map("registration_required")
  autoRecording        Boolean   @map("auto_recording")
  waitingRoom          Boolean   @map("waiting_room")
  createdAt            DateTime  @map("created_at") @default(now())
  updatedAt            DateTime  @map("updated_at") @updatedAt

  // Relations
  registrations        SeminarRegistration[]

  @@map("seminars")
}

model SeminarRegistration {
  id               String             @id @default(cuid())
  seminarId        String             @map("seminar_id")
  userId           String             @map("user_id")
  userEmail        String             @map("user_email")
  userName         String             @map("user_name")
  registrationDate DateTime           @map("registration_date")
  attendanceStatus AttendanceStatus   @map("attendance_status")
  zoomRegistrantId String?            @map("zoom_registrant_id")
  createdAt        DateTime           @map("created_at") @default(now())
  updatedAt        DateTime           @map("updated_at") @updatedAt

  // Relations
  seminar          Seminar            @relation(fields: [seminarId], references: [id])

  @@map("seminar_registrations")
}

model VideoProgress {
  id                 String   @id @default(cuid())
  userId             String   @map("user_id")
  videoId            String   @map("video_id")
  progressPercentage Int      @map("progress_percentage")
  currentTime        Int      @map("current_time") // 秒単位
  lastWatched        DateTime @map("last_watched")
  completed          Boolean  @default(false)
  createdAt          DateTime @map("created_at") @default(now())
  updatedAt          DateTime @map("updated_at") @updatedAt

  // Relations
  video              Video    @relation(fields: [videoId], references: [id])

  @@unique([userId, videoId])
  @@map("video_progress")
}

model ContentCollection {
  id               String                   @id @default(cuid())
  name             String
  description      String?
  type             CollectionType
  department       String
  isPremium        Boolean                  @map("is_premium")
  estimatedDuration Int                     @map("estimated_duration") // 分単位
  difficultyLevel  Level                    @map("difficulty_level")
  instructorName   String                   @map("instructor_name")
  thumbnailUrl     String?                  @map("thumbnail_url")
  createdAt        DateTime                 @map("created_at") @default(now())
  updatedAt        DateTime                 @map("updated_at") @updatedAt

  // Relations
  videos           VideoCollectionItem[]

  @@map("content_collections")
}

model VideoCollectionItem {
  id           String            @id @default(cuid())
  collectionId String            @map("collection_id")
  videoId      String            @map("video_id")
  order        Int               // 表示順序
  createdAt    DateTime          @map("created_at") @default(now())

  // Relations
  collection   ContentCollection @relation(fields: [collectionId], references: [id])
  video        Video             @relation(fields: [videoId], references: [id])

  @@unique([collectionId, videoId])
  @@map("video_collection_items")
}

model UserActivity {
  id           String            @id @default(cuid())
  userId       String            @map("user_id")
  activityType ActivityType      @map("activity_type")
  contentId    String            @map("content_id")
  metadata     Json?
  timestamp    DateTime
  createdAt    DateTime          @map("created_at") @default(now())

  @@map("user_activities")
}

// Enums
enum Level {
  beginner
  intermediate
  advanced
}

enum VideoStatus {
  draft
  published
  archived
}

enum SeminarType {
  meeting
  webinar
}

enum SeminarStatus {
  scheduled
  live
  completed
  cancelled
}

enum AttendanceStatus {
  registered
  attended
  no_show
}

enum CollectionType {
  course
  playlist
  series
}

enum ActivityType {
  video_view
  seminar_join
  seminar_register
  course_complete
}
`

// SQL作成ヘルパー関数
export function generateCreateTableSQL(): string[] {
  return [
    `CREATE TABLE IF NOT EXISTS videos (
      id VARCHAR(255) PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      description TEXT,
      vimeo_id VARCHAR(255) NOT NULL,
      vimeo_uri VARCHAR(500) NOT NULL,
      thumbnail_url VARCHAR(1000),
      duration INTEGER NOT NULL,
      department VARCHAR(255) NOT NULL,
      level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
      category VARCHAR(255) NOT NULL,
      is_premium BOOLEAN NOT NULL DEFAULT false,
      is_featured BOOLEAN NOT NULL DEFAULT false,
      is_popular BOOLEAN NOT NULL DEFAULT false,
      tags JSON,
      instructor_name VARCHAR(255) NOT NULL,
      upload_date DATETIME NOT NULL,
      published_date DATETIME,
      status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
      view_count INTEGER NOT NULL DEFAULT 0,
      like_count INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`,
    
    `CREATE TABLE IF NOT EXISTS seminars (
      id VARCHAR(255) PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      description TEXT,
      zoom_meeting_id VARCHAR(255),
      zoom_webinar_id VARCHAR(255),
      zoom_join_url VARCHAR(1000),
      zoom_start_url VARCHAR(1000),
      zoom_password VARCHAR(255),
      type ENUM('meeting', 'webinar') NOT NULL,
      department VARCHAR(255) NOT NULL,
      is_premium BOOLEAN NOT NULL DEFAULT false,
      scheduled_date DATETIME NOT NULL,
      duration INTEGER NOT NULL,
      max_participants INTEGER,
      instructor_name VARCHAR(255) NOT NULL,
      instructor_email VARCHAR(255) NOT NULL,
      status ENUM('scheduled', 'live', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
      registration_required BOOLEAN NOT NULL DEFAULT true,
      auto_recording BOOLEAN NOT NULL DEFAULT false,
      waiting_room BOOLEAN NOT NULL DEFAULT true,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`,
    
    `CREATE TABLE IF NOT EXISTS seminar_registrations (
      id VARCHAR(255) PRIMARY KEY,
      seminar_id VARCHAR(255) NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      user_email VARCHAR(255) NOT NULL,
      user_name VARCHAR(255) NOT NULL,
      registration_date DATETIME NOT NULL,
      attendance_status ENUM('registered', 'attended', 'no_show') NOT NULL DEFAULT 'registered',
      zoom_registrant_id VARCHAR(255),
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (seminar_id) REFERENCES seminars(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_seminar (user_id, seminar_id)
    );`,
    
    `CREATE TABLE IF NOT EXISTS video_progress (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      video_id VARCHAR(255) NOT NULL,
      progress_percentage INTEGER NOT NULL DEFAULT 0,
      current_time INTEGER NOT NULL DEFAULT 0,
      last_watched DATETIME NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT false,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_video (user_id, video_id)
    );`,
    
    `CREATE TABLE IF NOT EXISTS content_collections (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(500) NOT NULL,
      description TEXT,
      type ENUM('course', 'playlist', 'series') NOT NULL,
      department VARCHAR(255) NOT NULL,
      is_premium BOOLEAN NOT NULL DEFAULT false,
      estimated_duration INTEGER NOT NULL DEFAULT 0,
      difficulty_level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
      instructor_name VARCHAR(255) NOT NULL,
      thumbnail_url VARCHAR(1000),
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`,
    
    `CREATE TABLE IF NOT EXISTS video_collection_items (
      id VARCHAR(255) PRIMARY KEY,
      collection_id VARCHAR(255) NOT NULL,
      video_id VARCHAR(255) NOT NULL,
      order_index INTEGER NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (collection_id) REFERENCES content_collections(id) ON DELETE CASCADE,
      FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
      UNIQUE KEY unique_collection_video (collection_id, video_id)
    );`,
    
    `CREATE TABLE IF NOT EXISTS user_activities (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      activity_type ENUM('video_view', 'seminar_join', 'seminar_register', 'course_complete') NOT NULL,
      content_id VARCHAR(255) NOT NULL,
      metadata JSON,
      timestamp DATETIME NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_activity (user_id, timestamp),
      INDEX idx_content_activity (content_id, timestamp)
    );`
  ]
}