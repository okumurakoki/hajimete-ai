'use client'

import { getDepartmentBySlug } from '@/lib/departments'
import DepartmentLayout from '@/components/DepartmentLayout'
import { VideoContent } from '@/lib/departments'

export const dynamic = 'force-dynamic'

export default function PracticalApplicationPage() {
  const department = getDepartmentBySlug('practical-application')!

  const videos: VideoContent[] = [
    {
      id: 'pa-1',
      title: '企業でのChatGPT導入実例 - 営業チーム編',
      description: '実際の企業の営業チームがChatGPTを導入して売上を30%向上させた具体的な事例とノウハウ。',
      duration: '52:30',
      thumbnail: '',
      instructor: '高橋 営業マネージャー',
      type: 'recorded',
      department: 'practical-application',
      tags: ['企業導入', '営業', '売上向上'],
      level: 'intermediate',
      viewCount: 18420,
      uploadDate: '2024-06-15',
      isNew: true,
      isPopular: true
    },
    {
      id: 'pa-2', 
      title: 'カスタマーサポートAI化プロジェクト完全解説',
      description: '中堅企業がカスタマーサポートをAI化し、対応時間を70%短縮した実装方法を詳しく解説。',
      duration: '48:15',
      thumbnail: '',
      instructor: '田村 ITコンサルタント',
      type: 'recorded',
      department: 'practical-application',
      tags: ['カスタマーサポート', 'AI化', '効率化'],
      level: 'advanced',
      viewCount: 12750,
      uploadDate: '2024-06-12',
      isNew: true
    },
    {
      id: 'pa-3',
      title: '【ライブ】製造業でのAI活用事例研究会',
      description: '製造業各社のAI導入事例を共有し、業界特有の課題解決方法をディスカッション。',
      duration: '90:00',
      thumbnail: '',
      instructor: '製造業AI研究会',
      type: 'live',
      department: 'practical-application',
      tags: ['製造業', 'ライブ', '事例研究'],
      level: 'intermediate',
      viewCount: 0,
      uploadDate: '2024-06-20'
    },
    {
      id: 'pa-4',
      title: 'スタートアップのAI活用戦略 - 限られたリソースでの成功法',
      description: '少数精鋭のスタートアップがAIを活用して大企業に対抗する戦略と実装事例。',
      duration: '42:45',
      thumbnail: '',
      instructor: '青木 スタートアップCTO',
      type: 'recorded',
      department: 'practical-application',
      tags: ['スタートアップ', '戦略', 'リソース最適化'],
      level: 'intermediate',
      viewCount: 9230,
      uploadDate: '2024-06-10'
    },
    {
      id: 'pa-5',
      title: 'EC事業者のパーソナライゼーション実装',
      description: 'AIを活用したレコメンデーションエンジンでコンバージョン率を3倍にした実装手法。',
      duration: '55:10',
      thumbnail: '',
      instructor: '佐々木 ECコンサルタント',
      type: 'recorded',
      department: 'practical-application',
      tags: ['EC', 'パーソナライゼーション', 'コンバージョン'],
      level: 'advanced',
      viewCount: 15340,
      uploadDate: '2024-06-08',
      isPopular: true
    },
    {
      id: 'pa-6',
      title: '医療機関でのAI診断支援導入記',
      description: '地方病院がAI診断支援システムを導入し、診断精度と効率を向上させた実例。',
      duration: '38:20',
      thumbnail: '',
      instructor: '山本 医療AI専門医',
      type: 'recorded',
      department: 'practical-application',
      tags: ['医療', '診断支援', '導入事例'],
      level: 'advanced',
      viewCount: 7870,
      uploadDate: '2024-06-05'
    },
    {
      id: 'pa-7',
      title: '金融業界のリスク管理AI - 実装とコンプライアンス',
      description: '厳格な規制下でのAI導入における法的要件とリスク管理の実践的アプローチ。',
      duration: '61:35',
      thumbnail: '',
      instructor: '伊藤 金融AIコンサルタント',
      type: 'recorded',
      department: 'practical-application',
      tags: ['金融', 'リスク管理', 'コンプライアンス'],
      level: 'advanced',
      viewCount: 6650,
      uploadDate: '2024-06-01'
    },
    {
      id: 'pa-8',
      title: '小売チェーンの在庫最適化AI導入プロジェクト',
      description: '全国展開する小売チェーンが在庫管理AIで廃棄ロスを半減させた全工程を公開。',
      duration: '49:15',
      thumbnail: '',
      instructor: '鈴木 小売業コンサルタント',
      type: 'recorded',
      department: 'practical-application',
      tags: ['小売', '在庫最適化', 'ロス削減'],
      level: 'intermediate',
      viewCount: 11420,
      uploadDate: '2024-05-28',
      isPopular: true
    },
    {
      id: 'pa-9',
      title: '【アーカイブ】AI導入失敗事例から学ぶ成功の秘訣',
      description: '実際のAI導入失敗事例を分析し、成功するためのポイントと回避すべき落とし穴を解説。',
      duration: '57:45',
      thumbnail: '',
      instructor: '田中 AI導入コンサルタント',
      type: 'archive',
      department: 'practical-application',
      tags: ['失敗事例', '教訓', '成功要因'],
      level: 'intermediate',
      viewCount: 8920,
      uploadDate: '2024-05-25'
    },
    {
      id: 'pa-10',
      title: 'AIプロジェクトのROI測定と経営報告',
      description: 'AI投資の効果測定方法と経営陣への報告資料作成のベストプラクティス。',
      duration: '44:30',
      thumbnail: '',
      instructor: '中村 経営コンサルタント',
      type: 'recorded',
      department: 'practical-application',
      tags: ['ROI', '効果測定', '経営報告'],
      level: 'advanced',
      viewCount: 5230,
      uploadDate: '2024-05-22'
    }
  ]

  return <DepartmentLayout department={department} videos={videos} />
}