import { EntitySchema } from 'typeorm'

export const Player = new EntitySchema({
	name: 'Player',
	columns: {
		id: {
			primary: true,
			type: 'varchar',
		},
		name: {
			type: 'varchar',
		},
		amount: {
			type: 'bigint',
		},
		banker: {
			type: 'boolean',
		},
	},
})

export const Transfer = new EntitySchema({
	name: 'Transfer',
	columns: {
		id: {
			primary: true,
			type: 'varchar',
		},
		sender: {
			type: 'varchar',
		},
		receiver: {
			type: 'varchar',
		},
		amountSent: {
			type: 'bigint',
		},
	},
})
