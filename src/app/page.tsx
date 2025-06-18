import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            はじめて<span className="text-blue-600">.AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI学習の第一歩を始めよう
          </p>
          <div className="space-y-4 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">ベーシックプラン</h3>
              <p className="text-3xl font-bold text-blue-600">¥1,650<span className="text-sm text-gray-500">/月</span></p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">プロプラン</h3>
              <p className="text-3xl font-bold text-blue-600">¥5,500<span className="text-sm text-gray-500">/月</span></p>
            </div>
          </div>
          <div className="space-x-4">
            <Link href="/dashboard" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              ダッシュボード
            </Link>
            <Link href="/videos" className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              動画を見る
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}