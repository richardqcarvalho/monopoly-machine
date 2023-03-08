import db from './database/index.js'
import Player from './database/models/player.js'
import Transfer from './database/models/transfer.js'
import { v4 as uuid } from 'uuid'
import express from 'express'
import ws from './server.js'

const routes = express.Router()

routes.post('/pass-bank/:currentBankerId/:newBankerId', async (req, res) => {
  await db.sync()

  const { currentBankerId, newBankerId } = req.params

  await Player.destroy({
    where: {
      id: currentBankerId,
    },
  })
  const newBanker = await Player.findByPk(newBankerId)

  await newBanker.update({
    banker: true,
  })

  const players = await Player.findAll()

  ws.emit('passBank', newBankerId)
  ws.emit('updateInfo', players)

  res.status(200).send()
})

routes.get('/players', async (_req, res) => {
  await db.sync()

  const players = await Player.findAll()

  res.json({ players })
})

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

  if (player) res.json({ ...player.dataValues, player, players, transfers })
  else res.status(400).send()
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

  const players = await Player.findAll()

  ws.emit('updateInfo', players)

  res.json(data)

  ws.emit('updatePage', true)
})

routes.get('/common-player/:id', async (req, res) => {
  await db.sync()

  const { id } = req.params

  const player = await Player.findByPk(id)
  const players = await Player.findAll()
  const transfers = await Transfer.findAll()

  if (player) res.json({ ...player.dataValues, player, players, transfers })
  else res.status(400).send()
})

routes.get('/player/:id', async (req, res) => {
  await db.sync()

  const { id } = req.params

  const player = await Player.findByPk(id)
  const players = await Player.findAll()
  const transfers = await Transfer.findAll()

  if (player) res.json({ player, players, transfers })
  else res.status(400).send()
})

routes.post('/change/:id', async (req, res) => {
  await db.sync()

  const { id } = req.params

  const player = await Player.findByPk(id)

  if (player) {
    player.update({
      banker: !player.dataValues.banker,
    })

    res.json({ player })
  } else res.status(400).send()
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

  const players = await Player.findAll()
  const transfers = await Transfer.findAll()

  ws.emit('updateInfo', players)
  ws.emit('newTransfer', transfers)

  res.json(data)
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

  const players = await Player.findAll()

  ws.emit('updateInfo', players)

  const transfers = await Transfer.findAll()

  ws.emit('newTransfer', transfers)

  res.status(200).send()
})

routes.delete('/clean', async (_req, res) => {
  await Player.drop()
  await Transfer.drop()

  res.status(200).send()

  ws.emit('bankerDropped')
  ws.emit('updatePage', false)
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
    ws.emit('updatePage', false)
  } else {
    await Player.destroy({
      where: {
        id,
      },
    })

    const players = await Player.findAll()

    ws.emit('updateInfo', players)

    res.status(200).send()
  }
})

export default routes
