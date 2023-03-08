import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AmountToSend,
  BankerIcon,
  Button,
  CardsContainer,
  Container,
  DropButton,
  ErrorMessage,
  ErrorMessageWrapper,
  Input,
  Message,
  PlayersAmount,
  Title,
  TransferConfirmation,
  Transfers,
  TransfersContainer,
} from './styles'
import Loading from '../../components/Loading'
import { getQueryParams, getURL } from '../../utils'
import api from '../../utils/api'
import io from 'socket.io-client'
import Card from '../../components/Card'
import Modal from '../../components/Modal'

const DEFAULT_STATE = {
  id: null,
  asBank: null,
  confirmation: false,
  name: '',
  pageLoading: true,
  transferLoading: false,
  amountToSend: '',
  player: {
    name: '',
    amount: 0,
    banker: false,
  },
  players: [],
  transfers: [],
}

function GamePage() {
  const navigate = useNavigate()
  const { id: currentPlayerId } = getQueryParams(window.location.href)
  const transfersContainerRef = useRef()
  const [
    {
      id,
      asBank,
      pageLoading,
      transferLoading,
      confirmation,
      name,
      amountToSend,
      player,
      players,
      transfers,
    },
    setState,
  ] = useState(DEFAULT_STATE)

  useEffect(() => {
    const socket = io(getURL())

    api
      .get(`/player/${currentPlayerId}`)
      .then(({ data: { players, transfers } }) => {
        socket.on('updateInfo', players => {
          setState(previousState => ({
            ...previousState,
            player:
              players.find(({ id }) => id == currentPlayerId) ||
              DEFAULT_STATE.player,
            players: [
              ...players.filter(
                ({ id: playerId }) => currentPlayerId != playerId
              ),
              { id: 'bank', name: 'Bank' },
            ],
          }))
        })
        socket.on('newTransfer', transfers =>
          setState(previousState => ({ ...previousState, transfers }))
        )
        socket.on('bankerDropped', () => navigate('/'))
        socket.connect()

        setState(previousState => ({
          ...previousState,
          player:
            players.find(({ id }) => id == currentPlayerId) ||
            DEFAULT_STATE.player,
          players: [
            ...players.filter(
              ({ id: playerId }) => currentPlayerId != playerId
            ),
            { id: 'bank', name: 'Bank' },
          ],
          transfers: transfers,
          pageLoading: false,
        }))
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

  if (pageLoading) {
    return <Loading />
  }

  const transfer = () => {
    setState(previousState => ({ ...previousState, transferLoading: true }))

    api
      .post(`transfer/${currentPlayerId}/${id}`, {
        howMuch: parseInt(amountToSend),
        asBank: asBank,
      })
      .then(() => {
        const { id, asBank, confirmation, transferLoading, amountToSend } =
          DEFAULT_STATE
        setState(previousState => ({
          ...previousState,
          id,
          asBank,
          transferLoading,
          confirmation,
          amountToSend,
        }))
      })
  }

  const giveUp = () => {
    api.delete(`/exit/${currentPlayerId}`).then(() => navigate('/'))
  }

  const passBank = id => {
    api.post(`/pass-bank/${currentPlayerId}/${id}`).then(() => navigate('/'))
  }

  return (
    <Container>
      {player.banker && <BankerIcon>&#127913;</BankerIcon>}
      <Title>{`${player.name}`}</Title>
      <Message>
        {player.amount.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </Message>
      {id && (
        <Modal
          transfer={transfer}
          transferLoading={transferLoading}
          asBank={asBank}
          confirmation={confirmation}
          id={id}
          name={name}
          currentPlayerId={player.id}
          setState={setState}
          amountToSend={amountToSend}
          defaultState={DEFAULT_STATE}
        />
      )}
      <CardsContainer>
        {players.map(({ id, name, amount }) => (
          <Card
            key={id}
            id={id}
            name={name}
            amount={amount}
            banker={player.banker}
            setState={setState}
            passBank={passBank}
            currentPlayerId={player.id}
            currentPlayerName={player.name}
          />
        ))}
      </CardsContainer>
      {transfers.length > 0 && (
        <TransfersContainer ref={transfersContainerRef}>
          {transfers.map(({ amountSent, id, sender, receiver }) => (
            <Transfers
              key={id}
              evolvesMe={sender == player.name || receiver == player.name}
              type={sender == player.name ? 'out' : 'in'}
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

export default GamePage
