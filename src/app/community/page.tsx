import { DashboardLayout } from '@/components/layout/Layout'
import { Users, MessageCircle, ThumbsUp, Eye, Clock, Star, Plus, Filter, Search } from 'lucide-react'

export default function CommunityPage() {
  const categories = [
    { name: '一般質問', count: 234, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
    { name: 'AI基礎', count: 189, color: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' },
    { name: '技術相談', count: 156, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' },
    { name: 'キャリア', count: 98, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' },
    { name: '雑談', count: 67, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300' }
  ]

  const discussions = [
    {
      id: 1,
      title: 'ChatGPTのプロンプトエンジニアリングで躓いています',
      author: '山田太郎',
      avatar: '👨',
      category: 'AI基礎',
      replies: 12,
      views: 234,
      likes: 18,
      timeAgo: '2時間前',
      isAnswered: true,
      tags: ['ChatGPT', 'プロンプト', '初心者']
    },
    {
      id: 2,
      title: 'AIエンジニアへの転職について相談です',
      author: '佐藤花子',
      avatar: '👩',
      category: 'キャリア',
      replies: 8,
      views: 156,
      likes: 24,
      timeAgo: '4時間前',
      isAnswered: false,
      tags: ['転職', 'エンジニア', 'キャリア']
    },
    {
      id: 3,
      title: 'Python機械学習ライブラリの選び方',
      author: '田中一郎',
      avatar: '👨‍💻',
      category: '技術相談',
      replies: 15,
      views: 342,
      likes: 31,
      timeAgo: '6時間前',
      isAnswered: true,
      tags: ['Python', '機械学習', 'ライブラリ']
    },
    {
      id: 4,
      title: 'はじめて.AIの学習効率を上げるコツってありますか？',
      author: '鈴木美咲',
      avatar: '👩‍🎓',
      category: '一般質問',
      replies: 6,
      views: 89,
      likes: 12,
      timeAgo: '8時間前',
      isAnswered: false,
      tags: ['学習法', 'コツ', '効率']
    },
    {
      id: 5,
      title: 'AIツールを使った業務効率化の事例共有',
      author: '高橋健太',
      avatar: '👨‍💼',
      category: '雑談',
      replies: 22,
      views: 445,
      likes: 37,
      timeAgo: '12時間前',
      isAnswered: false,
      tags: ['業務効率化', 'AIツール', '事例']
    }
  ]

  const topContributors = [
    { name: 'AI先生', avatar: '👨‍🏫', posts: 145, likes: 892, badge: 'エキスパート' },
    { name: 'データ博士', avatar: '👨‍🔬', posts: 89, likes: 567, badge: 'データサイエンティスト' },
    { name: 'コード姫', avatar: '👩‍💻', posts: 67, likes: 445, badge: 'エンジニア' }
  ]

  return (
    <DashboardLayout 
      title="コミュニティ"
      description="学習者同士で質問・回答・情報共有ができるスペースです"
      actions={
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          新しい投稿
        </button>
      }
    >
      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">1,234</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">アクティブメンバー</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <MessageCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">744</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">今月の投稿数</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <ThumbsUp className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">2,156</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">今月のいいね数</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">92%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">解決率</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* メインコンテンツ */}
        <div className="lg:col-span-3">
          {/* 検索・フィルター */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="投稿を検索..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <button className="flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
              <Filter className="w-4 h-4 mr-2" />
              フィルター
            </button>
          </div>

          {/* ディスカッション一覧 */}
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <div key={discussion.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{discussion.avatar}</div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{discussion.author}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{discussion.timeAgo}</div>
                    </div>
                  </div>
                  {discussion.isAnswered && (
                    <span className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 text-xs px-2 py-1 rounded-full font-medium">
                      解決済み
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  {discussion.title}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      discussion.category === 'AI基礎' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                      discussion.category === '技術相談' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' :
                      discussion.category === 'キャリア' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' :
                      discussion.category === '雑談' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    }`}>
                      {discussion.category}
                    </span>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {discussion.replies}
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {discussion.views}
                    </div>
                    <div className="flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {discussion.likes}
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    {discussion.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ページネーション */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                前へ
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`px-3 py-2 rounded-lg ${
                    page === 1 
                      ? 'bg-blue-600 text-white' 
                      : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                次へ
              </button>
            </div>
          </div>
        </div>

        {/* サイドバー */}
        <div className="lg:col-span-1">
          {/* カテゴリ */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">カテゴリ</h3>
            <div className="space-y-2">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${category.color}`}>
                    {category.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* トップコントリビューター */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">今月のトップコントリビューター</h3>
            <div className="space-y-4">
              {topContributors.map((contributor, index) => (
                <div key={index} className="flex items-center">
                  <div className="text-2xl mr-3">{contributor.avatar}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{contributor.name}</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">{contributor.badge}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {contributor.posts}投稿 • {contributor.likes}いいね
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* コミュニティガイドライン */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">コミュニティガイドライン</h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <li>• 建設的で敬意のある議論を心がけましょう</li>
              <li>• 質問は具体的で分かりやすく</li>
              <li>• 他の人の回答に感謝の気持ちを示しましょう</li>
              <li>• スパムや宣伝目的の投稿は禁止です</li>
            </ul>
            <a href="/community/guidelines" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mt-3 inline-block">
              詳細を読む →
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export const metadata = {
  title: 'コミュニティ - はじめて.AI',
  description: '学習者同士で質問・回答・情報共有ができるコミュニティスペース。AI学習の疑問や悩みを共有し、一緒に成長しましょう。'
}