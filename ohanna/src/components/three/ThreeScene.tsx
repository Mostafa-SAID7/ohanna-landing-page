import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, useProgress } from '@react-three/drei';

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(0)}%</Html>;
}

// A rotating torus‑knot as a lightweight placeholder (no external GLB needed)
function Model() {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
    }
  });
  return (
    <mesh ref={ref} scale={1.2}>
      <torusKnotGeometry args={[1, 0.4, 100, 16]} />
      <meshStandardMaterial color="#c89d29" metalness={0.5} roughness={0.2} />
    </mesh>
  );
}


export default function ThreeScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <Suspense fallback={<Loader />}> 
        <Model />
      </Suspense>
      <OrbitControls enableZoom={false} autoRotate={true} autoRotateSpeed={0.5} />
    </Canvas>
  );
}
