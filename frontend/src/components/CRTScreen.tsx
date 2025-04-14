import { Canvas, useFrame } from '@react-three/fiber';
import {
  EffectComposer,
  ChromaticAberration,
  Noise,
  Vignette,
  Bloom,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useRef } from 'react';
import * as THREE from 'three';
import { TextureLoader, RepeatWrapping } from 'three';
import { useLoader } from '@react-three/fiber';

const CRTOverlay = () => {
  const ref = useRef<THREE.Mesh>(null!);
  const scanlineTexture = useLoader(TextureLoader, '/textures/scanlines.png'); // Needs actual file
//   const grungeTexture = useLoader(TextureLoader, '/textures/grunge.png'); // Needs actual file

  scanlineTexture.wrapS = scanlineTexture.wrapT = RepeatWrapping;
  scanlineTexture.repeat.set(4, 4);
//   grungeTexture.wrapS = grungeTexture.wrapT = RepeatWrapping;
//   grungeTexture.repeat.set(1.5, 1.5);

  return (
    <mesh ref={ref} position={[0, 0, 0.5]}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial
        map={scanlineTexture}
        transparent
        opacity={0.1}
        depthWrite={false}
      />
      {/* <meshBasicMaterial
        map={grungeTexture}
        transparent
        opacity={0.15}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      /> */}
    </mesh>
  );
};

const CRTScreenEffects = () => {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.5} intensity={0.3} />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.0025, 0.0012]}
      />
      <Noise premultiply blendFunction={BlendFunction.ADD} />
      <Vignette offset={0.4} darkness={1.2} />
    </EffectComposer>
  );
};

export function CRTScreen({ children }: { children?: React.ReactNode }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 70 }}>
      <color attach="background" args={['#111']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.2} />
      {children}
      <CRTOverlay />
      <CRTScreenEffects />
    </Canvas>
  );
}