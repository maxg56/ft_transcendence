import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class ChatGroup extends Model {
  public id!: number;
  public name!: string;
  public owner_id!: number;
  public created_at!: Date;
}

ChatGroup.init({
    id: { 
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true 
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false 
    },
    owner_id:{ 
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'ChatGroup',
    tableName: 'chat_groups',
    timestamps: false,
    underscored: true,
     
});

ChatGroup.belongsTo(User, 
    { 
        foreignKey: 'owner_id',
        onDelete: 'CASCADE' 
    });

export default ChatGroup;
