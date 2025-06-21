'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { AdminDataProvider } from '@/contexts/AdminDataContext'
import { UserProgressProvider } from '@/contexts/UserProgressContext'
import { UserFavoritesProvider } from '@/contexts/UserFavoritesContext'

interface ClientProvidersProps {
  children: React.ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <AuthProvider>
      <UserProgressProvider>
        <UserFavoritesProvider>
          <AdminDataProvider>
            {children}
          </AdminDataProvider>
        </UserFavoritesProvider>
      </UserProgressProvider>
    </AuthProvider>
  )
}