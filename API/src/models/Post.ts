import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';
import { UserInstance } from './User';
import { CommentInstance } from './Comment';
import { FavInstance } from './UserFavorites';

export class PostInstance extends Model {
  idPost!: number;
  title!: string;
  description!: string;
  publishedAt!: Date;
  dateStart!: Date;
  dateEnd!: Date;
  address!: string;
  postalCode!: string;
  cityName!: string;
  state!: boolean;
  plant!: string;
  image!: string;
  idUser!: number;
  idUserAssigned!: number;
}

PostInstance.init(
  {
    idPost: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(50), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    publishedAt: { type: DataTypes.DATE, allowNull: false },
    dateStart: { type: DataTypes.DATE, allowNull: false },
    dateEnd: { type: DataTypes.DATE, allowNull: false },
    address: { type: DataTypes.STRING(250) },
    postalCode: { type: DataTypes.STRING(5) },
    cityName: { type: DataTypes.STRING(50) },
    state: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    plant: { type: DataTypes.STRING(50), allowNull: false },
    image: { type: DataTypes.STRING(255) },
    idUser: { type: DataTypes.INTEGER, allowNull: true },
    idUserAssigned: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize: db,
    timestamps: false,
    tableName: 'Posts',
  }
);

// // Associations
//PostInstance.belongsTo(UserInstance, { foreignKey: 'idUser' });
//PostInstance.hasMany(CommentInstance, { foreignKey: 'idPost', as: 'comments' });
//PostInstance.belongsToMany(UserInstance, { through: FavInstance, foreignKey: 'idPost', as: 'users' });
