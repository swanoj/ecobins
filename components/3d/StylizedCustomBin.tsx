"use client";

import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import type * as THREE from "three";

interface StylizedCustomBinProps {
	lidColor?: string;
	bodyColor?: string;
	isOpen?: boolean;
	position?: [number, number, number];
	scale?: number;
}

export function StylizedCustomBin({
	lidColor = "#0f2a1e", // Default dark navy/green
	bodyColor = "#1b4d3e", // Default emerald body
	isOpen = false,
	position = [0, 0, 0],
	scale = 1,
}: StylizedCustomBinProps) {
	const binGroupRef = useRef<THREE.Group>(null);
	const lidGroupRef = useRef<THREE.Group>(null);

	// Animate the lid swinging open/closed smoothly using a frame lerp
	useFrame((state, delta) => {
		if (lidGroupRef.current) {
			const targetRotation = isOpen ? -Math.PI * 0.65 : 0;
			// Smooth lerp: current + (target - current) * factor
			// We adjust factor by delta to make it frame-rate independent
			const speedFactor = 1 - Math.exp(-8 * delta);
			lidGroupRef.current.rotation.x +=
				(targetRotation - lidGroupRef.current.rotation.x) * speedFactor;
		}
	});

	return (
		<group position={position} scale={[scale, scale, scale]} ref={binGroupRef}>
			{/* 1. BIN BODY (Main container) */}
			<mesh castShadow receiveShadow position={[0, 0, 0]}>
				<boxGeometry args={[1.5, 2.2, 1.5]} />
				<meshStandardMaterial
					color={bodyColor}
					roughness={0.25}
					metalness={0.1}
				/>
			</mesh>

			{/* High-contrast vertical front accent stripe */}
			<mesh position={[0, 0, 0.76]} castShadow>
				<boxGeometry args={[0.9, 1.6, 0.04]} />
				<meshStandardMaterial
					color={lidColor} // Match stripe color with the lid for unified aesthetic
					roughness={0.15}
				/>
			</mesh>

			{/* 2. BIN LID (Hinged top cover)
          Hinges about the back top edge: [0, 1.1, -0.75] */}
			<group ref={lidGroupRef} position={[0, 1.1, -0.75]}>
				{/* Lid plate - offset so rotation hinges about the back edge */}
				<mesh castShadow position={[0, 0.05, 0.75]}>
					<boxGeometry args={[1.6, 0.1, 1.6]} />
					<meshStandardMaterial
						color={lidColor}
						roughness={0.2}
						metalness={0.15}
					/>
				</mesh>

				{/* Front handle */}
				<mesh castShadow position={[0, 0.05, 1.52]}>
					<boxGeometry args={[0.5, 0.07, 0.1]} />
					<meshStandardMaterial color={lidColor} roughness={0.2} />
				</mesh>
			</group>

			{/* 3. WHEELS AND AXLE */}
			{/* Axle bar */}
			<mesh castShadow position={[0, -1.05, -0.55]}>
				<cylinderGeometry args={[0.05, 0.05, 1.7, 8]} />
				<meshStandardMaterial color="#475569" roughness={0.5} />
			</mesh>

			{/* Left Wheel */}
			<mesh castShadow position={[-0.85, -1.05, -0.55]}>
				<cylinderGeometry args={[0.3, 0.3, 0.18, 16]} />
				<meshStandardMaterial color="#0f172a" roughness={0.8} />
			</mesh>

			{/* Right Wheel */}
			<mesh castShadow position={[0.85, -1.05, -0.55]}>
				<cylinderGeometry args={[0.3, 0.3, 0.18, 16]} />
				<meshStandardMaterial color="#0f172a" roughness={0.8} />
			</mesh>

			{/* 4. REAR GRAB HANDLE */}
			<mesh castShadow position={[0, 0.9, -0.81]}>
				<boxGeometry args={[1.3, 0.08, 0.1]} />
				<meshStandardMaterial color={bodyColor} roughness={0.4} />
			</mesh>
		</group>
	);
}
