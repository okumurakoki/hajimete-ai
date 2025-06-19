'use client'

import { useState, useEffect } from 'react'
import { 
  Video,
  Settings,
  Key,
  Globe,
  Save,
  Play,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Trash2,
  Plus,
  Edit
} from 'lucide-react'

interface StreamingPlatformConfig {
  id: string
  platform: 'zoom' | 'vimeo' | 'youtube' | 'twitch' | 'custom'
  name: string
  isEnabled: boolean
  
  // Zoom settings
  zoomConfig?: {
    sdkKey: string
    sdkSecret: string
    accountId: string
    webhookSecret?: string
  }
  
  // Vimeo settings
  vimeoConfig?: {
    accessToken: string
    clientId: string
    clientSecret: string
    redirectUri?: string
  }
  
  // YouTube settings
  youtubeConfig?: {
    apiKey: string
    clientId: string
    clientSecret: string
    channelId?: string
  }
  
  // Twitch settings
  twitchConfig?: {
    clientId: string
    clientSecret: string
    redirectUri?: string
    streamKey?: string
  }
  
  // Custom settings
  customConfig?: {
    name: string
    embedBaseUrl: string
    apiKey?: string
    webhookUrl?: string
  }
}

interface StreamingConfigProps {
  onConfigChange?: (configs: StreamingPlatformConfig[]) => void
}

export default function StreamingConfig({ onConfigChange }: StreamingConfigProps) {
  const [configs, setConfigs] = useState<StreamingPlatformConfig[]>([])
  const [selectedConfig, setSelectedConfig] = useState<StreamingPlatformConfig | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean}>({})
  const [testResults, setTestResults] = useState<{[key: string]: 'success' | 'error' | 'testing'}>({})

  useEffect(() => {
    // Load existing configurations
    loadConfigurations()
  }, [])

  const loadConfigurations = () => {
    // Mock data - in real implementation, load from API
    const mockConfigs: StreamingPlatformConfig[] = [
      {
        id: 'zoom-1',
        platform: 'zoom',
        name: 'Zoom Main Account',
        isEnabled: true,
        zoomConfig: {
          sdkKey: 'your-zoom-sdk-key',
          sdkSecret: 'your-zoom-sdk-secret',
          accountId: 'your-zoom-account-id',
          webhookSecret: 'your-webhook-secret'
        }
      },
      {
        id: 'vimeo-1',
        platform: 'vimeo',
        name: 'Vimeo Pro Account',
        isEnabled: true,
        vimeoConfig: {
          accessToken: 'your-vimeo-access-token',
          clientId: 'your-vimeo-client-id',
          clientSecret: 'your-vimeo-client-secret',
          redirectUri: 'https://yourdomain.com/auth/vimeo/callback'
        }
      },
      {
        id: 'youtube-1',
        platform: 'youtube',
        name: 'YouTube Channel',
        isEnabled: false,
        youtubeConfig: {
          apiKey: 'your-youtube-api-key',
          clientId: 'your-youtube-client-id',
          clientSecret: 'your-youtube-client-secret',
          channelId: 'your-channel-id'
        }
      }
    ]
    
    setConfigs(mockConfigs)
    if (mockConfigs.length > 0) {
      setSelectedConfig(mockConfigs[0])
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'zoom': return <Video className="text-blue-600" size={12} />
      case 'vimeo': return <Video className="text-cyan-600" size={12} />
      case 'youtube': return <Video className="text-red-600" size={12} />
      case 'twitch': return <Video className="text-purple-600" size={12} />
      case 'custom': return <Globe className="text-gray-600" size={12} />
      default: return <Settings className="text-gray-600" size={12} />
    }
  }

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'zoom': return 'Zoom'
      case 'vimeo': return 'Vimeo'
      case 'youtube': return 'YouTube'
      case 'twitch': return 'Twitch'
      case 'custom': return 'カスタム'
      default: return 'その他'
    }
  }

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

  const testConnection = async (configId: string) => {
    setTestResults(prev => ({
      ...prev,
      [configId]: 'testing'
    }))

    try {
      // Mock API test - in real implementation, test actual connection
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setTestResults(prev => ({
        ...prev,
        [configId]: 'success'
      }))
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [configId]: 'error'
      }))
    }
  }

  const saveConfiguration = (config: StreamingPlatformConfig) => {
    const updatedConfigs = configs.map(c => 
      c.id === config.id ? config : c
    )
    
    if (!configs.find(c => c.id === config.id)) {
      updatedConfigs.push(config)
    }
    
    setConfigs(updatedConfigs)
    setSelectedConfig(config)
    setIsEditing(false)
    onConfigChange?.(updatedConfigs)
  }

  const deleteConfiguration = (configId: string) => {
    if (confirm('この設定を削除しますか？')) {
      const updatedConfigs = configs.filter(c => c.id !== configId)
      setConfigs(updatedConfigs)
      setSelectedConfig(updatedConfigs[0] || null)
      onConfigChange?.(updatedConfigs)
    }
  }

  const createNewConfig = (platform: string) => {
    const newConfig: StreamingPlatformConfig = {
      id: `${platform}-${Date.now()}`,
      platform: platform as any,
      name: `New ${getPlatformName(platform)} Config`,
      isEnabled: false
    }
    
    setSelectedConfig(newConfig)
    setIsEditing(true)
  }

  const renderConfigForm = () => {
    if (!selectedConfig) return null

    return (
      <div className="space-y-6">
        {/* Basic Settings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            設定名
          </label>
          <input
            type="text"
            value={selectedConfig.name}
            onChange={(e) => setSelectedConfig({
              ...selectedConfig,
              name: e.target.value
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={!isEditing}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isEnabled"
            checked={selectedConfig.isEnabled}
            onChange={(e) => setSelectedConfig({
              ...selectedConfig,
              isEnabled: e.target.checked
            })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            disabled={!isEditing}
          />
          <label htmlFor="isEnabled" className="ml-2 text-sm text-gray-700">
            この設定を有効にする
          </label>
        </div>

        {/* Platform-specific settings */}
        {selectedConfig.platform === 'zoom' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Zoom SDK設定</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SDK Key
              </label>
              <div className="relative">
                <input
                  type={showSecrets['zoom-sdk-key'] ? 'text' : 'password'}
                  value={selectedConfig.zoomConfig?.sdkKey || ''}
                  onChange={(e) => setSelectedConfig({
                    ...selectedConfig,
                    zoomConfig: {
                      ...selectedConfig.zoomConfig!,
                      sdkKey: e.target.value
                    }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-20 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!isEditing}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                  <button
                    type="button"
                    onClick={() => toggleSecret('zoom-sdk-key')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showSecrets['zoom-sdk-key'] ? <EyeOff size={10} /> : <Eye size={10} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedConfig.zoomConfig?.sdkKey || '')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy size={10} />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SDK Secret
              </label>
              <div className="relative">
                <input
                  type={showSecrets['zoom-sdk-secret'] ? 'text' : 'password'}
                  value={selectedConfig.zoomConfig?.sdkSecret || ''}
                  onChange={(e) => setSelectedConfig({
                    ...selectedConfig,
                    zoomConfig: {
                      ...selectedConfig.zoomConfig!,
                      sdkSecret: e.target.value
                    }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-20 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!isEditing}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                  <button
                    type="button"
                    onClick={() => toggleSecret('zoom-sdk-secret')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showSecrets['zoom-sdk-secret'] ? <EyeOff size={10} /> : <Eye size={10} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedConfig.zoomConfig?.sdkSecret || '')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy size={10} />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account ID
              </label>
              <input
                type="text"
                value={selectedConfig.zoomConfig?.accountId || ''}
                onChange={(e) => setSelectedConfig({
                  ...selectedConfig,
                  zoomConfig: {
                    ...selectedConfig.zoomConfig!,
                    accountId: e.target.value
                  }
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!isEditing}
              />
            </div>
          </div>
        )}

        {selectedConfig.platform === 'vimeo' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Vimeo API設定</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Token
              </label>
              <div className="relative">
                <input
                  type={showSecrets['vimeo-token'] ? 'text' : 'password'}
                  value={selectedConfig.vimeoConfig?.accessToken || ''}
                  onChange={(e) => setSelectedConfig({
                    ...selectedConfig,
                    vimeoConfig: {
                      ...selectedConfig.vimeoConfig!,
                      accessToken: e.target.value
                    }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-20 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!isEditing}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                  <button
                    type="button"
                    onClick={() => toggleSecret('vimeo-token')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showSecrets['vimeo-token'] ? <EyeOff size={10} /> : <Eye size={10} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedConfig.vimeoConfig?.accessToken || '')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy size={10} />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client ID
              </label>
              <input
                type="text"
                value={selectedConfig.vimeoConfig?.clientId || ''}
                onChange={(e) => setSelectedConfig({
                  ...selectedConfig,
                  vimeoConfig: {
                    ...selectedConfig.vimeoConfig!,
                    clientId: e.target.value
                  }
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!isEditing}
              />
            </div>
          </div>
        )}

        {/* Test Connection */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => testConnection(selectedConfig.id)}
            disabled={testResults[selectedConfig.id] === 'testing'}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Play size={10} />
            {testResults[selectedConfig.id] === 'testing' ? '接続テスト中...' : '接続テスト'}
          </button>
          
          {testResults[selectedConfig.id] === 'success' && (
            <div className="flex items-center gap-2 text-green-600 mt-2">
              <CheckCircle size={10} />
              接続に成功しました
            </div>
          )}
          
          {testResults[selectedConfig.id] === 'error' && (
            <div className="flex items-center gap-2 text-red-600 mt-2">
              <AlertCircle size={10} />
              接続に失敗しました
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Configuration List */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">配信プラットフォーム</h3>
              <div className="relative">
                <select
                  onChange={(e) => createNewConfig(e.target.value)}
                  value=""
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">新規追加</option>
                  <option value="zoom">Zoom</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="youtube">YouTube</option>
                  <option value="twitch">Twitch</option>
                  <option value="custom">カスタム</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="p-2">
            {configs.map((config) => (
              <div
                key={config.id}
                onClick={() => {
                  setSelectedConfig(config)
                  setIsEditing(false)
                }}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedConfig?.id === config.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getPlatformIcon(config.platform)}
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">
                        {config.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {getPlatformName(config.platform)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {config.isEnabled ? (
                      <CheckCircle size={10} className="text-green-600" />
                    ) : (
                      <AlertCircle size={10} className="text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {configs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Settings size={19} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm">配信プラットフォームを追加してください</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Configuration Details */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedConfig && getPlatformIcon(selectedConfig.platform)}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedConfig ? selectedConfig.name : '設定を選択してください'}
                  </h3>
                  {selectedConfig && (
                    <p className="text-sm text-gray-500">
                      {getPlatformName(selectedConfig.platform)} 設定
                    </p>
                  )}
                </div>
              </div>
              
              {selectedConfig && (
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={() => saveConfiguration(selectedConfig)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Save size={10} />
                        保存
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Edit size={10} />
                        編集
                      </button>
                      <button
                        onClick={() => deleteConfiguration(selectedConfig.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <Trash2 size={10} />
                        削除
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6">
            {selectedConfig ? (
              renderConfigForm()
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Settings size={29} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  配信プラットフォーム設定
                </h3>
                <p className="mb-4">
                  左側のリストから設定を選択するか、新しい設定を追加してください
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['zoom', 'vimeo', 'youtube', 'twitch'].map((platform) => (
                    <button
                      key={platform}
                      onClick={() => createNewConfig(platform)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {getPlatformIcon(platform)}
                      {getPlatformName(platform)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}