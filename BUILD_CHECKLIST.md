# 🏗️ ビルドエラー防止チェックリスト

## ❌ 今回発生したエラーパターン

### 1. **Clerk SSR/SSG エラー**
- **原因**: `useUser`, `useAuth`等のクライアントフックがSSG時に実行される
- **解決策**: `export const dynamic = 'force-dynamic'`をページに追加
- **根本対策**: 認証状態をサーバーサイドで管理する設計に変更

### 2. **Prisma ビルドエラー**
- **原因**: `prisma generate`がビルド時に失敗
- **解決策**: ビルドスクリプトからPrisma除去、モックデータ使用
- **根本対策**: データベース接続をオプショナルにする

### 3. **TypeScript型エラー**
- **原因**: `req.ip`等のNode.js固有プロパティがNext.js環境で未定義
- **解決策**: `req.headers.get()`を使用
- **根本対策**: 環境固有のAPIを抽象化

## ✅ 事前チェック手順

### Phase 1: 依存関係チェック
```bash
# 1. 全依存関係の互換性確認
npm ls
# 2. TypeScript型チェック
npx tsc --noEmit
# 3. ESLint確認
npm run lint
```

### Phase 2: 段階的ビルドテスト
```bash
# 1. 開発ビルド
npm run dev
# 2. 型チェック付きビルド
npm run build
# 3. 本番ビルド
NODE_ENV=production npm run build
```

### Phase 3: 認証・DB分離テスト
```bash
# 1. DB無しでビルド
SKIP_DB=true npm run build
# 2. 認証無しでビルド  
SKIP_AUTH=true npm run build
```

## 🎯 今後の設計原則

### 1. **認証の条件分岐設計**
```typescript
// ❌ 悪い例
const { user } = useUser() // SSRでエラー

// ✅ 良い例
function useAuthSafe() {
  if (typeof window === 'undefined') return { user: null }
  return useUser()
}
```

### 2. **環境依存コードの分離**
```typescript
// utils/env.ts
export const isClient = typeof window !== 'undefined'
export const isServer = !isClient

// components/AuthComponent.tsx
if (isClient) {
  const { user } = useUser()
}
```

### 3. **ビルド時設定の統一**
```javascript
// next.config.mjs
const nextConfig = {
  // 認証必須ページは動的レンダリング強制
  experimental: {
    optimizeCss: true
  }
}
```

## 🚨 エラー発生時の対応手順

1. **エラー分類**: 上記パターンのどれに該当するか特定
2. **影響範囲特定**: 同じパターンの箇所を一括検索
3. **一括修正**: 同じ問題を全て一度に解決
4. **検証**: 修正後に全体ビルドテスト
5. **記録**: 新しいパターンの場合はこのリストに追加

## 📋 定期メンテナンス

### 週次チェック
- [ ] 依存関係アップデート確認
- [ ] ビルド時間測定
- [ ] 新しいエラーパターンの記録

### 月次チェック  
- [ ] Next.js/Clerk/Prisma最新版への対応検討
- [ ] パフォーマンス最適化
- [ ] このチェックリスト更新