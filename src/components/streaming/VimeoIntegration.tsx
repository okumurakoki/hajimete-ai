'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Settings,
  RotateCcw,
  RotateCw,
  Monitor,
  Download,
  Share2,
  Heart,
  MessageCircle,
  Eye,
  Clock,
  BarChart3
} from 'lucide-react'

interface VimeoConfig {
  videoId: string
  accessToken?: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  responsive?: boolean
  width?: number
  height?: number
  quality?: 'auto' | '240p' | '360p' | '480p' | '720p' | '1080p'
}

interface VimeoPlayerStats {
  duration: number
  currentTime: number
  buffered: number
  volume: number
  playbackRate: number
  quality: string
  viewCount: number
  likeCount: number
  commentCount: number
}

interface VimeoIntegrationProps {
  config: VimeoConfig
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onTimeUpdate?: (time: number) => void
  className?: string
}

declare global {
  interface Window {
    Vimeo: any
  }
}

export default function VimeoIntegration({
  config,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  className = ""
}: VimeoIntegrationProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(config.muted || false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [stats, setStats] = useState<VimeoPlayerStats>({
    duration: 0,
    currentTime: 0,
    buffered: 0,
    volume: 1,
    playbackRate: 1,
    quality: 'auto',
    viewCount: 0,
    likeCount: 0,
    commentCount: 0
  })
  const [error, setError] = useState<string | null>(null)
  const [videoInfo, setVideoInfo] = useState<any>(null)
  
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    initializeVimeoPlayer()
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [config.videoId])

  const initializeVimeoPlayer = async () => {
    try {
      // Vimeo Player SDK をロード
      if (!window.Vimeo) {
        await loadVimeoSDK()
      }

      const iframe = document.createElement('iframe')
      iframe.src = `https://player.vimeo.com/video/${config.videoId}?h=0&badge=0&autopause=0&player_id=0&app_id=58479`
      iframe.width = (config.width || 640).toString()
      iframe.height = (config.height || 360).toString()
      iframe.frameBorder = '0'
      iframe.allow = 'autoplay; fullscreen; picture-in-picture'
      iframe.allowFullscreen = true

      const container = document.getElementById('vimeo-player-container')
      if (container) {
        container.innerHTML = ''
        container.appendChild(iframe)
      }

      // Vimeo Player の初期化
      playerRef.current = new window.Vimeo.Player(iframe)

      // イベントリスナーの設定
      setupEventListeners()

      // 動画情報の取得
      await fetchVideoInfo()

      setIsLoading(false)
    } catch (err) {
      console.error('Vimeo Player initialization failed:', err)
      setError('Vimeo プレイヤーの初期化に失敗しました')
      setIsLoading(false)
    }
  }

  const loadVimeoSDK = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://player.vimeo.com/api/player.js'
      script.onload = () => resolve()
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  const setupEventListeners = () => {
    if (!playerRef.current) return

    playerRef.current.on('play', () => {
      setIsPlaying(true)
      onPlay?.()
    })

    playerRef.current.on('pause', () => {
      setIsPlaying(false)
      onPause?.()
    })

    playerRef.current.on('ended', () => {
      setIsPlaying(false)
      onEnded?.()
    })

    playerRef.current.on('timeupdate', (data: any) => {
      setStats(prev => ({
        ...prev,
        currentTime: data.seconds,
        duration: data.duration
      }))
      onTimeUpdate?.(data.seconds)
    })

    playerRef.current.on('volumechange', (data: any) => {
      setStats(prev => ({
        ...prev,
        volume: data.volume
      }))
      setIsMuted(data.volume === 0)
    })

    playerRef.current.on('playbackratechange', (data: any) => {
      setStats(prev => ({
        ...prev,
        playbackRate: data.playbackRate
      }))
    })

    playerRef.current.on('qualitychange', (data: any) => {
      setStats(prev => ({
        ...prev,
        quality: data.quality
      }))
    })

    playerRef.current.on('error', (error: any) => {
      console.error('Vimeo Player error:', error)
      setError('動画の再生中にエラーが発生しました')
    })
  }

  const fetchVideoInfo = async () => {
    try {
      if (config.accessToken) {
        const response = await fetch(`https://api.vimeo.com/videos/${config.videoId}`, {
          headers: {
            'Authorization': `Bearer ${config.accessToken}`
          }
        })
        const data = await response.json()
        setVideoInfo(data)
        setStats(prev => ({
          ...prev,
          viewCount: data.stats?.plays || 0,
          likeCount: data.metadata?.connections?.likes?.total || 0,
          commentCount: data.metadata?.connections?.comments?.total || 0
        }))
      }
    } catch (err) {
      console.warn('Failed to fetch video info:', err)
    }
  }

  const togglePlay = async () => {
    if (!playerRef.current) return
    
    try {
      if (isPlaying) {
        await playerRef.current.pause()
      } else {
        await playerRef.current.play()
      }
    } catch (err) {
      console.error('Toggle play failed:', err)
    }
  }

  const toggleMute = async () => {
    if (!playerRef.current) return
    
    try {
      if (isMuted) {
        await playerRef.current.setVolume(stats.volume || 0.5)
      } else {
        await playerRef.current.setVolume(0)
      }
    } catch (err) {
      console.error('Toggle mute failed:', err)
    }
  }

  const setVolume = async (volume: number) => {
    if (!playerRef.current) return
    
    try {
      await playerRef.current.setVolume(volume)
    } catch (err) {
      console.error('Set volume failed:', err)
    }
  }

  const seekTo = async (time: number) => {
    if (!playerRef.current) return
    
    try {
      await playerRef.current.setCurrentTime(time)
    } catch (err) {
      console.error('Seek failed:', err)
    }
  }

  const setPlaybackRate = async (rate: number) => {
    if (!playerRef.current) return
    
    try {
      await playerRef.current.setPlaybackRate(rate)
    } catch (err) {
      console.error('Set playback rate failed:', err)
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    
    if (!isFullscreen) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const hideControlsAfterDelay = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  const showControlsTemporarily = () => {
    setShowControls(true)
    hideControlsAfterDelay()
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-96 bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vimeo 動画を読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-96 bg-red-50 rounded-lg border border-red-200 ${className}`}>
        <div className="text-center">
          <Play size={29} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">再生エラー</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              initializeVimeoPlayer()
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`relative bg-black rounded-lg overflow-hidden ${className}`}
      ref={containerRef}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Vimeo Player Container */}
      <div id="vimeo-player-container" className="w-full h-full min-h-96"></div>

      {/* カスタム オーバーレイコントロール */}
      {showControls && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
          {/* 中央の再生ボタン */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Play size={19} className="text-white ml-2" />
              </button>
            </div>
          )}

          {/* 上部の動画情報 */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex items-center justify-between text-white">
              <div>
                {videoInfo && (
                  <h3 className="font-semibold mb-1">{videoInfo.name}</h3>
                )}
                <div className="flex items-center gap-4 text-sm opacity-75">
                  {stats.viewCount > 0 && (
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      {stats.viewCount.toLocaleString()}
                    </div>
                  )}
                  {stats.likeCount > 0 && (
                    <div className="flex items-center gap-1">
                      <Heart size={14} />
                      {stats.likeCount.toLocaleString()}
                    </div>
                  )}
                  {stats.commentCount > 0 && (
                    <div className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      {stats.commentCount.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                  <Share2 size={10} />
                </button>
                <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                  <Download size={10} />
                </button>
              </div>
            </div>
          </div>

          {/* 下部のコントロールバー */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* プログレスバー */}
            <div className="mb-3">
              <div className="w-full h-1 bg-white/30 rounded-full cursor-pointer"
                   onClick={(e) => {
                     const rect = e.currentTarget.getBoundingClientRect()
                     const progress = (e.clientX - rect.left) / rect.width
                     seekTo(progress * stats.duration)
                   }}>
                <div 
                  className="h-full bg-blue-500 rounded-full relative"
                  style={{ width: `${(stats.currentTime / stats.duration) * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-white">
              {/* 左側のコントロール */}
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : stats.volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="text-sm">
                  {formatTime(stats.currentTime)} / {formatTime(stats.duration)}
                </div>
              </div>

              {/* 右側のコントロール */}
              <div className="flex items-center gap-2">
                <select
                  value={stats.playbackRate}
                  onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                  className="bg-white/20 text-white text-sm rounded px-2 py-1 border-none"
                >
                  <option value="0.5">0.5x</option>
                  <option value="1">1x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>

                <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
                  <Settings size={12} />
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  {isFullscreen ? <Minimize size={12} /> : <Maximize size={12} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 統計情報（開発モード） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-black/75 text-white text-xs p-2 rounded">
          <div>Quality: {stats.quality}</div>
          <div>Rate: {stats.playbackRate}x</div>
          <div>Volume: {Math.round(stats.volume * 100)}%</div>
        </div>
      )}
    </div>
  )
}