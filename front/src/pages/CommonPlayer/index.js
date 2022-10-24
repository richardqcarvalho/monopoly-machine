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
  const [players, setPlayers] = useState([])
  const [inTransfer, setInTransfer] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [amountToSend, setAmountToSend] = useState(0)

  useEffect(() => {
    const socket = io(`http://localhost:${process.env.PORT || 4000}`)

    api
      .get(`common-player/${id}`)
      .then(({ data: { name, amount, players } }) => {
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

        socket.connect()
        setAmount(amount)
        setPlayerName(name)
        setPlayers(players.filter(({ id: playerId }) => id != playerId))
        setLoading(false)
      })

    return () => {
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
        // asBank: false,
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
            <Button onClick={() => setInTransfer(id)}>Transfer</Button>
          </Card>
        ))}
      </CardsContainer>
      {inTransfer && (
        <Card>
          <Input
            placeholder="How much?"
            onChange={({ target: { value } }) => setAmountToSend(value)}
          />
          <Button onClick={() => transfer()}>Send</Button>
        </Card>
      )}
      <DropButton onClick={() => giveUp()}>Give up</DropButton>
    </Container>
  )
}

export default CommonPlayerPage
