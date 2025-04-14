import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import myFont from '../../fonts/JustMyType-KePl.ttf';

interface Button3DProps {
  text: string;
  position: [number, number, number];
  onClick?: () => void;
}

export function Button3D({ text, position, onClick }: Button3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const targetScale = hovered ? 1.2 : 1;
  const targetColor = hovered ? new THREE.Color('#0704C3') : new THREE.Color('#636291');

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smoothly animate scale
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10);

      // Smoothly animate color
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.color.lerp(targetColor, delta * 10);

      // Add subtle rotation
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    
     }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        rotation={[0.1, 0, 0]}
      >
        <boxGeometry args={[1.5, 1.5, 0.2]} />
        <meshStandardMaterial color={'#4846BF'} metalness={0.5} roughness={0.2} />
      </mesh>
      <Text
        position={[0, 0, 0.15]}
        fontSize={0.4}
        color="#E6E5FF"
        anchorX="center"
        anchorY="middle"
        rotation={[0.1, 0, 0]}
        letterSpacing={0.1}
        font={myFont}
      >
        {text}
      </Text>
    </group>
  );
}
