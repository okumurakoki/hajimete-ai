'use client'

import { useState } from 'react'
export const dynamic = 'force-dynamic'

import AdminLayout from '@/components/AdminLayout'
import LiveStreamManager from '@/components/LiveStreamManager'

export default function AdminLive() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ライブ配信管理</h1>
            <p className="text-gray-600">リアルタイム配信の作成・管理</p>
          </div>
        </div>

        {/* ライブ配信管理コンポーネント */}
        <LiveStreamManager />
        
        {/* 配信ガイド */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">📡 配信開始までの手順</h3>
          <div className="space-y-3 text-blue-800">
            <div className="flex items-start space-x-3">
              <span className="bg-blue-200 text-blue-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</span>
              <div>
                <p className="font-medium">ライブ入力を作成</p>
                <p className="text-sm text-blue-700">「新しいライブ作成」ボタンで配信用の入力を作成します</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-blue-200 text-blue-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</span>
              <div>
                <p className="font-medium">配信ソフトに設定</p>
                <p className="text-sm text-blue-700">OBS StudioなどでRTMP URLとストリームキーを設定します</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-blue-200 text-blue-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</span>
              <div>
                <p className="font-medium">配信開始</p>
                <p className="text-sm text-blue-700">配信ソフトから「配信開始」を実行すると自動的にライブが開始されます</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-blue-200 text-blue-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">4</span>
              <div>
                <p className="font-medium">視聴者に配信</p>
                <p className="text-sm text-blue-700">埋め込みコードをWebサイトに貼り付けて視聴者に配信できます</p>
              </div>
            </div>
          </div>
        </div>

        {/* 推奨設定 */}
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">⚙️ 推奨配信設定</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-800 mb-2">映像設定</h4>
              <ul className="space-y-1 text-green-700 text-sm">
                <li>• 解像度: 1920x1080 (Full HD)</li>
                <li>• フレームレート: 30fps</li>
                <li>• ビットレート: 2500-6000 kbps</li>
                <li>• エンコーダ: H.264</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-2">音声設定</h4>
              <ul className="space-y-1 text-green-700 text-sm">
                <li>• サンプルレート: 48kHz</li>
                <li>• ビットレート: 128-320 kbps</li>
                <li>• エンコーダ: AAC</li>
                <li>• チャンネル: ステレオ</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 注意事項 */}
        <div className="bg-yellow-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">⚠️ 重要な注意事項</h3>
          <ul className="space-y-2 text-yellow-800">
            <li>• ライブ配信は自動的に録画・保存されます</li>
            <li>• ストリームキーは秘密情報として厳重に管理してください</li>
            <li>• 高品質な配信には安定したインターネット接続が必要です</li>
            <li>• 配信中の映像・音声品質はリアルタイムで監視してください</li>
            <li>• 緊急時には配信を即座に停止できるよう準備しておいてください</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}