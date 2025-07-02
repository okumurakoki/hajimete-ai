import { ContentLayout } from '@/components/layout/Layout'
import { HelpCircle, Book, MessageCircle, Video, FileText, Search } from 'lucide-react'

export default function HelpPage() {
  const helpCategories = [
    {
      title: '利用方法',
      icon: Book,
      description: 'プラットフォームの基本的な使い方',
      articles: [
        '初回登録・ログイン方法',
        'ダッシュボードの見方',
        'コースの受講方法',
        'プロフィール設定'
      ]
    },
    {
      title: '技術的問題',
      icon: HelpCircle,
      description: 'トラブルシューティング',
      articles: [
        'ログインできない場合',
        '動画が再生されない',
        '音声が聞こえない',
        'モバイルアプリの問題'
      ]
    },
    {
      title: '支払い・プラン',
      icon: FileText,
      description: '料金とプランについて',
      articles: [
        'プラン変更方法',
        '支払い方法の変更',
        '領収書の発行',
        '解約・退会について'
      ]
    },
    {
      title: 'コンテンツ',
      icon: Video,
      description: '学習コンテンツについて',
      articles: [
        'コースの選び方',
        '進捗管理の方法',
        '修了証について',
        'オフライン学習'
      ]
    }
  ]

  const popularQuestions = [
    {
      question: 'プレミアムプランの特典は何ですか？',
      answer: 'プレミアムプランでは、全コースへのアクセス、1on1メンタリング、優先サポート、修了証明書の発行などの特典があります。'
    },
    {
      question: 'コースを修了するとどうなりますか？',
      answer: 'コース修了時には修了証明書が発行され、経験値（XP）が獲得できます。また、新しいコースがアンロックされることもあります。'
    },
    {
      question: 'モバイルアプリはありますか？',
      answer: '現在、iOSとAndroid向けのモバイルアプリを開発中です。リリース予定は2024年後半を予定しています。'
    },
    {
      question: '退会・解約はできますか？',
      answer: 'はい、アカウント設定からいつでも退会・解約が可能です。有料プランの場合、次回請求前に解約すれば追加料金は発生しません。'
    }
  ]

  return (
    <ContentLayout>
      <div className="text-center mb-12">
        <HelpCircle className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">ヘルプセンター</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          ご不明な点やお困りのことがございましたら、こちらからサポート情報をご確認ください
        </p>
      </div>

      {/* 検索バー */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="質問やキーワードで検索..."
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* ヘルプカテゴリ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {helpCategories.map((category, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 hover:shadow-md transition-shadow">
            <category.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{category.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{category.description}</p>
            <ul className="space-y-2">
              {category.articles.map((article, articleIndex) => (
                <li key={articleIndex}>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                    {article}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* よくある質問 */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">よくある質問</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {popularQuestions.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{faq.question}</h3>
                  <HelpCircle className="w-5 h-5 text-gray-400 dark:text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>

      {/* お問い合わせ */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 text-center border border-blue-200 dark:border-blue-800">
        <MessageCircle className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">まだ解決しませんでしたか？</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          お探しの情報が見つからない場合は、お気軽にお問い合わせください。<br />
          専門スタッフが丁寧にサポートいたします。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            お問い合わせ
          </a>
          <a
            href="/community"
            className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            コミュニティに質問
          </a>
        </div>
      </div>
    </ContentLayout>
  )
}

export const metadata = {
  title: 'ヘルプセンター - はじめて.AI',
  description: 'はじめて.AIの使い方、よくある質問、トラブルシューティングなどのサポート情報をご確認いただけます。'
}