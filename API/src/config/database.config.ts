// import { Sequelize } from "sequelize";
// import dotenv from "dotenv";

// dotenv.config();

// const db = new Sequelize("BASE", "", "", {
//   storage: process.env.DATABASE_URL,
//   dialect: "sqlite",
//   logging: false,
// });

// export default db;

// // postgresql://postgres.dxaskejiscxzkjajjziy:DreamTeamMSPR2025@aws-0-eu-west-3.pooler.supabase.com:6543/postgres


import { Sequelize } from 'sequelize';

// Configuration de la connexion à la base de données
const sequelize = new Sequelize(
  'postgresql://postgres.dxaskejiscxzkjajjziy:DreamTeamMSPR2025@aws-0-eu-west-3.pooler.supabase.com:6543/postgres',
  {
    dialect: 'postgres', // Supabase utilise PostgreSQL
    dialectOptions: {
      ssl: {
        require: true, // SSL obligatoire sur Supabase
        rejectUnauthorized: false, // Option nécessaire pour certains certificats SSL auto-signés
      },
    },
    logging: false, // Désactivez les logs SQL (optionnel)
  }
);

export default sequelize
