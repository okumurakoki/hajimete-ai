import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            はじめて.AI
          </Link>
          <nav className="flex space-x-6">
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
              ダッシュボード
            </Link>
            <Link href="/videos" className="text-gray-700 hover:text-blue-600 transition-colors">
              動画
            </Link>
            <Link href="/seminars" className="text-gray-700 hover:text-blue-600 transition-colors">
              セミナー
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
              管理
            </Link>
          </nav>
          <div className="flex space-x-4">
            <button className="text-gray-700 hover:text-blue-600 transition-colors">
              ログイン
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              登録
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}