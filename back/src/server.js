import cors from 'cors'
import express from 'express'
import { createServer } from 'http'
import path, { dirname } from 'path'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url'
import database from './database/index.js'
import getRoutes from './routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

database.initialize().then(db => {
  const server = express()

  server.use(cors())
  server.use(express.static(path.join(__dirname, '..', '..', 'front', 'dist')))
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

  const port = process.env.PORT || '4000'

  httpServer.listen(port, () => console.log(`Connected on port ${port}`))
})
