const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // テストセミナーデータを作成
  const seminars = [
    {
      title: 'ChatGPT活用セミナー 基礎編',
      description: 'ChatGPTの基本的な使い方から実践的な活用法まで学べるセミナーです。',
      instructor: '山田太郎',
      startDate: new Date('2024-07-28T10:00:00Z'),
      endDate: new Date('2024-07-28T12:00:00Z'),
      duration: 120,
      price: 5500,
      level: 'BEGINNER',
      category: 'AI研究ツール',
      maxParticipants: 50,
      currentParticipants: 0,
      curriculum: JSON.stringify([
        'ChatGPTの基本概念',
        'プロンプト作成のコツ',
        '実践的な活用事例',
        'Q&Aセッション'
      ]),
      tags: 'ChatGPT,AI,生産性',
      isActive: true,
      isPublished: true,
      zoomUrl: 'https://zoom.us/j/123456789',
      zoomId: '123456789',
      zoomPassword: 'test123'
    },
    {
      title: 'Notion AI 実践活用術',
      description: 'Notion AIを使った効率的なワークフロー構築を学びます。',
      instructor: '佐藤花子',
      startDate: new Date('2024-07-29T14:00:00Z'),
      endDate: new Date('2024-07-29T16:00:00Z'),
      duration: 120,
      price: 5500,
      level: 'INTERMEDIATE',
      category: '生産性ツール',
      maxParticipants: 30,
      currentParticipants: 0,
      curriculum: JSON.stringify([
        'Notion AIの概要',
        'テンプレート作成',
        '自動化の設定',
        '実践ワークショップ'
      ]),
      tags: 'Notion,AI,生産性,ワークフロー',
      isActive: true,
      isPublished: true,
      zoomUrl: 'https://zoom.us/j/987654321',
      zoomId: '987654321',
      zoomPassword: 'notion123'
    },
    {
      title: 'AIプロンプト エンジニアリング',
      description: '効果的なAIプロンプトの作成方法を学ぶ上級者向けセミナーです。',
      instructor: '田中一郎',
      startDate: new Date('2024-07-30T19:00:00Z'),
      endDate: new Date('2024-07-30T21:00:00Z'),
      duration: 120,
      price: 7700,
      level: 'ADVANCED',
      category: 'AI開発',
      maxParticipants: 20,
      currentParticipants: 0,
      curriculum: JSON.stringify([
        'プロンプトエンジニアリングの基礎',
        '高度なテクニック',
        'ケーススタディ',
        'ハンズオン実習'
      ]),
      tags: 'プロンプト,エンジニアリング,AI,上級',
      isActive: true,
      isPublished: true,
      zoomUrl: 'https://zoom.us/j/456789123',
      zoomId: '456789123',
      zoomPassword: 'prompt123'
    }
  ]

  console.log('セミナーデータを作成中...')
  
  for (const seminar of seminars) {
    try {
      const created = await prisma.liveCourse.create({
        data: seminar
      })
      console.log(`✅ セミナー作成完了: ${created.title}`)
    } catch (error) {
      console.error(`❌ セミナー作成エラー: ${seminar.title}`, error)
    }
  }

  console.log('✅ すべてのセミナーデータの作成が完了しました')
}

main()
  .catch((e) => {
    console.error('❌ エラーが発生しました:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })