import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const DuelComponent: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const leftPaddleRef = useRef<THREE.Mesh | null>(null);
  const rightPaddleRef = useRef<THREE.Mesh | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);

  // Dimensions
  const tableWidth = 400;
  const tableHeight = 200;
  const paddleSpeed = 5;
  const paddleLimit = tableHeight / 2 - 40;

  // États pour les mouvements
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  let ballSpeed = { x: 2, z: 2 };

  useEffect(() => {
    if (!rendererRef.current) {
      // Renderer
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
      rendererRef.current.shadowMap.enabled = true;
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);

      // Scène
      sceneRef.current = new THREE.Scene();
      sceneRef.current.background = new THREE.Color(0x222222);

      // Caméra
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
      const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x3b3b3b });
      const table = new THREE.Mesh(tableGeometry, tableMaterial);
      table.receiveShadow = true;
      table.position.y = -5;
      sceneRef.current.add(table);

      // Paddles
      const paddleGeometry = new THREE.BoxGeometry(10, 10, 80);
      const paddleMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });

      const leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
      leftPaddle.position.set(-tableWidth / 2 + 10, 5, 0);
      leftPaddle.castShadow = true;
      sceneRef.current.add(leftPaddle);
      leftPaddleRef.current = leftPaddle;

      const rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
      rightPaddle.position.set(tableWidth / 2 - 10, 5, 0);
      rightPaddle.castShadow = true;
      sceneRef.current.add(rightPaddle);
      rightPaddleRef.current = rightPaddle;

      // Balle
      const ballGeometry = new THREE.SphereGeometry(5, 32, 32);
      const ballMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        metalness: 0.5,
        roughness: 0.3,
      });
      const ball = new THREE.Mesh(ballGeometry, ballMaterial);
      ball.castShadow = true;
      ball.position.set(0, 5, 0);
      sceneRef.current.add(ball);
      ballRef.current = ball;

      // Gestion des touches
      const handleKeyDown = (event: KeyboardEvent) => {
        keysPressed.current[event.key] = true;
      };
      const handleKeyUp = (event: KeyboardEvent) => {
        keysPressed.current[event.key] = false;
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      // Animation
      const animate = () => {
        requestAnimationFrame(animate);

        // Mouvement des paddles
        if (leftPaddleRef.current && rightPaddleRef.current) {
          if (keysPressed.current["w"] && leftPaddleRef.current.position.z > -paddleLimit) {
            leftPaddleRef.current.position.z -= paddleSpeed;
          }
          if (keysPressed.current["s"] && leftPaddleRef.current.position.z < paddleLimit) {
            leftPaddleRef.current.position.z += paddleSpeed;
          }
          if (keysPressed.current["ArrowUp"] && rightPaddleRef.current.position.z > -paddleLimit) {
            rightPaddleRef.current.position.z -= paddleSpeed;
          }
          if (keysPressed.current["ArrowDown"] && rightPaddleRef.current.position.z < paddleLimit) {
            rightPaddleRef.current.position.z += paddleSpeed;
          }
        }

        // Mouvement de la balle
        if (ballRef.current) {
          ballRef.current.position.x += ballSpeed.x;
          ballRef.current.position.z += ballSpeed.z;

          // Rebond sur les murs horizontaux
          if (
            ballRef.current.position.z > tableHeight / 2 - 5 ||
            ballRef.current.position.z < -tableHeight / 2 + 5
          ) {
            ballSpeed.z *= -1;
          }

          // Rebond sur les paddles
          if (leftPaddleRef.current && rightPaddleRef.current) {
            if (
              (ballRef.current.position.x < -tableWidth / 2 + 15 &&
                Math.abs(ballRef.current.position.z - leftPaddleRef.current.position.z) < 40) ||
              (ballRef.current.position.x > tableWidth / 2 - 15 &&
                Math.abs(ballRef.current.position.z - rightPaddleRef.current.position.z) < 40)
            ) {
              ballSpeed.x *= -1;
            }
          }

          // Si un joueur marque un point
          if (ballRef.current.position.x > tableWidth / 2 || ballRef.current.position.x < -tableWidth / 2) {
            ballRef.current.position.set(0, 5, 0);
            ballSpeed.x = 2 * (Math.random() > 0.5 ? 1 : -1);
            ballSpeed.z = 2 * (Math.random() > 0.5 ? 1 : -1);
          }
        }

        rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
      };
      animate();

      if (mountRef.current && !mountRef.current.querySelector("canvas")) {
        mountRef.current.appendChild(rendererRef.current!.domElement);
      }

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, []);

  return <div ref={mountRef} />;
};

export default DuelComponent;
