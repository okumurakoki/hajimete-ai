# 🛒 Stripe商品・価格設定ガイド

## 📦 作成する商品

### 1. ベーシックプラン
- **商品名**: `ベーシックプラン`
- **説明**: `AI学習の基礎を身につける`
- **価格**: `¥1,650` / month
- **課金方式**: 定期課金（月額）

### 2. プレミアムプラン  
- **商品名**: `プレミアムプラン`
- **説明**: `全てのコンテンツにアクセス`
- **価格**: `¥5,500` / month
- **課金方式**: 定期課金（月額）

## 🛠️ Stripe Dashboardでの設定手順

### Step 1: Stripe Dashboardにアクセス
```bash
open https://dashboard.stripe.com/products
```

### Step 2: ベーシックプラン作成
1. **「Add product」**をクリック
2. **Product information**:
   - Name: `ベーシックプラン`
   - Description: `AI学習の基礎を身につける`
3. **Pricing**:
   - Price: `1650` JPY
   - Billing period: `Monthly`
   - Usage type: `Licensed`
4. **「Save product」**をクリック
5. **Price ID**をコピー（例: `price_xxxxxxxxxxxxx`）

### Step 3: プレミアムプラン作成
1. **「Add product」**をクリック
2. **Product information**:
   - Name: `プレミアムプラン`
   - Description: `全てのコンテンツにアクセス`
3. **Pricing**:
   - Price: `5500` JPY
   - Billing period: `Monthly`
   - Usage type: `Licensed`
4. **「Save product」**をクリック
5. **Price ID**をコピー（例: `price_yyyyyyyyyyyyy`）

## 📝 環境変数追加

作成後、以下を`.env.local`に追加：

```env
# Stripe価格ID（作成後に更新）
STRIPE_BASIC_PRICE_ID="price_xxxxxxxxxxxxx"
STRIPE_PREMIUM_PRICE_ID="price_yyyyyyyyyyyyy"
```

## 🔗 Webhook設定

1. **Developers** → **Webhooks** → **Add endpoint**
2. **Endpoint URL**: `http://localhost:3001/api/payments/webhook`
3. **Events to send**:
   - ✅ customer.subscription.created
   - ✅ customer.subscription.updated
   - ✅ customer.subscription.deleted
   - ✅ invoice.payment_succeeded
   - ✅ invoice.payment_failed
4. **「Add endpoint」**をクリック
5. **Signing secret**をコピー

---

**完了後**: Price IDsとWebhook Secretを教えてください！