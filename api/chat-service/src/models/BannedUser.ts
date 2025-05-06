import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class BannedUser extends Model {
  public user_id!: number;
  public banned_until!: Date;
  public reason!: string | null;
}

BannedUser.init({
  user_id: { type: DataTypes.INTEGER, primaryKey: true },
  banned_until: { type: DataTypes.DATE, allowNull: false },
  reason: { type: DataTypes.TEXT, allowNull: true }
}, {
  sequelize,
  modelName: 'BannedUser',
  tableName: 'banned_users',
  timestamps: false
});

BannedUser.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

export default BannedUser;
