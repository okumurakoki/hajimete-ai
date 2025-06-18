# 🚀 Supabase本番環境セットアップ

## 📋 事前準備
- Supabaseアカウント（GitHubアカウント推奨）
- プロジェクト名：`hajimete-ai-production`
- 地域：`Northeast Asia (Tokyo)`

## 1️⃣ Supabaseプロジェクト作成 (5分)

### Step 1: Supabaseにログイン
```bash
# ブラウザで開く
open https://supabase.com/dashboard
```

### Step 2: 新規プロジェクト作成
1. **「New Project」**をクリック
2. **Organization**: Personal (デフォルト)
3. **プロジェクト設定**:
   - **Name**: `hajimete-ai-production`
   - **Database Password**: 強力なパスワード（記録必須！）
   - **Region**: `Northeast Asia (Tokyo)`
4. **「Create new project」**をクリック（2-3分待機）

## 2️⃣ 接続情報取得 (2分)

### API Keys取得
**Settings** → **API** から以下をコピー：

```env
# .env.localに設定する値
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Database URL取得
**Settings** → **Database** から：

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

## 3️⃣ 環境変数更新

現在の`.env.local`を更新：

```bash
# 現在のSupabase設定を実際の値に置換
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY_HERE"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY_HERE"
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

## 4️⃣ データベースセットアップ (3分)

```bash
# PostgreSQLスキーマに切り替え
cp prisma/schema.postgres.prisma prisma/schema.prisma
cp prisma/seed.postgres.ts prisma/seed.ts

# データベースセットアップ
npm run db:generate
npm run db:push
npm run db:seed
```

## 5️⃣ 動作確認

```bash
# サーバー再起動
npm run dev

# 確認ポイント
# ✅ http://localhost:3000 でホームページ表示
# ✅ データベース接続エラーなし
# ✅ 4学部、4動画、2プランが表示される
```

## 🎯 完了後の状態

### データベース内容
```
📚 学部 (4件)
├── AI基礎学部 (Blue) 🤖
├── 業務効率化学部 (Green) ⚡  
├── 実践応用学部 (Orange) 🚀
└── キャッチアップ学部 (Purple) ⭐

🎬 動画 (4件)
├── ChatGPT完全入門 (45:30)
├── Excel作業をAIで10倍効率化 (60:00)
├── AI活用の実践事例集 (70:00)
└── 最新AI技術トレンド2024 (90:00) [プレミアム]

💳 プラン (2件)
├── ベーシック ¥1,650/月
└── プレミアム ¥5,500/月
```

### セキュリティ機能
- ✅ Row Level Security (RLS) 有効
- ✅ ユーザーベースアクセス制御
- ✅ プランベース閲覧制限
- ✅ 不正アクセス防止

## 🚨 トラブルシューティング

### エラー: Connection refused
```bash
# 環境変数確認
echo $DATABASE_URL
```

### エラー: Invalid API Key
```bash
# .env.local再読み込み
npm run dev
```

### エラー: Schema push failed
```bash
# Prisma再生成
npm run db:generate
npm run db:push --force-reset
```

---

**次のステップ**: Stripe決済システム設定 (10分)