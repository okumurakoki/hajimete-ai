'use client'

import CMSLayout from '@/components/cms/CMSLayout'
import { useState, useEffect } from 'react'
import { Key, Save, Eye, EyeOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface APIConfig {
  vimeo: {
    clientId: string
    clientSecret: string
    accessToken: string
    status: 'connected' | 'disconnected' | 'error'
  }
  zoom: {
    accountId: string
    clientId: string
    clientSecret: string
    status: 'connected' | 'disconnected' | 'error'
  }
  stripe: {
    publishableKey: string
    secretKey: string
    webhookSecret: string
    status: 'connected' | 'disconnected' | 'error'
  }
}

export default function APISettingsPage() {
  const [config, setConfig] = useState<APIConfig>({
    vimeo: {
      clientId: process.env.NEXT_PUBLIC_VIMEO_CLIENT_ID || '',
      clientSecret: '',
      accessToken: '',
      status: 'disconnected'
    },
    zoom: {
      accountId: process.env.NEXT_PUBLIC_ZOOM_ACCOUNT_ID || '',
      clientId: process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID || '',
      clientSecret: '',
      status: 'disconnected'
    },
    stripe: {
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
      secretKey: '',
      webhookSecret: '',
      status: 'disconnected'
    }
  })

  const [showSecrets, setShowSecrets] = useState({
    vimeo: false,
    zoom: false,
    stripe: false
  })

  const [testing, setTesting] = useState({
    vimeo: false,
    zoom: false,
    stripe: false
  })

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // API設定の読み込み（モック）
    loadAPIConfigs()
  }, [])

  const loadAPIConfigs = async () => {
    // 実際の実装では、セキュアなエンドポイントから設定を読み込み
    // ここではモックデータで状態をシミュレート
    setConfig(prev => ({
      ...prev,
      vimeo: { ...prev.vimeo, status: prev.vimeo.accessToken ? 'connected' : 'disconnected' },
      zoom: { ...prev.zoom, status: prev.zoom.clientSecret ? 'connected' : 'disconnected' },
      stripe: { ...prev.stripe, status: prev.stripe.secretKey ? 'connected' : 'disconnected' }
    }))
  }

  const handleConfigChange = (service: keyof APIConfig, field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      [service]: {
        ...prev[service],
        [field]: value
      }
    }))
  }

  const testConnection = async (service: keyof APIConfig) => {
    setTesting(prev => ({ ...prev, [service]: true }))
    
    try {
      // API接続テスト
      await new Promise(resolve => setTimeout(resolve, 2000)) // シミュレーション
      
      // 成功の場合
      setConfig(prev => ({
        ...prev,
        [service]: { ...prev[service], status: 'connected' }
      }))
      
      alert(`${service.toUpperCase()} APIの接続テストが成功しました！`)
    } catch (error) {
      setConfig(prev => ({
        ...prev,
        [service]: { ...prev[service], status: 'error' }
      }))
      
      alert(`${service.toUpperCase()} APIの接続テストが失敗しました。設定を確認してください。`)
    } finally {
      setTesting(prev => ({ ...prev, [service]: false }))
    }
  }

  const saveConfigs = async () => {
    setSaving(true)
    
    try {
      // 設定の保存（実際の実装では、セキュアなエンドポイントに送信）
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      alert('API設定が正常に保存されました！')
    } catch (error) {
      alert('設定の保存に失敗しました。もう一度お試しください。')
    } finally {
      setSaving(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle size={12} className="text-green-500" />
      case 'error':
        return <AlertCircle size={12} className="text-red-500" />
      default:
        return <AlertCircle size={12} className="text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return '接続済み'
      case 'error':
        return 'エラー'
      default:
        return '未接続'
    }
  }

  const maskSecret = (value: string, show: boolean) => {
    if (!value) return ''
    if (show) return value
    return '•'.repeat(Math.min(value.length, 20))
  }

  return (
    <CMSLayout currentPage="api-settings">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API設定</h1>
          <p className="text-gray-600">外部サービスとの連携に必要なAPI設定を管理します</p>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle size={12} className="text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-yellow-800">セキュリティに関する注意</h3>
              <p className="text-sm text-yellow-700 mt-1">
                APIキーは機密情報です。安全な環境でのみ入力し、他の人と共有しないでください。
                実際の運用では、これらの設定は暗号化されて保存されます。
              </p>
            </div>
          </div>
        </div>

        {/* Vimeo API Settings */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Key size={12} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Vimeo API</h2>
                <p className="text-sm text-gray-600">動画ホスティングとストリーミング</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(config.vimeo.status)}
              <span className="text-sm font-medium">{getStatusText(config.vimeo.status)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client ID
              </label>
              <input
                type="text"
                value={config.vimeo.clientId}
                onChange={(e) => handleConfigChange('vimeo', 'clientId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Vimeo Client ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Secret
              </label>
              <div className="relative">
                <input
                  type={showSecrets.vimeo ? 'text' : 'password'}
                  value={showSecrets.vimeo ? config.vimeo.clientSecret : maskSecret(config.vimeo.clientSecret, false)}
                  onChange={(e) => handleConfigChange('vimeo', 'clientSecret', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="Vimeo Client Secret"
                />
                <button
                  type="button"
                  onClick={() => setShowSecrets(prev => ({ ...prev, vimeo: !prev.vimeo }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecrets.vimeo ? <EyeOff size={10} /> : <Eye size={10} />}
                </button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Token
              </label>
              <div className="relative">
                <input
                  type={showSecrets.vimeo ? 'text' : 'password'}
                  value={showSecrets.vimeo ? config.vimeo.accessToken : maskSecret(config.vimeo.accessToken, false)}
                  onChange={(e) => handleConfigChange('vimeo', 'accessToken', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="Vimeo Access Token"
                />
                <button
                  type="button"
                  onClick={() => setShowSecrets(prev => ({ ...prev, vimeo: !prev.vimeo }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecrets.vimeo ? <EyeOff size={10} /> : <Eye size={10} />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => testConnection('vimeo')}
              disabled={testing.vimeo || !config.vimeo.accessToken}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={10} className={testing.vimeo ? 'animate-spin' : ''} />
              {testing.vimeo ? '接続テスト中...' : '接続テスト'}
            </button>
            <a
              href="https://developer.vimeo.com/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Vimeo開発者コンソールで設定 →
            </a>
          </div>
        </div>

        {/* Zoom API Settings */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Key size={12} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Zoom API</h2>
                <p className="text-sm text-gray-600">オンラインミーティングとウェビナー</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(config.zoom.status)}
              <span className="text-sm font-medium">{getStatusText(config.zoom.status)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account ID
              </label>
              <input
                type="text"
                value={config.zoom.accountId}
                onChange={(e) => handleConfigChange('zoom', 'accountId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Zoom Account ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client ID
              </label>
              <input
                type="text"
                value={config.zoom.clientId}
                onChange={(e) => handleConfigChange('zoom', 'clientId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Zoom Client ID"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Secret
              </label>
              <div className="relative">
                <input
                  type={showSecrets.zoom ? 'text' : 'password'}
                  value={showSecrets.zoom ? config.zoom.clientSecret : maskSecret(config.zoom.clientSecret, false)}
                  onChange={(e) => handleConfigChange('zoom', 'clientSecret', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="Zoom Client Secret"
                />
                <button
                  type="button"
                  onClick={() => setShowSecrets(prev => ({ ...prev, zoom: !prev.zoom }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecrets.zoom ? <EyeOff size={10} /> : <Eye size={10} />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => testConnection('zoom')}
              disabled={testing.zoom || !config.zoom.clientSecret}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={10} className={testing.zoom ? 'animate-spin' : ''} />
              {testing.zoom ? '接続テスト中...' : '接続テスト'}
            </button>
            <a
              href="https://marketplace.zoom.us/develop/create"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Zoom Marketplaceで設定 →
            </a>
          </div>
        </div>

        {/* Stripe API Settings */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Key size={12} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Stripe API</h2>
                <p className="text-sm text-gray-600">決済処理とサブスクリプション管理</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(config.stripe.status)}
              <span className="text-sm font-medium">{getStatusText(config.stripe.status)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publishable Key
              </label>
              <input
                type="text"
                value={config.stripe.publishableKey}
                onChange={(e) => handleConfigChange('stripe', 'publishableKey', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="pk_test_..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secret Key
              </label>
              <div className="relative">
                <input
                  type={showSecrets.stripe ? 'text' : 'password'}
                  value={showSecrets.stripe ? config.stripe.secretKey : maskSecret(config.stripe.secretKey, false)}
                  onChange={(e) => handleConfigChange('stripe', 'secretKey', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="sk_test_..."
                />
                <button
                  type="button"
                  onClick={() => setShowSecrets(prev => ({ ...prev, stripe: !prev.stripe }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecrets.stripe ? <EyeOff size={10} /> : <Eye size={10} />}
                </button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook Secret
              </label>
              <div className="relative">
                <input
                  type={showSecrets.stripe ? 'text' : 'password'}
                  value={showSecrets.stripe ? config.stripe.webhookSecret : maskSecret(config.stripe.webhookSecret, false)}
                  onChange={(e) => handleConfigChange('stripe', 'webhookSecret', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="whsec_..."
                />
                <button
                  type="button"
                  onClick={() => setShowSecrets(prev => ({ ...prev, stripe: !prev.stripe }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecrets.stripe ? <EyeOff size={10} /> : <Eye size={10} />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => testConnection('stripe')}
              disabled={testing.stripe || !config.stripe.secretKey}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={10} className={testing.stripe ? 'animate-spin' : ''} />
              {testing.stripe ? '接続テスト中...' : '接続テスト'}
            </button>
            <a
              href="https://dashboard.stripe.com/apikeys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Stripeダッシュボードで設定 →
            </a>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveConfigs}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={10} />
            {saving ? '保存中...' : 'すべての設定を保存'}
          </button>
        </div>
      </div>
    </CMSLayout>
  )
}