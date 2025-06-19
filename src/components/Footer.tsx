'use client'

import Link from 'next/link'
import { Twitter, Facebook, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">は</span>
              </div>
              <span className="text-xl font-bold">はじめて.AI</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md text-sm md:text-base">
              AIの基礎から実践まで学べる総合学習プラットフォーム。
              初心者から上級者まで、あなたのレベルに合わせた高品質なコンテンツを提供します。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={12} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={12} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube">
                <Youtube size={12} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">学習コンテンツ</h3>
            <ul className="space-y-1 md:space-y-2 text-gray-300 text-sm">
              <li><Link href="/ai-basics" className="hover:text-white transition-colors">AI基礎学部</Link></li>
              <li><Link href="/practical-application" className="hover:text-white transition-colors">実践活用学部</Link></li>
              <li><Link href="/data-science" className="hover:text-white transition-colors">データサイエンス学部</Link></li>
              <li><Link href="/ai-development" className="hover:text-white transition-colors">AI開発学部</Link></li>
              <li><Link href="/business-ai" className="hover:text-white transition-colors">ビジネスAI学部</Link></li>
              <li><Link href="/productivity" className="hover:text-white transition-colors">業務効率化学部</Link></li>
              <li><Link href="/catchup" className="hover:text-white transition-colors">最新情報キャッチアップ学部</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">サポート</h3>
            <ul className="space-y-1 md:space-y-2 text-gray-300 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">ヘルプセンター</a></li>
              <li><a href="#" className="hover:text-white transition-colors">お問い合わせ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">よくある質問</a></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">利用規約</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">特定商取引法</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center">
          <p className="text-gray-400 text-xs md:text-sm">
            © 2024 はじめて.AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}