'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  Settings, 
  Users,
  MessageCircle,
  Phone,
  PhoneOff,
  Maximize,
  Minimize,
  Volume2,
  VolumeX
} from 'lucide-react'

interface ZoomConfig {
  meetingNumber: string
  userName: string
  userEmail: string
  passWord?: string
  role: 0 | 1 // 0 = attendee, 1 = host
  sdkKey: string
  sdkSecret: string
  signature: string
}

interface ZoomIntegrationProps {
  config: ZoomConfig
  onJoinSuccess?: () => void
  onJoinError?: (error: any) => void
  onLeave?: () => void
  className?: string
}

declare global {
  interface Window {
    ZoomMtg: any
  }
}

export default function ZoomIntegration({ 
  config, 
  onJoinSuccess, 
  onJoinError, 
  onLeave,
  className = ""
}: ZoomIntegrationProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isJoined, setIsJoined] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [participants, setParticipants] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const zoomContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Zoom Web SDK の初期化
    const initializeZoom = async () => {
      try {
        // Zoom Web SDK をロード
        if (!window.ZoomMtg) {
          await loadZoomSDK()
        }

        window.ZoomMtg.setZoomJSLib('https://source.zoom.us/2.18.0/lib', '/av')
        window.ZoomMtg.preLoadWasm()
        window.ZoomMtg.prepareWebSDK()

        // CSS のカスタマイズ
        window.ZoomMtg.i18n.load('ja-JP')
        window.ZoomMtg.i18n.reload('ja-JP')

        setIsLoading(false)
      } catch (err) {
        console.error('Zoom SDK initialization failed:', err)
        setError('Zoom SDK の初期化に失敗しました')
        setIsLoading(false)
      }
    }

    initializeZoom()
  }, [])

  const loadZoomSDK = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://source.zoom.us/2.18.0/zoom-meeting-embedded.umd.min.js'
      script.onload = () => resolve()
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  const joinMeeting = async () => {
    if (!window.ZoomMtg) {
      setError('Zoom SDK が読み込まれていません')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      window.ZoomMtg.init({
        leaveUrl: window.location.origin,
        success: () => {
          window.ZoomMtg.join({
            meetingNumber: config.meetingNumber,
            userName: config.userName,
            signature: config.signature,
            apiKey: config.sdkKey,
            userEmail: config.userEmail,
            passWord: config.passWord || '',
            success: (result: any) => {
              console.log('Join meeting success:', result)
              setIsJoined(true)
              setIsLoading(false)
              onJoinSuccess?.()
            },
            error: (error: any) => {
              console.error('Join meeting error:', error)
              setError('ミーティングへの参加に失敗しました')
              setIsLoading(false)
              onJoinError?.(error)
            }
          })
        },
        error: (error: any) => {
          console.error('Zoom init error:', error)
          setError('Zoom の初期化に失敗しました')
          setIsLoading(false)
          onJoinError?.(error)
        }
      })
    } catch (err) {
      console.error('Join meeting failed:', err)
      setError('予期しないエラーが発生しました')
      setIsLoading(false)
    }
  }

  const leaveMeeting = () => {
    if (window.ZoomMtg) {
      window.ZoomMtg.leave({
        success: () => {
          setIsJoined(false)
          onLeave?.()
        }
      })
    }
  }

  const toggleVideo = () => {
    if (window.ZoomMtg && isJoined) {
      if (isVideoOn) {
        window.ZoomMtg.muteVideo({
          mute: true,
          success: () => setIsVideoOn(false)
        })
      } else {
        window.ZoomMtg.muteVideo({
          mute: false,
          success: () => setIsVideoOn(true)
        })
      }
    }
  }

  const toggleAudio = () => {
    if (window.ZoomMtg && isJoined) {
      if (isAudioOn) {
        window.ZoomMtg.muteAudio({
          mute: true,
          success: () => setIsAudioOn(false)
        })
      } else {
        window.ZoomMtg.muteAudio({
          mute: false,
          success: () => setIsAudioOn(true)
        })
      }
    }
  }

  const toggleScreenShare = () => {
    if (window.ZoomMtg && isJoined) {
      if (isScreenSharing) {
        window.ZoomMtg.stopShareScreen({
          success: () => setIsScreenSharing(false)
        })
      } else {
        window.ZoomMtg.startShareScreen({
          success: () => setIsScreenSharing(true)
        })
      }
    }
  }

  const toggleFullscreen = () => {
    if (zoomContainerRef.current) {
      if (!isFullscreen) {
        zoomContainerRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-96 bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Zoom ミーティングを準備中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-96 bg-red-50 rounded-lg border border-red-200 ${className}`}>
        <div className="text-center">
          <VideoOff size={29} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">接続エラー</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              joinMeeting()
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
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`} ref={zoomContainerRef}>
      {!isJoined ? (
        <div className="flex items-center justify-center min-h-96 bg-gradient-to-br from-blue-600 to-purple-600">
          <div className="text-center text-white">
            <Video size={64} className="mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">Zoom ミーティングに参加</h3>
            <p className="text-blue-100 mb-6">
              ミーティング ID: {config.meetingNumber}
            </p>
            <button
              onClick={joinMeeting}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 mx-auto"
            >
              <Video size={12} />
              参加する
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Zoom ミーティングコンテナ */}
          <div id="zmmtg-root" className="w-full h-full min-h-96"></div>

          {/* カスタム コントロールバー */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <div className="flex items-center justify-between">
              {/* 左側のコントロール */}
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full transition-colors ${
                    isVideoOn 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                  title={isVideoOn ? 'ビデオを停止' : 'ビデオを開始'}
                >
                  {isVideoOn ? <Video size={12} /> : <VideoOff size={12} />}
                </button>

                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full transition-colors ${
                    isAudioOn 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                  title={isAudioOn ? 'ミュート' : 'ミュート解除'}
                >
                  {isAudioOn ? <Mic size={12} /> : <MicOff size={12} />}
                </button>

                <button
                  onClick={toggleScreenShare}
                  className={`p-3 rounded-full transition-colors ${
                    isScreenSharing 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                  title={isScreenSharing ? '画面共有を停止' : '画面共有'}
                >
                  <Monitor size={12} />
                </button>
              </div>

              {/* 中央の情報 */}
              <div className="flex items-center gap-4 text-white">
                <div className="flex items-center gap-2">
                  <Users size={10} />
                  <span className="text-sm">{participants}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">ライブ</span>
                </div>
              </div>

              {/* 右側のコントロール */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                  title="チャット"
                >
                  <MessageCircle size={12} />
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                  title={isFullscreen ? 'フルスクリーン終了' : 'フルスクリーン'}
                >
                  {isFullscreen ? <Minimize size={12} /> : <Maximize size={12} />}
                </button>

                <button
                  className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                  title="設定"
                >
                  <Settings size={12} />
                </button>

                <button
                  onClick={leaveMeeting}
                  className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                  title="退出"
                >
                  <PhoneOff size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* チャットパネル */}
          {isChatOpen && (
            <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-lg border-l border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">チャット</h3>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4">
                <p className="text-gray-500 text-sm">チャット機能は開発中です</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}