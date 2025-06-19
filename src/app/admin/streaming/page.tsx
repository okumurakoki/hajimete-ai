'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import StreamingConfig from '@/components/admin/StreamingConfig'

export const dynamic = 'force-dynamic'

export default function AdminStreamingPage() {
  return (
    <AdminLayout currentPage="streaming">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">配信設定管理</h1>
          <p className="text-gray-600">
            Zoom、Vimeo、YouTube等の配信プラットフォームの設定を一元管理します
          </p>
        </div>

        {/* Streaming Configuration */}
        <StreamingConfig
          onConfigChange={(configs) => {
            console.log('Streaming configs updated:', configs)
          }}
        />
      </div>
    </AdminLayout>
  )
}