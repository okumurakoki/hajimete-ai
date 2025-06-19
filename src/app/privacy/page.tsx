import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'はじめて.AIのプライバシーポリシー。個人情報の取り扱いについて',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-6">
                最終更新日: 2024年6月19日
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. はじめに</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  はじめて.AI（以下「当社」）は、ユーザーの皆様（以下「ユーザー」）のプライバシーを尊重し、個人情報の保護に努めております。
                  本プライバシーポリシーは、当社が提供するサービス（以下「本サービス」）における個人情報の取り扱いについて説明いたします。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. 収集する個人情報</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  当社は、以下の個人情報を収集する場合があります：
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>氏名、メールアドレス、電話番号</li>
                  <li>学習履歴、視聴履歴、成績情報</li>
                  <li>決済情報（クレジットカード情報は当社で保存せず、決済代行会社で安全に処理されます）</li>
                  <li>IPアドレス、ブラウザ情報、アクセスログ</li>
                  <li>Cookieによる情報</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. 個人情報の利用目的</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  収集した個人情報は、以下の目的で利用いたします：
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>本サービスの提供・運営</li>
                  <li>ユーザーサポート・お問い合わせ対応</li>
                  <li>サービス改善・新機能開発</li>
                  <li>マーケティング・プロモーション活動</li>
                  <li>利用規約違反の調査・対応</li>
                  <li>法令に基づく対応</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. 個人情報の第三者提供</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  当社は、以下の場合を除き、ユーザーの同意なく個人情報を第三者に提供いたしません：
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>法令に基づく場合</li>
                  <li>人の生命・身体・財産の保護のために必要な場合</li>
                  <li>公衆衛生の向上・児童の健全育成のために必要な場合</li>
                  <li>国の機関等への協力が必要な場合</li>
                  <li>事業承継に伴う場合</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. 個人情報の管理</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  当社は、個人情報の正確性を保ち、安全に管理いたします。
                  不正アクセス・紛失・破損・改ざん・漏洩などを防止するため、適切なセキュリティ対策を実施しております。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Cookieについて</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  本サービスでは、ユーザー体験の向上のためCookieを使用しています。
                  Cookieの使用を拒否する場合は、ブラウザの設定で無効にできますが、
                  一部機能が制限される場合があります。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">7. ユーザーの権利</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ユーザーは、自身の個人情報について以下の権利を有します：
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>開示請求権</li>
                  <li>訂正・追加・削除請求権</li>
                  <li>利用停止・消去請求権</li>
                  <li>第三者提供停止請求権</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  これらの権利を行使される場合は、下記連絡先までお問い合わせください。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">8. 外部サービスの利用</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  本サービスでは、以下の外部サービスを利用しており、
                  各サービスのプライバシーポリシーが適用されます：
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Stripe（決済処理）</li>
                  <li>Clerk（認証システム）</li>
                  <li>Google Analytics（アクセス解析）</li>
                  <li>Zoom（オンラインセミナー）</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">9. プライバシーポリシーの変更</h2>
                <p className="text-gray-700 leading-relaxed">
                  当社は、法令の変更やサービス内容の変更に伴い、本プライバシーポリシーを変更する場合があります。
                  変更後のプライバシーポリシーは、本ページに掲載した時点で効力を生じるものとします。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">10. お問い合わせ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください：
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>はじめて.AI カスタマーサポート</strong><br/>
                    メールアドレス: privacy@hajimete-ai.com<br/>
                    受付時間: 平日 9:00-18:00（土日祝日除く）
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}