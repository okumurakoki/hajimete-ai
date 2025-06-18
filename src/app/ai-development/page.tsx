'use client'

import { getDepartmentBySlug } from '@/lib/departments'
import DepartmentLayout from '@/components/DepartmentLayout'
import { VideoContent } from '@/lib/departments'

export default function AIDevelopmentPage() {
  const department = getDepartmentBySlug('ai-development')!

  const videos: VideoContent[] = [
    {
      id: 'ad1',
      title: 'ChatGPT API完全活用ガイド - アプリ開発入門',
      description: 'OpenAI APIを使ったWebアプリケーション開発の基礎から応用まで。',
      duration: '64:30',
      thumbnail: '',
      instructor: 'エンジニア API',
      type: 'recorded',
      department: 'ai-development',
      tags: ['ChatGPT API', 'Web開発', 'アプリ'],
      level: 'intermediate',
      viewCount: 8450,
      uploadDate: '2024-06-15',
      isNew: true,
      isPremium: true
    },
    {
      id: 'ad2',
      title: 'LangChain実践 - AIアプリケーション開発フレームワーク',
      description: 'LangChainを使った複雑なAIアプリケーションの構築手法。',
      duration: '72:20',
      thumbnail: '',
      instructor: '開発者 チェーン',
      type: 'recorded',
      department: 'ai-development',
      tags: ['LangChain', 'フレームワーク', 'Python'],
      level: 'advanced',
      viewCount: 6240,
      uploadDate: '2024-06-12',
      isPremium: true,
      isPopular: true
    },
    {
      id: 'ad3',
      title: 'RAG (Retrieval-Augmented Generation) システム構築',
      description: '独自データを活用したRAGシステムの設計と実装方法。',
      duration: '58:45',
      thumbnail: '',
      instructor: '博士 RAG',
      type: 'recorded',
      department: 'ai-development',
      tags: ['RAG', 'ベクトルDB', '検索'],
      level: 'advanced',
      viewCount: 4980,
      uploadDate: '2024-06-10',
      isPremium: true
    },
    {
      id: 'ad4',
      title: '【プレミアムライブ】AI開発Q&A - 技術的な質問にお答え',
      description: 'AI開発に関する技術的な疑問を専門家がリアルタイムで解決。',
      duration: '90:00',
      thumbnail: '',
      instructor: 'CTO テック',
      type: 'live',
      department: 'ai-development',
      tags: ['ライブ', 'Q&A', '開発'],
      level: 'intermediate',
      viewCount: 0,
      uploadDate: '2024-06-18',
      isPremium: true
    },
    {
      id: 'ad5',
      title: 'FastAPI + OpenAI でマイクロサービス構築',
      description: 'FastAPIを使ったAI機能を持つマイクロサービスの開発手法。',
      duration: '55:15',
      thumbnail: '',
      instructor: 'アーキテクト API',
      type: 'recorded',
      department: 'ai-development',
      tags: ['FastAPI', 'マイクロサービス', 'Python'],
      level: 'intermediate',
      viewCount: 7230,
      uploadDate: '2024-06-08',
      isPremium: true
    }
  ]

  return <DepartmentLayout department={department} videos={videos} />
}