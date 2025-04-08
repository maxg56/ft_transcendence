import React, { useRef, useEffect, useState } from "react";
import useNavigation from "../hooks/useNavigation";
import * as THREE from "three";
import ControlsModal from "./ControlsOverlay";

const Game4Players: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);
  const paddlesRef = useRef<{
    left: THREE.Mesh;
    right: THREE.Mesh;
    top: THREE.Mesh;
    bottom: THREE.Mesh;
  } | null>(null);

  const [score, setScore] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });

  const lastPaddleTouched = useRef<string | null>(null);
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

  // Paramètres du jeu
  const size = 400; // Terrain carré
  const paddleSpeed = 8;
  const initialSpeed = 1.9;
  const maxSpeed = 8;
  const paddleLimit = size / 2 - 35;
  const accelerationSpeed = 1.3;
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  let ballSpeed = { x: initialSpeed, z: initialSpeed };
  const winningScore = 3;

  // Compte à rebours avant lancement
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

  // Création d'un background (exemple avec une couleur ou texture)
  const createBackground = (scene: THREE.Scene) => {
    scene.background = new THREE.Color(0x758695);
  };

  // Création de la table (terrain carré)
  const createTable = (scene: THREE.Scene, size: number): THREE.Mesh => {
    const geometry = new THREE.BoxGeometry(size, 10, size);
    const material = new THREE.MeshStandardMaterial({ color: 0x3b3b3b });
    const table = new THREE.Mesh(geometry, material);
    table.receiveShadow = true;
    table.position.y = -5;
    scene.add(table);
    return table;
  };

  // Création des pads pour 4 joueurs
  const createPaddles = (scene: THREE.Scene, size: number) => {
    const paddleGeometry = new THREE.BoxGeometry(10, 10, 65);
    const paddleMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });

    // Pad gauche
    const left = new THREE.Mesh(paddleGeometry, paddleMaterial);
    left.position.set(-size / 2 + 10, 5, 0);
    left.castShadow = true;
    scene.add(left);

    // Pad droit
    const right = new THREE.Mesh(paddleGeometry, paddleMaterial);
    right.position.set(size / 2 - 10, 5, 0);
    right.castShadow = true;
    scene.add(right);

    // Pour les pads haut et bas, on fait une rotation de 90° pour s'adapter
    const top = new THREE.Mesh(paddleGeometry, paddleMaterial);
    top.rotation.y = Math.PI / 2;
    top.position.set(0, 5, -size / 2 + 10);
    top.castShadow = true;
    scene.add(top);

    const bottom = new THREE.Mesh(paddleGeometry, paddleMaterial);
    bottom.rotation.y = Math.PI / 2;
    bottom.position.set(0, 5, size / 2 - 10);
    bottom.castShadow = true;
    scene.add(bottom);

    return { left, right, top, bottom };
  };

  // Création de la balle
  const createBall = (scene: THREE.Scene): THREE.Mesh => {
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      metalness: 0.6,
      roughness: 0.3,
    });
    const ball = new THREE.Mesh(geometry, material);
    ball.castShadow = true;
    ball.position.set(0, 5, 0);
    scene.add(ball);
    return ball;
  };

  // Initialisation de la scène
  const initializeScene = () => {
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current.shadowMap.enabled = true;
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);

    sceneRef.current = new THREE.Scene();
    createBackground(sceneRef.current);

    cameraRef.current = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current.position.set(0, 500, 500);
    cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0));

    // Lumières
    sceneRef.current.add(new THREE.AmbientLight(0xffffff, 0.4));
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 300, 100);
    directionalLight.castShadow = true;
    sceneRef.current.add(directionalLight);

    createTable(sceneRef.current, size);
    paddlesRef.current = createPaddles(sceneRef.current, size);
    ballRef.current = createBall(sceneRef.current);

    if (mountRef.current) {
      mountRef.current.appendChild(rendererRef.current.domElement);
    }
  };

  // Nettoyage de la scène
  const cleanup = () => {
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current.domElement.remove();
      rendererRef.current = null;
    }
    if (sceneRef.current) {
      while (sceneRef.current.children.length > 0) {
        sceneRef.current.remove(sceneRef.current.children[0]);
      }
      sceneRef.current = null;
    }
    if (cameraRef.current) cameraRef.current = null;
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
  };

  // Gestion des événements clavier
  const handleKeyDown = (event: KeyboardEvent) => {
    keysPressed.current[event.key] = true;
  };
  const handleKeyUp = (event: KeyboardEvent) => {
    keysPressed.current[event.key] = false;
  };

  // Réinitialisation de la balle
  const resetBall = () => {
    if (ballRef.current) {
      ballRef.current.position.set(0, 5, 0);
      ballSpeed.x = initialSpeed * (Math.random() > 0.5 ? -1 : 1);
      ballSpeed.z = initialSpeed * (Math.random() > 0.5 ? -1 : 1);
    }
  };

  // Boucle d'animation et logique du jeu
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    initializeScene();
  
    let gameRunning = true;
    let lastPadTouched = ""; // Suivi du dernier pad à avoir touché la balle
  
    const animate = () => {
      if (isPaused) return;
      if (!gameRunning || !gameStarted) return;
      requestAnimationFrame(animate);
  
      // Mouvements des pads
      if (paddlesRef.current) {
        const { left, right, top, bottom } = paddlesRef.current;
  
        // Pad gauche (déplacement sur l'axe z avec "w" et "s")
        if (keysPressed.current["w"] && left.position.z > -paddleLimit)
          left.position.z -= paddleSpeed;
        if (keysPressed.current["s"] && left.position.z < paddleLimit)
          left.position.z += paddleSpeed;
  
        // Pad droit (déplacement sur l'axe z avec "ArrowUp" et "ArrowDown")
        if (keysPressed.current["ArrowUp"] && right.position.z > -paddleLimit)
          right.position.z -= paddleSpeed;
        if (keysPressed.current["ArrowDown"] && right.position.z < paddleLimit)
          right.position.z += paddleSpeed;
  
        // Pad haut (déplacement sur l'axe x avec "5" et "6")
        if (keysPressed.current["5"] && top.position.x > -paddleLimit)
          top.position.x -= paddleSpeed;
        if (keysPressed.current["6"] && top.position.x < paddleLimit)
          top.position.x += paddleSpeed;
  
        // Pad bas (déplacement sur l'axe x avec "k" et "l")
        if (keysPressed.current["k"] && bottom.position.x > -paddleLimit)
          bottom.position.x -= paddleSpeed;
        if (keysPressed.current["l"] && bottom.position.x < paddleLimit)
          bottom.position.x += paddleSpeed;
      }
  
      // Mouvement de la balle
      if (ballRef.current) {
        ballRef.current.position.x += ballSpeed.x;
        ballRef.current.position.z += ballSpeed.z;
  
        // Collisions avec les pads et mise à jour du dernier pad touché
        if (paddlesRef.current && ballRef.current)
        {
          const { left, right, top, bottom } = paddlesRef.current;
          const ball = ballRef.current;
  
          
          if (ball.position.x < -size / 2 + 15 && Math.abs(ball.position.z - left.position.z) < 30)
          {
            let angle = Math.atan2(ballSpeed.z, ballSpeed.x);
            let impact = ball.position.z - left.position.z;
            let spin = impact * 0.05;
            ballSpeed.x = Math.abs(ballSpeed.x) * accelerationSpeed;
            ballSpeed.z = Math.sin(angle) * Math.abs(ballSpeed.x) + spin;
            ballSpeed.x = Math.min(ballSpeed.x, maxSpeed);
            ballSpeed.z =
              Math.min(Math.abs(ballSpeed.z), maxSpeed) * Math.sign(ballSpeed.z);
            lastPadTouched = "left";
          }
          
          if (ball.position.x > size / 2 - 15 && Math.abs(ball.position.z - right.position.z) < 30)
          {
            let angle = Math.atan2(ballSpeed.z, ballSpeed.x);
            let impact = ball.position.z - right.position.z;
            let spin = impact * 0.05;
            ballSpeed.x = -Math.abs(ballSpeed.x) * accelerationSpeed;
            ballSpeed.z = Math.sin(angle) * Math.abs(ballSpeed.x) + spin;
            ballSpeed.x = Math.max(ballSpeed.x, -maxSpeed);
            ballSpeed.z =
              Math.min(Math.abs(ballSpeed.z), maxSpeed) * Math.sign(ballSpeed.z);
            lastPadTouched = "right";
          }
  
          if (ball.position.z < -size / 2 + 15 && Math.abs(ball.position.x - top.position.x) < 30)
          {
            let angle = Math.atan2(ballSpeed.x, ballSpeed.z);
            let impact = ball.position.x - top.position.x;
            let spin = impact * 0.05;
            ballSpeed.z = Math.abs(ballSpeed.z) * accelerationSpeed;
            ballSpeed.x = Math.sin(angle) * Math.abs(ballSpeed.z) + spin;
            ballSpeed.z = Math.min(ballSpeed.z, maxSpeed);
            ballSpeed.x =
              Math.min(Math.abs(ballSpeed.x), maxSpeed) * Math.sign(ballSpeed.x);
            lastPadTouched = "top";
          }
          
          if (ball.position.z > size / 2 - 15 && Math.abs(ball.position.x - bottom.position.x) < 30)
          {
            let angle = Math.atan2(ballSpeed.x, ballSpeed.z);
            let impact = ball.position.x - bottom.position.x;
            let spin = impact * 0.05;
            ballSpeed.z = -Math.abs(ballSpeed.z) * accelerationSpeed;
            ballSpeed.x = Math.sin(angle) * Math.abs(ballSpeed.z) + spin;
            ballSpeed.z = Math.max(ballSpeed.z, -maxSpeed);
            ballSpeed.x =
              Math.min(Math.abs(ballSpeed.x), maxSpeed) * Math.sign(ballSpeed.x);
            lastPadTouched = "bottom";
          }
        }
  
        // Si la balle dépasse un bord, on attribue un point au dernier pad ayant touché la balle
        if (
          ballRef.current.position.x < -size / 2 ||
          ballRef.current.position.x > size / 2 ||
          ballRef.current.position.z < -size / 2 ||
          ballRef.current.position.z > size / 2
        ) {
          if (lastPadTouched) {
            setScore((prev) => {
              const newScore = { ...prev, [lastPadTouched]: prev[lastPadTouched] + 1 };
              // Vérification du score gagnant
              if (newScore[lastPadTouched] >= winningScore)
              {
                // On attribue un nom de joueur selon le pad
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
        onClick={openModal} >
        Contrôles
      </button>

      <ControlsModal isOpen={isModalOpen} onClose={closeModal} />
      <div ref={mountRef} className="w-full h-full" />
    </>
  );
};

export default Game4Players;