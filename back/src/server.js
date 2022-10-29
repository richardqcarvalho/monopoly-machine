import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import { createServer } from 'http'
import path from 'path'
import routes from './routes.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import favicon from 'serve-favicon'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const server = express()

server.use(cors())
server.use(
  favicon(path.join(__dirname, '..', '..', 'front', 'dist', 'favicon.ico'))
)
server.use(express.static(path.join(__dirname, '..', '..', 'front', 'dist')))
server.use(express.json())
server.use(routes)

const httpServer = createServer(server)

const ws = new Server(httpServer, {
  cors: {
    origin: ['http://10.0.0.175:3000', 'http://10.0.0.175:4000'],
  },
})

ws.on('connection', socket => {
  console.log(`socket ${socket.id} connected`)

  socket.on('disconnect', reason => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`)
  })
})

const port = process.env.PORT || '4000'

httpServer.listen(port, () => console.log(`Connected on port ${port}`))

export default ws
