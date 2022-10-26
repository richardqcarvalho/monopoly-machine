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
import colors from '../../styles/colors'

function BankerPage() {
  const navigate = useNavigate()
  const { id: bankerId } = getQueryParams(window.location.href)
  const [loading, setLoading] = useState(true)
  const [inTransfer, setInTransfer] = useState({ id: null, asBank: null })
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
      .get(`/banker/${bankerId}`)
      .then(({ data: { name, amount, players, transfers } }) => {
        socket.on('updatePlayers', players =>
          setPlayers([
            ...players.filter(({ id: playerId }) => bankerId != playerId),
            { id: 'bank', name: 'Bank' },
          ])
        )
        socket.on('updateAmounts', players => {
          const info = players.find(({ id: playerId }) => bankerId == playerId)
          setAmount(info.amount)
        })
        socket.on('newTransfer', transfers => setTransfers(transfers))
        socket.connect()

        setAmount(amount)
        setPlayerName(name)
        setPlayers([
          ...players.filter(({ id: playerId }) => bankerId != playerId),
          { id: 'bank', name: 'Bank' },
        ])
        setTransfers(transfers)
        setLoading(false)
      })

    return () => {
      socket.off('updatePlayers')
      socket.off('updateAmounts')
      socket.off('newTransfer')
      socket.disconnect()
    }
  }, [])

  if (loading) {
    return <Loading />
  }

  const transfer = () => {
    api
      .post(`transfer/${bankerId}/${inTransfer.id}`, {
        howMuch: amountToSend,
        asBank: inTransfer.asBank,
      })
      .then(() => {
        setInTransfer({ id: null, asBank: null })
        setAmountToSend(0)
      })
  }

  const giveUp = () => {
    api.delete(`/exit/${bankerId}`).then(() => navigate('/'))
  }

  const buttonsDisabled = amountToSend == 0

  return (
    <Container>
      <Title>{`${playerName} - Banker`}</Title>
      <Message>
        {amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </Message>
      {inTransfer.id && (
        <Card
          style={{
            ...(inTransfer.asBank && { backgroundColor: colors.danger }),
          }}
        >
          <Input
            placeholder="How much?"
            style={{ ...(inTransfer.asBank && { color: colors.danger }) }}
            onChange={({ target: { value } }) => setAmountToSend(value)}
            type="number"
          />
          <Button
            onClick={() => transfer()}
            style={{ ...(inTransfer.asBank && { color: colors.danger }) }}
            disabled={buttonsDisabled}
          >
            {inTransfer.id == bankerId ? 'Receive' : 'Send'}
          </Button>
          <Button
            onClick={() => setInTransfer({ id: null, asBank: null })}
            style={{ ...(inTransfer.asBank && { color: colors.danger }) }}
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
              onClick={() => setInTransfer({ id, asBank: false })}
            >
              {id == 'bank' ? 'Pay to bank' : 'Transfer as me'}
            </Button>
            <Button
              style={{
                ...(id == 'bank' && { color: colors.danger }),
              }}
              onClick={() =>
                setInTransfer({
                  id: id == 'bank' ? bankerId : id,
                  asBank: true,
                })
              }
            >
              {id == 'bank' ? 'Receive from bank' : 'Transfer as bank'}
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

export default BankerPage
