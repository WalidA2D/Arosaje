import { DataTypes, Model, Optional } from "sequelize";
import db from '../config/database.config';

interface PostAttributes {
  idPosts: number;
  title: string;
  description: string;
  publishedAt: Date;
  dateStart: Date;
  dateEnd: Date;
  address: string;
  cityName: string;
  state: boolean;
  accepted: boolean;
  acceptedBy: number;
  idUser: number;
  idPlant: number;
}

export interface PostCreationAttributes extends Optional<PostAttributes, 'idPosts'> {}

export class PostInstance extends Model<PostAttributes, PostCreationAttributes> {}

PostInstance.init(
  {
    idPosts: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    publishedAt: { type: DataTypes.DATE, allowNull: false },
    dateStart: { type: DataTypes.DATE, allowNull: false },
    dateEnd: { type: DataTypes.DATE, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    cityName: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.BOOLEAN, allowNull: false },
    accepted: { type: DataTypes.BOOLEAN, allowNull: false },
    acceptedBy: { type: DataTypes.INTEGER, allowNull: false },
    idUser: { type: DataTypes.INTEGER, allowNull: false },
    idPlant: { type: DataTypes.INTEGER, allowNull: false }
  },
  { sequelize: db, tableName: 'Posts', timestamps: false }
);
