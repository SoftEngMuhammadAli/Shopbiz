"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function OrbitalShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.3;
    meshRef.current.rotation.y += delta * 0.5;
  });

  return (
    <Float speed={1.6} rotationIntensity={1.1} floatIntensity={1.5}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.5, 0.45, 200, 32]} />
        <meshStandardMaterial color="#22d3ee" metalness={0.4} roughness={0.2} emissive="#0e7490" emissiveIntensity={0.35} />
      </mesh>
    </Float>
  );
}

export default function HeroCanvas() {
  return (
    <div className="h-[340px] w-full rounded-3xl border border-white/15 bg-gradient-to-br from-cyan-400/10 via-amber-300/5 to-slate-900 shadow-[0_30px_80px_-40px_rgba(34,211,238,0.75)] sm:h-[430px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 3, 2]} intensity={2.5} />
        <OrbitalShape />
        <Environment preset="city" />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.85} />
      </Canvas>
    </div>
  );
}

