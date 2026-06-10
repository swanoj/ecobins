"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// ─── 1. WEBGL SHADER: Dirt Eraser Custom Shader Materials
// ─────────────────────────────────────────────────────────────────────────────

const DirtEraserShader = {
  uniforms: {
    u_cleanProgress: { value: 0.0 },
    u_time: { value: 0.0 },
    u_lightPos: { value: new THREE.Vector3(5.0, 5.0, 5.0) },
    u_colorClean: { value: new THREE.Color("#10b981") }, // Emerald green
    u_colorDirt: { value: new THREE.Color("#4a3728") },   // Brownish grime
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    uniform float u_cleanProgress;
    uniform float u_time;
    uniform vec3 u_lightPos;
    uniform vec3 u_colorClean;
    uniform vec3 v_colorClean;
    uniform vec3 u_colorDirt;

    // Standard 2D noise for organic dirt patterns
    float noise(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    float smoothNoise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      
      float a = noise(i);
      float b = noise(i + vec2(1.0, 0.0));
      float c = noise(i + vec2(0.0, 1.0));
      float d = noise(i + vec2(1.0, 1.0));

      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * f.x * f.y;
    }

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(u_lightPos - vWorldPosition);
      vec3 viewDir = normalize(vViewPosition);
      
      // Procedural dirt noise density
      float grime = smoothNoise(vUv * 10.0) * 0.7 + smoothNoise(vUv * 25.0) * 0.3;
      
      // Sweep cleaning line along Y height (ranges from -1.0 to 1.0 roughly)
      // Normalise height between 0.0 and 1.0
      float normalizedHeight = (vWorldPosition.y + 0.6) / 1.2;
      
      // Eraser sweep boundary transition
      float sweep = smoothstep(u_cleanProgress - 0.1, u_cleanProgress + 0.1, normalizedHeight);
      
      // Mix clean vs. dirt textures
      vec3 baseColor = mix(u_colorClean, u_colorDirt + vec3(grime * 0.15), sweep);
      
      // Diffuse Lambertian reflection
      float diff = max(dot(normal, lightDir), 0.0);
      vec3 diffuse = diff * baseColor;
      
      // Specular Phong highlights (higher shininess on clean plastic)
      vec3 halfDir = normalize(lightDir + viewDir);
      float specStrength = mix(0.5, 0.05, sweep); // Shiny clean plastic vs. rough dirt
      float shininess = mix(32.0, 4.0, sweep);
      float spec = pow(max(dot(normal, halfDir), 0.0), shininess) * specStrength;
      vec3 specular = vec3(spec);
      
      // Ambient glow
      vec3 ambient = vec3(0.12) * baseColor;
      
      gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
    }
  `
};

// ─────────────────────────────────────────────────────────────────────────────
// ─── 2. PROCEDURAL 3D BIN MODEL
// ─────────────────────────────────────────────────────────────────────────────

interface ProceduralBinProps {
  lidAngle?: number;          // Degrees to rotate lid open
  cleanliness?: number;       // 0 to 1 for shader
  colorBody?: string;
  colorLid?: string;
  scale?: number;
  useCustomShader?: boolean;
}

function ProceduralBin({
  lidAngle = 0,
  cleanliness = 0,
  colorBody = "#10b981",
  colorLid = "#EF4444",
  scale = 1.0,
  useCustomShader = false,
}: ProceduralBinProps) {
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);

  // Update cleanliness in the shader uniform
  useFrame((state) => {
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.u_cleanProgress.value = cleanliness;
      shaderMaterialRef.current.uniforms.u_time.value = state.clock.getElapsedTime();
    }
  });

  const bodyMaterial = useMemo(() => {
    if (useCustomShader) {
      return new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.clone(DirtEraserShader.uniforms),
        vertexShader: DirtEraserShader.vertexShader,
        fragmentShader: DirtEraserShader.fragmentShader,
      });
    }
    return new THREE.MeshStandardMaterial({
      color: colorBody,
      roughness: 0.2,
      metalness: 0.1,
    });
  }, [useCustomShader, colorBody]);

  return (
    <group scale={[scale, scale, scale]}>
      {/* Bin Body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 1.2, 0.8]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>

      {/* Bin Wheels */}
      <mesh castShadow position={[-0.32, -0.6, 0.32]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0.32, -0.6, 0.32]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Bin Handle Bar */}
      <mesh castShadow position={[0, 0.5, -0.45]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>

      {/* Bin Lid (Hinged at the rear-top handlebar coordinates) */}
      <group position={[0, 0.6, -0.4]} rotation={[lidAngle * (Math.PI / 180), 0, 0]}>
        <mesh castShadow position={[0, 0.03, 0.4]}>
          <boxGeometry args={[0.82, 0.06, 0.82]} />
          <meshStandardMaterial color={colorLid} roughness={0.3} metalness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── 3. SHOWCASE 1: Cinematic Scrollytelling
// ─────────────────────────────────────────────────────────────────────────────

function ScrollytellingDemo({ scrollValue = 0 }) {
  const containerRef = useRef<THREE.Group>(null);

  // Animate elements, camera and lid hinge based on the scroll scrubber
  useFrame((state) => {
    // 0 to 1 value smoothly controls camera position and rotational pathing
    const angle = scrollValue * Math.PI * 0.9;
    const radius = 3.6;
    
    // Smooth cinematic zoom and sweep orbit
    state.camera.position.x = Math.sin(angle) * radius;
    state.camera.position.z = Math.cos(angle) * radius;
    state.camera.position.y = THREE.MathUtils.lerp(0.5, 1.5, scrollValue);
    state.camera.lookAt(0, 0.1, 0);
  });

  // Calculate procedural lid opening angle as camera dives in
  const lidAngle = scrollValue > 0.45 ? Math.min(105, (scrollValue - 0.45) * 200) : 0;

  return (
    <group ref={containerRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <ProceduralBin 
        lidAngle={lidAngle} 
        colorBody="#1b4d3e" 
        colorLid="#10b981" 
        scale={0.9} 
      />
      
      {/* Dynamic Floating Sparkles inside bin that reveal when lid opens */}
      {scrollValue > 0.6 && (
        <group position={[0, 0.6, 0]}>
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#6ee7b7" />
          </mesh>
          <mesh position={[0.2, 0.3, -0.1]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[-0.15, 0.25, 0.15]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#a7f3d0" />
          </mesh>
        </group>
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── 4. SHOWCASE 2: Hydraulic Physics Lift
// ─────────────────────────────────────────────────────────────────────────────

function HydraulicsDemo({ progress = 0 }) {
  const liftArmGroupRef = useRef<THREE.Group>(null);
  
  // Scrubber maps values 0 to 1 onto lifter bone positions
  // Kinematic joint mappings:
  // Phase 1 (0 to 0.4): Arm sweeps outwards
  // Phase 2 (0.4 to 0.8): Arm lifts and turns bin upside down
  // Phase 3 (0.8 to 1.0): Arm settles inside washbay
  
  const armRotZ = progress * -Math.PI * 0.72; // Lift tilt
  const binRotZ = progress * Math.PI * 0.82; // Invert tilt so bin tips upside down
  
  // Procedural lift arm path coordination
  const armPosX = THREE.MathUtils.lerp(0.8, -0.2, progress);
  const armPosY = Math.sin(progress * Math.PI) * 0.9 - 0.2;

  return (
    <group position={[0.3, 0, 0]}>
      {/* Procedural Wash Truck Rear Chamber */}
      <mesh position={[1.4, 0.1, 0]} castShadow>
        <boxGeometry args={[1.6, 2.0, 1.4]} />
        <meshStandardMaterial color="#0c4a6e" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Wash Bay Inlet Hatch */}
      <mesh position={[0.55, 0.1, 0]}>
        <boxGeometry args={[0.11, 1.4, 1.1]} />
        <meshStandardMaterial color="#0284c7" roughness={0.2} />
      </mesh>

      {/* Hydraulic Lift Arm Pivot */}
      <group position={[armPosX, armPosY, 0]} rotation={[0, 0, armRotZ]} ref={liftArmGroupRef}>
        {/* Metal Lift Beam */}
        <mesh castShadow position={[0.3, 0, 0]}>
          <boxGeometry args={[0.6, 0.1, 0.1]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Clamps holding bin */}
        <mesh castShadow position={[0.6, 0, 0]}>
          <boxGeometry args={[0.1, 0.2, 0.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>

        {/* Tipped Wheelie Bin */}
        <group position={[0.6, -0.4, 0]} rotation={[0, 0, binRotZ]}>
          <ProceduralBin 
            lidAngle={progress > 0.65 ? 85 : 0} 
            colorBody="#111827" 
            colorLid="#f43f5e" 
            scale={0.55} 
          />
        </group>
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── 5. SHOWCASE 3: GLSL Dirt Eraser Shader Page
// ─────────────────────────────────────────────────────────────────────────────

function ShaderEraserDemo({ progress = 0 }) {
  return (
    <group rotation={[0, Math.PI / 4, 0]}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 4]} intensity={1.5} castShadow />
      
      {/* Procedural Bin loading Custom Fragment/Vertex Shaders */}
      <ProceduralBin 
        cleanliness={progress} 
        lidAngle={20} 
        scale={0.9} 
        useCustomShader={true} 
      />
      
      {/* Visual Nozzle Sweeper following clean progress */}
      <group position={[0, THREE.MathUtils.lerp(-0.7, 0.7, progress), 0.6]}>
        {/* Shiny Nozzle Beam */}
        <mesh castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.2} />
        </mesh>
        {/* Flashing blue laser alignment pointer to illustrate laser sweep */}
        <pointLight color="#38bdf8" intensity={1.5} distance={1.2} />
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── 6. SHOWCASE 4: Water Spray Particle Physics
// ─────────────────────────────────────────────────────────────────────────────

interface SprayParticleData {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  age: number;
}

function WaterParticlesDemo() {
  const pointsRef = useRef<THREE.Points>(null);
  const maxParticles = 1200;

  // Initialize particles pool in local memory
  const particles: SprayParticleData[] = useMemo(() => {
    const list: SprayParticleData[] = [];
    for (let i = 0; i < maxParticles; i++) {
      list.push({
        pos: new THREE.Vector3(0, 0.8, 0), // Spawns inside sprayer head
        vel: new THREE.Vector3(0, -1, 0),
        age: Math.random() * 2,
      });
    }
    return list;
  }, []);

  const positionsArr = useMemo(() => new Float32Array(maxParticles * 3), []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geoPos = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Boundary properties representing the bottom of our washing chamber
    const nozzleHeight = 0.8;
    const boundaryRadius = 0.55;

    for (let i = 0; i < maxParticles; i++) {
      const p = particles[i];
      p.age += delta;

      if (p.age > 1.8) {
        // Recycle and respawn particle at the nozzle head with random spray cone velocity
        p.pos.set(0, nozzleHeight, 0);
        
        // Random spray cone projection angles
        const theta = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.45;
        p.vel.set(
          Math.cos(theta) * radius * 3.5,
          -4.2 - Math.random() * 3.0, // Shoot downwards with high pressure
          Math.sin(theta) * radius * 3.5
        );
        p.age = 0;
      } else {
        // Integrate gravity and friction kinematics
        p.vel.y -= 9.8 * delta; // Gravity pull downwards
        p.vel.x *= 0.98;         // Friction drift drag
        p.vel.z *= 0.98;
        
        // Update position vector
        p.pos.addScaledVector(p.vel, delta);

        // Simple bounce collision logic against the floor surface
        if (p.pos.y < -0.8) {
          p.pos.y = -0.8;
          p.vel.y *= -0.32; // Bounce coefficients
          p.vel.x += (Math.random() - 0.5) * 2; // Scatter outward on splash
          p.vel.z += (Math.random() - 0.5) * 2;
        }

        // Outer wall cylinder containment boundary
        const distanceXZ = Math.sqrt(p.pos.x * p.pos.x + p.pos.z * p.pos.z);
        if (distanceXZ > boundaryRadius) {
          const factor = boundaryRadius / distanceXZ;
          p.pos.x *= factor;
          p.pos.z *= factor;
          p.vel.x *= -0.4; // Reflect velocity direction
          p.vel.z *= -0.4;
        }
      }

      // Sync local memory position values to the buffer geometry attribute
      geoPos[i * 3] = p.pos.x;
      geoPos[i * 3 + 1] = p.pos.y;
      geoPos[i * 3 + 2] = p.pos.z;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* Double Spinning Spray Head */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.12, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Washing Container Dome outline representation (Transparent glass shell) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 1.8, 16, 1, true]} />
        <meshStandardMaterial 
          color="#38bdf8" 
          transparent 
          opacity={0.15} 
          roughness={0.1} 
          metalness={0.8} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Renders the particle points system */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positionsArr, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#a5f3fc" // Bright sparkling suds blue-white
          size={0.052}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── 7. SHOWCASE 5: Low-Poly Extruded Regional Suburbs Map
// ─────────────────────────────────────────────────────────────────────────────

interface SuburbBlockData {
  id: string;
  name: string;
  pos: [number, number, number];
  height: number;
  color: string;
  count: string;
}

function RegionalMapDemo({ activeId = "", onHoverSuburb }: { activeId: string, onHoverSuburb: (id: string | null) => void }) {
  const suburbs: SuburbBlockData[] = useMemo(() => [
    { id: "tarneit", name: "Tarneit", pos: [-0.6, 0, -0.6], height: 0.9, color: "#10b981", count: "482 cleans" },
    { id: "werribee", name: "Werribee", pos: [0.6, 0, 0.6], height: 0.7, color: "#06b6d4", count: "391 cleans" },
    { id: "hoppers", name: "Hoppers Crossing", pos: [0, 0, 0], height: 0.85, color: "#3b82f6", count: "450 cleans" },
    { id: "truganina", name: "Truganina", pos: [-0.5, 0, 0.5], height: 0.6, color: "#8b5cf6", count: "290 cleans" },
    { id: "pointcook", name: "Point Cook", pos: [0.5, 0, -0.5], height: 1.1, color: "#ec4899", count: "512 cleans" },
  ], []);

  return (
    <group rotation={[Math.PI / 6, -Math.PI / 4, 0]}>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.5} />
      
      {suburbs.map((sub) => {
        const isActive = activeId === sub.id;
        
        return (
          <group 
            key={sub.id} 
            position={sub.pos}
          >
            {/* Animates block position upward if it matches active state */}
            <SuburbBlockMesh 
              suburb={sub} 
              isActive={isActive} 
              onHover={onHoverSuburb} 
            />
          </group>
        );
      })}
    </group>
  );
}

function SuburbBlockMesh({ 
  suburb, 
  isActive, 
  onHover 
}: { 
  suburb: SuburbBlockData; 
  isActive: boolean; 
  onHover: (id: string | null) => void 
}) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Spring transition to smoothly elevate active elements
  useFrame((state, delta) => {
    if (meshRef.current) {
      const targetY = isActive ? 0.35 : 0.0;
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 8.5);
    }
  });

  return (
    <group 
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(suburb.id);
      }}
      onPointerOut={() => onHover(null)}
    >
      {/* Glowing Hexagonal block body */}
      <mesh castShadow receiveShadow position={[0, suburb.height / 2, 0]}>
        <cylinderGeometry args={[0.42, 0.42, suburb.height, 6]} />
        <meshStandardMaterial 
          color={isActive ? "#ffffff" : suburb.color} 
          roughness={0.1}
          metalness={0.3}
          emissive={isActive ? suburb.color : "#000000"}
          emissiveIntensity={isActive ? 0.5 : 0.0}
        />
      </mesh>

      {/* Wireframe border lines around block caps */}
      <mesh position={[0, suburb.height + 0.015, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.43, 0.43, 0.02, 6, 1, true]} />
        <meshBasicMaterial color={suburb.color} wireframe />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── 8. MAIN SWITCHABLE MASTER SHOWROOM COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface OmniShowroomCanvasProps {
  demoMode: number; // 1 to 5
  scrubberValue: number; // 0 to 100 representing scrubber percentage
  activeId: string;
  setActiveId: (id: string) => void;
}

export default function OmniShowroomCanvas({
  demoMode,
  scrubberValue,
  activeId,
  setActiveId
}: OmniShowroomCanvasProps) {
  
  const decimalProgress = scrubberValue / 100;

  // Handle pointer coordinate over suburbs
  const handleHoverSuburb = (id: string | null) => {
    if (id) {
      setActiveId(id);
    }
  };

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        camera={{ position: [0, 0.8, 3.8], fov: 45 }}
        gl={{ antialias: true }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.4} />
        
        {/* Unified Light Source Rig */}
        <directionalLight
          position={[6, 8, 4]}
          intensity={1.25}
          castShadow
          shadow-mapSize={[512, 512]}
          shadow-bias={-0.0001}
        />

        <React.Suspense fallback={null}>
          
          {/* Conditional Demo Router */}
          {demoMode === 1 && (
            <ScrollytellingDemo scrollValue={decimalProgress} />
          )}
          
          {demoMode === 2 && (
            <HydraulicsDemo progress={decimalProgress} />
          )}

          {demoMode === 3 && (
            <ShaderEraserDemo progress={decimalProgress} />
          )}

          {demoMode === 4 && (
            <WaterParticlesDemo />
          )}

          {demoMode === 5 && (
            <RegionalMapDemo activeId={activeId} onHoverSuburb={handleHoverSuburb} />
          )}

          {/* Neutral shadow landing ground plane */}
          <ContactShadows
            position={[0, -0.9, 0]}
            opacity={0.35}
            scale={6}
            blur={1.8}
            far={1.8}
          />
        </React.Suspense>

        {/* Orbit Control (only unlocked in non-scrollytelling modes to prevent camera-hijacks) */}
        {demoMode !== 1 && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
          />
        )}
      </Canvas>
    </div>
  );
}
