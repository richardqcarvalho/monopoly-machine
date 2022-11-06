import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Title, Button, Message, DropButton, Input } from './styles'
import Loading from '../../components/Loading'
import api from '../../utils/api'
import io from 'socket.io-client'

function HomePage() {
  const navigate = useNavigate()
  const bankerExistence = useRef(false)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')

  useEffect(() => {
    const socket = io(
      process.env.NODE_ENV == 'development'
        ? 'http://192.168.15.9:4000'
        : 'https://monopoly-machine.herokuapp.com'
    )

    api.get('banker').then(({ data: { bankerExists } }) => {
      socket.on('updatePage', () => window.location.reload())
      socket.connect()

      bankerExistence.current = bankerExists

      setLoading(false)
    })

    return () => {
      socket.off('updatePage')
      socket.disconnect()
    }
  }, [])

  if (loading) {
    return <Loading />
  }

  const cleanTable = () =>
    api.delete('/clean').then(() => window.location.reload(true))

  const createBanker = () =>
    api.post('/create-banker', { name }).then(({ data: { id } }) => {
      navigate(`/banker?id=${id}`)
    })

  const createCommonPlayer = () =>
    api.post('/create-common-player', { name }).then(({ data: { id } }) => {
      navigate(`/common-player?id=${id}`)
    })

  const buttonsDisabled = name.length == 0

  return (
    <Container>
      <Message>Welcome to the</Message>
      <Title>Monopoly Machine</Title>
      <Input
        placeholder="Insert your name"
        onChange={({ target: { value } }) => setName(value)}
      />
      {!bankerExistence.current && (
        <Button disabled={buttonsDisabled} onClick={() => createBanker()}>
          Create room
        </Button>
      )}
      <Button disabled={buttonsDisabled} onClick={() => createCommonPlayer()}>
        Enter room
      </Button>
      {bankerExistence.current && (
        <DropButton onClick={() => cleanTable()}>Drop room</DropButton>
      )}
    </Container>
  )
}

export default HomePage
