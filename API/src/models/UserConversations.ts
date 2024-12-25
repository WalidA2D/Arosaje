import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';
import { UserInstance } from './User';
import { ConversationInstance } from './Conversation';

export class UsersConversationsInstance extends Model {
  idUser!: number;
  idConversation!: number;
}

UsersConversationsInstance.init(
  {
    idUser: { type: DataTypes.INTEGER, primaryKey: true },
    idConversation: { type: DataTypes.INTEGER, primaryKey: true },
  },
  {
    sequelize: db,
    timestamps: false,
    tableName: 'UsersConversations',
  }
);

// // Associations
UsersConversationsInstance.belongsTo(UserInstance, { foreignKey: 'idUser' });
UsersConversationsInstance.belongsTo(ConversationInstance, { foreignKey: 'idConversation' });