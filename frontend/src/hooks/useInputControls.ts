import { useEffect } from 'react';
import * as THREE from 'three';
import { useKeyboard } from '../context/KeyboardContext';
import { useConfKey } from '../context/ConfKeyContext';

export const useInputControls = (
	leftPaddleRef: React.MutableRefObject<THREE.Mesh | null>,
	rightPaddleRef: React.MutableRefObject<THREE.Mesh | null>
) => {
	const { pressedKeys } = useKeyboard();
	const { confKey } = useConfKey();
    const tableHeight = 200;
    const paddleLimit = tableHeight / 2 - 30;
	useEffect(() => {
		const interval = setInterval(() => {
			const left = leftPaddleRef.current;
			const right = rightPaddleRef.current;
			if (!left || !right) return;

			const moveAmount = 5;
            
			if (pressedKeys.has(confKey.p1_up) && left.position.z > -paddleLimit) 
                    left.position.z -= moveAmount;
			if (pressedKeys.has(confKey.p1_down ) && left.position.z < paddleLimit) 
                left.position.z += moveAmount;

			if (pressedKeys.has(confKey.p2_up) && right.position.z > -paddleLimit) 
                right.position.z -= moveAmount;
			if (pressedKeys.has(confKey.p2_down) && right.position.z < paddleLimit) 
                right.position.z += moveAmount;
		}, 16); // ~60 FPS

		return () => clearInterval(interval);
	}, [pressedKeys, confKey]);
};


export const usePlayerControls = (side: 'left' | 'right' , gameId: string) => {
	const socket = useWebSocket();
	const { pressedKeys } = useKeyboard();
	const { confKey } = useConfKey();
	const id = side === 'left' ? 1 : 2;

	useEffect(() => {
		const interval = setInterval(() => {
			if (socket?.readyState !== WebSocket.OPEN) return;

			let direction: 'up' | 'down' | null = null;
			if (pressedKeys.has(confKey[`p${id}_up`])) direction = 'up';
			else if (pressedKeys.has(confKey[`${id}_down`])) direction = 'down';

			if (direction) {
				console.log('Sending move paddle event:', side, direction);
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

