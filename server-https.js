const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3443

// Next.jsアプリを初期化
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// SSL証明書を読み込み
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '.ssl/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '.ssl/cert.pem')),
}

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`🔒 HTTPS Server ready on https://${hostname}:${port}`)
      console.log(`🚀 はじめて.AI HTTPS版が起動しました！`)
    })
})