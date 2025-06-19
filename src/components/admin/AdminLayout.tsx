'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
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
  Key,
  Menu,
  X,
  LogOut,
  Shield,
  Trash2
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
  currentPage?: string
}

export default function AdminLayout({ children, currentPage }: AdminLayoutProps) {
  const { user, isAdmin, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield size={29} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">アクセス拒否</h2>
          <p className="text-gray-600 mb-4">管理者権限が必要です</p>
          <Link href="/admin/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            管理者ログイン
          </Link>
        </div>
      </div>
    )
  }

  const menuItems = [
    {
      title: 'ダッシュボード',
      href: '/admin/dashboard',
      icon: Home,
      active: currentPage === 'dashboard'
    },
    {
      title: 'コンテンツ管理',
      items: [
        {
          title: '動画管理',
          href: '/admin/videos',
          icon: Video,
          active: currentPage === 'videos'
        },
        {
          title: 'セミナー管理',
          href: '/admin/seminars',
          icon: Calendar,
          active: currentPage === 'seminars'
        },
        {
          title: 'ライブ配信',
          href: '/admin/live',
          icon: Tv,
          active: currentPage === 'live'
        },
        {
          title: 'アップロード',
          href: '/admin/upload',
          icon: Upload,
          active: currentPage === 'upload'
        }
      ]
    },
    {
      title: 'ユーザー管理',
      items: [
        {
          title: 'ユーザー一覧',
          href: '/admin/users',
          icon: Users,
          active: currentPage === 'users'
        },
        {
          title: '分析・統計',
          href: '/admin/analytics',
          icon: BarChart3,
          active: currentPage === 'analytics'
        }
      ]
    },
    {
      title: 'システム設定',
      items: [
        {
          title: 'データベース',
          href: '/admin/database',
          icon: Database,
          active: currentPage === 'database'
        },
        {
          title: 'API設定',
          href: '/admin/api-settings',
          icon: Key,
          active: currentPage === 'api-settings'
        },
        {
          title: '配信設定',
          href: '/admin/streaming',
          icon: Settings,
          active: currentPage === 'streaming'
        },
        {
          title: '一般設定',
          href: '/admin/settings',
          icon: Settings,
          active: currentPage === 'settings'
        },
        {
          title: 'デモデータ削除',
          href: '/admin/demo-cleanup',
          icon: Trash2,
          active: currentPage === 'demo-cleanup'
        }
      ]
    }
  ]

  const handleLogout = () => {
    if (confirm('ログアウトしますか？')) {
      logout()
      router.push('/admin/login')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-gray-900 text-white flex flex-col relative`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield size={12} className="text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-white">管理者画面</h1>
                <p className="text-xs text-gray-400">はじめて.AI</p>
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              {user?.firstName?.charAt(0) || 'A'}
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-medium text-white">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-400">管理者</p>
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
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>ログアウト</span>}
          </button>
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center py-2 mt-2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            {sidebarOpen ? <X size={12} /> : <Menu size={12} />}
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
                はじめて.AI 管理システム
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/cms"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                CMS画面
              </Link>
              
              <Link
                href="/"
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