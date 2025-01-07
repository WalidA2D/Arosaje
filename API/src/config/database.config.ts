import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  'postgresql://postgres.dxaskejiscxzkjajjziy:DreamTeamMSPR2025@aws-0-eu-west-3.pooler.supabase.com:5432/postgres?pgbouncer=true',
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  }
);

export default sequelize
