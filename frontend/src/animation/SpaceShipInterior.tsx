import { useEffect, useRef } from 'react';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  Color4,
  CubeTexture
} from '@babylonjs/core';

export const SpaceShipInterior = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 1); // Opaque black background

    // Camera
    const camera = new ArcRotateCamera('camera', Math.PI/ 2, Math.PI -3 / 2.5, 0, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 500;
    camera.upperRadiusLimit = 500;

    // Lighting
    new HemisphericLight('light', new Vector3(0, 1, 0), scene);

    // Load 360° skybox textures from public folder
    const filePaths = [
      '/textures/px.png',
      '/textures/py.png',
      '/textures/pz.png',
      '/textures/nx.png',
      '/textures/ny.png',
      '/textures/nz.png',
    ];

    const cubeTexture = CubeTexture.CreateFromImages(filePaths, scene);

    const skybox = MeshBuilder.CreateBox('skyBox', { size: 1000.0 }, scene);
    const skyboxMaterial = new StandardMaterial('skyBoxMat', scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = cubeTexture;
    skyboxMaterial.reflectionTexture.coordinatesMode = 5; // SKYBOX_MODE
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    engine.runRenderLoop(() => {
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
    height: '100%',
    display: 'block',
    objectFit: 'cover',
    borderRadius: '100px',
  }}
/>

  );
};

export default SpaceShipInterior;
