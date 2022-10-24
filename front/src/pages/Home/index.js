import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Title, Button, Message, DropButton, Input } from './styles'
import Loading from '../../components/Loading'
import api from '../../utils/api'

function HomePage() {
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const bankerExistence = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('banker').then(({ data: { bankerExists } }) => {
      bankerExistence.current = bankerExists
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <Loading />
  }

  const cleanTable = () =>
    api.delete('/clean').then(() => window.location.reload(true))

  const createBanker = () => {
    api.post('/create-banker', { name }).then(({ data: { id } }) => {
      navigate(`/banker?id=${id}`)
    })
  }

  const createCommonPlayer = () => {
    api.post('/create-common-player', { name }).then(({ data: { id } }) => {
      navigate(`/common-player?id=${id}`)
    })
  }

  return (
    <Container>
      <Message>Welcome to the</Message>
      <Title>Monopoly Machine</Title>
      <Input
        placeholder="Insert your name"
        onChange={({ target: { value } }) => setName(value)}
      />
      {!bankerExistence.current && (
        <Button onClick={() => createBanker()}>Create room</Button>
      )}
      <Button onClick={() => createCommonPlayer()}>Enter room</Button>
      <DropButton onClick={() => cleanTable()}>Drop room</DropButton>
    </Container>
  )
}

export default HomePage
