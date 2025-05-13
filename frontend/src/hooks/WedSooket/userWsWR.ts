import { useEffect } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "@/context/WebSocketContext";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useWaitroomStore } from "@/store/useWaitroomStore";
import { Player, Players, Team } from "@/types/WF"; // si tu les as

export const useWaitroomListener = (myId?: string, player?: Player) => {
  const { addMessageListener } = useWebSocket();
  const navigate = useNavigate();

  const {
    code,
    players,
    isTournament,
    setCode,
    setPlayers,
    setIsTournament,
    setTournamentStatus,
    setMatches,
    setLastResults,
    setRanking,
    matches,
    lastResults,
  } = useWaitroomStore();

  useEffect(() => {
    const unsubscribe = addMessageListener(({ event, data }) => {
      if (event !== "game_state")
        console.log("📶 WS event:", event, data);
      if (!event) return;

      const playerData = data?.player;

      switch (event) {
        case "tournament_created":
          unstable_batchedUpdates(() => {
            setIsTournament(true);
            setCode(data.gameCode || data.gameId || "");
            setPlayers([
              {
                isHost: true,
                username: playerData?.username || "",
                avatar: playerData?.avatar || `https://robohash.org/${playerData?.username || "host"}`,
              },
            ]);
          });
          break;

        case "private_game_created":
          unstable_batchedUpdates(() => {
            setIsTournament(false);
            setCode(data.gameId || data.gameCode || "");
            setPlayers([
              {
                isHost: true,
                username: playerData?.username || "",
                avatar: playerData?.avatar || `https://robohash.org/${playerData?.username || "host"}`,
              },
            ]);
          });
          break;

        case "new_player_joined":
          unstable_batchedUpdates(() => {
            const name = playerData?.username || "";
            const currentPlayers = useWaitroomStore.getState().players;
            if (!currentPlayers.some((p) => p.username === name)) {
              setPlayers([
                ...currentPlayers,
                {
                  isHost: false,
                  username: name,
                  avatar: playerData?.avatar || `https://robohash.org/${name || "guest"}`,
                },
              ]);
            }
          });
          break;

        case "joined_game":
          unstable_batchedUpdates(() => {
            setCode(data.gameCode || "");

            // normalize players payload to array (convert object to array if needed)
            let rawPlayers = data.players ?? data.existingPlayers ?? [];
            if (!Array.isArray(rawPlayers)) {
              rawPlayers = Object.values(rawPlayers);
            }

            const formattedPlayers = rawPlayers.map((p: any) => ({
              isHost: p?.isHost || false,
              username: p?.username || "unknown",
              avatar: p?.avatar || `https://robohash.org/${p?.username || "guest"}`,
            }));

            setPlayers(formattedPlayers);
          });
          break;

        case "match_found": {
          const { gameId, format, teamId, teams, positionInTeam } = data;
          if (!format || typeof format.playersPerTeam !== "number") return;

          Cookies.remove("opponentName");
          Cookies.remove("allyName");
          Cookies.remove("myName");

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
            toast.success("Match trouvé ! Préparation au duel...");
            navigate("/duel3");
          } else if (format.playersPerTeam === 2) {
            toast.success("Match trouvé ! Préparation au match par équipe...");
            navigate("/wsGame");
          }
          break;
        }
        case "tournament_update":
          unstable_batchedUpdates(() => {
            setMatches(data.matches || []);
            setLastResults(data.matchResults || []);
          });
          navigate("/tournamentStage2");
          break;

        case "tournament_notification":
          if (typeof data === "string") toast.info(data);
          else toast.info(JSON.stringify(data));
          break;

        case "tournament_end":
          unstable_batchedUpdates(() => {
            setRanking(data.standings || []);
            setPlayers([]);
            setCode("");
            setIsTournament(false);
            setTournamentStatus("finished");

          });
          navigate("/results");
          break;

        default:
          console.log("🔔 Unknown event:", event, data);
          break;
      }
    });

    return () => unsubscribe();
  }, [addMessageListener, myId, navigate, player]);

  return {
    code,
    players,
    isTournament,
    tournamentStatus: useWaitroomStore.getState().tournamentStatus,
    matches,
    lastResults,
    ranking: useWaitroomStore.getState().ranking,
  };
};
