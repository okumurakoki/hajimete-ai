import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Admin() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">管理画面</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">動画管理</h2>
            <p className="text-gray-600 mb-4">動画の追加・編集・削除</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              動画を管理
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">セミナー管理</h2>
            <p className="text-gray-600 mb-4">セミナーの作成・編集</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              セミナーを管理
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">ユーザー管理</h2>
            <p className="text-gray-600 mb-4">会員情報の確認・管理</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              ユーザーを管理
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">統計・分析</h2>
            <p className="text-gray-600 mb-4">利用状況の分析</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              統計を見る
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}