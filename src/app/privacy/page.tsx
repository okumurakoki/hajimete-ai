import { ContentLayout } from '@/components/layout/Layout'
import { Shield, Eye, Lock, Users, FileText, Mail } from 'lucide-react'

export default function PrivacyPage() {
  const sections = [
    {
      id: '1',
      title: 'はじめに',
      content: (
        <div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            はじめて.AI（以下「当社」）は、ユーザーの皆様（以下「ユーザー」）のプライバシーを尊重し、個人情報の保護に努めております。
            本プライバシーポリシーは、当社が提供するサービス（以下「本サービス」）における個人情報の取り扱いについて説明いたします。
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            当社は、個人情報保護法をはじめとする法令を遵守し、適切な個人情報の管理を行います。
          </p>
        </div>
      )
    },
    {
      id: '2',
      title: '収集する個人情報',
      content: (
        <div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            当社は、以下の個人情報を収集する場合があります：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">基本情報</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• 氏名、メールアドレス</li>
                <li>• プロフィール情報</li>
                <li>• 認証情報</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">学習情報</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• 学習履歴、視聴履歴</li>
                <li>• 成績情報、進捗データ</li>
                <li>• コメント、投稿内容</li>
              </ul>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">決済情報</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• 支払い履歴</li>
                <li>• 請求先情報</li>
                <li>• ※カード情報は保存されません</li>
              </ul>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">技術情報</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• IPアドレス、ブラウザ情報</li>
                <li>• アクセスログ、Cookie</li>
                <li>• デバイス情報</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: '3',
      title: '個人情報の利用目的',
      content: (
        <div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            収集した個人情報は、以下の目的で利用いたします：
          </p>
          <ul className="space-y-3">
            {[
              { icon: '🎯', text: '本サービスの提供・運営・機能改善' },
              { icon: '💬', text: 'ユーザーサポート・お問い合わせ対応' },
              { icon: '📊', text: 'サービス利用状況の分析・統計作成' },
              { icon: '📧', text: '重要なお知らせ・マーケティング情報の配信' },
              { icon: '🔒', text: '不正利用の防止・セキュリティ確保' },
              { icon: '⚖️', text: '法令に基づく対応・紛争解決' }
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: '4',
      title: '個人情報の第三者提供',
      content: (
        <div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">基本方針</h4>
            <p className="text-red-700 dark:text-red-300 text-sm">
              当社は、ユーザーの同意なく個人情報を第三者に提供いたしません。
            </p>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            ただし、以下の場合は例外とします：
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>法令に基づく場合</li>
            <li>人の生命・身体・財産の保護のために必要な場合</li>
            <li>公衆衛生の向上・児童の健全育成のために必要な場合</li>
            <li>国の機関等への協力が必要な場合</li>
            <li>事業承継に伴う場合（事前通知いたします）</li>
          </ul>
        </div>
      )
    },
    {
      id: '5',
      title: '個人情報の管理・セキュリティ',
      content: (
        <div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            当社は、個人情報の正確性を保ち、以下のセキュリティ対策を実施して安全に管理いたします：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Lock,
                title: 'データ暗号化',
                items: ['SSL/TLS通信の暗号化', 'データベースの暗号化', 'バックアップデータの暗号化']
              },
              {
                icon: Shield,
                title: 'アクセス制御',
                items: ['多要素認証の実装', '権限ベースのアクセス制御', '定期的なセキュリティ監査']
              },
              {
                icon: Eye,
                title: '監視・検知',
                items: ['24時間監視システム', '異常アクセスの検知', 'ログの定期確認']
              },
              {
                icon: Users,
                title: '従業員教育',
                items: ['セキュリティ研修の実施', '機密保持契約の締結', 'アクセス権限の最小化']
              }
            ].map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</h4>
                </div>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {item.items.map((subItem, subIndex) => (
                    <li key={subIndex}>• {subItem}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: '6',
      title: 'Cookieについて',
      content: (
        <div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            本サービスでは、ユーザー体験の向上とサービス改善のためCookieを使用しています。
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Cookieの用途</h4>
            <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
              <li>• ログイン状態の維持</li>
              <li>• ユーザー設定の保存</li>
              <li>• サイト利用状況の分析</li>
              <li>• パーソナライズされたコンテンツの表示</li>
            </ul>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Cookieの使用を拒否する場合は、ブラウザの設定で無効にできますが、一部機能が制限される場合があります。
            詳細は<a href="/cookies" className="text-blue-600 dark:text-blue-400 hover:underline">Cookieポリシー</a>をご確認ください。
          </p>
        </div>
      )
    },
    {
      id: '7',
      title: 'ユーザーの権利',
      content: (
        <div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            ユーザーは、自身の個人情報について以下の権利を有します：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: '開示請求権', desc: '個人情報の利用状況を確認できます' },
              { title: '訂正・追加・削除請求権', desc: '個人情報の修正・削除を求めることができます' },
              { title: '利用停止・消去請求権', desc: '個人情報の利用停止を求めることができます' },
              { title: '第三者提供停止請求権', desc: '第三者への提供停止を求めることができます' }
            ].map((right, index) => (
              <div key={index} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">{right.title}</h4>
                <p className="text-green-700 dark:text-green-300 text-sm">{right.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
            これらの権利を行使される場合は、下記連絡先までお問い合わせください。本人確認後、速やかに対応いたします。
          </p>
        </div>
      )
    },
    {
      id: '8',
      title: '外部サービスの利用',
      content: (
        <div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            本サービスでは、以下の外部サービスを利用しており、各サービスのプライバシーポリシーが適用されます：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Stripe', purpose: '決済処理', url: 'https://stripe.com/privacy' },
              { name: 'Clerk', purpose: '認証システム', url: 'https://clerk.com/privacy' },
              { name: 'Google Analytics', purpose: 'アクセス解析', url: 'https://policies.google.com/privacy' },
              { name: 'Vimeo', purpose: '動画配信', url: 'https://vimeo.com/privacy' }
            ].map((service, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{service.name}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{service.purpose}</p>
                <a 
                  href={service.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 text-xs hover:underline"
                >
                  プライバシーポリシーを見る →
                </a>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: '9',
      title: 'データの保管・削除',
      content: (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">保管期間</h4>
              <ul className="text-gray-700 dark:text-gray-300 space-y-2 text-sm">
                <li>• <strong>アカウント情報：</strong> サービス利用期間中</li>
                <li>• <strong>学習データ：</strong> アカウント削除後1年間</li>
                <li>• <strong>決済情報：</strong> 法令に基づく期間</li>
                <li>• <strong>アクセスログ：</strong> 収集から1年間</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">データ削除</h4>
              <ul className="text-gray-700 dark:text-gray-300 space-y-2 text-sm">
                <li>• アカウント削除時に自動削除</li>
                <li>• 削除依頼から30日以内に処理</li>
                <li>• バックアップからも完全削除</li>
                <li>• 削除完了の通知を送信</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: '10',
      title: 'プライバシーポリシーの変更',
      content: (
        <div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            当社は、法令の変更やサービス内容の変更に伴い、本プライバシーポリシーを変更する場合があります。
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">変更時の対応</h4>
            <ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
              <li>• 重要な変更時は事前にメール通知</li>
              <li>• 変更内容をサイト上で明示</li>
              <li>• 変更日から効力発生</li>
              <li>• 継続利用で新ポリシーに同意とみなします</li>
            </ul>
          </div>
        </div>
      )
    }
  ]

  return (
    <ContentLayout>
      {/* ヒーローセクション */}
      <div className="text-center mb-16">
        <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          プライバシーポリシー
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          はじめて.AIは、お客様の個人情報とプライバシーを最大限に尊重し、<br />
          透明性のある情報管理を行っています。
        </p>
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          最終更新日: 2024年12月28日
        </div>
      </div>

      {/* 目次 */}
      <div className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">目次</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#section-${section.id}`}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 py-1 text-sm"
              >
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full text-xs flex items-center justify-center font-medium">
                  {section.id}
                </span>
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* セクション */}
      <div className="space-y-12">
        {sections.map((section) => (
          <section key={section.id} id={`section-${section.id}`} className="scroll-mt-24">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full text-sm flex items-center justify-center font-bold">
                  {section.id}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {section.title}
                </h2>
              </div>
              {section.content}
            </div>
          </section>
        ))}
      </div>

      {/* お問い合わせCTA */}
      <div className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-center text-white">
        <Mail className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">
          個人情報に関するお問い合わせ
        </h2>
        <p className="text-green-100 mb-6 max-w-2xl mx-auto">
          個人情報の取り扱いや権利行使に関するご質問・ご要望がございましたら、
          お気軽にお問い合わせください。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
          >
            お問い合わせフォーム
          </a>
          <a
            href="mailto:info@oku-ai.co.jp"
            className="inline-flex items-center px-8 py-3 border border-white text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            直接メール送信
          </a>
        </div>
      </div>
    </ContentLayout>
  )
}

export const metadata = {
  title: 'プライバシーポリシー - はじめて.AI',
  description: 'はじめて.AIのプライバシーポリシー。個人情報の収集、利用、管理方法について詳しく説明しています。お客様のプライバシー保護への取り組みをご確認ください。'
}