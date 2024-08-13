import { DataTypes, Model, Optional } from "sequelize";
import db from '../config/database.config';

export interface ConvAttributes {
  idConversations: number;
  dateStart: Date;
  dateEnd: Date;
  seen: number;
  idUser1: number;
  idUser2: number;
}

export interface ConvCreationAttributes extends Optional<ConvAttributes, 'idConversations'> {}

export class ConvInstance extends Model<ConvAttributes> {}

ConvInstance.init(
  {
    idConversations: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    dateStart: { type: DataTypes.DATE, allowNull: true },
    dateEnd: { type: DataTypes.DATE, allowNull: true },
    seen: { type: DataTypes.INTEGER, allowNull: false }, 
    idUser1: { type: DataTypes.INTEGER, references: { model: 'Users', key: 'idUsers' }, allowNull: false },
    idUser2: { type: DataTypes.INTEGER, references: { model: 'Users', key: 'idUsers' }, allowNull: false }
  },
  {
    sequelize: db,
    timestamps: false,
    tableName: 'Conversations'
  }
);