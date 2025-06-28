'use client';

import React, { useState } from 'react';
import { Moon, Sun, Palette, Type, Layout, Settings, Check } from 'lucide-react';
import { useTheme, type ColorTheme, type FontSize, type LayoutSize } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'icon' | 'button' | 'dropdown';
  className?: string;
}

export default function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps) {
  const { theme, setMode, isDark } = useTheme();

  const toggleMode = () => {
    setMode(isDark ? 'light' : 'dark');
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleMode}
        className={`p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
        title={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={toggleMode}
        className={`flex items-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${className}`}
      >
        {isDark ? (
          <>
            <Sun className="w-4 h-4 mr-2" />
            ライトモード
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 mr-2" />
            ダークモード
          </>
        )}
      </button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleMode}
        className="flex items-center justify-between w-full px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center">
          {isDark ? (
            <Sun className="w-4 h-4 mr-3" />
          ) : (
            <Moon className="w-4 h-4 mr-3" />
          )}
          <span>テーマ切り替え</span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {isDark ? 'ダーク' : 'ライト'}
        </span>
      </button>
    </div>
  );
}

// カラーテーマ選択コンポーネント
export function ColorThemeSelector({ className = '' }: { className?: string }) {
  const { theme, setColorTheme } = useTheme();

  const themes = [
    { key: 'blue' as ColorTheme, name: 'ブルー', color: '#3b82f6' },
    { key: 'green' as ColorTheme, name: 'グリーン', color: '#22c55e' },
    { key: 'purple' as ColorTheme, name: 'パープル', color: '#a855f7' },
    { key: 'orange' as ColorTheme, name: 'オレンジ', color: '#f97316' },
    { key: 'pink' as ColorTheme, name: 'ピンク', color: '#ec4899' },
    { key: 'indigo' as ColorTheme, name: 'インディゴ', color: '#6366f1' },
  ];

  return (
    <div className={className}>
      <div className="flex items-center mb-3">
        <Palette className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">カラーテーマ</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {themes.map((themeOption) => (
          <button
            key={themeOption.key}
            onClick={() => setColorTheme(themeOption.key)}
            className={`flex items-center p-2 rounded-lg border transition-colors ${
              theme.colorTheme === themeOption.key
                ? 'border-current bg-gray-50 dark:bg-gray-800'
                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            style={{ color: themeOption.color }}
          >
            <div
              className="w-4 h-4 rounded-full mr-2 border border-gray-200 dark:border-gray-600"
              style={{ backgroundColor: themeOption.color }}
            />
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {themeOption.name}
            </span>
            {theme.colorTheme === themeOption.key && (
              <Check className="w-3 h-3 ml-auto" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// フォントサイズ選択コンポーネント
export function FontSizeSelector({ className = '' }: { className?: string }) {
  const { theme, setFontSize } = useTheme();

  const fontSizes = [
    { key: 'small' as FontSize, name: '小', size: '14px' },
    { key: 'medium' as FontSize, name: '中', size: '16px' },
    { key: 'large' as FontSize, name: '大', size: '18px' },
  ];

  return (
    <div className={className}>
      <div className="flex items-center mb-3">
        <Type className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">フォントサイズ</span>
      </div>
      <div className="flex space-x-2">
        {fontSizes.map((size) => (
          <button
            key={size.key}
            onClick={() => setFontSize(size.key)}
            className={`flex-1 p-2 rounded-lg border text-center transition-colors ${
              theme.fontSize === size.key
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <div className="text-xs text-gray-500 dark:text-gray-400">{size.size}</div>
            <div className="font-medium">{size.name}</div>
            {theme.fontSize === size.key && (
              <Check className="w-3 h-3 mx-auto mt-1" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// レイアウトスタイル選択コンポーネント
export function LayoutStyleSelector({ className = '' }: { className?: string }) {
  const { theme, setLayoutStyle } = useTheme();

  const layouts = [
    { key: 'compact' as LayoutSize, name: 'コンパクト', icon: '⚡', description: '狭い表示' },
    { key: 'comfortable' as LayoutSize, name: '標準', icon: '📱', description: '通常表示' },
    { key: 'wide' as LayoutSize, name: 'ワイド', icon: '🖥️', description: '広い表示' },
  ];

  return (
    <div className={className}>
      <div className="flex items-center mb-3">
        <Layout className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">レイアウト</span>
      </div>
      <div className="space-y-2">
        {layouts.map((layout) => (
          <button
            key={layout.key}
            onClick={() => setLayoutStyle(layout.key)}
            className={`w-full flex items-center p-3 rounded-lg border text-left transition-colors ${
              theme.layoutSize === layout.key
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <span className="text-lg mr-3">{layout.icon}</span>
            <div className="flex-1">
              <div className="font-medium">{layout.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{layout.description}</div>
            </div>
            {theme.layoutSize === layout.key && (
              <Check className="w-4 h-4" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// 包括的テーマ設定パネル
export function ThemeSettingsPanel({ className = '' }: { className?: string }) {
  const { theme, toggleAnimations, toggleHighContrast, resetTheme, isAnimationsEnabled, isHighContrast } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <Settings className="w-4 h-4 mr-2" />
        テーマ設定
      </button>

      {isOpen && (
        <>
          {/* オーバーレイ */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 設定パネル */}
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                テーマ設定
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* ダークモード切り替え */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <ThemeToggle variant="dropdown" />
            </div>

            {/* カラーテーマ選択 */}
            <ColorThemeSelector />

            {/* フォントサイズ選択 */}
            <FontSizeSelector />

            {/* レイアウト選択 */}
            <LayoutStyleSelector />

            {/* その他設定 */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">その他</h4>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">アニメーション</span>
                <button
                  onClick={toggleAnimations}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    isAnimationsEnabled
                      ? 'bg-primary-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      isAnimationsEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">ハイコントラスト</span>
                <button
                  onClick={toggleHighContrast}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    isHighContrast
                      ? 'bg-primary-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      isHighContrast ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>

            {/* リセットボタン */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                onClick={resetTheme}
                className="w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                設定をリセット
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}