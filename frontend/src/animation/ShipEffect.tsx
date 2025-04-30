import { useEffect, useRef } from 'react';
import * as BABYLON from 'babylonjs';

export const BabylonStarsAndShips = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true, { alpha: true });
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -50), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.8;

    // // 🌟 Create stars
    // const stars = [];
    // for (let i = 0; i < 300; i++) {
    //   const star = BABYLON.MeshBuilder.CreateSphere(`star${i}`, { diameter: 0.2 }, scene);
    //   star.position = new BABYLON.Vector3(
    //     Math.random() * 100 - 50,
    //     Math.random() * 100 - 50,
    //     Math.random() * 100 - 50
    //   );
    //   const mat = new BABYLON.StandardMaterial(`starMat${i}`, scene);
    //   mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    //   star.material = mat;
    //   stars.push(star);
    // }

    // 🚀 Create ship(s)
    const ships = [];
    for (let i = 0; i < 5; i++) {
      const ship = BABYLON.MeshBuilder.CreateBox(`ship${i}`, {
        width: 1,
        height: 0.5,
        depth: 2,
      }, scene);
      ship.position = new BABYLON.Vector3(Math.random() * 60 - 30, Math.random() * 20 - 10, 50 + i * 10);
      const mat = new BABYLON.StandardMaterial(`shipMat${i}`, scene);
      mat.diffuseColor = new BABYLON.Color3(0, 0, 0);
      ship.material = mat;
      ships.push(ship);
    }

    // 🌀 Animate
    engine.runRenderLoop(() => {
      ships.forEach((ship) => {
        ship.position.z -= 0.5;
        if (ship.position.z < -50) {
          ship.position.z = 50;
          ship.position.x = Math.random() * 60 - 30;
          ship.position.y = Math.random() * 20 - 10;
        }
      });
      scene.render();
    });

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

export default BabylonStarsAndShips;
