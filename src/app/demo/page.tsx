'use client'

import Link from 'next/link'
import { Play, Users, BookOpen, Star, ChevronRight, TrendingUp, Clock, Award } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function DemoPage() {
  const stats = [
    { label: '学習者数', value: '10,000+', icon: Users },
    { label: '動画コンテンツ', value: '500+', icon: Play },
    { label: '完了率', value: '95%', icon: Award },
    { label: '満足度', value: '4.9/5', icon: Star },
  ]

  const departments = [
    {
      id: 'ai-basics',
      name: 'AI基礎学部',
      description: 'AIの基本概念から機械学習の仕組みまで',
      videoCount: 120,
      duration: '40時間',
      color: 'bg-blue-500',
      icon: '🤖'
    },
    {
      id: 'practical-application', 
      name: '実践活用学部',
      description: 'ChatGPTやAIツールの効果的な使い方',
      videoCount: 85,
      duration: '25時間',
      color: 'bg-green-500',
      icon: '⚡'
    },
    {
      id: 'data-science',
      name: 'データサイエンス学部', 
      description: 'データ分析とPythonプログラミング',
      videoCount: 95,
      duration: '35時間',
      color: 'bg-purple-500',
      icon: '📊'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">はじめて.AI</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/demo" className="text-blue-600 font-medium">ホーム</Link>
              <a href="#departments" className="text-gray-600 hover:text-gray-900">学部紹介</a>
              <a href="#features" className="text-gray-600 hover:text-gray-900">特徴</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AIを学ぶなら
            <span className="text-blue-600 block">はじめて.AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            初心者から上級者まで、あなたのレベルに合わせた高品質なAI学習コンテンツを提供します。
            実践的なスキルを身につけて、AI時代をリードしましょう。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Play size={12} />
              今すぐ学習を始める
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              コース詳細を見る
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section id="departments" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">学部紹介</h2>
            <p className="text-xl text-gray-600">
              7つの専門学部で、体系的にAIスキルを身につけられます
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`h-2 ${dept.color}`}></div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{dept.icon}</span>
                    <h3 className="text-xl font-bold text-gray-900">{dept.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-6">{dept.description}</p>
                  <div className="flex justify-between text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1">
                      <Play size={10} />
                      {dept.videoCount}本の動画
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {dept.duration}
                    </span>
                  </div>
                  <button className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    コースを見る
                    <ChevronRight size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">なぜはじめて.AIが選ばれるのか</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">体系的なカリキュラム</h3>
              <p className="text-gray-600">基礎から応用まで段階的に学べる構造化されたコース設計</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">実践重視</h3>
              <p className="text-gray-600">すぐに現場で使える実践的なスキルとノウハウを習得</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">コミュニティ</h3>
              <p className="text-gray-600">同じ目標を持つ仲間と一緒に学び、成長できる環境</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <span className="ml-2 text-xl font-bold">はじめて.AI</span>
            </div>
            <p className="text-gray-400 mb-8">AI学習で未来を切り開こう</p>
            <div className="text-gray-500 text-sm">
              © 2024 はじめて.AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}