import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'はじめて.AI - AI学習プラットフォーム',
  description: '日本最大級のAI学習プラットフォーム。基礎から実践まで、あなたのペースで学べる。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Skip Clerk for build process to avoid API key validation
  const isBuilding = process.env.NODE_ENV === 'production' && !process.env.VERCEL

  if (isBuilding) {
    return (
      <html lang="ja">
        <body className="font-sans">{children}</body>
      </html>
    )
  }

  return (
    <ClerkProvider>
      <html lang="ja">
        <body className="font-sans">{children}</body>
      </html>
    </ClerkProvider>
  )
}