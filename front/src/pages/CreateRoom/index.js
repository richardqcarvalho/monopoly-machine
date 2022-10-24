import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Title, Button, Message, DropButton, Input } from './styles'
import Loading from '../../components/Loading'
import api from '../../utils/api'

function CreateRoomPage() {
  const navigate = useNavigate()

  const createBanker = () => {
    api.post('/create-banker').then(({ data: { id } }) => {
      navigate(`/banker?id=${id}`)
    })
  }

  return (
    <Container>
      {/* <Message>Welcome to the</Message>
      <Title>Monopoly Machine</Title> */}
      <Input placeholder="Insert your name" />
      <Button onClick={() => createCommonPlayer()}>Save</Button>
    </Container>
  )
}

export default CreateRoomPage
