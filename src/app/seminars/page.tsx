import { DashboardLayout } from '@/components/layout/Layout'

export default function Seminars() {
  return (
    <DashboardLayout 
      title="セミナー予約"
      description="実践的なAI活用セミナーにご参加ください"
    >
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">AIセミナー 第{i}回</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">2024年7月{i + 15}日 19:00-20:30</p>
                <p className="text-gray-700 dark:text-gray-300">実践的なAI活用方法について学びます</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                予約する
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}