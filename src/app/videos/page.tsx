import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Videos() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">動画一覧</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">動画 {i}</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">AI基礎講座 第{i}回</h3>
                <p className="text-gray-600 text-sm">AI学習の基本を学ぼう</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}