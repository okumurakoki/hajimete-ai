'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  imageUrl?: string
  plan?: 'free' | 'basic' | 'premium'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: () => void
  signOut: () => void
  signUp: () => void
  updatePlan: (plan: 'free' | 'basic' | 'premium') => void
  isAdmin: () => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // デモ用のダミーユーザー
  const [demoUser, setDemoUser] = useState<User>({
    id: 'demo-user-123',
    email: 'demo@hajimete-ai.com',
    firstName: '太郎',
    lastName: '田中',
    imageUrl: '/demo-avatar.jpg',
    plan: 'basic' // デフォルトはbasicプラン
  })

  useEffect(() => {
    // 自動的にデモユーザーでログイン（プラン設定済み）
    const userWithPlan = { ...demoUser, plan: 'free' as const }
    setUser(userWithPlan)
    setDemoUser(userWithPlan)
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

  const logout = () => {
    setUser(null)
  }

  const updatePlan = (plan: 'free' | 'basic' | 'premium') => {
    const updatedUser = { ...demoUser, plan }
    setDemoUser(updatedUser)
    setUser(updatedUser)
  }

  const isAdmin = () => {
    return user?.email === 'demo@hajimete-ai.com' // デモユーザーは管理者権限
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signOut,
    signUp,
    updatePlan,
    isAdmin,
    logout
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