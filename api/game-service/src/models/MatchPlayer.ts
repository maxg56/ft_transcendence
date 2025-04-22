import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Match from "./Match";
import User from "./User";

class MatchPlayer extends Model {
  public matchId!: number;
  public playerId!: number;
  public score!: number;
}

MatchPlayer.init(
  {
    matchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Match,
        key: "id",
      },
    },
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    elo_change: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    winner: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "match_players",
    timestamps: false,
  }
);

// Définition des relations
Match.belongsToMany(User, { through: MatchPlayer, foreignKey: "matchId" });
User.belongsToMany(Match, { through: MatchPlayer, foreignKey: "playerId" });

export default MatchPlayer;
