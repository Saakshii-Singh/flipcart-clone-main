import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';

import sequelize, { ensureDatabaseExists } from './Connection/db.js';
import DefaultData from './default.js';
import Routes from './Routes/route.js';



const app = express();
const PORT = Number(process.env.PORT || 8000);
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN || 'http://localhost:8080')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_secret_change_me';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const ENABLE_PRODUCT_SEED = process.env.ENABLE_PRODUCT_SEED === 'true';
const SESSION_COOKIE_MAX_AGE = Number(process.env.SESSION_COOKIE_MAX_AGE || 7 * 24 * 60 * 60 * 1000);
import session from "express-session";

app.set('trust proxy', 1);

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? 'none' : 'lax',
    maxAge: SESSION_COOKIE_MAX_AGE,
  }
}));
// 🔹 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: CLIENT_ORIGINS.length === 1 ? CLIENT_ORIGINS[0] : CLIENT_ORIGINS,
  credentials: true,
}));

// 🔹 Routes
app.use('/', Routes);

// 🔹 DB Connection (MySQL)
ensureDatabaseExists()
  .then(() => sequelize.sync({ alter: true }))
  .then(() => {
    console.log("MySQL Connected ✅");

    // Insert data only after DB connects
    if (ENABLE_PRODUCT_SEED) {
      DefaultData();
    }
  })
  .catch((error) => {
    console.log("DB Error ❌", error);
  });

// 🔹 Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
