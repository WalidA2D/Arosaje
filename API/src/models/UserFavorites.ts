import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';
import { UserInstance } from './User';
import { PostInstance } from './Post';

export class FavInstance extends Model {
  idUser!: number;
  idPost!: number;
}

FavInstance.init(
  {
    idUser: { type: DataTypes.INTEGER, primaryKey: true },
    idPost: { type: DataTypes.INTEGER, primaryKey: true },
  },
  {
    sequelize: db,
    timestamps: false,
    tableName: 'UsersFavorites',
  }
);

// // Associations
// FavInstance.belongsTo(UserInstance, { foreignKey: 'idUser' });
// FavInstance.belongsTo(PostInstance, { foreignKey: 'idPost' });