"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useState } from "react";
import { StylizedCustomBin } from "./StylizedCustomBin";

interface BookingBinsCanvasProps {
	bins: {
		general: number;
		recycling: number;
		green: number;
	};
}

interface RenderableBin {
	key: string;
	lidColor: string;
	bodyColor: string;
	type: "general" | "recycling" | "green";
}

export function BookingBinsCanvas({ bins }: BookingBinsCanvasProps) {
	const [hoveredBinKey, setHoveredBinKey] = useState<string | null>(null);

	// 1. Generate flat list of active bins to render side-by-side
	const activeBins: RenderableBin[] = [];

	for (let i = 0; i < bins.general; i++) {
		activeBins.push({
			key: `general-${i}`,
			lidColor: "#DC2626", // Red lid
			bodyColor: "#1b4d3e", // Dark emerald body
			type: "general",
		});
	}

	for (let i = 0; i < bins.recycling; i++) {
		activeBins.push({
			key: `recycling-${i}`,
			lidColor: "#EAB308", // Yellow/Gold lid
			bodyColor: "#1b4d3e",
			type: "recycling",
		});
	}

	for (let i = 0; i < bins.green; i++) {
		activeBins.push({
			key: `green-${i}`,
			lidColor: "#16A34A", // Green lid
			bodyColor: "#1e293b", // Slate grey/black body for variety
			type: "green",
		});
	}

	const N = activeBins.length;
	// Dynamic canvas width/sizing based on the number of bins
	const spacing = 1.8;
	const scale = N > 3 ? 0.75 : N > 2 ? 0.9 : 1.05;

	return (
		<div className="relative w-full h-[180px] sm:h-[220px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200/60 shadow-inner mb-6">
			{/* Aesthetic hint */}
			<div className="absolute top-2.5 left-4 z-10 pointer-events-none">
				<p className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
					Your 3D Configurator
				</p>
				<p className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
					Hover a bin to open its lid · Drag to spin
				</p>
			</div>

			<Canvas
				shadows
				camera={{ position: [0, 0.6, 4.4], fov: 38 }}
				gl={{ antialias: true }}
				className="w-full h-full cursor-grab active:cursor-grabbing"
			>
				{/* Ambient lighting */}
				<ambientLight intensity={0.65} />

				{/* Key light for rich specular reflections */}
				<directionalLight
					position={[3, 5, 3]}
					intensity={1.1}
					castShadow
					shadow-mapSize={[512, 512]}
					shadow-bias={-0.0002}
				/>

				{/* Secondary filler light */}
				<directionalLight position={[-3, 2, -2]} intensity={0.4} />

				{/* Rim light highlight */}
				<pointLight position={[0, 4, -3]} intensity={0.5} color="#22c55e" />

				{/* Group to center and render active bins */}
				<group>
					{activeBins.map((bin, index) => {
						// Center-offset spacing calculation
						const xPos = (index - (N - 1) / 2) * spacing;
						return (
							<group
								key={bin.key}
								onPointerOver={(e) => {
									e.stopPropagation();
									setHoveredBinKey(bin.key);
								}}
								onPointerOut={() => setHoveredBinKey(null)}
							>
								<StylizedCustomBin
									lidColor={bin.lidColor}
									bodyColor={bin.bodyColor}
									isOpen={hoveredBinKey === bin.key}
									position={[xPos, -0.4, 0]}
									scale={scale}
								/>
							</group>
						);
					})}
				</group>

				{/* Realistic soft ground shadows */}
				<ContactShadows
					position={[0, -1.3, 0]}
					opacity={0.35}
					scale={8}
					blur={2.0}
					far={1.5}
				/>

				{/* locked camera controls so it rotates cleanly */}
				<OrbitControls
					enableZoom={false}
					enablePan={false}
					minPolarAngle={Math.PI / 2.6}
					maxPolarAngle={Math.PI / 1.8}
				/>
			</Canvas>
		</div>
	);
}
export default BookingBinsCanvas;
