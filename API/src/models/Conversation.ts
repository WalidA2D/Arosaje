import { Model, DataTypes } from 'sequelize';
import db from '../config/database.config';
import { UsersConversationsInstance } from './UserConversations';

export class ConversationInstance extends Model {
  idConversation!: number;
  dateStart!: Date;
  dateEnd!: Date | null;
  seen!: boolean;

  // Propriété readonly pour TypeScript
  public readonly UsersConversations?: UsersConversationsInstance[];
}

ConversationInstance.init(
  {
    idConversation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    dateStart: { type: DataTypes.DATE, allowNull: false },
    dateEnd: { type: DataTypes.DATE, allowNull: true },
    seen: { type: DataTypes.BOOLEAN, allowNull: false },
  },
  {
    sequelize: db,
    tableName: 'Conversations',
    timestamps: false,
  }
);
