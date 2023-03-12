import React from 'react'
import { Container, Button, Message, PlayersAmount } from './styles'
import buttonTypes from '../../styles/button_types'
import { v4 as uuid } from 'uuid'

const getButtonsArray = (
  type,
  setState,
  passBank,
  id,
  name,
  currentPlayerId,
  currentPlayerName
) =>
  ({
    bankerToBank: [
      {
        label: 'Pay to bank',
        onClick: () =>
          setState(previousState => ({
            ...previousState,
            id,
            asBank: false,
            name,
          })),
        buttonType: buttonTypes.types.terciary,
      },
      {
        label: 'Receive from bank',
        onClick: () =>
          setState(previousState => ({
            ...previousState,
            id: currentPlayerId,
            asBank: true,
            name: currentPlayerName,
          })),
        buttonType: buttonTypes.types.terciary,
      },
    ],
    bankerToPlayer: [
      {
        label: 'Transfer as me',
        onClick: () =>
          setState(previousState => ({
            ...previousState,
            id,
            asBank: false,
            name,
          })),
        buttonType: buttonTypes.types.primary,
      },
      {
        label: 'Transfer as bank',
        onClick: () =>
          setState(previousState => ({
            ...previousState,
            id,
            asBank: true,
            name,
          })),
        buttonType: buttonTypes.types.primary,
      },
      {
        label: 'Pass bank',
        onClick: () => passBank(id),
        buttonType: buttonTypes.types.secondary,
      },
    ],
    playerToPlayer: [
      {
        label: 'Transfer',
        onClick: () =>
          setState(previousState => ({
            ...previousState,
            id,
            asBank: false,
            name,
          })),
        buttonType: buttonTypes.types.primary,
      },
    ],
    playerToBank: [
      {
        label: 'Pay',
        onClick: () =>
          setState(previousState => ({
            ...previousState,
            id,
            asBank: false,
            name,
          })),
        buttonType: buttonTypes.types.terciary,
      },
    ],
  }[type] || [])

function Card(props) {
  const {
    setState,
    passBank,
    id,
    name,
    amount,
    banker,
    currentPlayerId,
    currentPlayerName,
  } = props

  const getType = () => {
    if (banker) {
      if (name == 'Bank') {
        return 'bankerToBank'
      } else {
        return 'bankerToPlayer'
      }
    } else {
      if (name == 'Bank') {
        return 'playerToBank'
      } else {
        return 'playerToPlayer'
      }
    }
  }

  const type = getType()
  const buttons = getButtonsArray(
    type,
    setState,
    passBank,
    id,
    name,
    currentPlayerId,
    currentPlayerName
  )

  return (
    <Container toBank={name == 'Bank'}>
      <Message>{name}</Message>
      {amount != null && (
        <PlayersAmount>
          {parseInt(amount).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </PlayersAmount>
      )}
      {buttons.map(({ label, onClick, buttonType }) => (
        <Button
          key={uuid()}
          id={label}
          color={buttonTypes.models[buttonType].color}
          backgroundColor={buttonTypes.models[buttonType].backgroundColor}
          onClick={onClick}
        >
          {label}
        </Button>
      ))}
    </Container>
  )
}

export default Card
