import { DashboardLayout } from '@/components/layout/Layout'
import { BookOpen, Clock, Users, Star, Filter, Search } from 'lucide-react'

export default function CoursesPage() {
  // モックコースデータ
  const courses = [
    {
      id: 1,
      title: 'ChatGPTの基本操作とプロンプト作成',
      description: 'ChatGPTを使いこなすための基本的な操作方法と効果的なプロンプトの作成方法を学びます。',
      department: 'AI基礎学部',
      difficulty: '初級',
      duration: '2時間',
      enrolledCount: 1254,
      rating: 4.8,
      thumbnail: '🤖',
      tags: ['AI', 'ChatGPT', '基礎'],
      price: '無料',
      isNew: true
    },
    {
      id: 2,
      title: 'データ分析でビジネスを改善',
      description: 'ExcelやGoogleシートを使った基本的なデータ分析手法とビジネスへの活用方法を実践的に学習します。',
      department: 'データサイエンス学部',
      difficulty: '中級',
      duration: '3時間',
      enrolledCount: 892,
      rating: 4.9,
      thumbnail: '📊',
      tags: ['データ分析', 'Excel', 'ビジネス'],
      price: 'プレミアム',
      isPopular: true
    },
    {
      id: 3,
      title: 'AIツールでプレゼン資料作成',
      description: 'AI支援ツールを活用して効率的にプレゼンテーション資料を作成する方法を学びます。',
      department: '業務効率化学部',
      difficulty: '初級',
      duration: '1.5時間',
      enrolledCount: 734,
      rating: 4.7,
      thumbnail: '💡',
      tags: ['プレゼン', 'AI', 'デザイン'],
      price: 'ベーシック'
    },
    {
      id: 4,
      title: 'Pythonで機械学習入門',
      description: 'プログラミング言語Pythonを使った機械学習の基礎概念と実装方法を学習します。',
      department: 'AI・機械学習学部',
      difficulty: '上級',
      duration: '5時間',
      enrolledCount: 456,
      rating: 4.6,
      thumbnail: '🐍',
      tags: ['Python', '機械学習', 'プログラミング'],
      price: 'プレミアム'
    },
    {
      id: 5,
      title: 'ビジネスメールをAIで効率化',
      description: 'AIツールを使ってビジネスメールの作成を効率化し、コミュニケーション品質を向上させる方法を学びます。',
      department: '業務効率化学部',
      difficulty: '初級',
      duration: '1時間',
      enrolledCount: 987,
      rating: 4.5,
      thumbnail: '📧',
      tags: ['メール', 'AI', 'コミュニケーション'],
      price: '無料'
    },
    {
      id: 6,
      title: 'Webサイト制作をAIで加速',
      description: 'AIツールを活用してWebサイト制作のワークフローを効率化し、開発スピードを向上させる手法を学習します。',
      department: 'Web開発学部',
      difficulty: '中級',
      duration: '4時間',
      enrolledCount: 623,
      rating: 4.8,
      thumbnail: '🌐',
      tags: ['Web開発', 'AI', 'ツール'],
      price: 'プレミアム'
    }
  ]

  // 難易度バッジの色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '初級': return 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
      case '中級': return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
      case '上級': return 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    }
  }

  // 価格バッジの色
  const getPriceColor = (price: string) => {
    switch (price) {
      case '無料': return 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
      case 'ベーシック': return 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
      case 'プレミアム': return 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    }
  }

  return (
    <DashboardLayout 
      title="コース一覧"
      description="AIスキルを体系的に学べる豊富なコースをご用意しています"
      actions={
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
            <Filter className="w-4 h-4 mr-2" />
            フィルター
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Search className="w-4 h-4 mr-2" />
            詳細検索
          </button>
        </div>
      }
    >
      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{courses.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">総コース数</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {courses.reduce((sum, course) => sum + course.enrolledCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">総受講者数</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {(courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">平均評価</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {courses.filter(course => course.price === '無料').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">無料コース</div>
            </div>
          </div>
        </div>
      </div>

      {/* コース一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            {/* コースサムネイル */}
            <div className="relative">
              <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-xl flex items-center justify-center">
                <div className="text-6xl">{course.thumbnail}</div>
              </div>
              
              {/* バッジ */}
              <div className="absolute top-4 left-4 flex space-x-2">
                {course.isNew && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    NEW
                  </span>
                )}
                {course.isPopular && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    人気
                  </span>
                )}
              </div>
              
              {/* 価格バッジ */}
              <div className="absolute top-4 right-4">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriceColor(course.price)}`}>
                  {course.price}
                </span>
              </div>
            </div>

            {/* コース情報 */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{course.department}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                {course.title}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {course.description}
              </p>

              {/* メタ情報 */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {course.enrolledCount.toLocaleString()}
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  {course.rating}
                </div>
              </div>

              {/* タグ */}
              <div className="flex flex-wrap gap-1 mb-4">
                {course.tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* アクションボタン */}
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  学習開始
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <BookOpen className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ページネーション */}
      <div className="mt-12 flex justify-center">
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            前へ
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`px-3 py-2 rounded-lg ${
                page === 1 
                  ? 'bg-blue-600 text-white' 
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            次へ
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export const metadata = {
  title: 'コース一覧 - はじめて.AI',
  description: 'AIスキルを体系的に学べる豊富なコースをご用意しています。基礎から応用まで、あなたのレベルに合ったコースを見つけてください。'
}