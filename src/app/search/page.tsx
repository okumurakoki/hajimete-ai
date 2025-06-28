import React from 'react'
import { SearchLayout } from '@/components/layout/Layout'
import AdvancedSearch from '@/components/search/AdvancedSearch'

export default function SearchPage() {
  return (
    <SearchLayout>
      <AdvancedSearch />
    </SearchLayout>
  )
}

export const metadata = {
  title: '高度な検索機能 - はじめて.AI',
  description: 'コースを詳細に検索・フィルタリングできる高度な検索機能です。ファジー検索、フィルタリング、検索履歴機能を提供します。',
  keywords: '検索, コース検索, AI学習, フィルタリング, はじめて.AI',
  openGraph: {
    title: '高度な検索機能 - はじめて.AI',
    description: 'AIコースを効率的に見つけるための高度な検索機能',
    type: 'website',
  }
}