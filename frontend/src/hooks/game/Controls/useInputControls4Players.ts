// src/hooks/useInputControls4Players.ts
import { useEffect } from 'react';
import * as THREE from 'three';
import { useKeyboard } from '@/context/KeyboardContext';
import { useConfKey } from '@/context/ConfKeyContext';

type MeshRef = React.MutableRefObject<THREE.Mesh | null>;

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

      if (pressedKeys.has(confKey.p1_up)    && p1.position.z > -paddleLimit) p1.position.z -= moveAmount;
      if (pressedKeys.has(confKey.p1_down)  && p1.position.z <  paddleLimit) p1.position.z += moveAmount;

      if (pressedKeys.has(confKey.p2_up)    && p2.position.z > -paddleLimit) p2.position.z -= moveAmount;
      if (pressedKeys.has(confKey.p2_down)  && p2.position.z <  paddleLimit) p2.position.z += moveAmount;

      if (pressedKeys.has(confKey.p3_up)    && p3.position.z > -paddleLimit) p3.position.z -= moveAmount;
      if (pressedKeys.has(confKey.p3_down)  && p3.position.z <  paddleLimit) p3.position.z += moveAmount;

      if (pressedKeys.has(confKey.p4_up)    && p4.position.z > -paddleLimit) p4.position.z -= moveAmount;
      if (pressedKeys.has(confKey.p4_down)  && p4.position.z <  paddleLimit) p4.position.z += moveAmount;
    }, 16);

    return () => clearInterval(interval);
  }, [pressedKeys, confKey, lp1, lp2, rp1, rp2]);
};
