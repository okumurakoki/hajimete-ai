# 🚀 はじめて.AI サービス本格開始ガイド

## Phase 1: Clerk認証システム設定 (10分)

### 1.1 Clerkアカウント作成
1. **Clerk Dashboard にアクセス**
   - [Clerk Dashboard](https://dashboard.clerk.com/) を開く
   - 「Sign up」でアカウント作成
   - GitHubアカウントでサインアップ推奨

2. **新しいアプリケーション作成**
   - 「Create application」をクリック
   - **Application name**: `はじめて.AI`
   - **Sign-in options**: 
     - ✅ Email address
     - ✅ Password  
     - ✅ Google (オプション)
     - ✅ GitHub (オプション)
   - 「Create application」をクリック

### 1.2 API Keys取得
アプリケーション作成後、**API Keys**ページで以下を取得：

```env
# 以下をコピーして.env.localに設定
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxx"
CLERK_SECRET_KEY="sk_test_xxxxxxxx"
```

### 1.3 環境変数更新
`.env.local` ファイルの以下の部分を実際の値に更新：

```env
# Clerk認証設定（実際の値に更新）
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_ここに実際のキーを入力"
CLERK_SECRET_KEY="sk_test_ここに実際のキーを入力"
```

### 1.4 Webhook設定
1. **Clerk Dashboard** → **Webhooks**
2. 「Add endpoint」をクリック
3. **Endpoint URL**: `http://localhost:3000/api/auth/webhook` (一時的)
4. **Events to listen for**:
   - ✅ user.created
   - ✅ user.updated  
   - ✅ user.deleted
5. 「Create」をクリック
6. **Signing secret**をコピーして環境変数に追加：
   ```env
   CLERK_WEBHOOK_SECRET="whsec_xxxxxxxx"
   ```

---

## Phase 2: Supabase PostgreSQL設定 (15分)

### 2.1 Supabaseプロジェクト作成
1. [Supabase Dashboard](https://supabase.com/dashboard) にアクセス
2. 「New Project」をクリック
3. プロジェクト設定:
   - **Name**: `hajimete-ai-production`
   - **Database Password**: 強力なパスワード（記録必須！）
   - **Region**: `Northeast Asia (Tokyo)`
4. 「Create new project」をクリック（2-3分待機）

### 2.2 接続情報取得
プロジェクト作成完了後：

1. **Settings** → **API** から取得:
```env
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="xxxxxxxxxx"
SUPABASE_SERVICE_ROLE_KEY="xxxxxxxxxx"
```

2. **Settings** → **Database** から取得:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### 2.3 PostgreSQLスキーマ復元
```bash
# PostgreSQLスキーマに戻す
cp prisma/schema.postgres.prisma prisma/schema.prisma
cp prisma/seed.postgres.ts prisma/seed.ts

# 環境変数更新後
npm run db:generate
npm run db:push
npm run db:seed
```

---

## Phase 3: Stripe決済システム設定 (10分)

### 3.1 Stripeアカウント作成
1. [Stripe Dashboard](https://dashboard.stripe.com/) にアクセス
2. アカウント作成（個人/法人選択）
3. **テストモード**で開始

### 3.2 API Keys取得
**Developers** → **API keys** から:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxxxxxxx"
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxx"
```

### 3.3 商品・価格作成
1. **Products** → **Add product**
2. **ベーシックプラン**:
   - Name: `ベーシックプラン`
   - Price: `¥1,650` / month
   - Recurring: Monthly
3. **プレミアムプラン**:
   - Name: `プレミアムプラン`  
   - Price: `¥5,500` / month
   - Recurring: Monthly

### 3.4 Webhook設定
1. **Developers** → **Webhooks** → **Add endpoint**
2. **Endpoint URL**: `http://localhost:3000/api/payments/webhook`
3. **Events**:
   - ✅ customer.subscription.created
   - ✅ customer.subscription.updated
   - ✅ customer.subscription.deleted
   - ✅ invoice.payment_succeeded
   - ✅ invoice.payment_failed
4. **Signing secret**をコピー:
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxx"
   ```

---

## Phase 4: 動作確認 (5分)

### 4.1 サーバー再起動
```bash
# 環境変数更新後、サーバー再起動
npm run dev
```

### 4.2 機能テスト
1. **ホームページ**: http://localhost:3000
2. **ユーザー登録**: サインアップ機能テスト
3. **学部ページ**: 4学部の表示確認
4. **動画ページ**: サンプル動画表示確認
5. **管理画面**: 統計データ表示確認

---

## 🎯 現在のステップ

**現在実行中**: Phase 1 - Clerkアカウント作成

次のステップでClerkの実際のキーを取得します。