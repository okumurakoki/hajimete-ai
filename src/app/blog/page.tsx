import { ContentLayout } from '@/components/layout/Layout'
import { Search, Calendar, User, Clock, ArrowRight, Tag, TrendingUp } from 'lucide-react'

export default function BlogPage() {
  const categories = [
    'AI基礎',
    'ChatGPT',
    'ビジネス活用',
    'プログラミング',
    'データ分析',
    '業界動向',
    'チュートリアル',
    '事例紹介'
  ]

  const featuredPost = {
    id: 1,
    title: 'ChatGPT-4oを活用した業務効率化の実践例：5つの部門での導入事例',
    excerpt: '最新のChatGPT-4oを実際の業務に導入し、劇的な効率化を実現した企業の事例をご紹介。営業、マーケティング、カスタマーサポート、人事、経理の各部門での具体的な活用方法と効果測定結果を詳しく解説します。',
    author: '田中 智也',
    date: '2024年12月28日',
    readTime: '8分',
    category: 'ビジネス活用',
    image: '/api/placeholder/600/400',
    tags: ['ChatGPT', '業務効率化', '事例紹介', 'DX']
  }

  const blogPosts = [
    {
      id: 2,
      title: 'AI画像生成ツール比較：Midjourney vs DALL-E 3 vs Stable Diffusion',
      excerpt: '2024年最新版！主要なAI画像生成ツールの特徴、料金、生成品質を徹底比較。あなたの用途に最適なツールを見つけるためのガイド。',
      author: '佐藤 美咲',
      date: '2024年12月25日',
      readTime: '6分',
      category: 'ツール比較',
      image: '/api/placeholder/400/300',
      tags: ['画像生成', 'Midjourney', 'DALL-E', 'Stable Diffusion']
    },
    {
      id: 3,
      title: 'プロンプトエンジニアリングの基礎：効果的なAI対話のコツ',
      excerpt: 'AIから最高の回答を引き出すためのプロンプト設計の基本原則と実践的なテクニック。初心者でもすぐに使える具体例付き。',
      author: '山田 健太',
      date: '2024年12月22日',
      readTime: '5分',
      category: 'AI基礎',
      image: '/api/placeholder/400/300',
      tags: ['プロンプト', 'AI対話', '基礎知識']
    },
    {
      id: 4,
      title: 'Python×AIで始めるデータ分析：初心者向け完全ガイド',
      excerpt: 'Pythonの基礎からAIを活用したデータ分析まで、ステップバイステップで学べる実践的なチュートリアル。',
      author: '鈴木 一郎',
      date: '2024年12月20日',
      readTime: '12分',
      category: 'プログラミング',
      image: '/api/placeholder/400/300',
      tags: ['Python', 'データ分析', 'チュートリアル', '初心者']
    },
    {
      id: 5,
      title: '2024年AI業界の振り返りと2025年の展望',
      excerpt: '激動の2024年を振り返り、2025年のAI業界で注目すべきトレンドと技術革新を予測。投資家と技術者必見の分析記事。',
      author: '田中 智也',
      date: '2024年12月18日',
      readTime: '10分',
      category: '業界動向',
      image: '/api/placeholder/400/300',
      tags: ['業界分析', '2024年', '2025年', 'トレンド']
    },
    {
      id: 6,
      title: 'ノーコードAIツールで作る顧客対応チャットボット',
      excerpt: 'プログラミング不要でAIチャットボットを構築する方法。Zapier、Make、Voiceflowを使った実践的な構築手順を解説。',
      author: '高橋 美咲',
      date: '2024年12月15日',
      readTime: '7分',
      category: 'ノーコード',
      image: '/api/placeholder/400/300',
      tags: ['ノーコード', 'チャットボット', 'カスタマーサポート']
    }
  ]

  const popularTags = [
    'ChatGPT', 'AI基礎', 'ビジネス活用', 'プログラミング', 'データ分析',
    '画像生成', 'ノーコード', 'プロンプト', '業界動向', '事例紹介'
  ]

  return (
    <ContentLayout>
      {/* ヘッダーセクション */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          AI Technology Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          AI技術の最新動向、実践的なチュートリアル、業界の洞察をお届け。
          初心者から上級者まで、すべての学習者に役立つ情報を発信しています。
        </p>
      </div>

      {/* 検索・フィルター */}
      <div className="mb-12">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="記事を検索..."
              className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* カテゴリフィルター */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
            すべて
          </button>
          {categories.map((category, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 注目記事 */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">注目記事</h2>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50"></div>
            </div>
            <div className="md:w-1/2 p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-sm font-medium rounded-full">
                  {featuredPost.category}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {featuredPost.readTime}読了
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">
                {featuredPost.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </div>
                </div>
                
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  続きを読む
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {featuredPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* メイン記事一覧 */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">最新記事</h2>
          
          <div className="space-y-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="aspect-video md:aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"></div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {post.readTime}読了
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </div>
                      </div>
                      
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm">
                        続きを読む →
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ページネーション */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                前へ
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                2
              </button>
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                3
              </button>
              <span className="px-4 py-2 text-gray-500 dark:text-gray-400">...</span>
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                次へ
              </button>
            </div>
          </div>
        </div>

        {/* サイドバー */}
        <div className="space-y-8">
          {/* 人気のタグ */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">人気のタグ</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag, index) => (
                <button
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* アーカイブ */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">アーカイブ</h3>
            </div>
            <div className="space-y-2">
              {['2024年12月 (12)', '2024年11月 (8)', '2024年10月 (15)', '2024年9月 (11)', '2024年8月 (9)'].map((archive, index) => (
                <button
                  key={index}
                  className="block w-full text-left text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {archive}
                </button>
              ))}
            </div>
          </div>

          {/* ニュースレター購読 */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              ニュースレター購読
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              最新のAI情報を週1回お届けします
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="メールアドレス"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              />
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                購読する
              </button>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  )
}

export const metadata = {
  title: 'ブログ - はじめて.AI',
  description: 'AI技術の最新動向、実践的なチュートリアル、業界の洞察をお届け。初心者から上級者まで、すべての学習者に役立つ情報を発信しています。'
}