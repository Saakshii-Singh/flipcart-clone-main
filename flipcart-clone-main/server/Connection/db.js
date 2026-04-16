import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";

const databaseName = process.env.DB_NAME;
const useSSL = process.env.DB_SSL === "true";
const mysqlConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ...(useSSL && { ssl: { rejectUnauthorized: false } }),
};

const sequelize = new Sequelize(
  databaseName,
  mysqlConfig.user,
  mysqlConfig.password,
  {
    host: mysqlConfig.host,
    port: mysqlConfig.port,
    dialect: "mysql",
    ...(useSSL && {
      dialectOptions: {
        ssl: { rejectUnauthorized: false },
      },
    }),
  }
);

export const ensureDatabaseExists = async () => {
  if (!databaseName) {
    throw new Error("DB_NAME is not configured in environment variables");
  }

  // Skip CREATE DATABASE for managed services like Aiven where the DB already exists
  if (process.env.DB_SKIP_CREATE === "true") {
    console.log(`Skipping CREATE DATABASE (using existing '${databaseName}')`);
    return;
  }

  const safeDatabaseName = databaseName.replace(/`/g, "");
  const connection = await mysql.createConnection(mysqlConfig);

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${safeDatabaseName}\``);
  } finally {
    await connection.end();
  }
};

export default sequelize;