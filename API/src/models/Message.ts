import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/database.config';

interface MessageAttributes {
  idMessages: number;
  text: string;
  publishedAt: Date;
  idConversation: number | null;
  idUser: number;
  file: string;
}

export interface MessageCreationAttributes extends Optional<MessageAttributes, 'idMessages'> {}

export class MessageInstance extends Model<MessageAttributes, MessageCreationAttributes> {}

MessageInstance.init(
  {
    idMessages: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.STRING, allowNull: false },
    publishedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
    idConversation: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Conversations', key: 'idConversations' } },
    idUser: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'idUsers' } },
    file: { type:DataTypes.STRING, allowNull: true }
  },
  { sequelize: db, tableName: 'Messages', timestamps: false }
);
