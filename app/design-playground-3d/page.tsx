"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { 
  Sparkles, 
  Activity, 
  Sliders, 
  Cpu, 
  Play, 
  Pause, 
  RotateCcw, 
  HelpCircle, 
  Maximize, 
  Compass, 
  ChevronRight, 
  Layers, 
  Info,
  Layers2,
  Tv,
  Eye,
  MapPin,
  FlameKindling
} from "lucide-react";

// SSR-safe dynamic lazy load wrapper for our heavy-duty ThreeJS canvas component
const OmniShowroomCanvas = dynamic(
  () => import("@/components/3d/OmniShowroomCanvas"),
  {
    ssr: false,
    loading: () => <ShowroomLoadingPlaceholder />
  }
);

function ShowroomLoadingPlaceholder() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-emerald-400 font-mono text-[13px] gap-3">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500/10" />
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-emerald-500 animate-spin" />
      </div>
      <div className="animate-pulse flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>INITIALIZING WEBGL 2.0 GRAPHICS CORE...</span>
      </div>
    </div>
  );
}

export default function DesignPlayground3D() {
  // State configurations
  const [demoMode, setDemoMode] = useState<number>(3); // Default to GLSL shader (highly impressive!)
  const [scrubberValue, setScrubberValue] = useState<number>(45);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeSuburb, setActiveSuburb] = useState<string>("tarneit");
  const [telemetryFps, setTelemetryFps] = useState<number>(60);
  const [telemetryTemp, setTelemetryTemp] = useState<number>(31.4);

  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  // Simulated telemetry ticker
  useEffect(() => {
    const fpsTimer = setInterval(() => {
      // Mimic slight real-time frame time drift
      setTelemetryFps(Math.floor(58 + Math.random() * 3));
      setTelemetryTemp(Number((30.8 + Math.random() * 1.5).toFixed(1)));
    }, 1000);

    return () => clearInterval(fpsTimer);
  }, []);

  // Animates scrubber state if Autoplay is toggled active
  const animateScrubber = (time: number) => {
    if (previousTimeRef.current !== null && isPlaying && demoMode !== 4) {
      setScrubberValue((prev) => {
        const speed = demoMode === 2 ? 0.35 : 0.45; // Slower hydraulics, faster camera orbits
        let nextVal = prev + speed;
        if (nextVal > 100) {
          nextVal = 0; // Seamless looping
        }
        return nextVal;
      });
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animateScrubber);
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animateScrubber);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, demoMode]);

  // Handle manual tab switcher
  const handleModeChange = (mode: number) => {
    setDemoMode(mode);
    setScrubberValue(45); // Reset scrubbing percentage back to a comfortable preview index
  };

  // Active showcase title dictionary mappings
  const modeMetadata = [
    {
      title: "3D Scrollytelling Spline Camera",
      subtitle: "Scroll-Driven Orbit & Automatic Lid Hinges",
      tech: "THREE.CatmullRomCurve3 · useScroll · GSAP",
      desc: "Simulates full scrollytelling path mechanics. Drag the timeline scrubber below to observe the camera panning smoothly around the floating bin, lifting the container lid, and diving inside to reveal details."
    },
    {
      title: "3D Truck Hydraulics Kinematics",
      subtitle: "Joint Angle Inter-dependency & Lever Arm Collisions",
      tech: "Forward Kinematics · Pivot Joints · Bone Weighting",
      desc: "Scrub the timeline to execute the mechanical collection cycle. You will see the dual-hinged hydraulic arm extend, clamp the wheelie bin, rotate 135 degrees into the rear wash bay, and lower it down."
    },
    {
      title: "GLSL Procedural Dirt Eraser Shader",
      subtitle: "Custom Vertex/Fragment GLSL Sweeping Material",
      tech: "Custom ShaderMaterial · Noise Octaves · Specular Phong",
      desc: "A custom WebGL shader calculating fragment distances dynamically in the GPU. As the cleaning wand slides across the model, it sweeps away procedural grime to reveal clean glossy plastic."
    },
    {
      title: "WebGL Fluid Particle Physics Simulation",
      subtitle: "Instanced Point Spray & Boundary Rigid Collision Bounce",
      tech: "THREE.Points · Gravity Vector Math · Velocity Dampening",
      desc: "Fires thousands of physical spray and chemical foam particles from spinning spray heads inside a wash bay, dynamically calculating gravitational drag and bouncing off walls in real-time."
    },
    {
      title: "Extruded 3D Regional Map Cluster",
      subtitle: "Hover-Reactive Emissive Suburb Meshes & Soundboard Links",
      tech: "ExtrudeGeometry · MeshStandardMaterial · Sound Waves",
      desc: "A low-poly 3D regional coordinate cluster map representing the Western suburbs. Hover over the extruded suburb blocks to trigger a vertical float and glowing emissive color transitions."
    }
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
      
      {/* Sci-Fi Floating Terminal Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
              <Tv className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-emerald-500 block leading-none font-bold uppercase">EXPERIMENTAL HUB</span>
              <h1 className="text-[15px] font-black tracking-wide font-mono text-white mt-1">OMNI-3D WEBGL SHOWROOM</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Live WebGL Telemetry HUD */}
            <div className="hidden md:flex items-center gap-5 border border-slate-900 rounded-lg px-4 py-1.5 bg-slate-950 text-slate-400 font-mono text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>FPS: <strong className="text-white">{telemetryFps}</strong></span>
              </div>
              <div className="w-px h-3.5 bg-slate-900" />
              <div>
                <span>MEM_TEMP: <strong className="text-white">{telemetryTemp}°C</strong></span>
              </div>
              <div className="w-px h-3.5 bg-slate-900" />
              <div>
                <span>DRIVER: <strong className="text-emerald-400">WebGL 2.0</strong></span>
              </div>
            </div>

            <Link 
              href="/design-playground" 
              className="text-[12px] font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-900 transition-all flex items-center gap-1 font-mono"
            >
              ← 2D Play
            </Link>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Intro Alert */}
        <div className="mb-8 border border-emerald-500/10 bg-emerald-950/10 rounded-[16px] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-emerald-400">WebGL Lab: Full 3D Interactive Showroom</h3>
              <p className="text-[12px] text-slate-400 mt-1 max-w-2xl">
                Testing next-generation immersive graphics. Each showcase below features isolated procedural rendering paths designed to maximize customer conversion through elite visual story-telling.
              </p>
            </div>
          </div>
          <Link 
            href="/home-2"
            className="px-4 py-2 rounded-full text-[12px] font-bold bg-slate-900 text-slate-100 hover:bg-slate-800 border border-slate-800/80 transition-all hover:scale-105"
          >
            Preview Home-2 Sandbox →
          </Link>
        </div>

        {/* Unified 3D Canvas Board Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Core 3D Canvas Viewport (7 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Viewport Frame */}
            <div className="relative aspect-[4/3] w-full rounded-[24px] overflow-hidden bg-slate-950 border border-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
              
              {/* Floating Canvas Meta Stats Overlay */}
              <div className="absolute top-4 left-4 z-10 font-mono pointer-events-none">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[9px] font-bold bg-slate-900/90 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                  ACTIVE CONSOLE VIEW
                </span>
                <div className="mt-2 text-white text-[14px] font-bold drop-shadow">
                  {modeMetadata[demoMode - 1].title}
                </div>
              </div>

              {/* Core 3D Canvas */}
              <OmniShowroomCanvas 
                demoMode={demoMode} 
                scrubberValue={scrubberValue} 
                activeId={activeSuburb}
                setActiveId={setActiveSuburb}
              />

              {/* Orbit rotation tip */}
              {demoMode !== 1 && (
                <div className="absolute bottom-4 left-4 z-10 pointer-events-none font-mono text-[9px] text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-slate-900 flex items-center gap-1">
                  <Compass className="w-3 h-3 animate-spin" />
                  <span>Hold &amp; Drag to orbit 3D space</span>
                </div>
              )}
            </div>

            {/* Viewport Scrubbers Dashboard */}
            <div className="border border-slate-900 rounded-[20px] p-6 bg-slate-950">
              
              {/* Playback Switchboard Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  {demoMode !== 4 && (
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isPlaying 
                          ? "bg-slate-900 text-emerald-400 hover:bg-slate-800 border border-emerald-500/20" 
                          : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                      }`}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                  )}
                  
                  {demoMode !== 4 ? (
                    <div className="font-mono text-[11px] text-slate-400">
                      <span>Timeline: </span>
                      <strong className="text-white font-black">{Math.floor(scrubberValue)}%</strong>
                    </div>
                  ) : (
                    <div className="font-mono text-[11px] text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Active WebGL Instanced Physics Running</span>
                    </div>
                  )}
                </div>

                {demoMode !== 4 && (
                  <button
                    onClick={() => setScrubberValue(0)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-all"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Range slider timeline tracker */}
              {demoMode !== 4 ? (
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={scrubberValue}
                    onChange={(e) => {
                      setIsPlaying(false); // Stop autoplay when scrubbing manually
                      setScrubberValue(Number(e.target.value));
                    }}
                    className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between font-mono text-[9px] text-slate-500">
                    <span>Frame: 0.00</span>
                    <span>Frame: 0.50</span>
                    <span>Frame: 1.00</span>
                  </div>
                </div>
              ) : (
                <div className="border border-slate-900 bg-slate-950/50 rounded-lg p-3 font-mono text-[10px] text-slate-400 flex justify-between">
                  <span>Emission rate: 1200 points</span>
                  <span>Bounce Friction: -0.32</span>
                  <span>Gravity Pull: 9.8m/s²</span>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Tab Switcher & Metadata panel (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Tab Selection */}
            <div className="border border-slate-900 rounded-[20px] p-5 bg-slate-950 space-y-3.5">
              <h3 className="font-mono text-[10px] tracking-widest text-slate-400 uppercase font-bold">Select 3D Demo Mode</h3>
              
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => handleModeChange(idx)}
                    className={`w-full text-left px-4 py-3 rounded-xl border font-mono text-[12px] flex items-center justify-between transition-all ${
                      demoMode === idx
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold"
                        : "bg-slate-950 hover:bg-slate-900/50 text-slate-400 border-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] ${demoMode === idx ? "text-emerald-400" : "text-slate-600"}`}>
                        0{idx}
                      </span>
                      <span>{modeMetadata[idx - 1].title.split(" ")[1]} Mode</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${demoMode === idx ? "rotate-90 text-emerald-400" : "text-slate-600"}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Details Panel */}
            <div className="border border-slate-900 rounded-[20px] p-6 bg-slate-950 space-y-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-emerald-500 font-bold uppercase leading-none">
                  {modeMetadata[demoMode - 1].subtitle}
                </span>
                <h2 className="text-[18px] text-white font-black mt-2 font-mono">
                  {modeMetadata[demoMode - 1].title}
                </h2>
              </div>

              <div className="font-mono text-[11px] text-emerald-400 border border-emerald-500/10 bg-emerald-950/10 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>GPU Tech: {modeMetadata[demoMode - 1].tech}</span>
              </div>

              <p className="text-[12px] text-slate-400 leading-relaxed font-mono">
                {modeMetadata[demoMode - 1].desc}
              </p>

              {/* Context Specific Sub-Controls */}
              {demoMode === 3 && (
                <div className="pt-4 border-t border-slate-900 space-y-3">
                  <h4 className="font-mono text-[10px] text-slate-400 font-bold uppercase">Procedural Shader Controls</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setScrubberValue(0)}
                      className="px-3 py-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900 font-mono text-[10px] text-left transition-all"
                    >
                      🧪 Set Clean: 0%
                    </button>
                    <button 
                      onClick={() => setScrubberValue(100)}
                      className="px-3 py-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900 font-mono text-[10px] text-left transition-all"
                    >
                      ✨ Set Clean: 100%
                    </button>
                  </div>
                </div>
              )}

              {demoMode === 5 && (
                <div className="pt-4 border-t border-slate-900 space-y-3">
                  <h4 className="font-mono text-[10px] text-slate-400 font-bold uppercase">Simulated Suburb Reviews</h4>
                  <div className="space-y-1.5">
                    {[
                      { id: "tarneit", name: "Tarneit", score: "★ 4.9", cleans: "482 cleans" },
                      { id: "pointcook", name: "Point Cook", score: "★ 5.0", cleans: "512 cleans" },
                      { id: "hoppers", name: "Hoppers Crossing", score: "★ 4.8", cleans: "450 cleans" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSuburb(item.id)}
                        className={`w-full flex justify-between items-center px-3 py-1.5 rounded font-mono text-[11px] border transition-all ${
                          activeSuburb === item.id
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-transparent text-slate-400 border-transparent hover:bg-slate-900"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" />
                          {item.name}
                        </span>
                        <div className="flex gap-2">
                          <span>{item.score}</span>
                          <span className="text-[9px] text-slate-600">({item.cleans})</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
