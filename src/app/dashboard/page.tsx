import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">ダッシュボード</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">学習進捗</h2>
            <p className="text-gray-600">進捗状況を確認できます</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">最新動画</h2>
            <p className="text-gray-600">新着の学習動画をチェック</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">セミナー予約</h2>
            <p className="text-gray-600">今後のセミナーを予約</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}