import db from '../index.js'
import { DataTypes } from 'sequelize'

const Transfer = db.define('Transfer', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  sender: {
    type: DataTypes.STRING,
  },
  receiver: {
    type: DataTypes.STRING,
  },
  amountSent: {
    type: DataTypes.NUMBER,
  },
})

export default Transfer
