import { DataTypes, Model } from "sequelize";
import db from '../config/database.config';

export interface FavAttributes {
  idFavorites: number;
  idUser: number;
  idPost: number;
}

export class FavInstance extends Model<FavAttributes> {}

FavInstance.init(
  {
    idFavorites: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idUser: { type: DataTypes.INTEGER, references: { model: 'Users', key: 'idUsers' } },
    idPost: { type: DataTypes.INTEGER, references: { model: 'Posts', key: 'idPosts' } }
  },
  {
    sequelize: db,
    timestamps: false,
    tableName: 'Favorites'
  }
);