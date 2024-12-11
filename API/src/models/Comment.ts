import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';
import { PostInstance } from './Post';
import { UserInstance } from './User';

export class CommentInstance extends Model {
  idComment!: number;
  text!: string;
  note!: boolean;
  publishedAt!: Date;
  idPost!: number;
  idUser!: number;
}

CommentInstance.init(
  {
    idComment: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.STRING(255), allowNull: false },
    note: { type: DataTypes.BOOLEAN, allowNull: false },
    publishedAt: { type: DataTypes.DATE, allowNull: false },
    idPost: { type: DataTypes.INTEGER, allowNull: true },
    idUser: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize: db,
    timestamps: false,
    tableName: 'Comments',
  }
);

// Associations
CommentInstance.belongsTo(PostInstance, { foreignKey: 'idPost' });
CommentInstance.belongsTo(UserInstance, { foreignKey: 'idUser' });