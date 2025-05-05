import { useEffect, useRef } from 'react';
import {
    Engine,
    Scene,
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    StandardMaterial,
    Color3,
    Color4,
    Mesh
  } from '@babylonjs/core';

export const StarTunnelBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const engine = new Engine(canvas, true, { alpha: true });
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 0); // Transparent

    const camera = new FreeCamera('camera', new Vector3(0, 0, -10), scene);
    camera.setTarget(Vector3.Zero());

    const starMaterial = new StandardMaterial("starMat", scene);
    starMaterial.emissiveColor = new Color3(1, 1, 1);

    const stars: Mesh[] = [];

    for (let i = 0; i < 300; i++) {
      const star: Mesh = MeshBuilder.CreateSphere(`star${i}`, { diameter: 0.05 }, scene);
      star.material = starMaterial;
      star.position = new Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        Math.random() * 100
      );
      stars.push(star);
    }    

    engine.runRenderLoop(() => {
      for (const star of stars) {
        star.position.z -= 1;
        if (star.position.z < 0) {
          star.position.z = 100;
          star.position.x = (Math.random() - 0.5) * 20;
          star.position.y = (Math.random() - 0.5) * 20;
        }
      }
      scene.render();
    });

    window.addEventListener('resize', () => engine.resize());
    return () => engine.dispose();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
};

export default StarTunnelBackground;