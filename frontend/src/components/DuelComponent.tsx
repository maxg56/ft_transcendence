import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";


const DuelComponent: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const leftPaddleRef = useRef<THREE.Mesh | null>(null);
  const rightPaddleRef = useRef<THREE.Mesh | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);

  const [score, setScore] = useState({left: 0, right: 0});
  const [winner, setWinner] = useState<string | null>(null);

  // Dimensions
  const tableWidth = 400;
  const tableHeight = 200;
  const paddleSpeed = 3;
  const initialSpeed = 1;
  const maxSpeed = 3;
  const paddleLimit = tableHeight / 2 - 40;

  // États pour les mouvements
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  let ballSpeed = { x: initialSpeed, z: initialSpeed };
  // const ballAcceleration = 1.1;

  useEffect(() => {
    // Fonction pour gérer les événements de touche
    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current[event.key] = true;
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current[event.key] = false;
    };

    // Fonction de nettoyage
    const cleanup = () => {
      if (rendererRef.current) {
        rendererRef.current.dispose(); // Détruit le renderer
        rendererRef.current.domElement.remove(); // Supprime le canvas du DOM
        rendererRef.current = null;
      }

      if (sceneRef.current) {
        while (sceneRef.current.children.length > 0) {
          sceneRef.current.remove(sceneRef.current.children[0]); // Supprime tous les objets
        }
        sceneRef.current = null;
      }

      if (cameraRef.current) {
        cameraRef.current = null;
      }

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
      
    };

    // Nettoyage avant de recréer la scène
    cleanup();

    // Recréation de la scène, caméra, renderer, etc.
    if (!rendererRef.current)
    {
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
      rendererRef.current.shadowMap.enabled = true;
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);

      sceneRef.current = new THREE.Scene();

      sceneRef.current.background = new THREE.Color(0x141929); // Fond sombre  adddd
      //sceneRef.current.background = new THREE.Color(0x758695);

      cameraRef.current = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      
      cameraRef.current.position.set(0, 300, 150);
      cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0));

      // Ajouter les lumières
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
    }
    
    // Gestion des événements de touches
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);



    const resetBall = () => {
      if (ballRef.current)
      {
        ballRef.current.position.set(0, 5, 0); // Positionne la balle au centre
        ballSpeed.x = initialSpeed * (Math.random() > 0.5 ? -1 : +1); // Direction aléatoire en X
        ballSpeed.z = initialSpeed * (Math.random() > 0.5 ? -1 : +1); // Direction aléatoire en Z
      }
    };
    
    // Fonction d'animation
    const animate = () =>
    {
      if(winner)
        return;
      requestAnimationFrame(animate);
      // Mouvement des paddles
      if (leftPaddleRef.current && rightPaddleRef.current)
      {
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
      if (ballRef.current)
      {
        ballRef.current.position.x += ballSpeed.x;
        ballRef.current.position.z += ballSpeed.z;
      
        // Rebond sur les murs horizontaux
        if (ballRef.current.position.z > tableHeight / 2 - 5 || ballRef.current.position.z < -tableHeight / 2 + 5)
          ballSpeed.z *= -1;
      
        // Rebond sur les paddles
        // Rebond sur les paddles (avec effet de spin)
        if (leftPaddleRef.current && rightPaddleRef.current) {
          const ball = ballRef.current;

          // Vérifier collision avec le paddle gauche
          if (ball.position.x < -tableWidth / 2 + 15 && Math.abs(ball.position.z - leftPaddleRef.current.position.z) < 40) 
          {
            let angleApproche = Math.atan2(ballSpeed.z, ballSpeed.x);
            let impact = ball.position.z - leftPaddleRef.current.position.z; // Distance du centre du paddle
            let spin = impact * 0.05; // Plus l'impact est loin du centre, plus le spin est fort

            ballSpeed.x = Math.abs(ballSpeed.x) * 1.1; // Inversion et acceleration
            ballSpeed.z = Math.sin(angleApproche) * Math.abs(ballSpeed.x) + spin; // Ajout du spin

            ballSpeed.x = Math.min(ballSpeed.x, maxSpeed);
            ballSpeed.z = Math.min(Math.abs(ballSpeed.z), maxSpeed) * Math.sign(ballSpeed.z);
          }

          // Vérifier collision avec le paddle droit
          if (ball.position.x > tableWidth / 2 - 15 && Math.abs(ball.position.z - rightPaddleRef.current.position.z) < 40)
          {
            let angleApproche = Math.atan2(ballSpeed.z, ballSpeed.x);
            let impact = ball.position.z - rightPaddleRef.current.position.z;
            let spin = impact * 0.05;

            ballSpeed.x = -Math.abs(ballSpeed.x) * 1.1;
            ballSpeed.z = Math.sin(angleApproche) * Math.abs(ballSpeed.x) + spin;

            ballSpeed.x = Math.max(ballSpeed.x, -maxSpeed);
            ballSpeed.z = Math.min(Math.abs(ballSpeed.z), maxSpeed) * Math.sign(ballSpeed.z);
          }
        }
        if (ballRef.current.position.x > tableWidth / 2) {
          // Le joueur gauche marque un point
          setScore((prevScore) => ({ ...prevScore, left: prevScore.left + 1 }));
          resetBall();
        } else if (ballRef.current.position.x < -tableWidth / 2) {
          // Le joueur droit marque un point
          setScore((prevScore) => ({ ...prevScore, right: prevScore.right + 1 }));
          resetBall();
        }
        
        // Vérifiez si un joueur a gagné
        if (score.left >= 3) {
          setWinner("Joueur Gauche");
        } else if (score.right >= 3) {
          setWinner("Joueur Droit");
        }
        
      }
      

      rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
    };
    animate();

    return () => {
      cleanup(); // Nettoyage avant le démontage du composant
    };
  }, []); // Le tableau de dépendances vide pour exécuter cet effet une seule fois

  return (
    
    <>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-white">
        {winner ? (
          <div>
            <h2>{winner} a gagné !</h2>
          </div>
        ) : (
          <div>
            <span>Joueur Gauche : {score.left}</span> | <span>Joueur Droit : {score.right}</span>
          </div>
        )}
      </div>
      <div ref={mountRef} />
    </>
  );
  
};

export default DuelComponent;
