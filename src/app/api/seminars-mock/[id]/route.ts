import { NextResponse } from 'next/server'

// 公開用モックセミナーデータ（詳細版）
const publicMockSeminarsDetail = {
  '1': {
    id: '1',
    title: 'ChatGPT活用セミナー 基礎編',
    description: 'ChatGPTを使った効率的な業務改善方法を学びます。初心者の方でも安心してご参加いただけます。実際の業務で使えるプロンプトテクニックや、効率的な文書作成方法を実践的に学習できます。',
    instructor: '山田太郎',
    startDate: '2025-07-15T19:00:00.000Z',
    endDate: '2025-07-15T20:30:00.000Z',
    duration: 90,
    price: 3000,
    level: 'BEGINNER',
    category: 'AI基礎',
    maxParticipants: 50,
    currentParticipants: 12,
    tags: ['ChatGPT', 'AI', '基礎'],
    spotsLeft: 38,
    curriculum: [
      'ChatGPTとは何か - AIの基礎知識',
      '効果的なプロンプトの書き方',
      '業務効率化の実践例',
      '質疑応答とディスカッション'
    ],
    materials: [
      '受講者専用テキスト（PDF）',
      'プロンプト集テンプレート',
      '録画視聴権（1週間）'
    ]
  },
  '2': {
    id: '2',
    title: 'Notion AI 実践活用術',
    description: 'Notion AIを活用したドキュメント作成とデータ管理の効率化について実践的に学びます。チームでの情報共有や個人の知識管理を劇的に改善する方法を習得できます。',
    instructor: '佐藤花子',
    startDate: '2025-07-20T14:00:00.000Z',
    endDate: '2025-07-20T16:00:00.000Z',
    duration: 120,
    price: 5000,
    level: 'INTERMEDIATE',
    category: '生産性向上',
    maxParticipants: 30,
    currentParticipants: 8,
    tags: ['Notion', 'AI', '生産性'],
    spotsLeft: 22,
    curriculum: [
      'Notion AI の概要と設定',
      '自動文書作成のテクニック',
      'データベース活用術',
      'チーム連携の最適化',
      '実践ワークショップ'
    ],
    materials: [
      'Notion テンプレート集',
      'データベース設計ガイド',
      'チームワークフロー例',
      '録画視聴権（2週間）'
    ]
  },
  '3': {
    id: '3',
    title: 'AIプロンプト エンジニアリング',
    description: '効果的なAIプロンプトの書き方とテクニックを習得し、AIとの対話を最適化します。上級者向けの高度なテクニックと実践的な課題解決方法を学べます。',
    instructor: '田中一郎',
    startDate: '2025-07-25T19:30:00.000Z',
    endDate: '2025-07-25T21:00:00.000Z',
    duration: 90,
    price: 4000,
    level: 'ADVANCED',
    category: 'AI開発',
    maxParticipants: 25,
    currentParticipants: 18,
    tags: ['プロンプト', 'AI', '上級'],
    spotsLeft: 7,
    curriculum: [
      'プロンプトエンジニアリング基礎',
      'Chain-of-Thought テクニック',
      'Few-shot Learning の活用',
      '複雑なタスクの分解方法',
      '実践的な課題解決演習'
    ],
    materials: [
      'プロンプト設計フレームワーク',
      '高度なテクニック集',
      'ケーススタディ資料',
      '個別フィードバック付き'
    ]
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const seminarId = params.id
    
    console.log(`🔍 GET /api/seminars-mock/${seminarId} - Mock seminar detail`)
    
    const seminar = publicMockSeminarsDetail[seminarId as keyof typeof publicMockSeminarsDetail]
    
    if (!seminar) {
      return NextResponse.json(
        { error: 'セミナーが見つかりません' },
        { status: 404 }
      )
    }

    console.log(`📋 Returning mock seminar detail: ${seminar.title}`)
    return NextResponse.json(seminar)
    
  } catch (error) {
    console.error('Error fetching mock seminar detail:', error)
    return NextResponse.json(
      { error: 'セミナー詳細の取得に失敗しました' },
      { status: 500 }
    )
  }
}