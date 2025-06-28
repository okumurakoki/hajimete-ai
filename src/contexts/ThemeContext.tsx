'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

// テーマの型定義
export type ThemeMode = 'light' | 'dark'
export type ColorTheme = 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'indigo'
export type FontSize = 'small' | 'medium' | 'large'
export type LayoutSize = 'compact' | 'comfortable' | 'wide'

export interface ThemeSettings {
  mode: ThemeMode
  colorTheme: ColorTheme
  fontSize: FontSize
  layoutSize: LayoutSize
}

export interface ThemeContextType {
  theme: ThemeSettings
  settings: ThemeSettings
  updateTheme: (newSettings: Partial<ThemeSettings>) => void
  updateSettings: (newSettings: Partial<ThemeSettings>) => void
  setMode: (mode: ThemeMode) => void
  setColorTheme: (colorTheme: ColorTheme) => void
  setFontSize: (fontSize: FontSize) => void
  setLayoutStyle: (layoutSize: LayoutSize) => void
  toggleMode: () => void
  toggleAnimations: () => void
  toggleHighContrast: () => void
  resetToDefaults: () => void
  resetTheme: () => void
  isDark: boolean
  isAnimationsEnabled: boolean
  isHighContrast: boolean
}

// デフォルトテーマ設定
const defaultSettings: ThemeSettings = {
  mode: 'light',
  colorTheme: 'blue',
  fontSize: 'medium',
  layoutSize: 'comfortable'
}

// 拡張テーマ設定
interface ExtendedThemeSettings extends ThemeSettings {
  isAnimationsEnabled: boolean
  isHighContrast: boolean
}

const defaultExtendedSettings: ExtendedThemeSettings = {
  ...defaultSettings,
  isAnimationsEnabled: true,
  isHighContrast: false
}

// カラーテーマの定義
export const colorThemes = {
  blue: {
    name: 'ブルー',
    primary: 'blue',
    colors: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a'
    }
  },
  green: {
    name: 'グリーン',
    primary: 'green',
    colors: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d'
    }
  },
  purple: {
    name: 'パープル',
    primary: 'purple',
    colors: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87'
    }
  },
  orange: {
    name: 'オレンジ',
    primary: 'orange',
    colors: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12'
    }
  },
  pink: {
    name: 'ピンク',
    primary: 'pink',
    colors: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843'
    }
  },
  indigo: {
    name: 'インディゴ',
    primary: 'indigo',
    colors: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81'
    }
  }
}

// フォントサイズの定義
export const fontSizes = {
  small: {
    name: '小',
    base: '14px',
    scale: 0.875
  },
  medium: {
    name: '中',
    base: '16px',
    scale: 1
  },
  large: {
    name: '大',
    base: '18px',
    scale: 1.125
  }
}

// レイアウトサイズの定義
export const layoutSizes = {
  compact: {
    name: 'コンパクト',
    maxWidth: '5xl',
    padding: 'px-3 py-2'
  },
  comfortable: {
    name: '標準',
    maxWidth: '7xl',
    padding: 'px-4 py-3'
  },
  wide: {
    name: 'ワイド',
    maxWidth: 'full',
    padding: 'px-6 py-4'
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ExtendedThemeSettings>(defaultExtendedSettings)
  const [mounted, setMounted] = useState(false)

  // LocalStorageから設定を読み込み
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('hajimete-ai-theme')
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultExtendedSettings, ...parsed })
      }
    } catch (error) {
      console.error('テーマ設定の読み込みエラー:', error)
      // エラーが発生してもデフォルト設定で続行
      setSettings(defaultExtendedSettings)
    } finally {
      setMounted(true)
    }
  }, [])

  // 設定をLocalStorageに保存
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('hajimete-ai-theme', JSON.stringify(settings))
        updateDocumentTheme(settings)
      } catch (error) {
        console.error('テーマ設定の保存エラー:', error)
      }
    }
  }, [settings, mounted])

  // ドキュメントにテーマを適用
  const updateDocumentTheme = (themeSettings: ExtendedThemeSettings) => {
    const root = document.documentElement
    
    // ダークモード
    if (themeSettings.mode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // カラーテーマ
    const theme = colorThemes[themeSettings.colorTheme]
    Object.entries(theme.colors).forEach(([shade, color]) => {
      root.style.setProperty(`--color-primary-${shade}`, color)
    })

    // フォントサイズ
    const fontSize = fontSizes[themeSettings.fontSize]
    root.style.setProperty('--font-size-base', fontSize.base)
    root.style.setProperty('--font-scale', fontSize.scale.toString())

    // データ属性でテーマ情報を設定
    root.setAttribute('data-theme-mode', themeSettings.mode)
    root.setAttribute('data-color-theme', themeSettings.colorTheme)
    root.setAttribute('data-font-size', themeSettings.fontSize)
    root.setAttribute('data-layout-size', themeSettings.layoutSize)
  }

  const updateTheme = (newSettings: Partial<ExtendedThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const updateSettings = (newSettings: Partial<ExtendedThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const setMode = (mode: ThemeMode) => {
    setSettings(prev => ({ ...prev, mode }))
  }

  const setColorTheme = (colorTheme: ColorTheme) => {
    setSettings(prev => ({ ...prev, colorTheme }))
  }

  const setFontSize = (fontSize: FontSize) => {
    setSettings(prev => ({ ...prev, fontSize }))
  }

  const setLayoutStyle = (layoutSize: LayoutSize) => {
    setSettings(prev => ({ ...prev, layoutSize }))
  }

  const toggleMode = () => {
    setSettings(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light'
    }))
  }

  const toggleAnimations = () => {
    setSettings(prev => ({
      ...prev,
      isAnimationsEnabled: !prev.isAnimationsEnabled
    }))
  }

  const toggleHighContrast = () => {
    setSettings(prev => ({
      ...prev,
      isHighContrast: !prev.isHighContrast
    }))
  }

  const resetToDefaults = () => {
    setSettings(defaultExtendedSettings)
  }

  const resetTheme = () => {
    setSettings(defaultExtendedSettings)
  }

  const value: ThemeContextType = {
    theme: settings,
    settings,
    updateTheme,
    updateSettings,
    setMode,
    setColorTheme,
    setFontSize,
    setLayoutStyle,
    toggleMode,
    toggleAnimations,
    toggleHighContrast,
    resetToDefaults,
    resetTheme,
    isDark: settings.mode === 'dark',
    isAnimationsEnabled: settings.isAnimationsEnabled,
    isHighContrast: settings.isHighContrast
  }

  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div> // SSR対応
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// テーマ用のユーティリティ関数
export function getThemeColors(colorTheme: ColorTheme) {
  return colorThemes[colorTheme].colors
}

export function getFontSizeClass(fontSize: FontSize) {
  const sizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }
  return sizes[fontSize]
}

export function getLayoutClass(layoutSize: LayoutSize) {
  const layouts = {
    compact: 'max-w-5xl px-3 py-2',
    comfortable: 'max-w-7xl px-4 py-3',
    wide: 'max-w-full px-6 py-4'
  }
  return layouts[layoutSize]
}