import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useKeyboard } from '../context/KeyboardContext';
import { useConfKey } from '../context/ConfKeyContext';

export const useAiInputControl = (
	leftPaddleRef: React.MutableRefObject<THREE.Mesh | null>,
	rightPaddleRef: React.MutableRefObject<THREE.Mesh | null>,
	ballRef: React.MutableRefObject<THREE.Mesh | null>,
	isActive: boolean = true
) => {
	const { pressedKeys } = useKeyboard();
	const { confKey } = useConfKey();
    const tableHeight = 200;
    const paddleLimit = tableHeight / 2 - 30;
	const aiSpeed = 1.9;

	// AI state
    const aiTargetZ = useRef(0);
    const lastBallZ = useRef(0);
    const lastBallVelocityZ = useRef(0);

    useEffect(() => {
        if (!isActive) return;

        let lastSampleTime = Date.now();

        const interval = setInterval(() => {
            const left = leftPaddleRef.current;
            const right = rightPaddleRef.current;
            const ball = ballRef.current;
            if (!left || !right || !ball) return;

            const moveAmount = 5;

            // --- AI ALGORITHM START ---
            const now = Date.now();
            if (now - lastSampleTime > 1000) { // Sample once per second
                // Estimate ball Z velocity
                const currentBallZ = ball.position.z;
                const currentBallVelocityZ = (currentBallZ - lastBallZ.current) / ((now - lastSampleTime) / 1000);

                // Predict where the ball will be in 1 second, considering bounces
                let predictedZ = currentBallZ + currentBallVelocityZ * 1; // 1 second ahead
                let wallLimit = tableHeight / 2 - ball.geometry.parameters.radius;

                // Simulate bounces
                let direction = Math.sign(currentBallVelocityZ);
                while (Math.abs(predictedZ) > wallLimit) {
                    if (predictedZ > wallLimit) {
                        predictedZ = wallLimit - (predictedZ - wallLimit);
                        direction = -direction;
                    } else if (predictedZ < -wallLimit) {
                        predictedZ = -wallLimit + (-wallLimit - predictedZ);
                        direction = -direction;
                    }
                }

                // Add some imprecision
                // const error = (Math.random() - 0.5) * 5;
                aiTargetZ.current = predictedZ;

                // Store for next velocity calculation
                lastBallZ.current = currentBallZ;
                lastBallVelocityZ.current = currentBallVelocityZ;
                lastSampleTime = now;
            }

            // Move paddle toward the predicted (and imprecise) target
            if (Math.abs(aiTargetZ.current - left.position.z) > 2) {
                if (aiTargetZ.current < left.position.z && left.position.z > -paddleLimit) {
                    left.position.z -= aiSpeed;
                } else if (aiTargetZ.current > left.position.z && left.position.z < paddleLimit) {
                    left.position.z += aiSpeed;
                }
            }
            // --- AI ALGORITHM END ---

            // Human player (right paddle)
            if (pressedKeys.has(confKey.p2_up) && right.position.z > -paddleLimit) 
                right.position.z -= moveAmount;
            if (pressedKeys.has(confKey.p2_down) && right.position.z < paddleLimit) 
                right.position.z += moveAmount;
        }, 16); // ~60 FPS

        return () => clearInterval(interval);
    }, [pressedKeys, confKey]);
};