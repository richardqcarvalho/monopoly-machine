import db from '../index.js'
import { DataTypes } from 'sequelize'

const Player = db.define('Player', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  amount: {
    type: DataTypes.NUMBER,
  },
  banker: {
    type: DataTypes.BOOLEAN,
  },
})

export default Player
