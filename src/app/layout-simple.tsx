import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'はじめて.AI - AI学習プラットフォーム',
  description: 'AIの基礎から実践まで学べる総合学習プラットフォーム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div id="__next">
          {children}
        </div>
      </body>
    </html>
  )
}