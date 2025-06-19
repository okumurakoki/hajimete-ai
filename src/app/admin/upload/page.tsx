'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import { useState } from 'react'
import { 
  Upload, 
  File, 
  Image, 
  Video, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader,
  Cloud,
  FolderOpen
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface UploadFile {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
  url?: string
}

export default function AdminUploadPage() {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [dragActive, setDragActive] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={10} className="text-blue-500" />
    if (type.startsWith('video/')) return <Video size={10} className="text-red-500" />
    if (type.includes('pdf') || type.includes('document')) return <FileText size={10} className="text-green-500" />
    return <File size={10} className="text-gray-500" />
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    const newUploads: UploadFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading'
    }))

    setUploadFiles(prev => [...prev, ...newUploads])

    // Simulate upload progress
    newUploads.forEach(upload => {
      simulateUpload(upload.id)
    })
  }

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + Math.random() * 20, 100)
          if (newProgress >= 100) {
            clearInterval(interval)
            return {
              ...file,
              progress: 100,
              status: Math.random() > 0.1 ? 'completed' : 'error',
              url: Math.random() > 0.1 ? `/uploads/${file.name}` : undefined
            }
          }
          return { ...file, progress: newProgress }
        }
        return file
      }))
    }, 500)
  }

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const retryUpload = (fileId: string) => {
    setUploadFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, progress: 0, status: 'uploading' }
        : file
    ))
    simulateUpload(fileId)
  }

  return (
    <AdminLayout currentPage="upload">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ファイルアップロード</h1>
          <p className="text-gray-600">
            動画、画像、ドキュメントなどのファイルをアップロードして管理します
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Cloud size={29} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ファイルをドラッグ&ドロップまたはクリックしてアップロード
            </h3>
            <p className="text-gray-500 mb-4">
              動画 (MP4, MOV)、画像 (JPG, PNG, GIF)、ドキュメント (PDF, DOC) をサポート
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
              accept="video/*,image/*,.pdf,.doc,.docx"
            />
            <label
              htmlFor="file-upload"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <Upload size={10} />
              ファイルを選択
            </label>
          </div>
        </div>

        {/* Upload Progress */}
        {uploadFiles.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">アップロード進行状況</h3>
            </div>
            <div className="p-4 space-y-4">
              {uploadFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                    
                    {file.status === 'uploading' && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}
                    
                    {file.status === 'completed' && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle size={10} />
                        <span className="text-sm">アップロード完了</span>
                      </div>
                    )}
                    
                    {file.status === 'error' && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle size={10} />
                        <span className="text-sm">アップロードエラー</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {file.status === 'error' && (
                      <button
                        onClick={() => retryUpload(file.id)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        再試行
                      </button>
                    )}
                    
                    {file.status === 'completed' && file.url && (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        表示
                      </a>
                    )}
                    
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">アップロードガイドライン</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">サポートファイル形式</h4>
              <ul className="space-y-1">
                <li>• 動画: MP4, MOV, AVI (最大2GB)</li>
                <li>• 画像: JPG, PNG, GIF (最大50MB)</li>
                <li>• ドキュメント: PDF, DOC, DOCX (最大100MB)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">推奨設定</h4>
              <ul className="space-y-1">
                <li>• 動画: 1080p, H.264エンコード</li>
                <li>• 画像: RGB, 72-300 DPI</li>
                <li>• ファイル名: 英数字推奨</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">最近のアップロード</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                <FolderOpen size={10} />
                すべて表示
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="text-center py-8 text-gray-500">
              <Upload size={19} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm">まだファイルがアップロードされていません</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}