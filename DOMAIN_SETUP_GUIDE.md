# カスタムドメイン設定ガイド: app.oku-ai.co.jp

## 📋 設定手順

### Step 1: Vercelダッシュボードでドメイン追加

1. **Vercelダッシュボードにアクセス**
   ```
   https://vercel.com/dashboard
   ```

2. **プロジェクトを選択**
   - プロジェクト `hajimete-ai` をクリック

3. **Settings タブを開く**
   - プロジェクト画面上部の「Settings」をクリック

4. **Domains セクションに移動**
   - 左サイドバーから「Domains」を選択

5. **新しいドメインを追加**
   ```
   Domain: app.oku-ai.co.jp
   ```
   - 「Add」ボタンをクリック

### Step 2: 既存ドメイン割り当ての解除（必要な場合）

もし `app.oku-ai.co.jp` が他のプロジェクトに割り当てられている場合：

1. **既存プロジェクトを確認**
   - Vercelダッシュボードで他のプロジェクトをチェック
   
2. **古い割り当てを削除**
   - 該当プロジェクトのDomains設定で `app.oku-ai.co.jp` を削除

### Step 3: DNS設定

#### A. お名前.comやムームードメインなどのDNS管理画面

1. **CNAMEレコードを追加**
   ```
   種別: CNAME
   ホスト名: app
   値: cname.vercel-dns.com
   TTL: 3600 (デフォルト)
   ```

2. **既存のAレコード削除**
   - `app.oku-ai.co.jp` の古いAレコードがあれば削除

#### B. Cloudflareを使用している場合

1. **Cloudflare DNS管理画面**
   ```
   Type: CNAME
   Name: app
   Target: cname.vercel-dns.com
   Proxy status: DNS only (グレークラウド)
   TTL: Auto
   ```

### Step 4: SSL証明書の確認

Vercelが自動的にSSL証明書を発行します：
- 設定後15分〜1時間で証明書が発行される
- ステータスが「Valid」になるまで待機

### Step 5: 動作確認

1. **DNS伝播確認**
   ```bash
   nslookup app.oku-ai.co.jp
   ```

2. **ブラウザでアクセス**
   ```
   https://app.oku-ai.co.jp
   ```

## 🔧 CLI経由での設定方法

### 既存ドメイン割り当て確認
```bash
npx vercel domains list
```

### 他プロジェクトからドメイン削除
```bash
npx vercel domains rm app.oku-ai.co.jp --yes
```

### 現在のプロジェクトにドメイン追加
```bash
npx vercel domains add app.oku-ai.co.jp
```

## ❌ トラブルシューティング

### エラー: Domain already assigned
```bash
# 他のプロジェクトの割り当てを確認
npx vercel projects list

# 該当プロジェクトからドメインを削除
npx vercel domains rm app.oku-ai.co.jp --yes

# 再度追加
npx vercel domains add app.oku-ai.co.jp
```

### DNS設定が反映されない
1. **TTL待機**: DNS変更は最大24時間かかる場合がある
2. **キャッシュクリア**: ブラウザのDNSキャッシュをクリア
3. **DNS確認ツール**: https://dnschecker.org/ で確認

### SSL証明書エラー
1. **DNS正常確認**: まずDNS設定が正しいか確認
2. **Vercel再試行**: Vercelダッシュボードで「Refresh」をクリック
3. **時間待機**: 証明書発行には時間がかかる

## 📝 設定完了後の確認項目

- [ ] https://app.oku-ai.co.jp でアクセス可能
- [ ] SSL証明書が有効（緑の鍵アイコン）
- [ ] テーマ機能が正常動作
- [ ] レスポンシブデザインが正常表示
- [ ] ダークモード切り替えが機能

## 🌐 最終的なURL

設定完了後のアクセスURL:
```
https://app.oku-ai.co.jp
```

## 📞 サポート

設定で問題が発生した場合:
1. Vercelのドキュメント: https://vercel.com/docs/concepts/projects/domains
2. DNS設定ガイド: https://vercel.com/docs/concepts/projects/domains/add-a-domain