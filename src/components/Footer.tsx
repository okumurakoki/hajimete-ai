export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">はじめて.AI</h3>
            <p className="text-gray-600">AI学習の第一歩を始めよう</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">サービス</h4>
            <ul className="space-y-2">
              <li><a href="/videos" className="text-gray-600 hover:text-blue-600">動画学習</a></li>
              <li><a href="/seminars" className="text-gray-600 hover:text-blue-600">セミナー</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">サポート</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">お問い合わせ</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">よくある質問</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-gray-600">
          <p>&copy; 2024 はじめて.AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}