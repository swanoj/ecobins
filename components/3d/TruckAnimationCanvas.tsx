"use client";

import { ContactShadows, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { StylizedCustomBin } from "./StylizedCustomBin";

// ─── Sub-component: Loaded Real Bin 3D Model ───────────────────────────────
function RealBin({ position = [0, 0, 0] as [number, number, number], scale = 0.55 }) {
  const { scene } = useGLTF("/models/bin.glb");
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);
  
  // Ensure the model materials look high-end and shiny
  React.useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = 0.25;
          mat.metalness = 0.15;
        }
      }
    });
  }, [clonedScene]);

  // Rotate model so it faces the camera/street beautifully
  return (
    <primitive 
      object={clonedScene} 
      position={position} 
      scale={[scale, scale, scale]} 
      rotation={[0, Math.PI / 1.1, 0]}
    />
  );
}

// ─── Sub-component: Loaded Real Truck 3D Model ──────────────────────────────
interface RealTruckProps {
  isPlaying: boolean;
  onArrived: () => void;
}

function RealTruck({ isPlaying, onArrived }: RealTruckProps) {
  const { scene } = useGLTF("/models/truck.glb");
  const truckRef = useRef<THREE.Group>(null);
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = 0.3;
          mat.metalness = 0.2;
        }
      }
    });
  }, [clonedScene]);

  useFrame((state, delta) => {
    if (!truckRef.current) return;

    const targetX = 0.45; // stopping point in front of bins
    
    if (isPlaying && truckRef.current.position.x > targetX) {
      // Smoothly drive in from right
      truckRef.current.position.x -= delta * 2.8;
      
      // Simulating slight engine vibration/driving bounce
      truckRef.current.position.y = -1.1 + Math.sin(state.clock.getElapsedTime() * 18) * 0.012;
      
      // Subtle pitch tilt during driving
      truckRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 18) * 0.003;
    } else if (isPlaying && !arrived) {
      // Settle at stopping point
      truckRef.current.position.x = targetX;
      truckRef.current.position.y = -1.1;
      truckRef.current.rotation.z = 0;
      setArrived(true);
      onArrived();
    }
  });

  return (
    <group 
      ref={truckRef} 
      position={[5.5, -1.1, 0.4]} // Start off-screen
      rotation={[0, -Math.PI / 2, 0]} // Turn to face left (driving down the street)
    >
      <primitive object={clonedScene} scale={[0.5, 0.5, 0.5]} />
    </group>
  );
}

// ─── Sub-component: Hydraulic Water Spray Particles ────────────────────────
function SprayParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Custom particle physics loop
  useFrame((state, delta) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        // Spray shoots outwards from truck hydraulic mechanism to the bin position
        positions[i] -= (0.4 + Math.random() * 0.3) * (delta * 6); // Move X leftwards
        positions[i + 1] -= (0.1 + Math.random() * 0.35) * (delta * 3); // Gravity Y fall
        positions[i + 2] += (Math.random() - 0.5) * (delta * 1.5); // Spread Z drift
        
        // Reset particle to truck nozzles once it hits the ground or goes too far
        if (positions[i + 1] < -1.1 || positions[i] < -0.8) {
          positions[i] = 0.35; // Start near truck lift arm
          positions[i + 1] = -0.3; // Nozzle height
          positions[i + 2] = 0.15; // Centered
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const count = 120;
  const initialPositions = React.useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = 0.35;
      arr[i * 3 + 1] = -0.3;
      arr[i * 3 + 2] = 0.15;
    }
    return arr;
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initialPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#bae6fd" // Soft water blue splash
        size={0.06}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Sub-component: Suburb Environment Backdrop ─────────────────────────────
function SuburbBackdrop() {
  const texture = useTexture("/assets/australian-suburb.webp");
  
  return (
    <mesh position={[0, 1.4, -4.8]} scale={[8.8, 5.0, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

// ─── Main Interactive Canvas Component ───────────────────────────────────────
export function TruckAnimationCanvas() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isWashing, setIsWashing] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const handleArrived = () => {
    setIsWashing(true);
  };

  const handleReset = () => {
    setIsWashing(false);
    setIsPlaying(true);
    setAnimationKey((prev) => prev + 1);
  };

  return (
    <div className="relative w-full h-[360px] md:h-[480px] rounded-[24px] overflow-hidden bg-gradient-to-b from-sky-100 to-slate-100 border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 0.4, 4.2], fov: 42 }}
        gl={{ antialias: true }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.8} />
        
        {/* Sunny daylight direction */}
        <directionalLight
          position={[5, 8, 4]}
          intensity={1.25}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />
        
        {/* Soft fill light */}
        <directionalLight position={[-5, 3, -1]} intensity={0.4} />

        <Suspense fallback={null}>
          <SuburbBackdrop />
          
          {/* Virtual Ground/Street Plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.105, 0]} receiveShadow>
            <planeGeometry args={[15, 10]} />
            <shadowMaterial opacity={0.3} />
          </mesh>

          {/* Render 2 Bins out front of the driveway */}
          {/* Bin 1: Real Baked Scan (dark green) */}
          <RealBin position={[-0.8, -1.1, -0.25]} scale={0.52} />
          
          {/* Bin 2: Dynamic Procedural Red-Lid Bin (requested by user) */}
          <group position={[-1.35, -1.1, -0.4]} rotation={[0, Math.PI / 1.05, 0]}>
            <StylizedCustomBin 
              lidColor="#EF4444" // Duplicated with a beautiful RED lid as requested!
              bodyColor="#1b4d3e" 
              scale={0.33} 
              isOpen={isWashing} // Opens lid dynamically during wash cycle!
            />
          </group>

          {/* Clean Truck model */}
          <RealTruck 
            key={animationKey} 
            isPlaying={isPlaying} 
            onArrived={handleArrived} 
          />

          {/* Active spray effect during wash cycle */}
          {isWashing && <SprayParticles />}

          <ContactShadows
            position={[0, -1.1, 0]}
            opacity={0.32}
            scale={10}
            blur={1.8}
            far={2.0}
          />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.9}
        />
      </Canvas>

      {/* Floating Canvas UI Controls */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-emerald-500 text-white shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Live 3D Animation
        </span>
        <h4 className="text-[16px] text-slate-800 font-extrabold mt-2 drop-shadow-sm">
          Eco Bin Wash Day Demo
        </h4>
        <p className="text-[11px] text-slate-500 hidden sm:block mt-0.5">
          Real truck &amp; bin models · Drag to orbit street view
        </p>
      </div>

      {/* Action triggers */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
        {isWashing && (
          <span className="px-3 py-1.5 rounded-lg text-[11px] font-extrabold bg-blue-500 text-white animate-pulse flex items-center gap-1.5 shadow-sm">
            💧 Sanitising Wash...
          </span>
        )}
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-full text-[12px] font-extrabold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-md transition-all hover:scale-105"
        >
          Replay Drive-Up
        </button>
      </div>
    </div>
  );
}

useGLTF.preload("/models/bin.glb");
useGLTF.preload("/models/truck.glb");
