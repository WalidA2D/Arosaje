import { DataTypes, Model, Optional } from 'sequelize';
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
  acceptedBy: number | null;
  idUser: number;
  plantOrigin: string;
  plantRequirements: string;
  plantType: string;
  image1: string;
  image2: string;
  image3: string;
}

export interface PostCreationAttributes extends Optional<PostAttributes, 'idPosts'> {}

export class PostInstance extends Model<PostAttributes, PostCreationAttributes> {}

PostInstance.init(
  {
    idPosts: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    publishedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
    dateStart: { type: DataTypes.DATE, allowNull: false },
    dateEnd: { type: DataTypes.DATE, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    cityName: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.BOOLEAN, allowNull: false },
    accepted: { type: DataTypes.BOOLEAN, allowNull: true },
    acceptedBy: { type: DataTypes.INTEGER, allowNull: true }, 
    idUser: { type: DataTypes.INTEGER, allowNull: false },
    plantOrigin: { type: DataTypes.STRING, allowNull: false },
    plantRequirements: { type: DataTypes.STRING, allowNull: false },
    plantType: { type: DataTypes.STRING, allowNull: false },
    image1: { type: DataTypes.STRING, allowNull: false},
    image2: { type: DataTypes.STRING, allowNull: false},
    image3: { type: DataTypes.STRING, allowNull: false}
  },
  { sequelize: db, tableName: 'Posts', timestamps: false }
);
