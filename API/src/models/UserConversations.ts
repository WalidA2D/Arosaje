import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';

export class UsersConversationsInstance extends Model {
  idUser!: number;
  idConversation!: number;
}

UsersConversationsInstance.init(
  {
    idUser: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    idConversation: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  },
  {
    sequelize: db,
    timestamps: false,
    tableName: 'UsersConversations',
  }
);