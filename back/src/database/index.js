import { DataSource } from 'typeorm'
import { Player, Transfer } from './entities.js'

export default new DataSource({
	type: 'postgres',
	host: 'postgres',
	port: 5432,
	username: 'postgres',
	password: 'postgrespw',
	synchronize: true,
	entities: [Player, Transfer],
})
