import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  'postgresql://postgres.dxaskejiscxzkjajjziy:DreamTeamMSPR2025@aws-0-eu-west-3.pooler.supabase.com:6543/postgres',
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
    //logging: console.log, retirer le commentaire si vous avez besoin de voir les requetes sql lancer par le serv
  }
);

export default sequelize
