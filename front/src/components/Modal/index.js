import React, { Fragment } from 'react'
import {
	Container,
	AmountToSend,
	Button,
	ErrorMessageWrapper,
	Input,
	Message,
	ErrorMessage,
} from './styles'
import Signal from 'react-loading'
import colors from '../../styles/colors'
import { v4 as uuid } from 'uuid'

const components = {
	input: (placeholder, type, value, onChange, error, errorMessage) => (
		<Fragment>
			<Input
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				type={type}
			/>
			{error && (
				<ErrorMessageWrapper>
					<ErrorMessage>{errorMessage || 'Something is wrong'}</ErrorMessage>
				</ErrorMessageWrapper>
			)}
		</Fragment>
	),
	button: (placeholder, onClick, disabled) => (
		<Button
			onClick={onClick}
			disabled={disabled}
		>
			{placeholder}
		</Button>
	),
}

const getModalComponents = (
	type,
	setState,
	id,
	name,
	currentPlayerId,
	buttonsDisabled,
	amountBiggerThanBalance,
	amountToSend,
	defaultState,
	transfer,
) =>
	({
		playerConfirmation: [],
		playerInput: [
			components.input(
				'How much?',
				'number',
				amountToSend,
				({ target: { value } }) =>
					setState(previousState => ({
						...previousState,
						amountToSend: value,
					})),
				amountBiggerThanBalance,
				'Amount to send bigger than balance you have',
			),
			components.button(
				'Send',
				() =>
					// setState(previousState => ({ ...previousState, confirmation: true })),
					transfer(),
				buttonsDisabled,
			),
			components.button('Cancel', () => {
				const { id, asBank, amountToSend, name } = defaultState
				setState(previousState => ({
					...previousState,
					id,
					asBank,
					amountToSend,
					name,
				}))
			}),
		],
		bankConfirmation: [],
		bankInput: [],
	}[type] || [])

function Modal(props) {
	const {
		transfer,
		transferLoading,
		asBank,
		confirmation,
		id,
		name,
		currentPlayerId,
		currentPlayerAmount,
		setState,
		amountToSend,
		defaultState,
	} = props

	const amountBiggerThanBalance = amountToSend > currentPlayerAmount && !asBank
	const buttonsDisabled = amountBiggerThanBalance || !amountToSend.length

	const getType = () => {
		if (confirmation) {
			if (asBank) {
				return 'bankConfirmation'
			}
			return 'playerConfirmation'
		} else {
			if (asBank) {
				return 'bankInput'
			}
			return 'playerInput'
		}
	}
	const type = getType()
	const components = getModalComponents(
		type,
		setState,
		id,
		name,
		currentPlayerId,
		buttonsDisabled,
		amountBiggerThanBalance,
		amountToSend,
		defaultState,
		transfer,
	)

	return (
		<Container>
			{components.map(component => {
				const Component = () => component

				return <Component key={uuid()} />
			})}
		</Container>
	)
}

export default Modal
