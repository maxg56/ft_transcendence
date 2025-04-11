import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import { Button3D } from './components/Button3D';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment } from '@react-three/drei';
import  useNavigation from "../hooks/useNavigation";
import { useTranslation } from "../context/TranslationContext";
import myFont from '../fonts/JustMyType-KePl.ttf';


export function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { t } = useTranslation();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= 0.03;
    }
  });

  return (
    <mesh ref={meshRef} position={[0.6, 1, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#3836C9" />
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={50} />
      
      {/* Front face */}
      <Text
        position={[0, 0, 1.01]}
        fontSize={0.6}
        color="#C4C4EA"
        anchorX="center"
        anchorY="middle"
        font={myFont}
        letterSpacing={0.1}
      >
        {t('SOLO')}
      </Text>
      
      {/* Back face */}
      <Text
        position={[0, 0, -1.01]}
        fontSize={0.6}
        color="#C4C4EA"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI, 0]}
        letterSpacing={0.1}
        font={myFont}
      >
        {t('DUEL')}
      </Text>
      
      {/* Right face */}
      <Text
        position={[1.01, 0, 0]}
        fontSize={0.6}
        color="#C4C4EA"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI / 2, 0]}
        letterSpacing={0.1}
        font={myFont}
      >
        {t('MULTI')}
      </Text>
      
      {/* Left face */}
      <Text
        position={[-1.01, 0, 0]}
        fontSize={0.6}
        color="#C4C4EA"
        anchorX="center"
        anchorY="middle"
        rotation={[0, -Math.PI / 2, 0]}
        letterSpacing={0.1}
        font={myFont}
      >
        {t('OTHER')}
      </Text>
    </mesh>
  );
}

function Scene() {
  const handleClick = (mode: string) => {
    console.log(`Selected mode: ${mode}`);
  };
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Stars radius={100} depth={50} count={5000} factor={4} fade />
      
      <RotatingCube />
      
      <group position={[0.7, -2, 0]}>
        <Button3D 
          text={t('SOLO')} 
          position={[-3, 0, 0]} 
          onClick={() => handleClick('multi')} 
        />
        <Button3D 
          text={t('DUEL')} 
          position={[-1, 0, 0]} 
          onClick={() => navigate("/duel")} 
        />
        <Button3D 
          text={t('MULTI')} 
          position={[1, 0, 0]} 
          onClick={() => handleClick('multi')} 
        />
        <Button3D 
          text={t('OTHER')} 
          position={[3, 0, 0]} 
          onClick={() => handleClick('other')} 
        />
      </group>
      
      <OrbitControls 
        enableZoom={true}
         minPolarAngle={Math.PI / 2.2}
        // maxPolarAngle={Math.PI / 2.2}
      />
    </>
  );
}

export function App() {
  return (
      <Canvas camera={{ position: [0, 4, 4] }}>
            <color attach="background" args={['#141929']} /> 
             <fog attach="fog" args={['#050505', 15, 15]} /> 
      
             <Environment preset="night" />
      
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 2, 5]} intensity={1} />
        <Scene />
      </Canvas>
  );
}

export default App;