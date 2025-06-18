'use client'

import { getDepartmentBySlug } from '@/lib/departments'
import DepartmentLayout from '@/components/DepartmentLayout'
import { VideoContent } from '@/lib/departments'

export default function AIBasicsPage() {
  const department = getDepartmentBySlug('ai-basics')!

  const videos: VideoContent[] = [
    {
      id: '1',
      title: 'ChatGPT完全入門 - 基本的な使い方から応用まで',
      description: 'ChatGPTの基本機能から効果的なプロンプト作成まで、初心者向けに丁寧に解説します。',
      duration: '45:30',
      thumbnail: '',
      instructor: '田中 AI太郎',
      type: 'recorded',
      department: 'ai-basics',
      tags: ['ChatGPT', '基礎', 'プロンプト'],
      level: 'beginner',
      viewCount: 15420,
      uploadDate: '2024-06-15',
      isNew: true,
      isPopular: true
    },
    {
      id: '2', 
      title: 'Claude入門 - Anthropic製AIアシスタントの活用法',
      description: 'Claudeの特徴と使い方、ChatGPTとの使い分けについて学びます。',
      duration: '38:15',
      thumbnail: '',
      instructor: '佐藤 みらい',
      type: 'recorded',
      department: 'ai-basics',
      tags: ['Claude', 'Anthropic', '比較'],
      level: 'beginner',
      viewCount: 8750,
      uploadDate: '2024-06-10',
      isNew: true
    },
    {
      id: '3',
      title: '【ライブ配信】AI基礎Q&A - 視聴者の質問に答えます',
      description: 'AI初心者の疑問に専門家がリアルタイムでお答えするライブ配信です。',
      duration: '60:00',
      thumbnail: '',
      instructor: '田中 AI太郎',
      type: 'live',
      department: 'ai-basics',
      tags: ['ライブ', 'Q&A', '質問'],
      level: 'beginner',
      viewCount: 0,
      uploadDate: '2024-06-18'
    },
    {
      id: '4',
      title: 'AI倫理とセキュリティ - 安全にAIを使うために',
      description: 'AIを使用する際の注意点、プライバシー保護、倫理的な使い方について学びます。',
      duration: '32:45',
      thumbnail: '',
      instructor: '山田 セキュリティ',
      type: 'recorded',
      department: 'ai-basics',
      tags: ['倫理', 'セキュリティ', 'プライバシー'],
      level: 'intermediate',
      viewCount: 6230,
      uploadDate: '2024-06-08'
    },
    {
      id: '5',
      title: 'プロンプトエンジニアリング基礎',
      description: '効果的なプロンプトの書き方、AIから的確な回答を得るためのテクニック。',
      duration: '52:10',
      thumbnail: '',
      instructor: '田中 AI太郎',
      type: 'recorded',
      department: 'ai-basics',
      tags: ['プロンプト', 'エンジニアリング', 'テクニック'],
      level: 'intermediate',
      viewCount: 12340,
      uploadDate: '2024-06-05',
      isPopular: true
    },
    {
      id: '6',
      title: 'AI画像生成入門 - Midjourney & DALL-E活用法',
      description: '最新のAI画像生成ツールの使い方と、クリエイティブな活用事例を紹介。',
      duration: '41:20',
      thumbnail: '',
      instructor: '鈴木 クリエイター',
      type: 'recorded',
      department: 'ai-basics',
      tags: ['画像生成', 'Midjourney', 'DALL-E'],
      level: 'beginner',
      viewCount: 9870,
      uploadDate: '2024-06-01'
    },
    {
      id: '7',
      title: 'AIライティング実践 - 文章作成の効率化',
      description: 'AIを使った文章作成、校正、翻訳の実践的なテクニックを学びます。',
      duration: '47:35',
      thumbnail: '',
      instructor: '佐藤 みらい',
      type: 'recorded',
      department: 'ai-basics',
      tags: ['ライティング', '文章作成', '校正'],
      level: 'intermediate',
      viewCount: 7650,
      uploadDate: '2024-05-28'
    },
    {
      id: '8',
      title: '【アーカイブ】AI業界の最新動向 2024年版',
      description: '2024年前半のAI業界の主要な出来事と今後の展望について解説。',
      duration: '65:15',
      thumbnail: '',
      instructor: '田中 AI太郎',
      type: 'archive',
      department: 'ai-basics',
      tags: ['業界動向', '2024年', '展望'],
      level: 'intermediate',
      viewCount: 5420,
      uploadDate: '2024-05-25'
    }
  ]

  return <DepartmentLayout department={department} videos={videos} />
}