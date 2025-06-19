'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  plan: 'basic' | 'premium' | 'free'
  role: 'user' | 'admin' | 'instructor'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  signUp: (data: SignUpData) => Promise<boolean>
  updatePlan: (plan: string) => void
  loading: boolean
}

interface SignUpData {
  firstName: string
  lastName: string
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // ローカルストレージから認証状態を復元
  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (error) {
          console.error('Failed to parse saved user data:', error)
          localStorage.removeItem('user')
        }
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    
    // モック認証 - 実際のAPIコールをシミュレート
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 管理者用メールアドレスをチェック
    const isAdminEmail = email.includes('admin') || email.includes('管理') || email === 'admin@hajimete-ai.com'
    
    const mockUser: User = {
      id: 'user-' + Date.now(),
      email,
      firstName: isAdminEmail ? '管理者' : '太郎',
      lastName: isAdminEmail ? 'AI' : '田中',
      plan: isAdminEmail ? 'premium' : 'free',
      role: isAdminEmail ? 'admin' : 'user'
    }
    
    setUser(mockUser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(mockUser))
    }
    setLoading(false)
    
    return true
  }

  const signUp = async (data: SignUpData): Promise<boolean> => {
    setLoading(true)
    
    // モック新規登録 - 実際のAPIコールをシミュレート
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 管理者用メールアドレスをチェック
    const isAdminEmail = data.email.includes('admin') || data.email.includes('管理') || data.email === 'admin@hajimete-ai.com'
    
    const mockUser: User = {
      id: 'user-' + Date.now(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      plan: isAdminEmail ? 'premium' : 'free',
      role: isAdminEmail ? 'admin' : 'user'
    }
    
    setUser(mockUser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(mockUser))
    }
    setLoading(false)
    
    return true
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
    router.push('/')
  }

  const updatePlan = (plan: string) => {
    if (user) {
      const updatedUser = { ...user, plan: plan as 'basic' | 'premium' | 'free' }
      setUser(updatedUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    signUp,
    updatePlan,
    loading
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