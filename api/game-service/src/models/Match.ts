import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Match extends Model {
  public id!: number;
  public is_pong_game!: boolean;
  public playedAt!: Date;
  public duration_seconds!: number;
}

Match.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    is_pong_game: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    playedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    duration_seconds: {
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
