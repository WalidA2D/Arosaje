import { DataTypes, Model, Optional} from "sequelize";
import db from '../config/database.config';

export interface CommentAttributes {
  idComments: number;
  text: string;
  note: number;
  publishedAt: Date;
  idUser: number;
  idPost: number;
}


export interface MessageCreationAttributes extends Optional<CommentAttributes, 'idComments'> {}

export class CommentInstance extends Model<CommentAttributes> {}

CommentInstance.init(
  {
    idComments: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.STRING(1500), allowNull: false },
    note: { type: DataTypes.DECIMAL(5, 2) },
    publishedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, 
    idUser: { type: DataTypes.INTEGER, references: { model: 'Users', key: 'idUsers' } },
    idPost: { type: DataTypes.INTEGER, references: { model: 'Posts', key: 'idPosts' } }
  },
  {
    sequelize: db,
    timestamps: false,
    tableName: 'Comments'
  }
);