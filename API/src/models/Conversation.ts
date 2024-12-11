import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';

export class ConversationInstance extends Model {
  idConversation!: number;
  dateStart!: Date;
  dateEnd!: Date;
  seen!: boolean;
}

ConversationInstance.init(
  {
    idConversation: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    dateStart: { type: DataTypes.DATE, allowNull: false },
    dateEnd: { type: DataTypes.DATE, allowNull: true },
    seen: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    sequelize: db,
    timestamps: false,
    tableName: 'Conversations',
  }
);