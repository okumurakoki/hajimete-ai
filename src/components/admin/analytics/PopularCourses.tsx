'use client'

import React from 'react'
import { Trophy, TrendingUp, Users, Clock, Star } from 'lucide-react'

interface Course {
  id: string
  title: string
  enrolledCount: number
  department: string
  growth: number
}

interface PopularCoursesProps {
  courses: Course[]
  title?: string
}

export default function PopularCourses({ 
  courses, 
  title = "人気コースランキング" 
}: PopularCoursesProps) {
  const getRankingIcon = (index: number) => {
    switch (index) {
      case 0: return { icon: '🥇', color: 'text-yellow-500' }
      case 1: return { icon: '🥈', color: 'text-gray-400' }
      case 2: return { icon: '🥉', color: 'text-orange-400' }
      default: return { icon: `${index + 1}`, color: 'text-gray-500' }
    }
  }

  const getDifficultyColor = (growth: number) => {
    if (growth >= 15) return 'text-green-600 bg-green-100'
    if (growth >= 10) return 'text-blue-600 bg-blue-100'
    if (growth >= 5) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          リアルタイム更新
        </div>
      </div>

      {/* ランキングリスト */}
      <div className="space-y-4">
        {courses.map((course, index) => {
          const ranking = getRankingIcon(index)
          return (
            <div 
              key={course.id} 
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {/* ランキングとコース情報 */}
              <div className="flex items-center space-x-4 flex-1">
                {/* ランキング番号 */}
                <div className={`w-8 h-8 rounded-full ${ranking.color} flex items-center justify-center font-bold text-lg`}>
                  {ranking.icon}
                </div>

                {/* コース詳細 */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {course.title}
                  </h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {course.enrolledCount.toLocaleString()}人
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                      {course.department}
                    </span>
                  </div>
                </div>
              </div>

              {/* 成長率 */}
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${getDifficultyColor(course.growth)} dark:bg-opacity-80`}>
                  +{course.growth}%
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* フッター統計 */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">平均受講者数</p>
          <p className="text-lg font-bold text-blue-600">
            {Math.round(courses.reduce((sum, course) => sum + course.enrolledCount, 0) / courses.length).toLocaleString()}人
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">平均成長率</p>
          <p className="text-lg font-bold text-green-600">
            +{Math.round(courses.reduce((sum, course) => sum + course.growth, 0) / courses.length)}%
          </p>
        </div>
      </div>

      {/* 更新時刻 */}
      <div className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-center">
        最終更新: {new Date().toLocaleTimeString('ja-JP')}
      </div>
    </div>
  )
}