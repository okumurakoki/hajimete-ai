'use client'

import React, { useState } from 'react'
import { 
  Clock, 
  Bookmark, 
  Trash2, 
  Star, 
  Search,
  Plus,
  X,
  TrendingUp,
  Calendar,
  Filter
} from 'lucide-react'
import { useSearchHistory } from '@/hooks/useSearchHistory'

interface SearchHistoryProps {
  onSelectSearch: (query: string, filters?: any) => void
  currentQuery?: string
  currentFilters?: any
}

export default function SearchHistory({ 
  onSelectSearch, 
  currentQuery = '', 
  currentFilters = {} 
}: SearchHistoryProps) {
  const {
    searchHistory,
    savedSearches,
    removeFromHistory,
    clearHistory,
    saveSearch,
    useSavedSearch,
    removeSavedSearch,
    getPopularSearches,
    getRecentSearches
  } = useSearchHistory()

  const [activeTab, setActiveTab] = useState<'recent' | 'saved' | 'popular'>('recent')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveName, setSaveName] = useState('')

  const recentSearches = getRecentSearches(10)
  const popularSearches = getPopularSearches(5)

  // 検索を保存
  const handleSaveSearch = () => {
    if (!currentQuery.trim() || !saveName.trim()) return

    const success = saveSearch(saveName, currentQuery, currentFilters)
    if (success) {
      setSaveName('')
      setShowSaveDialog(false)
      setActiveTab('saved')
    }
  }

  // フィルターの簡単な説明を生成
  const getFilterDescription = (filters: any): string => {
    const parts: string[] = []
    
    if (filters.departments?.length > 0) {
      parts.push(`学部: ${filters.departments.length}件`)
    }
    if (filters.difficulties?.length > 0) {
      parts.push(`難易度: ${filters.difficulties.length}件`)
    }
    if (filters.duration?.min || filters.duration?.max) {
      parts.push('期間指定')
    }
    
    return parts.length > 0 ? `(${parts.join(', ')})` : ''
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            検索履歴・保存
          </h3>
          
          {/* 現在の検索を保存 */}
          {currentQuery && (
            <button
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Bookmark className="w-4 h-4 mr-1" />
              保存
            </button>
          )}
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'recent'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          最近の検索
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'saved'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Bookmark className="w-4 h-4 inline mr-2" />
          保存済み ({savedSearches.length})
        </button>
        <button
          onClick={() => setActiveTab('popular')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'popular'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          人気
        </button>
      </div>

      {/* コンテンツ */}
      <div className="max-h-96 overflow-y-auto">
        {/* 最近の検索 */}
        {activeTab === 'recent' && (
          <div className="p-2">
            {recentSearches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">まだ検索履歴がありません</p>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  {recentSearches.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group"
                    >
                      <button
                        onClick={() => onSelectSearch(item.query, item.filters)}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="font-medium text-gray-900">{item.query}</div>
                            <div className="text-xs text-gray-500">
                              {item.timestamp.toLocaleDateString('ja-JP')} • {item.resultCount}件
                              {getFilterDescription(item.filters)}
                            </div>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => removeFromHistory(item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {searchHistory.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={clearHistory}
                      className="w-full text-sm text-red-600 hover:text-red-800 py-2"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      履歴をすべて削除
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* 保存済み検索 */}
        {activeTab === 'saved' && (
          <div className="p-2">
            {savedSearches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bookmark className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">保存された検索がありません</p>
                <p className="text-xs mt-1">よく使う検索条件を保存しておくと便利です</p>
              </div>
            ) : (
              <div className="space-y-1">
                {savedSearches.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group"
                  >
                    <button
                      onClick={() => {
                        const savedSearch = useSavedSearch(item.id)
                        if (savedSearch) {
                          onSelectSearch(savedSearch.query, savedSearch.filters)
                        }
                      }}
                      className="flex-1 text-left"
                    >
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-amber-500 mr-2" />
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.query}</div>
                          <div className="text-xs text-gray-500">
                            最終使用: {item.lastUsed.toLocaleDateString('ja-JP')}
                            {getFilterDescription(item.filters)}
                          </div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => removeSavedSearch(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 人気の検索 */}
        {activeTab === 'popular' && (
          <div className="p-2">
            {popularSearches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">人気の検索キーワードがありません</p>
                <p className="text-xs mt-1">検索履歴が蓄積されると表示されます</p>
              </div>
            ) : (
              <div className="space-y-1">
                {popularSearches.map((item, index) => (
                  <button
                    key={item.query}
                    onClick={() => onSelectSearch(item.query)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg text-left"
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{item.query}</div>
                        <div className="text-xs text-gray-500">{item.count}回検索</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 保存ダイアログ */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">検索を保存</h4>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                保存名
              </label>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="例: AI関連の上級コース"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">検索内容:</div>
              <div className="font-medium text-gray-900">{currentQuery}</div>
              {getFilterDescription(currentFilters) && (
                <div className="text-xs text-gray-500 mt-1">
                  {getFilterDescription(currentFilters)}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSaveSearch}
                disabled={!saveName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}