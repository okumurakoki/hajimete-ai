'use client'

import { useState, useEffect } from 'react'
import { 
  Youtube, 
  Key, 
  Settings, 
  Eye, 
  EyeOff, 
  Copy, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Monitor,
  Mic,
  Camera,
  Wifi,
  Users
} from 'lucide-react'

interface YouTubeStreamConfig {
  apiKey: string
  channelId: string
  streamKey: string
  streamUrl: string
  title: string
  description: string
  privacy: 'public' | 'unlisted' | 'private'
  category: string
  language: string
  enableChat: boolean
  enableAutoStart: boolean
  maxViewers: number
  bitrate: number
  resolution: '720p' | '1080p' | '1440p' | '4K'
  frameRate: 30 | 60
}

interface YouTubeConfigProps {
  onConfigChange: (config: YouTubeStreamConfig) => void
  initialConfig?: Partial<YouTubeStreamConfig>
}

export default function YouTubeConfig({ onConfigChange, initialConfig }: YouTubeConfigProps) {
  const [config, setConfig] = useState<YouTubeStreamConfig>({
    apiKey: '',
    channelId: '',
    streamKey: '',
    streamUrl: 'rtmp://a.rtmp.youtube.com/live2/',
    title: '',
    description: '',
    privacy: 'unlisted',
    category: '27', // Education category
    language: 'ja',
    enableChat: true,
    enableAutoStart: false,
    maxViewers: 1000,
    bitrate: 4500,
    resolution: '1080p',
    frameRate: 30,
    ...initialConfig
  })

  const [showStreamKey, setShowStreamKey] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected')
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    onConfigChange(config)
  }, [config, onConfigChange])

  const handleConfigChange = (field: keyof YouTubeStreamConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateYouTubeConfig = async () => {
    setIsValidating(true)
    setConnectionStatus('connecting')
    
    // シミュレートされた検証プロセス
    setTimeout(() => {
      if (config.apiKey && config.channelId && config.streamKey) {
        setConnectionStatus('connected')
      } else {
        setConnectionStatus('error')
      }
      setIsValidating(false)
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('クリップボードにコピーしました')
  }

  const resetStreamKey = () => {
    if (confirm('ストリームキーをリセットしますか？現在のキーは無効になります。')) {
      const newKey = 'sk_live_' + Math.random().toString(36).substring(2, 15)
      handleConfigChange('streamKey', newKey)
      alert('新しいストリームキーが生成されました')
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <CheckCircle size={12} className="text-green-600" />
      case 'connecting': return <RefreshCw size={12} className="text-blue-600 animate-spin" />
      case 'error': return <XCircle size={12} className="text-red-600" />
      default: return <AlertCircle size={12} className="text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return '接続済み'
      case 'connecting': return '接続中...'
      case 'error': return '接続エラー'
      default: return '未接続'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Youtube size={19} className="text-red-600" />
          <h2 className="text-lg font-semibold">YouTube Live設定</h2>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm text-gray-600">{getStatusText()}</span>
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <Key size={12} />
          API設定
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube API キー *
            </label>
            <input
              type="password"
              value={config.apiKey}
              onChange={(e) => handleConfigChange('apiKey', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              placeholder="AIza..."
            />
            <p className="text-xs text-gray-500 mt-1">
              YouTube Data API v3のAPIキーを入力してください
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              チャンネルID *
            </label>
            <input
              type="text"
              value={config.channelId}
              onChange={(e) => handleConfigChange('channelId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              placeholder="UC..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ストリームキー *
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type={showStreamKey ? 'text' : 'password'}
                  value={config.streamKey}
                  onChange={(e) => handleConfigChange('streamKey', e.target.value)}
                  className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="配信キーを入力"
                />
                <button
                  type="button"
                  onClick={() => setShowStreamKey(!showStreamKey)}
                  className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                >
                  {showStreamKey ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(config.streamKey)}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                title="コピー"
              >
                <Copy size={12} />
              </button>
              <button
                type="button"
                onClick={resetStreamKey}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                title="リセット"
              >
                <RefreshCw size={12} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ストリームURL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={config.streamUrl}
                onChange={(e) => handleConfigChange('streamUrl', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="rtmp://a.rtmp.youtube.com/live2/"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(config.streamUrl)}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                title="コピー"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>

          <button
            onClick={validateYouTubeConfig}
            disabled={isValidating || !config.apiKey || !config.channelId}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isValidating ? (
              <>
                <RefreshCw size={12} className="animate-spin" />
                接続テスト中...
              </>
            ) : (
              <>
                <Wifi size={12} />
                接続テスト
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stream Settings */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <Settings size={12} />
          配信設定
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タイトル
            </label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => handleConfigChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              placeholder="配信タイトル"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              プライバシー設定
            </label>
            <select
              value={config.privacy}
              onChange={(e) => handleConfigChange('privacy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            >
              <option value="public">公開</option>
              <option value="unlisted">限定公開</option>
              <option value="private">非公開</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              解像度
            </label>
            <select
              value={config.resolution}
              onChange={(e) => handleConfigChange('resolution', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            >
              <option value="720p">720p (HD)</option>
              <option value="1080p">1080p (Full HD)</option>
              <option value="1440p">1440p (2K)</option>
              <option value="4K">4K (Ultra HD)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              フレームレート
            </label>
            <select
              value={config.frameRate}
              onChange={(e) => handleConfigChange('frameRate', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            >
              <option value={30}>30 FPS</option>
              <option value={60}>60 FPS</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ビットレート (kbps)
            </label>
            <input
              type="number"
              value={config.bitrate}
              onChange={(e) => handleConfigChange('bitrate', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              min="1000"
              max="9000"
              step="500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              最大視聴者数
            </label>
            <input
              type="number"
              value={config.maxViewers}
              onChange={(e) => handleConfigChange('maxViewers', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              min="1"
              max="10000"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            説明
          </label>
          <textarea
            value={config.description}
            onChange={(e) => handleConfigChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            placeholder="配信の説明を入力してください"
          />
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableChat"
              checked={config.enableChat}
              onChange={(e) => handleConfigChange('enableChat', e.target.checked)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="enableChat" className="ml-2 block text-sm text-gray-900">
              チャット機能を有効にする
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableAutoStart"
              checked={config.enableAutoStart}
              onChange={(e) => handleConfigChange('enableAutoStart', e.target.checked)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="enableAutoStart" className="ml-2 block text-sm text-gray-900">
              スケジュール時刻に自動開始
            </label>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <Monitor size={12} />
          配信品質情報
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Camera size={10} />
              <span className="text-xs text-gray-600">解像度</span>
            </div>
            <div className="font-semibold text-sm">{config.resolution}</div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Mic size={10} />
              <span className="text-xs text-gray-600">ビットレート</span>
            </div>
            <div className="font-semibold text-sm">{config.bitrate} kbps</div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <RefreshCw size={10} />
              <span className="text-xs text-gray-600">FPS</span>
            </div>
            <div className="font-semibold text-sm">{config.frameRate}</div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users size={10} />
              <span className="text-xs text-gray-600">最大視聴者</span>
            </div>
            <div className="font-semibold text-sm">{config.maxViewers}</div>
          </div>
        </div>
      </div>
    </div>
  )
}