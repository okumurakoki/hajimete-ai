'use client'

import { useState, useEffect, useRef } from 'react'
// import { useUser } from '@clerk/nextjs'
import { ChatMessage } from '@/lib/live'

interface LiveChatProps {
  streamId: string
  isLive: boolean
}

export default function LiveChat({ streamId, isLive }: LiveChatProps) {
  // const { user } = useUser()
  const user = { id: 'user123', firstName: 'ユーザー', lastName: '' } // Mock for build compatibility
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // モックデータでチャットを初期化
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        userId: 'system',
        username: 'システム',
        message: 'ライブ配信が開始されました！',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        type: 'system'
      },
      {
        id: '2',
        userId: 'user1',
        username: '田中太郎',
        message: 'こんにちは！楽しみにしていました',
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        type: 'message'
      },
      {
        id: '3',
        userId: 'user2',
        username: '佐藤花子',
        message: 'よろしくお願いします🙂',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        type: 'message'
      },
      {
        id: '4',
        userId: 'user3',
        username: '山田次郎',
        message: 'ChatGPTの新機能について質問があります',
        timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        type: 'message'
      },
      {
        id: '5',
        userId: 'user4',
        username: '鈴木美咲',
        message: '音声クリアです！',
        timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
        type: 'message'
      }
    ]
    setMessages(mockMessages)
    setIsConnected(true)
  }, [streamId])

  const sendMessage = () => {
    if (!newMessage.trim() || !user) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.firstName + ' ' + user.lastName,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'message'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // リアルタイム感のため、少し遅れて他の人のリアクションを追加
    setTimeout(() => {
      const reactions = ['👍', '👏', '🎉', '💡', '❤️']
      const randomReaction = reactions[Math.floor(Math.random() * reactions.length)]
      
      if (Math.random() > 0.7) { // 30%の確率でリアクション
        const reactionMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          userId: 'user' + Math.floor(Math.random() * 100),
          username: 'リスナー',
          message: randomReaction,
          timestamp: new Date().toISOString(),
          type: 'reaction'
        }
        setMessages(prev => [...prev, reactionMessage])
      }
    }, 1000 + Math.random() * 3000)
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isLive) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-gray-400 text-4xl mb-4">💬</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">チャットは配信中のみ利用可能です</h3>
        <p className="text-gray-500">ライブ配信開始までお待ちください</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">ライブチャット</h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? '接続中' : '切断中'}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          参加者全員でリアルタイムにコミュニケーションしましょう
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 max-h-96">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-2">
            {message.type === 'system' ? (
              <div className="w-full text-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                  {message.message}
                </span>
              </div>
            ) : message.type === 'reaction' ? (
              <div className="w-full">
                <span className="text-2xl">{message.message}</span>
              </div>
            ) : (
              <>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  {message.username.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">{message.username}</span>
                    <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                  </div>
                  <div className="text-sm text-gray-700 break-words">
                    {message.message}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white rounded-b-lg">
        {user ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="メッセージを入力..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              maxLength={200}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              送信
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500 text-sm">
            チャットを利用するにはログインしてください
          </div>
        )}
      </div>

      {/* Quick Reactions */}
      {user && isLive && (
        <div className="px-4 pb-4">
          <div className="flex gap-2 justify-center">
            {['👍', '👏', '🎉', '💡', '❤️'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  const reactionMessage: ChatMessage = {
                    id: Date.now().toString(),
                    userId: user.id,
                    username: user.firstName + ' ' + user.lastName,
                    message: emoji,
                    timestamp: new Date().toISOString(),
                    type: 'reaction'
                  }
                  setMessages(prev => [...prev, reactionMessage])
                }}
                className="text-xl hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}