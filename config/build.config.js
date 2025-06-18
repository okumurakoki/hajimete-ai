// ビルド設定の統一管理
module.exports = {
  // 環境別設定
  environments: {
    development: {
      enableAuth: true,
      enableDB: true,
      staticOptimization: false
    },
    build: {
      enableAuth: false,  // ビルド時は認証無効
      enableDB: false,    // ビルド時はDB無効
      staticOptimization: true
    },
    production: {
      enableAuth: true,
      enableDB: true,
      staticOptimization: true
    }
  },

  // 認証が必要なページ（動的レンダリング強制）
  authRequiredPages: [
    '/dashboard',
    '/admin/**',
    '/videos/**',
    '/seminars',
    '/live',
    '/plan-selection'
  ],

  // Clerkフックを使用するコンポーネント
  clerkComponents: [
    'src/components/Header.tsx',
    'src/components/AdminLayout.tsx', 
    'src/app/*/page.tsx'
  ],

  // ビルド時にスキップするAPI
  skipApisInBuild: [
    '/api/auth/**',
    '/api/user/**',
    '/api/admin/**'
  ],

  // エラー処理設定
  errorHandling: {
    clerkFallback: { user: null, isSignedIn: false },
    dbFallback: 'mock',
    buildContinueOnError: false
  }
}