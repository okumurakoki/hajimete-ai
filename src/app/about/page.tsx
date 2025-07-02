import { ContentLayout } from '@/components/layout/Layout'
import { Users, Target, Heart, Award, Lightbulb, Globe, Rocket, Shield } from 'lucide-react'

export default function AboutPage() {
  const team = [
    {
      name: '田中 太郎',
      role: 'CEO・創設者',
      image: '👨‍💼',
      description: 'AI研究歴15年。元Google AIエンジニア。教育の民主化を目指してはじめて.AIを設立。'
    },
    {
      name: '佐藤 花子',
      role: 'CTO',
      image: '👩‍💻',
      description: 'フルスタックエンジニア。教育テクノロジーのスペシャリスト。ユーザー体験の向上を担当。'
    },
    {
      name: '鈴木 一郎',
      role: 'コンテンツディレクター',
      image: '👨‍🏫',
      description: '教育業界20年のベテラン。実践的で分かりやすいコンテンツ作りのエキスパート。'
    },
    {
      name: '高橋 美咲',
      role: 'UXデザイナー',
      image: '👩‍🎨',
      description: 'ユーザー中心設計のスペシャリスト。直感的で使いやすいインターフェースを設計。'
    }
  ]

  const values = [
    {
      icon: Heart,
      title: '学習者中心',
      description: '一人ひとりの学習スタイルに合わせ、最適な学習体験を提供します。'
    },
    {
      icon: Lightbulb,
      title: '実践重視',
      description: '理論だけでなく、実際の業務で使える実践的なスキルの習得を重視します。'
    },
    {
      icon: Globe,
      title: 'アクセシビリティ',
      description: '誰もがAI技術を学べるよう、障壁を取り除いた学習環境を構築します。'
    },
    {
      icon: Rocket,
      title: '継続的成長',
      description: '最新技術の動向を反映し、常に進化し続ける学習コンテンツを提供します。'
    }
  ]

  const milestones = [
    { year: '2023年4月', event: 'はじめて.AI設立' },
    { year: '2023年6月', event: 'β版リリース、初期ユーザー100名突破' },
    { year: '2023年9月', event: '正式サービス開始、コース数50講座達成' },
    { year: '2023年12月', event: 'ユーザー数1,000名突破、プレミアムプラン開始' },
    { year: '2024年3月', event: 'ユーザー数5,000名突破、企業研修プログラム開始' },
    { year: '2024年6月', event: '現在：ユーザー数10,000名、コース数100講座達成' }
  ]

  return (
    <ContentLayout>
      {/* ヒーローセクション */}
      <div className="text-center mb-16">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-2xl">AI</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          私たちについて
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          はじめて.AIは、AIを学ぶすべての人のための包括的な教育プラットフォームです。<br />
          基礎から応用まで、段階的に学習できる環境を提供し、<br />
          誰もがAI時代に活躍できるスキルを身につけられるよう支援しています。
        </p>
      </div>

      {/* ミッション */}
      <div className="mb-16">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 md:p-12 text-center">
          <Target className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">私たちのミッション</h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
            AI技術の恩恵を誰もが享受できる社会を実現するため、
            質の高い教育コンテンツと学習環境を提供し、
            学習者一人ひとりのAIリテラシー向上を支援します。
            技術の民主化を通じて、より良い未来の創造に貢献することが私たちの使命です。
          </p>
        </div>
      </div>

      {/* 私たちの価値観 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">私たちの価値観</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{value.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* チーム紹介 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">チーム紹介</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-6xl mb-4">{member.image}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">{member.name}</h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">{member.role}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{member.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 沿革 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">沿革</h2>
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-32 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                  {milestone.year}
                </div>
                <div className="flex-1 ml-8">
                  <div className="relative">
                    <div className="absolute -left-6 top-2 w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                    <div className="absolute -left-5.5 top-5 w-0.5 h-16 bg-blue-200 dark:bg-blue-700 last:hidden"></div>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{milestone.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 数字で見るはじめて.AI */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">数字で見るはじめて.AI</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">10,000+</div>
            <div className="text-gray-600 dark:text-gray-400">登録ユーザー数</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">100+</div>
            <div className="text-gray-600 dark:text-gray-400">学習コース数</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">95%</div>
            <div className="text-gray-600 dark:text-gray-400">受講者満足度</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">500+</div>
            <div className="text-gray-600 dark:text-gray-400">企業導入実績</div>
          </div>
        </div>
      </div>

      {/* 認定・パートナーシップ */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">認定・パートナーシップ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 text-center">
            <Award className="w-12 h-12 text-yellow-500 dark:text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">ISO 27001認証</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">情報セキュリティマネジメントシステムの国際規格を取得</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 text-center">
            <Shield className="w-12 h-12 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">プライバシーマーク</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">個人情報保護の適切な取り組みを実施する事業者として認定</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 text-center">
            <Globe className="w-12 h-12 text-green-500 dark:text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">教育機関連携</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">全国50以上の大学・専門学校と教育コンテンツで連携</p>
          </div>
        </div>
      </div>

      {/* お問い合わせCTA */}
      <div className="bg-blue-700 dark:bg-blue-800 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">一緒に未来を創りませんか？</h2>
        <p className="text-xl text-blue-100 dark:text-blue-200 mb-8 max-w-2xl mx-auto">
          はじめて.AIでは、教育の未来を変える仲間を募集しています。<br />
          また、企業パートナーシップやコンテンツ協力についてもお気軽にご相談ください。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/careers"
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-100 transition-colors font-medium"
          >
            採用情報を見る
          </a>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 border border-white text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors font-medium"
          >
            お問い合わせ
          </a>
        </div>
      </div>
    </ContentLayout>
  )
}

export const metadata = {
  title: '私たちについて - はじめて.AI',
  description: 'はじめて.AIのミッション、価値観、チーム紹介、沿革について。AI教育の民主化を目指す私たちの取り組みをご紹介します。'
}