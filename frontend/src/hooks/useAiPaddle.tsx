// hooks/useAIPaddle.ts
import { useEffect } from 'react';
import * as THREE from 'three';

export const useAIPaddle = (
  leftPaddleRef: React.MutableRefObject<THREE.Mesh | null>,
  ballRef: React.MutableRefObject<THREE.Mesh | null>,
  isActive: boolean = true
) => {
  const tableHeight = 200;
  const paddleLimit = tableHeight / 2 - 30;
  const aiSpeed = 1.5;

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const paddle = leftPaddleRef.current;
      const ball = ballRef.current;

      if (!paddle || !ball) return;

      const paddleZ = paddle.position.z;
      const ballZ = ball.position.z;

      // Move toward the ball only if there's significant distance
      if (Math.abs(ballZ - paddleZ) > 2) {
        if (ballZ < paddleZ && paddleZ > -paddleLimit) {
          paddle.position.z -= aiSpeed;
        } else if (ballZ > paddleZ && paddleZ < paddleLimit) {
          paddle.position.z += aiSpeed;
        }
      }
    }, 16); // ~60 FPS

    return () => clearInterval(interval);
  }, [leftPaddleRef, ballRef, isActive]);
};