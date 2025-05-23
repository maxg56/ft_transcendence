// frontend/src/hooks/WebSocket/useWaitroomListener.ts
import { useEffect } from "react";
import { useWebSocket } from "@/context/WebSocketContext";
import useNavigation from "@/hooks/useNavigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useTranslation } from "@/context/TranslationContext";

type Player = { name: string; id: string };
type Team = { id: string; players: Player[] };

export const useWaitroomListener = () => {
  const { t } = useTranslation();
  const { dequeueMessage } = useWebSocket();
  const { navigate } = useNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      let message;
      while ((message = dequeueMessage())) {
        // removal from queue
        if (message.type === "matchmaking:removed") {
          toast.error(t("Vous avez été retiré de la file d'attente."));
          navigate("/hub");
          continue;
        }

        // only interested in match_found
        if (message.event !== "match_found") continue;

        const { gameId, format, teamId, teams, positionInTeam } = message;
        if (!format || typeof format.playersPerTeam !== "number") continue;

        // clear old cookies & store new
        Cookies.remove("opponentName"); Cookies.remove("allyName"); Cookies.remove("myName");

        Cookies.set("gameid", gameId);
        Cookies.set("teamId", String(teamId));
        Cookies.set("positionInTeam", String(positionInTeam));

        const myTeam = teams.find((t: Team) => t.id === teamId);
        const oppTeam = teams.find((t: Team) => t.id !== teamId);

        const myName = myTeam?.players[positionInTeam]?.name;
        const myAlly = myTeam?.players.find((p: Player) => p.name !== myName);
        const opponent = oppTeam?.players[0];
        const opponentAlly = oppTeam?.players[1];

        if (opponent) Cookies.set("opponentName", opponent.name || "Unknown");
        if (myAlly) Cookies.set("allyName", myAlly.name || "Unknown");
        if (myName) Cookies.set("myName", myName || "Unknown");
        if (opponentAlly) Cookies.set("opponentAlly", opponentAlly.name || "Unknown");

        // navigate based on team size
        if (format.playersPerTeam === 1) {
          toast.success(t("Match trouvé ! Préparation au duel...")); navigate("/duel3");
        } else if (format.playersPerTeam === 2) {
          toast.success(t("Match trouvé ! Préparation au match par équipe...")); navigate("/wsGame");
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [dequeueMessage, navigate, t]);
};