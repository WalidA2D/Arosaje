import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';

export class UsersConversationsInstance extends Model {
  idUserConversation!: number;
  idUser!: number;
  idConversation!: number;
}

UsersConversationsInstance.init(
  {
    idUserConversation: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true,autoIncrement: true },
    idUser: { type: DataTypes.INTEGER, allowNull: false },
    idConversation: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize: db,
    timestamps: false,
    tableName: 'UsersConversations',
  }
);