import { useEffect } from "react";
import { useWebSocket } from "@/context/WebSocketContext";
import useNavigation from "@/hooks/useNavigation";
import Cookies from "js-cookie";

export const useWaitroomListener = () => {
  const socket = useWebSocket();
  const { navigate } = useNavigation();

  useEffect(() => {
    if (!socket) {
      console.error("WebSocket non initialisé");
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);

        if (message.event === "match_found") {
          const { gameId, format, teamId, teams } = message;

          Cookies.set("gameid", gameId);
          Cookies.set("teamId", String(teamId));

          const myTeam = teams.find((team) => team.id === teamId);
          const opponentTeam = teams.find((team) => team.id !== teamId);

          const myName = Cookies.get("username");
          const myAlly = myTeam?.players.find((p) => p.name !== myName);
          const opponent = opponentTeam?.players[0];

          if (opponent) {
            Cookies.set("opponentName", opponent.name || "Unknown");
          }

          if (myAlly) {
            Cookies.set("allyName", myAlly.name || "Unknown");
          }

          if (format.playersPerTeam === 1) {
            console.log("1v1 game");
            navigate("/duel3");
            console.log("Game ID:", gameId);
          }

          console.log("Message de la salle d'attente:", message);
        } else {
          console.warn("Message WebSocket inattendu:", message);
        }
      } catch (err) {
        console.error("Erreur de parsing WebSocket:", err);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket, navigate]);
};
