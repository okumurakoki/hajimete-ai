'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Github, 
  Twitter, 
  Youtube, 
  Mail, 
  MapPin, 
  Phone,
  Heart,
  ArrowUp,
  BookOpen,
  Users,
  BarChart3,
  Search,
  Shield,
  FileText,
  HelpCircle,
  MessageCircle
} from 'lucide-react'

interface FooterProps {
  className?: string
}

export default function Footer({ className = '' }: FooterProps) {
  // ページトップへスクロール
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // フッターリンクセクション
  const footerSections = [
    {
      title: 'プラットフォーム',
      links: [
        { name: 'ダッシュボード', href: '/dashboard', icon: BarChart3 },
        { name: 'コース一覧', href: '/courses', icon: BookOpen },
        { name: 'セミナー', href: '/seminars', icon: Users },
        { name: '高度な検索', href: '/search', icon: Search },
      ]
    },
    {
      title: 'サポート',
      links: [
        { name: 'ヘルプセンター', href: '/help', icon: HelpCircle },
        { name: 'お問い合わせ', href: '/contact', icon: MessageCircle },
        { name: 'よくある質問', href: '/faq', icon: FileText },
        { name: 'コミュニティ', href: '/community', icon: Users },
      ]
    },
    {
      title: '会社情報',
      links: [
        { name: '私たちについて', href: '/about', icon: Users },
        { name: 'ブログ', href: '/blog', icon: FileText },
        { name: 'ニュース', href: '/news', icon: FileText },
        { name: '採用情報', href: '/careers', icon: Users },
      ]
    },
    {
      title: '法的情報',
      links: [
        { name: 'プライバシーポリシー', href: '/privacy', icon: Shield },
        { name: '利用規約', href: '/terms', icon: FileText },
        { name: 'Cookie ポリシー', href: '/cookies', icon: Shield },
        { name: 'セキュリティ', href: '/security', icon: Shield },
      ]
    }
  ]

  // ソーシャルメディアリンク
  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com', icon: Twitter, color: 'hover:text-blue-400' },
    { name: 'GitHub', href: 'https://github.com', icon: Github, color: 'hover:text-gray-600' },
    { name: 'YouTube', href: 'https://youtube.com', icon: Youtube, color: 'hover:text-red-500' },
    { name: 'Email', href: 'mailto:contact@hajimete-ai.com', icon: Mail, color: 'hover:text-green-500' },
  ]

  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      {/* メインフッターコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* ブランドセクション */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold">はじめて.AI</span>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              AIを学ぶすべての人のための
              包括的な教育プラットフォーム。
              基礎から応用まで、段階的に
              学習できる環境を提供します。
            </p>
            
            {/* 連絡先情報 */}
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>東京都渋谷区 1-1-1</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>03-1234-5678</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>contact@hajimete-ai.com</span>
              </div>
            </div>
          </div>

          {/* リンクセクション */}
          {footerSections.map((section, index) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center text-gray-400 hover:text-white transition-colors duration-200 group"
                    >
                      <link.icon className="w-4 h-4 mr-2 opacity-60 group-hover:opacity-100" />
                      <span className="text-sm">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ニュースレター登録 */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-3">最新情報を受け取る</h3>
            <p className="text-gray-400 text-sm mb-4">
              新しいコースやセミナー、プラットフォームの更新情報をお届けします。
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="メールアドレスを入力"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg transition-colors duration-200 font-medium">
                登録
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ボトムバー */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* コピーライト */}
            <div className="flex items-center text-sm text-gray-400">
              <span>&copy; 2024 はじめて.AI. All rights reserved.</span>
              <Heart className="w-4 h-4 mx-2 text-red-500" />
              <span>Made with love in Japan</span>
            </div>

            {/* ソーシャルメディア */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className={`text-gray-400 ${social.color} transition-colors duration-200`}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>

            {/* ページトップボタン */}
            <button
              onClick={scrollToTop}
              className="flex items-center text-sm text-gray-400 hover:text-white transition-colors duration-200 group"
              aria-label="ページトップへ戻る"
            >
              <span className="mr-2">トップへ</span>
              <ArrowUp className="w-4 h-4 group-hover:transform group-hover:-translate-y-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>

      {/* 言語・地域選択 */}
      <div className="bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-center items-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <span>🌐</span>
              <span>日本語</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🏢</span>
              <span>企業向けソリューション</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🎓</span>
              <span>教育機関向けプラン</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}