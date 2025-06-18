'use client'

import { useState, useRef } from 'react'
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react'

interface VideoUploadProps {
  onUploadComplete?: (videoData: any) => void
  onUploadError?: (error: string) => void
  className?: string
}

export default function VideoUpload({ 
  onUploadComplete, 
  onUploadError,
  className = '' 
}: VideoUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadService, setUploadService] = useState<'vimeo' | 'cloudflare'>('vimeo')
  const [videoTitle, setVideoTitle] = useState('')
  const [videoDescription, setVideoDescription] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // 動画ファイルのバリデーション
      if (!file.type.startsWith('video/')) {
        onUploadError?.('動画ファイルを選択してください')
        return
      }
      
      // ファイルサイズチェック (500MB制限)
      const maxSize = 500 * 1024 * 1024 // 500MB
      if (file.size > maxSize) {
        onUploadError?.('ファイルサイズが500MBを超えています')
        return
      }
      
      setSelectedFile(file)
      setVideoTitle(file.name.replace(/\.[^/.]+$/, '')) // 拡張子を除去
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !videoTitle) {
      onUploadError?.('ファイルとタイトルを入力してください')
      return
    }

    setUploadStatus('uploading')
    setUploadProgress(0)

    try {
      if (uploadService === 'vimeo') {
        await uploadToVimeo()
      } else {
        await uploadToCloudFlare()
      }
    } catch (error) {
      setUploadStatus('error')
      onUploadError?.(error instanceof Error ? error.message : 'アップロードに失敗しました')
    }
  }

  const uploadToVimeo = async () => {
    if (!selectedFile) return

    // 1. VimeoアップロードURL取得
    const uploadResponse = await fetch('/api/vimeo/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        size: selectedFile.size,
        name: videoTitle,
        description: videoDescription
      })
    })

    if (!uploadResponse.ok) {
      throw new Error('Vimeoアップロードの初期化に失敗しました')
    }

    const { data } = await uploadResponse.json()
    
    // 2. 実際のファイルアップロード (TUSプロトコル使用)
    await uploadFileWithTUS(data.uploadLink, selectedFile)
    
    setUploadStatus('success')
    onUploadComplete?.({
      service: 'vimeo',
      vimeoUri: data.vimeoUri,
      title: videoTitle,
      description: videoDescription
    })
  }

  const uploadToCloudFlare = async () => {
    if (!selectedFile) return

    // 1. CloudFlareアップロードURL取得
    const uploadResponse = await fetch('/api/cloudflare/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        maxDurationSeconds: 3600
      })
    })

    if (!uploadResponse.ok) {
      throw new Error('CloudFlareアップロードの初期化に失敗しました')
    }

    const { data } = await uploadResponse.json()
    
    // 2. 実際のファイルアップロード
    await uploadFileToCloudFlare(data.uploadURL, selectedFile)
    
    setUploadStatus('success')
    onUploadComplete?.({
      service: 'cloudflare',
      cloudFlareId: data.uid,
      title: videoTitle,
      description: videoDescription
    })
  }

  const uploadFileWithTUS = async (uploadUrl: string, file: File) => {
    // TUSプロトコルの簡易実装
    const chunkSize = 5 * 1024 * 1024 // 5MB chunks
    let offset = 0

    while (offset < file.size) {
      const chunk = file.slice(offset, offset + chunkSize)
      
      const response = await fetch(uploadUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/offset+octet-stream',
          'Upload-Offset': offset.toString(),
          'Tus-Resumable': '1.0.0'
        },
        body: chunk
      })

      if (!response.ok) {
        throw new Error('ファイルアップロードに失敗しました')
      }

      offset += chunkSize
      const progress = Math.min((offset / file.size) * 100, 100)
      setUploadProgress(progress)
    }
  }

  const uploadFileToCloudFlare = async (uploadUrl: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const xhr = new XMLHttpRequest()
    
    return new Promise<void>((resolve, reject) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          setUploadProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve()
        } else {
          reject(new Error('アップロードに失敗しました'))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('ネットワークエラーが発生しました'))
      })

      xhr.open('POST', uploadUrl)
      xhr.send(formData)
    })
  }

  const resetUpload = () => {
    setUploadStatus('idle')
    setUploadProgress(0)
    setSelectedFile(null)
    setVideoTitle('')
    setVideoDescription('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">動画アップロード</h3>
      
      {/* アップロードサービス選択 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          アップロード先
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="vimeo"
              checked={uploadService === 'vimeo'}
              onChange={(e) => setUploadService(e.target.value as 'vimeo')}
              className="mr-2"
            />
            Vimeo
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="cloudflare"
              checked={uploadService === 'cloudflare'}
              onChange={(e) => setUploadService(e.target.value as 'cloudflare')}
              className="mr-2"
            />
            CloudFlare Stream
          </label>
        </div>
      </div>

      {uploadStatus === 'idle' && (
        <div className="space-y-4">
          {/* ファイル選択 */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {selectedFile ? selectedFile.name : '動画ファイルを選択'}
            </p>
            <p className="text-sm text-gray-500">
              MP4, MOV, AVIなどの動画ファイル (500MBまで)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {selectedFile && (
            <div className="space-y-4">
              {/* タイトル入力 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  動画タイトル *
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="動画のタイトルを入力"
                />
              </div>

              {/* 説明入力 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  説明
                </label>
                <textarea
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="動画の説明を入力（任意）"
                />
              </div>

              {/* アクションボタン */}
              <div className="flex space-x-3">
                <button
                  onClick={handleUpload}
                  disabled={!videoTitle}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  アップロード開始
                </button>
                <button
                  onClick={resetUpload}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {uploadStatus === 'uploading' && (
        <div className="text-center py-8">
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            アップロード中... {Math.round(uploadProgress)}%
          </p>
          <p className="text-xs text-gray-500 mt-2">
            ブラウザを閉じないでください
          </p>
        </div>
      )}

      {uploadStatus === 'success' && (
        <div className="text-center py-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h4 className="text-lg font-semibold text-green-800 mb-2">
            アップロード完了！
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            動画が正常にアップロードされました
          </p>
          <button
            onClick={resetUpload}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            新しい動画をアップロード
          </button>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="text-center py-8">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h4 className="text-lg font-semibold text-red-800 mb-2">
            アップロード失敗
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            アップロード中にエラーが発生しました
          </p>
          <button
            onClick={resetUpload}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            やり直す
          </button>
        </div>
      )}
    </div>
  )
}