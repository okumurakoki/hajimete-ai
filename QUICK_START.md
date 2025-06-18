# ⚡ はじめて.AI クイックスタート

## 🚀 今すぐ始める3ステップ

### Step 1: Supabaseプロジェクト作成 (5分)

1. **Supabaseアカウント作成**
   - [Supabase Dashboard](https://supabase.com/dashboard) にアクセス
   - GitHubアカウントでサインアップ

2. **新しいプロジェクト作成**
   - 「New Project」をクリック
   - **Name**: `hajimete-ai`
   - **Database Password**: 強力なパスワードを設定（記録必須！）
   - **Region**: `Northeast Asia (Tokyo)`
   - 「Create new project」をクリック

3. **接続情報を取得**
   - プロジェクト作成完了まで1-2分待機
   - **Settings** → **API** から以下をコピー:
     - Project URL (例: `https://abcd1234.supabase.co`)
     - anon public key
     - service_role key
   - **Settings** → **Database** から:
     - Connection string をコピー

### Step 2: 環境変数設定 (2分)

`.env.local` ファイルの以下の部分を更新：

```env
# これらの値をSupabaseから取得した値に置き換え
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY_HERE"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY_HERE"
```

### Step 3: データベース初期化 (3分)

```bash
# 1. Prismaクライアント生成
npm run db:generate

# 2. データベーススキーマをプッシュ
npm run db:push

# 3. 初期データを投入
npm run db:seed

# 4. 開発サーバー起動
npm run dev
```

## ✅ 動作確認

ブラウザで http://localhost:3000 にアクセスして以下を確認：

1. **ホームページ表示**: Schoo風デザインが表示される
2. **学部ページ**: 4つの学部（AI基礎、業務効率化、実践応用、キャッチアップ）
3. **動画ページ**: サンプル動画が表示される
4. **セミナーページ**: サンプルセミナーが表示される

## 🔧 トラブルシューティング

### データベース接続エラー
```
Error: P1001: Can't reach database server
```
**解決法**: `.env.local` の `DATABASE_URL` を確認。パスワードと PROJECT_REF が正しいか確認。

### Prismaエラー
```
Environment variable not found: DATABASE_URL
```
**解決法**: `.env.local` ファイルが正しい場所に配置されているか確認。

### ポート使用中エラー
```
Error: listen EADDRINUSE :::3000
```
**解決法**: 
```bash
# ポート3000を使用しているプロセスを終了
lsof -ti :3000 | xargs kill -9
npm run dev
```

## 📊 次のステップ

データベースが正常に動作したら：

1. **Clerkアカウント作成** - 認証システム設定
2. **Stripeアカウント作成** - 決済システム設定  
3. **本番デプロイ準備** - Vercelへのデプロイ

---

## 🎯 現在のステータス

- ✅ フロントエンド完成 (Schoo風デザイン)
- ✅ バックエンドAPI完成 (20+エンドポイント)
- ✅ データベース設計完成 (20+テーブル)
- 🔄 **現在**: データベース接続中
- ⏳ 認証システム設定
- ⏳ 決済システム設定
- ⏳ 本番デプロイ

**あと一歩でサービス開始です！** 🚀