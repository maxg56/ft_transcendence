import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class Notification extends Model {
  public id!: number;
  public user_id!: number;
  public type!: string;
  public message!: string;
  public is_read!: boolean;
  public created_at!: Date;
}

Notification.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.STRING(50), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'Notification',
  tableName: 'notifications',
  timestamps: false
});

Notification.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

export default Notification;
