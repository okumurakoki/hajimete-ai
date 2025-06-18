# 🔧 Vercel 環境変数 完全設定

## 🚨 不足している環境変数

### Vercel Dashboard → Settings → Environment Variables で追加：

```env
# Clerk認証設定
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cGxlYXNlZC1zaGluZXItODQuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_36rJXKDraAyZUThOpf2xpO23dvgd0MDCfmYVOeax7B
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/plan-selection

# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://klqwcvarjenasafjjbqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtscXdjdmFyamVuYXNhZmpqYnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMjY3MDgsImV4cCI6MjA2NTgwMjcwOH0.BSP8vjS9gQbaazMlV0qv0T3Akqf_L9ibjGM5P_oGEjs
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtscXdjdmFyamVuYXNhZmpqYnF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDIyNjcwOCwiZXhwIjoyMDY1ODAyNzA4fQ.I9lK6CujJHMuka7FyWnCAqjLBzNiFOl7c1d2o7rtLyc

# Stripe設定
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51L03uYKnrmty0hAG314ZwUjcFSO6csQQPfzoHEt0vSoqSF3eGvwcM3w4Sk3pIgwueWGXXb70SRb98fGAoEDUjsMJ00kTbyJ0Jv
STRIPE_SECRET_KEY=sk_test_51L03uYKnrmty0hAGYyy5hMYPR3x9mJr0E5FzPkPbVa8FgPHPk9TpwYeI0LopKJfMUmtMnmudH53gmYtmjEvoRBrl00tdIYItV9
STRIPE_BASIC_PRICE_ID=price_1RbFUBKnrmty0hAG5K00xgNx
STRIPE_PREMIUM_PRICE_ID=price_1RbFUaKnrmty0hAGgzQK1HB1

# アプリケーション設定
NEXT_PUBLIC_APP_URL=https://hajimete-ai-production.vercel.app

# セキュリティ
ENCRYPTION_KEY=hajimete-ai-encryption-key-change-in-production
```

## 🔄 追加後の手順
1. **「Save」**をクリック
2. **「Redeploy」**を実行
3. **機能再テスト**

現在は最低限の環境変数しか設定されていません。