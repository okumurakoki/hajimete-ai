import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          ページが見つかりません
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          お探しのページは存在しない可能性があります。
        </p>
        <Link href="/">
          <button className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200">
            ホームページに戻る
          </button>
        </Link>
      </div>
    </div>
  )
}