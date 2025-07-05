import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card = ({ children, className = "" }: CardProps) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
    {children}
  </div>
)

export const CardHeader = ({ children, className = "" }: CardProps) => (
  <div className={`p-6 ${className}`}>{children}</div>
)

export const CardContent = ({ children, className = "" }: CardProps) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
)

export const CardTitle = ({ children, className = "" }: CardProps) => (
  <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${className}`}>{children}</h3>
)

export const CardDescription = ({ children, className = "" }: CardProps) => (
  <p className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>{children}</p>
)

export const CardFooter = ({ children, className = "" }: CardProps) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
)