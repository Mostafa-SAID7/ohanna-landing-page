import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useProgress, Html } from '@react-three/drei';

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(0)}%</Html>;
}

function Model() {
  const { scene } = useGLTF('/models/example.glb');
  return <primitive object={scene} />;
}

export default function ThreeScene() {
  return (
    <Canvas>
      <Suspense fallback={<Loader />}>
        <Model />
      </Suspense>
    </Canvas>
  );
}
