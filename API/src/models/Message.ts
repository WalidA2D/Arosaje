import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/database.config';

interface MessageAttributes {
  idMessages: number;
  text: string;
  publishedAt: Date;
  idConversation: number | null;
  idUser: number;
}

export interface MessageCreationAttributes extends Optional<MessageAttributes, 'idMessages'> {}

export class MessageInstance extends Model<MessageAttributes, MessageCreationAttributes> {}

MessageInstance.init(
  {
    idMessages: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.STRING, allowNull: false },
    publishedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
    idConversation: { type: DataTypes.INTEGER, allowNull: false },
    idUser: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize: db, tableName: 'Messages', timestamps: false }
);
