import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import ChatGroup from './ChatGroup';

class MutedUser extends Model {
  public user_id!: number;
  public group_id!: number;
  public muted_until!: Date;
}

MutedUser.init({
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  group_id: { type: DataTypes.INTEGER, allowNull: false },
  muted_until: { type: DataTypes.DATE, allowNull: false },
}, {
  sequelize,
  modelName: 'MutedUser',
  tableName: 'muted_users',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'group_id'], // composite primary key
    },
  ]
});

MutedUser.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
MutedUser.belongsTo(ChatGroup, { foreignKey: 'group_id', onDelete: 'CASCADE' });

export default MutedUser;
