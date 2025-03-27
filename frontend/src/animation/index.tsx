import React, { useRef } from "react";
import ReactDOM from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "./cube.css";

export const Box: React.FC = () => {
  const boxRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh
      ref={boxRef}
      rotation-x={Math.PI * 0.9}
      rotation-z={0.15}
      rotation-y={0.3}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={"pink"} />
    </mesh>
  );
};

export const App: React.FC = () => {
  return (
    <Canvas style={{ height: 450, width: 400 }}>
      <ambientLight intensity={1.1} />
      <pointLight position={[5, 5, 5]} intensity={150} />
      <Box />
    </Canvas>
  );
};

// export const root = document.getElementById("root");
// if (root) {
//   ReactDOM.createRoot(root).render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   );
// }
