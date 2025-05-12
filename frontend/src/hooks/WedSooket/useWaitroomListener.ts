// frontend/src/hooks/WebSocket/useWaitroomListener.ts
import { useEffect } from "react";
import { useWebSocket } from "@/context/WebSocketContext";
import useNavigation from "@/hooks/useNavigation";
import Cookies from "js-cookie";
import { toast } from "sonner";

type Player = { name: string; id: string };
type Team = { id: string; players: Player[] };

export const useWaitroomListener = () => {
  const { addMessageListener } = useWebSocket();
  const { navigate } = useNavigation();

  useEffect(() => {
    const unsubscribe = addMessageListener((message: any) => {
      // removal from queue
      if (message.type === "matchmaking:removed") {
        toast.error("Vous avez été retiré de la file d'attente.");
        navigate("/hub");
        return;
      }

      // only interested in match_found
      if (message.event !== "match_found") return;

      const { gameId, format, teamId, teams, positionInTeam } = message;
      if (!format || typeof format.playersPerTeam !== "number") return;

      // clear old cookies & store new
      Cookies.remove("opponentName");
      Cookies.remove("allyName");
      Cookies.remove("myName");

      Cookies.set("gameid", gameId);
      Cookies.set("teamId", String(teamId));
      Cookies.set("positionInTeam", String(positionInTeam));

      const myTeam = teams.find((t: Team) => t.id === teamId);
      const oppTeam = teams.find((t: Team) => t.id !== teamId);

      const myName = myTeam?.players[positionInTeam]?.name;
      const myAlly = myTeam?.players.find((p: Player) => p.name !== myName);
      const opponent = oppTeam?.players[0];

      if (opponent) Cookies.set("opponentName", opponent.name || "Unknown");
      if (myAlly)   Cookies.set("allyName",    myAlly.name || "Unknown");
      if (myName)   Cookies.set("myName",     myName    || "Unknown");

      // navigate based on team size
      if (format.playersPerTeam === 1) {
        toast.success("Match trouvé ! Préparation au duel...");
        navigate("/duel3");
      } else if (format.playersPerTeam === 2) {
        toast.success("Match trouvé ! Préparation au match par équipe...");
        navigate("/wsGame");
      }
    });

    return unsubscribe;
  }, [addMessageListener, navigate]);
};