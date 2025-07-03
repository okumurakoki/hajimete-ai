import { ContentLayout } from '@/components/layout/Layout'
import { Cookie, Settings, Shield, BarChart3, Eye, UserCheck, Mail } from 'lucide-react'

export default function CookiePage() {
  const cookieTypes = [
    {
      id: '1',
      title: '必須Cookie',
      icon: Shield,
      color: 'green',
      required: true,
      description: 'サービスの基本機能に不可欠なCookie',
      examples: [
        'ログイン状態の維持',
        'セッション管理',
        'セキュリティ設定',
        'CSRF保護'
      ],
      duration: 'セッション終了まで または 30日間',
      provider: 'はじめて.AI'
    },
    {
      id: '2',
      title: '機能Cookie',
      icon: Settings,
      color: 'blue',
      required: false,
      description: '利便性向上のための機能Cookie',
      examples: [
        'ダークモード設定',
        '言語設定',
        'フォント サイズ設定',
        'レイアウト設定'
      ],
      duration: '1年間',
      provider: 'はじめて.AI'
    },
    {
      id: '3',
      title: '分析Cookie',
      icon: BarChart3,
      color: 'purple',
      required: false,
      description: 'サービス改善のための分析Cookie',
      examples: [
        'ページビュー統計',
        'ユーザー行動分析',
        'エラー追跡',
        'パフォーマンス測定'
      ],
      duration: '2年間',
      provider: 'Google Analytics'
    },
    {
      id: '4',
      title: 'マーケティングCookie',
      icon: Eye,
      color: 'orange',
      required: false,
      description: '広告配信とパーソナライゼーション',
      examples: [
        '興味関心分析',
        '広告の最適化',
        'コンバージョン追跡',
        'リターゲティング'
      ],
      duration: '最大2年間',
      provider: '第三者広告プロバイダー'
    }
  ]

  const cookieDetails = [
    {
      name: '_ga',
      purpose: 'Google Analytics - ユーザー識別',
      type: '分析',
      duration: '2年',
      provider: 'Google'
    },
    {
      name: '_gid',
      purpose: 'Google Analytics - セッション識別',
      type: '分析',
      duration: '24時間',
      provider: 'Google'
    },
    {
      name: '__clerk_session',
      purpose: 'ユーザー認証・ログイン状態',
      type: '必須',
      duration: 'セッション',
      provider: 'Clerk'
    },
    {
      name: 'theme_preference',
      purpose: 'ダークモード設定の保存',
      type: '機能',
      duration: '1年',
      provider: 'はじめて.AI'
    },
    {
      name: '_stripe_mid',
      purpose: '決済処理・不正検知',
      type: '必須',
      duration: '1年',
      provider: 'Stripe'
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-800 dark:text-green-200',
        icon: 'text-green-600 dark:text-green-400'
      },
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-800 dark:text-blue-200',
        icon: 'text-blue-600 dark:text-blue-400'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-800 dark:text-purple-200',
        icon: 'text-purple-600 dark:text-purple-400'
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-800 dark:text-orange-200',
        icon: 'text-orange-600 dark:text-orange-400'
      }
    }
    return colorMap[color as keyof typeof colorMap]
  }

  return (
    <ContentLayout>
      {/* ヒーローセクション */}
      <div className="text-center mb-16">
        <div className="w-24 h-24 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Cookie className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Cookieポリシー
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          はじめて.AIでのCookieの使用方法と、<br />
          お客様のプライバシー保護への取り組みについて説明します。
        </p>
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          最終更新日: 2025年7月3日
        </div>
      </div>

      {/* Cookieとは */}
      <div className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Cookieとは
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="leading-relaxed">
              Cookieは、ウェブサイトがお客様のブラウザに保存する小さなテキストファイルです。
              これにより、サイトがお客様のデバイスを記憶し、次回訪問時により良い体験を提供することができます。
            </p>
            <p className="leading-relaxed">
              はじめて.AIでは、サービスの提供、改善、および安全性の確保のためにCookieを使用しています。
              お客様は、ブラウザの設定でCookieの使用を制御することができます。
            </p>
          </div>
        </div>
      </div>

      {/* Cookie の種類 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
          使用するCookieの種類
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cookieTypes.map((type) => {
            const colors = getColorClasses(type.color)
            return (
              <div
                key={type.id}
                className={`${colors.bg} ${colors.border} border rounded-xl p-6`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg bg-white dark:bg-gray-800`}>
                    <type.icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg font-bold ${colors.text}`}>
                        {type.title}
                      </h3>
                      {type.required && (
                        <span className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-xs px-2 py-1 rounded-full font-medium">
                          必須
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${colors.text} mb-3`}>
                      {type.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className={`font-semibold ${colors.text} mb-2 text-sm`}>
                      使用例：
                    </h4>
                    <ul className={`text-sm ${colors.text} space-y-1`}>
                      {type.examples.map((example, index) => (
                        <li key={index}>• {example}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-current/20">
                    <span className={`text-xs ${colors.text}`}>
                      保存期間: {type.duration}
                    </span>
                    <span className={`text-xs ${colors.text}`}>
                      提供者: {type.provider}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 詳細なCookie一覧 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
          使用中のCookie詳細
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Cookie名
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    目的
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    種類
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    保存期間
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    提供者
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {cookieDetails.map((cookie, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <code className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-gray-100">
                        {cookie.name}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {cookie.purpose}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        cookie.type === '必須' 
                          ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                          : cookie.type === '機能'
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                          : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                      }`}>
                        {cookie.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {cookie.duration}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {cookie.provider}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cookie設定の管理 */}
      <div className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
              <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Cookie設定の管理
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                お客様は、以下の方法でCookieの使用を制御することができます：
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                ブラウザ設定での制御
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• <strong>Chrome:</strong> 設定 → プライバシーとセキュリティ → Cookie</li>
                <li>• <strong>Firefox:</strong> 設定 → プライバシーとセキュリティ</li>
                <li>• <strong>Safari:</strong> 環境設定 → プライバシー</li>
                <li>• <strong>Edge:</strong> 設定 → Cookie とサイトのアクセス許可</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                第三者Cookie の制御
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Google Analytics オプトアウト</a></li>
                <li>• <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">広告設定の管理</a></li>
                <li>• 各サービス提供者の設定ページ</li>
                <li>• Do Not Track設定の有効化</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              <strong>注意：</strong> 必須Cookieを無効にすると、ログイン機能や決済機能など、
              サービスの基本機能が正常に動作しない場合があります。
            </p>
          </div>
        </div>
      </div>

      {/* 法的根拠 */}
      <div className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            法的根拠と権利
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Cookie使用の法的根拠
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• <strong>必須Cookie:</strong> 契約履行のため</li>
                <li>• <strong>機能Cookie:</strong> 正当な利益</li>
                <li>• <strong>分析Cookie:</strong> 正当な利益</li>
                <li>• <strong>マーケティングCookie:</strong> 同意</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                お客様の権利
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Cookie使用への同意または拒否</li>
                <li>• いつでも同意の撤回が可能</li>
                <li>• Cookie使用に関する情報請求</li>
                <li>• データポータビリティの権利</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 更新情報 */}
      <div className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            ポリシーの更新
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="leading-relaxed">
              当社は、法令の変更、技術の進歩、またはサービスの改善に伴い、
              本Cookieポリシーを更新する場合があります。
            </p>
            <p className="leading-relaxed">
              重要な変更がある場合は、ウェブサイト上で事前にお知らせし、
              必要に応じて再度同意をお願いする場合があります。
            </p>
          </div>
        </div>
      </div>

      {/* お問い合わせCTA */}
      <div className="mt-16 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-8 text-center text-white">
        <Mail className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">
          Cookieに関するお問い合わせ
        </h2>
        <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
          Cookieの使用やプライバシーに関するご質問・ご要望がございましたら、
          お気軽にお問い合わせください。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium"
          >
            お問い合わせフォーム
          </a>
          <a
            href="mailto:info@oku-ai.co.jp"
            className="inline-flex items-center px-8 py-3 border border-white text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            直接メール送信
          </a>
        </div>
      </div>
    </ContentLayout>
  )
}

export const metadata = {
  title: 'Cookieポリシー - はじめて.AI',
  description: 'はじめて.AIのCookieポリシー。Cookieの使用目的、種類、管理方法について詳しく説明しています。お客様のプライバシー保護とサービス向上への取り組みをご確認ください。'
}