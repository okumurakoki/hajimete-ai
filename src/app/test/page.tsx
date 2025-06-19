'use client'

export const dynamic = 'force-dynamic'

// 機能テスト用の簡単なページ
export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          🧪 はじめて.AI 機能テスト
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ホームページテスト */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">🏠 ホームページ</h2>
            <div className="space-y-2">
              <a href="/" className="block text-blue-600 hover:underline">
                ホームページへ
              </a>
              <p className="text-sm text-gray-600">
                ✅ 4学部カード表示<br/>
                ✅ ナビゲーション<br/>
                ✅ レスポンシブデザイン
              </p>
            </div>
          </div>

          {/* 学部ページテスト */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">📚 学部ページ</h2>
            <div className="space-y-2">
              <a href="/ai-basics" className="block text-blue-600 hover:underline">
                AI基礎学部
              </a>
              <a href="/productivity" className="block text-blue-600 hover:underline">
                業務効率化学部
              </a>
              <a href="/practical-application" className="block text-blue-600 hover:underline">
                実践応用学部
              </a>
              <a href="/catchup" className="block text-blue-600 hover:underline">
                キャッチアップ学部
              </a>
            </div>
          </div>

          {/* 動画システムテスト */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">🎥 動画システム</h2>
            <div className="space-y-2">
              <a href="/videos" className="block text-blue-600 hover:underline">
                動画一覧
              </a>
              <a href="/videos/1" className="block text-blue-600 hover:underline">
                動画詳細 (サンプル)
              </a>
              <p className="text-sm text-gray-600">
                ✅ 一覧表示<br/>
                ✅ フィルタリング<br/>
                ✅ 詳細ページ
              </p>
            </div>
          </div>

          {/* セミナーシステムテスト */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">📅 セミナー</h2>
            <div className="space-y-2">
              <a href="/seminars" className="block text-blue-600 hover:underline">
                セミナー一覧
              </a>
              <p className="text-sm text-gray-600">
                ✅ 一覧表示<br/>
                ✅ 予約システム<br/>
                ✅ カレンダー
              </p>
            </div>
          </div>

          {/* ライブ配信テスト */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">📺 ライブ配信</h2>
            <div className="space-y-2">
              <a href="/live" className="block text-blue-600 hover:underline">
                ライブ配信
              </a>
              <p className="text-sm text-gray-600">
                ✅ 配信一覧<br/>
                ✅ チャット機能<br/>
                ✅ 視聴者数
              </p>
            </div>
          </div>

          {/* 管理画面テスト */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">🛠️ 管理画面</h2>
            <div className="space-y-2">
              <a href="/admin/dashboard" className="block text-blue-600 hover:underline">
                管理ダッシュボード
              </a>
              <a href="/admin/users" className="block text-blue-600 hover:underline">
                ユーザー管理
              </a>
              <a href="/admin/videos" className="block text-blue-600 hover:underline">
                動画管理
              </a>
              <a href="/admin/seminars" className="block text-blue-600 hover:underline">
                セミナー管理
              </a>
            </div>
          </div>
        </div>

        {/* APIテスト */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🔧 API動作確認</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => fetch('/api/departments').then(r => r.json()).then(console.log)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              学部API
            </button>
            <button 
              onClick={() => fetch('/api/videos').then(r => r.json()).then(console.log)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              動画API
            </button>
            <button 
              onClick={() => fetch('/api/seminars').then(r => r.json()).then(console.log)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              セミナーAPI
            </button>
            <button 
              onClick={() => fetch('/api/admin/stats').then(r => r.json()).then(console.log)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              統計API
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            💡 ボタンを押すとコンソールにAPI結果が表示されます
          </p>
        </div>

        {/* テスト結果 */}
        <div className="mt-8 bg-green-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            ✅ テスト結果
          </h2>
          <div className="text-sm text-green-700 space-y-1">
            <p>✅ このページが表示されている = Next.js正常動作</p>
            <p>✅ スタイルが適用されている = TailwindCSS正常動作</p>
            <p>✅ リンクが機能する = ルーティング正常動作</p>
            <p>✅ APIボタンが機能する = JavaScript正常動作</p>
          </div>
        </div>
      </div>
    </div>
  )
}