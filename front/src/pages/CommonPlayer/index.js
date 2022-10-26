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
import colors from '../../styles/colors'

function CommonPlayerPage() {
  const navigate = useNavigate()
  const { id } = getQueryParams(window.location.href)
  const [loading, setLoading] = useState(true)
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
        socket.on('updatePlayers', players =>
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
        socket.on('bankerDropped', () => navigate('/'))
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
      socket.off('updatePlayers')
      socket.off('updateAmounts')
      socket.off('newTransfer')
      socket.off('bankerDropped')
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
      .then(() => {
        setInTransfer(null)
        setAmountToSend(0)
      })
  }

  const giveUp = () => {
    api.delete(`/exit/${id}`).then(() => navigate('/'))
  }

  const buttonsDisabled = amountToSend == 0

  return (
    <Container>
      <Title>{`${playerName}`}</Title>
      <Message>
        {amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </Message>
      {inTransfer && (
        <Card
          style={{
            ...(inTransfer == 'bank' && { backgroundColor: colors.danger }),
          }}
        >
          <Input
            placeholder="How much?"
            style={{ ...(inTransfer == 'bank' && { color: colors.danger }) }}
            onChange={({ target: { value } }) => setAmountToSend(value)}
            type="number"
          />
          <Button
            onClick={() => transfer()}
            style={{ ...(inTransfer == 'bank' && { color: colors.danger }) }}
            disabled={buttonsDisabled}
          >
            Send
          </Button>
          <Button
            onClick={() => setInTransfer(null)}
            style={{ ...(inTransfer == 'bank' && { color: colors.danger }) }}
          >
            Cancel
          </Button>
        </Card>
      )}
      <CardsContainer>
        {players.map(({ id, name }) => (
          <Card
            key={id}
            style={{
              ...(id == 'bank' && { backgroundColor: colors.danger }),
            }}
          >
            <Message>{name}</Message>
            <Button
              style={{
                ...(id == 'bank' && { color: colors.danger }),
              }}
              onClick={() => setInTransfer(id)}
            >
              {id == 'bank' ? 'Pay' : 'Transfer'}
            </Button>
          </Card>
        ))}
      </CardsContainer>
      {transfers.length > 0 && (
        <TransfersContainer>
          {transfers.map(({ amountSent, transferId, sender, receiver }) => (
            <Transfers
              key={transferId}
              style={{
                ...((sender == playerName || receiver == playerName) && {
                  color: sender == playerName ? colors.danger : colors.success,
                }),
              }}
            >{`${sender} -> ${receiver} | ${amountSent.toLocaleString('pt-BR', {
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
