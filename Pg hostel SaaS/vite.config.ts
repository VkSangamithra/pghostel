import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function videoRangePlugin(): Plugin {
  return {
    name: 'video-range-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.split('?')[0].endsWith('.mp4')) {
          const cleanUrl = req.url.split('?')[0].replace(/^\//, '')
          const filePath = path.join(__dirname, 'public', cleanUrl)
          if (fs.existsSync(filePath)) {
            const stat = fs.statSync(filePath)
            const fileSize = stat.size
            const range = req.headers.range

            if (range) {
              const parts = range.replace(/bytes=/, '').split('-')
              const start = parseInt(parts[0], 10)
              const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
              const chunksize = end - start + 1
              const file = fs.createReadStream(filePath, { start, end })
              res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
              })
              file.pipe(res)
              return
            } else {
              res.writeHead(200, {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
                'Accept-Ranges': 'bytes',
              })
              fs.createReadStream(filePath).pipe(res)
              return
            }
          }
        }
        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), videoRangePlugin()],
  server: {
    port: 5173,
    host: true
  }
})

