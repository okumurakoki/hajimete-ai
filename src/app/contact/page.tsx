import { ContentLayout } from '@/components/layout/Layout'
import { Mail, Phone, MapPin, MessageCircle, Clock, Send } from 'lucide-react'

export default function ContactPage() {
  return (
    <ContentLayout>
      <div className="text-center mb-12">
        <MessageCircle className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">お問い合わせ</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          ご質問やご要望がございましたら、お気軽にお問い合わせください。専門スタッフが迅速にサポートいたします。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* 連絡先情報 */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">連絡先情報</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <Mail className="w-6 h-6 text-blue-600 mr-4 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">メール</h3>
                <p className="text-gray-600 dark:text-gray-400">info@oku-ai.co.jp</p>
                <p className="text-sm text-gray-500">24時間以内に返信いたします</p>
              </div>
            </div>


            <div className="flex items-start">
              <Clock className="w-6 h-6 text-blue-600 mr-4 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">サポート時間</h3>
                <p className="text-gray-600">
                  平日: 9:00-18:00<br />
                  土日祝: 10:00-17:00
                </p>
                <p className="text-sm text-gray-500">緊急時は24時間対応</p>
              </div>
            </div>
          </div>

          {/* よくある質問へのリンク */}
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">お問い合わせ前に</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              よくある質問をご確認いただくと、すぐに解決するかもしれません。
            </p>
            <a 
              href="/faq" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              よくある質問を見る →
            </a>
          </div>
        </div>

        {/* お問い合わせフォーム */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">お問い合わせフォーム</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  お名前（姓）*
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  お名前（名）*
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                メールアドレス *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                電話番号
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                お問い合わせ種別 *
              </label>
              <select
                id="category"
                name="category"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">選択してください</option>
                <option value="general">一般的な質問</option>
                <option value="technical">技術的な問題</option>
                <option value="billing">料金・プランについて</option>
                <option value="content">コンテンツについて</option>
                <option value="partnership">提携・協業について</option>
                <option value="other">その他</option>
              </select>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                件名 *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="お問い合わせの件名を入力してください"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                メッセージ *
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="詳細な内容をご記入ください"
              />
            </div>

            <div className="flex items-start">
              <input
                id="privacy"
                name="privacy"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="privacy" className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">プライバシーポリシー</a>
                に同意します *
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Send className="w-5 h-5 mr-2" />
              送信する
            </button>
          </form>
        </div>
      </div>

    </ContentLayout>
  )
}

export const metadata = {
  title: 'お問い合わせ - はじめて.AI',
  description: 'はじめて.AIへのお問い合わせはこちらから。技術的な質問から一般的なご相談まで、専門スタッフが丁寧にサポートいたします。'
}