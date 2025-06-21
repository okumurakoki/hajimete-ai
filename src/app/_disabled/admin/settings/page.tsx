'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import { useState } from 'react'
import { 
  Settings, 
  Save, 
  Globe, 
  Mail, 
  Shield, 
  Bell, 
  Palette, 
  Clock,
  Users,
  CreditCard,
  FileText,
  Lock
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'はじめて.AI',
    siteDescription: 'AI学習プラットフォーム',
    siteUrl: 'https://hajimete-ai.com',
    adminEmail: 'admin@hajimete-ai.com',
    supportEmail: 'support@hajimete-ai.com',
    allowRegistration: true,
    requireEmailVerification: true,
    enableComments: true,
    enableRatings: true,
    maintenanceMode: false,
    maxFileSize: 2048,
    allowedFileTypes: ['mp4', 'mov', 'pdf', 'jpg', 'png'],
    sessionTimeout: 30,
    passwordMinLength: 8,
    emailNotifications: true,
    pushNotifications: false,
    analyticsEnabled: true,
    cookieConsent: true
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = () => {
    // Save settings
    console.log('Saving settings:', settings)
  }

  return (
    <AdminLayout currentPage="settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">一般設定</h1>
          <p className="text-gray-600">
            サイトの基本設定とシステム動作を設定します
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Site Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="text-blue-500" size={12} />
              <h3 className="text-lg font-semibold text-gray-900">サイト設定</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  サイト名
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  サイト説明
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  サイトURL
                </label>
                <input
                  type="url"
                  value={settings.siteUrl}
                  onChange={(e) => handleSettingChange('siteUrl', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="text-green-500" size={12} />
              <h3 className="text-lg font-semibold text-gray-900">メール設定</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  管理者メール
                </label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  サポートメール
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">メール認証必須</span>
                  <p className="text-xs text-gray-500">新規登録時にメール認証を必須にする</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requireEmailVerification}
                  onChange={(e) => handleSettingChange('requireEmailVerification', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* User Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-purple-500" size={12} />
              <h3 className="text-lg font-semibold text-gray-900">ユーザー設定</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">新規登録許可</span>
                  <p className="text-xs text-gray-500">新しいユーザーの登録を許可する</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowRegistration}
                  onChange={(e) => handleSettingChange('allowRegistration', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">コメント機能</span>
                  <p className="text-xs text-gray-500">動画・セミナーのコメント機能を有効にする</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableComments}
                  onChange={(e) => handleSettingChange('enableComments', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">評価機能</span>
                  <p className="text-xs text-gray-500">動画・セミナーの評価機能を有効にする</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableRatings}
                  onChange={(e) => handleSettingChange('enableRatings', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-red-500" size={12} />
              <h3 className="text-lg font-semibold text-gray-900">セキュリティ設定</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  セッションタイムアウト (分)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  min="5"
                  max="1440"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  パスワード最小文字数
                </label>
                <input
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  min="6"
                  max="50"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">メンテナンスモード</span>
                  <p className="text-xs text-gray-500">サイトをメンテナンスモードにする</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* File Upload Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-orange-500" size={12} />
              <h3 className="text-lg font-semibold text-gray-900">ファイルアップロード設定</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最大ファイルサイズ (MB)
                </label>
                <input
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="10240"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  許可ファイル形式 (カンマ区切り)
                </label>
                <input
                  type="text"
                  value={settings.allowedFileTypes.join(', ')}
                  onChange={(e) => handleSettingChange('allowedFileTypes', e.target.value.split(', '))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="text-yellow-500" size={12} />
              <h3 className="text-lg font-semibold text-gray-900">通知設定</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">メール通知</span>
                  <p className="text-xs text-gray-500">システムからのメール通知を有効にする</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">プッシュ通知</span>
                  <p className="text-xs text-gray-500">ブラウザプッシュ通知を有効にする</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">アナリティクス</span>
                  <p className="text-xs text-gray-500">利用状況の分析を有効にする</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.analyticsEnabled}
                  onChange={(e) => handleSettingChange('analyticsEnabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">Cookie同意</span>
                  <p className="text-xs text-gray-500">Cookie使用同意バナーを表示する</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.cookieConsent}
                  onChange={(e) => handleSettingChange('cookieConsent', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save size={10} />
            設定を保存
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}