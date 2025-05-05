import React, { useEffect, useRef } from 'react';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Color4,
  Mesh
} from '@babylonjs/core';

export const PlanetOrbitSimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 0); // Transparent

    const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 3, 40, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    new HemisphericLight('light', new Vector3(0, 1, 0), scene);

    const planet: Mesh = MeshBuilder.CreateSphere('planet', { diameter: 4 }, scene);
    const planetMaterial = new StandardMaterial('planetMat', scene);
    planetMaterial.diffuseColor = new Color3(0.2, 0.6, 1); // blueish
    planet.material = planetMaterial;

    //Moon
    const moon: Mesh = MeshBuilder.CreateSphere('moon', { diameter: 1 }, scene);
    const moonMaterial = new StandardMaterial('moonMat', scene);
    moonMaterial.diffuseColor = new Color3(0.8, 0.8, 0.8); // grey
    moon.material = moonMaterial;

    // Mars
    const mars: Mesh = MeshBuilder.CreateSphere('mars', { diameter: 1 }, scene);
    const marsMaterial = new StandardMaterial('marsMat', scene);
    moonMaterial.diffuseColor = new Color3(20, 0.8, 0.8); 
    moon.material = moonMaterial;

    // Initial moon position
    let angle = 0;
    const orbitRadius = 8;

    engine.runRenderLoop(() => {
      angle += 0.01;
      moon.position.x = Math.cos(angle + 10) * orbitRadius;
      moon.position.z = Math.sin(angle + 10) * orbitRadius;

      mars.position.x = Math.cos(angle) * (orbitRadius + 2);
      mars.position.z = Math.sin(angle) * (orbitRadius + 2);
      scene.render();
    });

    window.addEventListener('resize', () => engine.resize());
    return () => engine.dispose();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100vh',
        display: 'block',
      }}
    />
  );
};

export default PlanetOrbitSimulation;