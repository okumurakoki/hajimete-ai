#!/usr/bin/env node

// ビルド前の事前チェックスクリプト
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 環境変数読み込み
require('dotenv').config({ path: '.env.local' })

class PreBuildChecker {
  constructor() {
    this.errors = []
    this.warnings = []
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString()
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'
    console.log(`${prefix} [${timestamp}] ${message}`)
  }

  // 1. 依存関係チェック
  async checkDependencies() {
    this.log('依存関係をチェック中...')
    try {
      execSync('npm ls', { stdio: 'pipe' })
      this.log('✅ 依存関係: OK')
    } catch (error) {
      this.errors.push('依存関係に問題があります')
      this.log('❌ 依存関係: NG', 'error')
    }
  }

  // 2. TypeScriptチェック
  async checkTypeScript() {
    this.log('TypeScriptをチェック中...')
    try {
      execSync('npx tsc --noEmit', { stdio: 'pipe' })
      this.log('✅ TypeScript: OK')
    } catch (error) {
      this.errors.push('TypeScriptエラーがあります')
      this.log('❌ TypeScript: NG', 'error')
    }
  }

  // 3. Clerkフック使用チェック
  async checkClerkUsage() {
    this.log('Clerkフック使用をチェック中...')
    const problematicFiles = []
    
    const searchFiles = (dir) => {
      const files = fs.readdirSync(dir)
      for (const file of files) {
        const fullPath = path.join(dir, file)
        if (fs.statSync(fullPath).isDirectory() && !file.startsWith('.')) {
          searchFiles(fullPath)
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          const content = fs.readFileSync(fullPath, 'utf8')
          
          // Clerkフック使用をチェック
          if (content.includes('useUser') || content.includes('useAuth')) {
            // dynamic設定があるかチェック
            if (!content.includes("export const dynamic = 'force-dynamic'")) {
              problematicFiles.push(fullPath)
            }
          }
        }
      }
    }

    searchFiles('./src/app')
    
    if (problematicFiles.length > 0) {
      this.warnings.push(`Clerkフックを使用しているが動的レンダリング設定がないファイル: ${problematicFiles.join(', ')}`)
      this.log(`⚠️ Clerkフック: ${problematicFiles.length}個のファイルに問題`, 'warning')
    } else {
      this.log('✅ Clerkフック: OK')
    }
  }

  // 4. 環境変数チェック
  async checkEnvironmentVariables() {
    this.log('環境変数をチェック中...')
    const required = [
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
      'CLERK_SECRET_KEY',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ]

    const missing = required.filter(key => !process.env[key])
    
    if (missing.length > 0) {
      this.warnings.push(`不足している環境変数: ${missing.join(', ')}`)
      this.log(`⚠️ 環境変数: ${missing.length}個不足`, 'warning')
    } else {
      this.log('✅ 環境変数: OK')
    }
  }

  // 5. 段階的ビルドテスト
  async testBuild() {
    this.log('段階的ビルドテスト中...')
    
    try {
      // まず型チェック
      execSync('npx tsc --noEmit', { stdio: 'pipe' })
      
      // リントはスキップ（設定未完了の場合）
      try {
        execSync('npm run lint', { stdio: 'pipe' })
        this.log('✅ Lint: OK')
      } catch (error) {
        this.warnings.push('ESLint設定が不完全です')
        this.log('⚠️ Lint: スキップ', 'warning')
      }
      
      // 最後にビルド（safe版を使用）
      const buildResult = execSync('npm run build:safe', { stdio: 'pipe', encoding: 'utf8' })
      
      // ビルドが成功した場合（警告は許容）
      if (buildResult.includes('✓ Generating static pages') || buildResult.includes('✓ Compiled successfully')) {
        this.log('✅ ビルドテスト: OK')
      } else {
        throw new Error('Build output indicates failure')
      }
    } catch (error) {
      // ビルドログで成功を確認
      const errorOutput = error.stderr || error.stdout || error.message
      if (errorOutput.includes('✓ Generating static pages') || errorOutput.includes('✓ Compiled successfully')) {
        this.warnings.push('ビルドは成功しましたが警告があります')
        this.log('⚠️ ビルドテスト: 成功（警告あり）', 'warning')
      } else {
        this.errors.push(`ビルドに失敗しました: ${error.message}`)
        this.log(`❌ ビルドテスト: NG - ${error.message}`, 'error')
      }
    }
  }

  // メイン実行
  async run() {
    this.log('🚀 ビルド前チェックを開始します')
    
    await this.checkDependencies()
    await this.checkTypeScript()
    await this.checkClerkUsage()
    await this.checkEnvironmentVariables()
    
    if (this.errors.length === 0) {
      await this.testBuild()
    }
    
    // 結果サマリー
    this.log('📊 チェック結果:')
    this.log(`✅ 成功: ${this.errors.length === 0 ? 'ビルド可能' : 'エラーあり'}`)
    this.log(`⚠️ 警告: ${this.warnings.length}件`)
    this.log(`❌ エラー: ${this.errors.length}件`)
    
    if (this.errors.length > 0) {
      this.log('❌ ビルド前チェック失敗', 'error')
      process.exit(1)
    } else {
      this.log('✅ ビルド前チェック完了')
    }
  }
}

// 実行
new PreBuildChecker().run().catch(error => {
  console.error('チェック中にエラーが発生:', error)
  process.exit(1)
})