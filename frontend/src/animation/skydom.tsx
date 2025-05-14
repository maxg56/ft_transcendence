import { useRef, useEffect } from "react";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Vector3
} from "@babylonjs/core";

export const SkydomeScene = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    // Camera
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 10, 
      Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Lumière
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Skydome
    const dome = MeshBuilder.CreateSphere("skydome", { segments: 32, diameter: 1000 }, scene);
    // dome.invertU = true; // Pour certaines textures
    dome.scaling = new Vector3(1, -1, 1); // Retourner la sphère
    const domeMaterial = new StandardMaterial("domeMat", scene);
    domeMaterial.backFaceCulling = false;
    domeMaterial.diffuseTexture = new Texture("/textures/pano.jpeg", scene); // Chemin vers ta texture
    domeMaterial.diffuseTexture.coordinatesMode = Texture.SPHERICAL_MODE;
    dome.material = domeMaterial;

    // Rendu
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Cleanup
    return () => {
      engine.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
};

export default SkydomeScene;