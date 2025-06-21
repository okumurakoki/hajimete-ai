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
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // デモデータの生成（実際のアプリケーションではAPIから取得）
    const demoProgress: UserProgress = {
      totalStudyTime: 2400, // 40時間
      completedCourses: 12,
      watchedVideos: 45,
      attendedSeminars: 6,
      currentStreak: 15,
      totalPoints: 2400,
      rank: 'エキスパート',
      achievements: ['初回ログイン', '動画5本視聴', 'セミナー参加'],
      monthlyGoal: {
        studyTimeGoal: 30 * 60, // 30時間
        videoGoal: 50,
        currentStudyTime: 1200, // 20時間
        currentVideos: 35
      },
      favorites: [],
      watchLater: [],
      videoProgress: {}
    }
    
    setProgress(demoProgress)
    setIsLoading(false)
  }, [])

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