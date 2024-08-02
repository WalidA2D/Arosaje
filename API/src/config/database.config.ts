import { Sequelize } from "sequelize";
import dotenv from "dotenv";
// import { UserInstance } from './user';
// import { PostInstance } from './post';

dotenv.config();

const db = new Sequelize("BASE", "", "", {
  storage: process.env.DATABASE_URL,
  dialect: "sqlite",
  logging: false,
  // models: [UserInstance, PostInstance]
});

export default db;
