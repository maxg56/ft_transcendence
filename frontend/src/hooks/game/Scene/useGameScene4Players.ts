import { useEffect, useRef } from 'react';
import * as THREE from "three";
import { Ball } from '../entities/Ball';
import { Paddle } from '../entities/Paddle';

export const useGameScene4Players = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const leftPaddle1Ref = useRef<THREE.Mesh | null>(null);
  const leftPaddle2Ref = useRef<THREE.Mesh | null>(null);
  const rightPaddle1Ref = useRef<THREE.Mesh | null>(null);
  const rightPaddle2Ref = useRef<THREE.Mesh | null>(null);
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
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current.shadowMap.enabled = true;
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);

    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color("#141929");

    cameraRef.current = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current.position.set(0, 300, 150);
    cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0));

    sceneRef.current.add(new THREE.AmbientLight(0xffffff, 0.4));
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 300, 100);
    directionalLight.castShadow = true;
    sceneRef.current.add(directionalLight);

    const tableGeometry = new THREE.BoxGeometry(tableWidth, 10, tableHeight);
    const tableMaterial = new THREE.MeshStandardMaterial({ color: "#385796" });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.receiveShadow = true;
    table.position.y = -5;
    sceneRef.current.add(table);

    const leftPaddle1 = new Paddle(-tableWidth / 2 + 10, tableHeight);
    leftPaddle1.mesh.position.z = 50;
    leftPaddle1.addToScene(sceneRef.current!);
    leftPaddle1Ref.current = leftPaddle1.mesh;

    const leftPaddle2 = new Paddle(-tableWidth / 2 + 10, tableHeight);
    leftPaddle2.mesh.position.z = -50;
    leftPaddle2.addToScene(sceneRef.current!);
    leftPaddle2Ref.current = leftPaddle2.mesh;

    const rightPaddle1 = new Paddle(tableWidth / 2 - 10, tableHeight);
    rightPaddle1.mesh.position.z = 50;
    rightPaddle1.addToScene(sceneRef.current!);
    rightPaddle1Ref.current = rightPaddle1.mesh;

    const rightPaddle2 = new Paddle(tableWidth / 2 - 10, tableHeight);
    rightPaddle2.mesh.position.z = -50;
    rightPaddle2.addToScene(sceneRef.current!);
    rightPaddle2Ref.current = rightPaddle2.mesh;

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
    leftPaddle1Ref,
    leftPaddle2Ref,
    rightPaddle1Ref,
    rightPaddle2Ref,
    ballRef,
  };
};
