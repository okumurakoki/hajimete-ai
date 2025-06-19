import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { AdminDataProvider } from '@/contexts/AdminDataContext'
import { UserProgressProvider } from '@/contexts/UserProgressContext'
import { UserFavoritesProvider } from '@/contexts/UserFavoritesContext'
import ErrorBoundary from '@/components/ErrorBoundary'

const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'はじめて.AI - AI学習プラットフォーム',
    template: '%s | はじめて.AI'
  },
  description: 'AIの基礎から実践まで学べる総合学習プラットフォーム。初心者から上級者まで、あなたのレベルに合わせた高品質なコンテンツを提供します。',
  keywords: ['AI', '人工知能', '機械学習', 'ChatGPT', 'プログラミング', 'データサイエンス', 'オンライン学習'],
  authors: [{ name: 'はじめて.AI Team' }],
  creator: 'はじめて.AI',
  publisher: 'はじめて.AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'はじめて.AI',
    title: 'はじめて.AI - AI学習プラットフォーム',
    description: 'AIの基礎から実践まで学べる総合学習プラットフォーム',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'はじめて.AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'はじめて.AI - AI学習プラットフォーム',
    description: 'AIの基礎から実践まで学べる総合学習プラットフォーム',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={notoSansJP.className}>
        <ErrorBoundary>
          <AuthProvider>
            <UserProgressProvider>
              <UserFavoritesProvider>
                <AdminDataProvider>
                  {children}
                </AdminDataProvider>
              </UserFavoritesProvider>
            </UserProgressProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}