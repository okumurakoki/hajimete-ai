import { ContentLayout } from '@/components/layout/Layout'
import { Calendar, Clock, ArrowRight, Megaphone, Award, Users, TrendingUp } from 'lucide-react'

export default function NewsPage() {
  const newsCategories = [
    { id: 'all', label: 'すべて', count: 24 },
    { id: 'announcements', label: 'お知らせ', count: 8 },
    { id: 'updates', label: 'アップデート', count: 6 },
    { id: 'events', label: 'イベント', count: 5 },
    { id: 'partnerships', label: 'パートナーシップ', count: 3 },
    { id: 'awards', label: '受賞・認定', count: 2 }
  ]

  const pinnedNews = {
    id: 1,
    title: '年末年始休業のお知らせ（2024年12月29日〜2025年1月3日）',
    excerpt: '誠に勝手ながら、下記の期間を年末年始休業とさせていただきます。休業期間中のお問い合わせにつきましては、1月4日以降順次対応させていただきます。',
    date: '2024年12月28日',
    category: 'お知らせ',
    isPinned: true,
    isImportant: true
  }

  const newsList = [
    {
      id: 2,
      title: 'AIセミナー「2025年のAI活用戦略」開催決定（2025年1月15日）',
      excerpt: '2025年のビジネスにおけるAI活用戦略について、業界の第一人者をお招きして特別セミナーを開催いたします。参加費無料、オンライン配信も実施予定です。',
      date: '2024年12月25日',
      category: 'イベント',
      tags: ['セミナー', '無料', 'オンライン']
    },
    {
      id: 3,
      title: 'プラットフォーム大型アップデート v2.5.0 リリース',
      excerpt: '新機能「AI学習アシスタント」の追加、UIの大幅改善、パフォーマンス向上など、50以上の改善を含む大型アップデートをリリースしました。',
      date: '2024年12月22日',
      category: 'アップデート',
      tags: ['新機能', 'UI改善', 'パフォーマンス']
    },
    {
      id: 4,
      title: '東京大学大学院との産学連携プロジェクト開始',
      excerpt: 'AI教育の効果測定と最適化に関する共同研究プロジェクトを東京大学大学院情報理工学系研究科と開始いたします。期間は3年間を予定しています。',
      date: '2024年12月20日',
      category: 'パートナーシップ',
      tags: ['東京大学', '産学連携', '研究']
    },
    {
      id: 5,
      title: '「EdTech Japan Global Pitch 2024」でグランプリ受賞',
      excerpt: '日本最大級の教育テクノロジーコンテストにて、革新的なAI教育プラットフォームが評価され、グランプリを受賞いたしました。',
      date: '2024年12月18日',
      category: '受賞・認定',
      tags: ['グランプリ', 'EdTech', '受賞']
    },
    {
      id: 6,
      title: '受講者数10,000人突破記念キャンペーン開始',
      excerpt: 'おかげさまで受講者数が10,000人を突破いたしました。感謝の気持ちを込めて、全コース20%OFFの特別キャンペーンを実施いたします。',
      date: '2024年12月15日',
      category: 'お知らせ',
      tags: ['キャンペーン', '20%OFF', '記念']
    },
    {
      id: 7,
      title: 'モバイルアプリ iOS版 正式リリース',
      excerpt: 'ついにiOS版モバイルアプリが正式リリース！いつでもどこでもAI学習が可能になりました。App Storeより無料でダウンロードできます。',
      date: '2024年12月12日',
      category: 'アップデート',
      tags: ['iOS', 'モバイルアプリ', '無料']
    },
    {
      id: 8,
      title: '企業研修プログラム「AI-Ready Organization」提供開始',
      excerpt: '企業のAI導入を総合的に支援する新しい研修プログラムの提供を開始いたします。組織全体のAIリテラシー向上を目指します。',
      date: '2024年12月10日',
      category: 'お知らせ',
      tags: ['企業研修', 'B2B', 'AIリテラシー']
    },
    {
      id: 9,
      title: 'サーバーメンテナンス実施のお知らせ（12月8日 2:00-4:00）',
      excerpt: 'システムの安定性向上のため、下記日程にてサーバーメンテナンスを実施いたします。メンテナンス中はサービスをご利用いただけません。',
      date: '2024年12月06日',
      category: 'お知らせ',
      tags: ['メンテナンス', 'システム', '2時間']
    }
  ]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'お知らせ':
        return <Megaphone className="w-4 h-4" />
      case 'アップデート':
        return <TrendingUp className="w-4 h-4" />
      case 'イベント':
        return <Calendar className="w-4 h-4" />
      case 'パートナーシップ':
        return <Users className="w-4 h-4" />
      case '受賞・認定':
        return <Award className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'お知らせ':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
      case 'アップデート':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
      case 'イベント':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
      case 'パートナーシップ':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
      case '受賞・認定':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
    }
  }

  return (
    <ContentLayout>
      {/* ヘッダーセクション */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          ニュース
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          はじめて.AIの最新情報、アップデート、イベント情報をお届けします。
          重要なお知らせや新機能の情報をいち早くチェックしてください。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* サイドバー - カテゴリフィルター */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              カテゴリ
            </h3>
            <div className="space-y-2">
              {newsCategories.map((category) => (
                <button
                  key={category.id}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    category.id === 'all'
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="font-medium">{category.label}</span>
                  <span className="text-sm bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="lg:col-span-3">
          {/* 重要なお知らせ */}
          <div className="mb-8">
            <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-6 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Megaphone className="w-6 h-6 text-orange-500" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300 text-xs font-medium rounded-full">
                      重要
                    </span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full flex items-center gap-1">
                      {getCategoryIcon(pinnedNews.category)}
                      {pinnedNews.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {pinnedNews.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {pinnedNews.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {pinnedNews.date}
                    </div>
                    <button className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 font-medium text-sm">
                      詳細を見る →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ニュース一覧 */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">最新ニュース</h2>
            
            {newsList.map((news) => (
              <article
                key={news.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getCategoryColor(news.category)}`}>
                      {getCategoryIcon(news.category)}
                      {news.category}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {news.date}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  {news.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {news.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {news.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <button className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm">
                    続きを読む
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* ページネーション */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                前へ
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                2
              </button>
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                3
              </button>
              <span className="px-4 py-2 text-gray-500 dark:text-gray-400">...</span>
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                次へ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ニュースレター購読CTA */}
      <div className="mt-16 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">
          最新情報をお見逃しなく
        </h2>
        <p className="text-lg text-blue-100 mb-6">
          重要なお知らせや新機能情報をメールでお届けします
        </p>
        <div className="max-w-md mx-auto flex gap-3">
          <input
            type="email"
            placeholder="メールアドレス"
            className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-500"
          />
          <button className="px-6 py-2 bg-white text-blue-700 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            購読
          </button>
        </div>
      </div>
    </ContentLayout>
  )
}

export const metadata = {
  title: 'ニュース - はじめて.AI',
  description: 'はじめて.AIの最新情報、アップデート、イベント情報をお届け。重要なお知らせや新機能の情報をいち早くチェックしてください。'
}