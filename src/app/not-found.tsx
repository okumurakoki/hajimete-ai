'use client'

import Link from 'next/link'
import { Home, Search, ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Search size={29} className="text-blue-600" />
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ページが見つかりません
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            お探しのページは存在しないか、移動または削除された可能性があります。
            URLを確認していただくか、以下から目的のページをお探しください。
          </p>

          <div className="space-y-4">
            <Link href="/">
              <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Home size={12} />
                ホームページに戻る
              </button>
            </Link>
            
            <Link href="/videos">
              <button className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <Search size={12} />
                動画を探す
              </button>
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={12} />
              前のページに戻る
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              人気のコンテンツ
            </h3>
            <div className="grid grid-cols-1 gap-3 text-left">
              <Link href="/ai-basics" className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
                <div className="font-medium text-gray-900">AI基礎学部</div>
                <div className="text-sm text-gray-600">AIの基本から学ぶ</div>
              </Link>
              <Link href="/practical-application" className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
                <div className="font-medium text-gray-900">実践活用学部</div>
                <div className="text-sm text-gray-600">現場で使えるスキル</div>
              </Link>
              <Link href="/seminars" className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
                <div className="font-medium text-gray-900">ライブセミナー</div>
                <div className="text-sm text-gray-600">講師との双方向学習</div>
              </Link>
            </div>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            それでも問題が解決しない場合は、
            <a href="mailto:support@hajimete-ai.com" className="text-blue-600 hover:text-blue-700">
              サポートチーム
            </a>
            までお問い合わせください。
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}