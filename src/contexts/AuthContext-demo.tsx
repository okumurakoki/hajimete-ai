'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  imageUrl?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: () => void
  signOut: () => void
  signUp: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // デモ用のダミーユーザー
  const demoUser: User = {
    id: 'demo-user-123',
    email: 'demo@hajimete-ai.com',
    firstName: '太郎',
    lastName: '田中',
    imageUrl: '/demo-avatar.jpg'
  }

  useEffect(() => {
    // 自動的にデモユーザーでログイン
    setUser(demoUser)
  }, [])

  const signIn = () => {
    setUser(demoUser)
  }

  const signOut = () => {
    setUser(null)
  }

  const signUp = () => {
    setUser(demoUser)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signOut,
    signUp
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}