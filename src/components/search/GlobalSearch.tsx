'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, X, Clock, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSearchHistory } from '@/hooks/useSearchHistory'

interface QuickSearchResult {
  id: string
  title: string
  description: string
  department: {
    name: string
  }
  difficulty: string
  type: 'course' | 'department' | 'suggestion'
}

interface GlobalSearchProps {
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function GlobalSearch({ 
  placeholder = "コースを検索...", 
  size = 'md',
  className = '' 
}: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<QuickSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  
  const { addToHistory, getRecentSearches } = useSearchHistory()
  const recentSearches = getRecentSearches(3)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()
  const router = useRouter()

  // サイズ別スタイル
  const sizeStyles = {
    sm: {
      input: 'px-3 py-2 text-sm',
      icon: 'w-4 h-4',
      container: 'max-w-sm'
    },
    md: {
      input: 'px-4 py-3 text-base',
      icon: 'w-5 h-5',
      container: 'max-w-md'
    },
    lg: {
      input: 'px-6 py-4 text-lg',
      icon: 'w-6 h-6',
      container: 'max-w-lg'
    }
  }

  const currentStyle = sizeStyles[size]

  // クイック検索実行
  const performQuickSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      // 上位5件の結果を取得
      const [searchResponse, suggestResponse] = await Promise.all([
        fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=5`),
        fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&suggestions=true`)
      ])

      const searchData = await searchResponse.json()
      const suggestData = await suggestResponse.json()

      setResults(searchData.results || [])
      setSuggestions(suggestData.suggestions || [])
      
      // 検索履歴に追加
      if (searchQuery.trim()) {
        addToHistory(searchQuery, {}, searchData.totalResults || 0)
      }

    } catch (error) {
      console.error('🔍 クイック検索エラー:', error)
      setResults([])
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  // デバウンス処理
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      performQuickSearch(query)
    }, 200)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query])

  // 外部クリック検出
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // キーボードナビゲーション
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setShowResults(false)
      inputRef.current?.blur()
    } else if (e.key === 'Escape') {
      setShowResults(false)
      inputRef.current?.blur()
    }
  }

  // 結果クリック処理
  const handleResultClick = (result: QuickSearchResult) => {
    if (result.type === 'suggestion') {
      setQuery(result.title)
      inputRef.current?.focus()
    } else {
      router.push(`/courses/${result.id}`)
      setShowResults(false)
      setQuery('')
    }
  }

  // 詳細検索ページへ移動
  const goToAdvancedSearch = () => {
    router.push(`/search${query ? `?q=${encodeURIComponent(query)}` : ''}`)
    setShowResults(false)
  }

  return (
    <div ref={searchRef} className={`relative ${currentStyle.container} ${className}`}>
      {/* 検索入力 */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${currentStyle.icon}`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${currentStyle.input}`}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
              setSuggestions([])
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className={currentStyle.icon} />
          </button>
        )}
      </div>

      {/* 検索結果ドロップダウン */}
      {showResults && (query.trim() || results.length > 0 || suggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">検索中...</p>
            </div>
          )}

          {!loading && (
            <>
              {/* 検索結果 */}
              {results.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 border-b">
                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      コース
                    </h4>
                  </div>
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {result.title}
                          </div>
                          <div className="text-sm text-gray-600 truncate">
                            {result.department.name} • {
                              result.difficulty === 'beginner' ? '初級' :
                              result.difficulty === 'intermediate' ? '中級' : '上級'
                            }
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* 最近の検索 */}
              {!query.trim() && recentSearches.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 border-b">
                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      最近の検索
                    </h4>
                  </div>
                  {recentSearches.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setQuery(item.query)
                        inputRef.current?.focus()
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-700">{item.query}</span>
                        </div>
                        <span className="text-xs text-gray-500">{item.resultCount}件</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* 検索候補 */}
              {suggestions.length > 0 && query.trim() && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 border-b">
                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      検索候補
                    </h4>
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(suggestion)
                        inputRef.current?.focus()
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <Search className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-gray-700">{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* 詳細検索リンク */}
              {query.trim() && (
                <div className="p-3 border-t">
                  <button
                    onClick={goToAdvancedSearch}
                    className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        「{query}」の詳細検索
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              )}

              {/* 結果なし */}
              {!loading && query.trim() && results.length === 0 && suggestions.length === 0 && (
                <div className="p-4 text-center text-gray-600">
                  <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm">「{query}」に一致する結果が見つかりません</p>
                  <button
                    onClick={goToAdvancedSearch}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    詳細検索で探す
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}