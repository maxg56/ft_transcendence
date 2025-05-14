import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class Message extends Model {
  public id!: number;
  public sender_id!: number;
  public channel_type!: 'public' | 'private' | 'group';
  public channel_id!: number;
  public content!: string;
  public created_at!: Date;
}

Message.init({
    id: { 
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true 
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    channel_type: {
        type: DataTypes.ENUM('public', 'private', 'group'),
        allowNull: false 
    },
    channel_id: { 
        type: DataTypes.INTEGER,
        allowNull: false 
    },
    content: { 
        type: DataTypes.STRING(500),
        allowNull: false 
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
  sequelize,
  modelName: 'Message',
  tableName: 'messages',
  timestamps: false
});

Message.belongsTo(User, { foreignKey: 'sender_id', onDelete: 'CASCADE' });

export default Message;
