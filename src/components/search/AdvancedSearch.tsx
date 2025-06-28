'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  Clock, 
  Star, 
  Users,
  BookOpen,
  Zap,
  SortAsc,
  SortDesc,
  History
} from 'lucide-react'
import SearchHistory from './SearchHistory'
import { useSearchHistory } from '@/hooks/useSearchHistory'

// 検索結果の型定義
interface SearchResult {
  id: string
  title: string
  description: string
  department: {
    id: string
    name: string
  }
  difficulty: string
  duration: number
  enrolledCount: number
  status: string
  createdAt: string
  searchScore?: number
  highlights?: {
    title?: string
    description?: string
    department?: string
  }
}

interface SearchResponse {
  results: SearchResult[]
  totalResults: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  query: string
  suggestions: string[]
}

interface SearchFilters {
  departments: string[]
  difficulties: string[]
  status: string
  duration: { min: number | null; max: number | null }
  enrolledCount: { min: number | null; max: number | null }
  dateRange: { start: string | null; end: string | null }
}

export default function AdvancedSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [sortBy, setSortBy] = useState('relevance')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  
  const { addToHistory } = useSearchHistory()
  
  const searchInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // フィルター状態
  const [filters, setFilters] = useState<SearchFilters>({
    departments: [],
    difficulties: [],
    status: 'all',
    duration: { min: null, max: null },
    enrolledCount: { min: null, max: null },
    dateRange: { start: null, end: null }
  })

  // 部門・難易度の選択肢
  const departmentOptions = [
    { id: 'computer-science', name: 'コンピュータサイエンス' },
    { id: 'data-science', name: 'データサイエンス' },
    { id: 'ai-ml', name: 'AI・機械学習' },
    { id: 'web-development', name: 'Web開発' },
    { id: 'mobile-development', name: 'モバイル開発' }
  ]

  const difficultyOptions = [
    { value: 'beginner', label: '初級' },
    { value: 'intermediate', label: '中級' },
    { value: 'advanced', label: '上級' }
  ]

  const sortOptions = [
    { value: 'relevance', label: '関連度' },
    { value: 'title', label: 'タイトル' },
    { value: 'date', label: '作成日' },
    { value: 'popularity', label: '人気度' },
    { value: 'duration', label: '期間' }
  ]

  // 検索実行関数
  const performSearch = async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim() && Object.values(filters).every(f => 
      Array.isArray(f) ? f.length === 0 : 
      typeof f === 'object' && f !== null ? Object.values(f).every(v => v === null) :
      f === 'all'
    )) {
      setResults([])
      setTotalResults(0)
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        sort: sortBy,
        page: page.toString(),
        limit: '10'
      })

      // フィルターパラメータ追加
      if (filters.departments.length > 0) {
        params.set('departments', filters.departments.join(','))
      }
      if (filters.difficulties.length > 0) {
        params.set('difficulties', filters.difficulties.join(','))
      }
      if (filters.status !== 'all') {
        params.set('status', filters.status)
      }
      if (filters.duration.min !== null) {
        params.set('durationMin', filters.duration.min.toString())
      }
      if (filters.duration.max !== null) {
        params.set('durationMax', filters.duration.max.toString())
      }
      if (filters.enrolledCount.min !== null) {
        params.set('enrolledMin', filters.enrolledCount.min.toString())
      }
      if (filters.enrolledCount.max !== null) {
        params.set('enrolledMax', filters.enrolledCount.max.toString())
      }
      if (filters.dateRange.start) {
        params.set('dateStart', filters.dateRange.start)
      }
      if (filters.dateRange.end) {
        params.set('dateEnd', filters.dateRange.end)
      }

      const response = await fetch(`/api/search?${params}`)
      const data: SearchResponse = await response.json()

      setResults(data.results)
      setTotalResults(data.totalResults)
      setTotalPages(data.totalPages)
      setCurrentPage(data.currentPage)
      
      // 検索履歴に追加
      if (searchQuery.trim()) {
        addToHistory(searchQuery, filters, data.totalResults)
      }

      console.log('🔍 検索完了:', {
        query: searchQuery,
        results: data.results.length,
        total: data.totalResults
      })

    } catch (error) {
      console.error('🔍 検索エラー:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // サジェスト取得
  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([])
      return
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&suggestions=true`)
      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (error) {
      console.error('🔍 サジェスト取得エラー:', error)
      setSuggestions([])
    }
  }

  // 検索クエリ変更時のデバウンス処理
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query, 1)
      setCurrentPage(1)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, filters, sortBy])

  // サジェスト用デバウンス
  useEffect(() => {
    const suggestionTimeout = setTimeout(() => {
      fetchSuggestions(query)
    }, 150)

    return () => clearTimeout(suggestionTimeout)
  }, [query])

  // フィルター更新関数
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // 検索履歴から検索を選択
  const handleSelectFromHistory = (historyQuery: string, historyFilters?: any) => {
    setQuery(historyQuery)
    if (historyFilters) {
      setFilters(historyFilters)
    }
    setShowHistory(false)
    performSearch(historyQuery, 1)
  }

  // ハイライト機能
  const highlightText = (text: string, highlight?: string) => {
    if (!highlight) return text
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 検索ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Search className="w-8 h-8 mr-3 text-blue-600" />
          🔍 高度な検索機能
        </h1>
        <p className="text-gray-600">
          コース名、説明、学部、難易度から詳細検索できます
        </p>
      </div>

      {/* 検索バー */}
      <div className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="コース名、説明、学部で検索..."
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* サジェスト */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(suggestion)
                  setShowSuggestions(false)
                  searchInputRef.current?.focus()
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center"
              >
                <Clock className="w-4 h-4 text-gray-400 mr-3" />
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 検索オプション */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        {/* フィルター・ソートボタン */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
              showFilters 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            フィルター
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
              showHistory 
                ? 'bg-purple-50 border-purple-200 text-purple-700' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <History className="w-4 h-4 mr-2" />
            履歴
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
          </button>

          <div className="flex items-center space-x-2">
            <SortAsc className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 検索結果カウント */}
        {totalResults > 0 && (
          <div className="text-sm text-gray-600">
            {totalResults.toLocaleString()} 件の結果
            {query && ` "${query}" について`}
          </div>
        )}
      </div>

      {/* フィルターパネル */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 学部フィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">学部</label>
              <div className="space-y-2">
                {departmentOptions.map(dept => (
                  <label key={dept.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.departments.includes(dept.id)}
                      onChange={(e) => {
                        const newDepts = e.target.checked
                          ? [...filters.departments, dept.id]
                          : filters.departments.filter(d => d !== dept.id)
                        updateFilter('departments', newDepts)
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{dept.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 難易度フィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">難易度</label>
              <div className="space-y-2">
                {difficultyOptions.map(diff => (
                  <label key={diff.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.difficulties.includes(diff.value)}
                      onChange={(e) => {
                        const newDiffs = e.target.checked
                          ? [...filters.difficulties, diff.value]
                          : filters.difficulties.filter(d => d !== diff.value)
                        updateFilter('difficulties', newDiffs)
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{diff.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 期間フィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">期間（週）</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="最小"
                  value={filters.duration.min || ''}
                  onChange={(e) => updateFilter('duration', {
                    ...filters.duration,
                    min: e.target.value ? parseInt(e.target.value) : null
                  })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded"
                />
                <span className="text-gray-500">〜</span>
                <input
                  type="number"
                  placeholder="最大"
                  value={filters.duration.max || ''}
                  onChange={(e) => updateFilter('duration', {
                    ...filters.duration,
                    max: e.target.value ? parseInt(e.target.value) : null
                  })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* フィルタークリア */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setFilters({
                departments: [],
                difficulties: [],
                status: 'all',
                duration: { min: null, max: null },
                enrolledCount: { min: null, max: null },
                dateRange: { start: null, end: null }
              })}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              フィルターをクリア
            </button>
          </div>
        </div>
      )}

      {/* 検索履歴パネル */}
      {showHistory && (
        <div className="mb-6">
          <SearchHistory 
            onSelectSearch={handleSelectFromHistory}
            currentQuery={query}
            currentFilters={filters}
          />
        </div>
      )}

      {/* 検索結果 */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">検索中...</p>
          </div>
        )}

        {!loading && results.length === 0 && query && (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">「{query}」に一致する結果が見つかりませんでした</p>
          </div>
        )}

        {results.map((result) => (
          <div key={result.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {highlightText(result.title, result.highlights?.title)}
                </h3>
                <p className="text-gray-600 mb-3">
                  {highlightText(result.description, result.highlights?.description)}
                </p>
              </div>
              {result.searchScore && (
                <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  関連度: {result.searchScore}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                {highlightText(result.department.name, result.highlights?.department)}
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1" />
                {result.difficulty === 'beginner' ? '初級' : 
                 result.difficulty === 'intermediate' ? '中級' : '上級'}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {result.duration}週間
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {result.enrolledCount.toLocaleString()}人受講
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          <button
            onClick={() => performSearch(query, currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            前へ
          </button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
              return (
                <button
                  key={pageNum}
                  onClick={() => performSearch(query, pageNum)}
                  className={`px-3 py-2 rounded-lg ${
                    pageNum === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => performSearch(query, currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            次へ
          </button>
        </div>
      )}
    </div>
  )
}