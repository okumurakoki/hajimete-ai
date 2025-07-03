# Vercel カスタムドメイン設定完全ガイド: app.oku-ai.co.jp

このガイドでは、Vercelで `app.oku-ai.co.jp` ドメインを `hajimete-ai` プロジェクトに設定する手順を詳しく説明します。

## 📋 目次

1. [現在のドメイン割り当て状況の確認](#1-現在のドメイン割り当て状況の確認)
2. [既存プロジェクトからドメインを削除](#2-既存プロジェクトからドメインを削除)
3. [hajimete-aiプロジェクトにドメインを追加](#3-hajimete-aiプロジェクトにドメインを追加)
4. [DNS設定の確認と更新](#4-dns設定の確認と更新)
5. [SSL証明書の確認](#5-ssl証明書の確認)
6. [トラブルシューティング](#6-トラブルシューティング)

---

## 1. 現在のドメイン割り当て状況の確認

### 方法1: Vercelダッシュボードで確認

#### Step 1: Vercelにログイン
```
https://vercel.com/login
```

**スクリーンショット説明:**
- Vercelのログイン画面が表示される
- GitHubアカウントでログインするか、メールアドレスでログイン

#### Step 2: グローバル検索でドメインを探す

**スクリーンショット説明:**
- ダッシュボード上部に検索バーがある
- 検索バーに `app.oku-ai.co.jp` と入力
- 検索結果にドメインが現在割り当てられているプロジェクトが表示される

#### Step 3: すべてのプロジェクトを確認

**スクリーンショット説明:**
- ダッシュボードのトップページには、すべてのプロジェクトがカード形式で表示される
- 各プロジェクトカードには：
  - プロジェクト名
  - 最新のデプロイメント情報
  - ドメイン（設定されている場合）
- 各プロジェクトをクリックして詳細を確認

### 方法2: CLIで確認

```bash
# Vercel CLIをインストール（未インストールの場合）
npm i -g vercel

# ログイン
vercel login

# すべてのプロジェクトをリスト表示
vercel projects list

# 特定のドメインがどこに割り当てられているか確認
vercel domains list
```

**出力例:**
```
Domain                Status    Age    Project
app.oku-ai.co.jp     Valid     30d    old-project-name
```

---

## 2. 既存プロジェクトからドメインを削除

### Step 1: 該当プロジェクトを開く

**スクリーンショット説明:**
- ダッシュボードから、現在 `app.oku-ai.co.jp` が割り当てられているプロジェクトをクリック
- プロジェクトの概要ページが開く

### Step 2: Settings タブに移動

**スクリーンショット説明:**
- プロジェクトページ上部のナビゲーションバーに以下のタブがある：
  - Overview
  - Analytics
  - Speed Insights
  - **Settings** ← これをクリック

### Step 3: Domains セクションを選択

**スクリーンショット説明:**
- 左サイドバーに設定メニューが表示される
- メニュー項目：
  - General
  - **Domains** ← これをクリック
  - Git
  - Functions
  - Environment Variables
  - など

### Step 4: ドメインを削除

**スクリーンショット説明:**
- Domainsページに現在設定されているドメインのリストが表示される
- `app.oku-ai.co.jp` の行を見つける
- 各ドメインの右側に3点メニュー（...）がある
- 3点メニューをクリックして「Remove」を選択
- 確認ダイアログが表示される：
  - "Are you sure you want to remove app.oku-ai.co.jp?"
  - 「Remove」ボタンをクリックして確定

### CLIでの削除方法

```bash
# プロジェクトを指定してドメインを削除
vercel domains rm app.oku-ai.co.jp --yes
```

---

## 3. hajimete-aiプロジェクトにドメインを追加

### Step 1: hajimete-aiプロジェクトを開く

**スクリーンショット説明:**
- Vercelダッシュボードに戻る
- `hajimete-ai` プロジェクトカードをクリック

### Step 2: Settings → Domains に移動

**スクリーンショット説明:**
- プロジェクトページ上部の「Settings」タブをクリック
- 左サイドバーから「Domains」を選択

### Step 3: 新しいドメインを追加

**スクリーンショット説明:**
- Domainsページの上部に入力フィールドがある
- プレースホルダーテキスト: "example.com or buy a new domain"
- 入力フィールドに `app.oku-ai.co.jp` と入力
- 「Add」ボタンをクリック

### Step 4: ドメイン設定の選択

**スクリーンショット説明:**
- ドメイン追加後、設定オプションが表示される：
  - **Recommended**: Redirect to www (推奨されるが、サブドメインには不要)
  - **Selected**: This domain only
- 「This domain only」を選択

### Step 5: DNS設定の指示

**スクリーンショット説明:**
- Vercelが必要なDNS設定を表示：
  ```
  Type: CNAME
  Name: app
  Value: cname.vercel-dns.com
  ```
- この情報をメモまたはコピーする

### CLIでの追加方法

```bash
# プロジェクトディレクトリに移動
cd /path/to/hajimete-ai

# ドメインを追加
vercel domains add app.oku-ai.co.jp
```

---

## 4. DNS設定の確認と更新

### ドメインレジストラでの設定

#### お名前.com の場合

**スクリーンショット説明:**
1. お名前.comにログイン
2. 「ドメイン」→「ドメイン機能一覧」
3. 該当ドメイン `oku-ai.co.jp` の「DNS」をクリック
4. 「DNSレコード設定を利用する」を選択
5. 以下を入力：
   - ホスト名: `app`
   - TYPE: `CNAME`
   - VALUE: `cname.vercel-dns.com`
   - TTL: `3600`
6. 「確認画面へ進む」→「設定する」

#### Cloudflare の場合

**スクリーンショット説明:**
1. Cloudflareダッシュボードにログイン
2. `oku-ai.co.jp` ドメインを選択
3. 「DNS」タブをクリック
4. 「Add record」ボタンをクリック
5. 以下を設定：
   - Type: `CNAME`
   - Name: `app`
   - Target: `cname.vercel-dns.com`
   - Proxy status: **DNS only** (グレーのクラウドアイコン)
   - TTL: `Auto`
6. 「Save」をクリック

### DNS設定の確認

```bash
# DNS設定が正しく反映されているか確認
nslookup app.oku-ai.co.jp

# または
dig app.oku-ai.co.jp
```

---

## 5. SSL証明書の確認

### Vercelでの確認方法

**スクリーンショット説明:**
1. hajimete-aiプロジェクトのDomainsページに戻る
2. `app.oku-ai.co.jp` の行を確認
3. ステータス列に以下が表示される：
   - **Initializing**: DNS設定待ち（黄色）
   - **Valid**: 正常に設定完了（緑色）
   - **Error**: エラーが発生（赤色）

### SSL証明書の詳細確認

**スクリーンショット説明:**
- ドメイン名の右側にある「View Certificate」リンクをクリック
- 証明書の詳細情報が表示される：
  - 発行者: Let's Encrypt
  - 有効期限
  - 暗号化の種類

---

## 6. トラブルシューティング

### よくある問題と解決方法

#### 問題1: "Domain already assigned to another project"

**解決方法:**
1. 上記の手順2を参照して、既存プロジェクトから削除
2. または、CLIで強制的に移動：
   ```bash
   vercel domains rm app.oku-ai.co.jp --yes
   vercel domains add app.oku-ai.co.jp
   ```

#### 問題2: DNS設定が反映されない

**スクリーンショット説明:**
- Vercelのドメイン設定ページに警告メッセージが表示される
- "Invalid Configuration" または "Awaiting DNS propagation"

**解決方法:**
1. DNS設定を再確認（CNAMEレコードが正しいか）
2. DNS伝播を待つ（最大48時間）
3. DNSチェッカーで確認：
   ```
   https://dnschecker.org/
   ```
   - サイトで `app.oku-ai.co.jp` を入力
   - 世界各地のDNSサーバーでの解決状況を確認

#### 問題3: SSL証明書エラー

**スクリーンショット説明:**
- ブラウザで「この接続ではプライバシーが保護されません」エラー

**解決方法:**
1. Vercelダッシュボードで証明書のステータスを確認
2. 「Refresh」ボタンをクリックして再発行を試みる
3. DNS設定が正しいことを確認
4. 15分〜1時間待つ（証明書の自動発行に時間がかかる）

### デバッグコマンド

```bash
# DNS設定の確認
dig +short app.oku-ai.co.jp

# SSL証明書の確認
echo | openssl s_client -servername app.oku-ai.co.jp -connect app.oku-ai.co.jp:443 2>/dev/null | openssl x509 -noout -dates

# Vercelのドメイン状態確認
vercel domains inspect app.oku-ai.co.jp
```

---

## ✅ 設定完了チェックリスト

- [ ] 既存プロジェクトから `app.oku-ai.co.jp` を削除完了
- [ ] `hajimete-ai` プロジェクトにドメインを追加完了
- [ ] DNS設定（CNAMEレコード）を更新完了
- [ ] Vercelでドメインステータスが「Valid」になった
- [ ] `https://app.oku-ai.co.jp` でアクセス可能
- [ ] SSL証明書が有効（ブラウザで緑の鍵アイコン）
- [ ] サイトが正常に表示される

---

## 📞 サポート情報

### Vercel公式ドキュメント
- [カスタムドメイン設定ガイド](https://vercel.com/docs/concepts/projects/domains)
- [DNS設定トラブルシューティング](https://vercel.com/docs/concepts/projects/domains/troubleshooting)

### 追加リソース
- [Vercel Status](https://www.vercel-status.com/) - サービス状態確認
- [Vercel Support](https://vercel.com/support) - サポートチケット作成

---

最終更新日: 2025-07-03