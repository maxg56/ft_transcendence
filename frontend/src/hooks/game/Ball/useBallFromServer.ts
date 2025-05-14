import { useEffect } from 'react';
import * as THREE from 'three';
import { useWebSocket } from '@/context/WebSocketContext';
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


async function tournament_match_result(navigate: ReturnType<typeof useNavigate>) {
  toast.success('Tournoi: match terminé');
  setTimeout(() => {
    if (window.location.pathname !== '/tournamentStage2') {
      navigate('/tournamentStage2');
    }
  }, 1200);
}



export const useBallFromServer = (
  ballRef: React.MutableRefObject<THREE.Mesh | null>,
  leftPaddleRef: React.MutableRefObject<THREE.Mesh | null>,
  rightPaddleRef: React.MutableRefObject<THREE.Mesh | null>,
  onScoreUpdate: (score: [number, number]) => void,
  onGameEnd: (winner: string) => void,
  setGameStarted: (started: boolean) => void
) => {
  const navigate = useNavigate();
	const { socket } = useWebSocket();  

  // Fonction pour gérer les mises à jour de l'état du jeu
  const handleGameState = (data: any) => {
    const { ball, paddles, score } = data.state;
    const teamId = Cookies.get("teamId");
    const isTeam1 = teamId === '1';

    if (ballRef.current) {
      ballRef.current.position.x = isTeam1 ? ball.x : -ball.x;
      ballRef.current.position.z = ball.z;
    }

    if (leftPaddleRef.current && rightPaddleRef.current) {
      leftPaddleRef.current.position.z = isTeam1 ? paddles.left.z : paddles.right.z;
      rightPaddleRef.current.position.z = isTeam1 ? paddles.right.z : paddles.left.z;
    }

    const updatedScore: [number, number] = isTeam1
      ? [score.left, score.right]
      : [score.right, score.left];

    onScoreUpdate(updatedScore);
  };

  // Fonction pour gérer les résultats du jeu
  const handleGameResult = (message: any) => {
    onGameEnd(message.data.winner[0]);
    setGameStarted(false);
  };

  // Fonction pour traiter les messages WebSocket
  const onMessage = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      switch (message.event) {
        case 'game_state':
          if (message.state) {
            handleGameState(message);
          }
          break;
        case 'game_result':
          handleGameResult(message);
          break;
        case "tournament_match_result" :
          tournament_match_result(navigate);
          break;
        default:
          console.warn('Message WebSocket inattendu:', message);
          break;
      }
    } catch (err) {
      console.error('Erreur de parsing WebSocket:', err);
    }
  };

  // Mise en place de l'écouteur WebSocket à l'ouverture de la connexion
  useEffect(() => {
    if (!socket) {
      console.error('WebSocket non initialisé');
      return;
    }

    socket.addEventListener('message', onMessage);

    return () => {
      socket.removeEventListener('message', onMessage);
    };
  }, [socket]);

};
