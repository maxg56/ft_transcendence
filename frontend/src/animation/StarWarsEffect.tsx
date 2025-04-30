import { useEffect, useRef } from 'react';
import * as BABYLON from 'babylonjs';

export const StarWarsEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true, { alpha: true });
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); // Transparent background

    // Create camera
    const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.position.z = -100;

    // Lighting
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.5;

    // Create the starfield
    const starCount = 200;
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      const star = BABYLON.MeshBuilder.CreateSphere(`star${i}`, { diameter: Math.random() * 0.5 }, scene);
      star.position = new BABYLON.Vector3(
        Math.random() * 100 - 50, // Random X
        Math.random() * 100 - 50, // Random Y
        Math.random() * -200 // Random Z (deep in space)
      );
      star.material = new BABYLON.StandardMaterial(`starMat${i}`, scene);
      star.material.emissiveColor = new BABYLON.Color3(1, 1, 1); // White color
      stars.push(star);
    }

    const animateStars = () => {
      stars.forEach(star => {
        star.position.z += 1; // Move stars forward
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
