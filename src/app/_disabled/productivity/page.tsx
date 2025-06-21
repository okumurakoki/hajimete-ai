'use client'

import { getDepartmentBySlug } from '@/lib/departments'
import DepartmentLayout from '@/components/DepartmentLayout'
import { VideoContent } from '@/lib/departments'

export const dynamic = 'force-dynamic'

export default function ProductivityPage() {
  const department = getDepartmentBySlug('productivity')!

  const videos: VideoContent[] = [
    {
      id: 'p1',
      title: 'Excel×AI で業務効率10倍アップ！実践テクニック',
      description: 'ExcelにAIを組み合わせて、データ分析や資料作成を劇的に効率化する方法を学びます。',
      duration: '42:30',
      thumbnail: '',
      instructor: '中村 効率化',
      type: 'recorded',
      department: 'productivity',
      tags: ['Excel', 'データ分析', '効率化'],
      level: 'beginner',
      viewCount: 18750,
      uploadDate: '2024-06-16',
      isNew: true,
      isPopular: true
    },
    {
      id: 'p2',
      title: 'AIを使った会議資料作成術 - PowerPoint自動生成',
      description: 'AIツールを活用してプレゼンテーション資料を効率的に作成する実践的な方法。',
      duration: '35:45',
      thumbnail: '',
      instructor: '田中 プレゼン',
      type: 'recorded',
      department: 'productivity',
      tags: ['PowerPoint', 'プレゼン', '資料作成'],
      level: 'beginner',
      viewCount: 14320,
      uploadDate: '2024-06-12',
      isNew: true
    },
    {
      id: 'p3',
      title: 'ChatGPT活用！メール・文書作成の自動化',
      description: 'ビジネスメールや報告書の作成をChatGPTで効率化するプロンプト集。',
      duration: '38:20',
      thumbnail: '',
      instructor: '佐藤 ビジネス',
      type: 'recorded',
      department: 'productivity',
      tags: ['ChatGPT', 'メール', '文書作成'],
      level: 'beginner',
      viewCount: 16890,
      uploadDate: '2024-06-08',
      isPopular: true
    },
    {
      id: 'p4',
      title: '【ライブ】AI業務効率化 相談室 - あなたの悩みを解決',
      description: '視聴者の業務効率化に関する悩みにAI専門家がリアルタイムでアドバイス。',
      duration: '90:00',
      thumbnail: '',
      instructor: '中村 効率化',
      type: 'live',
      department: 'productivity',
      tags: ['ライブ', '相談', '業務効率化'],
      level: 'intermediate',
      viewCount: 0,
      uploadDate: '2024-06-18'
    },
    {
      id: 'p5',
      title: 'Notion×AI でタスク管理革命',
      description: 'NotionとAIツールを組み合わせた次世代のタスク管理とプロジェクト運営。',
      duration: '44:15',
      thumbnail: '',
      instructor: '山田 タスク',
      type: 'recorded',
      department: 'productivity',
      tags: ['Notion', 'タスク管理', 'プロジェクト'],
      level: 'intermediate',
      viewCount: 11230,
      uploadDate: '2024-06-05'
    },
    {
      id: 'p6',
      title: 'AI自動化ツール比較 - Zapier vs Make.com',
      description: '業務自動化ツールの特徴比較と、用途別の使い分け方法を解説。',
      duration: '39:50',
      thumbnail: '',
      instructor: '鈴木 自動化',
      type: 'recorded',
      department: 'productivity',
      tags: ['自動化', 'Zapier', 'Make.com'],
      level: 'intermediate',
      viewCount: 8940,
      uploadDate: '2024-06-01'
    },
    {
      id: 'p7',
      title: 'スマホでAI活用！移動時間を生産的に',
      description: 'スマートフォンでできるAI活用術と、移動中の時間を有効活用する方法。',
      duration: '28:30',
      thumbnail: '',
      instructor: '田中 モバイル',
      type: 'recorded',
      department: 'productivity',
      tags: ['スマホ', '移動時間', 'モバイル'],
      level: 'beginner',
      viewCount: 13450,
      uploadDate: '2024-05-28'
    },
    {
      id: 'p8',
      title: 'AI翻訳ツール徹底比較 - DeepL vs Google翻訳',
      description: '各種AI翻訳ツールの特徴と、ビジネスシーンでの効果的な使い分け。',
      duration: '33:10',
      thumbnail: '',
      instructor: '佐藤 グローバル',
      type: 'recorded',
      department: 'productivity',
      tags: ['翻訳', 'DeepL', 'Google翻訳'],
      level: 'beginner',
      viewCount: 9870,
      uploadDate: '2024-05-25'
    },
    {
      id: 'p9',
      title: 'チーム効率化！Slack×AIボット活用術',
      description: 'SlackにAIボットを導入してチームコミュニケーションを効率化する方法。',
      duration: '41:25',
      thumbnail: '',
      instructor: '中村 チーム',
      type: 'recorded',
      department: 'productivity',
      tags: ['Slack', 'チーム', 'AIボット'],
      level: 'advanced',
      viewCount: 7230,
      uploadDate: '2024-05-22'
    },
    {
      id: 'p10',
      title: '【アーカイブ】リモートワーク×AI最適化セミナー',
      description: 'リモートワーク環境でのAI活用事例とチーム生産性向上のノウハウ。',
      duration: '72:40',
      thumbnail: '',
      instructor: '田中 リモート',
      type: 'archive',
      department: 'productivity',
      tags: ['リモートワーク', 'チーム', '生産性'],
      level: 'intermediate',
      viewCount: 6540,
      uploadDate: '2024-05-20'
    }
  ]

  return <DepartmentLayout department={department} videos={videos} />
}