import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';
import { ConversationInstance } from './Conversation';
import { UserInstance } from './User';

export class UsersConversationsInstance extends Model {
  idUserConversation!: number;
  idUser!: number;
  idConversation!: number;

  public readonly Conversation?: ConversationInstance;
  public readonly User?: UserInstance;
}

UsersConversationsInstance.init(
  {
    idUserConversation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    idUser: { type: DataTypes.INTEGER, allowNull: false },
    idConversation: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize: db,
    tableName: 'UsersConversations',
    timestamps: false,
  }
);
