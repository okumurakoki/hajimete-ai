'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Home, 
  Video, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  Upload,
  Tv,
  BookOpen,
  FileText,
  Database,
  Key
} from 'lucide-react'

interface CMSLayoutProps {
  children: React.ReactNode
  currentPage?: string
}

export default function CMSLayout({ children, currentPage }: CMSLayoutProps) {
  const { user, isAdmin } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">アクセス拒否</h2>
          <p className="text-gray-600">管理者権限が必要です</p>
        </div>
      </div>
    )
  }

  const menuItems = [
    {
      title: 'ダッシュボード',
      href: '/cms',
      icon: Home,
      active: currentPage === 'dashboard'
    },
    {
      title: 'コンテンツ管理',
      items: [
        {
          title: '動画管理',
          href: '/cms/videos',
          icon: Video,
          active: currentPage === 'videos'
        },
        {
          title: 'セミナー管理',
          href: '/cms/seminars',
          icon: Calendar,
          active: currentPage === 'seminars'
        },
        {
          title: 'ライブ配信',
          href: '/cms/live-streaming',
          icon: Tv,
          active: currentPage === 'live-streaming'
        },
        {
          title: 'コレクション',
          href: '/cms/collections',
          icon: BookOpen,
          active: currentPage === 'collections'
        }
      ]
    },
    {
      title: 'ユーザー管理',
      items: [
        {
          title: 'ユーザー一覧',
          href: '/cms/users',
          icon: Users,
          active: currentPage === 'users'
        },
        {
          title: '分析・統計',
          href: '/cms/analytics',
          icon: BarChart3,
          active: currentPage === 'analytics'
        }
      ]
    },
    {
      title: 'システム管理',
      items: [
        {
          title: 'アップロード',
          href: '/cms/upload',
          icon: Upload,
          active: currentPage === 'upload'
        },
        {
          title: 'データベース',
          href: '/cms/database',
          icon: Database,
          active: currentPage === 'database'
        },
        {
          title: 'API設定',
          href: '/cms/api-settings',
          icon: Key,
          active: currentPage === 'api-settings'
        },
        {
          title: 'システム設定',
          href: '/cms/settings',
          icon: Settings,
          active: currentPage === 'settings'
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-white shadow-lg flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">は</span>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-gray-900">CMS管理画面</h1>
                <p className="text-xs text-gray-500">はじめて.AI</p>
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              {user?.firstName?.charAt(0) || 'A'}
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">管理者</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-6">
            {menuItems.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.href ? (
                  // Single item
                  <Link
                    href={section.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      section.active
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <section.icon size={12} />
                    {sidebarOpen && <span className="font-medium">{section.title}</span>}
                  </Link>
                ) : (
                  // Section with items
                  <div>
                    {sidebarOpen && (
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        {section.title}
                      </h3>
                    )}
                    <div className="space-y-1">
                      {section.items?.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            item.active
                              ? 'bg-blue-50 text-blue-600 border border-blue-200'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <item.icon size={18} />
                          {sidebarOpen && <span>{item.title}</span>}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Toggle Button */}
        <div className="p-4 border-t">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center py-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className={`w-5 h-5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {currentPage?.replace('-', ' ') || 'ダッシュボード'}
              </h2>
              <p className="text-gray-600">
                コンテンツとユーザーを管理
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Quick Actions */}
              <Link
                href="/cms/upload"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Upload size={10} />
                アップロード
              </Link>
              
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                サイトを表示
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}