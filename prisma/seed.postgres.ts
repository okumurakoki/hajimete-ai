import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create departments
  console.log('📚 Creating departments...')
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { slug: 'ai-basics' },
      update: {},
      create: {
        name: 'AI基礎学部',
        slug: 'ai-basics',
        description: 'AIの基本概念から実践的な活用方法まで学ぶ',
        colorPrimary: '#3B82F6',
        colorSecondary: '#93C5FD',
        icon: '🤖',
        accessLevel: 'basic',
        sortOrder: 1
      }
    }),
    prisma.department.upsert({
      where: { slug: 'productivity' },
      update: {},
      create: {
        name: '業務効率化学部',
        slug: 'productivity',
        description: '日常業務にAIを活用して生産性を向上させる方法',
        colorPrimary: '#10B981',
        colorSecondary: '#6EE7B7',
        icon: '⚡',
        accessLevel: 'basic',
        sortOrder: 2
      }
    }),
    prisma.department.upsert({
      where: { slug: 'practical-application' },
      update: {},
      create: {
        name: '実践応用学部',
        slug: 'practical-application',
        description: '実際のビジネス現場でのAI活用事例と実践',
        colorPrimary: '#F97316',
        colorSecondary: '#FB923C',
        icon: '🚀',
        accessLevel: 'basic',
        sortOrder: 3
      }
    }),
    prisma.department.upsert({
      where: { slug: 'catchup' },
      update: {},
      create: {
        name: 'キャッチアップ学部',
        slug: 'catchup',
        description: '最新のAI技術とトレンドを学ぶプレミアム講座',
        colorPrimary: '#8B5CF6',
        colorSecondary: '#A78BFA',
        icon: '⭐',
        accessLevel: 'premium',
        sortOrder: 4
      }
    })
  ])

  console.log(`✅ Created ${departments.length} departments`)

  // Create subscription plans
  console.log('💳 Creating subscription plans...')
  const plans = await Promise.all([
    prisma.subscriptionPlan.upsert({
      where: { slug: 'basic' },
      update: {},
      create: {
        name: 'ベーシック',
        slug: 'basic',
        description: 'AI学習の基礎を身につける',
        priceMonthly: 165000, // ¥1,650
        priceYearly: 1650000,  // ¥16,500
        features: [
          'AI基礎学部アクセス',
          '業務効率化学部アクセス', 
          '実践応用学部アクセス',
          '基本セミナー参加権',
          'コミュニティアクセス'
        ],
        sortOrder: 1
      }
    }),
    prisma.subscriptionPlan.upsert({
      where: { slug: 'premium' },
      update: {},
      create: {
        name: 'プレミアム',
        slug: 'premium',
        description: '全てのコンテンツにアクセス',
        priceMonthly: 550000, // ¥5,500
        priceYearly: 5500000, // ¥55,000
        features: [
          '全学部アクセス',
          'ライブ配信視聴',
          'プレミアムセミナー',
          '個別サポート',
          '先行コンテンツ',
          'ダウンロード機能',
          '修了証書発行'
        ],
        maxSimultaneousStreams: 3,
        downloadEnabled: true,
        offlineViewing: true,
        sortOrder: 2
      }
    })
  ])

  console.log(`✅ Created ${plans.length} subscription plans`)

  // Create sample instructor
  console.log('👨‍🏫 Creating sample instructor...')
  const instructor = await prisma.instructor.upsert({
    where: { id: 'sample-instructor-id' },
    update: {},
    create: {
      id: 'sample-instructor-id',
      name: '田中AI太郎',
      bio: '10年以上のAI研究開発経験を持つエンジニア。ChatGPTをはじめとする生成AIの実践活用に詳しい。',
      specialties: ['ChatGPT', '業務効率化', 'プロンプトエンジニアリング'],
      socialLinks: {
        twitter: 'https://twitter.com/ai_taro',
        linkedin: 'https://linkedin.com/in/ai-taro'
      }
    }
  })

  console.log('✅ Created sample instructor')

  // Create sample videos
  console.log('🎬 Creating sample videos...')
  const sampleVideos = [
    {
      title: 'ChatGPT完全入門',
      description: 'ChatGPTの基本的な使い方から応用まで、初心者でもわかりやすく解説します。',
      slug: 'chatgpt-basics',
      departmentId: departments[0].id, // AI基礎学部
      level: 'beginner',
      isPremium: false,
      instructorName: '田中AI太郎',
      status: 'published',
      duration: 2730, // 45:30
      tags: ['ChatGPT', '基礎', 'AI', '入門'],
      viewCount: 1250,
      averageRating: 4.8,
      publishedAt: new Date('2024-01-15'),
      vimeoId: 'demo-video-1'
    },
    {
      title: 'Excel作業をAIで10倍効率化',
      description: 'ExcelとAIを組み合わせて業務効率を劇的に向上させる方法を学びます。',
      slug: 'excel-ai-automation',
      departmentId: departments[1].id, // 業務効率化学部
      level: 'intermediate',
      isPremium: false,
      instructorName: '田中AI太郎',
      status: 'published',
      duration: 3600, // 60:00
      tags: ['Excel', '業務効率化', 'オートメーション'],
      viewCount: 980,
      averageRating: 4.6,
      publishedAt: new Date('2024-01-20'),
      vimeoId: 'demo-video-2'
    },
    {
      title: 'AI活用の実践事例集',
      description: '実際の企業でのAI導入事例を詳しく解説し、実践的な活用方法を学びます。',
      slug: 'ai-practical-cases',
      departmentId: departments[2].id, // 実践応用学部
      level: 'advanced',
      isPremium: false,
      instructorName: '田中AI太郎',
      status: 'published',
      duration: 4200, // 70:00
      tags: ['実践', '事例研究', 'ビジネス'],
      viewCount: 720,
      averageRating: 4.9,
      publishedAt: new Date('2024-02-01'),
      vimeoId: 'demo-video-3'
    },
    {
      title: '最新AI技術トレンド2024',
      description: '2024年の最新AI技術動向と今後の展望について詳しく解説します。',
      slug: 'ai-trends-2024',
      departmentId: departments[3].id, // キャッチアップ学部
      level: 'advanced',
      isPremium: true,
      instructorName: '田中AI太郎',
      status: 'published',
      duration: 5400, // 90:00
      tags: ['最新技術', 'トレンド', 'プレミアム'],
      viewCount: 450,
      averageRating: 5.0,
      publishedAt: new Date('2024-02-15'),
      vimeoId: 'demo-video-4'
    }
  ]

  const videos = await Promise.all(
    sampleVideos.map(video => 
      prisma.video.upsert({
        where: { slug: video.slug },
        update: {},
        create: video
      })
    )
  )

  console.log(`✅ Created ${videos.length} sample videos`)

  // Create video chapters for the first video
  console.log('📖 Creating video chapters...')
  await prisma.videoChapter.createMany({
    data: [
      {
        videoId: videos[0].id,
        title: 'ChatGPTとは？',
        startTime: 0,
        duration: 300,
        sortOrder: 1
      },
      {
        videoId: videos[0].id,
        title: '基本的な使い方',
        startTime: 300,
        duration: 600,
        sortOrder: 2
      },
      {
        videoId: videos[0].id,
        title: 'プロンプトのコツ',
        startTime: 900,
        duration: 900,
        sortOrder: 3
      },
      {
        videoId: videos[0].id,
        title: '実践演習',
        startTime: 1800,
        duration: 930,
        sortOrder: 4
      }
    ],
    skipDuplicates: true
  })

  // Create sample seminars
  console.log('📅 Creating sample seminars...')
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)

  await prisma.seminar.createMany({
    data: [
      {
        title: 'ChatGPT活用ワークショップ',
        description: '実際にChatGPTを使いながら業務効率化の方法を学ぶハンズオン形式のワークショップです。',
        instructorId: instructor.id,
        date: tomorrow,
        startTime: new Date('2024-01-01T14:00:00Z'),
        endTime: new Date('2024-01-01T16:00:00Z'),
        capacity: 50,
        registeredCount: 35,
        isPremium: false,
        status: 'upcoming',
        zoomMeetingId: '123456789',
        zoomPasscode: 'workshop2024'
      },
      {
        title: 'AI導入戦略セミナー（プレミアム限定）',
        description: 'プレミアム会員限定のAI導入戦略セミナー。企業でのAI活用方法を深く学びます。',
        instructorId: instructor.id,
        date: nextWeek,
        startTime: new Date('2024-01-01T19:00:00Z'),
        endTime: new Date('2024-01-01T21:00:00Z'),
        capacity: 20,
        registeredCount: 12,
        isPremium: true,
        status: 'upcoming',
        zoomMeetingId: '987654321',
        zoomPasscode: 'premium2024'
      }
    ],
    skipDuplicates: true
  })

  console.log('✅ Created sample seminars')

  // Create achievements
  console.log('🏆 Creating achievements...')
  await prisma.achievement.createMany({
    data: [
      {
        name: '初心者卒業',
        description: '最初の動画を完了',
        icon: '🎯',
        badgeColor: '#10B981',
        points: 100,
        criteria: { type: 'video_completion', count: 1 }
      },
      {
        name: '継続学習者',
        description: '5本の動画を完了',
        icon: '📚',
        badgeColor: '#3B82F6',
        points: 500,
        criteria: { type: 'video_completion', count: 5 }
      },
      {
        name: '学習マスター',
        description: '全ての基本コースを完了',
        icon: '👑',
        badgeColor: '#F59E0B',
        points: 1000,
        criteria: { type: 'department_completion', departments: ['ai-basics', 'productivity', 'practical-application'] }
      },
      {
        name: 'セミナー参加者',
        description: '初回セミナーに参加',
        icon: '🎤',
        badgeColor: '#8B5CF6',
        points: 200,
        criteria: { type: 'seminar_attendance', count: 1 }
      }
    ],
    skipDuplicates: true
  })

  console.log('✅ Created achievements')

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })