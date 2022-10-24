import React from 'react'
import { Container } from './styles'
import Signal from 'react-loading'

function Loading() {
  return (
    <Container>
      <Signal type="spin" />
    </Container>
  )
}

export default Loading
