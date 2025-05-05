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
  Mesh,
  LinesMesh,
  Path3D,
  Curve3
} from '@babylonjs/core';

export const SolarSystemSimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 0); // Transparent
    // Camera
    const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 3, 50, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Light
    new HemisphericLight('light', new Vector3(0, 1, 0), scene);

    // Sun
    const sun = MeshBuilder.CreateSphere('sun', { diameter: 6 }, scene);
    const sunMat = new StandardMaterial('sunMat', scene);
    sunMat.emissiveColor = new Color3(1, 0.7, 0); // Yellow-orange
    sun.material = sunMat;

    // Planet
    const planet = MeshBuilder.CreateSphere('planet', { diameter: 2 }, scene);
    const planetMat = new StandardMaterial('planetMat', scene);
    planetMat.diffuseColor = new Color3(0.2, 0.6, 1);
    planet.material = planetMat;

    // Moon
    const moon = MeshBuilder.CreateSphere('moon', { diameter: 0.6 }, scene);
    const moonMat = new StandardMaterial('moonMat', scene);
    moonMat.diffuseColor = new Color3(0.7, 0.7, 0.7);
    moon.material = moonMat;

    // Orbit Radii
    const planetOrbitRadius = 20;
    const moonOrbitRadius = 4;

    function createCirclePoints(radius: number, segments: number = 64): Vector3[] {
        const points: Vector3[] = [];
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * 2 * Math.PI;
          points.push(new Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
        }
        return points;
      }      
      
// Planet orbit path
const planetPathPoints = createCirclePoints(planetOrbitRadius, 128);
MeshBuilder.CreateLines("planetOrbit", { points: planetPathPoints }, scene);

// Moon orbit path
const moonPathPoints = createCirclePoints(moonOrbitRadius, 64);
const moonOrbitPath = MeshBuilder.CreateLines("moonOrbit", { points: moonPathPoints }, scene);
moonOrbitPath.color = new Color3(0.5, 0.5, 0.5);


    // Animation state
    let planetAngle = 0;
    let moonAngle = 0;

    engine.runRenderLoop(() => {
      planetAngle += 0.005;
      moonAngle += 0.03;

      // Update planet position around sun
      const planetX = Math.cos(planetAngle) * planetOrbitRadius;
      const planetZ = Math.sin(planetAngle) * planetOrbitRadius;
      planet.position.set(planetX, 0, planetZ);

      // Update moon position around planet
      const moonX = planetX + Math.cos(moonAngle) * moonOrbitRadius;
      const moonZ = planetZ + Math.sin(moonAngle) * moonOrbitRadius;
      moon.position.set(moonX, 0, moonZ);

      // Move moon orbit path to center around the moving planet
      moonOrbitPath.position = planet.position.clone();

      scene.render();
    });

    window.addEventListener('resize', () => engine.resize());
    return () => engine.dispose();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100vh', display: 'block' }}
    />
  );
};

export default SolarSystemSimulation;
