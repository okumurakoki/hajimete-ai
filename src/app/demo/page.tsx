import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'デモ体験',
  description: 'はじめて.AIの学習システムをデモ環境で体験。AI学習プラットフォームの機能を実際にお試しください',
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              はじめて.AI
            </Link>
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              ホームに戻る
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎯 はじめて.AI デモ体験
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              AI学習プラットフォームの機能を実際に体験してみましょう
            </p>
          </div>

          {/* Feature Demo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Video Learning Demo */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl mb-2">🎥</div>
                  <h3 className="text-lg font-semibold">動画学習システム</h3>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  体系的な動画コンテンツ
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  AIの基礎から実践まで、段階的に学べる動画コンテンツを体験できます。
                </p>
                <ul className="text-sm text-gray-700 space-y-1 mb-4">
                  <li>• ChatGPT完全入門（45分）</li>
                  <li>• Excel作業効率化（60分）</li>
                  <li>• AI活用事例集（70分）</li>
                </ul>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  デモ動画を見る
                </button>
              </div>
            </div>

            {/* Live Streaming Demo */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl mb-2">📡</div>
                  <h3 className="text-lg font-semibold">ライブ配信</h3>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  リアルタイム学習
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  講師とリアルタイムで質疑応答できるライブ配信システム。
                </p>
                <ul className="text-sm text-gray-700 space-y-1 mb-4">
                  <li>• ライブチャット機能</li>
                  <li>• リアクション送信</li>
                  <li>• 録画・アーカイブ対応</li>
                </ul>
                <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
                  ライブデモを見る
                </button>
              </div>
            </div>

            {/* Department System Demo */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl mb-2">🏫</div>
                  <h3 className="text-lg font-semibold">学部システム</h3>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  専門分野別学習
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  目的に応じた4つの学部で効率的に学習を進められます。
                </p>
                <ul className="text-sm text-gray-700 space-y-1 mb-4">
                  <li>• AI基礎学部 🤖</li>
                  <li>• 業務効率化学部 ⚡</li>
                  <li>• 実践応用学部 🚀</li>
                  <li>• キャッチアップ学部 ⭐</li>
                </ul>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                  学部を探索する
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Demo Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              🚀 インタラクティブデモ
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Mock Dashboard */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  学習ダッシュボード
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">今週の学習時間</span>
                    <span className="text-blue-600 font-bold">12時間</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">完了した動画</span>
                    <span className="text-green-600 font-bold">8本</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium">獲得ポイント</span>
                    <span className="text-purple-600 font-bold">320pt</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-16"></div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    次のレベルまで 35%
                  </p>
                </div>
              </div>

              {/* Mock Video Player */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-3xl mb-2">▶️</div>
                    <p className="text-sm">ChatGPT入門</p>
                    <p className="text-xs text-gray-300">45:30</p>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    ChatGPT完全入門
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    AIツールの基本的な使い方から応用まで
                  </p>
                  <div className="flex gap-2">
                    <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm">
                      再生
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-4 py-1 rounded text-sm">
                      お気に入り
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Data Information */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              📊 デモ環境について
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
                <div className="text-sm text-gray-700">学部</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">12</div>
                <div className="text-sm text-gray-700">動画コンテンツ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">8</div>
                <div className="text-sm text-gray-700">ライブセミナー</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">2</div>
                <div className="text-sm text-gray-700">料金プラン</div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-700 mb-4">
                このデモ環境では、実際のサービスと同様の機能を体験できます。
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  無料アカウント作成
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  料金プランを見る
                </button>
              </div>
            </div>
          </div>

          {/* Demo Links */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              🎮 デモコンテンツ
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  📺 ライブ配信デモ
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  実際のライブ配信画面を模擬したデモページ。チャット機能やリアクション機能を体験できます。
                </p>
                <a 
                  href="/live-demo.html" 
                  target="_blank"
                  className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  ライブデモを開く
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🎥 動画プレイヤーデモ
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  学習動画の視聴画面。プログレス管理、ノート機能、倍速再生などの機能を確認できます。
                </p>
                <a 
                  href="/videos-demo.html" 
                  target="_blank"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  動画デモを開く
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🏫 学部システムデモ
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  各学部のコンテンツ構成と学習の進め方。専門分野別のカリキュラムを確認できます。
                </p>
                <a 
                  href="/departments-demo.html" 
                  target="_blank"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  学部デモを開く
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🔐 認証システムデモ
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  ユーザー登録・ログイン・プロフィール管理機能。セキュアな認証システムを体験できます。
                </p>
                <a 
                  href="/auth-demo.html" 
                  target="_blank"
                  className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  認証デモを開く
                </a>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ℹ️ デモ環境の注意事項
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• デモ環境のデータは定期的にリセットされます</li>
                <li>• 実際の動画コンテンツは含まれていません</li>
                <li>• 決済機能はテストモードで動作します</li>
                <li>• 一部機能は模擬的な動作となります</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              © 2024 はじめて.AI. All rights reserved.
            </p>
            <div className="mt-2">
              <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm mr-4">
                ホーム
              </Link>
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 text-sm mr-4">
                プライバシーポリシー
              </Link>
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 text-sm">
                利用規約
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}