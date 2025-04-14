import React, { useRef, useEffect, useState } from "react";
import useNavigation from "../hooks/useNavigation";
import * as THREE from "three";
import ControlsModal from "./ControlsOverlay";

const DuelComponent: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const leftPaddleRef = useRef<THREE.Mesh | null>(null);
  const rightPaddleRef = useRef<THREE.Mesh | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);

  const [score, setScore] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const [winner, setWinner] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(3);
  const [resetKey, setResetKey] = useState(0);

  const { navigate } = useNavigation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    setIsPaused(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsPaused(false);
  };

  // Dimensions et constantes
  const tableWidth = 400;
  const tableHeight = 200;
  const paddleSpeed = 6;
  const initialSpeed = 1.9;
  const maxSpeed = 8;
  const paddleLimit = tableHeight / 2 - 30;
  const accelerationSpeed = 1.3;
  const winningScore = 3;
  // État pour le suivi des touches
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  let ballSpeed = { x: initialSpeed, z: initialSpeed };

  // Compte à rebours
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setGameStarted(true);
      setCountdown(null);
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Initialisation de la scène
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
    const paddleGeometry = new THREE.BoxGeometry(10, 10, 59);
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

  // Nettoyage de la scène
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

  // Fonction de réinitialisation de la balle
  const resetBall = () => {
    if (ballRef.current) {
      ballRef.current.position.set(0, 5, 0);
      ballSpeed.x = initialSpeed * (Math.random() > 0.5 ? -1 : 1);
      ballSpeed.z = initialSpeed * (Math.random() > 0.5 ? -1 : 1);
    }
  };

  // Boucle d'animation avec gestion complète de la pause (freeze total)
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    initializeScene();

    let gameRunning = true;
    let lastPadTouched = ""; // Pour suivre le dernier paddle ayant touché la balle

    const animate = () => {
      // Si le jeu est en pause, on ne fait rien et on ne relance pas la boucle
      if (isPaused) return;
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

        // Rebonds sur le bord haut/bas
        if (ballRef.current.position.z > tableHeight / 2 - 5 ||
            ballRef.current.position.z < -tableHeight / 2 + 5)
          ballSpeed.z *= -1;

        // Collisions avec les paddles et suivi du dernier paddle touché
        if (ballRef.current && leftPaddleRef.current && rightPaddleRef.current) {
          const ball = ballRef.current;
          if (ball.position.x < -tableWidth / 2 + 15 && Math.abs(ball.position.z - leftPaddleRef.current.position.z) < 40) {
            let angleApproche = Math.atan2(ballSpeed.z, ballSpeed.x);
            let impact = ball.position.z - leftPaddleRef.current.position.z;
            let spin = impact * 0.05;
            ballSpeed.x = Math.abs(ballSpeed.x) * accelerationSpeed;
            ballSpeed.z = Math.sin(angleApproche) * Math.abs(ballSpeed.x) + spin;
            ballSpeed.x = Math.min(ballSpeed.x, maxSpeed);
            ballSpeed.z = Math.min(Math.abs(ballSpeed.z), maxSpeed) * Math.sign(ballSpeed.z);
            lastPadTouched = "left";
          }
          if (ball.position.x > tableWidth / 2 - 15 && Math.abs(ball.position.z - rightPaddleRef.current.position.z) < 40) {
            let angleApproche = Math.atan2(ballSpeed.z, ballSpeed.x);
            let impact = ball.position.z - rightPaddleRef.current.position.z;
            let spin = impact * 0.05;
            ballSpeed.x = -Math.abs(ballSpeed.x) * accelerationSpeed;
            ballSpeed.z = Math.sin(angleApproche) * Math.abs(ballSpeed.x) + spin;
            ballSpeed.x = Math.max(ballSpeed.x, -maxSpeed);
            ballSpeed.z = Math.min(Math.abs(ballSpeed.z), maxSpeed) * Math.sign(ballSpeed.z);
            lastPadTouched = "right";
          }
        }

        // Attribution du score si la balle sort complètement (par x ou z)
        if (
          ballRef.current.position.x < -tableWidth / 2 ||
          ballRef.current.position.x > tableWidth / 2 ||
          ballRef.current.position.z < -tableHeight / 2 ||
          ballRef.current.position.z > tableHeight / 2
        ) {
          if (lastPadTouched) {
            setScore((prev) => {
              const newScore = { ...prev, [lastPadTouched]: prev[lastPadTouched] + 1 };
              if (newScore[lastPadTouched] >= winningScore) {
                let winnerName = "";
                if (lastPadTouched === "left") winnerName = "Joueur 1";
                else if (lastPadTouched === "right") winnerName = "Joueur 2";
                else if (lastPadTouched === "top") winnerName = "Joueur 3";
                else if (lastPadTouched === "bottom") winnerName = "Joueur 4";
                setWinner(winnerName);
                gameRunning = false;
              }
              return newScore;
            });
          }
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
  }, [resetKey, gameStarted, isPaused]);

  // Pour relancer la boucle d'animation quand isPaused passe à false
  useEffect(() => {
    if (!isPaused && gameStarted) {
      // Relancez l'animation après la pause
      // On utilise ici une fonction anonyme pour démarrer la boucle
      requestAnimationFrame(() => {
        // Il faut refaire appel à animate() via le useEffect initial,
        // donc on modifie resetKey pour forcer la re-création de la boucle.
        setResetKey((prev) => prev + 1);
      });
    }
  }, [isPaused, gameStarted]);

  const resetGame = () => {
    setScore({ left: 0, right: 0, top: 0, bottom: 0 });
    setWinner(null);
    setGameStarted(false);
    setCountdown(3);
    setResetKey((prev) => prev + 1);
  };

  return (
    <>
      <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 text-black text-2xl">
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
            <span>Gauche : {score.left}</span> |{" "}
            <span>Droite : {score.right}</span> |{" "}
            <span>Haut : {score.top}</span> |{" "}
            <span>Bas : {score.bottom}</span>
          </div>
        )}
      </div>

      {countdown !== null && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-4xl">
          <h2>Lancement dans {countdown}...</h2>
        </div>
      )}

      <button
        className="absolute center-left[20%] right-4 z-50 bg-white/80 text-black font-semibold px-4 py-2 rounded-lg shadow"
        onClick={openModal}
      >
        Contrôles
      </button>

      <ControlsModal isOpen={isModalOpen} onClose={closeModal} />
      <div ref={mountRef} className="w-full h-full" />
    </>
  );
};

export default DuelComponent;