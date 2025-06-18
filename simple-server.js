const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>はじめて.AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <div class="container mx-auto px-4 py-16">
        <div class="text-center">
            <h1 class="text-5xl font-bold text-gray-900 mb-6">
                はじめて<span class="text-blue-600">.AI</span>
            </h1>
            <p class="text-xl text-gray-600 mb-8">AI学習の第一歩を始めよう</p>
            <div class="space-y-4 mb-12">
                <div class="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                    <h3 class="text-lg font-semibold mb-2">ベーシックプラン</h3>
                    <p class="text-3xl font-bold text-blue-600">¥1,650<span class="text-sm text-gray-500">/月</span></p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                    <h3 class="text-lg font-semibold mb-2">プロプラン</h3>
                    <p class="text-3xl font-bold text-blue-600">¥5,500<span class="text-sm text-gray-500">/月</span></p>
                </div>
            </div>
            <div class="space-x-4">
                <button class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    ダッシュボード
                </button>
                <button class="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                    動画を見る
                </button>
            </div>
        </div>
    </div>
</body>
</html>
    `);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = 4000;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`サーバーが起動しました: http://127.0.0.1:${PORT}`);
});