// hooks/useSceneCleanup.ts

import { useEffect } from 'react';
import * as THREE from 'three';

const useSceneCleanup = (
  scene: THREE.Scene | null,
  renderer: THREE.WebGLRenderer | null
) => {
  useEffect(() => {
    return () => {
      if (!scene || !renderer) return;

      scene.traverse((object) => {
        if ((object as THREE.Mesh).geometry) {
          (object as THREE.Mesh).geometry.dispose();
        }
        if ((object as THREE.Mesh).material) {
          const material = (object as THREE.Mesh).material;
          if (Array.isArray(material)) {
            material.forEach((m) => m.dispose());
          } else {
            material.dispose();
          }
        }
      });

      // Nettoyer les enfants (même s’ils ont déjà été traversés)
      while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
      }

      renderer.dispose();
      // console.log('Scene and renderer cleaned up');
    };
  }, [scene, renderer]);
};

export default useSceneCleanup;
