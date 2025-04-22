import { useEffect } from 'react';
import * as THREE from 'three';
import { useKeyboard } from '../context/KeyboardContext';
import { useConfKey } from './useConfKey';

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
