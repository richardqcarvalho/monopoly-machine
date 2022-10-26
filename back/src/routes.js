import db from './database/index.js'
import Player from './database/models/player.js'
import Transfer from './database/models/transfer.js'
import { v4 as uuid } from 'uuid'
import express from 'express'
import ws from './server.js'

const routes = express.Router()

routes.get('/banker', async (_req, res) => {
  await db.sync()

  const banker = await Player.findAll({
    where: {
      banker: true,
    },
  })

  res.json({ bankerExists: !!banker.length })
})

routes.get('/banker/:id', async (req, res) => {
  await db.sync()

  const { id } = req.params

  const player = await Player.findByPk(id)
  const players = await Player.findAll()
  const transfers = await Transfer.findAll()

  res.json({ ...player.dataValues, players, transfers })
})

routes.post('/create-banker', async (req, res) => {
  await db.sync()

  const { name } = req.body

  const id = uuid()
  const transferId = uuid()

  const data = await Player.create({
    id,
    name,
    amount: 200000,
    banker: true,
  })

  await Transfer.create({
    id: transferId,
    sender: 'Bank',
    receiver: name,
    amountSent: 200000,
  })

  res.json(data)

  const players = await Player.findAll()

  ws.emit('updatePlayers', players)
  ws.emit('updatePage')
})

routes.get('/common-player/:id', async (req, res) => {
  await db.sync()

  const { id } = req.params

  const player = await Player.findByPk(id)
  const players = await Player.findAll()
  const transfers = await Transfer.findAll()

  res.json({ ...player.dataValues, players, transfers })
})

routes.post('/create-common-player', async (req, res) => {
  await db.sync()

  const { name } = req.body

  const id = uuid()
  const transferId = uuid()

  const data = await Player.create({
    id,
    name,
    amount: 200000,
    banker: false,
  })

  await Transfer.create({
    id: transferId,
    sender: 'Bank',
    receiver: name,
    amountSent: 200000,
  })

  res.json(data)

  const players = await Player.findAll()
  const transfers = await Transfer.findAll()

  ws.emit('updatePlayers', players)
  ws.emit('newTransfer', transfers)
})

routes.post('/transfer/:senderId/:receiverId', async (req, res) => {
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

  res.status(200).send()

  const players = await Player.findAll()

  ws.emit('updateAmounts', players)

  const transfers = await Transfer.findAll()

  ws.emit('newTransfer', transfers)
})

routes.delete('/clean', async (_req, res) => {
  await Player.drop()
  await Transfer.drop()

  res.status(200).send()

  ws.emit('bankerDropped')
  ws.emit('updatePage')
})

routes.delete('/exit/:id', async (req, res) => {
  await db.sync()

  const { id } = req.params

  const player = await Player.findByPk(id)

  if (player.banker) {
    await Player.drop()
    await Transfer.drop()

    res.status(200).send()

    ws.emit('bankerDropped')
    ws.emit('updatePage')
  } else {
    await Player.destroy({
      where: {
        id,
      },
    })

    res.status(200).send()

    const players = await Player.findAll()

    ws.emit('updatePlayers', players)
  }
})

export default routes
