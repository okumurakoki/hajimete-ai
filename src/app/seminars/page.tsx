import { DashboardLayout } from '@/components/layout/Layout'

export default function Seminars() {
  return (
    <DashboardLayout 
      title="セミナー予約"
      description="実践的なAI活用セミナーにご参加ください"
    >
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-2">AIセミナー 第{i}回</h3>
                <p className="text-gray-600 mb-2">2024年7月{i + 15}日 19:00-20:30</p>
                <p className="text-gray-700">実践的なAI活用方法について学びます</p>
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