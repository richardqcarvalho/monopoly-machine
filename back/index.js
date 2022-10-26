const express = require('express')
const cors = require('cors')
const { v4: uuid } = require('uuid')
const { Server } = require('socket.io')
const { createServer } = require('http')
const { Sequelize, DataTypes } = require('sequelize')
const path = require('path')

const db = new Sequelize({
  dialect: 'sqlite',
  storage: './bd.sqlite',
})

const Player = db.define('Player', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  amount: {
    type: DataTypes.NUMBER,
  },
  banker: {
    type: DataTypes.BOOLEAN,
  },
})

const Transfer = db.define('Transfer', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  sender: {
    type: DataTypes.STRING,
  },
  receiver: {
    type: DataTypes.STRING,
  },
  amountSent: {
    type: DataTypes.NUMBER,
  },
})

const server = express()
server.use(cors())
server.use(express.json())
server.use(express.static(path.join(__dirname, '..', 'front/dist')))
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

server.get('/banker', async (_req, res) => {
  await db.sync()

  const banker = await Player.findAll({
    where: {
      banker: true,
    },
  })

  res.json({ bankerExists: !!banker.length })
})

server.get('/banker/:id', async (req, res) => {
  await db.sync()

  const { id } = req.params

  const player = await Player.findByPk(id)
  const players = await Player.findAll()
  const transfers = await Transfer.findAll()

  res.json({ ...player.dataValues, players, transfers })
})

server.post('/create-banker', async (req, res) => {
  await db.sync()

  const { name } = req.body

  const id = uuid()

  const data = await Player.create({
    id,
    name,
    amount: 200000,
    banker: true,
  })

  res.json(data)

  const players = await Player.findAll()

  ws.emit('updatePlayers', players)
  ws.emit('updatePage')
})

server.get('/common-player/:id', async (req, res) => {
  await db.sync()

  const { id } = req.params

  const player = await Player.findByPk(id)
  const players = await Player.findAll()
  const transfers = await Transfer.findAll()

  res.json({ ...player.dataValues, players, transfers })
})

server.post('/create-common-player', async (req, res) => {
  await db.sync()

  const { name } = req.body

  const id = uuid()

  const data = await Player.create({
    id,
    name,
    amount: 200000,
    banker: false,
  })

  res.json(data)

  const players = await Player.findAll()

  ws.emit('updatePlayers', players)
})

server.post('/transfer/:senderId/:receiverId', async (req, res) => {
  const { senderId, receiverId } = req.params
  const { howMuch, asBank } = req.body
  const id = uuid()
  let senderName = 'Bank'
  let receiverName = 'Bank'

  if (!asBank) {
    const sender = await Player.findByPk(senderId)
    await sender.update({
      amount: sender.amount - parseInt(howMuch),
    })
    senderName = sender.name
  }

  if (receiverId != 'bank') {
    const receiver = await Player.findByPk(receiverId)
    await receiver.update({
      amount: receiver.amount + parseInt(howMuch),
    })
    receiverName = receiver.name
  }

  await Transfer.create({
    id,
    sender: senderName,
    receiver: receiverName,
    amountSent: howMuch,
  })

  res.status(200)

  const players = await Player.findAll()

  ws.emit('updateAmounts', players)

  const transfers = await Transfer.findAll()

  ws.emit('newTransfer', transfers)
})

server.delete('/clean', async (_req, res) => {
  await Player.drop()
  await Transfer.drop()

  res.status(200)

  ws.emit('bankerDropped')
  ws.emit('updatePage')
})

server.delete('/exit/:id', async (req, res) => {
  await db.sync()

  const { id } = req.params

  const player = await Player.findByPk(id)

  if (player.banker) {
    await Player.drop()
    await Transfer.drop()

    res.status(200)

    ws.emit('bankerDropped')
    ws.emit('updatePage')
  } else {
    await Player.destroy({
      where: {
        id,
      },
    })

    res.status(200)

    const players = await Player.findAll()

    ws.emit('updatePlayers', players)
  }
})

const port = process.env.PORT || '4000'

httpServer.listen(port, () => console.log(`Connected on port ${port}`))
