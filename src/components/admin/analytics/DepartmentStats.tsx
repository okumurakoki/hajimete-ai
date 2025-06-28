'use client'

import React from 'react'
import { Building2, Users, BookOpen, TrendingUp, Award } from 'lucide-react'

interface DepartmentData {
  name: string
  students: number
  courses: number
  completion: number
}

interface DepartmentStatsProps {
  departments: DepartmentData[]
  title?: string
}

export default function DepartmentStats({ 
  departments, 
  title = "部門別統計" 
}: DepartmentStatsProps) {
  const getCompletionColor = (completion: number) => {
    if (completion >= 80) return 'bg-green-500'
    if (completion >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getCompletionTextColor = (completion: number) => {
    if (completion >= 80) return 'text-green-700'
    if (completion >= 70) return 'text-yellow-700'
    return 'text-red-700'
  }

  const getDepartmentIcon = (name: string) => {
    if (name.includes('AI')) return '🤖'
    if (name.includes('効率')) return '⚡'
    if (name.includes('実践')) return '🎯'
    return '📚'
  }

  const totalStudents = departments.reduce((sum, dept) => sum + dept.students, 0)
  const totalCourses = departments.reduce((sum, dept) => sum + dept.courses, 0)
  const avgCompletion = Math.round(departments.reduce((sum, dept) => sum + dept.completion, 0) / departments.length)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Building2 className="w-6 h-6 text-blue-500 mr-2" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          3つの学部
        </div>
      </div>

      {/* 部門カード */}
      <div className="space-y-4 mb-6">
        {departments.map((dept, index) => (
          <div 
            key={dept.name} 
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
          >
            {/* 部門ヘッダー */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getDepartmentIcon(dept.name)}</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{dept.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    学生数: {dept.students.toLocaleString()}人 | コース数: {dept.courses}
                  </p>
                </div>
              </div>
              <div className={`text-right ${getCompletionTextColor(dept.completion)}`}>
                <div className="text-lg font-bold">{dept.completion}%</div>
                <div className="text-xs">完了率</div>
              </div>
            </div>

            {/* 統計バー */}
            <div className="space-y-2">
              {/* 学生数バー */}
              <div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
                  <span>学生数</span>
                  <span>{((dept.students / totalStudents) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(dept.students / totalStudents) * 100}%` }}
                  />
                </div>
              </div>

              {/* 完了率バー */}
              <div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
                  <span>完了率</span>
                  <span>{dept.completion}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getCompletionColor(dept.completion)}`}
                    style={{ width: `${dept.completion}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 詳細メトリクス */}
            <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {Math.round(dept.students / dept.courses)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">学生/コース</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {dept.courses}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">アクティブ</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-green-600">
                  +{Math.floor(Math.random() * 10) + 5}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">成長率</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 全体サマリー */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-300">総学生数</span>
            </div>
            <div className="text-lg font-bold text-blue-600">
              {totalStudents.toLocaleString()}人
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center mb-1">
              <BookOpen className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-300">総コース数</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              {totalCourses}コース
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center mb-1">
              <Award className="w-4 h-4 text-purple-500 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-300">平均完了率</span>
            </div>
            <div className="text-lg font-bold text-purple-600">
              {avgCompletion}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}