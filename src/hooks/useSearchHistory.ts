'use client'

import { useState, useEffect } from 'react'

export interface SearchHistoryItem {
  id: string
  query: string
  filters?: any
  timestamp: Date
  resultCount: number
}

export interface SavedSearch {
  id: string
  name: string
  query: string
  filters?: any
  createdAt: Date
  lastUsed: Date
}

const SEARCH_HISTORY_KEY = 'hajimete-ai-search-history'
const SAVED_SEARCHES_KEY = 'hajimete-ai-saved-searches'
const MAX_HISTORY_ITEMS = 50

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])

  // localStorage からデータを読み込み
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const historyData = localStorage.getItem(SEARCH_HISTORY_KEY)
        if (historyData) {
          const parsed = JSON.parse(historyData).map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp)
          }))
          setSearchHistory(parsed)
        }

        const savedData = localStorage.getItem(SAVED_SEARCHES_KEY)
        if (savedData) {
          const parsed = JSON.parse(savedData).map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            lastUsed: new Date(item.lastUsed)
          }))
          setSavedSearches(parsed)
        }
      } catch (error) {
        console.error('検索履歴の読み込みエラー:', error)
      }
    }
  }, [])

  // 検索履歴を追加
  const addToHistory = (query: string, filters: any = {}, resultCount: number = 0) => {
    if (!query.trim()) return

    const newItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query: query.trim(),
      filters,
      timestamp: new Date(),
      resultCount
    }

    setSearchHistory(prev => {
      // 重複する検索クエリを削除
      const filtered = prev.filter(item => 
        item.query.toLowerCase() !== query.toLowerCase().trim() ||
        JSON.stringify(item.filters) !== JSON.stringify(filters)
      )
      
      // 新しいアイテムを先頭に追加し、最大数を制限
      const newHistory = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS)
      
      // localStorage に保存
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
      } catch (error) {
        console.error('検索履歴の保存エラー:', error)
      }
      
      return newHistory
    })
  }

  // 検索履歴を削除
  const removeFromHistory = (id: string) => {
    setSearchHistory(prev => {
      const newHistory = prev.filter(item => item.id !== id)
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
      } catch (error) {
        console.error('検索履歴の削除エラー:', error)
      }
      return newHistory
    })
  }

  // 検索履歴をクリア
  const clearHistory = () => {
    setSearchHistory([])
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY)
    } catch (error) {
      console.error('検索履歴のクリアエラー:', error)
    }
  }

  // 検索を保存
  const saveSearch = (name: string, query: string, filters: any = {}) => {
    if (!name.trim() || !query.trim()) return false

    const newSavedSearch: SavedSearch = {
      id: Date.now().toString(),
      name: name.trim(),
      query: query.trim(),
      filters,
      createdAt: new Date(),
      lastUsed: new Date()
    }

    setSavedSearches(prev => {
      // 同じ名前の検索があれば更新、なければ追加
      const filtered = prev.filter(item => item.name !== name.trim())
      const newSaved = [newSavedSearch, ...filtered].sort((a, b) => 
        b.lastUsed.getTime() - a.lastUsed.getTime()
      )
      
      try {
        localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(newSaved))
      } catch (error) {
        console.error('保存検索の保存エラー:', error)
        return prev
      }
      
      return newSaved
    })

    return true
  }

  // 保存された検索を使用
  const useSavedSearch = (id: string) => {
    setSavedSearches(prev => {
      const newSaved = prev.map(item => 
        item.id === id 
          ? { ...item, lastUsed: new Date() }
          : item
      ).sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
      
      try {
        localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(newSaved))
      } catch (error) {
        console.error('保存検索の更新エラー:', error)
      }
      
      return newSaved
    })

    return savedSearches.find(item => item.id === id)
  }

  // 保存された検索を削除
  const removeSavedSearch = (id: string) => {
    setSavedSearches(prev => {
      const newSaved = prev.filter(item => item.id !== id)
      try {
        localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(newSaved))
      } catch (error) {
        console.error('保存検索の削除エラー:', error)
      }
      return newSaved
    })
  }

  // 人気の検索キーワードを取得
  const getPopularSearches = (limit: number = 5): { query: string; count: number }[] => {
    const queryCount = new Map<string, number>()
    
    searchHistory.forEach(item => {
      const query = item.query.toLowerCase().trim()
      queryCount.set(query, (queryCount.get(query) || 0) + 1)
    })

    return Array.from(queryCount.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  // 最近の検索を取得
  const getRecentSearches = (limit: number = 10): SearchHistoryItem[] => {
    return searchHistory
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }

  return {
    searchHistory,
    savedSearches,
    addToHistory,
    removeFromHistory,
    clearHistory,
    saveSearch,
    useSavedSearch,
    removeSavedSearch,
    getPopularSearches,
    getRecentSearches
  }
}