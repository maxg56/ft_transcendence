import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

class Friendship extends Model {
  public user1!: number;
  public user2!: number;
  public status!: "pending" | "accepted" | "blocked";
}

Friendship.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    user2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "blocked"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    tableName: "friends",
    timestamps: false,
  }
);

// Définition des relations
User.belongsToMany(User, {
  through: Friendship,
  as: "friends",
  foreignKey: "user1",
  otherKey: "user2",
});

Friendship.belongsTo(User, {
  as: "userOne",
  foreignKey: "user1",
});

Friendship.belongsTo(User, {
  as: "userTwo",
  foreignKey: "user2",
});


export default Friendship;
