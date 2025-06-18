# はじめて.AI - AI学習プラットフォーム

![はじめて.AI Logo](https://via.placeholder.com/400x100/3B82F6/FFFFFF?text=はじめて.AI)

日本最大級のAI学習プラットフォーム。Schoo風のデザインで、AI技術を基礎から実践まで体系的に学習できます。

## 🚀 機能概要

### 📚 学部制システム
- **AI基礎学部** - AIの基本概念と活用方法
- **業務効率化学部** - 日常業務へのAI活用
- **実践応用学部** - ビジネス現場での実践
- **キャッチアップ学部** - 最新AI技術（プレミアム限定）

### 🎬 コンテンツ
- **動画学習** - 200+本の実践的動画コンテンツ
- **ライブセミナー** - 月8回の専門家セミナー
- **リアルタイム配信** - プレミアム限定ライブ配信

### 💡 プラン
- **ベーシック** - ¥1,650/月（基礎3学部）
- **プレミアム** - ¥5,500/月（全学部+ライブ配信）

## 🛠 技術スタック

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Authentication**: Clerk
- **Database**: Supabase (予定)
- **Deployment**: Vercel
- **Icons**: Lucide React
- **Fonts**: Noto Sans JP

## 📦 セットアップ

### 1. プロジェクトのクローン
```bash
git clone <repository-url>
cd hajimete-ai
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定
```bash
cp .env.example .env.local
```

`.env.local`に以下の環境変数を設定してください：

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/plan-selection

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 開発サーバーの起動
```bash
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

## 🏗 プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # 管理画面
│   ├── dashboard/         # ダッシュボード
│   ├── videos/            # 動画ページ
│   ├── seminars/          # セミナーページ
│   └── live/              # ライブ配信
├── components/            # 再利用可能コンポーネント
├── lib/                   # ユーティリティとデータ
└── styles/               # スタイル
```

## 🎨 デザインシステム

### カラーパレット
- **AI基礎学部**: ブルー系 (#3B82F6)
- **業務効率化学部**: グリーン系 (#10B981)
- **実践応用学部**: オレンジ系 (#F97316)
- **キャッチアップ学部**: パープル系 (#8B5CF6)

### コンポーネント
- `schoo-card` - 基本カードスタイル
- `schoo-btn-primary` - プライマリボタン
- `schoo-btn-premium` - プレミアムボタン
- `dept-*` - 学部別カラーバリエーション

## 📱 レスポンシブ対応

- **Mobile**: 縦積みレイアウト
- **Tablet**: 2カラムレイアウト
- **Desktop**: 3カラムレイアウト

## 🚀 デプロイ

### Vercelへのデプロイ
1. Vercelアカウントにログイン
2. GitHubリポジトリを接続
3. 環境変数を設定
4. デプロイ実行

### 環境変数（本番用）
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_key
CLERK_SECRET_KEY=sk_live_your_secret
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 🧪 テスト

```bash
# 開発サーバーでテスト
npm run dev

# ビルドテスト
npm run build

# 本番環境でのテスト
npm run start
```

## 📄 ライセンス

© 2024 はじめて.AI. All rights reserved.

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します。

## 📞 サポート

質問やサポートが必要な場合は、GitHubのIssuesをご利用ください。

---

**はじめて.AI** - 日本最大級のAI学習プラットフォーム 🚀