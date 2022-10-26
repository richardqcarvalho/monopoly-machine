import { Sequelize } from 'sequelize'

const db = new Sequelize({
  dialect: 'sqlite',
  storage: './src/database/db.sqlite',
})

export default db
