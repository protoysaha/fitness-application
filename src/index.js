
import dotenv from "dotenv";
import express from "express"
const app = express()
dotenv.config({
  path:'./env'
})
import sequelize from "./config/database.js";
// Database Connection
// mysql  DB connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected via Sequelize");

    await sequelize.sync();


    // await sequelize.sync({ alter: true });
    // await sequelize.sync({ alter: true, logging: console.log });

    // await sequelize.sync({ force: true, logging: console.log });

    console.log("✅ Database synced");

  } catch (err) {
    console.error("❌ DB connection error: " + err.message);
  }
})();