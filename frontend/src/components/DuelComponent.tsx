import React, { useRef, useEffect, useState } from "react";
import useNavigation from "../hooks/useNavigation";
import * as THREE from "three";

const DuelComponent: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const leftPaddleRef = useRef<THREE.Mesh | null>(null);
  const rightPaddleRef = useRef<THREE.Mesh | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);

  const [score, setScore] = useState({ left: 0, right: 0 });
  const [winner, setWinner] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Le compte à rebours démarre à 3 secondes (null = pas de compte à rebours)
  const [countdown, setCountdown] = useState<number | null>(3);
  // Permet de forcer la réinitialisation complète de la scène
  const [resetKey, setResetKey] = useState(0);

  const {navigate} = useNavigation();

  // Dimensions et constantes
  const tableWidth = 400;
  const tableHeight = 200;
  const paddleSpeed = 3;
  const initialSpeed = 1.9;
  const maxSpeed = 3;
  const paddleLimit = tableHeight / 2 - 40;

  // États pour les mouvements
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  let ballSpeed = { x: initialSpeed, z: initialSpeed };

  // Gestion du compte à rebours
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      // Fin du compte à rebours : démarrer le jeu
      setGameStarted(true);
      setCountdown(null);
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Fonction d'initialisation de la scène
  const initializeScene = () => {
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current.shadowMap.enabled = true;
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);

    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(0x758695);

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
    const paddleGeometry = new THREE.BoxGeometry(10, 10, 65);
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
      metalness: 0.6,
      roughness: 0.3,
    });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.castShadow = true;
    ball.position.set(0, 5, 0);
    sceneRef.current.add(ball);
    ballRef.current = ball;

    if (mountRef.current)
      mountRef.current.appendChild(rendererRef.current.domElement);
  };

  // Fonction de nettoyage de la scène
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
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
  };

  // Gestion des touches
  const handleKeyDown = (event: KeyboardEvent) => {
    keysPressed.current[event.key] = true;
  };
  const handleKeyUp = (event: KeyboardEvent) => {
    keysPressed.current[event.key] = false;
  };

  // useEffect pour initialiser la scène et lancer l'animation,
  // le tout en fonction de resetKey (pour le redémarrage)
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    initializeScene();

    let gameRunning = true;
    const resetBall = () => {
      if (ballRef.current) {
        ballRef.current.position.set(0, 5, 0);
        ballSpeed.x = initialSpeed * (Math.random() > 0.5 ? -1 : 1);
        ballSpeed.z = initialSpeed * (Math.random() > 0.5 ? -1 : 1);
      }
    };

    const animate = () => {
      if (!gameRunning || !gameStarted) return;
      requestAnimationFrame(animate);

      // Mouvements des paddles
      if (leftPaddleRef.current && rightPaddleRef.current) {
        if (keysPressed.current["w"] && leftPaddleRef.current.position.z > -paddleLimit)
          leftPaddleRef.current.position.z -= paddleSpeed;
        if (keysPressed.current["s"] && leftPaddleRef.current.position.z < paddleLimit)
          leftPaddleRef.current.position.z += paddleSpeed;
        if (keysPressed.current["ArrowUp"] && rightPaddleRef.current.position.z > -paddleLimit)
          rightPaddleRef.current.position.z -= paddleSpeed;
        if (keysPressed.current["ArrowDown"] && rightPaddleRef.current.position.z < paddleLimit)
          rightPaddleRef.current.position.z += paddleSpeed;
      }

      // Mouvement de la balle
      if (ballRef.current) {
        ballRef.current.position.x += ballSpeed.x;
        ballRef.current.position.z += ballSpeed.z;

        if (
          ballRef.current.position.z > tableHeight / 2 - 5 ||
          ballRef.current.position.z < -tableHeight / 2 + 5
        )
          ballSpeed.z *= -1;

        if (leftPaddleRef.current && rightPaddleRef.current) {
          const ball = ballRef.current;
          if (
            ball.position.x < -tableWidth / 2 + 15 &&
            Math.abs(ball.position.z - leftPaddleRef.current.position.z) < 40
          ) {
            let angleApproche = Math.atan2(ballSpeed.z, ballSpeed.x);
            let impact = ball.position.z - leftPaddleRef.current.position.z;
            let spin = impact * 0.05;
            ballSpeed.x = Math.abs(ballSpeed.x) * 1.2;
            ballSpeed.z = Math.sin(angleApproche) * Math.abs(ballSpeed.x) + spin;
            ballSpeed.x = Math.min(ballSpeed.x, maxSpeed);
            ballSpeed.z = Math.min(Math.abs(ballSpeed.z), maxSpeed) * Math.sign(ballSpeed.z);
          }
          if (
            ball.position.x > tableWidth / 2 - 15 &&
            Math.abs(ball.position.z - rightPaddleRef.current.position.z) < 40
          ) {
            let angleApproche = Math.atan2(ballSpeed.z, ballSpeed.x);
            let impact = ball.position.z - rightPaddleRef.current.position.z;
            let spin = impact * 0.05;
            ballSpeed.x = -Math.abs(ballSpeed.x) * 1.2;
            ballSpeed.z = Math.sin(angleApproche) * Math.abs(ballSpeed.x) + spin;
            ballSpeed.x = Math.max(ballSpeed.x, -maxSpeed);
            ballSpeed.z = Math.min(Math.abs(ballSpeed.z), maxSpeed) * Math.sign(ballSpeed.z);
          }
        }

        if (ballRef.current.position.x > tableWidth / 2) {
          setScore((prev) => {
            const newScore = { ...prev, left: prev.left + 1 };
            if (newScore.left >= 3) {
              setWinner("Joueur 1");
              gameRunning = false;
            }
            return newScore;
          });
          resetBall();
        } else if (ballRef.current.position.x < -tableWidth / 2) {
          setScore((prev) => {
            const newScore = { ...prev, right: prev.right + 1 };
            if (newScore.right >= 3) {
              setWinner("Joueur 2");
              gameRunning = false;
            }
            return newScore;
          });
          resetBall();
        }
      }

      rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
    };
    animate();

    return () => {
      gameRunning = false;
      cleanup();
    };
  }, [resetKey, gameStarted]);

  // Fonction de réinitialisation qui réinitialise le score, le gagnant,
  // remet le compte à rebours et force le redémarrage de la scène.
  const resetGame = () => {
    setScore({ left: 0, right: 0 });
    setWinner(null);
    setGameStarted(false);
    setCountdown(3);
    setResetKey((prev) => prev + 1);
  };

  return (
    <>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-black text-2xl">
        {winner ? (
          <div className="flex flex-col items-center">
            <h2>{winner} a gagné !</h2>
            <div>
              <button
                className="mt-2 px-3 py-1 rounded bg-gray-300 text-black hover:bg-gray-200 inline-block mr-4"
                onClick={resetGame}
              >
                Restart
              </button>
              <button
                className="mt-2 px-3 py-1 rounded bg-gray-300 text-black hover:bg-gray-200 inline-block"
                onClick={() => navigate("/hub")}
              >
                Retour au menu
              </button>
            </div>
          </div>
        ) : (
          <div>
            <span>Joueur 1 : {score.left}</span> |{" "}
            <span>Joueur 2 : {score.right}</span>
          </div>
        )}
      </div>
      {/* Affichage du compte à rebours au centre tant que countdown n'est pas null */}
      {countdown !== null && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-4xl ">
          <h2>Lancement dans {countdown}...</h2>
        </div>
      )}
      <div ref={mountRef} />
    </>
  );
};

export default DuelComponent;
