import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import ChatGroup from './ChatGroup';

class ChatGroupMember extends Model {
  public group_id!: number;
  public user_id!: number;
}

ChatGroupMember.init({
  group_id: { 
    type: DataTypes.INTEGER,
    primaryKey: true 
},
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true }
}, {
  sequelize,
  modelName: 'ChatGroupMember',
  tableName: 'chat_group_members',
  timestamps: false
});

ChatGroupMember.belongsTo(ChatGroup, { foreignKey: 'group_id', onDelete: 'CASCADE' });
ChatGroupMember.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

export default ChatGroupMember;
