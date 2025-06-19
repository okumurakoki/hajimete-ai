'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// 統合データ型定義
export interface AdminData {
  users: {
    total: number
    active: number
    premium: number
    basic: number
    free: number
    newThisMonth: number
    churnRate: number
    growthRate: number
    dailyActive: number
  }
  content: {
    videos: {
      total: number
      published: number
      draft: number
      totalViews: number
      avgWatchTime: number
      completionRate: number
    }
    seminars: {
      total: number
      upcoming: number
      completed: number
      totalAttendees: number
      avgRating: number
      attendanceRate: number
    }
  }
  revenue: {
    total: number
    monthly: number
    avgPerUser: number
    conversionRate: number
    growthRate: number
  }
  engagement: {
    sessionDuration: number
    pageViews: number
    bounceRate: number
    retentionRate: number
  }
  system: {
    database: {
      size: string
      tables: number
      lastBackup: string
      status: 'healthy' | 'warning' | 'error'
    }
    storage: {
      used: string
      total: string
      percentage: number
    }
    performance: {
      uptime: string
      responseTime: number
      status: 'good' | 'slow' | 'critical'
    }
  }
}

interface AdminDataContextType {
  data: AdminData
  loading: boolean
  lastUpdated: Date
  refreshData: () => Promise<void>
  updateData: (updates: Partial<AdminData>) => void
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined)

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AdminData>({
    users: {
      total: 2847,
      active: 1923,
      premium: 456,
      basic: 1234,
      free: 1157,
      newThisMonth: 156,
      churnRate: 3.2,
      growthRate: 12.4,
      dailyActive: 1234
    },
    content: {
      videos: {
        total: 156,
        published: 142,
        draft: 14,
        totalViews: 89654,
        avgWatchTime: 24.5,
        completionRate: 73.2
      },
      seminars: {
        total: 28,
        upcoming: 8,
        completed: 20,
        totalAttendees: 2156,
        avgRating: 4.6,
        attendanceRate: 89.3
      }
    },
    revenue: {
      total: 15450000,
      monthly: 1245000,
      avgPerUser: 5432,
      conversionRate: 16.2,
      growthRate: 23.7
    },
    engagement: {
      sessionDuration: 28.5,
      pageViews: 45678,
      bounceRate: 34.2,
      retentionRate: 78.9
    },
    system: {
      database: {
        size: '156.7 MB',
        tables: 24,
        lastBackup: '2024-06-18 14:30:00',
        status: 'healthy'
      },
      storage: {
        used: '2.3 GB',
        total: '10 GB',
        percentage: 23
      },
      performance: {
        uptime: '99.9%',
        responseTime: 245,
        status: 'good'
      }
    }
  })

  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // データ同期ロジック
  const refreshData = async () => {
    setLoading(true)
    try {
      // 実際のAPIコールをシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // ランダムなデータ変動をシミュレート
      setData(prevData => ({
        ...prevData,
        users: {
          ...prevData.users,
          total: prevData.users.total + Math.floor(Math.random() * 10 - 5),
          active: prevData.users.active + Math.floor(Math.random() * 50 - 25),
          newThisMonth: prevData.users.newThisMonth + Math.floor(Math.random() * 5 - 2)
        },
        content: {
          ...prevData.content,
          videos: {
            ...prevData.content.videos,
            totalViews: prevData.content.videos.totalViews + Math.floor(Math.random() * 100)
          }
        },
        revenue: {
          ...prevData.revenue,
          monthly: prevData.revenue.monthly + Math.floor(Math.random() * 50000 - 25000)
        }
      }))
      
      setLastUpdated(new Date())
    } catch (error) {
      console.error('データ更新エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateData = (updates: Partial<AdminData>) => {
    setData(prevData => ({
      ...prevData,
      ...updates
    }))
    setLastUpdated(new Date())
  }

  // 定期的なデータ更新
  useEffect(() => {
    const interval = setInterval(refreshData, 300000) // 5分ごと
    return () => clearInterval(interval)
  }, [])

  const value: AdminDataContextType = {
    data,
    loading,
    lastUpdated,
    refreshData,
    updateData
  }

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  )
}

export function useAdminData() {
  const context = useContext(AdminDataContext)
  if (context === undefined) {
    throw new Error('useAdminData must be used within an AdminDataProvider')
  }
  return context
}