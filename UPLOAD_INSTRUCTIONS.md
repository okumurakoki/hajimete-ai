# ロリポップアップロード詳細手順

## アップロードするファイル

**重要**: `hajimete-ai/out` フォルダの中身（43ページ分の静的サイト）をアップロードします

### アップロード対象
- `/Users/kohki_okumura/claude-test/hajimete-ai/hajimete-ai/out/` の全ファイル
  - index.html（メインページ）
  - _next/ フォルダ（JavaScriptとCSS）
  - admin/, dashboard/, videos/ 等の各ページフォルダ
  - favicon.ico

## 手順1: ロリポップ管理画面でアップロード

1. **ログイン**
   - https://user.lolipop.jp/ にアクセス
   - アカウント: `4086804d0f25c2e2`
   - パスワード: `Kohki040108`

2. **ファイルマネージャーを開く**
   - 左側メニュー「サーバーの管理・設定」
   - 「ロリポップ！FTP」をクリック

3. **ドメインフォルダに移動**
   - `app-oku-ai.co.jp` フォルダをクリックして開く

4. **ファイルをアップロード**
   - 「ファイルのアップロード」ボタンをクリック
   - `out` フォルダ内の**全ファイル**を選択
   - アップロード実行

## 手順2: FTPクライアント（FileZilla等）

1. **接続情報**
   - ホスト: `ftp.4086804d0f25c2e2.main.jp`
   - ユーザー名: `4086804d0f25c2e2`
   - パスワード: `Kohki040108`
   - ポート: 21

2. **アップロード**
   - 左側: ローカルの `out` フォルダを開く
   - 右側: `app-oku-ai.co.jp` フォルダに移動
   - `out` フォルダの中身を全選択してドラッグ＆ドロップ

## 確認

アップロード完了後: https://app-oku-ai.co.jp にアクセス

## 注意点

- `out` フォルダ自体ではなく、**中身**をアップロード
- 全43ページ分のファイルが必要
- `_next` フォルダも必須（CSS/JavaScript含む）