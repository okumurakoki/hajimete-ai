import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting SQLite database seed...')

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
        maxSimultaneousStreams: 3,
        downloadEnabled: true,
        offlineViewing: true,
        sortOrder: 2
      }
    })
  ])

  console.log(`✅ Created ${plans.length} subscription plans`)

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

  console.log('🎉 SQLite database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })