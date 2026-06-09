"use client";

import { editable as e } from "@theatre/r3f";
import React, { useRef } from "react";
import type * as THREE from "three";

export function StylizedBinModel() {
	const binGroupRef = useRef<THREE.Group>(null);
	const lidGroupRef = useRef<THREE.Group>(null);

	return (
		// The main editable group for the entire bin.
		// In Theatre.js Studio, you will see 'BinGroup' which you can translate and rotate.
		<e.group theatreKey="BinGroup" ref={binGroupRef}>
			{/* 1. BIN BODY (Tapered green container) */}
			<mesh castShadow receiveShadow position={[0, 0, 0]}>
				<boxGeometry args={[1.6, 2.4, 1.6]} />
				<meshStandardMaterial
					color="#1b4d3e" // Emerald dark green body
					roughness={0.2}
					metalness={0.1}
					flatShading={false}
				/>
			</mesh>

			{/* Subtle branding stripe/recess on the front of the bin */}
			<mesh position={[0, 0, 0.81]} castShadow>
				<boxGeometry args={[1.0, 1.8, 0.04]} />
				<meshStandardMaterial
					color="#22c55e" // High-contrast bright green stripe
					roughness={0.1}
				/>
			</mesh>

			{/* 2. BIN LID (Hinged top cover)
          We wrap this in an editable group so we can keyframe 'LidGroup''s rotation to swing it open! */}
			<e.group
				theatreKey="LidGroup"
				ref={lidGroupRef}
				position={[0, 1.2, -0.8]}
			>
				{/* Lid plate - offset the mesh itself so rotation hinges about the back edge */}
				<mesh castShadow position={[0, 0.05, 0.8]}>
					<boxGeometry args={[1.7, 0.12, 1.7]} />
					<meshStandardMaterial
						color="#0f2a1e" // Very deep navy-green lid
						roughness={0.3}
						metalness={0.1}
					/>
				</mesh>

				{/* Lid handle on the front */}
				<mesh castShadow position={[0, 0.05, 1.62]}>
					<boxGeometry args={[0.6, 0.08, 0.1]} />
					<meshStandardMaterial color="#0f2a1e" roughness={0.3} />
				</mesh>
			</e.group>

			{/* 3. WHEELS AND AXLE (Deep base details) */}
			{/* Axle bar */}
			<mesh castShadow position={[0, -1.15, -0.6]}>
				<cylinderGeometry args={[0.06, 0.06, 1.8, 8]} />
				<meshStandardMaterial color="#334155" roughness={0.5} />
			</mesh>

			{/* Left Wheel */}
			<mesh castShadow position={[-0.9, -1.15, -0.6]}>
				<cylinderGeometry args={[0.35, 0.35, 0.2, 16]} />
				<meshStandardMaterial color="#0f172a" roughness={0.8} />
			</mesh>

			{/* Right Wheel */}
			<mesh castShadow position={[0.9, -1.15, -0.6]}>
				<cylinderGeometry args={[0.35, 0.35, 0.2, 16]} />
				<meshStandardMaterial color="#0f172a" roughness={0.8} />
			</mesh>

			{/* 4. MAIN GRAB HANDLE (Back side) */}
			<mesh castShadow position={[0, 1.0, -0.86]}>
				<boxGeometry args={[1.4, 0.1, 0.12]} />
				<meshStandardMaterial color="#0f2a1e" roughness={0.4} />
			</mesh>
		</e.group>
	);
}
