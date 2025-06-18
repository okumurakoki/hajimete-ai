  import Link from 'next/link'

  export default function Home() {
    const departments = [
      {
        id: '1',
        name: 'AI基礎学部',
        slug: 'ai-basics',
        description: 'AIの基本概念から実践的な活用方法まで学ぶ',
        colorPrimary: '#3B82F6',
        icon: '🤖',
        accessLevel: 'basic'
      },
      {
        id: '2',
        name: '業務効率化学部',
        slug: 'productivity',
        description:
  '日常業務にAIを活用して生産性を向上させる方法',
        colorPrimary: '#10B981',
        icon: '⚡',
        accessLevel: 'basic'
      },
      {
        id: '3',
        name: '実践応用学部',
        slug: 'practical-application',
        description: '実際のビジネス現場でのAI活用事例と実践',
        colorPrimary: '#F97316',
        icon: '🚀',
        accessLevel: 'basic'
      },
      {
        id: '4',
        name: 'キャッチアップ学部',
        slug: 'catchup',
        description: '最新のAI技術とトレンドを学ぶプレミアム講座',
        colorPrimary: '#8B5CF6',
        icon: '⭐',
        accessLevel: 'premium'
      }
    ]

    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 
  to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              はじめて<span className="text-blue-600">.AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              AI学習の第一歩を始めよう
            </p>

            {/* 4学部セクション */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 
  mb-8">学部一覧</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 
  lg:grid-cols-4 gap-6">
                {departments.map((dept) => (
                  <div key={dept.id} className="bg-white p-6 
  rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="text-4xl 
  mb-4">{dept.icon}</div>
                    <h3 className="text-lg font-semibold mb-2" 
  style={{color: dept.colorPrimary}}>
                      {dept.name}
                    </h3>
                    <p className="text-gray-600 text-sm 
  mb-4">{dept.description}</p>
                    <Link 
                      href={`/${dept.slug}`}
                      className="inline-block px-4 py-2 rounded 
  text-white text-sm"
                      style={{backgroundColor: dept.colorPrimary}}
                    >
                      詳細を見る
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-md 
  max-w-md mx-auto">
                <h3 className="text-lg font-semibold 
  mb-2">ベーシックプラン</h3>
                <p className="text-3xl font-bold 
  text-blue-600">¥1,650<span className="text-sm 
  text-gray-500">/月</span></p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md 
  max-w-md mx-auto">
                <h3 className="text-lg font-semibold 
  mb-2">プレミアムプラン</h3>
                <p className="text-3xl font-bold 
  text-blue-600">¥5,500<span className="text-sm 
  text-gray-500">/月</span></p>
              </div>
            </div>
            <div className="space-x-4">
              <Link href="/dashboard" className="bg-blue-600 
  text-white px-8 py-3 rounded-lg hover:bg-blue-700 
  transition-colors">
                ダッシュボード
              </Link>
              <Link href="/videos" className="border 
  border-blue-600 text-blue-600 px-8 py-3 rounded-lg 
  hover:bg-blue-50 transition-colors">
                動画を見る
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }
