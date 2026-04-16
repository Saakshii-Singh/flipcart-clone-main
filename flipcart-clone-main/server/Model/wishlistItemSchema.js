import { DataTypes } from 'sequelize';
import sequelize from '../Connection/db.js';

const WishlistItem = sequelize.define('WishlistItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
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
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  indexes: [
    { fields: ['sessionId'] },
    { fields: ['userId'] },
    { unique: true, fields: ['sessionId', 'productId'] },
  ],
});

export default WishlistItem;
