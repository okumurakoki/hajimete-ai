# 🚀 Vercel本番デプロイガイド

## 📋 事前準備完了
- ✅ **プロジェクト**: 完全に本番レディ
- ✅ **環境変数**: 全て設定済み
- ✅ **データベース**: Supabase本番環境稼働中
- ✅ **認証**: Clerk本番キー設定済み
- ✅ **決済**: Stripe設定完了

## 🌐 Vercel ブラウザデプロイ手順

### Step 1: プロジェクトをGitHubにプッシュ
```bash
# Gitリポジトリ初期化（未実施の場合）
git init
git add .
git commit -m "🚀 はじめて.AI 本番デプロイ準備完了

✅ Clerk認証システム
✅ Supabase PostgreSQL
✅ Stripe決済システム
✅ 4学部動画プラットフォーム
✅ 管理画面CMS

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# GitHubリポジトリ作成・プッシュ
# (GitHubで新規リポジトリ作成後)
git remote add origin https://github.com/YOUR_USERNAME/hajimete-ai.git
git branch -M main
git push -u origin main
```

### Step 2: Vercel Import Project
**https://vercel.com/new** で：

1. **「Import Git Repository」**
2. **GitHub**を選択
3. **hajimete-ai**リポジトリを選択
4. **「Import」**をクリック

### Step 3: プロジェクト設定
- **Project Name**: `hajimete-ai`
- **Framework**: `Next.js` (自動検出)
- **Root Directory**: `./` (デフォルト)

### Step 4: 環境変数設定
**Environment Variables**セクションで以下を追加：

```env
# データベース
DATABASE_URL=postgresql://postgres:Kohki040108%40@db.klqwcvarjenasafjjbqt.supabase.co:5432/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://klqwcvarjenasafjjbqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtscXdjdmFyamVuYXNhZmpqYnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMjY3MDgsImV4cCI6MjA2NTgwMjcwOH0.BSP8vjS9gQbaazMlV0qv0T3Akqf_L9ibjGM5P_oGEjs
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtscXdjdmFyamVuYXNhZmpqYnF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDIyNjcwOCwiZXhwIjoyMDY1ODAyNzA4fQ.I9lK6CujJHMuka7FyWnCAqjLBzNiFOl7c1d2o7rtLyc

# Clerk認証
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cGxlYXNlZC1zaGluZXItODQuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_36rJXKDraAyZUThOpf2xpO23dvgd0MDCfmYVOeax7B
CLERK_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/plan-selection

# Stripe決済
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51L03uYKnrmty0hAG314ZwUjcFSO6csQQPfzoHEt0vSoqSF3eGvwcM3w4Sk3pIgwueWGXXb70SRb98fGAoEDUjsMJ00kTbyJ0Jv
STRIPE_SECRET_KEY=sk_test_51L03uYKnrmty0hAGYyy5hMYPR3x9mJr0E5FzPkPbVa8FgPHPk9TpwYeI0LopKJfMUmtMnmudH53gmYtmjEvoRBrl00tdIYItV9
STRIPE_BASIC_PRICE_ID=price_1RbFUBKnrmty0hAG5K00xgNx
STRIPE_PREMIUM_PRICE_ID=price_1RbFUaKnrmty0hAGgzQK1HB1

# アプリケーション設定
NEXT_PUBLIC_APP_URL=https://hajimete-ai.vercel.app
NODE_ENV=production

# セキュリティ
ENCRYPTION_KEY=hajimete-ai-encryption-key-change-in-production

# Build設定
SKIP_ENV_VALIDATION=true
```

### Step 5: デプロイ実行
**「Deploy」**をクリック

## 🔄 デプロイ後の設定

### 1. Clerk設定更新
デプロイURL取得後：
1. **Clerk Dashboard** → **Domains**
2. **Production domain**: `https://your-app.vercel.app` を追加

### 2. Stripe Webhook更新
1. **Stripe Dashboard** → **Webhooks**
2. **新しいエンドポイント作成**:
   - URL: `https://your-app.vercel.app/api/payments/webhook`
   - Events: subscription + invoice イベント

### 3. 動作確認
- ✅ **ホームページ**: https://your-app.vercel.app
- ✅ **認証**: サインアップ・ログイン
- ✅ **学部**: 4学部表示
- ✅ **管理画面**: 統計データ
- ✅ **決済**: プラン選択

---

## 🎯 現在の進行状況

**進行中**: GitHub リポジトリ作成 → Vercel Import

**完了後**: 本番URL取得 → 外部サービス設定更新