import { DataTypes, Model, Optional } from "sequelize";
import db from '../config/database.config';

export interface FavAttributes {
  idFavorites: number;
  idUser: number;
  idPost: number;
}

export interface FavCreationAttributes extends Optional<FavAttributes, 'idFavorites'> {}

export class FavInstance extends Model<FavCreationAttributes, FavCreationAttributes> {}

FavInstance.init(
  {
    idFavorites: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idUser: { type: DataTypes.INTEGER, references: { model: 'Users', key: 'idUser' } },
    idPost: { type: DataTypes.INTEGER, references: { model: 'Posts', key: 'idPosts' } }
  },
  {
    sequelize: db,
    timestamps: false,
    tableName: 'Favorites'
  }
);