import cors from 'cors'
import express from 'express'
import { createServer } from 'http'
// import path from 'path'
import os from 'os'
import { dirname } from 'path'
import { Server } from 'socket.io'
import getRoutes from './routes.js'
// import favicon from 'serve-favicon'
import { fileURLToPath } from 'url'
import database from './database/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

database.initialize().then(db => {
  const server = express()

  server.use(cors())
  // server.use(
  //   favicon(path.join(__dirname, '..', '..', 'front', 'dist', 'favicon.ico'))
  // )
  // server.use(express.static(path.join(__dirname, '..', '..', 'front', 'dist')))
  server.use(express.json())

  const httpServer = createServer(server)
  const ws = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  })

  ws.on('connection', socket => {
    console.log(`socket ${socket.id} connected`)

    socket.on('disconnect', reason => {
      console.log(`socket ${socket.id} disconnected due to ${reason}`)
    })
  })

  server.use(getRoutes(db, ws))

  const netWorkInfo = os.networkInterfaces()
  const port = process.env.PORT || '4000'

  if (netWorkInfo['Wi-Fi']) {
    const [_a, _b, _c, { address: ip }] = netWorkInfo['Wi-Fi']
    httpServer.listen(port, () =>
      console.log(`Connected on http://${ip}:${port}`)
    )
  } else httpServer.listen(port, () => console.log(`Connected on port ${port}`))
})
