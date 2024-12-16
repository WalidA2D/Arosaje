import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';
import { UserInstance } from './User';
import { ConversationInstance } from './Conversation';

export class MessageInstance extends Model {
  idMessage!: number;
  text!: string;
  publishedAt!: Date;
  idUser!: number;
  idConversation!: number;
}

MessageInstance.init(
  {
    idMessage: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.STRING(255), allowNull: false },
    publishedAt: { type: DataTypes.DATE, allowNull: false },
    idUser: { type: DataTypes.INTEGER, allowNull: true },
    idConversation: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize: db,
    timestamps: false,
    tableName: 'Messages',
  }
);

// // Associations
// MessageInstance.belongsTo(UserInstance, { foreignKey: 'idUser' });
// MessageInstance.belongsTo(ConversationInstance, { foreignKey: 'idConversation' });