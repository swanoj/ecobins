"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { editable as e, SheetProvider } from "@theatre/r3f";
import React from "react";
import { StylizedBinModel } from "./StylizedBinModel";
import { TheatreProvider, useTheatre } from "./TheatreProvider";

function CanvasContent() {
	const { sheet } = useTheatre();

	return (
		<SheetProvider sheet={sheet}>
			{/* Cinematic Studio Lights - made editable so they can be keyframed inside Theatre.js! */}
			<e.ambientLight theatreKey="AmbientLight" intensity={0.4} />

			<e.directionalLight
				theatreKey="KeyLight"
				position={[5, 6, 4]}
				intensity={1.2}
				castShadow
				shadow-mapSize={[1024, 1024]}
				shadow-bias={-0.0001}
			/>

			<e.pointLight
				theatreKey="RimLight"
				position={[-4, 3, -3]}
				intensity={0.6}
				color="#22d55e" // Glowing emerald green rim highlight
			/>

			{/* Main 3D Model */}
			<StylizedBinModel />

			{/* Ground shadows for a highly grounded, premium aesthetic */}
			<ContactShadows
				position={[0, -1.35, 0]}
				opacity={0.6}
				scale={6}
				blur={1.8}
				far={1.6}
			/>

			{/* Non-intrusive interactive rotation controls for web users */}
			<OrbitControls
				enableZoom={false}
				enablePan={false}
				minPolarAngle={Math.PI / 3}
				maxPolarAngle={Math.PI / 1.8}
			/>
		</SheetProvider>
	);
}

export function Hero3DCanvas() {
	return (
		<div className="relative w-full h-[320px] md:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden bg-radial from-slate-900 via-slate-950 to-slate-950 shadow-2xl border border-slate-800">
			{/* Decorative tech/mesh background lines */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

			{/* Canvas container */}
			<TheatreProvider>
				<Canvas
					shadows
					camera={{ position: [0, 0.4, 4.2], fov: 42 }}
					gl={{ preserveDrawingBuffer: true, antialias: true }}
					className="w-full h-full cursor-grab active:cursor-grabbing"
				>
					<CanvasContent />
				</Canvas>
			</TheatreProvider>
		</div>
	);
}
export default Hero3DCanvas;
