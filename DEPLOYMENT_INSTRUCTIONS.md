# 🚀 はじめて.AI 本番デプロイ手順書

## ✅ 現在の状況
- **アプリケーション**: 完全にビルド成功（60ページ）
- **TypeScript**: 全エラー修正済み
- **Git**: コミット完了
- **実装**: 全機能完成

## 📋 デプロイオプション

### Option 1: Vercel（推奨）

#### 1. ブラウザでVercelダッシュボードにアクセス
https://vercel.com/dashboard

#### 2. 新しいプロジェクトを作成
1. 「Add New...」→「Project」をクリック
2. 「Import Git Repository」を選択

#### 3. GitHubとの連携
- GitHubアカウントを連携
- `hajimete-ai` リポジトリを選択
- 「Import」をクリック

#### 4. プロジェクト設定
```
Project Name: hajimete-ai
Framework: Next.js (自動検出)
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

#### 5. 環境変数設定
以下の環境変数をVercelダッシュボードで設定：

```env
# データベース
DATABASE_URL=postgresql://postgres:your_password@db.your_project.supabase.co:5432/postgres

# 認証
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# 決済
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret

# アプリ設定
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

#### 6. デプロイ実行
「Deploy」ボタンをクリック

### Option 2: Netlify

#### 1. Netlifyダッシュボード
https://app.netlify.com/

#### 2. サイト作成
1. 「New site from Git」
2. GitHubを選択
3. `hajimete-ai`リポジトリを選択

#### 3. ビルド設定
```
Build command: npm run build
Publish directory: .next
```

### Option 3: Railway

#### 1. Railwayダッシュボード
https://railway.app/dashboard

#### 2. 新しいプロジェクト
1. 「New Project」
2. 「Deploy from GitHub repo」
3. `hajimete-ai`を選択

## 🔧 デプロイ後の設定

### 1. ドメイン設定
デプロイが完了したら、取得したURLを各サービスで更新：

#### Clerk設定更新
1. Clerk Dashboard → Domains
2. Production domain に本番URLを追加

#### Stripe Webhook更新
1. Stripe Dashboard → Webhooks
2. 新しいエンドポイント作成:
   - URL: `https://your-app.vercel.app/api/stripe/webhook`
   - Events: checkout.session.completed, customer.subscription.created

### 2. 動作確認チェックリスト

#### 基本機能
- [ ] ホームページ表示
- [ ] サインアップ・ログイン
- [ ] ダッシュボード表示
- [ ] 4学部ページ表示

#### 決済機能
- [ ] プラン選択ページ
- [ ] Stripe決済フロー
- [ ] 決済完了後のリダイレクト

#### 管理機能
- [ ] 管理画面アクセス
- [ ] 動画アップロード
- [ ] セミナー作成

## 📊 本番環境仕様

### パフォーマンス
- **ページ数**: 60ページ
- **バンドルサイズ**: 100KB (共有)
- **ビルド時間**: ~2分

### セキュリティ
- HTTPS対応
- 環境変数による機密情報管理
- Clerk認証システム
- Stripe PCI準拠

### インフラ
- **フロントエンド**: Vercel Edge Network
- **データベース**: Supabase PostgreSQL
- **認証**: Clerk
- **決済**: Stripe
- **動画**: Vimeo

## 🆘 トラブルシューティング

### ビルドエラー
```bash
# ローカルでビルド確認
npm run build

# TypeScriptエラーチェック
npm run lint
```

### 環境変数エラー
1. Vercelダッシュボードで環境変数を確認
2. `.env.production`ファイルと照合
3. 再デプロイ実行

### 接続エラー
1.外部サービス（Clerk、Stripe）の設定確認
2. CORS設定確認
3. ネットワークログ確認

## 📞 サポート

問題が発生した場合：
1. ビルドログを確認
2. 環境変数の設定を再確認
3. 外部サービスの接続状況を確認

---

## 🎯 次のステップ

デプロイ完了後：
1. ✅ 本番URL取得
2. ✅ 外部サービス設定更新
3. ✅ 動作確認実施
4. ✅ ユーザーテスト開始

**現在のリポジトリ**: https://github.com/okumurakoki/hajimete-ai.git

全ての準備が完了しており、いつでもデプロイ可能な状態です！