export default function TestSimplePage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2563eb' }}>🎉 はじめて.AI - テストページ</h1>
      <p>アプリケーションが正常に動作しています！</p>
      <ul>
        <li>✅ Next.js 15.2.3 起動完了</li>
        <li>✅ TypeScript コンパイル成功</li>
        <li>✅ 基本レンダリング正常</li>
      </ul>
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '8px' }}>
        <strong>ステータス:</strong> 開発環境で正常に動作中 🚀
      </div>
    </div>
  )
}