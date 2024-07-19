import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';

export interface UserAttributes {
  idUsers: number;
  lastName: string;
  firstName: string;
  email: string;
  address: string;
  phone: string;
  cityName: string;
  password: string;
  photo: string;
  isBotanist: boolean;
  isAdmin: boolean;
  isBan: boolean;
  note: number;
  uid: string;
}

export class UserInstance extends Model<UserAttributes> {}

UserInstance.init(
  {
    idUsers: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    lastName: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    cityName: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    photo: { type: DataTypes.STRING },
    isBotanist: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isAdmin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isBan: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    note: { type: DataTypes.DECIMAL(5, 2) },
    uid: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }
  },
  { 
    sequelize: db, 
    timestamps: false,
    tableName: 'Users' 
  }
);
