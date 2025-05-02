// hooks/useGameScene.ts
import { useEffect, useRef } from 'react';
import * as THREE from "three";
import {Ball} from '../entities/Ball';
import {Paddle} from '../entities/Paddle';


export const useGameScene = () => {
	const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const leftPaddleRef = useRef<THREE.Mesh | null>(null);
  const rightPaddleRef = useRef<THREE.Mesh | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);

  const tableWidth = 400;
  const tableHeight = 200;

  const cleanup = () => {
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current.domElement.remove();
      rendererRef.current = null;
    }
    if (sceneRef.current) {
      while (sceneRef.current.children.length > 0)
        sceneRef.current.remove(sceneRef.current.children[0]);
      sceneRef.current = null;
    }
    if (cameraRef.current) cameraRef.current = null;
  };

  const initializeScene = () => {
      // rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      rendererRef.current.shadowMap.enabled = true;
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      sceneRef.current = new THREE.Scene();
      // sceneRef.current.background = new THREE.Color("#141929");
      sceneRef.current.background = null;

      cameraRef.current = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      cameraRef.current.position.set(0, 300, 150);
      cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0));
  
      // Lumières
      sceneRef.current.add(new THREE.AmbientLight(0xffffff, 0.4));
      const directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(0, 300, 100);
      directionalLight.castShadow = true;
      sceneRef.current.add(directionalLight);
  
      // Table
      const tableGeometry = new THREE.BoxGeometry(tableWidth, 10, tableHeight);
      const tableMaterial = new THREE.MeshStandardMaterial({ color: "#385796" });
      const table = new THREE.Mesh(tableGeometry, tableMaterial);
      table.receiveShadow = true;
      table.position.y = -5;
      sceneRef.current.add(table);
      
      // Paddles
      const leftPaddle = new Paddle(-tableWidth / 2 + 10, tableHeight);
      leftPaddle.addToScene(sceneRef.current!);
      leftPaddleRef.current = leftPaddle.mesh;
      
      const rightPaddle = new Paddle(tableWidth / 2 - 10, tableHeight);
      rightPaddle.addToScene(sceneRef.current!);
      rightPaddleRef.current = rightPaddle.mesh;
      
      // Balle
      const ball = new Ball();
      ball.addToScene(sceneRef.current!);
      ballRef.current = ball.mesh;

      if (mountRef.current)
        mountRef.current.appendChild(rendererRef.current.domElement);
    };
    let animationId: number;
    const animate = () => {
    	rendererRef.current!.render(sceneRef.current!, cameraRef.current!);
      animationId = requestAnimationFrame(animate);
    };

    useEffect(() => {
      initializeScene();
      animationId = requestAnimationFrame(animate);
    
      return () => {
        cancelAnimationFrame(animationId);
        cleanup();
      };
    }, []);
    

    return {
      mountRef,
      sceneRef,
      leftPaddleRef,
      rightPaddleRef,
      ballRef,
    };
};
