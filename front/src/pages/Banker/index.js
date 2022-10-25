import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Title,
  Button,
  Message,
  Card,
  CardsContainer,
  DropButton,
  Input,
  Transfers,
  TransfersContainer,
} from './styles'
import Loading from '../../components/Loading'
import { getQueryParams } from '../../utils'
import api from '../../utils/api'
import io from 'socket.io-client'

function BankerPage() {
  const [loading, setLoading] = useState(true)
  const [inTransfer, setInTransfer] = useState({ id: null, asBank: null })
  const navigate = useNavigate()
  const { id } = getQueryParams(window.location.href)
  const [amount, setAmount] = useState(0)
  const [players, setPlayers] = useState([])
  const [playerName, setPlayerName] = useState('')
  const [amountToSend, setAmountToSend] = useState(0)
  const [transfers, setTransfers] = useState([])

  useEffect(() => {
    const socket = io(
      process.env.NODE_ENV == 'development'
        ? 'http://localhost:4000'
        : 'https://monopoly-machine.herokuapp.com'
    )

    api
      .get(`/banker/${id}`)
      .then(({ data: { name, amount, players, transfers } }) => {
        socket.on('newPlayer', players =>
          setPlayers(players.filter(({ id: playerId }) => id != playerId))
        )
        socket.on('playerDropped', players =>
          setPlayers(players.filter(({ id: playerId }) => id != playerId))
        )
        socket.on('updateAmounts', players => {
          const info = players.find(({ id: playerId }) => id == playerId)
          setAmount(info.amount)
        })
        socket.on('newTransfer', transfers => setTransfers(transfers))

        socket.connect()
        setAmount(amount)
        setPlayerName(name)
        setPlayers(players.filter(({ id: playerId }) => id != playerId))
        setTransfers(transfers)
        setLoading(false)
      })

    return () => {
      socket.off('newTransfer')
      socket.off('updateAmounts')
      socket.off('newPlayer')
      socket.off('connect')
      socket.disconnect()
    }
  }, [])

  if (loading) {
    return <Loading />
  }

  const transfer = () => {
    api
      .post(`transfer/${id}/${inTransfer.id}`, {
        howMuch: amountToSend,
        asBank: inTransfer.asBank,
      })
      .then(() => setInTransfer({ id: null, asBank: null }))
  }

  return (
    <Container>
      <Title>{`${playerName} - Banker`}</Title>
      <Message>
        {amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </Message>
      <CardsContainer>
        {players.map(({ id, name }) => (
          <Card key={id}>
            <Message>{name}</Message>
            <Button onClick={() => setInTransfer({ id, asBank: false })}>
              Transfer as me
            </Button>
            <Button onClick={() => setInTransfer({ id, asBank: true })}>
              Transfer as bank
            </Button>
          </Card>
        ))}
      </CardsContainer>
      {inTransfer.id && (
        <Card
          style={{ ...(inTransfer.asBank && { backgroundColor: '#c0392b' }) }}
        >
          <Input
            placeholder="How much?"
            style={{ ...(inTransfer.asBank && { color: '#c0392b' }) }}
            onChange={({ target: { value } }) => setAmountToSend(value)}
            type="number"
          />
          <Button
            onClick={() => transfer()}
            style={{ ...(inTransfer.asBank && { color: '#c0392b' }) }}
          >
            Send
          </Button>
        </Card>
      )}
      {transfers.length > 0 && (
        <TransfersContainer>
          {transfers.map(({ amountSent, transferId, sender, receiver }) => (
            <Transfers
              key={transferId}
            >{`${sender} -> ${receiver} = ${amountSent.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}`}</Transfers>
          ))}
        </TransfersContainer>
      )}
      {/* <DropButton>Give up</DropButton> */}
    </Container>
  )
}

export default BankerPage
