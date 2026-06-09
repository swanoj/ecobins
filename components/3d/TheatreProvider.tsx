"use client";

import { getProject, type IProject, type ISheet } from "@theatre/core";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface TheatreContextType {
	project: IProject;
	sheet: ISheet;
}

const TheatreContext = createContext<TheatreContextType | null>(null);

export function TheatreProvider({ children }: { children: React.ReactNode }) {
	const [project, setProject] = useState<IProject | null>(null);
	const [sheet, setSheet] = useState<ISheet | null>(null);

	useEffect(() => {
		const initTheatre = async () => {
			// 1. Initialize the project and sheet
			const proj = getProject("EcoBins3D");
			const sh = proj.sheet("HeroScene");

			// 2. Load Studio and extensions dynamically ONLY in development mode
			if (process.env.NODE_ENV === "development") {
				try {
					const studio = (await import("@theatre/studio")).default;
					// In some versions of Theatre.js v0.7, the R3F extension is imported as follows
					const r3fExtension = (await import("@theatre/r3f/dist/extension"))
						.default;

					studio.initialize();
					studio.extend(r3fExtension);
				} catch (err) {
					console.warn(
						"Theatre.js Studio or R3F extension failed to load dynamically:",
						err,
					);
				}
			}

			setProject(proj);
			setSheet(sh);
		};

		initTheatre();
	}, []);

	if (!project || !sheet) {
		// Return a beautiful loading container so the SSR/hydration phase has zero layout-shift
		return (
			<div className="w-full h-full flex items-center justify-center bg-transparent">
				<div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<TheatreContext.Provider value={{ project, sheet }}>
			{children}
		</TheatreContext.Provider>
	);
}

export function useTheatre() {
	const context = useContext(TheatreContext);
	if (!context) {
		throw new Error("useTheatre must be used within a TheatreProvider");
	}
	return context;
}
