import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Title, Button, Message, DropButton, Input } from './styles'
import Loading from '../../components/Loading'
import api from '../../utils/api'
import { getURL } from '../../utils'
import io from 'socket.io-client'

function HomePage() {
	const navigate = useNavigate()
	const [bankerExistence, setBankerExistence] = useState(false)
	const [loading, setLoading] = useState(true)
	const [name, setName] = useState('')

	useEffect(() => {
		const socket = io(getURL())

		api.get('banker').then(({ data: { bankerExists } }) => {
			socket.on('updatePage', bankerExistence =>
				setBankerExistence(bankerExistence),
			)
			socket.connect()

			setBankerExistence(bankerExists)

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

	const cleanTable = () => api.delete('/clean')

	const createBanker = () =>
		api
			.post('/create-banker', { name })
			.then(({ data: { id } }) => navigate(`/banker?id=${id}`))

	const createCommonPlayer = () =>
		api
			.post('/create-common-player', { name })
			.then(({ data: { id } }) => navigate(`/common-player?id=${id}`))

	const buttonsDisabled = name.length == 0

	return (
		<Container>
			<Message>Welcome to the</Message>
			<Title>Monopoly Machine</Title>
			<Input
				placeholder='Insert your name'
				onChange={({ target: { value } }) => setName(value)}
			/>
			{bankerExistence ? (
				<Button
					disabled={buttonsDisabled}
					onClick={() => createCommonPlayer()}
				>
					Enter room
				</Button>
			) : (
				<Button
					disabled={buttonsDisabled}
					onClick={() => createBanker()}
				>
					Create room
				</Button>
			)}
			{bankerExistence && (
				<DropButton onClick={() => cleanTable()}>Drop room</DropButton>
			)}
		</Container>
	)
}

export default HomePage
