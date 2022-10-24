import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Title, Button, Message, DropButton } from './styles'
import Loading from '../../components/Loading'
import api from '../../utils/api'

function EnterRoomPage() {
  const [loading, setLoading] = useState(true)
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

  const createBanker = () => {
    api.post('/create-banker').then(({ data: { id } }) => {
      navigate(`/banker?id=${id}`)
    })
  }

  const cleanTable = () => {
    api.delete('/clean').then(() => window.location.reload(true))
  }

  return (
    <Container>
      <Message>Welcome to the</Message>
      <Title>Monopoly Machine</Title>
      {!bankerExistence.current && (
        <Button onClick={() => createBanker()}>Create room</Button>
      )}
      <Button onClick={() => createCommonPlayer()}>Enter room</Button>
      <DropButton onClick={() => cleanTable()}>Exclude rooms</DropButton>
    </Container>
  )
}

export default EnterRoomPage
