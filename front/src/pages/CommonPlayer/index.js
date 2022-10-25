import React, { useEffect, useState } from 'react'
import {
  Container,
  Title,
  Button,
  Message,
  Card,
  CardsContainer,
  DropButton,
  Input,
  TransfersContainer,
  Transfers,
} from './styles'
import Loading from '../../components/Loading'
import { useNavigate } from 'react-router-dom'
import { getQueryParams } from '../../utils'
import api from '../../utils/api'
import io from 'socket.io-client'

function CommonPlayerPage() {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { id } = getQueryParams(window.location.href)
  const [amount, setAmount] = useState(0)
  const [players, setPlayers] = useState([{ id: 'bank', name: 'Bank' }])
  const [inTransfer, setInTransfer] = useState(null)
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
      .get(`common-player/${id}`)
      .then(({ data: { name, amount, players, transfers } }) => {
        socket.on('newPlayer', players =>
          setPlayers([
            ...players.filter(({ id: playerId }) => id != playerId),
            { id: 'bank', name: 'Bank' },
          ])
        )
        socket.on('playerDropped', players =>
          setPlayers([
            ...players.filter(({ id: playerId }) => id != playerId),
            { id: 'bank', name: 'Bank' },
          ])
        )
        socket.on('updateAmounts', players => {
          const info = players.find(({ id: playerId }) => id == playerId)
          setAmount(info.amount)
        })
        socket.on('newTransfer', transfers => setTransfers(transfers))

        socket.connect()
        setAmount(amount)
        setPlayerName(name)
        setPlayers([
          ...players.filter(({ id: playerId }) => id != playerId),
          { id: 'bank', name: 'Bank' },
        ])
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
      .post(`transfer/${id}/${inTransfer}`, {
        howMuch: amountToSend,
      })
      .then(() => setInTransfer(null))
  }

  const giveUp = () => {
    api.delete(`/exit/${id}`).then(() => navigate('/'))
  }

  return (
    <Container>
      <Title>{`${playerName}`}</Title>
      <Message>
        {amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </Message>
      <CardsContainer>
        {players.map(({ id, name }) => (
          <Card key={id}>
            <Message>{name}</Message>
            <Button onClick={() => setInTransfer(id)}>
              {id == 'bank' ? 'Pay' : 'Transfer'}
            </Button>
          </Card>
        ))}
      </CardsContainer>
      {inTransfer && (
        <Card
          style={{
            ...(inTransfer == 'bank' && { backgroundColor: '#c0392b' }),
          }}
        >
          <Input
            placeholder="How much?"
            style={{ ...(inTransfer == 'bank' && { color: '#c0392b' }) }}
            onChange={({ target: { value } }) => setAmountToSend(value)}
          />
          <Button
            onClick={() => transfer()}
            style={{ ...(inTransfer == 'bank' && { color: '#c0392b' }) }}
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
      <DropButton onClick={() => giveUp()}>Give up</DropButton>
    </Container>
  )
}

export default CommonPlayerPage
