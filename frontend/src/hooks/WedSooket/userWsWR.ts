import { useState, useEffect } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '@/context/WebSocketContext';
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useTranslation } from "@/context/TranslationContext";

type Players = {
  name: string;
  id: string;
};

type Team = {
  id: string;
  players: Players[];
};
export type Player = {
  isHost: boolean;
  username: string;
  avatar: string | null;
};

export const useWaitroomListener = () => {
  const { t } = useTranslation();
  const { addMessageListener } = useWebSocket();
  const navigate = useNavigate();
  const [code, setCode] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const unsubscribe = addMessageListener((message: any) => {
      const { event, data} = message;
      const { player } = data;
      console.log(message) // log global supprimé pour éviter les doublons
      switch (event) {
        case 'tournament_created':
        case 'private_game_created':
          unstable_batchedUpdates(() => {
            setCode(data.gameCode || "");
            setPlayers([{
              isHost: true,
              username: player.username || '',
              avatar: player.avatar || `https://robohash.org/${player.username || 'host'}`,
            }]);
          });
          break;
        case 'new_player_joined':

          unstable_batchedUpdates(() => {
            setPlayers(prev => {
              // ne pas ajouter en double
              const name = player.username || '';
              if (prev.some(p => p.username === name)) {
                return prev;
              }
              return [
                ...prev,
                {
                  isHost: false,
                  username: name,
                  avatar: player.avatar || `https://robohash.org/${name || 'guest'}`,
                }
              ];
            });
          });
          break;
        case 'joined_game':
          unstable_batchedUpdates(() => {
            setCode(data.gameCode || "");
            const list: any[] = data.players || data.existingPlayers || [];
            setPlayers(
              list.map(p => ({
                isHost: p.isHost,
                username: p.username,
                avatar: p.avatar || `https://robohash.org/${p.username}`,
              }))
            );
          });
          break;
        case 'match_found':
          const { gameId, format, teamId, teams, positionInTeam } = data;

          if (!format || typeof format.playersPerTeam !== "number") {
            return;
          }
          
          Cookies.remove("opponentName");
          Cookies.remove("allyName");
          Cookies.remove("myName");
          // Stockage des infos essentielles
          Cookies.set("gameid", gameId);
          Cookies.set("teamId", String(teamId));
          Cookies.set("positionInTeam", String(positionInTeam));

          const myTeam = teams.find((team: Team) => team.id === teamId);
          const opponentTeam = teams.find((team: Team) => team.id !== teamId);

          const myName = myTeam?.players[Number(positionInTeam)]?.name;
          const myAlly = myTeam?.players.find((p: Players) => p.name !== myName);
          const opponent = opponentTeam?.players[0];

          if (opponent) Cookies.set("opponentName", opponent.name || "Unknown");
          if (myAlly) Cookies.set("allyName", myAlly.name || "Unknown");
          if (myName) Cookies.set("myName", myName || "Unknown");

          if (format.playersPerTeam === 1) {
            toast.success(t("Match trouvé ! Préparation au duel..."));
            navigate("/duel3");
          } else if (format.playersPerTeam === 2) {
            toast.success(t("Match trouvé ! Préparation au match par équipe..."));
            navigate("/wsGame");
          }
          break;
        default:
          break;
      }
    });

    return () => unsubscribe();
  }, [addMessageListener]);

  return { code, players };
};
