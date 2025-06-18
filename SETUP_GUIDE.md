# 🚀 はじめて.AI セットアップガイド

## Phase 1: Supabaseデータベース設定

### 📋 必要な手順

#### 1. Supabaseプロジェクト作成
1. [Supabase Dashboard](https://supabase.com/dashboard) にアクセス
2. 「New Project」をクリック
3. プロジェクト設定:
   - **Name**: `hajimete-ai`
   - **Database Password**: 強力なパスワードを設定（保存必須）
   - **Region**: `Northeast Asia (Tokyo)` または `Southeast Asia (Singapore)`
4. 「Create new project」をクリック

#### 2. 接続情報取得
プロジェクト作成後、以下の情報を取得：

1. **Project Settings** → **API** から:
   - `Project URL` (例: `https://abcdefg.supabase.co`)
   - `anon public` key
   - `service_role` key

2. **Project Settings** → **Database** から:
   - `Connection string` (例: `postgresql://postgres:[PASSWORD]@db.abcdefg.supabase.co:5432/postgres`)

### 📝 環境変数設定

`.env.local` ファイルを作成し、以下を設定してください：

```env
# データベース接続
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# Supabase設定
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR_SERVICE_ROLE_KEY]"

# Clerk認証（後で設定）
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/plan-selection"

# アプリケーション設定
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 🛠 データベース初期化

環境変数設定後、以下のコマンドを実行：

```bash
# Prismaクライアント生成
npm run db:generate

# データベーススキーマをプッシュ
npm run db:push

# 初期データを投入
npm run db:seed

# Prisma Studioでデータ確認（オプション）
npm run db:studio
```

### ✅ 確認事項

1. **データベース接続成功**: エラーなくスキーマがプッシュされる
2. **初期データ投入成功**: シードコマンドが正常完了
3. **テーブル作成確認**: Supabase Dashboard > Table Editor で20+テーブルが作成されている

---

## 🔄 現在の作業

`.env.local` ファイルの設定をお手伝いします。