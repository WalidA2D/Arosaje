import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/database.config';

interface ImageAttributes {
  idImages: number;
  title: string;
  url: string;
  idPost: number;
}

export interface ImageCreationAttributes extends Optional<ImageAttributes, 'idImages'> {}

export class ImageInstance extends Model<ImageAttributes, ImageCreationAttributes> {}

ImageInstance.init(
  {
    idImages: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    idPost: { type: DataTypes.INTEGER, allowNull: false }
  },
  { sequelize: db, tableName: 'Images', timestamps: false }
);
