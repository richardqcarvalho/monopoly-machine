import express from 'express'
import { v4 as uuid } from 'uuid'
import { Player, Transfer } from './database/entities.js'

const getRoutes = ({ manager: db }, ws) => {
  const routes = express.Router()

  routes.get('/', (_req, res) => res.status(200).json({ message: 'OK' }))

  routes.post('/pass-bank/:currentBankerId/:newBankerId', async (req, res) => {
    const { currentBankerId, newBankerId } = req.params

    await db.delete(Player, {
      id: currentBankerId,
    })
    await db.update(
      Player,
      {
        id: newBankerId,
      },
      {
        banker: true,
      }
    )

    const players = await db.find(Player)

    ws.emit('passBank', newBankerId)
    ws.emit('updateInfo', players)

    res.status(200).send()
  })

  routes.get('/players', async (_req, res) => {
    const players = await db.find(Player)

    res.status(200).json({ players })
  })

  routes.get('/banker', async (_req, res) => {
    const banker = await db.find(Player, {
      where: {
        banker: true,
      },
    })

    res.json({ bankerExists: !!banker.length })
  })

  routes.get('/banker/:id', async (req, res) => {
    const { id } = req.params

    const [player] = await db.find(Player, {
      where: {
        id,
      },
    })
    const players = await db.find(Player)
    const transfers = await db.find(Transfer)

    if (player) res.json({ ...player, players, transfers })
    else res.status(400).send()
  })

  routes.post('/create-banker', async (req, res) => {
    const { name } = req.body

    const bankerId = uuid()
    const transferId = uuid()
    const amount = 200000
    const banker = true

    await db.insert(Player, {
      id: bankerId,
      name,
      amount,
      banker,
    })

    await db.insert(Transfer, {
      id: transferId,
      sender: 'Bank',
      receiver: name,
      amountSent: amount,
    })

    const players = await db.find(Player)

    ws.emit('updateInfo', players)

    res.status(200).json({ id: bankerId, name, amount, banker })

    ws.emit('updatePage', true)
  })

  routes.get('/common-player/:id', async (req, res) => {
    const { id } = req.params

    const [player] = await db.find(Player, {
      where: {
        id,
      },
    })
    const players = await db.find(Player)
    const transfers = await db.find(Transfer)

    if (player) res.json({ ...player, players, transfers })
    else res.status(400).send()
  })

  routes.get('/player/:id', async (req, res) => {
    const { id } = req.params

    const [player] = await db.find(Player, { where: { id } })
    const players = await db.find(Player)
    const transfers = await db.find(Transfer)

    if (player) res.json({ player, players, transfers })
    else res.status(400).send()
  })

  routes.post('/change/:id', async (req, res) => {
    const { id } = req.params

    const [player] = await db.find(Player, { where: { id } })

    if (player) {
      db.update(
        Player,
        { id },
        {
          banker: !player.banker,
        }
      )

      res.json({ player })
    } else res.status(400).send()
  })

  routes.post('/create-common-player', async (req, res) => {
    const { name } = req.body

    const commonPlayerId = uuid()
    const transferId = uuid()
    const amount = 200000
    const banker = false

    await db.insert(Player, {
      id: commonPlayerId,
      name,
      amount,
      banker,
    })

    await db.insert(Transfer, {
      id: transferId,
      sender: 'Bank',
      receiver: name,
      amountSent: amount,
    })

    const players = await db.find(Player)
    const transfers = await db.find(Transfer)

    ws.emit('updateInfo', players)
    ws.emit('newTransfer', transfers)

    res.status(200).json({ id: commonPlayerId, name, amount, banker })
  })

  routes.post('/transfer/:senderId/:receiverId', async (req, res) => {
    const { senderId, receiverId } = req.params
    const { howMuch, asBank } = req.body
    const id = uuid()
    let senderName = 'Bank'
    let receiverName = 'Bank'

    if (!asBank) {
      const [sender] = await db.find(Player, { where: { id: senderId } })
      await db.update(
        Player,
        { id: senderId },
        {
          amount: parseInt(sender.amount) - parseInt(howMuch),
        }
      )
      senderName = sender.name
    }

    if (receiverId != 'bank') {
      const [receiver] = await db.find(Player, { where: { id: receiverId } })
      await db.update(
        Player,
        { id: receiverId },
        {
          amount: parseInt(receiver.amount) + parseInt(howMuch),
        }
      )
      receiverName = receiver.name
    }

    await db.insert(Transfer, {
      id,
      sender: senderName,
      receiver: receiverName,
      amountSent: howMuch,
    })

    const players = await db.find(Player)

    ws.emit('updateInfo', players)

    const transfers = await db.find(Transfer)

    ws.emit('newTransfer', transfers)

    res.status(200).send()
  })

  routes.delete('/clean', async (_req, res) => {
    db.clear(Player)
    db.clear(Transfer)

    res.status(200).send()

    ws.emit('bankerDropped')
    ws.emit('updatePage', false)
  })

  routes.delete('/exit/:id', async (req, res) => {
    const { id } = req.params

    const [player] = await db.find(Player, {
      where: {
        id,
      },
    })

    if (player.banker) {
      await db.clear(Player)
      await db.clear(Transfer)

      res.status(200).send()

      ws.emit('bankerDropped')
      ws.emit('updatePage', false)
    } else {
      await db.delete(Player, {
        id,
      })

      const players = await db.find(Player)

      ws.emit('updateInfo', players)

      res.status(200).send()
    }
  })

  return routes
}

export default getRoutes
