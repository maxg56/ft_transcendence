// src/hooks/useInputControls4Players.ts
import { useEffect } from 'react';
import { useKeyboard } from '@/context/KeyboardContext';
import { useConfKey } from '@/context/ConfKeyContext';
import { MeshRef } from "../type";
import { useWebSocket } from "@/context/WebSocketContext";
import Cookies from "js-cookie";

export const useInputControls4Players = (
  lp1: MeshRef,
  lp2: MeshRef,
  rp1: MeshRef,
  rp2: MeshRef
) => {
  const { pressedKeys } = useKeyboard();
  const { confKey } = useConfKey();

  const tableHeight = 200;
  const paddleLimit = tableHeight / 2 - 30;
  const moveAmount = 5;
  
  useEffect(() => {
    const interval = setInterval(() => {
      const p1 = lp1.current;
      const p2 = lp2.current;
      const p3 = rp1.current;
      const p4 = rp2.current;
      if (!p1 || !p2 || !p3 || !p4) return;

      if (pressedKeys.has(confKey.p1_up)    && p1.position.z > -paddleLimit && p1.position.z > p2.position.z + 50)
        p1.position.z -= moveAmount;
      if (pressedKeys.has(confKey.p1_down)  && p1.position.z <  paddleLimit) 
        p1.position.z += moveAmount;

      if (pressedKeys.has(confKey.p2_up)    && p2.position.z > -paddleLimit) 
        p2.position.z -= moveAmount;
      if (pressedKeys.has(confKey.p2_down)  && p2.position.z <  paddleLimit && p2.position.z < p1.position.z -50) 
        p2.position.z += moveAmount;

      if (pressedKeys.has(confKey.p3_up)    && p3.position.z > -paddleLimit &&  p3.position.z > p4.position.z + 50) 
        p3.position.z -= moveAmount;
      if (pressedKeys.has(confKey.p3_down)  && p3.position.z <  paddleLimit) 
        p3.position.z += moveAmount;

      if (pressedKeys.has(confKey.p4_up)    && p4.position.z > -paddleLimit) 
        p4.position.z -= moveAmount;
      if (pressedKeys.has(confKey.p4_down)  && p4.position.z <  paddleLimit && p4.position.z < p3.position.z - 50) 
        p4.position.z += moveAmount;
    }, 16);

    return () => clearInterval(interval);
  }, [pressedKeys, confKey, lp1, lp2, rp1, rp2]);
};

export const usePlayerControls = (gameId: string) => {
  const { socket } = useWebSocket();  
	const { pressedKeys } = useKeyboard();
	const { confKey } = useConfKey();
  let side = 'left';
	const idtme = Cookies.get("teamId");
  const positionInTeam = Cookies.get("positionInTeam");
	if (idtme == '2') {
		side = 'right';
    
	}
  if (positionInTeam == '1') {
    side= side+'2';
  }
  // console.log("side", side);
	useEffect(() => {
		const interval = setInterval(() => {
			if (socket?.readyState !== WebSocket.OPEN) return;

			let direction: 'up' | 'down' | null = null;
			if (pressedKeys.has(confKey[`p1_up`])) direction = 'up';
			else if (pressedKeys.has(confKey[`p1_down`])) direction = 'down';

			if (direction) {
				socket.send(
					JSON.stringify({
						event: 'move_paddle',
						gameId,
						side,
						direction,
					})
				);
			}
		}, 16); // ~60 FPS

		return () => clearInterval(interval);
	}, [socket, side, pressedKeys, confKey]);
};