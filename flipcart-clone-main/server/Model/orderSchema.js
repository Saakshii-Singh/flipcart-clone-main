import { DataTypes } from 'sequelize';
import sequelize from '../Connection/db.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  sessionId: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'confirmed',
  },
  address: {
    type: DataTypes.JSON,
    allowNull: false,
  },
}, {
  indexes: [
    { fields: ['sessionId'] },
    { fields: ['userId'] },
  ],
});

export default Order;
