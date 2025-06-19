'use client'

import { getDepartmentBySlug } from '@/lib/departments'
import DepartmentLayout from '@/components/DepartmentLayout'
import { VideoContent } from '@/lib/departments'

export const dynamic = 'force-dynamic'

export default function CatchupPage() {
  const department = getDepartmentBySlug('catchup')!

  const videos: VideoContent[] = [
    {
      id: 'cu-1',
      title: 'OpenAI GPT-4o最新機能完全解説【2024年6月版】',
      description: 'GPT-4oの最新アップデートと新機能を詳しく解説。実際の使用例とベンチマーク結果も紹介。',
      duration: '58:30',
      thumbnail: '',
      instructor: '最新AI研究チーム',
      type: 'recorded',
      department: 'catchup',
      tags: ['GPT-4o', '最新機能', 'OpenAI'],
      level: 'intermediate',
      viewCount: 25420,
      uploadDate: '2024-06-18',
      isNew: true,
      isPopular: true,
      isPremium: true
    },
    {
      id: 'cu-2', 
      title: 'Claude 3.5 Sonnet vs GPT-4o 徹底比較',
      description: '最新のClaude 3.5 SonnetとGPT-4oを様々なタスクで比較検証。どちらを選ぶべきかの判断基準も解説。',
      duration: '45:15',
      thumbnail: '',
      instructor: 'AI比較研究所',
      type: 'recorded',
      department: 'catchup',
      tags: ['Claude 3.5', 'GPT-4o', '比較検証'],
      level: 'advanced',
      viewCount: 18750,
      uploadDate: '2024-06-15',
      isNew: true,
      isPremium: true
    },
    {
      id: 'cu-3',
      title: '【ライブ】Google I/O 2024 AI発表内容速報解説',
      description: 'Google I/O 2024で発表されたAI関連の最新情報をリアルタイムで解説・議論。',
      duration: '120:00',
      thumbnail: '',
      instructor: 'Google AI ウォッチャー',
      type: 'live',
      department: 'catchup',
      tags: ['Google I/O', 'ライブ', '速報解説'],
      level: 'intermediate',
      viewCount: 0,
      uploadDate: '2024-06-19',
      isPremium: true
    },
    {
      id: 'cu-4',
      title: 'Meta Llama 3詳細分析 - オープンソースAIの新時代',
      description: 'Meta社が公開したLlama 3の技術詳細と、オープンソースAI市場への影響を分析。',
      duration: '52:45',
      thumbnail: '',
      instructor: 'オープンソースAI研究者',
      type: 'recorded',
      department: 'catchup',
      tags: ['Llama 3', 'Meta', 'オープンソース'],
      level: 'advanced',
      viewCount: 12230,
      uploadDate: '2024-06-12',
      isPremium: true
    },
    {
      id: 'cu-5',
      title: 'Anthropic Constitutional AI最新研究成果',
      description: 'AnthropicのConstitutional AIに関する最新の研究論文と実装例を詳しく解説。',
      duration: '41:10',
      thumbnail: '',
      instructor: 'AI安全性研究チーム',
      type: 'recorded',
      department: 'catchup',
      tags: ['Constitutional AI', 'Anthropic', '研究論文'],
      level: 'advanced',
      viewCount: 8340,
      uploadDate: '2024-06-10',
      isPremium: true
    },
    {
      id: 'cu-6',
      title: 'AGI開発競争の現状 - 2024年中間レポート',
      description: '主要企業のAGI開発状況と最新の研究動向を総合的に分析したレポート。',
      duration: '67:20',
      thumbnail: '',
      instructor: 'AGI研究アナリスト',
      type: 'recorded',
      department: 'catchup',
      tags: ['AGI', '開発競争', '業界分析'],
      level: 'advanced',
      viewCount: 15870,
      uploadDate: '2024-06-08',
      isPopular: true,
      isPremium: true
    },
    {
      id: 'cu-7',
      title: 'AI規制最新動向 - EU AI Act施行の影響',
      description: 'EU AI Actの施行が世界のAI開発に与える影響と、企業が取るべき対応策を解説。',
      duration: '39:35',
      thumbnail: '',
      instructor: 'AI法律専門家',
      type: 'recorded',
      department: 'catchup',
      tags: ['AI規制', 'EU AI Act', '法律'],
      level: 'intermediate',
      viewCount: 7650,
      uploadDate: '2024-06-05',
      isPremium: true
    },
    {
      id: 'cu-8',
      title: 'Stability AI最新モデル解説 - SDXL Turboの実力',
      description: 'Stability AIの最新画像生成モデルSDXL Turboの性能評価と実用性を検証。',
      duration: '33:15',
      thumbnail: '',
      instructor: '画像生成AI専門家',
      type: 'recorded',
      department: 'catchup',
      tags: ['Stability AI', 'SDXL Turbo', '画像生成'],
      level: 'intermediate',
      viewCount: 11420,
      uploadDate: '2024-06-01',
      isPremium: true
    },
    {
      id: 'cu-9',
      title: '音声AIの最前線 - ElevenLabs vs OpenAI TTS',
      description: '最新の音声合成技術を比較し、ビジネス活用の可能性を探る。',
      duration: '28:45',
      thumbnail: '',
      instructor: '音声AI研究者',
      type: 'recorded',
      department: 'catchup',
      tags: ['音声AI', 'ElevenLabs', 'TTS'],
      level: 'intermediate',
      viewCount: 9920,
      uploadDate: '2024-05-29',
      isPremium: true
    },
    {
      id: 'cu-10',
      title: '【月例レポート】AI業界投資動向 2024年5月',
      description: 'AI関連企業への投資状況と市場動向を月次でレポート。注目のスタートアップも紹介。',
      duration: '35:30',
      thumbnail: '',
      instructor: 'AIビジネスアナリスト',
      type: 'recorded',
      department: 'catchup',
      tags: ['投資動向', '市場分析', 'スタートアップ'],
      level: 'intermediate',
      viewCount: 6420,
      uploadDate: '2024-05-31',
      isPremium: true
    },
    {
      id: 'cu-11',
      title: 'コーディングAI最新比較 - Cursor vs GitHub Copilot vs Claude',
      description: '開発者向けAIツールの最新比較。実際のコーディングタスクでの性能を検証。',
      duration: '49:20',
      thumbnail: '',
      instructor: 'AI開発ツール専門家',
      type: 'recorded',
      department: 'catchup',
      tags: ['コーディングAI', 'Cursor', 'GitHub Copilot'],
      level: 'advanced',
      viewCount: 13750,
      uploadDate: '2024-05-27',
      isPopular: true,
      isPremium: true
    },
    {
      id: 'cu-12',
      title: '【独占インタビュー】AI研究者が語る次世代AI技術',
      description: '世界的AI研究者への独占インタビュー。次世代AI技術の展望と課題を深く掘り下げ。',
      duration: '72:15',
      thumbnail: '',
      instructor: 'AI研究者（匿名）',
      type: 'recorded',
      department: 'catchup',
      tags: ['独占インタビュー', '次世代AI', '展望'],
      level: 'advanced',
      viewCount: 8920,
      uploadDate: '2024-05-24',
      isPremium: true
    }
  ]

  return <DepartmentLayout department={department} videos={videos} />
}