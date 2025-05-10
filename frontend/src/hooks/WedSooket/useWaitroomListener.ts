import { useEffect } from "react";
import { useWebSocket } from "@/context/WebSocketContext";
import useNavigation from "@/hooks/useNavigation";
import Cookies from "js-cookie";

type Player = {
  name: string;
  id: string;
};

type Team = {
  id: string;
  players: Player[];
};

export const useWaitroomListener = () => {
  const { socket } = useWebSocket();
  const { navigate } = useNavigation();

  useEffect(() => {
    if (!(socket instanceof WebSocket)) {
      console.warn("WebSocket non initialisé ou invalide");
      return;
    }

    const setupListeners = () => {
      const handleMessage = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data);
          console.log("Message WebSocket reçu:", message);
          if (message.event !== "match_found") {
            console.warn("Message WebSocket inattendu:", message);
            return;
          }

          const { gameId, format, teamId, teams, positionInTeam } = message;

          if (!format || typeof format.playersPerTeam !== "number") {
            console.warn("Format de jeu invalide:", format);
            return;
          }
          
          // Stockage des infos essentielles
          Cookies.set("gameid", gameId);
          Cookies.set("teamId", String(teamId));
          Cookies.set("positionInTeam", String(positionInTeam));

          const myTeam = teams.find((team: Team) => team.id === teamId);
          const opponentTeam = teams.find((team: Team) => team.id !== teamId);

          const myName = myTeam?.players[Number(positionInTeam)]?.name;
          const myAlly = myTeam?.players.find((p: Player) => p.name !== myName);
          const opponent = opponentTeam?.players[0];

          if (opponent) Cookies.set("opponentName", opponent.name || "Unknown");
          if (myAlly) Cookies.set("allyName", myAlly.name || "Unknown");
          if (myName) Cookies.set("myName", myName.name || "Unknown");

          if (format.playersPerTeam === 1) {
            console.log("1v1 game");
            navigate("/duel3");
          } else if (format.playersPerTeam === 2) {
            console.log("2v2 game");
            navigate("/wsGame");
          }
        } catch (err) {
          console.error("Erreur de parsing WebSocket:", err);
        }
      };

      socket.addEventListener("message", handleMessage);

      return () => {
        socket.removeEventListener("message", handleMessage);
      };
    };

    let cleanup: (() => void) | undefined;

    if (socket.readyState === WebSocket.OPEN) {
      cleanup = setupListeners();
    } else {
      const onOpen = () => {
        cleanup = setupListeners();
        socket.removeEventListener("open", onOpen);
      };
      socket.addEventListener("open", onOpen);

      // Cleanup listener d'ouverture si le composant est démonté avant que la connexion soit établie
      return () => socket.removeEventListener("open", onOpen);
    }

    return cleanup;
  }, [socket, navigate]);
};
