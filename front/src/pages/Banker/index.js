import React, { Fragment, useEffect, useRef, useState } from 'react'
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
  ErrorMessage,
  ErrorMessageWrapper,
  TransferConfirmation,
  AmountToSend,
  PlayersAmount,
} from './styles'
import Loading from '../../components/Loading'
import { getQueryParams } from '../../utils'
import api from '../../utils/api'
import io from 'socket.io-client'
import colors from '../../styles/colors'

const DEFAULT_STATE = {
  id: null,
  asBank: null,
  loading: false,
  confirmation: false,
  name: '',
}

function BankerPage() {
  const navigate = useNavigate()
  const { id: bankerId } = getQueryParams(window.location.href)
  const transfersContainerRef = useRef()
  const [loading, setLoading] = useState(true)
  const [inTransfer, setInTransfer] = useState(DEFAULT_STATE)
  const [amount, setAmount] = useState(0)
  const [players, setPlayers] = useState([])
  const [playerName, setPlayerName] = useState('')
  const [amountToSend, setAmountToSend] = useState(null)
  const [transfers, setTransfers] = useState([])

  useEffect(() => {
    const socket = io(
      process.env.NODE_ENV == 'development'
        ? 'http://192.168.15.9:4000'
        : 'https://monopoly-machine.herokuapp.com'
    )

    api
      .get(`/banker/${bankerId}`)
      .then(({ data: { name, amount, players, transfers } }) => {
        socket.on('updateInfo', players => {
          setPlayers([
            ...players.filter(({ id: playerId }) => bankerId != playerId),
            { id: 'bank', name: 'Bank' },
          ])
          const { amount } = players.find(({ id }) => id == bankerId)
          setAmount(parseInt(amount))
        })
        socket.on('newTransfer', transfers => setTransfers(transfers))
        socket.on('bankerDropped', () => navigate('/'))
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
      .catch(() => navigate('/'))

    return () => {
      socket.off('updateInfo')
      socket.off('newTransfer')
      socket.off('bankerDropped')
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    const element = transfersContainerRef.current

    if (element) element.scrollTo(0, element.scrollHeight)
  }, [transfers])

  if (loading) {
    return <Loading />
  }

  const transfer = () => {
    setInTransfer({ ...inTransfer, loading: true })

    api
      .post(`transfer/${bankerId}/${inTransfer.id}`, {
        howMuch: amountToSend,
        asBank: inTransfer.asBank,
      })
      .then(() => {
        setInTransfer(DEFAULT_STATE)
        setAmountToSend(null)
      })
  }

  const giveUp = () => {
    api.delete(`/exit/${bankerId}`).then(() => navigate('/'))
  }

  const passBank = id => {
    api.post(`/pass-bank/${bankerId}/${id}`).then(() => navigate('/'))
  }

  const amountBiggerThanBalance = amountToSend > amount && !inTransfer.asBank
  const buttonsDisabled =
    amountToSend == 0 || amountBiggerThanBalance || amountToSend == null

  return (
    <Container>
      <Title>{`${playerName} - Banker`}</Title>
      <Message>
        {amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </Message>
      {inTransfer.id && (
        <TransferConfirmation
          style={{
            ...(inTransfer.asBank && { backgroundColor: colors.danger }),
          }}
        >
          {inTransfer.loading ? (
            <Loading type={inTransfer.asBank ? 'danger' : 'default'} />
          ) : inTransfer.confirmation ? (
            <Fragment>
              <Message>{`You will ${
                inTransfer.asBank && inTransfer.id == bankerId
                  ? 'receive from'
                  : 'send to'
              } ${inTransfer.name || 'Bank'}`}</Message>
              <AmountToSend>
                {amountToSend.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </AmountToSend>
              <Button
                onClick={() => transfer()}
                style={{ color: colors.danger }}
              >
                Confirm
              </Button>
              <Button
                onClick={() =>
                  setInTransfer({ ...inTransfer, confirmation: false })
                }
              >
                Edit
              </Button>
              <Button
                onClick={() => setInTransfer(DEFAULT_STATE)}
                style={{ ...(inTransfer.asBank && { color: colors.danger }) }}
              >
                Cancel
              </Button>
            </Fragment>
          ) : (
            <Fragment>
              <Input
                placeholder="How much?"
                style={{ ...(inTransfer.asBank && { color: colors.danger }) }}
                onChange={({ target: { value } }) =>
                  setAmountToSend(value == '' ? null : parseInt(value))
                }
                value={amountToSend}
                type="number"
              />
              {amountBiggerThanBalance && (
                <ErrorMessageWrapper>
                  <ErrorMessage>
                    Amount to send bigger than balance you have
                  </ErrorMessage>
                </ErrorMessageWrapper>
              )}
              <Button
                onClick={() =>
                  setInTransfer({ ...inTransfer, confirmation: true })
                }
                style={{ ...(inTransfer.asBank && { color: colors.danger }) }}
                disabled={buttonsDisabled}
              >
                {inTransfer.id == bankerId ? 'Receive' : 'Send'}
              </Button>
              <Button
                onClick={() => {
                  setInTransfer(DEFAULT_STATE)
                  setAmountToSend(null)
                }}
                style={{ ...(inTransfer.asBank && { color: colors.danger }) }}
              >
                Cancel
              </Button>
            </Fragment>
          )}
        </TransferConfirmation>
      )}
      <CardsContainer>
        {players.map(({ id, name, amount }) => (
          <Card
            key={id}
            style={{
              ...(id == 'bank' && { backgroundColor: colors.danger }),
            }}
          >
            <Message>{name}</Message>
            <PlayersAmount>
              {amount != null
                ? parseInt(amount).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })
                : '💸'}
            </PlayersAmount>
            <Button
              style={{
                ...(id == 'bank' && { color: colors.danger }),
              }}
              onClick={() =>
                setInTransfer({ ...inTransfer, id, asBank: false, name })
              }
            >
              {id == 'bank' ? 'Pay to bank' : 'Transfer as me'}
            </Button>
            <Button
              style={{
                ...(id == 'bank' && { color: colors.danger }),
              }}
              onClick={() =>
                setInTransfer({
                  ...inTransfer,
                  id: id == 'bank' ? bankerId : id,
                  asBank: true,
                  name: !inTransfer.asBank && id != 'bank' ? name : 'Bank',
                })
              }
            >
              {id == 'bank' ? 'Receive from bank' : 'Transfer as bank'}
            </Button>
            {id != 'bank' && (
              <Button
                style={{
                  backgroundColor: colors.danger,
                  color: colors.contrast,
                }}
                onClick={() => passBank(id)}
              >
                Pass bank
              </Button>
            )}
          </Card>
        ))}
      </CardsContainer>
      {transfers.length > 0 && (
        <TransfersContainer ref={transfersContainerRef}>
          {transfers.map(({ amountSent, id, sender, receiver }) => (
            <Transfers
              key={id}
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
