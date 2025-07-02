import { ContentLayout } from '@/components/layout/Layout'
import { MapPin, Clock, Users, DollarSign, ArrowRight, Heart, Lightbulb, Target, Globe, CheckCircle } from 'lucide-react'

export default function CareersPage() {
  const benefits = [
    {
      icon: Heart,
      title: 'ワークライフバランス',
      description: 'フレックスタイム制、リモートワーク可、有給取得率90%以上'
    },
    {
      icon: Lightbulb,
      title: '学習支援',
      description: '書籍購入費補助、外部セミナー参加費全額支給、社内勉強会'
    },
    {
      icon: Target,
      title: '成長機会',
      description: '新技術への挑戦、社内外プロジェクト参加、メンター制度'
    },
    {
      icon: Globe,
      title: '多様性重視',
      description: 'ダイバーシティ&インクルージョン、年齢・性別・国籍不問'
    }
  ]

  const jobOpenings = [
    {
      id: 1,
      title: 'AIエンジニア（機械学習・深層学習）',
      department: 'Engineering',
      type: '正社員',
      location: '名古屋本社 / リモート',
      salary: '年収 600万円〜1000万円',
      description: 'AI教育プラットフォームの機械学習システムの設計・開発・運用を担当。最新のAI技術を活用した学習体験の向上に取り組みます。',
      requirements: [
        'Python、TensorFlow/PyTorchでの開発経験（2年以上）',
        '機械学習・深層学習の基礎知識',
        'クラウド環境（AWS/GCP）での開発経験',
        'チームでの開発経験'
      ],
      preferred: [
        '自然言語処理、コンピュータビジョンの経験',
        'MLOpsの知識・経験',
        'AI教育・EdTechへの興味',
        '英語でのコミュニケーション能力'
      ]
    },
    {
      id: 2,
      title: 'フロントエンドエンジニア（React/Next.js）',
      department: 'Engineering',
      type: '正社員',
      location: '名古屋本社 / リモート',
      salary: '年収 500万円〜800万円',
      description: '学習者にとって最高のUI/UXを提供するWebアプリケーションの開発を担当。モダンな技術スタックで直感的な学習体験を創造します。',
      requirements: [
        'React、Next.jsでの開発経験（2年以上）',
        'TypeScript、JavaScript ES6+の知識',
        'HTML5、CSS3、レスポンシブデザイン',
        'Git、GitHub/GitLabでのチーム開発経験'
      ],
      preferred: [
        'Tailwind CSS、styled-componentsの経験',
        'アニメーション、マイクロインタラクションの実装経験',
        'Webアクセシビリティの知識',
        'パフォーマンス最適化の経験'
      ]
    },
    {
      id: 3,
      title: 'プロダクトマネージャー',
      department: 'Product',
      type: '正社員',
      location: '名古屋本社',
      salary: '年収 700万円〜1200万円',
      description: 'AI教育プラットフォームの戦略策定から機能開発まで、プロダクトの成長を牽引するポジション。ユーザーのニーズを深く理解し、価値のある機能を企画・実現します。',
      requirements: [
        'プロダクト開発・管理経験（3年以上）',
        'データ分析、ユーザーリサーチの経験',
        'エンジニア、デザイナーとの協業経験',
        'ビジネス側とのコミュニケーション能力'
      ],
      preferred: [
        'EdTech、AI分野での経験',
        'スタートアップでの経験',
        'アジャイル開発の知識',
        'グロースハック、マーケティングの知識'
      ]
    },
    {
      id: 4,
      title: 'カスタマーサクセス',
      department: 'CS',
      type: '正社員',
      location: '名古屋本社 / 一部リモート',
      salary: '年収 400万円〜600万円',
      description: '企業顧客の成功を支援し、継続的な価値提供を実現するポジション。顧客との関係構築から活用促進、満足度向上まで幅広く担当します。',
      requirements: [
        'カスタマーサポート、営業経験（2年以上）',
        '顧客折衝、プレゼンテーション能力',
        'Excel、PowerPointでの資料作成スキル',
        '問題解決能力、論理的思考力'
      ],
      preferred: [
        'B2B SaaSでの経験',
        'AI、IT分野の知識',
        '企業研修、人材育成の経験',
        'チームマネジメント経験'
      ]
    },
    {
      id: 5,
      title: 'AIコンテンツクリエイター',
      department: 'Content',
      type: '契約社員',
      location: 'リモート中心',
      salary: '時給 3000円〜5000円',
      description: 'AI技術の学習コンテンツ（動画、記事、演習問題）の企画・制作を担当。最新技術をわかりやすく伝える教材作りに携わります。',
      requirements: [
        'AI、機械学習の実務経験（1年以上）',
        '技術記事執筆、資料作成の経験',
        '動画コンテンツ制作の基礎知識',
        '教育への情熱'
      ],
      preferred: [
        '研修講師、セミナー講演の経験',
        'YouTube、Udemy等での配信経験',
        'インストラクショナルデザインの知識',
        '複数の技術領域への知識'
      ]
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case '正社員':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
      case '契約社員':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
      case 'インターン':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
    }
  }

  return (
    <ContentLayout>
      {/* ヒーローセクション */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          採用情報
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          AI技術で教育の未来を創造する、私たちのチームに参加しませんか？
          共に学び、成長し、社会にインパクトを与える仕事を一緒にしましょう。
        </p>
      </div>

      {/* ミッション・ビジョン */}
      <div className="mb-16">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 md:p-12 text-center border border-blue-100 dark:border-blue-800">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            私たちと一緒に働きませんか？
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
            はじめて.AIは、AI技術の民主化を通じて、すべての人が学習し成長できる社会の実現を目指しています。
            技術力だけでなく、教育への情熱と社会貢献への意欲を持った仲間を求めています。
          </p>
        </div>
      </div>

      {/* 働く環境・福利厚生 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
          働く環境・福利厚生
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 募集職種 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
          募集職種
        </h2>
        <div className="space-y-8">
          {jobOpenings.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {job.title}
                      </h3>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(job.type)}`}>
                        {job.type}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {job.department}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">必須要件</h4>
                    <ul className="space-y-2">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">歓迎要件</h4>
                    <ul className="space-y-2">
                      {job.preferred.map((pref, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="w-4 h-4 rounded-full border-2 border-blue-300 dark:border-blue-600 mt-0.5 flex-shrink-0"></div>
                          {pref}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    応募する
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 選考プロセス */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
          選考プロセス
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: 1, title: '書類選考', duration: '1週間', description: '履歴書・職務経歴書の審査' },
              { step: 2, title: '1次面接', duration: '1時間', description: 'オンライン面接（人事・現場担当者）' },
              { step: 3, title: '技術面接', duration: '1.5時間', description: '技術力・実務能力の確認' },
              { step: 4, title: '最終面接', duration: '1時間', description: '経営陣との面接' },
              { step: 5, title: '内定通知', duration: '3日以内', description: '条件面談・入社準備' }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {process.step}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{process.title}</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">{process.duration}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{process.description}</p>
                {index < 4 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gray-300 dark:bg-gray-600 transform translate-x-3"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 会社データ */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
          会社データ
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">125名</div>
              <div className="text-gray-600 dark:text-gray-400">従業員数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">28歳</div>
              <div className="text-gray-600 dark:text-gray-400">平均年齢</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">92%</div>
              <div className="text-gray-600 dark:text-gray-400">有給取得率</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">98%</div>
              <div className="text-gray-600 dark:text-gray-400">社員満足度</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">
          一緒に未来を創造しませんか？
        </h2>
        <p className="text-xl mb-8 text-blue-100">
          AI技術で教育を変革し、社会にインパクトを与える仕事に挑戦しましょう
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            カジュアル面談を申し込む
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
          <a
            href="mailto:recruit@oku-ai.co.jp"
            className="inline-flex items-center px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            直接応募する
          </a>
        </div>
      </div>
    </ContentLayout>
  )
}

export const metadata = {
  title: '採用情報 - はじめて.AI',
  description: 'AI技術で教育の未来を創造する仲間を募集中。エンジニア、プロダクトマネージャー、カスタマーサクセスなど様々なポジションで一緒に働きませんか？'
}