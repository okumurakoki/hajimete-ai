import { ContentLayout } from '@/components/layout/Layout'
import { HelpCircle, Search, ChevronDown } from 'lucide-react'

export default function FAQPage() {
  const faqCategories = [
    {
      title: 'アカウント・登録',
      faqs: [
        {
          question: 'アカウントの作成方法を教えてください',
          answer: 'トップページの「新規登録」ボタンをクリックし、メールアドレスとパスワードを入力してください。メール認証を完了すると、すぐに学習を開始できます。'
        },
        {
          question: 'パスワードを忘れてしまいました',
          answer: 'ログイン画面の「パスワードを忘れた方」をクリックし、登録したメールアドレスを入力してください。パスワードリセットのメールが送信されます。'
        },
        {
          question: 'メールアドレスを変更したいです',
          answer: 'ダッシュボードの「設定」→「プロフィール」から、メールアドレスの変更が可能です。変更後は新しいメールアドレスで認証が必要です。'
        }
      ]
    },
    {
      title: '料金・プラン',
      faqs: [
        {
          question: '無料プランでどこまで利用できますか？',
          answer: '無料プランでは、AI基礎学部の全コンテンツと、月3回までのセミナー参加が可能です。また、コミュニティフォーラムへのアクセスも含まれています。'
        },
        {
          question: 'プランの変更はいつでもできますか？',
          answer: 'はい、いつでもプランの変更が可能です。アップグレードは即座に反映され、ダウングレードは次回請求サイクルから適用されます。'
        },
        {
          question: '解約方法を教えてください',
          answer: 'ダッシュボードの「設定」→「サブスクリプション」から「解約」を選択してください。解約後も請求期間終了まではサービスをご利用いただけます。'
        },
        {
          question: '領収書は発行できますか？',
          answer: '請求履歴から領収書のダウンロードが可能です。企業向けの請求書が必要な場合は、お問い合わせください。'
        }
      ]
    },
    {
      title: '学習・コンテンツ',
      faqs: [
        {
          question: 'どのコースから始めればよいですか？',
          answer: 'AI初心者の方は「AI基礎学部」から始めることをお勧めします。レベル診断テストもご用意しているので、ご自身のレベルに合ったコースを見つけられます。'
        },
        {
          question: 'コースの進捗は保存されますか？',
          answer: 'はい、学習進捗は自動的に保存されます。別のデバイスからログインしても、途中から続けて学習できます。'
        },
        {
          question: '修了証明書はもらえますか？',
          answer: 'プレミアムプラン以上で、コースを100%修了すると修了証明書が発行されます。証明書はPDFでダウンロードでき、LinkedInなどで共有も可能です。'
        },
        {
          question: 'オフラインでも学習できますか？',
          answer: '現在はオンライン学習のみですが、モバイルアプリ（開発中）ではオフライン機能を提供予定です。'
        }
      ]
    },
    {
      title: '技術的な問題',
      faqs: [
        {
          question: '動画が再生されません',
          answer: 'ブラウザのキャッシュをクリアしていただくか、別のブラウザでお試しください。それでも解決しない場合は、サポートまでご連絡ください。'
        },
        {
          question: '音声が聞こえません',
          answer: 'デバイスの音量設定とブラウザの音声設定をご確認ください。また、ヘッドフォンや外部スピーカーをお使いの場合は、接続状況もご確認ください。'
        },
        {
          question: 'ページの読み込みが遅いです',
          answer: 'インターネット接続をご確認ください。また、ブラウザの拡張機能が影響している場合があります。シークレットモードでお試しいただくか、サポートまでご連絡ください。'
        }
      ]
    },
    {
      title: 'コミュニティ・サポート',
      faqs: [
        {
          question: 'コミュニティフォーラムの使い方は？',
          answer: 'ダッシュボードの「コミュニティ」から参加できます。質問の投稿、他の学習者との交流、専門家からのアドバイスを受けることができます。'
        },
        {
          question: 'メンタリングサービスについて教えてください',
          answer: 'プレミアムプランでは、月1回30分のオンライン1on1メンタリングが含まれます。学習計画の相談やキャリアアドバイスを受けられます。'
        },
        {
          question: 'サポートの対応時間は？',
          answer: '平日9:00-18:00、土日祝10:00-17:00でサポートを提供しています。緊急時は24時間対応いたします。'
        }
      ]
    }
  ]

  return (
    <ContentLayout>
      <div className="text-center mb-12">
        <HelpCircle className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">よくある質問</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          はじめて.AIについてよくいただく質問をまとめました。お探しの回答が見つからない場合は、お気軽にお問い合わせください。
        </p>
      </div>

      {/* 検索バー */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="質問やキーワードで検索..."
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* FAQ セクション */}
      <div className="max-w-4xl mx-auto">
        {faqCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
              {category.title}
            </h2>
            <div className="space-y-4">
              {category.faqs.map((faq, faqIndex) => (
                <div key={faqIndex} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 pr-4">{faq.question}</h3>
                      <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
                    </summary>
                    <div className="px-6 pb-6">
                      <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* まだ解決しない場合 */}
      <div className="max-w-4xl mx-auto mt-16">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 text-center border border-blue-200 dark:border-blue-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">まだ解決しませんでしたか？</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            お探しの情報が見つからない場合は、以下の方法でサポートを受けることができます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              お問い合わせ
            </a>
            <a
              href="/help"
              className="inline-flex items-center px-6 py-3 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              ヘルプセンター
            </a>
            <a
              href="/community"
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              コミュニティで質問
            </a>
          </div>
        </div>
      </div>
    </ContentLayout>
  )
}

export const metadata = {
  title: 'よくある質問 - はじめて.AI',
  description: 'はじめて.AIについてよくいただく質問と回答をカテゴリ別にまとめました。アカウント、料金、学習方法、技術的な問題について詳しく解説しています。'
}