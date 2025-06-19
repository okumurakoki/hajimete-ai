'use client'

import { getDepartmentBySlug } from '@/lib/departments'
import DepartmentLayout from '@/components/DepartmentLayout'
import { VideoContent } from '@/lib/departments'

export const dynamic = 'force-dynamic'

export default function BusinessAIPage() {
  const department = getDepartmentBySlug('business-ai')!

  const videos: VideoContent[] = [
    {
      id: 'ba1',
      title: 'AI戦略策定ガイド - 経営者のためのAI導入論',
      description: '企業におけるAI導入戦略の立案から実行まで、経営視点で解説。',
      duration: '67:30',
      thumbnail: '',
      instructor: 'CEO ストラテジー',
      type: 'recorded',
      department: 'business-ai',
      tags: ['AI戦略', '経営', 'DX'],
      level: 'intermediate',
      viewCount: 9450,
      uploadDate: '2024-06-15',
      isNew: true,
      isPremium: true
    },
    {
      id: 'ba2',
      title: 'ROI最大化！AI投資の費用対効果分析',
      description: 'AI導入における投資対効果の測定方法と最適化戦略。',
      duration: '48:20',
      thumbnail: '',
      instructor: 'CFO ファイナンス',
      type: 'recorded',
      department: 'business-ai',
      tags: ['ROI', '投資', '費用対効果'],
      level: 'advanced',
      viewCount: 6240,
      uploadDate: '2024-06-12',
      isPremium: true,
      isPopular: true
    },
    {
      id: 'ba3',
      title: 'AI人材育成プログラム設計',
      description: '組織内でのAI人材育成計画と効果的な研修プログラムの作り方。',
      duration: '52:45',
      thumbnail: '',
      instructor: 'CHRO 人材',
      type: 'recorded',
      department: 'business-ai',
      tags: ['人材育成', '研修', '組織'],
      level: 'intermediate',
      viewCount: 7880,
      uploadDate: '2024-06-10',
      isPremium: true
    },
    {
      id: 'ba4',
      title: '【エグゼクティブライブ】AI経営戦略 最新トレンド',
      description: '経営層向けのAI活用最新動向と戦略的思考法をライブ配信。',
      duration: '75:00',
      thumbnail: '',
      instructor: 'コンサルタント エグゼク',
      type: 'live',
      department: 'business-ai',
      tags: ['ライブ', '経営戦略', 'トレンド'],
      level: 'advanced',
      viewCount: 0,
      uploadDate: '2024-06-18',
      isPremium: true
    },
    {
      id: 'ba5',
      title: 'AI時代の組織変革マネジメント',
      description: 'AI導入に伴う組織変革の課題と成功要因を実例で学ぶ。',
      duration: '59:15',
      thumbnail: '',
      instructor: 'コンサルタント 変革',
      type: 'recorded',
      department: 'business-ai',
      tags: ['組織変革', 'マネジメント', '変革'],
      level: 'advanced',
      viewCount: 5430,
      uploadDate: '2024-06-08',
      isPremium: true
    }
  ]

  return <DepartmentLayout department={department} videos={videos} />
}