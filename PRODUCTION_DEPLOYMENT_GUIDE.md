# 🚀 本番環境デプロイガイド - はじめて.AI

## ⚡ 即座実行チェックリスト

### 1. 環境変数設定 (5分)

**Vercel Dashboard で設定:**

```bash
# Stripe 本番環境
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxx  
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx

# Clerk 本番環境
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx

# アプリケーション
NEXT_PUBLIC_APP_URL=https://hajimete-ai.com
NODE_ENV=production

# オプション (必要に応じて)
GOOGLE_SITE_VERIFICATION=xxxxxxxxxxxxxxxx
DATABASE_URL=your_production_database_url
```

### 2. Stripe設定確認 (5分)

**Stripe Dashboard:**
1. **本番モード**に切り替え
2. **Webhook endpoint**追加:
   - URL: `https://hajimete-ai.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
3. **Price IDs**確認:
   - ベーシックプラン: `price_1RbFUBKnrmty0hAG5K00xgNx`
   - プレミアムプラン: `price_1RbFUaKnrmty0hAGgzQK1HB1`
   - セミナー(5500円): `price_1RbRhMKnrmty0hAGcXEO2sLv`
   - セミナー(4400円): `price_1RbRi3Knrmty0hAGYwjy3SsC`

### 3. Vercel デプロイ (10分)

```bash
# 1. Git push
git add .
git commit -m "🚀 Production ready deployment"
git push origin main

# 2. Vercel CLI (optional)
npx vercel --prod

# 3. Domain設定
# Vercel Dashboard > Domains > Add hajimete-ai.com
```

### 4. DNS設定 (30分-24時間)

**ドメインプロバイダー設定:**
```
Type: CNAME
Name: hajimete-ai.com  
Value: cname.vercel-dns.com
```

## 🔍 デプロイ後確認項目

### ✅ 機能テスト (20分)

1. **認証フロー**
   - [ ] サインアップ → メール認証
   - [ ] ログイン → ダッシュボード表示
   - [ ] ログアウト → ホーム画面戻り

2. **決済フロー**
   - [ ] セミナー詳細 → 決済ボタン
   - [ ] Stripe決済画面 → テストカード入力
   - [ ] 決済完了 → 成功ページ表示
   - [ ] Webhook受信 → 登録完了

3. **コンテンツアクセス**
   - [ ] フリーコンテンツ閲覧
   - [ ] プレミアム制限確認
   - [ ] 学部ページナビゲーション

4. **モバイル確認**
   - [ ] iPhone Safari
   - [ ] Android Chrome
   - [ ] iPad Portrait/Landscape

### ✅ パフォーマンス確認 (10分)

**Google PageSpeed Insights:**
- [ ] Desktop Score > 90
- [ ] Mobile Score > 85
- [ ] Core Web Vitals all green

**GTmetrix/Lighthouse:**
- [ ] Performance > 90
- [ ] Accessibility > 95
- [ ] Best Practices > 95
- [ ] SEO > 95

### ✅ SEO確認 (5分)

**Google Search Console:**
- [ ] Sitemap登録
- [ ] URL検査 → インデックス可能

**SNSシェア確認:**
- [ ] Facebook Debugger
- [ ] Twitter Card Validator
- [ ] LinkedIn Post Inspector

## 🚨 問題発生時の対処

### 🔴 決済エラー
```bash
# Webhook確認
curl -X POST https://hajimete-ai.com/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: test"

# ログ確認
vercel logs --app=hajimete-ai
```

### 🔴 認証エラー
- Clerk Dashboard → Authentication providers確認
- Domain設定がhajimete-ai.comになっているか確認
- Callback URLs設定確認

### 🔴 パフォーマンス問題
```bash
# バンドルサイズ確認
npm run build
npm run start

# 画像最適化確認
# /public/images/ → WebP変換推奨
```

## 📊 監視・分析設定

### 1. Vercel Analytics (自動)
- Real User Monitoring
- Web Vitals tracking
- Geographic insights

### 2. Google Analytics 4 (推奨)
```html
<!-- pages/_document.tsx に追加 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

### 3. Sentry エラー監視 (推奨)
```bash
npm install @sentry/nextjs
# sentry.client.config.js 設定
```

## 🎯 ローンチ後24時間チェック

### Hour 1: 緊急監視
- [ ] 全ページ正常表示
- [ ] 決済フロー動作
- [ ] エラーレート < 1%

### Hour 6: パフォーマンス確認
- [ ] Core Web Vitals緑色維持
- [ ] サーバーレスポンス < 500ms
- [ ] CDN cache hit率 > 90%

### Hour 24: 総合評価
- [ ] ユーザー登録数確認
- [ ] コンバージョン率計測
- [ ] サポート問い合わせ対応

## 🚀 最終ローンチコマンド

```bash
# 全環境変数確認
echo "✅ Stripe Keys: $STRIPE_SECRET_KEY"
echo "✅ Clerk Keys: $CLERK_SECRET_KEY" 
echo "✅ App URL: $NEXT_PUBLIC_APP_URL"

# 本番ビルド確認
npm run build
npm run start

# ドメイン確認
curl -I https://hajimete-ai.com

# SSL確認
openssl s_client -connect hajimete-ai.com:443
```

---

**🎉 これで はじめて.AI は本番ローンチ準備完了です！**

**次のステップ:**
1. ✅ 環境変数設定
2. ✅ Vercel デプロイ  
3. ✅ DNS設定
4. ✅ 機能テスト
5. 🚀 **ローンチ！**

*緊急連絡先: support@hajimete-ai.com*