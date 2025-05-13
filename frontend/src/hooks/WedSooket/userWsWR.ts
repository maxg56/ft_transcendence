import { useEffect, useRef } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "@/context/WebSocketContext";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useWaitroomStore } from "@/store/useWaitroomStore";
import { Players, Team } from "@/types/WF"; 
import { useTranslation } from "@/context/TranslationContext";
import { useSendWSMessage } from "./useSendWSMessage";

export const useWaitroomListener = () => {
  const { t } = useTranslation();
  const { dequeueMessage } = useWebSocket();
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

  // utility to guard cookie writes
  const safeSetCookie = (key: string, value?: string) => {
    if (typeof value === 'string' && value) Cookies.set(key, value);
  };

  // Détection de l'utilisateur courant et de l'host
  const sendWSMessage = useSendWSMessage();
  const myName = Cookies.get('myName');
  const hostPlayer = players.find((p: any) => p.isHost);
  const isHost = hostPlayer && myName && hostPlayer.username === myName;

  // Système d'attente d'ack_ok (par étape)
  const ackWaiters = useRef<Record<string, { resolve: () => void; reject: () => void }>>({});

  // Utilitaire pour envoyer un ack et attendre ack_ok
  const sendAckAndWait = async (step: string, matchId?: string) => {
    return new Promise<void>((resolve, reject) => {
      ackWaiters.current[step] = { resolve, reject };
      sendWSMessage({ event: 'ack', step, matchId });
      // Timeout de sécurité (ex: 8s)
      setTimeout(() => {
        if (ackWaiters.current[step]) {
          ackWaiters.current[step].reject();
          delete ackWaiters.current[step];
          toast.error('Aucune confirmation du serveur, veuillez réessayer.');
        }
      }, 8000);
    });
  };

  // handler map for ws events
  const handlers: Record<string, (data: any) => void> = {
    tournament_created: (d) => {
      setIsTournament(true);
      setCode(d.gameCode || d.gameId || '');
      setPlayers([{ isHost: true, username: d.player?.username || '', avatar: d.player?.avatar || `https://robohash.org/${d.player?.username||'host'}` }]);
    },
    matchmaking_removed : () => {
      toast.error(t("Vous avez été retiré de la file d'attente."));
      navigate("/hub");
    },
    private_game_created: (d) => {
      setIsTournament(false);
      setCode(d.gameId || d.gameCode || '');
      setPlayers([{ isHost: true, username: d.player?.username || '', avatar: d.player?.avatar || `https://robohash.org/${d.player?.username||'host'}` }]);
    },
    new_player_joined: (d) => {
      const name = d.player?.username || '';
      const current = useWaitroomStore.getState().players;
      if (!current.some(p => p.username === name)) {
        setPlayers([...current, { isHost: false, username: name, avatar: d.player?.avatar || `https://robohash.org/${name||'guest'}` }]);
      }
    },
    joined_game: (d) => {
      setCode(d.gameCode || '');
      let raw = d.players ?? d.existingPlayers ?? [];
      if (!Array.isArray(raw)) raw = Object.values(raw);
      const formatted = raw.map((p: any) => ({ isHost: p?.isHost||false, username: p?.username||'unknown', avatar: p?.avatar||`https://robohash.org/${p?.username||'guest'}` }));
      setPlayers(formatted);
    },
    match_found: (d) => {
      Cookies.remove('opponentName'); Cookies.remove('allyName'); Cookies.remove('myName');
      Cookies.set('gameid', d.gameId);
      Cookies.set('teamId', String(d.teamId)); Cookies.set('positionInTeam', String(d.positionInTeam));
      const myTeam = d.teams.find((t: Team) => t.id === d.teamId);
      const oppTeam = d.teams.find((t: Team) => t.id !== d.teamId);
      const myName = myTeam?.players[d.positionInTeam]?.name;
      const myAlly = myTeam?.players.find((p: Players) => p.name !== myName);
      const opp = oppTeam?.players[0]; const oppAlly = oppTeam?.players[1];
      safeSetCookie('opponentName', opp?.name);
      safeSetCookie('allyName', myAlly?.name);
      safeSetCookie('myName', myName);
      safeSetCookie('opponentAlly', oppAlly?.name);
      if (d.format?.playersPerTeam === 1) { toast.success(t('Match trouvé ! Préparation au duel...')); navigate('/duel3'); }
      else if (d.format?.playersPerTeam === 2) { toast.success(t('Match trouvé ! Préparation au match par équipe...')); navigate('/wsGame'); }
    },
    tournament_update: async (d) => {
      setMatches(Array.isArray(d.matches) ? d.matches : []);
      setLastResults(Array.isArray(d.matchResults) ? d.matchResults : []);
      // Nouvelle logique : host attend ack_ok avant de continuer
      if (isHost) {
        try {
          await sendAckAndWait('tournament_update', d.matchId || d.tournamentId || code);
        } catch {
          return; // Stop si pas de confirmation backend
        }
      }
      // Ne redirige pas si déjà sur la page
      if (window.location.pathname !== '/tournamentStage2') {
        navigate('/tournamentStage2');
      }
    },
    tournament_notification: (d) => {
      toast.info(typeof d==='string'? d : JSON.stringify(d));
    },
    tournament_end: async (d) => {
      if (isHost) {
        try {
          await sendAckAndWait('tournament_end', d.matchId || d.tournamentId || code);
        } catch {
          return;
        }
      }
      setRanking(Array.isArray(d.standings) ? d.standings : []);
      setPlayers([]);
      setCode('');
      setIsTournament(false);
      setTournamentStatus('finished');
      if (window.location.pathname !== '/results') {
        navigate('/results');
      }
    },
    // on tournament match finish, redirect to matches overview
    tournament_match_result: async (d) => {
      if (isHost) {
        try {
          await sendAckAndWait('tournament_match_result', d?.matchId || code);
        } catch {
          return;
        }
      }
      toast.success(t("Tournoi: match terminé"));
      setTimeout(() => {
        if (window.location.pathname !== '/tournamentStage2') {
          navigate('/tournamentStage2');
        }
      }, 1200);
    },
    // Handler pour ack_ok (débloque la promesse)
    ack_ok: (d) => {
      const step = d?.step;
      if (step && ackWaiters.current[step]) {
        ackWaiters.current[step].resolve();
        delete ackWaiters.current[step];
      }
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      let msg;
      while ((msg = dequeueMessage())) {
        const { event, data } = msg || {};
        console.debug("📩 WebSocket received:", msg);
        // Protection : certains messages peuvent être legacy (type au lieu de event)
        const evt = event || msg.type;
        if (!evt || data == null) continue;
        const fn = handlers[evt];
        if (fn) unstable_batchedUpdates(() => fn(data));
        else console.debug(`WS unhandled event: ${evt}`, data);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [dequeueMessage, navigate, t]);

  return { 
    code, 
    players, 
    isTournament, 
    tournamentStatus: useWaitroomStore.getState().tournamentStatus, 
    matches, 
    lastResults, 
    ranking: useWaitroomStore.getState().ranking 
  };
};
