export default function DebugPage() {
  return (
    <html>
      <body>
        <h1>基本テスト</h1>
        <p>このページが表示されれば、基本的な設定は正常です</p>
        <p>現在時刻: {new Date().toLocaleString('ja-JP')}</p>
      </body>
    </html>
  )
}