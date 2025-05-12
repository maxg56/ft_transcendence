import React, { useEffect, useRef } from "react";
import {
    Engine,
    Scene,
    FreeCamera,
    Color3,
    Mesh,
    Color4,
    Vector3,
    MeshBuilder,
    StandardMaterial,
  } from '@babylonjs/core';

const StarsBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const engine = new Engine(canvas, true);
        const scene = new Scene(engine);
        scene.clearColor = new Color4(0, 0, 0, 1); // Opaque black background
        // Camera & Light
        const camera = new FreeCamera("camera", new Vector3(0, 0, -100), scene);
        camera.setTarget(Vector3.Zero());

        // Star material
        const starMaterial = new StandardMaterial("starMat", scene);
        starMaterial.emissiveColor = new Color3(1, 1, 1);

        // Create stars (small spheres)
        const starCount = 600;
        const stars: Mesh[] = [];

        for (let i = 0; i < starCount; i++) {
            const star = MeshBuilder.CreateSphere(`star${i}`, { diameter: 0.5 }, scene);
            star.material = starMaterial;
            star.position.x = Math.random() * 200 - 100;
            star.position.y = Math.random() * 100 - 50;
            star.position.z = Math.random() * 200 - 100;
            (star as any).speed = Math.random() * 0.5 + 0.2;
            stars.push(star);
        }

        // Animation
        engine.runRenderLoop(() => {
            stars.forEach((star) => {
                star.position.x += (star as any).speed;
                if (star.position.x > 100) {
                    star.position.x = -100;
                    star.position.y = Math.random() * 100 - 50;
                    star.position.z = Math.random() * 200 - 100;
                }
            });
            scene.render();
        });

        // Resize
        window.addEventListener("resize", () => {
            engine.resize();
        });

        return () => {
            engine.dispose();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
        />
    );
};

export default StarsBackground;
