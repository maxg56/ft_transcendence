import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database'; // Import correct

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public avatar!: string | null;
  public twoFA_enabled!: boolean;
  public twoFA_secret!: string | null;
  public elo!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    twoFA_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    twoFA_secret: {
      type: DataTypes.STRING(32),
      allowNull: true,
      defaultValue: null,
    },
    elo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1000,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'user',
    timestamps: false,
  }
);

export default User;

