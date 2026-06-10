"use client";

import { editable as e } from "@theatre/r3f";
import { useGLTF } from "@react-three/drei";
import React, { useRef } from "react";
import * as THREE from "three";

export function StylizedBinModel() {
	const binGroupRef = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/models/base_basic_pbr.glb");
	const clonedScene = React.useMemo(() => scene.clone(), [scene]);

	// Optimize and set material properties for a high-end look
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

	return (
		<e.group theatreKey="BinGroup" ref={binGroupRef}>
			<primitive 
				object={clonedScene} 
				position={[0, -1.35, 0]} // Position so base sits perfectly on the contact shadow plane
				scale={[0.55, 0.55, 0.55]} 
				rotation={[0, Math.PI / 1.1, 0]} // Aesthetic face-to-camera angle matching other 3D components
			/>
		</e.group>
	);
}

useGLTF.preload("/models/base_basic_pbr.glb");
