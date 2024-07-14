import { Sequelize } from "sequelize";
import dotenv from "dotenv"

dotenv.config()

const db = new Sequelize('BASE', '', '', {
    storage: process.env.DATABASE_URL,
    dialect: "sqlite",
    logging: false,
});

export default db;
