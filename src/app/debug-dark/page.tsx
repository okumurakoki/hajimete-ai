'use client'

import { useState, useEffect } from 'react'

export default function DebugDarkMode() {
  const [isDark, setIsDark] = useState(false)

  const toggleDark = () => {
    const newDark = !isDark
    setIsDark(newDark)
    
    if (newDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Check if dark class exists
      const hasClass = document.documentElement.classList.contains('dark')
      setIsDark(hasClass)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Dark Mode Debug Page
        </h1>
        
        <button
          onClick={toggleDark}
          className="mb-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
        >
          Toggle Dark Mode (Current: {isDark ? 'Dark' : 'Light'})
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Test Card 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Test Card 1
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This should change from white to dark gray background.
            </p>
            <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-1/2"></div>
            </div>
          </div>

          {/* Test Card 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Test Card 2  
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Another test card for dark mode verification.
            </p>
            <button className="mt-4 w-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-md">
              Test Button
            </button>
          </div>

          {/* Test Card 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Test Card 3
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Final test card to verify dark mode CSS application.
            </p>
            <div className="mt-4 flex space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
            </div>
          </div>
        </div>

        {/* Debug Information */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Debug Information
          </h3>
          <div className="space-y-2 text-sm font-mono">
            <div>HTML class: <span className="text-blue-600">{typeof document !== 'undefined' ? document.documentElement.className : 'SSR'}</span></div>
            <div>Current theme: <span className="text-green-600">{isDark ? 'dark' : 'light'}</span></div>
            <div>Body background: <span className="text-purple-600">{typeof window !== 'undefined' && typeof document !== 'undefined' ? window.getComputedStyle(document.body).backgroundColor : 'SSR'}</span></div>
          </div>
          
          <button
            onClick={() => {
              const element = document.querySelector('.bg-white.dark\\:bg-gray-800')
              console.log('🔍 Debug Results:')
              console.log('Element found:', !!element)
              console.log('Element classes:', element?.className)
              
              if (element) {
                const computed = window.getComputedStyle(element)
                console.log('Current background:', computed.backgroundColor)
                console.log('Current color:', computed.color)
              }
              
              console.log('Document classes:', document.documentElement.className)
              console.log('Dark class exists:', document.documentElement.classList.contains('dark'))
            }}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm"
          >
            Run Debug in Console
          </button>
        </div>
      </div>
    </div>
  )
}