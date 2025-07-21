# はじめて.AI 統合ガイド

## 🔧 現在必要な修正事項

### 1. ✅ 価格設定の修正
- ベーシックプラン: ¥1,650/月に修正済み
- プレミアムプラン: ¥5,500/月（変更なし）

### 2. 📧 管理画面のエラー修正
APIルートは正常に実装されていますが、フロントエンドで以下の確認が必要：
- `/admin/emails` - メール送信機能の動作確認
- `/admin/error-logs` - エラーログ表示の動作確認

### 3. 💳 Stripe決済連携の完全実装

#### 必要な環境変数（.env.local）
```env
# Stripe本番環境の設定
STRIPE_SECRET_KEY=sk_live_xxx  # Stripeダッシュボードから取得
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx  # Stripeダッシュボードから取得
STRIPE_WEBHOOK_SECRET=whsec_xxx  # Webhookエンドポイント作成後に取得
```

#### Stripeダッシュボードでの設定
1. **商品・価格の作成**
   - ベーシックプラン: ¥1,650/月
   - プレミアムプラン: ¥5,500/月
   - セミナー価格: ¥5,500（通常）、¥4,400（プレミアム会員割引）

2. **Webhookエンドポイントの設定**
   - URL: `https://app.oku-ai.co.jp/api/webhooks/stripe`
   - イベント:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `payment_intent.succeeded`

3. **Price IDの更新**
   ```typescript
   // src/lib/stripe-pricing.ts を更新
   BASIC_PLAN: 'price_xxx',  // Stripeで作成したPrice ID
   PREMIUM_PLAN: 'price_xxx',
   SEMINAR_BASIC: 'price_xxx',
   SEMINAR_PREMIUM: 'price_xxx'
   ```

### 4. 🎥 Zoom連携の実装

#### Zoom APIの設定手順
1. **Zoom Marketplaceでアプリ作成**
   - https://marketplace.zoom.us/
   - Server-to-Server OAuthアプリを作成

2. **必要な環境変数**
   ```env
   # Zoom API設定
   ZOOM_ACCOUNT_ID=xxx
   ZOOM_CLIENT_ID=xxx
   ZOOM_CLIENT_SECRET=xxx
   ```

3. **APIスコープの設定**
   - `meeting:write:admin`
   - `meeting:read:admin`
   - `user:read:admin`

4. **実装コード**
   ```typescript
   // src/lib/zoom-api.ts
   import axios from 'axios'

   class ZoomAPI {
     private accessToken: string | null = null
     private tokenExpiry: number = 0

     async getAccessToken() {
       if (this.accessToken && Date.now() < this.tokenExpiry) {
         return this.accessToken
       }

       const response = await axios.post(
         'https://zoom.us/oauth/token',
         null,
         {
           params: {
             grant_type: 'account_credentials',
             account_id: process.env.ZOOM_ACCOUNT_ID
           },
           auth: {
             username: process.env.ZOOM_CLIENT_ID!,
             password: process.env.ZOOM_CLIENT_SECRET!
           }
         }
       )

       this.accessToken = response.data.access_token
       this.tokenExpiry = Date.now() + (response.data.expires_in * 1000)
       return this.accessToken
     }

     async createMeeting(topic: string, startTime: Date, duration: number) {
       const token = await this.getAccessToken()

       const response = await axios.post(
         'https://api.zoom.us/v2/users/me/meetings',
         {
           topic,
           type: 2, // Scheduled meeting
           start_time: startTime.toISOString(),
           duration,
           timezone: 'Asia/Tokyo',
           settings: {
             host_video: true,
             participant_video: true,
             join_before_host: false,
             mute_upon_entry: true,
             waiting_room: true,
             recording_type: 'cloud'
           }
         },
         {
           headers: {
             Authorization: `Bearer ${token}`,
             'Content-Type': 'application/json'
           }
         }
       )

       return {
         id: response.data.id,
         join_url: response.data.join_url,
         start_url: response.data.start_url,
         password: response.data.password
       }
     }
   }

   export const zoomAPI = new ZoomAPI()
   ```

### 5. 🎯 セミナー作成時の自動化フロー

#### 管理画面でセミナー作成時の処理
```typescript
// src/app/api/admin/seminars/route.ts に追加

// セミナー作成時
const seminar = await prisma.seminar.create({
  data: seminarData
})

// 1. Zoom会議を自動作成
const zoomMeeting = await zoomAPI.createMeeting(
  seminar.title,
  new Date(seminar.startDate),
  90 // 90分
)

// 2. Zoom情報をセミナーに保存
await prisma.seminar.update({
  where: { id: seminar.id },
  data: {
    zoomId: zoomMeeting.id.toString(),
    zoomUrl: zoomMeeting.join_url,
    zoomPassword: zoomMeeting.password
  }
})

// 3. Stripe支払いリンクを作成
const paymentLink = await stripe.paymentLinks.create({
  line_items: [{
    price: STRIPE_PRICE_IDS.SEMINAR_BASIC,
    quantity: 1
  }],
  after_completion: {
    type: 'redirect',
    redirect: {
      url: `https://app.oku-ai.co.jp/seminars/${seminar.id}/thanks`
    }
  },
  metadata: {
    seminarId: seminar.id
  }
})

// 4. 支払いリンクを保存
await prisma.seminar.update({
  where: { id: seminar.id },
  data: {
    stripePaymentLink: paymentLink.url
  }
})
```

### 6. 🎫 サンクスページの自動生成

#### 動的サンクスページの実装
```typescript
// src/app/seminars/[id]/thanks/page.tsx
'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Calendar, Video, Lock } from 'lucide-react'

export default function SeminarThanksPage() {
  const params = useParams()
  const [seminar, setSeminar] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSeminarDetails()
  }, [])

  const fetchSeminarDetails = async () => {
    try {
      const response = await fetch(`/api/seminars/${params.id}`)
      const data = await response.json()
      setSeminar(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>読み込み中...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              お申し込みありがとうございます！
            </h1>
            <p className="text-gray-600">
              セミナーの参加登録が完了しました
            </p>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {seminar?.title}
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">開催日時</p>
                  <p className="text-gray-600">
                    {new Date(seminar?.startDate).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Video className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Zoom情報</p>
                  <p className="text-gray-600">
                    開始15分前にメールでお送りします
                  </p>
                  {seminar?.zoomUrl && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-900 font-medium mb-1">
                        Zoom URL
                      </p>
                      <a 
                        href={seminar.zoomUrl}
                        className="text-blue-600 hover:underline break-all"
                      >
                        {seminar.zoomUrl}
                      </a>
                      {seminar.zoomPassword && (
                        <p className="text-sm text-gray-600 mt-2">
                          パスワード: {seminar.zoomPassword}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <Lock className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">アクセス権限</p>
                  <p className="text-gray-600">
                    このページは参加者のみアクセス可能です
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-900">
                <strong>重要:</strong> このページをブックマークして、当日すぐにアクセスできるようにしておいてください。
              </p>
            </div>

            <div className="mt-8 text-center">
              <a
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                ダッシュボードに戻る
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 7. 🔐 アクセス制限の実装

```typescript
// src/middleware.ts に追加
if (req.nextUrl.pathname.startsWith('/seminars/') && 
    req.nextUrl.pathname.endsWith('/thanks')) {
  // Stripeの支払い確認
  const seminarId = req.nextUrl.pathname.split('/')[2]
  
  // セッションまたはクエリパラメータで支払い確認
  const paymentVerified = await verifyPayment(seminarId, userId)
  
  if (!paymentVerified) {
    return NextResponse.redirect(new URL('/seminars', req.url))
  }
}
```

## 📋 実装チェックリスト

- [ ] Stripe本番環境の環境変数設定
- [ ] Stripeダッシュボードで商品・価格作成
- [ ] Stripe Webhook設定
- [ ] Zoom API認証情報取得
- [ ] Zoom環境変数設定
- [ ] セミナー作成時の自動化テスト
- [ ] サンクスページのアクセス制限テスト
- [ ] メール通知機能のテスト

## 🚀 デプロイ手順

1. 環境変数をVercelに設定
2. `npm run build` でビルド確認
3. `git add . && git commit -m "feat: Complete payment and zoom integration"`
4. `npx vercel --prod` でデプロイ

## 📞 サポート

実装で不明な点があれば、以下の情報を確認してください：
- Stripe: https://stripe.com/docs/api
- Zoom API: https://marketplace.zoom.us/docs/api-reference/introduction
- Vercel: https://vercel.com/docs