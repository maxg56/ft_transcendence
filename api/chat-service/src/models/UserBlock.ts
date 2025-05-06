import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class UserBlock extends Model {
  public blocker_id!: number;
  public blocked_id!: number;
}

UserBlock.init({
  blocker_id: { type: DataTypes.INTEGER, primaryKey: true },
  blocked_id: { type: DataTypes.INTEGER, primaryKey: true }
}, {
  sequelize,
  modelName: 'UserBlock',
  tableName: 'user_blocks',
  timestamps: false
});

UserBlock.belongsTo(User, { as: 'Blocker', foreignKey: 'blocker_id', onDelete: 'CASCADE' });
UserBlock.belongsTo(User, { as: 'Blocked', foreignKey: 'blocked_id', onDelete: 'CASCADE' });

export default UserBlock;
