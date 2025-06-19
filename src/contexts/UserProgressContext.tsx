'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

interface UserProgress {
  totalStudyTime: number // 分
  completedCourses: number
  watchedVideos: number
  attendedSeminars: number
  currentStreak: number
  totalPoints: number
  rank: string
  achievements: string[]
  monthlyGoal: {
    studyTimeGoal: number
    videoGoal: number
    currentStudyTime: number
    currentVideos: number
  }
  favorites: string[]
  watchLater: string[]
  videoProgress: Record<string, {
    watchedTime: number
    totalTime: number
    completed: boolean
    chapters?: Record<string, boolean>
  }>
}

interface UserProgressContextType {
  progress: UserProgress | null
  updateProgress: (updates: Partial<UserProgress>) => void
  addToFavorites: (videoId: string) => void
  removeFromFavorites: (videoId: string) => void
  addToWatchLater: (videoId: string) => void
  removeFromWatchLater: (videoId: string) => void
  updateVideoProgress: (videoId: string, watchedTime: number, totalTime: number) => void
  completeVideo: (videoId: string) => void
  isLoading: boolean
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined)

export function UserProgressProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated && user) {
      // デモデータの生成（実際のアプリケーションではAPIから取得）
      const demoProgress: UserProgress = {
        totalStudyTime: generatePersonalizedNumber(user.id, 'studyTime', 1200, 4800), // 20-80時間
        completedCourses: generatePersonalizedNumber(user.id, 'courses', 5, 25),
        watchedVideos: generatePersonalizedNumber(user.id, 'videos', 15, 75),
        attendedSeminars: generatePersonalizedNumber(user.id, 'seminars', 2, 12),
        currentStreak: generatePersonalizedNumber(user.id, 'streak', 1, 30),
        totalPoints: generatePersonalizedNumber(user.id, 'points', 500, 5000),
        rank: calculateRank(generatePersonalizedNumber(user.id, 'rank', 1, 100)),
        achievements: generateAchievements(user.id),
        monthlyGoal: {
          studyTimeGoal: 30 * 60, // 30時間
          videoGoal: 50,
          currentStudyTime: generatePersonalizedNumber(user.id, 'monthlyStudy', 600, 1800),
          currentVideos: generatePersonalizedNumber(user.id, 'monthlyVideos', 10, 48)
        },
        favorites: generateFavorites(user.id),
        watchLater: generateWatchLater(user.id),
        videoProgress: generateVideoProgress(user.id)
      }
      
      setProgress(demoProgress)
      setIsLoading(false)
    } else {
      setProgress(null)
      setIsLoading(false)
    }
  }, [isAuthenticated, user])

  // ユーザーIDに基づいて一貫した個人化された数値を生成
  const generatePersonalizedNumber = (userId: string, type: string, min: number, max: number): number => {
    const hash = hashString(userId + type)
    return min + (hash % (max - min + 1))
  }

  const hashString = (str: string): number => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  const calculateRank = (score: number): string => {
    if (score >= 80) return 'A+'
    if (score >= 70) return 'A'
    if (score >= 60) return 'B+'
    if (score >= 50) return 'B'
    if (score >= 40) return 'C+'
    return 'C'
  }

  const generateAchievements = (userId: string): string[] => {
    const allAchievements = [
      '初回ログイン', 'ベーシック会員', 'プレミアム会員', 
      '動画マスター', 'セミナー常連', '早起き学習者',
      '夜型学習者', '継続学習', '集中学習', 'AI専門家'
    ]
    const numAchievements = generatePersonalizedNumber(userId, 'achievements', 2, 6)
    const hash = hashString(userId + 'achv')
    const startIndex = hash % allAchievements.length
    
    const selected = []
    for (let i = 0; i < numAchievements; i++) {
      selected.push(allAchievements[(startIndex + i) % allAchievements.length])
    }
    return selected
  }

  const generateFavorites = (userId: string): string[] => {
    const videos = ['video-1', 'video-2', 'video-3', 'video-4', 'video-5']
    const numFavorites = generatePersonalizedNumber(userId, 'favorites', 0, 3)
    return videos.slice(0, numFavorites)
  }

  const generateWatchLater = (userId: string): string[] => {
    const videos = ['video-6', 'video-7', 'video-8', 'video-9', 'video-10']
    const numWatchLater = generatePersonalizedNumber(userId, 'watchlater', 0, 4)
    return videos.slice(0, numWatchLater)
  }

  const generateVideoProgress = (userId: string): Record<string, any> => {
    const videoProgress: Record<string, any> = {}
    for (let i = 1; i <= 10; i++) {
      const videoId = `video-${i}`
      const totalTime = 1800 // 30分
      const watchedTime = generatePersonalizedNumber(userId, `progress${i}`, 0, totalTime)
      
      videoProgress[videoId] = {
        watchedTime,
        totalTime,
        completed: watchedTime >= totalTime * 0.9,
        chapters: {
          'chapter-1': watchedTime > 300,
          'chapter-2': watchedTime > 900,
          'chapter-3': watchedTime > 1500,
          'chapter-4': watchedTime >= totalTime * 0.9
        }
      }
    }
    return videoProgress
  }

  const updateProgress = (updates: Partial<UserProgress>) => {
    if (progress) {
      setProgress({ ...progress, ...updates })
    }
  }

  const addToFavorites = (videoId: string) => {
    if (progress && !progress.favorites.includes(videoId)) {
      setProgress({
        ...progress,
        favorites: [...progress.favorites, videoId]
      })
    }
  }

  const removeFromFavorites = (videoId: string) => {
    if (progress) {
      setProgress({
        ...progress,
        favorites: progress.favorites.filter(id => id !== videoId)
      })
    }
  }

  const addToWatchLater = (videoId: string) => {
    if (progress && !progress.watchLater.includes(videoId)) {
      setProgress({
        ...progress,
        watchLater: [...progress.watchLater, videoId]
      })
    }
  }

  const removeFromWatchLater = (videoId: string) => {
    if (progress) {
      setProgress({
        ...progress,
        watchLater: progress.watchLater.filter(id => id !== videoId)
      })
    }
  }

  const updateVideoProgress = (videoId: string, watchedTime: number, totalTime: number) => {
    if (progress) {
      const videoProgress = progress.videoProgress[videoId] || { watchedTime: 0, totalTime, completed: false }
      const newWatchedTime = Math.max(videoProgress.watchedTime, watchedTime)
      
      setProgress({
        ...progress,
        videoProgress: {
          ...progress.videoProgress,
          [videoId]: {
            ...videoProgress,
            watchedTime: newWatchedTime,
            totalTime,
            completed: newWatchedTime >= totalTime * 0.9
          }
        }
      })
    }
  }

  const completeVideo = (videoId: string) => {
    if (progress) {
      const currentCompleted = progress.completedCourses
      const videoProgress = progress.videoProgress[videoId]
      
      if (videoProgress && !videoProgress.completed) {
        setProgress({
          ...progress,
          completedCourses: currentCompleted + 1,
          totalPoints: progress.totalPoints + 100,
          videoProgress: {
            ...progress.videoProgress,
            [videoId]: {
              ...videoProgress,
              completed: true,
              watchedTime: videoProgress.totalTime
            }
          }
        })
      }
    }
  }

  const value = {
    progress,
    updateProgress,
    addToFavorites,
    removeFromFavorites,
    addToWatchLater,
    removeFromWatchLater,
    updateVideoProgress,
    completeVideo,
    isLoading
  }

  return (
    <UserProgressContext.Provider value={value}>
      {children}
    </UserProgressContext.Provider>
  )
}

export function useUserProgress() {
  const context = useContext(UserProgressContext)
  if (context === undefined) {
    throw new Error('useUserProgress must be used within a UserProgressProvider')
  }
  return context
}