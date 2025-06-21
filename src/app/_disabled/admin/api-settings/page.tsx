'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import { useState } from 'react'
import { 
  Key, 
  Save, 
  Eye, 
  EyeOff, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Database,
  Cloud,
  Zap
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AdminApiSettingsPage() {
  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean}>({})
  const [apiKeys, setApiKeys] = useState({
    openai: 'sk-...',
    anthropic: 'sk-ant-...',
    vimeo: 'your-vimeo-token',
    zoom: 'your-zoom-key',
    stripe: 'sk_live_...',
    sendgrid: 'SG...',
    cloudflare: 'your-cf-token'
  })

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Show toast notification
  }

  return (
    <AdminLayout currentPage="api-settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API設定</h1>
          <p className="text-gray-600">
            外部サービスとの連携に必要なAPIキーとシークレットを管理します
          </p>
        </div>

        {/* AI Services */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-yellow-500" size={12} />
            <h3 className="text-lg font-semibold text-gray-900">AI サービス</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  type={showSecrets['openai'] ? 'text' : 'password'}
                  value={apiKeys.openai}
                  onChange={(e) => setApiKeys(prev => ({...prev, openai: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-20 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                  <button
                    onClick={() => toggleSecret('openai')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showSecrets['openai'] ? <EyeOff size={10} /> : <Eye size={10} />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(apiKeys.openai)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy size={10} />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anthropic API Key
              </label>
              <div className="relative">
                <input
                  type={showSecrets['anthropic'] ? 'text' : 'password'}
                  value={apiKeys.anthropic}
                  onChange={(e) => setApiKeys(prev => ({...prev, anthropic: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-20 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                  <button
                    onClick={() => toggleSecret('anthropic')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showSecrets['anthropic'] ? <EyeOff size={10} /> : <Eye size={10} />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(apiKeys.anthropic)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy size={10} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Media Services */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="text-blue-500" size={12} />
            <h3 className="text-lg font-semibold text-gray-900">メディア サービス</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vimeo Access Token
              </label>
              <div className="relative">
                <input
                  type={showSecrets['vimeo'] ? 'text' : 'password'}
                  value={apiKeys.vimeo}
                  onChange={(e) => setApiKeys(prev => ({...prev, vimeo: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-20 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                  <button
                    onClick={() => toggleSecret('vimeo')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showSecrets['vimeo'] ? <EyeOff size={10} /> : <Eye size={10} />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(apiKeys.vimeo)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy size={10} />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zoom SDK Key
              </label>
              <div className="relative">
                <input
                  type={showSecrets['zoom'] ? 'text' : 'password'}
                  value={apiKeys.zoom}
                  onChange={(e) => setApiKeys(prev => ({...prev, zoom: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-20 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                  <button
                    onClick={() => toggleSecret('zoom')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showSecrets['zoom'] ? <EyeOff size={10} /> : <Eye size={10} />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(apiKeys.zoom)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy size={10} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Cloud className="text-green-500" size={12} />
            <h3 className="text-lg font-semibold text-gray-900">インフラストラクチャ</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stripe Secret Key
              </label>
              <div className="relative">
                <input
                  type={showSecrets['stripe'] ? 'text' : 'password'}
                  value={apiKeys.stripe}
                  onChange={(e) => setApiKeys(prev => ({...prev, stripe: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-20 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                  <button
                    onClick={() => toggleSecret('stripe')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showSecrets['stripe'] ? <EyeOff size={10} /> : <Eye size={10} />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(apiKeys.stripe)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy size={10} />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SendGrid API Key
              </label>
              <div className="relative">
                <input
                  type={showSecrets['sendgrid'] ? 'text' : 'password'}
                  value={apiKeys.sendgrid}
                  onChange={(e) => setApiKeys(prev => ({...prev, sendgrid: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-20 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                  <button
                    onClick={() => toggleSecret('sendgrid')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showSecrets['sendgrid'] ? <EyeOff size={10} /> : <Eye size={10} />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(apiKeys.sendgrid)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy size={10} />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cloudflare API Token
              </label>
              <div className="relative">
                <input
                  type={showSecrets['cloudflare'] ? 'text' : 'password'}
                  value={apiKeys.cloudflare}
                  onChange={(e) => setApiKeys(prev => ({...prev, cloudflare: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-20 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                  <button
                    onClick={() => toggleSecret('cloudflare')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showSecrets['cloudflare'] ? <EyeOff size={10} /> : <Eye size={10} />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(apiKeys.cloudflare)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy size={10} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Save size={10} />
            保存
          </button>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <RefreshCw size={10} />
            接続テスト
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}