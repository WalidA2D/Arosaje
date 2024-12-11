import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';
import { PostInstance } from './Post';
import { CommentInstance } from './Comment';
import { ConversationInstance } from './Conversation';
import { FavInstance } from './UserFavorites';
import { UsersConversationsInstance } from './UserConversations';

export class UserInstance extends Model {
  // Définir les attributs de l'utilisateur
  idUser!: number;
  lastName!: string;
  firstName!: string;
  email!: string;
  address!: string;
  phone!: string;
  cityName!: string;
  codePostal!: string;
  photo!: string;
  password!: string;
  isBotanist!: boolean;
  isAdmin!: boolean;
  isBan!: boolean;
  note!: number;
  uid!: string;
}

UserInstance.init(
  {
    idUser: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    lastName: { type: DataTypes.STRING(50), allowNull: false },
    firstName: { type: DataTypes.STRING(50), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    address: { type: DataTypes.STRING(255) },
    phone: { type: DataTypes.STRING(25) },
    cityName: { type: DataTypes.STRING(50) },
    codePostal: { type: DataTypes.STRING(5) },
    photo: { type: DataTypes.STRING(255) },
    password: { type: DataTypes.STRING(255) },
    isBotanist: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isAdmin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isBan: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    note: { type: DataTypes.INTEGER },
    uid: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
  },
  {
    sequelize: db,
    timestamps: false,
    tableName: 'Users',
  }
);

// Associations
UserInstance.hasMany(PostInstance, { foreignKey: 'idUser', as: 'posts' });
UserInstance.hasMany(CommentInstance, { foreignKey: 'idUser', as: 'comments' });
UserInstance.belongsToMany(PostInstance, { through: FavInstance, foreignKey: 'idUser', as: 'favorites' });
UserInstance.belongsToMany(ConversationInstance, { through: UsersConversationsInstance, foreignKey: 'idUser', as: 'conversations' });