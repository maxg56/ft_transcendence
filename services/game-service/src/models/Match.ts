import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Match extends Model {
  public id!: number;
  public isPongGame!: boolean;
  public playedAt!: Date;
  public durationSeconds!: number;
}

Match.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isPongGame: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    playedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    durationSeconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "matches",
    timestamps: false,
  }
);

export default Match;
