import { DataTypes } from "sequelize";
import sequelize from "../Connection/db.js";

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  shortTitle: DataTypes.STRING,
  longTitle: DataTypes.STRING(500),
  mrp: DataTypes.INTEGER,
  cost: DataTypes.INTEGER,
  discountPercent: DataTypes.STRING,
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
  },
  description: DataTypes.TEXT,
  extraDiscount: DataTypes.STRING,
  tagline: DataTypes.STRING,
  image: DataTypes.STRING(1000),
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'General',
  },
  brand: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  specifications: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
}, {
  indexes: [
    { fields: ['category'] },
  ],
});

export default Product;