'use client'

import { getDepartmentBySlug } from '@/lib/departments'
import DepartmentLayout from '@/components/DepartmentLayout'
import { VideoContent } from '@/lib/departments'

export const dynamic = 'force-dynamic'

export default function DataSciencePage() {
  const department = getDepartmentBySlug('data-science')!

  const videos: VideoContent[] = [
    {
      id: 'ds1',
      title: 'Python×AI入門 - データ分析の第一歩',
      description: 'PythonとAIライブラリを使った基本的なデータ分析手法を実践的に学びます。',
      duration: '56:30',
      thumbnail: '',
      instructor: '博士 データ',
      type: 'recorded',
      department: 'data-science',
      tags: ['Python', 'データ分析', 'pandas'],
      level: 'beginner',
      viewCount: 12450,
      uploadDate: '2024-06-15',
      isNew: true,
      isPremium: true
    },
    {
      id: 'ds2',
      title: '機械学習アルゴリズム完全ガイド',
      description: '回帰、分類、クラスタリングなど主要な機械学習アルゴリズムを体系的に解説。',
      duration: '78:20',
      thumbnail: '',
      instructor: '教授 ML',
      type: 'recorded',
      department: 'data-science',
      tags: ['機械学習', 'アルゴリズム', 'scikit-learn'],
      level: 'intermediate',
      viewCount: 8960,
      uploadDate: '2024-06-10',
      isPremium: true,
      isPopular: true
    },
    {
      id: 'ds3',
      title: '【プレミアムライブ】深層学習 実装ハンズオン',
      description: 'TensorFlowを使った深層学習モデルの構築を実際にコーディングしながら学ぶ。',
      duration: '120:00',
      thumbnail: '',
      instructor: '博士 ディープ',
      type: 'live',
      department: 'data-science',
      tags: ['深層学習', 'TensorFlow', 'ハンズオン'],
      level: 'advanced',
      viewCount: 0,
      uploadDate: '2024-06-18',
      isPremium: true
    },
    {
      id: 'ds4',
      title: 'データ可視化マスタークラス - Matplotlib & Seaborn',
      description: '効果的なデータ可視化のテクニックとベストプラクティス。',
      duration: '45:15',
      thumbnail: '',
      instructor: '先生 ビジュアル',
      type: 'recorded',
      department: 'data-science',
      tags: ['可視化', 'Matplotlib', 'Seaborn'],
      level: 'intermediate',
      viewCount: 7830,
      uploadDate: '2024-06-08',
      isPremium: true
    },
    {
      id: 'ds5',
      title: 'ビッグデータ処理入門 - Spark & Hadoop',
      description: '大規模データセットの処理技術とクラウド環境での実装方法。',
      duration: '62:40',
      thumbnail: '',
      instructor: '専門家 ビッグデータ',
      type: 'recorded',
      department: 'data-science',
      tags: ['ビッグデータ', 'Spark', 'Hadoop'],
      level: 'advanced',
      viewCount: 5240,
      uploadDate: '2024-06-05',
      isPremium: true
    },
    {
      id: 'ds6',
      title: 'A/Bテスト設計と統計的分析',
      description: '科学的なA/Bテストの設計から結果の統計的解釈まで完全解説。',
      duration: '52:30',
      thumbnail: '',
      instructor: '博士 統計',
      type: 'recorded',
      department: 'data-science',
      tags: ['A/Bテスト', '統計', '仮説検定'],
      level: 'intermediate',
      viewCount: 6970,
      uploadDate: '2024-06-01',
      isPremium: true
    },
    {
      id: 'ds7',
      title: 'SQL for データサイエンティスト',
      description: 'データ分析に特化したSQL技術とパフォーマンス最適化。',
      duration: '48:45',
      thumbnail: '',
      instructor: '先生 データベース',
      type: 'recorded',
      department: 'data-science',
      tags: ['SQL', 'データベース', '最適化'],
      level: 'intermediate',
      viewCount: 9240,
      uploadDate: '2024-05-28',
      isPremium: true
    },
    {
      id: 'ds8',
      title: '自然言語処理入門 - BERT & GPTの活用',
      description: '最新のNLPモデルを使ったテキスト分析とアプリケーション開発。',
      duration: '67:20',
      thumbnail: '',
      instructor: '博士 NLP',
      type: 'recorded',
      department: 'data-science',
      tags: ['NLP', 'BERT', 'GPT'],
      level: 'advanced',
      viewCount: 4560,
      uploadDate: '2024-05-25',
      isPremium: true
    }
  ]

  return <DepartmentLayout department={department} videos={videos} />
}