import React from 'react'
import { Container } from './styles'
import Signal from 'react-loading'
import colors from '../../styles/colors'

function Loading({ type = 'default' }) {
  return (
    <Container
      style={{ ...(type == 'danger' && { backgroundColor: colors.danger }) }}
    >
      <Signal type="spin" color={colors.contrast} />
    </Container>
  )
}

export default Loading
