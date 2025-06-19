'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface UserFavorites {
  favoriteVideos: string[]
  watchLaterVideos: string[]
  favoriteSeminars: string[]
}

interface UserFavoritesContextType {
  favorites: UserFavorites
  isFavorited: (videoId: string) => boolean
  isInWatchLater: (videoId: string) => boolean
  isSeminarFavorited: (seminarId: string) => boolean
  toggleVideoFavorite: (videoId: string) => void
  toggleVideoWatchLater: (videoId: string) => void
  toggleSeminarFavorite: (seminarId: string) => void
  clearAllFavorites: () => void
  getFavoriteVideosCount: () => number
  getWatchLaterCount: () => number
  getFavoriteSeminarsCount: () => number
}

const UserFavoritesContext = createContext<UserFavoritesContextType | undefined>(undefined)

const generateUserFavorites = (userId: string): UserFavorites => {
  // Generate consistent favorites based on user ID hash
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const seed = Math.abs(hash)
  const random1 = (seed * 9301 + 49297) % 233280 / 233280
  const random2 = (seed * 9307 + 49299) % 233281 / 233281
  const random3 = (seed * 9311 + 49301) % 233282 / 233282
  
  // Generate consistent favorite video IDs
  const possibleVideoIds = ['video-1', 'video-2', 'video-3', 'video-4', 'video-5', 'video-6', 'video-7', 'video-8']
  const favoriteCount = Math.floor(random1 * 4) + 2 // 2-5 favorites
  const favoriteVideos = possibleVideoIds.slice(0, favoriteCount)
  
  // Generate watch later list
  const watchLaterCount = Math.floor(random2 * 3) + 1 // 1-3 watch later
  const watchLaterVideos = possibleVideoIds.slice(favoriteCount, favoriteCount + watchLaterCount)
  
  // Generate favorite seminars
  const possibleSeminarIds = ['seminar-1', 'seminar-2', 'seminar-3', 'seminar-4', 'seminar-5']
  const seminarCount = Math.floor(random3 * 3) + 1 // 1-3 seminars
  const favoriteSeminars = possibleSeminarIds.slice(0, seminarCount)
  
  return {
    favoriteVideos,
    watchLaterVideos,
    favoriteSeminars
  }
}

export function UserFavoritesProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [favorites, setFavorites] = useState<UserFavorites>({
    favoriteVideos: [],
    watchLaterVideos: [],
    favoriteSeminars: []
  })

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Load existing favorites from localStorage or generate new ones
      const savedFavorites = localStorage.getItem(`userFavorites_${user.id}`)
      
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites))
        } catch (error) {
          console.error('Error parsing saved favorites:', error)
          const generated = generateUserFavorites(user.id)
          setFavorites(generated)
          localStorage.setItem(`userFavorites_${user.id}`, JSON.stringify(generated))
        }
      } else {
        const generated = generateUserFavorites(user.id)
        setFavorites(generated)
        localStorage.setItem(`userFavorites_${user.id}`, JSON.stringify(generated))
      }
    } else {
      setFavorites({
        favoriteVideos: [],
        watchLaterVideos: [],
        favoriteSeminars: []
      })
    }
  }, [user?.id, isAuthenticated])

  const saveFavorites = (newFavorites: UserFavorites) => {
    setFavorites(newFavorites)
    if (user?.id) {
      localStorage.setItem(`userFavorites_${user.id}`, JSON.stringify(newFavorites))
    }
  }

  const isFavorited = (videoId: string): boolean => {
    return favorites.favoriteVideos.includes(videoId)
  }

  const isInWatchLater = (videoId: string): boolean => {
    return favorites.watchLaterVideos.includes(videoId)
  }

  const isSeminarFavorited = (seminarId: string): boolean => {
    return favorites.favoriteSeminars.includes(seminarId)
  }

  const toggleVideoFavorite = (videoId: string) => {
    const newFavorites = { ...favorites }
    
    if (newFavorites.favoriteVideos.includes(videoId)) {
      newFavorites.favoriteVideos = newFavorites.favoriteVideos.filter(id => id !== videoId)
    } else {
      newFavorites.favoriteVideos = [...newFavorites.favoriteVideos, videoId]
    }
    
    saveFavorites(newFavorites)
  }

  const toggleVideoWatchLater = (videoId: string) => {
    const newFavorites = { ...favorites }
    
    if (newFavorites.watchLaterVideos.includes(videoId)) {
      newFavorites.watchLaterVideos = newFavorites.watchLaterVideos.filter(id => id !== videoId)
    } else {
      newFavorites.watchLaterVideos = [...newFavorites.watchLaterVideos, videoId]
    }
    
    saveFavorites(newFavorites)
  }

  const toggleSeminarFavorite = (seminarId: string) => {
    const newFavorites = { ...favorites }
    
    if (newFavorites.favoriteSeminars.includes(seminarId)) {
      newFavorites.favoriteSeminars = newFavorites.favoriteSeminars.filter(id => id !== seminarId)
    } else {
      newFavorites.favoriteSeminars = [...newFavorites.favoriteSeminars, seminarId]
    }
    
    saveFavorites(newFavorites)
  }

  const clearAllFavorites = () => {
    const emptyFavorites = {
      favoriteVideos: [],
      watchLaterVideos: [],
      favoriteSeminars: []
    }
    saveFavorites(emptyFavorites)
  }

  const getFavoriteVideosCount = (): number => favorites.favoriteVideos.length
  const getWatchLaterCount = (): number => favorites.watchLaterVideos.length
  const getFavoriteSeminarsCount = (): number => favorites.favoriteSeminars.length

  return (
    <UserFavoritesContext.Provider value={{
      favorites,
      isFavorited,
      isInWatchLater,
      isSeminarFavorited,
      toggleVideoFavorite,
      toggleVideoWatchLater,
      toggleSeminarFavorite,
      clearAllFavorites,
      getFavoriteVideosCount,
      getWatchLaterCount,
      getFavoriteSeminarsCount
    }}>
      {children}
    </UserFavoritesContext.Provider>
  )
}

export function useUserFavorites() {
  const context = useContext(UserFavoritesContext)
  if (context === undefined) {
    throw new Error('useUserFavorites must be used within a UserFavoritesProvider')
  }
  return context
}