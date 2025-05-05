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

export const StarWarsEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new Engine(canvas, true, { alpha: true });
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 0); // Transparent background

    const camera = new FreeCamera("camera", new Vector3(0, 0, -10), scene);
    camera.setTarget(Vector3.Zero());
    camera.position.z = -100;

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.5;

    const starCount = 200;
    const stars: Mesh[] = [];
    for (let i = 0; i < starCount; i++) {
      const star = MeshBuilder.CreateSphere(`star${i}`, { diameter: Math.random() * 0.5 }, scene);
      star.position = new Vector3(
        Math.random() * 100 - 50,
        Math.random() * 100 - 50,
        Math.random() * -200
      );
      const mat = new StandardMaterial(`mat${i}`, scene);
      mat.emissiveColor = new Color3(1, 1, 1);
      star.material = mat;
      stars.push(star);
    }

    const animateStars = () => {
      stars.forEach(star => {
        star.position.z += 1;// Move stars forward
        if (star.position.z > 0) {
          star.position.z = -100; // Reset the star to the far side
          star.position.x = Math.random() * 100 - 50;
          star.position.y = Math.random() * 100 - 50;
        }
      });
    };
    // Animate stars
    engine.runRenderLoop(() => {
      animateStars();
      scene.render();
    });
    // Resize event
    window.addEventListener('resize', () => engine.resize());

    return () => {
      engine.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default StarWarsEffect;
