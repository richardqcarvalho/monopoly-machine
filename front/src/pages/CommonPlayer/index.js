import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import Loading from '../../components/Loading'
import colors from '../../styles/colors'
import { getQueryParams, getURL } from '../../utils'
import api from '../../utils/api'
import {
	AmountToSend,
	Button,
	Card,
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

const DEFAULT_STATE = {
	id: null,
	loading: false,
	confirmation: false,
	name: '',
}

function CommonPlayerPage() {
	const navigate = useNavigate()
	const { id } = getQueryParams(window.location.href)
	const transfersContainerRef = useRef()
	const [loading, setLoading] = useState(true)
	const [amount, setAmount] = useState(0)
	const [players, setPlayers] = useState([])
	const [inTransfer, setInTransfer] = useState(DEFAULT_STATE)
	const [playerName, setPlayerName] = useState('')
	const [amountToSend, setAmountToSend] = useState(null)
	const [transfers, setTransfers] = useState([])

	useEffect(() => {
		const socket = io(getURL())

		api
			.get(`common-player/${id}`)
			.then(({ data: { name, amount, players, transfers } }) => {
				socket.on('updateInfo', players => {
					setPlayers([
						...players.filter(({ id: playerId }) => id != playerId),
						{ id: 'bank', name: 'Bank' },
					])
					const { amount } = players.find(({ id: playerId }) => id == playerId)
					setAmount(parseInt(amount))
				})
				socket.on('newTransfer', transfers => setTransfers(transfers))
				socket.on('bankerDropped', () => navigate('/'))
				socket.on('passBank', newBankerId => {
					if (newBankerId == id) navigate(`/banker?id=${id}`)
				})
				socket.connect()

				setAmount(parseInt(amount))
				setPlayerName(name)
				setPlayers([
					...players.filter(({ id: playerId }) => id != playerId),
					{ id: 'bank', name: 'Bank' },
				])
				setTransfers(transfers)
				setLoading(false)
			})
			.catch(() => navigate('/'))

		return () => {
			socket.off('updateInfo')
			socket.off('updateAmounts')
			socket.off('newTransfer')
			socket.off('bankerDropped')
			socket.off('passBank')
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
			.post(`transfer/${id}/${inTransfer.id}`, {
				howMuch: amountToSend,
			})
			.then(() => {
				setInTransfer(DEFAULT_STATE)
				setAmountToSend(null)
			})
	}

	const giveUp = () => {
		api.delete(`/exit/${id}`).then(() => navigate('/'))
	}

	const amountBiggerThanBalance = amountToSend > amount
	const buttonsDisabled =
		amountToSend == 0 || amountBiggerThanBalance || amountToSend == null

	return (
		<Container>
			<Title>{`${playerName}`}</Title>
			<Message>
				{amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
			</Message>
			{inTransfer.id && (
				<TransferConfirmation
					style={{
						...(inTransfer.id == 'bank' && { backgroundColor: colors.danger }),
					}}
				>
					{inTransfer.loading ? (
						<Loading type={inTransfer.id == 'bank' ? 'danger' : 'default'} />
					) : inTransfer.confirmation ? (
						<Fragment>
							<Message>{`You will send to ${
								inTransfer.name || 'Bank'
							}`}</Message>
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
								style={{
									...(inTransfer.id == 'bank' && { color: colors.danger }),
								}}
							>
								Cancel
							</Button>
						</Fragment>
					) : (
						<Fragment>
							<Input
								placeholder='How much?'
								style={{
									...(inTransfer.id == 'bank' && { color: colors.danger }),
								}}
								onChange={({ target: { value } }) =>
									setAmountToSend(value == '' ? null : parseInt(value))
								}
								value={amountToSend}
								type='number'
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
								style={{
									...(inTransfer.id == 'bank' && { color: colors.danger }),
								}}
								disabled={buttonsDisabled}
							>
								Send
							</Button>
							<Button
								onClick={() => {
									setInTransfer(DEFAULT_STATE)
									setAmountToSend(null)
								}}
								style={{
									...(inTransfer.id == 'bank' && { color: colors.danger }),
								}}
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
							onClick={() => setInTransfer({ ...inTransfer, id, name })}
						>
							{id == 'bank' ? 'Pay' : 'Transfer'}
						</Button>
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
						>{`${sender} -> ${receiver} | ${parseInt(amountSent).toLocaleString(
							'pt-BR',
							{
								style: 'currency',
								currency: 'BRL',
							},
						)}`}</Transfers>
					))}
				</TransfersContainer>
			)}
			<DropButton onClick={() => giveUp()}>Give up</DropButton>
		</Container>
	)
}

export default CommonPlayerPage
