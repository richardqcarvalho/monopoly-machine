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

const server = express()
server.use(cors())
server.use(express.json())
server.use(express.static(path.join(__dirname, '..', 'front/dist')))
const httpServer = createServer(server)
const ws = new Server(httpServer)

ws.on('connection', socket => {
  console.log(`socket ${socket.id} connected`)

  socket.on('disconnect', reason => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`)
  })
})

server.get('/', (req, res) => res.json({ message: 'OK' }))

server.get('/banker', async (req, res) => {
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

  res.json({ ...player.dataValues, players })
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

  ws.emit('newPlayer', players)
})

server.get('/common-player/:id', async (req, res) => {
  await db.sync()

  const { id } = req.params

  const player = await Player.findByPk(id)
  const players = await Player.findAll()

  res.json({ ...player.dataValues, players })
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

  ws.emit('newPlayer', players)
})

server.post('/transfer/:senderId/:receiverId', async (req, res) => {
  const { senderId, receiverId } = req.params
  const { howMuch, asBank } = req.body

  if (!asBank) {
    const sender = await Player.findByPk(senderId)
    await sender.update({
      amount: sender.amount - parseInt(howMuch),
    })
  }

  const receiver = await Player.findByPk(receiverId)
  await receiver.update({
    amount: receiver.amount + parseInt(howMuch),
  })

  res.json({ transfer: 'OK' })

  const players = await Player.findAll()

  ws.emit('updateAmounts', players)
})

server.delete('/clean', async (req, res) => {
  await Player.drop()

  res.json({ message: 'OK' })
})

server.delete('/exit/:id', async (req, res) => {
  await db.sync()

  const { id } = req.params

  await Player.destroy({
    where: {
      id,
    },
  })

  res.json({ message: 'OK' })

  const players = await Player.findAll()

  ws.emit('playerDropped', players)
})

httpServer.listen(process.env.PORT || '4000', () =>
  console.log(`Connected on ${process.env.PORT}`)
)
