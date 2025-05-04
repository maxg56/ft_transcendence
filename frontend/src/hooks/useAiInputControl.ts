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
	// const aiSpeed = 4.0;

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
            const now = Date.now();
            const dt = (now - lastSampleTime) / 1000;
    
            // --- AI ALGORITHM START ---
            if (now - lastSampleTime > 1000) { // Sample once per second
                const currentBallZ = ball.position.z;
                const velocityZ = (currentBallZ - lastBallZ.current) / dt;
    
                let predictedZ = currentBallZ + velocityZ * 1;
                let radius = 5;
                if (ball && ball.geometry instanceof THREE.SphereGeometry) {
                    radius = ball.geometry.parameters.radius;
                }
                const wallLimit = tableHeight / 2 - radius;
    
                let bounces = 0;
                let direction = Math.sign(velocityZ);
    
                while (Math.abs(predictedZ) > wallLimit && bounces < 10) {
                    if (predictedZ > wallLimit) {
                        predictedZ = wallLimit - (predictedZ - wallLimit);
                    } else if (predictedZ < -wallLimit) {
                        predictedZ = -wallLimit + (-wallLimit - predictedZ);
                    }
                    direction = -direction;
                    bounces++;
                }
    
                aiTargetZ.current = predictedZ;
    
                // Store for next sample
                lastBallZ.current = currentBallZ;
                lastBallVelocityZ.current = velocityZ;
                lastSampleTime = now;
            }
    
            // Smoothly move toward predicted target between samples
            const maxMove = 4.0; // AI paddle speed
            const error = aiTargetZ.current - left.position.z;
    
            if (Math.abs(error) > 1) {
                const movement = Math.sign(error) * Math.min(Math.abs(error), maxMove);
                const newZ = left.position.z + movement;
                if (newZ > -paddleLimit && newZ < paddleLimit) {
                    left.position.z = newZ;
                }
            }
    
            // --- HUMAN CONTROL ---
            if (pressedKeys.has(confKey.p2_up) && right.position.z > -paddleLimit)
                right.position.z -= moveAmount;
            if (pressedKeys.has(confKey.p2_down) && right.position.z < paddleLimit)
                right.position.z += moveAmount;
    
        }, 16); // ~60 FPS
    
        return () => clearInterval(interval);
    }, [pressedKeys, confKey]);
    
};