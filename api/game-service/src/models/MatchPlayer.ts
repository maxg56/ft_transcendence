import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Match from "./Match";
import User from "./User";

class MatchPlayer extends Model {
  public match_id!: number;
  public player_id!: number;
  public score!: number;
}

MatchPlayer.init(
  {
    match_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Match,
        key: "id",
      },
    },
    player_id : {
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
Match.belongsToMany(User, { through: MatchPlayer, foreignKey: "match_id" });
User.belongsToMany(Match, { through: MatchPlayer, foreignKey: "player_id" });

export default MatchPlayer;
