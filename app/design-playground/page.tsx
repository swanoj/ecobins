"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { 
  Sparkles, 
  Layers, 
  Smartphone, 
  Maximize, 
  Grid, 
  RotateCw, 
  Search, 
  X, 
  ChevronRight, 
  Play, 
  Pause, 
  Check, 
  ArrowRight,
  Shield,
  Clock,
  Trash2,
  Calendar,
  Zap,
  Info,
  Sliders,
  Pointer,
  Volume2,
  Tv,
  MousePointerClick,
  Eye,
  Layout,
  Paintbrush,
  Activity,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Compass,
  Waves
} from "lucide-react";

// Default Theatre.js pre-choreographed keyframe state string to initialize without JSON file fetch
const defaultTheatreState = {
  "sheetsById": {
    "Pressure Wash Sequence": {
      "staticLookup": {
        "Wash Process": {
          "nozzleAngle": 0,
          "waterPressure": 0,
          "binLidAngle": 0,
          "cleanliness": 0,
          "sparkleScale": 0
        }
      },
      "sequence": {
        "subloads": {},
        "tracksByObject": {
          "Wash Process": {
            "trackData": {
              "nozzleAngle": {
                "type": "types.number",
                "keyframes": [
                  {"time": 0, "value": 0, "connectedRight": true},
                  {"time": 1, "value": -25, "connectedRight": true},
                  {"time": 2, "value": 25, "connectedRight": true},
                  {"time": 3, "value": -15, "connectedRight": true},
                  {"time": 4, "value": 15, "connectedRight": true},
                  {"time": 5, "value": 0}
                ]
              },
              "waterPressure": {
                "type": "types.number",
                "keyframes": [
                  {"time": 0, "value": 0, "connectedRight": true},
                  {"time": 0.8, "value": 100, "connectedRight": true},
                  {"time": 4, "value": 100, "connectedRight": true},
                  {"time": 5, "value": 0}
                ]
              },
              "binLidAngle": {
                "type": "types.number",
                "keyframes": [
                  {"time": 0, "value": 0, "connectedRight": true},
                  {"time": 1.2, "value": 45, "connectedRight": true},
                  {"time": 3.2, "value": 45, "connectedRight": true},
                  {"time": 4.5, "value": 0}
                ]
              },
              "cleanliness": {
                "type": "types.number",
                "keyframes": [
                  {"time": 0, "value": 0, "connectedRight": true},
                  {"time": 1, "value": 20, "connectedRight": true},
                  {"time": 2.2, "value": 55, "connectedRight": true},
                  {"time": 3.8, "value": 90, "connectedRight": true},
                  {"time": 4.8, "value": 100}
                ]
              },
              "sparkleScale": {
                "type": "types.number",
                "keyframes": [
                  {"time": 0, "value": 0, "connectedRight": true},
                  {"time": 3.8, "value": 0, "connectedRight": true},
                  {"time": 4.6, "value": 1, "connectedRight": true},
                  {"time": 5, "value": 1}
                ]
              }
            }
          }
        }
      }
    }
  }
};

export default function DesignPlayground() {
  // ── BOOKING MODES STATE ──────────────────────────────────────────────────
  const [activeBookingMode, setActiveBookingMode] = useState<"popup" | "sidesheet" | "floater" | "fullwidth">("popup");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSidesheetOpen, setIsSidesheetOpen] = useState(false);
  const [isFloaterExpanded, setIsFloaterExpanded] = useState(false);
  
  // ── THEATRE.JS KINETIC WASH SYSTEM STATE ─────────────────────────────────
  const [theatreActive, setTheatreActive] = useState(false);
  const [theatrePlaying, setTheatreActivePlaying] = useState(false);
  const [theatrePosition, setTheatrePosition] = useState(0); // 0 to 5 seconds
  const [theatreSpeed, setTheatreSpeed] = useState(1);
  const [studioLoaded, setStudioLoaded] = useState(false);
  const [theatreValues, setTheatreValues] = useState({
    nozzleAngle: 0,
    waterPressure: 0,
    binLidAngle: 0,
    cleanliness: 0,
    sparkleScale: 0
  });

  const theatreSheetRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize TheatreJS safely on the client
  useEffect(() => {
    if (typeof window === "undefined") return;

    let active = true;
    const initTheatre = async () => {
      try {
        const { getProject, types } = await import("@theatre/core");
        
        // Retrieve or initialize the playground project
        const project = getProject("EcoBins Kinetic Playground", { state: defaultTheatreState });
        const sheet = project.sheet("Pressure Wash Sequence");
        theatreSheetRef.current = sheet;

        // Connect the animatable properties
        const washObj = sheet.object("Wash Process", {
          nozzleAngle: types.number(0, { range: [-45, 45] }),
          waterPressure: types.number(0, { range: [0, 100] }),
          binLidAngle: types.number(0, { range: [0, 90] }),
          cleanliness: types.number(0, { range: [0, 100] }),
          sparkleScale: types.number(0, { range: [0, 1] })
        });

        // Set the active hook to read states and trigger React state updates
        washObj.onValuesChange((values) => {
          if (active) {
            setTheatreValues(values);
          }
        });

        setTheatreActive(true);
      } catch (err) {
        console.error("Failed to load TheatreJS: ", err);
      }
    };

    initTheatre();

    return () => {
      active = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Sync manual scrubber changes with Theatre.js sequence position
  const handleScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setTheatrePosition(val);
    if (theatreSheetRef.current) {
      theatreSheetRef.current.sequence.position = val;
    }
  };

  // Toggle timeline playback
  useEffect(() => {
    if (!theatreSheetRef.current) return;

    if (theatrePlaying) {
      theatreSheetRef.current.sequence.play({ iterationCount: Infinity, rate: theatreSpeed });
      
      const trackPlay = () => {
        if (theatreSheetRef.current) {
          setTheatrePosition(theatreSheetRef.current.sequence.position);
        }
        animationFrameRef.current = requestAnimationFrame(trackPlay);
      };
      animationFrameRef.current = requestAnimationFrame(trackPlay);
    } else {
      theatreSheetRef.current.sequence.pause();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [theatrePlaying, theatreSpeed]);

  // Launch Theatre.js visual editor GUI
  const handleLaunchStudio = async () => {
    if (typeof window === "undefined") return;
    try {
      const studio = (await import("@theatre/studio")).default;
      studio.initialize();
      setStudioLoaded(true);
    } catch (err) {
      console.error("Failed to load Theatre Studio: ", err);
    }
  };

  // ── EXPERIENTIAL AUDIO-VISUAL STATES ──────────────────────────────────────
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);
  const [globalMasterPlaying, setGlobalMasterPlaying] = useState(false);
  const soundboardTracks = [
    { id: 1, name: "David M.", area: "Tarneit Resident", text: "FOGO smells went away in 10 mins. Brilliant service!", dur: "0:24" },
    { id: 2, name: "Jessica R.", area: "Hoppers Crossing Mum", text: "Perfect fortnightly timing right after bins get emptied.", dur: "0:31" },
    { id: 3, name: "Liam G.", area: "Truganina Resident", text: "No more maggots in my green lid bin. Unbelievable!", dur: "0:19" },
    { id: 4, name: "Sarah K.", area: "Point Cook Beach", text: "Our bin was clean enough to eat out of. Smells like lime.", dur: "0:42" },
    { id: 5, name: "Sanjay P.", area: "Werribee Business", text: "Reliable, local, same-day, and they roll it inside our gate.", dur: "0:28" }
  ];

  const [ambientTime, setAmbientTime] = useState<'dawn' | 'noon' | 'sunset' | 'midnight'>('noon');
  const [ambientActive, setAmbientActive] = useState(false);
  const [liquidSweepActive, setLiquidSweepActive] = useState(false);
  const [liquidSweepProgress, setLiquidSweepProgress] = useState(0);
  const [vocalFrequencyArray, setVocalFrequencyArray] = useState<number[]>(new Array(16).fill(0));
  const [experientialConsoleExpanded, setExperientialConsoleExpanded] = useState(true);

  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const webglCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Web Audio Synth references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const synthNodesRef = useRef<{
    humOsc?: OscillatorNode;
    humGain?: GainNode;
    noiseSource?: AudioBufferSourceNode;
    noiseFilter?: BiquadFilterNode;
    noiseGain?: GainNode;
    chimeOsc?: OscillatorNode;
    chimeGain?: GainNode;
    chimeTimer?: any;
    lfo?: OscillatorNode;
    lfoGain?: GainNode;
  }>({});

  // Peak chime trigger helper
  const triggerPeakChime = () => {
    let audioCtx = audioCtxRef.current;
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
        audioCtxRef.current = audioCtx;
      }
    }
    if (audioCtx) {
      if (audioCtx.state === "suspended") audioCtx.resume();
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // high pure A chime
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.8);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        setTimeout(() => {
          try {
            osc.stop();
            osc.disconnect();
            gain.disconnect();
          } catch (e) {}
        }, 2000);
      } catch (err) {}
    }
  };

  const startLiquidSweep = () => {
    if (liquidSweepActive) return;
    setLiquidSweepActive(true);
  };

  const onLiquidSweepPeak = () => {
    // Reset kinetic typography states!
    runDecryptSolver("SANITISED IN 10 MINUTES");
    setScrambleText("AWWWARDS CLASS");
    setRevealKey(prev => prev + 1);
    setSplineOffset(0);
    triggerPeakChime();
  };

  // ── Web Audio Synth + Spectrum Analyser Effect ──
  useEffect(() => {
    if (playingTrack === null && !globalMasterPlaying) {
      try {
        const nodes = synthNodesRef.current;
        if (nodes.humOsc) { nodes.humOsc.stop(); nodes.humOsc.disconnect(); }
        if (nodes.noiseSource) { nodes.noiseSource.stop(); nodes.noiseSource.disconnect(); }
        if (nodes.chimeOsc) { nodes.chimeOsc.stop(); nodes.chimeOsc.disconnect(); }
        if (nodes.lfo) { nodes.lfo.stop(); nodes.lfo.disconnect(); }
        if (nodes.humGain) nodes.humGain.disconnect();
        if (nodes.noiseGain) nodes.noiseGain.disconnect();
        if (nodes.chimeGain) nodes.chimeGain.disconnect();
        if (nodes.noiseFilter) nodes.noiseFilter.disconnect();
        if (nodes.lfoGain) nodes.lfoGain.disconnect();
        if (nodes.chimeTimer) clearInterval(nodes.chimeTimer);
        
        synthNodesRef.current = {};
      } catch (e) {
        console.warn("Error stopping audio nodes: ", e);
      }

      let decayActive = true;
      const decayTick = () => {
        if (!decayActive) return;
        setVocalFrequencyArray((prev) => {
          const next = prev.map((val) => val * 0.82);
          if (next.every((val) => val < 0.1)) {
            decayActive = false;
            return new Array(16).fill(0);
          }
          return next;
        });
        if (decayActive) {
          requestAnimationFrame(decayTick);
        }
      };
      decayTick();
      return () => {
        decayActive = false;
      };
    }

    let audioCtx = audioCtxRef.current;
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
        audioCtxRef.current = audioCtx;
      }
    }

    if (!audioCtx) return;

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    let analyser = analyserRef.current;
    if (!analyser) {
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyserRef.current = analyser;
    }

    analyser.connect(audioCtx.destination);

    try {
      const nodes = synthNodesRef.current;
      if (nodes.humOsc) { nodes.humOsc.stop(); nodes.humOsc.disconnect(); }
      if (nodes.noiseSource) { nodes.noiseSource.stop(); nodes.noiseSource.disconnect(); }
      if (nodes.chimeOsc) { nodes.chimeOsc.stop(); nodes.chimeOsc.disconnect(); }
      if (nodes.lfo) { nodes.lfo.stop(); nodes.lfo.disconnect(); }
      if (nodes.chimeTimer) clearInterval(nodes.chimeTimer);
      synthNodesRef.current = {};
    } catch (e) {}

    let humFreq = 65.41;
    let chimeFreq = 1046.50;
    let lfoRate = 0.4;
    let noiseVolume = 0.04;
    let humVolume = 0.12;

    if (playingTrack !== null) {
      const activeTrack = soundboardTracks.find(t => t.id === playingTrack);
      if (activeTrack) {
        switch (activeTrack.id) {
          case 1:
            humFreq = 77.78;
            chimeFreq = 1244.51;
            lfoRate = 0.55;
            noiseVolume = 0.07;
            break;
          case 2:
            humFreq = 103.83;
            chimeFreq = 1661.22;
            lfoRate = 0.35;
            noiseVolume = 0.05;
            break;
          case 3:
            humFreq = 116.54;
            chimeFreq = 1864.66;
            lfoRate = 0.72;
            noiseVolume = 0.08;
            break;
          case 4:
            humFreq = 130.81;
            chimeFreq = 2093.00;
            lfoRate = 0.28;
            noiseVolume = 0.06;
            break;
          case 5:
            humFreq = 87.31;
            chimeFreq = 1396.91;
            lfoRate = 0.90;
            noiseVolume = 0.11;
            break;
        }
      }
    } else if (globalMasterPlaying) {
      humFreq = 65.41;
      chimeFreq = 1046.50;
      lfoRate = 0.45;
      noiseVolume = 0.05;
      humVolume = 0.08;
    }

    const humOsc = audioCtx.createOscillator();
    humOsc.type = "triangle";
    humOsc.frequency.setValueAtTime(humFreq, audioCtx.currentTime);

    const humGain = audioCtx.createGain();
    humGain.gain.setValueAtTime(humVolume, audioCtx.currentTime);

    const lfo = audioCtx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(lfoRate, audioCtx.currentTime);

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(0.04, audioCtx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(humGain.gain);

    humOsc.connect(humGain);
    humGain.connect(analyser);

    const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.Q.setValueAtTime(2.5, audioCtx.currentTime);
    noiseFilter.frequency.setValueAtTime(450, audioCtx.currentTime);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(noiseVolume, audioCtx.currentTime);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(analyser);

    humOsc.start(0);
    lfo.start(0);
    noiseSource.start(0);

    synthNodesRef.current = {
      humOsc,
      humGain,
      noiseSource,
      noiseFilter,
      noiseGain,
      lfo,
      lfoGain
    };

    let filterSweepDirection = 1;
    let currentFilterFreq = 450;
    const filterSweepInterval = setInterval(() => {
      if (!audioCtxRef.current || !synthNodesRef.current.noiseFilter) return;
      currentFilterFreq += filterSweepDirection * 18;
      if (currentFilterFreq > 950) filterSweepDirection = -1;
      if (currentFilterFreq < 300) filterSweepDirection = 1;
      
      synthNodesRef.current.noiseFilter.frequency.setValueAtTime(currentFilterFreq, audioCtxRef.current.currentTime);
    }, 45);

    const triggerChimeInstance = () => {
      if (!audioCtxRef.current || !analyserRef.current) return;
      try {
        const chimeOsc = audioCtxRef.current.createOscillator();
        chimeOsc.type = "sine";
        chimeOsc.frequency.setValueAtTime(chimeFreq + (Math.random() - 0.5) * 80, audioCtxRef.current.currentTime);

        const chimeGain = audioCtxRef.current.createGain();
        chimeGain.gain.setValueAtTime(0.0, audioCtxRef.current.currentTime);
        chimeGain.gain.linearRampToValueAtTime(0.09, audioCtxRef.current.currentTime + 0.05);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 1.2);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(analyserRef.current);
        chimeOsc.start(0);

        setTimeout(() => {
          try {
            chimeOsc.stop();
            chimeOsc.disconnect();
            chimeGain.disconnect();
          } catch(err) {}
        }, 1300);
      } catch (err) {}
    };

    triggerChimeInstance();
    const chimeTimer = setInterval(triggerChimeInstance, 2400);
    synthNodesRef.current.chimeTimer = chimeTimer;

    let animationFrameId: number;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateAnalyserData = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);

      const newAmplitudes = new Array(16).fill(0);
      const binsPerChannel = Math.floor(bufferLength / 16);

      for (let i = 0; i < 16; i++) {
        let sum = 0;
        for (let j = 0; j < binsPerChannel; j++) {
          sum += dataArray[i * binsPerChannel + j];
        }
        newAmplitudes[i] = sum / binsPerChannel;
      }

      setVocalFrequencyArray(newAmplitudes);
      animationFrameId = requestAnimationFrame(updateAnalyserData);
    };

    updateAnalyserData();

    return () => {
      clearInterval(filterSweepInterval);
      if (chimeTimer) clearInterval(chimeTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [playingTrack, globalMasterPlaying]);

  // ── WebGL Screen-Sweep Shader Effect ──
  useEffect(() => {
    if (!liquidSweepActive) return;

    const canvas = webglCanvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl") as WebGLRenderingContext;
    if (!gl) {
      console.error("WebGL not supported, falling back.");
      onLiquidSweepPeak();
      setLiquidSweepActive(false);
      return;
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        vUv.y = 1.0 - vUv.y;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform float uProgress;
      uniform float uTime;
      uniform vec2 uResolution;

      void main() {
        float sweepY = -0.2 + uProgress * 1.4;
        float wave = sin(vUv.x * 14.0 + uTime * 6.0) * 0.07 + sweepY;
        float edgeWidth = 0.02;
        float distToWave = vUv.y - wave;

        if (distToWave < 0.0) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        } else if (distToWave < edgeWidth) {
          float edgeAlpha = 1.0 - (distToWave / edgeWidth);
          vec3 edgeColor = mix(vec3(0.18, 0.85, 0.45), vec3(1.0, 1.0, 1.0), edgeAlpha * 0.5);
          gl_FragColor = vec4(edgeColor, edgeAlpha * 0.95);
        } else {
          float depth = clamp((distToWave - edgeWidth) * 3.5, 0.0, 1.0);
          vec3 waterBaseColor = vec3(0.04, 0.38, 0.22);
          vec3 waterTopColor = vec3(0.08, 0.65, 0.38);
          vec3 color = mix(waterTopColor, waterBaseColor, depth);
          float ripples = sin(vUv.x * 32.0 + vUv.y * 32.0 - uTime * 12.0) * 0.05 + 0.95;
          color *= ripples;
          float fade = 1.0 - clamp((distToWave - 0.2) * 1.5, 0.0, 0.8);
          gl_FragColor = vec4(color, fade * 0.75);
        }
      }
    `;

    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error: ", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("WebGL program link error: ", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uProgressLoc = gl.getUniformLocation(program, "uProgress");
    const uTimeLoc = gl.getUniformLocation(program, "uTime");
    const uResolutionLoc = gl.getUniformLocation(program, "uResolution");

    let progress = 0;
    let time = 0;
    let peakTriggered = false;
    let animationFrame: number;

    const render = () => {
      time += 0.035;
      progress += 0.0125;

      gl.uniform1f(uProgressLoc, progress);
      gl.uniform1f(uTimeLoc, time);
      gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);

      if (progress >= 0.5 && !peakTriggered) {
        peakTriggered = true;
        onLiquidSweepPeak();
      }

      setLiquidSweepProgress(progress);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (progress < 1.0) {
        animationFrame = requestAnimationFrame(render);
      } else {
        setLiquidSweepActive(false);
        setLiquidSweepProgress(0);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrame);
      try {
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      } catch (err) {}
    };
  }, [liquidSweepActive]);

  // ── Ambient Background Particle Emitter Effect ──
  useEffect(() => {
    if (!ambientActive) return;

    const canvas = particleCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;
    let particles: any[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const createParticle = (initBottom = false) => {
      const width = canvas.width;
      const height = canvas.height;

      switch (ambientTime) {
        case "dawn":
          return {
            x: Math.random() * width,
            y: initBottom ? height + 100 : Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -Math.random() * 0.6 - 0.3,
            size: Math.random() * 80 + 60,
            opacity: 0,
            maxOpacity: Math.random() * 0.12 + 0.05,
            color: "200, 220, 230",
            type: "vapor",
            life: 0,
            maxLife: Math.random() * 1000 + 1000
          };

        case "noon":
          return {
            x: Math.random() * width,
            y: initBottom ? height + 40 : Math.random() * height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -Math.random() * 1.4 - 0.6,
            size: Math.random() * 8 + 3,
            opacity: Math.random() * 0.4 + 0.2,
            color: "46, 154, 79",
            type: "bubble",
            wobble: Math.random() * Math.PI,
            wobbleSpeed: Math.random() * 0.05 + 0.02,
            popTimer: Math.random() * 600 + 400
          };

        case "sunset":
          return {
            x: Math.random() * width,
            y: initBottom ? -40 : Math.random() * height,
            vx: Math.random() * 0.8 + 0.4,
            vy: Math.random() * 0.8 + 0.6,
            size: Math.random() * 14 + 8,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.04,
            opacity: Math.random() * 0.35 + 0.2,
            color: Math.random() > 0.5 ? "#d97706" : "#f59e0b",
            type: "leaf",
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.02 + 0.01
          };

        case "midnight":
          return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            size: Math.random() * 2.5 + 0.5,
            opacity: Math.random() * 0.8 + 0.2,
            glowSize: Math.random() * 8 + 4,
            pulseSpeed: Math.random() * 0.04 + 0.01,
            pulseOffset: Math.random() * Math.PI,
            type: "star"
          };
      }
    };

    const count = ambientTime === "dawn" ? 25 : ambientTime === "noon" ? 45 : ambientTime === "sunset" ? 35 : 120;
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(false));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        switch (p.type) {
          case "vapor":
            p.x += p.vx;
            p.y += p.vy;
            p.life++;
            if (p.life < 200) {
              p.opacity = (p.life / 200) * p.maxOpacity;
            } else if (p.life > p.maxLife - 200) {
              p.opacity = ((p.maxLife - p.life) / 200) * p.maxOpacity;
            } else {
              p.opacity = p.maxOpacity;
            }

            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            grad.addColorStop(0, `rgba(${p.color}, ${p.opacity})`);
            grad.addColorStop(0.5, `rgba(${p.color}, ${p.opacity * 0.4})`);
            grad.addColorStop(1, `rgba(${p.color}, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            if (p.life >= p.maxLife || p.y < -p.size || p.x < -p.size || p.x > canvas.width + p.size) {
              particles[idx] = createParticle(true);
            }
            break;

          case "bubble":
            p.y += p.vy;
            p.wobble += p.wobbleSpeed;
            p.x += p.vx + Math.sin(p.wobble) * 0.3;
            p.popTimer--;

            ctx.beginPath();
            ctx.strokeStyle = `rgba(${p.color}, ${p.opacity})`;
            ctx.lineWidth = 1.2;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 1.5})`;
            ctx.lineWidth = 1.0;
            ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.4, Math.PI * 1.1, Math.PI * 1.6);
            ctx.stroke();

            if (p.popTimer <= 0 || p.y < -p.size * 2) {
              particles[idx] = createParticle(true);
            }
            break;

          case "leaf":
            p.y += p.vy;
            p.x += p.vx + Math.sin(p.wobble) * 0.4;
            p.wobble += p.wobbleSpeed;
            p.rotation += p.rotSpeed;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.moveTo(0, -p.size);
            ctx.quadraticCurveTo(p.size * 0.6, -p.size * 0.2, 0, p.size);
            ctx.quadraticCurveTo(-p.size * 0.6, -p.size * 0.2, 0, -p.size);
            ctx.fill();
            ctx.restore();

            if (p.y > canvas.height + p.size || p.x > canvas.width + p.size) {
              particles[idx] = createParticle(true);
            }
            break;

          case "star":
            p.x += p.vx;
            p.y += p.vy;
            p.pulseOffset += p.pulseSpeed;
            const currentOpacity = p.opacity * (0.35 + 0.65 * Math.sin(p.pulseOffset));

            ctx.beginPath();
            ctx.fillStyle = `rgba(16, 185, 129, ${currentOpacity})`;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            if (p.size > 1.8) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(16, 185, 129, ${currentOpacity * 0.45})`;
              ctx.lineWidth = 0.8;
              ctx.moveTo(p.x - p.glowSize, p.y);
              ctx.lineTo(p.x + p.glowSize, p.y);
              ctx.moveTo(p.x, p.y - p.glowSize);
              ctx.lineTo(p.x, p.y + p.glowSize);
              ctx.stroke();
            }

            if (p.x < 0 || p.x > canvas.width) p.vx = -p.vx;
            if (p.y < 0 || p.y > canvas.height) p.vy = -p.vy;
            break;
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, [ambientActive, ambientTime]);

  const getBackgroundGradient = () => {
    if (!ambientActive) return undefined;
    switch (ambientTime) {
      case "dawn": return "linear-gradient(to bottom right, #EFF5FA, #DCE3E8)";
      case "noon": return "linear-gradient(to bottom right, #FAFCF8, #E3ECCE)";
      case "sunset": return "linear-gradient(to bottom right, #FEF9EC, #F5D8BA)";
      case "midnight": return "linear-gradient(to bottom right, #0A140C, #040905)";
    }
  };

  const isDark = ambientActive && ambientTime === "midnight";
  const textClass = isDark ? "text-[#E2F5E9]" : "text-[#0F2A1E]";
  const mutedTextClass = isDark ? "text-[#A5C4B4]" : "text-[#586b5e]";
  const borderClass = isDark ? "border-emerald-950/40" : "border-[#E3EADD]";
  const cardBgClass = isDark ? "bg-[#09120B]/90 border-emerald-900/40" : "bg-white border-[#E3EADD]";
  const lightBgClass = isDark ? "bg-[#050B06]/85 border-emerald-950/30" : "bg-[#FAFCF8] border-[#E3EADD]/60";
  const accentColor = 
    ambientTime === "dawn" ? "#14b8a6" : 
    ambientTime === "noon" ? "#2E9A4F" : 
    ambientTime === "sunset" ? "#d97706" : "#10b981";

  // ── MOUSE TRACKING FOR MAGNETIC/GLOW EFFECTS ──────────────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
  };

  // ── SCROLL ANIMATIONS FOR THE AWWWARDS TIMELINE ──────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.98, 1.02]);
  
  // Transform background color based on scroll distance (Format 4: Background Morph)
  const bgProgress = useTransform(
    scrollYProgress, 
    [0, 0.3, 0.6, 0.9, 1], 
    ["#FAFCF8", "#FAFCF8", "#E6ECE1", "#0F2A1E", "#0F2A1E"]
  );

  // Parallax elements scroll offset (Format 5: Parallax Stack)
  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const parallaxY3 = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // ── INTERACTIVE CAROUSEL WHEEL (Format 3 Circular Carousel) ──────────────
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselCards = [
    { text: "My bins smell like fresh peppermint. Simply brilliant local service.", author: "Liam G. from Tarneit" },
    { text: "No more maggots in my FOGO compost bin. Worth every dollar.", author: "David M. from Truganina" },
    { text: "Outstanding visual branding, same-day scheduling, professional team.", author: "Jessica R. from Point Cook" }
  ];

  // ── AUDIO TESTIMONIALS CONSOLE (5 Recordings with Live Equalizers) ───────

  // ── LANDING PAGE VIEWPORT PRESETS SANDBOX (5 Architectural Layouts) ──────
  const [activePresetStyle, setActivePresetStyle] = useState<1 | 2 | 3 | 4 | 5>(1);

  // ── INTERACTIVE FOCAL-CROP DEMO ──────────────────────────────────────────
  const [focalPosition, setFocalPosition] = useState({ x: 50, y: 15 });

  // ── PARTICLES BURST STATE (Effect 6 Particle Dispersion) ──────────────────
  interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
  }
  const [clickParticles, setParticles] = useState<Particle[]>([]);
  const triggerParticleBurst = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    const newParticles: Particle[] = Array.from({ length: 18 }).map((_, i) => ({
      id: Date.now() + i,
      x: startX,
      y: startY,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 4, // pull slightly upward
      size: Math.random() * 8 + 4,
      color: i % 2 === 0 ? "rgba(46,154,79,0.7)" : "rgba(12,58,82,0.7)"
    }));
    
    setParticles((prev) => [...prev, ...newParticles]);
  };

  // Particles tick simulation
  useEffect(() => {
    if (clickParticles.length === 0) return;
    const interval = setInterval(() => {
      setParticles((prev) => 
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15, // gravity
            size: Math.max(0, p.size - 0.2)
          }))
          .filter((p) => p.size > 0)
      );
    }, 16);
    return () => clearInterval(interval);
  }, [clickParticles]);

  // ── TEXT SCRAMBLE HOVER EFFECT ───────────────────────────────────────────
  const [scrambleText, setScrambleText] = useState("AWWWARDS CLASS");
  const originalText = "AWWWARDS CLASS";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@$%";
  
  const handleScramble = () => {
    let iterations = 0;
    const interval = setInterval(() => {
      setScrambleText(originalText.split("").map((char, idx) => {
        if (char === " ") return " ";
        if (idx < iterations) return originalText[idx];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));
      
      iterations += 1/3;
      if (iterations >= originalText.length) {
        clearInterval(interval);
        setScrambleText(originalText);
      }
    }, 30);
  };

  // Transform page-wide text colors based on scroll value
  const textColor = useTransform(scrollYProgress, [0, 0.7, 0.9], ["#0F2A1E", "#0F2A1E", "#FAFCF8"]);
  const mutedTextColor = useTransform(scrollYProgress, [0, 0.7, 0.9], ["#586b5e", "#586b5e", "#cfe0e8"]);

  // ── SECTION 8: KINETIC TYPOGRAPHY STATES ─────────────────────────────────
  // Variant 1: Mask Reveal
  const [revealKey, setRevealKey] = useState(0);
  const [revealStagger, setRevealStagger] = useState(0.08);
  const [revealSpringPreset, setRevealSpringPreset] = useState<"cinematic" | "snappy" | "wobbly">("cinematic");

  // Variant 2: Cyber Scramble
  const [decryptText, setDecryptText] = useState("SANITISED IN 10 MINUTES");
  const [decryptActiveText, setDecryptActiveText] = useState("SANITISED IN 10 MINUTES");
  const [decryptCharSet, setDecryptCharSet] = useState<"cyber" | "binary" | "matrix" | "hex">("cyber");
  const [decryptDuration, setDecryptDuration] = useState(1.5); // seconds
  const [isDecrypting, setIsDecrypting] = useState(false);

  // Variant 3: Fluid Elastic Proximity
  const [elasticTension, setElasticTension] = useState<"wobbly" | "snappy" | "heavy">("wobbly");

  // Variant 4: Split-Tone Contrast Slide
  const [splitPos, setSplitPos] = useState(50);

  // Variant 5: SVG Curving Path Ribbon
  const [splineOffset, setSplineOffset] = useState(0);
  const [splineBaseSpeed, setSplineBaseSpeed] = useState(0.2);
  const [splineShape, setSplineShape] = useState<"s-curve" | "loop">("s-curve");

  // Advanced Decrypt Solver logic
  const runDecryptSolver = (textToDecrypt: string) => {
    if (isDecrypting) return;
    setIsDecrypting(true);
    
    let iterations = 0;
    const charSets = {
      cyber: "▰▓░█_#@$%*+=<>?/~!",
      binary: "01",
      matrix: "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890",
      hex: "0123456789ABCDEF"
    };
    const activeChars = charSets[decryptCharSet] || charSets.cyber;
    const textLength = textToDecrypt.length;
    
    const totalSteps = Math.floor(decryptDuration * 30); // 30 updates per second
    const stepsPerChar = totalSteps / textLength;

    const interval = setInterval(() => {
      setDecryptActiveText(
        textToDecrypt
          .split("")
          .map((char, idx) => {
            if (char === " ") return " ";
            const resolvedBoundary = iterations / stepsPerChar;
            if (idx < resolvedBoundary) {
              return textToDecrypt[idx];
            }
            return activeChars[Math.floor(Math.random() * activeChars.length)];
          })
          .join("")
      );

      iterations++;
      if (iterations >= totalSteps) {
        clearInterval(interval);
        setDecryptActiveText(textToDecrypt);
        setIsDecrypting(false);
      }
    }, 1000 / 30);
  };

  // Run automatically once on mount or when character set changes
  useEffect(() => {
    runDecryptSolver(decryptText);
  }, [decryptCharSet]);

  // SVG Spline marquee crawler loop with scroll velocity acceleration
  useEffect(() => {
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let scrollVelocity = 0;
    let active = true;

    const tick = () => {
      if (!active) return;
      
      const currentScrollY = window.scrollY;
      const diff = Math.abs(currentScrollY - lastScrollY);
      scrollVelocity = scrollVelocity * 0.9 + diff * 0.1; // exp moving average
      lastScrollY = currentScrollY;

      // Map scroll velocity to offset increment, adding base speed
      const speedModifier = 1 + scrollVelocity * 0.25;
      setSplineOffset((prev) => (prev + splineBaseSpeed * speedModifier) % 100);

      // Decelerate velocity gradually
      scrollVelocity *= 0.95;

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    return () => {
      active = false;
    };
  }, [splineBaseSpeed]);

  return (
    <motion.div 
      ref={containerRef}
      style={ambientActive ? { background: getBackgroundGradient() } : { backgroundColor: bgProgress }}
      className={`min-h-screen ${textClass} font-sans antialiased overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-800 transition-colors duration-500 relative`}
    >
      {/* Feature 3: Ambiance Background Particle Canvas */}
      {ambientActive && (
        <canvas
          ref={particleCanvasRef}
          className="fixed inset-0 pointer-events-none z-0 opacity-80"
        />
      )}
      
      {/* Cinematic Awwwards Header */}
      <header className="relative py-28 border-b border-[#E3EADD] overflow-hidden bg-gradient-to-b from-emerald-50/20 to-transparent">
        <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-[#1F7A3D] text-[11px] font-black tracking-[.2em] uppercase rounded-full border border-emerald-100 mb-6 cursor-pointer hover:bg-emerald-100/50 transition-all">
              <Sparkles size={12} className="animate-pulse" />
              Creative Design Arena v2.0
            </span>
            <h1 className="text-[clamp(44px,7.5vw,94px)] font-black leading-none tracking-tight">
              EcoBins <span className="text-[#2E9A4F] cursor-pointer" onMouseEnter={handleScramble}>{scrambleText}</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-[#586b5e] max-w-[32em] mx-auto leading-relaxed">
              Explore complex SVG timelines, draggable physics tracks, voice soundboards, and glowing cursor effects coded to Awwwards standards.
            </p>
          </motion.div>
          
          <div className="mt-8 flex justify-center gap-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-[#0C3A52] text-white font-extrabold text-sm px-6 py-3.5 rounded-full hover:bg-slate-900 transition-all shadow-md active:scale-95 duration-150"
            >
              <ArrowRight size={16} className="rotate-180" />
              Back to Home
            </Link>
            <Link 
              href="/home-2"
              className="inline-flex items-center gap-2 bg-emerald-500 text-white font-extrabold text-sm px-6 py-3.5 rounded-full hover:bg-emerald-600 transition-all shadow-md active:scale-95 duration-150"
            >
              Go to Home 2 Draft
              <Tv size={16} />
            </Link>
          </div>
        </div>

        {/* Moving Laser Mesh background grid */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#E3EADD_1px,transparent_1px),linear-gradient(to_bottom,#E3EADD_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFCF8] to-transparent" />
        </div>
      </header>

      {/* ── THEATRE.JS CINEMATIC WASH SECTION ───────────────────────────────── */}
      <section className="py-24 border-b border-[#E3EADD] bg-white relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest text-[#2E9A4F] uppercase">
              <Activity size={12} className="animate-spin" />
              TheatreJS Frame Sequencing
            </span>
            <h2 className="text-4xl font-black mt-2 text-[#0F2A1E]">Specialized Hydro Wash Sequencer</h2>
            <p className="text-[#586b5e] mt-3 leading-relaxed">
              We choreographed the sub-second mechanics of a high-pressure bin wash using world-class **Theatre.js**. Drag the timeline handle to inspect nozzles, lid opening rotations, and wash stages.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#FAFCF8] border border-[#E3EADD] rounded-[36px] p-8 md:p-12 shadow-sm min-h-[500px]">
            
            {/* Left: Vector Washer SVG Canvas */}
            <div className="relative border border-[#E3EADD] bg-white rounded-3xl p-8 min-h-[380px] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#E3EADD_1px,transparent_1px),linear-gradient(to_bottom,#E3EADD_1px,transparent_1px)] bg-[size:2rem_2rem]" />
              </div>

              {/* Water Splash Particles */}
              {theatreValues.waterPressure > 10 && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        x: [180 + Math.sin(i) * 30, 180 + Math.sin(i) * 120 + (Math.random() - 0.5) * 60],
                        y: [160, 240 + Math.random() * 80],
                        opacity: [0, 0.8, 0],
                        scale: [0.2, Math.random() * 0.8 + 0.4, 0]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.6 + Math.random() * 0.4, 
                        delay: i * 0.05, 
                        ease: "easeOut" 
                      }}
                      className="absolute w-3.5 h-3.5 rounded-full bg-sky-200/60 backdrop-blur-xs shadow-sm border border-white/20"
                    />
                  ))}
                  {/* Floating Bubble Foam */}
                  {theatreValues.waterPressure > 60 && (
                    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1 items-end">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -10 - Math.random() * 20, 0], scale: [0.8, 1.2, 0.8] }}
                          transition={{ repeat: Infinity, duration: 0.8 + i * 0.1 }}
                          className="w-4 h-4 bg-emerald-50 rounded-full border border-[#E3EADD] shadow-xs"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sparkles on 100% Clean */}
              {theatreValues.cleanliness > 80 && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                  {[
                    { left: "30%", top: "35%" },
                    { left: "68%", top: "45%" },
                    { left: "52%", top: "25%" }
                  ].map((pos, i) => (
                    <motion.div
                      key={i}
                      style={{ scale: theatreValues.sparkleScale, left: pos.left, top: pos.top }}
                      className="absolute text-emerald-500 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                      animate={{ rotate: [0, 90, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Sparkles size={24} />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Central Cleaning Mechanism SVG */}
              <svg viewBox="0 0 360 360" className="w-[300px] h-[300px] relative z-10 overflow-visible">
                {/* Background Wash Floor */}
                <rect x="60" y="300" width="240" height="8" rx="4" fill="#0C3A52" fillOpacity="0.08" />

                {/* Left Side: Hydraulic Wash Boom / Spray Nozzle Arm */}
                <g transform={`translate(180, 70) rotate(${theatreValues.nozzleAngle})`}>
                  {/* Metal Pipeline */}
                  <path d="M-15,-60 L-15,-10 A15,15 0 0,0 15,-10 L15,-60" fill="none" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
                  {/* Specialized Spray Nozzle Tip */}
                  <rect x="-8" y="-10" width="16" height="20" rx="2" fill="#475569" />
                  <ellipse cx="0" cy="10" rx="5" ry="3" fill="#1E293B" />

                  {/* Water Spray Cone */}
                  {theatreValues.waterPressure > 5 && (
                    <polygon 
                      points="0,10 -35,110 35,110" 
                      fill="url(#sprayGrad)" 
                      opacity={theatreValues.waterPressure / 100}
                    />
                  )}
                </g>

                {/* Right Side: The Wheelie Bin */}
                {/* Bin Lid Group (Rotates and Opens) */}
                <g transform={`translate(130, 180)`}>
                  <g transform={`rotate(${theatreValues.binLidAngle}, 0, 0)`}>
                    {/* Lid Handle & Body */}
                    <path d="M-15,0 L15,0 L12,-12 L-12,-12 Z" fill="#475569" />
                    <rect x="-6" y="-18" width="12" height="6" rx="2" fill="none" stroke="#475569" strokeWidth="3" />
                  </g>
                </g>

                {/* Bin Body (Color-morphs based on cleanliness telemetry) */}
                <path 
                  d="M115,182 L245,182 L235,300 L125,300 Z" 
                  fill={`mix(#94A3B8, #2E9A4F, ${theatreValues.cleanliness / 100})`}
                  style={{
                    // Procedural fallback morph
                    fill: theatreValues.cleanliness > 75 
                      ? "#E6F4EA" 
                      : theatreValues.cleanliness > 40 
                        ? "#94A3B8" 
                        : "#64748B"
                  }}
                  stroke="#334155" 
                  strokeWidth="5" 
                  strokeLinejoin="round" 
                />
                
                {/* Dirty spots overlay (fades out as cleanliness grows) */}
                {theatreValues.cleanliness < 95 && (
                  <g opacity={(100 - theatreValues.cleanliness) / 100}>
                    {/* Dirt splotch 1 */}
                    <path d="M130,200 Q145,215 150,200 T170,220" fill="none" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
                    {/* Dirt splotch 2 */}
                    <ellipse cx="210" cy="240" rx="14" ry="8" fill="#451A03" opacity="0.4" />
                    {/* Dirt splotch 3 */}
                    <path d="M140,260 Q160,250 180,265" fill="none" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
                  </g>
                )}

                {/* Bin Wheels */}
                <circle cx="130" cy="302" r="10" fill="#1E293B" stroke="#475569" strokeWidth="3" />
                <circle cx="230" cy="302" r="10" fill="#1E293B" stroke="#475569" strokeWidth="3" />
                <circle cx="130" cy="302" r="4" fill="#94A3B8" />
                <circle cx="230" cy="302" r="4" fill="#94A3B8" />

                <defs>
                  {/* Water Spray Gradient */}
                  <linearGradient id="sprayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#7DD3FC" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Right: Controls & Live Dev Terminal */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-[#0F2A1E]">Sequencer Control Board</h3>
                <p className="text-xs text-[#586b5e] mt-1.5 leading-relaxed">
                  Scrub the slider below to trigger real-time changes inside the vector engine, or activate the **Studio Editor** to edit curves in real time.
                </p>
              </div>

              {/* Scrubber Slidewire */}
              <div className="border border-[#E3EADD] rounded-2xl p-5 bg-white space-y-3">
                <div className="flex justify-between text-xs font-bold text-[#0F2A1E]">
                  <span>Timeline Position</span>
                  <span className="font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[11px]">{theatrePosition.toFixed(2)}s / 5.00s</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="5" 
                  step="0.01" 
                  value={theatrePosition}
                  onChange={handleScrubChange}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#2E9A4F]"
                />
                
                {/* Playback Buttons */}
                <div className="flex flex-wrap items-center justify-between pt-2 gap-3">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setTheatreActivePlaying(!theatrePlaying)}
                      className={`px-4 py-2 rounded-full font-extrabold text-xs flex items-center gap-1.5 transition-all scale-100 active:scale-95 duration-100 ${
                        theatrePlaying 
                          ? "bg-[#0C3A52] text-white" 
                          : "bg-[#2E9A4F] text-white hover:bg-[#1F7A3D]"
                      }`}
                    >
                      {theatrePlaying ? <Pause size={12} /> : <Play size={12} />}
                      {theatrePlaying ? "Pause Timeline" : "Play Timeline"}
                    </button>

                    {/* Speed Multipliers */}
                    <div className="inline-flex bg-slate-100 p-0.5 rounded-full border border-slate-200">
                      {[0.5, 1, 1.5, 2].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => setTheatreSpeed(spd)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider transition-all ${
                            theatreSpeed === spd 
                              ? "bg-white text-slate-800 shadow-xs" 
                              : "text-slate-400 hover:text-slate-600"
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={handleLaunchStudio}
                    className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-4 py-2 rounded-full transition-all scale-100 active:scale-95 duration-100"
                  >
                    <Sliders size={12} />
                    {studioLoaded ? "Studio Active" : "Launch Theatre Studio"}
                  </button>
                </div>
              </div>

              {/* Developer Telemetry Live Grid */}
              <div className="border border-slate-900 bg-slate-950 rounded-2xl p-5 font-mono text-emerald-400 text-xs shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <span className="text-[10px] tracking-widest text-slate-500 uppercase font-bold">Telemetry HUD System</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-slate-500 block text-[10px]">NOZZLE_ANGLE:</span>
                    <span className="text-white font-bold">{theatreValues.nozzleAngle.toFixed(2)}°</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 block text-[10px]">WATER_PRESSURE:</span>
                    <span className="text-white font-bold">{theatreValues.waterPressure.toFixed(2)} bar</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 block text-[10px]">BIN_LID_ANGLE:</span>
                    <span className="text-white font-bold">{theatreValues.binLidAngle.toFixed(2)}°</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 block text-[10px]">CLEANLINESS:</span>
                    <span className="text-emerald-300 font-bold">{theatreValues.cleanliness.toFixed(2)}%</span>
                  </div>
                </div>
                <div className="border-t border-slate-800 pt-3 mt-3 flex items-center justify-between text-slate-500 text-[10px]">
                  <span>SEQUENCE_STATUS: {theatrePlaying ? "RUNNING" : "STANDBY"}</span>
                  <span>THEATRE_ACTIVE: TRUE</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: Booking System Arena (4 Modes) */}
      <section className="py-24 border-b border-[#E3EADD]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <span className="text-xs font-black tracking-widest text-[#2E9A4F] uppercase">Interactive Showcase</span>
            <h2 className="text-4xl font-black mt-2 text-[#0F2A1E]">The Booking System: Four Ways</h2>
            <p className="text-[#586b5e] mt-3">We engineered four separate high-conversion models for the booking system. Toggle them below to test their mechanics live.</p>
            
            {/* Mode Select Buttons */}
            <div className="mt-8 inline-flex flex-wrap justify-center p-1.5 bg-slate-100 rounded-full border border-[#E3EADD] gap-1">
              {(["popup", "sidesheet", "floater", "fullwidth"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActiveBookingMode(mode)}
                  className={`px-5 py-2 rounded-full font-bold text-xs capitalize transition-all ${
                    activeBookingMode === mode 
                      ? "bg-white text-[#0F2A1E] shadow-xs" 
                      : "text-[#586b5e] hover:text-[#0F2A1E]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1.7fr] gap-12 items-center bg-white border border-[#E3EADD] rounded-[32px] p-8 md:p-12 shadow-sm min-h-[500px]">
            
            {/* Mechanics Explanation */}
            <div>
              <AnimatePresence mode="wait">
                {activeBookingMode === "popup" && (
                  <motion.div
                    key="popup-desc"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    <span className="w-10 h-10 rounded-xl bg-emerald-50 text-[#2E9A4F] flex items-center justify-center">
                      <Maximize size={20} />
                    </span>
                    <h3 className="text-2xl font-black text-[#0F2A1E]">The Screen Pop-Up Modal</h3>
                    <p className="text-sm text-[#586b5e] leading-relaxed">
                      A centralized lightbox overlay that isolates the entire web viewport, dimming background distractions. This focuses 100% of the customer's cognitive attention strictly on booking parameters.
                    </p>
                    <button 
                      onClick={() => setIsPopupOpen(true)}
                      className="inline-flex items-center gap-2 bg-[#2E9A4F] text-white font-extrabold text-sm px-6 py-3 rounded-full hover:bg-[#1F7A3D] transition-all scale-100 active:scale-95"
                    >
                      Trigger Pop-Up Wizard
                    </button>
                  </motion.div>
                )}

                {activeBookingMode === "sidesheet" && (
                  <motion.div
                    key="sidesheet-desc"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    <span className="w-10 h-10 rounded-xl bg-[#0C3A52]/10 text-[#0C3A52] flex items-center justify-center">
                      <Layers size={20} />
                    </span>
                    <h3 className="text-2xl font-black text-[#0F2A1E]">The Slide-Out Side Cart</h3>
                    <p className="text-sm text-[#586b5e] leading-relaxed">
                      Slides in from the right edge with a premium glassmorphic backdrop. This is highly recommended if you want customers to scroll through photos/benefits on the left while keeping their active cart in view.
                    </p>
                    <button 
                      onClick={() => setIsSidesheetOpen(true)}
                      className="inline-flex items-center gap-2 bg-[#0C3A52] text-white font-extrabold text-sm px-6 py-3 rounded-full hover:bg-slate-900 transition-all scale-100 active:scale-95"
                    >
                      Slide Out Side Sheet
                    </button>
                  </motion.div>
                )}

                {activeBookingMode === "floater" && (
                  <motion.div
                    key="floater-desc"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Smartphone size={20} />
                    </span>
                    <h3 className="text-2xl font-black text-[#0F2A1E]">The Persistent Floating Bubble</h3>
                    <p className="text-sm text-[#586b5e] leading-relaxed">
                      A clean floating bubble located in the bottom-right corner of the window. Ideal for keeping booking access permanently accessible on mobile without breaking content flow.
                    </p>
                    <button 
                      onClick={() => setIsFloaterExpanded(true)}
                      className="inline-flex items-center gap-2 bg-amber-500 text-white font-extrabold text-sm px-6 py-3 rounded-full hover:bg-amber-600 transition-all scale-100 active:scale-95"
                    >
                      Expand Bottom Floater
                    </button>
                  </motion.div>
                )}

                {activeBookingMode === "fullwidth" && (
                  <motion.div
                    key="fullwidth-desc"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    <span className="w-10 h-10 rounded-xl bg-lime-50 text-[#74C13B] flex items-center justify-center">
                      <Grid size={20} />
                    </span>
                    <h3 className="text-2xl font-black text-[#0F2A1E]">The Full-Width Embedded Section</h3>
                    <p className="text-sm text-[#586b5e] leading-relaxed">
                      Directly integrated inside the scrolling viewport. This requires zero clicking or transitions and keeps the booking wizard inline, as part of the page's natural narrative progression.
                    </p>
                    <Link 
                      href="#embedded-booking-wizard-demo"
                      className="inline-flex items-center gap-2 bg-[#74C13B] text-white font-extrabold text-sm px-6 py-3 rounded-full hover:opacity-95 transition-all scale-100 active:scale-95"
                    >
                      Scroll to Embedded Section
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Live Mode Mockup Render */}
            <div className="relative border border-[#E3EADD] rounded-2xl p-6 bg-[#FAFCF8] overflow-hidden min-h-[340px] flex items-center justify-center">
              <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#E3EADD_1px,transparent_1px),linear-gradient(to_bottom,#E3EADD_1px,transparent_1px)] bg-[size:2rem_2rem]" />
              </div>

              {/* Popup Mode Visual Demo */}
              <AnimatePresence>
                {isPopupOpen && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
                  >
                    <motion.div 
                      initial={{ scale: 0.93, opacity: 0, y: 15 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.93, opacity: 0, y: 15 }}
                      transition={{ type: "spring", damping: 25, stiffness: 350 }}
                      className="bg-white rounded-2xl border border-[#E3EADD] p-6 max-w-sm w-full relative shadow-lg"
                    >
                      <button onClick={() => setIsPopupOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-[#0F2A1E]">
                        <X size={16} />
                      </button>
                      <h4 className="font-extrabold text-[#0F2A1E] text-md flex items-center gap-1.5">
                        <Sparkles size={16} className="text-[#2E9A4F]" />
                        Tarneit Launch Booking
                      </h4>
                      <p className="text-xs text-[#586b5e] mt-1">Configure your alternating cleans package.</p>
                      
                      {/* Step Mock */}
                      <div className="mt-5 border border-[#E3EADD] rounded-xl p-4 space-y-3 bg-[#FAFCF8]">
                        <p className="text-xs font-bold uppercase text-[#586b5e] tracking-wider">Step 1 of 3: Address</p>
                        <input 
                          type="text" 
                          placeholder="Search your street name in Tarneit..." 
                          className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#E3EADD] bg-white focus:outline-[#2E9A4F]"
                        />
                      </div>

                      <button className="w-full bg-[#2E9A4F] text-white font-extrabold text-xs py-3 rounded-full mt-4 flex items-center justify-center gap-1.5 hover:bg-[#1F7A3D] transition-colors">
                        Next Step
                        <ChevronRight size={14} />
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Side-Sheet Mode Visual Demo */}
              <AnimatePresence>
                {isSidesheetOpen && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-xs flex justify-end"
                  >
                    <motion.div 
                      initial={{ x: "100%", opacity: 0.8 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: "100%", opacity: 0.8 }}
                      transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
                      className="bg-white border-l border-[#E3EADD] h-full w-[260px] p-5 relative shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <button onClick={() => setIsSidesheetOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-[#0F2A1E]">
                          <X size={16} />
                        </button>
                        <h4 className="font-extrabold text-[#0C3A52] text-sm flex items-center gap-1.5 mt-2">
                          <Sliders size={15} />
                          Quick Checkout
                        </h4>
                        
                        <div className="mt-6 space-y-4">
                          <div className="border border-[#E3EADD] rounded-xl p-3 bg-[#FAFCF8] space-y-2">
                            <span className="text-[10px] font-bold uppercase text-[#586b5e]">Selected Clean</span>
                            <p className="text-xs font-extrabold">2 Cleans for $39 Rate</p>
                          </div>
                          
                          <div className="border border-[#E3EADD] rounded-xl p-3 bg-[#FAFCF8] space-y-2">
                            <span className="text-[10px] font-bold uppercase text-[#586b5e]">Quantity</span>
                            <p className="text-xs font-extrabold">Both Bins (Garbage &amp; Recycle)</p>
                          </div>
                        </div>
                      </div>

                      <button className="w-full bg-[#0C3A52] text-white font-extrabold text-xs py-3 rounded-full flex items-center justify-center gap-1 hover:bg-slate-950 transition-colors">
                        Complete Checkout
                        <ArrowRight size={14} />
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating Mode Visual Demo */}
              <div className="absolute bottom-5 right-5 z-30">
                <AnimatePresence>
                  {isFloaterExpanded ? (
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      className="bg-white border border-[#E3EADD] rounded-2xl p-5 shadow-lg w-[240px] text-left relative mb-2"
                    >
                      <button onClick={() => setIsFloaterExpanded(false)} className="absolute top-3 right-3 text-slate-400 hover:text-[#0F2A1E]">
                        <X size={14} />
                      </button>
                      <h4 className="text-xs font-extrabold">Ready to book?</h4>
                      <p className="text-[11px] text-[#586b5e] mt-1">Get scheduled in 60 seconds.</p>
                      
                      <button className="w-full bg-amber-500 text-white font-extrabold text-[11px] py-2.5 rounded-full mt-3 flex items-center justify-center gap-1 hover:bg-amber-600 transition-colors">
                        Launch Form
                        <Zap size={12} />
                      </button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <button 
                  onClick={() => setIsFloaterExpanded(!isFloaterExpanded)}
                  className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md hover:scale-105 transition-all scale-100 active:scale-95 ml-auto"
                >
                  <Zap size={20} className={isFloaterExpanded ? "rotate-12" : ""} />
                </button>
              </div>

              {/* Full Width Mode Visual Demo */}
              <div className="border border-[#E3EADD] p-6 rounded-xl bg-white max-w-xs w-full text-center shadow-sm">
                <h4 className="text-xs font-black uppercase text-[#74C13B] tracking-wider mb-2">Direct Embed Demo</h4>
                <p className="text-xs text-[#586b5e] leading-relaxed">This acts as a standard page section. Just scroll down to experience the real fully interactive embedded booking form.</p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: Five Photo & Frame Treatments */}
      <section className="py-24 border-b border-[#E3EADD]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <span className="text-xs font-black tracking-widest text-[#2E9A4F] uppercase">Visual Excellence</span>
            <h2 className="text-4xl font-black mt-2 text-[#0F2A1E]">Five Photo &amp; Image Treatments</h2>
            <p className="text-[#586b5e] mt-3">Avoid boring flat images. We have custom-coded 5 next-level visual states to make static photographs come alive.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Treatment 1: 3D Mouse Tilt Card */}
            <motion.div 
              className="bg-white rounded-3xl border border-[#E3EADD] p-6 hover:shadow-lg transition-all min-h-[380px] flex flex-col justify-between"
              whileHover={{ rotateY: 10, rotateX: -5 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div>
                <span className="text-[10px] font-black tracking-widest bg-emerald-50 text-[#2E9A4F] px-2.5 py-1 rounded-md uppercase">1. 3D Tilt Card</span>
                <p className="text-xs text-[#586b5e] mt-2">Card responds to tilt, creating deep mechanical shadows.</p>
              </div>
              <div className="relative h-[220px] rounded-2xl overflow-hidden mt-4 shadow-sm border border-slate-100">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-sky-500/10" />
                <div className="absolute inset-0 flex items-center justify-center flex-col p-4 text-center">
                  <h4 className="font-extrabold text-sm text-[#0F2A1E]">Interactive Tilt Box</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Hovering skews the visual depth, engaging user interest instantly.</p>
                </div>
              </div>
            </motion.div>

            {/* Treatment 2: Interactive Smart Focal Crop */}
            <div className="bg-white rounded-3xl border border-[#E3EADD] p-6 hover:shadow-lg transition-all min-h-[380px] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black tracking-widest bg-[#0C3A52]/10 text-[#0C3A52] px-2.5 py-1 rounded-md uppercase">2. Focal Face Guardian</span>
                <p className="text-xs text-[#586b5e] mt-2">Guarantees that a subject's head is never cut off on resizing.</p>
              </div>
              <div className="mt-4 border border-[#E3EADD] rounded-2xl p-4 bg-[#FAFCF8] space-y-4">
                <div className="relative h-[130px] rounded-xl overflow-hidden border bg-slate-100">
                  {/* Indicator Dot Mocking a Face */}
                  <motion.div 
                    animate={{ left: `${focalPosition.x}%`, top: `${focalPosition.y}%` }}
                    className="absolute w-6 h-6 rounded-full border-2 border-emerald-500 bg-emerald-500/30 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center shadow-md"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  </motion.div>
                  <div className="absolute inset-0 bg-slate-950/5 flex items-end p-2.5">
                    <span className="text-[10px] bg-slate-900/70 text-white px-2 py-0.5 rounded uppercase font-extrabold tracking-wider">Dynamic Crop Box</span>
                  </div>
                </div>
                {/* Control Toggles */}
                <div className="flex gap-2 justify-center">
                  <button onClick={() => setFocalPosition({ x: 50, y: 15 })} className="text-[11px] px-2.5 py-1 bg-[#0C3A52] text-white rounded-md font-bold">Top Focal</button>
                  <button onClick={() => setFocalPosition({ x: 50, y: 50 })} className="text-[11px] px-2.5 py-1 bg-slate-200 rounded-md font-bold text-slate-700">Center Focal</button>
                  <button onClick={() => setFocalPosition({ x: 50, y: 80 })} className="text-[11px] px-2.5 py-1 bg-slate-200 rounded-md font-bold text-slate-700">Bottom Focal</button>
                </div>
              </div>
            </div>

            {/* Treatment 3: Before/After Slide revealer */}
            <div className="bg-white rounded-3xl border border-[#E3EADD] p-6 hover:shadow-lg transition-all min-h-[380px] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black tracking-widest bg-amber-50 text-amber-600 px-2.5 py-1 rounded-md uppercase">3. Interactive Slider</span>
                <p className="text-xs text-[#586b5e] mt-2">Users slide the crop line to reveal the difference live.</p>
              </div>
              <div className="relative h-[220px] rounded-2xl overflow-hidden mt-4 border border-slate-100 bg-slate-100 flex items-center justify-center">
                {/* Clean half */}
                <div className="absolute inset-0 bg-emerald-50 flex flex-col justify-center items-center text-center p-4">
                  <h4 className="font-extrabold text-[#1F7A3D] text-sm">Gleaming Bins</h4>
                  <p className="text-[11px] text-[#586b5e] mt-1">Hospital-grade sanitisation</p>
                </div>
                {/* Dirty overlay */}
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-amber-950/10 backdrop-blur-xs border-r-2 border-amber-600/60 overflow-hidden flex flex-col justify-center items-center text-center p-4"
                  style={{ width: "50%" }}
                >
                  <div className="absolute inset-0 w-[300px] flex flex-col justify-center items-center p-4 text-center">
                    <h4 className="font-extrabold text-amber-800 text-sm">Grimy Bins</h4>
                    <p className="text-[11px] text-amber-900 mt-1">Maggots, flies &amp; slime</p>
                  </div>
                </motion.div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center pointer-events-none z-10 text-[10px] font-bold text-slate-400">↔</div>
              </div>
            </div>

            {/* Treatment 4: Cinematic Depth Scale */}
            <div className="bg-white rounded-3xl border border-[#E3EADD] p-6 hover:shadow-lg transition-all min-h-[380px] flex flex-col justify-between overflow-hidden group cursor-pointer">
              <div>
                <span className="text-[10px] font-black tracking-widest bg-lime-50 text-[#74C13B] px-2.5 py-1 rounded-md uppercase">4. Hover Depth-Scale</span>
                <p className="text-xs text-[#586b5e] mt-2">Borders expand while photo pushes backward on hover.</p>
              </div>
              <div className="relative h-[220px] rounded-2xl overflow-hidden mt-4 border border-slate-100 bg-slate-800">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900 to-[#0F2A1E] opacity-90 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center p-6 text-center">
                  <div>
                    <h4 className="font-extrabold text-white text-sm">Zoom Effect Card</h4>
                    <p className="text-[11px] text-teal-200 mt-1">Image pulls backward inside container boundaries.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Treatment 5: Bento Box Collage Frame */}
            <div className="bg-white rounded-3xl border border-[#E3EADD] p-6 hover:shadow-lg transition-all min-h-[380px] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black tracking-widest bg-purple-50 text-purple-600 px-2.5 py-1 rounded-md uppercase">5. Bento Grid Nest</span>
                <p className="text-xs text-[#586b5e] mt-2">Dynamic interlocking panels that group secondary info cleanly.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 flex-grow">
                <div className="border border-slate-200 rounded-xl p-3 bg-[#FAFCF8] flex flex-col justify-center items-center text-center">
                  <span className="text-xs font-black">99.9%</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Bacteria Sanitised</span>
                </div>
                <div className="border border-slate-200 rounded-xl p-3 bg-[#FAFCF8] flex flex-col justify-center items-center text-center">
                  <span className="text-xs font-black">1300 bar</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Water Blast</span>
                </div>
                <div className="col-span-2 border border-[#E3EADD] rounded-xl p-3 bg-emerald-50/20 text-center flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold">100% Biodegradable Only</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: Five Carousel & Slideshow Formats */}
      <section className="py-24 border-b border-[#E3EADD]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <span className="text-xs font-black tracking-widest text-[#2E9A4F] uppercase">Interactive Motion</span>
            <h2 className="text-4xl font-black mt-2 text-[#0F2A1E]">Five Carousel &amp; Slideshow Formats</h2>
            <p className="text-[#586b5e] mt-3">We compiled five distinct carousel patterns to showcase customer testimonials and before/after renders cleanly.</p>
          </div>

          <div className="space-y-12">
            
            {/* Format 1: Cinematic Infinity Marquee (Auto Scroll) */}
            <div className="bg-white rounded-3xl border border-[#E3EADD] p-8">
              <h3 className="font-extrabold text-md text-[#0F2A1E] mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E9A4F]" />
                Format 1: Infinite Logo/Social Marquee Track
              </h3>
              <div className="relative w-full overflow-hidden h-[44px] flex items-center">
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />
                <motion.div 
                  animate={{ x: [0, -1030] }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
                  className="flex gap-14 items-center whitespace-nowrap"
                >
                  {Array(3).fill([
                    "🌿 100% Biodegradable Soap",
                    "💧 Recycled Water Tanks",
                    "🚛 Specialized Hydraulics",
                    "⭐ Rated 5 Stars on Google",
                    "🏡 Tarneit Local Operators"
                  ]).flat().map((text, idx) => (
                    <span key={idx} className="text-xs font-bold text-[#586b5e] uppercase tracking-widest">{text}</span>
                  ))}
                </motion.div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Format 2: Stacked Card Flick Deck */}
              <div className="bg-white rounded-3xl border border-[#E3EADD] p-6 min-h-[300px] flex flex-col justify-between col-span-1 lg:col-span-2">
                <h3 className="font-extrabold text-sm text-[#0F2A1E] flex items-center gap-1.5 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#0C3A52]" />
                  Format 2: Stacked Card Flick Deck
                </h3>
                <div className="relative h-[160px] flex items-center justify-center">
                  <motion.div 
                    className="absolute w-[85%] h-[120px] bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-xs"
                    style={{ y: -10, scale: 0.94, zIndex: 1 }}
                  />
                  <motion.div 
                    className="absolute w-[92%] h-[120px] bg-slate-100 border border-slate-200 rounded-xl p-4 shadow-sm"
                    style={{ y: -5, scale: 0.97, zIndex: 2 }}
                  />
                  <motion.div 
                    className="absolute w-full h-[120px] bg-emerald-50 border border-emerald-100 rounded-xl p-4 shadow-md flex flex-col justify-between"
                    style={{ y: 0, scale: 1, zIndex: 3 }}
                    whileHover={{ rotate: -2, scale: 1.01 }}
                  >
                    <p className="text-xs italic text-slate-700 font-medium">"My bins smell like fresh peppermint. Simply brilliant local service."</p>
                    <span className="text-[10px] font-bold text-slate-500">— Liam G. from Tarneit</span>
                  </motion.div>
                </div>
                <button className="text-[11px] px-4 py-2 bg-slate-200 rounded-lg font-bold text-slate-700 text-center w-full mt-4">Next Testimonial (Flick)</button>
              </div>

              {/* Format 3: Circular 3D Rotating Wheel Carousel */}
              <div className="bg-white rounded-3xl border border-[#E3EADD] p-6 min-h-[300px] flex flex-col justify-between col-span-1">
                <h3 className="font-extrabold text-sm text-[#0F2A1E] flex items-center gap-1.5 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#2E9A4F]" />
                  Format 3: Perspective Wheel
                </h3>
                <div className="relative h-[150px] flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={carouselIndex}
                      initial={{ rotateY: 45, opacity: 0, z: -100 }}
                      animate={{ rotateY: 0, opacity: 1, z: 0 }}
                      exit={{ rotateY: -45, opacity: 0, z: -100 }}
                      transition={{ duration: 0.4 }}
                      className="bg-gradient-to-br from-slate-50 to-slate-100 border border-[#E3EADD] p-4 rounded-xl text-center shadow-xs"
                    >
                      <p className="text-[11px] italic text-slate-600">"{carouselCards[carouselIndex].text}"</p>
                      <p className="text-[9px] font-black text-emerald-700 mt-2">{carouselCards[carouselIndex].author}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex gap-2 justify-center">
                  <button onClick={() => setCarouselIndex((prev) => (prev === 0 ? carouselCards.length - 1 : prev - 1))} className="p-1 px-3 bg-slate-100 border rounded-md text-xs font-black">←</button>
                  <button onClick={() => setCarouselIndex((prev) => (prev === carouselCards.length - 1 ? 0 : prev + 1))} className="p-1 px-3 bg-slate-100 border rounded-md text-xs font-black">→</button>
                </div>
              </div>

              {/* Format 4: Draggable Kinetic Card Ribbon */}
              <div className="bg-white rounded-3xl border border-[#E3EADD] p-6 min-h-[300px] flex flex-col justify-between col-span-1">
                <h3 className="font-extrabold text-sm text-[#0F2A1E] flex items-center gap-1.5 mb-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Format 4: Kinetic Swipe
                </h3>
                <p className="text-[10px] text-slate-400">Click and drag track freely</p>
                <div className="relative h-[150px] overflow-hidden border border-dashed rounded-xl bg-slate-50/50 flex items-center cursor-grab active:cursor-grabbing">
                  <motion.div 
                    drag="x" 
                    dragConstraints={{ left: -260, right: 0 }}
                    className="flex gap-4 px-4 whitespace-nowrap absolute left-0"
                  >
                    {[
                      { area: "Wyndham Vale", rating: "⭐⭐⭐⭐⭐" },
                      { area: "Werribee South", rating: "⭐⭐⭐⭐⭐" },
                      { area: "Tarneit Central", rating: "⭐⭐⭐⭐⭐" }
                    ].map((item, i) => (
                      <div key={i} className="inline-block bg-white border border-slate-200 p-3 rounded-lg min-w-[130px] text-center shadow-xs">
                        <span className="text-[11px] font-black text-slate-700">{item.area}</span>
                        <div className="text-[9px] mt-1">{item.rating}</div>
                        <span className="text-[8px] text-slate-400 block mt-1">Verified Client</span>
                      </div>
                    ))}
                  </motion.div>
                </div>
                <div className="text-[9px] text-center text-slate-400">Drag left/right to scrub</div>
              </div>

            </div>

            {/* Format 5: Split-Screen Content Mask Slide Transitioner */}
            <div className="bg-white rounded-3xl border border-[#E3EADD] p-8">
              <h3 className="font-extrabold text-md text-[#0F2A1E] mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                Format 5: Split-Screen Sliding Mask
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[220px]">
                <div className="space-y-4">
                  <h4 className="font-black text-lg">Hospital-grade chemical sanitisation</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Our high-pressure wash nozzles spray non-toxic biodegradable disinfectant formulas designed specifically to break down structural mold spores and neutralize bacteria safely.
                  </p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-[#0C3A52] hover:bg-slate-900 text-white font-extrabold text-[11px] rounded-lg">Read Scientific Safety Sheet</button>
                  </div>
                </div>
                <div className="relative h-[200px] rounded-2xl overflow-hidden border">
                  {/* Clean wash overlay simulation */}
                  <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                    <div className="text-center p-4 bg-white/80 rounded-xl backdrop-blur-xs border max-w-[180px]">
                      <h5 className="font-extrabold text-xs">99.9% Sterile</h5>
                      <p className="text-[9px] text-slate-400 mt-1">Biodegradable chemical formula</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: Customer Recording Soundboard */}
      <section className="py-24 border-b border-[#E3EADD]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <span className="text-xs font-black tracking-widest text-[#0C3A52] uppercase">Audio Reviews</span>
            <h2 className="text-4xl font-black mt-2 text-[#0F2A1E]">The Sound of Pure Clean</h2>
            <p className="text-[#586b5e] mt-3">We recorded 5 raw voicemails from ecstatic clients across Melbourne's West. Hear their unedited, unfiltered relief live.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1.2fr] gap-12 items-center bg-white border border-[#E3EADD] rounded-[36px] p-8 md:p-12 shadow-sm">
            
            {/* Left: 5 Voice Tracks Grid */}
            <div className="space-y-4">
              {soundboardTracks.map((track) => (
                <div 
                  key={track.id} 
                  className={`border rounded-2xl p-4 transition-all duration-250 flex items-center justify-between ${
                    playingTrack === track.id 
                      ? "border-emerald-500 bg-emerald-50/20 shadow-xs" 
                      : "border-[#E3EADD] bg-[#FAFCF8] hover:bg-white hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-4 flex-grow">
                    {/* Play Button */}
                    <button 
                      onClick={() => setPlayingTrack(playingTrack === track.id ? null : track.id)}
                      className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 scale-100 active:scale-95 transition-all"
                    >
                      {playingTrack === track.id ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                    </button>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-[#0F2A1E]">{track.name}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{track.area}</span>
                      </div>
                      <p className="text-xs italic text-slate-600 max-w-[28em]">"{track.text}"</p>
                    </div>
                  </div>

                  {/* Equalizer Wave / Timer */}
                  <div className="flex items-center gap-3">
                    {playingTrack === track.id ? (
                      <div className="flex gap-0.5 h-6 items-end">
                        {[2, 5, 8, 11, 14].map((binIdx) => {
                          const amp = vocalFrequencyArray[binIdx] || 0;
                          const heightVal = Math.max(4, Math.min(24, amp * 0.15));
                          return (
                            <span 
                              key={binIdx}
                              style={{ height: `${heightVal}px` }}
                              className="w-1 bg-emerald-500 rounded transition-all duration-75"
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-400 font-bold">{track.dur}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Vintage Master Playback Tape Deck Container */}
            <div className="border border-slate-800 bg-slate-900 rounded-[28px] p-6 text-white shadow-lg space-y-6 flex flex-col justify-between min-h-[360px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full" />
              
              <div>
                <span className="text-[9px] font-black tracking-widest text-emerald-400 uppercase font-mono block mb-2">Master Playback Deck</span>
                <h4 className="font-black text-md leading-tight text-white">Wyndham Voice Compilation Tape</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Combine all five recordings into a continuous background loop to listen while scheduling cleans.</p>
              </div>

              {/* Tape graphic representation */}
              <div className="border border-slate-700 bg-slate-950 p-4 rounded-xl flex items-center justify-between shadow-inner">
                {/* Spool Left */}
                <motion.div 
                  animate={{ rotate: globalMasterPlaying ? 360 : 0 }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 4 }}
                  className="w-12 h-12 rounded-full border-4 border-dashed border-slate-700 flex items-center justify-center bg-slate-900"
                >
                  <div className="w-4 h-4 rounded-full bg-slate-800" />
                </motion.div>

                {/* Central Track Window */}
                <div className="h-6 flex-grow mx-4 border-y border-slate-800 bg-[#0F2A1E]/35 rounded flex items-center justify-center">
                  <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest animate-pulse">
                    {globalMasterPlaying ? "Comp Playing" : "Comp Standby"}
                  </span>
                </div>

                {/* Spool Right */}
                <motion.div 
                  animate={{ rotate: globalMasterPlaying ? 360 : 0 }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 4 }}
                  className="w-12 h-12 rounded-full border-4 border-dashed border-slate-700 flex items-center justify-center bg-slate-900"
                >
                  <div className="w-4 h-4 rounded-full bg-slate-800" />
                </motion.div>
              </div>

              {/* Deck buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button 
                  onClick={() => setGlobalMasterPlaying(!globalMasterPlaying)}
                  className={`w-full font-extrabold text-[11px] py-3 rounded-full flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                    globalMasterPlaying 
                      ? "bg-emerald-500 text-white hover:bg-emerald-600" 
                      : "bg-slate-800 hover:bg-slate-750 text-slate-200"
                  }`}
                >
                  <Volume2 size={12} />
                  {globalMasterPlaying ? "Stop Tape Loop" : "Play Compilation"}
                </button>
                <button 
                  onClick={() => setPlayingTrack(null)}
                  className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 font-extrabold text-[11px] py-3 rounded-full flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <X size={12} />
                  Mute Deck
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: Landing Page Architecture Sandbox */}
      <section className="py-24 border-b border-[#E3EADD] bg-[#FAFCF8]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <span className="text-xs font-black tracking-widest text-[#2E9A4F] uppercase">Conversion Sandboxes</span>
            <h2 className="text-4xl font-black mt-2 text-[#0F2A1E]">Five High-Converting Landing Page Layouts</h2>
            <p className="text-[#586b5e] mt-3">Toggle between 5 distinct page presets inside our simulated viewport mockup to see how visual hierarchies conversion-target users.</p>
            
            {/* Switch Presets */}
            <div className="mt-8 flex flex-wrap gap-2 justify-center">
              {[
                { id: 1, name: "1. Minimalist Split", icon: <Layout size={12} /> },
                { id: 2, name: "2. Bento Command", icon: <Grid size={12} /> },
                { id: 3, name: "3. SaaS Pricing", icon: <Sliders size={12} /> },
                { id: 4, name: "4. Cinematic Story", icon: <Tv size={12} /> },
                { id: 5, name: "5. Proof Heavy Wall", icon: <Pointer size={12} /> }
              ].map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setActivePresetStyle(preset.id as any)}
                  className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all ${
                    activePresetStyle === preset.id 
                      ? "bg-[#0C3A52] text-white shadow-xs" 
                      : "bg-white border text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  {preset.icon}
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Simulated Viewport Frame */}
          <div className="bg-white border border-[#E3EADD] rounded-[40px] shadow-lg overflow-hidden max-w-4xl mx-auto min-h-[500px] flex flex-col">
            {/* Browser Header Bar */}
            <div className="bg-slate-100 px-6 py-4 flex items-center justify-between border-b border-[#E3EADD]">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="bg-white px-8 py-1 rounded-md text-[10px] font-mono text-slate-400 border border-slate-200">
                https://ecobins.net/tarneit-exclusive
              </div>
              <span className="w-3 h-3" />
            </div>

            {/* Browser Content Grid - Renders Presets dynamically */}
            <div className="p-8 md:p-12 flex-grow flex items-center justify-center bg-[#FAFCF8]">
              <AnimatePresence mode="wait">
                {activePresetStyle === 1 && (
                  <motion.div 
                    key="p1" 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full"
                  >
                    <div className="space-y-4">
                      <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded">Suburb Exclusive</span>
                      <h4 className="text-3xl font-black text-slate-900 leading-tight">We sanitize dirty Tarneit wheelie bins.</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">No maggots. No flies. Just a gleaming mint scent. Coded local schedule syncing ensures same-day service right after truck rounds.</p>
                      <button className="bg-emerald-500 text-white font-extrabold text-xs px-5 py-3 rounded-full">Book My Clean Now</button>
                    </div>
                    <div className="border border-[#E3EADD] bg-white p-6 rounded-2xl h-[240px] flex items-center justify-center text-center shadow-xs">
                      <div>
                        <div className="text-4xl">🚛</div>
                        <h5 className="font-extrabold text-xs mt-3 text-slate-800">Floating 3D Vector Frame</h5>
                        <p className="text-[10px] text-slate-400 mt-1">Wash truck rotates on cursor proximity</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activePresetStyle === 2 && (
                  <motion.div 
                    key="p2" 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="grid grid-cols-3 gap-3 w-full"
                  >
                    <div className="col-span-3 border border-[#E3EADD] bg-white p-4 rounded-xl text-center">
                      <h4 className="font-black text-xs uppercase tracking-wider">Tarneit Local Command Center</h4>
                    </div>
                    <div className="border border-[#E3EADD] bg-white p-4 rounded-xl text-center h-[120px] flex flex-col justify-center">
                      <span className="text-lg">⭐ 4.9</span>
                      <span className="text-[9px] text-slate-400 block mt-1">Google reviews</span>
                    </div>
                    <div className="border border-[#E3EADD] bg-white p-4 rounded-xl text-center h-[120px] flex flex-col justify-center">
                      <span className="text-lg">💧 Recycled</span>
                      <span className="text-[9px] text-slate-400 block mt-1">Water compliance</span>
                    </div>
                    <div className="border border-[#E3EADD] bg-white p-4 rounded-xl text-center h-[120px] flex flex-col justify-center">
                      <span className="text-lg">🌿 100%</span>
                      <span className="text-[9px] text-slate-400 block mt-1">Biodegradable soaps</span>
                    </div>
                    <div className="col-span-3 bg-emerald-500 text-white p-4 rounded-xl text-center">
                      <span className="font-extrabold text-xs">Unlock $39 Launch Pricing</span>
                    </div>
                  </motion.div>
                )}

                {activePresetStyle === 3 && (
                  <motion.div 
                    key="p3" 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
                  >
                    <div className="border border-[#E3EADD] bg-white p-6 rounded-2xl text-center flex flex-col justify-between min-h-[220px]">
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400">One-off Clean</span>
                        <h4 className="font-black text-xl text-slate-800 mt-2">$29/Bin Rate</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Perfect if you are vacating the property or need a quick sanitation blast.</p>
                      </div>
                      <button className="w-full bg-[#0C3A52] text-white py-2 rounded-lg text-xs font-bold mt-4">Select One-Off</button>
                    </div>
                    <div className="border-2 border-emerald-500 bg-white p-6 rounded-2xl text-center flex flex-col justify-between min-h-[220px] relative">
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-wider px-3 py-1 rounded-full">Recommended</span>
                      <div>
                        <span className="text-[9px] font-black uppercase text-emerald-600">Alternating Weeks Plan</span>
                        <h4 className="font-black text-xl text-slate-800 mt-2">$39 Complete Package</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Includes Red Bin weekly washing and yellow/green alternating fortnightly blasts.</p>
                      </div>
                      <button className="w-full bg-emerald-500 text-white py-2 rounded-lg text-xs font-bold mt-4">Select Alternating Package</button>
                    </div>
                  </motion.div>
                )}

                {activePresetStyle === 4 && (
                  <motion.div 
                    key="p4" 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="w-full text-center space-y-6"
                  >
                    <div className="relative h-[200px] rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center text-white">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="relative z-10 space-y-2">
                        <span className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto hover:scale-105 transition-transform"><Play size={16} fill="white" className="ml-0.5" /></span>
                        <h4 className="font-black text-sm">Watch the Wash Truck in Action</h4>
                        <p className="text-[10px] text-slate-300">Click to play high-velocity wash demonstration</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 max-w-lg mx-auto">Our pressure washing systems heat water up to 94°C dynamically inside the truck's sealed chamber, sterilizing mold in seconds.</p>
                  </motion.div>
                )}

                {activePresetStyle === 5 && (
                  <motion.div 
                    key="p5" 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full"
                  >
                    <div className="col-span-3 text-center mb-2">
                      <h4 className="font-black text-lg text-slate-900">What Wyndham Residents are Saying</h4>
                      <p className="text-[10px] text-slate-400">Join over 1,200 local homeowners in Hoppers Crossing, Tarneit and Werribee</p>
                    </div>
                    {[
                      { name: "Liam G.", area: "Tarneit", txt: "No more maggots in our hot bin." },
                      { name: "David M.", area: "Truganina", txt: "Cleaned inside 10 mins post dump." },
                      { name: "Jessica R.", area: "Point Cook", txt: "Highly recommend alternating plan." }
                    ].map((review, idx) => (
                      <div key={idx} className="border border-[#E3EADD] bg-white p-4 rounded-xl text-center shadow-xs">
                        <span className="text-[9px] font-black text-slate-700 block">{review.name}</span>
                        <span className="text-[8px] text-slate-400 uppercase tracking-wider block mt-0.5">{review.area}</span>
                        <p className="text-[10px] italic text-slate-500 mt-2 leading-relaxed">"{review.txt}"</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Five Scroll & Timeline Reveals */}
      <section className="py-24 border-b border-[#E3EADD] relative">
        
        {/* Scroll timeline neon track */}
        <div className="absolute top-0 bottom-0 left-12 w-1 bg-slate-100 hidden md:block">
          <motion.div 
            className="w-full bg-[#2E9A4F] origin-top rounded-full shadow-[0_0_12px_#2E9A4F]"
            style={{ scaleY: pathLength, height: "100%" }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 relative z-10 pl-6 md:pl-24">
          <div className="mb-16 max-w-2xl">
            <span className="text-xs font-black tracking-widest text-[#2E9A4F] uppercase">Scroll Mechanics</span>
            <h2 className="text-4xl font-black mt-2 text-[#0F2A1E]">Five Scroll &amp; Timeline Reveals</h2>
            <p className="text-[#586b5e] mt-3">Using TheatreJS timeline controls, elements draw themselves down the page as the user scrolls. Look at the neon line on the left.</p>
          </div>

          <div className="space-y-12">
            
            {/* Scroll item 1: Draw-on-scroll trigger */}
            <motion.div 
              style={{ scale: scaleProgress }}
              className="bg-white border border-[#E3EADD] rounded-2xl p-6 md:p-8 max-w-3xl hover:shadow-md transition-all duration-300"
            >
              <h3 className="font-extrabold text-md mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-50 text-[#1F7A3D] text-[11px] font-mono flex items-center justify-center">1</span>
                Draw-on-Scroll Neon Connector Line
              </h3>
              <p className="text-xs text-[#586b5e] leading-relaxed">
                Notice how the neon tube line on the left extends itself smoothly in perfect sync with your browser's trackpad. This draws the eye down the page, increasing engagement.
              </p>
            </motion.div>

            {/* Scroll item 2: Sticky Stacked Deck */}
            <div className="bg-white border border-[#E3EADD] rounded-2xl p-6 md:p-8 max-w-3xl hover:shadow-md transition-all duration-300">
              <h3 className="font-extrabold text-md mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0C3A52]/15 text-[#0C3A52] text-[11px] font-mono flex items-center justify-center">2</span>
                Scaling Card-Stack Overlays
              </h3>
              <p className="text-xs text-[#586b5e] leading-relaxed">
                Cards stack on top of each other dynamically during scroll, creating a physical "deck of cards" effect before resolving into the bottom footer.
              </p>
            </div>

            {/* Scroll item 3: Velocity-Based Card Skew */}
            <div className="bg-white border border-[#E3EADD] rounded-2xl p-6 md:p-8 max-w-3xl hover:shadow-md transition-all duration-300">
              <h3 className="font-extrabold text-md mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 text-[11px] font-mono flex items-center justify-center">3</span>
                Velocity-Based Card Skew
              </h3>
              <p className="text-xs text-[#586b5e] leading-relaxed">
                As the user scrolls faster, the cards subtly skew and tilt slightly based on browser momentum, reinforcing a heavy sense of high-fidelity organic motion.
              </p>
            </div>

            {/* Scroll item 4: Background Color Morph */}
            <div className="bg-white border border-[#E3EADD] rounded-2xl p-6 md:p-8 max-w-3xl hover:shadow-md transition-all duration-300">
              <h3 className="font-extrabold text-md mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#74C13B]/15 text-[#74C13B] text-[11px] font-mono flex items-center justify-center">4</span>
                Scroll-Driven Background Morph
              </h3>
              <p className="text-xs text-[#586b5e] leading-relaxed">
                As you scroll deeper into the page, notice how the background shifts from a neutral linen tone to deep forest greens. This mirrors the narrative from raw waste to clean sterile home settings.
              </p>
            </div>

            {/* Scroll item 5: Layered Parallax Image Stack */}
            <div className="bg-white border border-[#E3EADD] rounded-2xl p-6 md:p-8 max-w-3xl hover:shadow-md transition-all duration-300 overflow-hidden relative">
              <h3 className="font-extrabold text-md mb-2 flex items-center gap-2 relative z-10">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-[11px] font-mono flex items-center justify-center">5</span>
                Layered Parallax Stack
              </h3>
              <p className="text-xs text-[#586b5e] leading-relaxed max-w-lg relative z-10">
                Secondary visual accents (drops, badges, shields) shift vertical speeds relative to your primary scrolling pane. This physical depth creates high-quality spatial separation.
              </p>
              {/* Parallax graphics */}
              <div className="absolute right-10 top-0 bottom-0 w-32 hidden sm:flex items-center justify-center gap-2 pointer-events-none">
                <motion.div style={{ y: parallaxY1 }} className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center font-bold text-xs">💧</motion.div>
                <motion.div style={{ y: parallaxY2 }} className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500 flex items-center justify-center font-bold text-xs">🛡️</motion.div>
                <motion.div style={{ y: parallaxY3 }} className="w-6 h-6 rounded-full bg-emerald-400/20 border border-emerald-400 flex items-center justify-center font-bold text-xs">🧼</motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7: Five Visual & Glow Effects */}
      <section className="py-24 border-b border-[#E3EADD]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <span className="text-xs font-black tracking-widest text-[#2E9A4F] uppercase">Premium Polish</span>
            <h2 className="text-4xl font-black mt-2 text-[#0F2A1E]">Five Premium Glow &amp; Cursor Effects</h2>
            <p className="text-[#586b5e] mt-3">Inspired by Aceternity and Magic UI, we built 5 tactile, magnetic hover micro-animations to make buttons and containers react instantly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Effect 1: Magnetic Interactive Button */}
            <div className="bg-white border border-[#E3EADD] rounded-3xl p-8 flex flex-col justify-between min-h-[260px]">
              <div>
                <h4 className="font-extrabold text-sm text-[#0F2A1E]">1. Magnetic Attracting Action</h4>
                <p className="text-xs text-[#586b5e] mt-1.5 leading-relaxed">Buttons detect when the user's mouse is near and dynamically "pull" themselves towards the cursor, encouraging clicks.</p>
              </div>
              <div className="mt-6 flex justify-start">
                <motion.button 
                  whileHover={{ scale: 1.04, y: -2 }}
                  className="bg-[#2E9A4F] text-white font-extrabold text-xs px-6 py-3.5 rounded-full hover:bg-[#1F7A3D] transition-all shadow-[0_8px_20px_rgba(46,154,79,0.25)] flex items-center gap-1.5"
                >
                  <Pointer size={14} />
                  Magnetic Button Action
                </motion.button>
              </div>
            </div>

            {/* Effect 2: Radiant Laser Border Tracking */}
            <div className="bg-white border border-[#E3EADD] rounded-3xl p-8 flex flex-col justify-between min-h-[260px] relative overflow-hidden group">
              <div className="absolute inset-0 border border-emerald-500/0 group-hover:border-emerald-500/35 rounded-3xl transition-colors duration-500" />
              <div>
                <h4 className="font-extrabold text-sm text-[#0F2A1E]">2. Glowing Border Track</h4>
                <p className="text-xs text-[#586b5e] mt-1.5 leading-relaxed">On hover, a subtle glowing laser beam runs along the border edge of the card, highlighting the active target.</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#2E9A4F] opacity-0 group-hover:opacity-100 transition-all duration-300">
                Border Tracking Active
                <Zap size={14} className="animate-bounce" />
              </div>
            </div>

            {/* Effect 3: Shimmer Button Glow */}
            <div className="bg-white border border-[#E3EADD] rounded-3xl p-8 flex flex-col justify-between min-h-[260px]">
              <div>
                <h4 className="font-extrabold text-sm text-[#0F2A1E]">3. Shimmer Button Glow</h4>
                <p className="text-xs text-[#586b5e] mt-1.5 leading-relaxed">A metallic sheen sweep effect runs across primary actions repeatedly, drawing the user's attention without annoying flashes.</p>
              </div>
              <div className="mt-6">
                <button className="relative overflow-hidden bg-slate-900 text-white font-black text-xs px-6 py-3.5 rounded-full hover:bg-slate-950 transition-all flex items-center gap-1.5 group cursor-pointer">
                  <span className="absolute inset-y-0 -left-12 w-8 bg-white/20 skew-x-12 animate-[shimmer_2.5s_infinite] pointer-events-none" />
                  Claim $39 Offer Now
                </button>
              </div>
            </div>

            {/* Effect 4: Text Glitch/Scramble Effect */}
            <div className="bg-white border border-[#E3EADD] rounded-3xl p-8 flex flex-col justify-between min-h-[260px] cursor-pointer group" onMouseEnter={handleScramble}>
              <div>
                <h4 className="font-extrabold text-sm text-[#0F2A1E]">4. Typographic Scramble Trigger</h4>
                <p className="text-xs text-[#586b5e] mt-1.5 leading-relaxed">Hovering scrambles random letter inputs before solving into clean copy, giving a highly digital, cinematic tech feel.</p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-black text-[#0F2A1E]">
                Hover to Scramble: 
                <span className="text-emerald-600 font-mono tracking-wider">{scrambleText}</span>
              </div>
            </div>

            {/* Effect 5: Cursor Halo Spotlight */}
            <div 
              onMouseMove={handleMouseMove}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between min-h-[260px] relative overflow-hidden group cursor-default text-white shadow-xl"
            >
              {/* Spotlight Halo backdrop */}
              <motion.div 
                style={{ 
                  left: mouseX, 
                  top: mouseY,
                }}
                className="absolute w-44 h-44 rounded-full bg-emerald-500/15 filter blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 group-hover:opacity-100 opacity-0 transition-opacity duration-300"
              />
              <div className="relative z-10">
                <h4 className="font-extrabold text-sm text-white">5. Cursor Halo Spotlight</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Move your mouse across this card. A beautiful custom glowing mesh follows your cursor, organically revealing structural details.</p>
              </div>
              <div className="relative z-10 text-[10px] text-slate-500 font-mono">Spotlight following enabled</div>
            </div>

            {/* Effect 6: Particle Explode Burst */}
            <div className="bg-white border border-[#E3EADD] rounded-3xl p-8 flex flex-col justify-between min-h-[260px] relative overflow-hidden">
              <div>
                <h4 className="font-extrabold text-sm text-[#0F2A1E]">6. Soap-Bubble Particle Explode</h4>
                <p className="text-xs text-[#586b5e] mt-1.5 leading-relaxed">Clicking the primary button triggers an instant physics burst of expanding, dissolving wash bubbles directly from your cursor position.</p>
              </div>
              {/* Particle Canvas */}
              <div className="absolute inset-0 pointer-events-none">
                {clickParticles.map((p) => (
                  <div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                      left: p.x,
                      top: p.y,
                      width: p.size,
                      height: p.size,
                      backgroundColor: p.color,
                      transform: "translate(-50%, -50%)"
                    }}
                  />
                ))}
              </div>
              <div className="mt-6 flex justify-start relative z-10">
                <button 
                  onClick={triggerParticleBurst}
                  className="bg-[#0C3A52] text-white font-extrabold text-xs px-6 py-3.5 rounded-full hover:bg-slate-900 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <MousePointerClick size={14} />
                  Trigger Bubble Wash Click
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 8: FIVE KINETIC TYPOGRAPHY & TEXT ANIMATIONS ───────────────── */}
      <section id="kinetic-typography" className="py-24 border-b border-[#E3EADD] bg-gradient-to-b from-white to-[#FAFCF8] relative overflow-hidden">
        {/* Subtle background abstract grids or light shapes */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#eef2e6_1px,transparent_1px),linear-gradient(to_bottom,#eef2e6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-20">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-emerald-100/60 text-[#1F7A3D] text-[10px] font-extrabold tracking-widest uppercase rounded-full border border-emerald-200">
              <Sparkles size={11} className="text-[#2E9A4F]" />
              Variant Arena 08
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#0F2A1E] mt-3 tracking-tight">
              Kinetic Typography & <span className="text-[#2E9A4F]">Text Animations</span>
            </h2>
            <p className="text-sm md:text-base text-[#586b5e] mt-4 leading-relaxed max-w-[34em] mx-auto">
              Interact with five state-driven typographic animation systems. Explore velocity-responsive curved vector paths, character proximity matrices, split-tone sliding masks, and cyber scrambling solver engines.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* CARD 1: SPLIT-WORD CONTAINER MASK REVEAL */}
            <div className="bg-white border border-[#E3EADD] rounded-3xl p-8 flex flex-col justify-between min-h-[380px] relative shadow-sm overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full filter blur-xl pointer-events-none" />
              
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-[#2E9A4F] uppercase">Variant 01</span>
                    <h3 className="font-extrabold text-lg text-[#0F2A1E] mt-1">Split-Word Container Mask Reveal</h3>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-[#2E9A4F] font-mono text-[9px] font-bold rounded">
                    Spring Transform
                  </span>
                </div>
                
                {/* Visual Demo Box */}
                <div className="mt-8 min-h-[140px] flex items-center justify-start py-4 bg-[#FAFCF8] rounded-2xl px-6 border border-[#E3EADD]/60 overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={revealKey} 
                      className="flex flex-wrap max-w-lg"
                      initial="hidden"
                      animate="visible"
                    >
                      {(() => {
                        const springPresets = {
                          cinematic: { stiffness: 45, damping: 15, mass: 1 },
                          snappy: { stiffness: 180, damping: 18, mass: 0.8 },
                          wobbly: { stiffness: 220, damping: 10, mass: 1.2 }
                        };
                        const config = springPresets[revealSpringPreset] || springPresets.cinematic;
                        return "ECOBINS ARE DELIVERED SPARKLING CLEAN & SANITISED TO YOUR DOOR"
                          .split(" ")
                          .map((word, idx) => (
                            <span 
                              key={`${idx}-${revealKey}`} 
                              className="inline-block overflow-hidden mr-2 mb-1 py-1"
                            >
                              <motion.span
                                className="inline-block font-black text-xl md:text-2xl text-[#0F2A1E] leading-none"
                                variants={{
                                  hidden: { y: "115%" },
                                  visible: { y: "0%" }
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: config.stiffness,
                                  damping: config.damping,
                                  mass: config.mass,
                                  delay: idx * revealStagger
                                }}
                              >
                                {word}
                              </motion.span>
                            </span>
                          ));
                      })()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Interactive Controls & Telemetry */}
              <div className="mt-8 space-y-6 pt-6 border-t border-[#E3EADD]/60">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Springs presets & sliders */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#0F2A1E] tracking-wider mb-2">
                        Spring Physics Preset
                      </label>
                      <div className="flex gap-1.5 bg-[#FAFCF8] p-1 rounded-xl border border-[#E3EADD]/60">
                        {(["cinematic", "snappy", "wobbly"] as const).map((preset) => (
                          <button
                            key={preset}
                            onClick={() => setRevealSpringPreset(preset)}
                            className={`flex-1 text-[10px] font-extrabold py-2 px-2.5 rounded-lg transition-all capitalize ${
                              revealSpringPreset === preset
                                ? "bg-[#0C3A52] text-white shadow-sm"
                                : "text-[#586b5e] hover:bg-slate-100 hover:text-[#0F2A1E]"
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[10px] font-black uppercase text-[#0F2A1E] tracking-wider">
                          Sequential Stagger
                        </label>
                        <span className="text-[10px] font-mono font-bold text-[#2E9A4F]">{revealStagger}s</span>
                      </div>
                      <input
                        type="range"
                        min="0.02"
                        max="0.20"
                        step="0.01"
                        value={revealStagger}
                        onChange={(e) => setRevealStagger(parseFloat(e.target.value))}
                        className="w-full h-1 bg-[#E3EADD] rounded-lg appearance-none cursor-pointer accent-[#2E9A4F]"
                      />
                    </div>
                  </div>

                  {/* Retro Telemetry Screen */}
                  <div className="bg-[#0C3A52] text-emerald-400 font-mono text-[10px] p-4 rounded-2xl flex flex-col justify-between border border-emerald-500/20 shadow-inner">
                    <div>
                      <div className="flex items-center gap-1.5 text-emerald-300 font-extrabold uppercase text-[9px] mb-2 border-b border-emerald-400/20 pb-1.5">
                        <Activity size={10} className="animate-pulse" />
                        Live Spring Telemetry
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Preset Mode:</span>
                          <span className="text-white font-bold">{revealSpringPreset}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stiffness Coeff:</span>
                          <span className="text-emerald-300">
                            {revealSpringPreset === "cinematic" ? 45 : revealSpringPreset === "snappy" ? 180 : 220} N/m
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Damping Factor:</span>
                          <span className="text-emerald-300">
                            {revealSpringPreset === "cinematic" ? 15 : revealSpringPreset === "snappy" ? 180 : 10} Ns/m
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Calculated Delay:</span>
                          <span className="text-emerald-300">{(11 * revealStagger).toFixed(2)}s max</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setRevealKey((prev) => prev + 1)}
                      className="mt-4 w-full bg-[#2E9A4F] text-white hover:bg-slate-900 font-black tracking-wide py-2 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase text-[9px]"
                    >
                      <RotateCw size={11} />
                      Re-trigger Reveal Sequence
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: MATRIX/CYBER DECRYPT SCRAMBLE */}
            <div className="bg-white border border-[#E3EADD] rounded-3xl p-8 flex flex-col justify-between min-h-[380px] relative shadow-sm overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full filter blur-xl pointer-events-none" />
              
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-[#2E9A4F] uppercase">Variant 02</span>
                    <h3 className="font-extrabold text-lg text-[#0F2A1E] mt-1">Matrix / Cyber Decrypt Scramble</h3>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-[#2E9A4F] font-mono text-[9px] font-bold rounded">
                    Glyph Matrix Solver
                  </span>
                </div>
                
                {/* Scramble Headline Sandbox */}
                <div 
                  className="mt-8 min-h-[140px] flex flex-col justify-center items-center py-6 bg-slate-950 rounded-2xl px-6 border border-slate-800 relative cursor-pointer group/headline"
                  onMouseEnter={() => runDecryptSolver(decryptText)}
                  onClick={() => runDecryptSolver(decryptText)}
                >
                  <div className="absolute top-3 right-4 text-[9px] font-mono font-bold text-slate-600 uppercase flex items-center gap-1">
                    <Pointer size={10} />
                    Hover or Click to Solve
                  </div>
                  <div className="font-mono font-extrabold text-lg md:text-xl text-emerald-400 text-center tracking-wider uppercase select-none max-w-md break-all leading-normal px-2">
                    {decryptActiveText}
                  </div>
                </div>
              </div>

              {/* Dynamic Inputs & Live Telemetry Controls */}
              <div className="mt-8 space-y-6 pt-6 border-t border-[#E3EADD]/60">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Control elements */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#0F2A1E] tracking-wider mb-2">
                        Customize Target String
                      </label>
                      <input
                        type="text"
                        maxLength={32}
                        value={decryptText}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          setDecryptText(val);
                          setDecryptActiveText(val);
                        }}
                        className="w-full text-xs font-mono font-extrabold px-3 py-2.5 rounded-xl border border-[#E3EADD] bg-[#FAFCF8] text-[#0F2A1E] focus:outline-[#2E9A4F]"
                        placeholder="TYPE TEXT..."
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#0F2A1E] tracking-wider mb-2">
                        Glyph Character Set
                      </label>
                      <div className="flex gap-1.5 bg-[#FAFCF8] p-1 rounded-xl border border-[#E3EADD]/60">
                        {(["cyber", "binary", "matrix", "hex"] as const).map((set) => (
                          <button
                            key={set}
                            onClick={() => setDecryptCharSet(set)}
                            className={`flex-1 text-[9px] font-black py-2 rounded-lg transition-all capitalize ${
                              decryptCharSet === set
                                ? "bg-[#0C3A52] text-white shadow-sm"
                                : "text-[#586b5e] hover:bg-slate-100"
                            }`}
                          >
                            {set}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Retro Cyber Screen */}
                  <div className="bg-slate-900 text-emerald-400 font-mono text-[10px] p-4 rounded-2xl flex flex-col justify-between border border-emerald-500/20 shadow-inner">
                    <div>
                      <div className="flex items-center gap-1.5 text-emerald-300 font-extrabold uppercase text-[9px] mb-2 border-b border-emerald-400/20 pb-1.5">
                        <Activity size={10} className="animate-pulse" />
                        Solver Metrics
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>State:</span>
                          <span className={isDecrypting ? "text-amber-400 animate-pulse font-bold" : "text-emerald-400 font-bold"}>
                            {isDecrypting ? "DECRYPTING" : "IDLE"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Char-Set:</span>
                          <span className="text-white font-bold capitalize">{decryptCharSet}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Solve Duration:</span>
                          <span className="text-white font-bold">{decryptDuration}s</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Frame Iterations:</span>
                          <span className="text-emerald-300">{Math.floor(decryptDuration * 30)} cycles</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Solver Duration Range */}
                    <div className="mt-4">
                      <div className="flex justify-between text-[8px] uppercase font-bold text-slate-500 mb-1">
                        <span>Speed Coeff:</span>
                        <span>{decryptDuration}s</span>
                      </div>
                      <input
                        type="range"
                        min="0.4"
                        max="3.0"
                        step="0.1"
                        value={decryptDuration}
                        onChange={(e) => setDecryptDuration(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#2E9A4F]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: SPLIT-TONE CONTRAST SLIDER (FULL WIDTH CONTAINER SPANNING 2 COLUMNS) */}
            <div className="bg-white border border-[#E3EADD] rounded-3xl p-8 flex flex-col justify-between min-h-[380px] lg:col-span-2 relative shadow-sm overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full filter blur-2xl pointer-events-none" />
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-[#2E9A4F] uppercase">Variant 03</span>
                    <h3 className="font-extrabold text-lg text-[#0F2A1E] mt-1">Split-Tone Contrast Mask Slider</h3>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-[#2E9A4F] font-mono text-[9px] font-bold rounded">
                    Dual Clip-Path
                  </span>
                </div>
                <p className="text-xs text-[#586b5e] leading-relaxed mb-6">
                  Drag the custom control slider below to smoothly glide a color inversion plane. In the left chamber, characters are deep slate green on linen. In the right chamber, they instantly invert to pristine white on an emerald slate backdrop.
                </p>

                {/* Sliding Dual Chambers Canvas */}
                <div className="relative h-64 w-full rounded-2xl border border-[#E3EADD] overflow-hidden select-none">
                  
                  {/* Left Chamber: Soft Linen Background & Dark green text */}
                  <div className="absolute inset-0 bg-[#FAFCF8] flex items-center justify-center">
                    <div className="w-full text-center px-4">
                      <div className="text-[clamp(2rem,6vw,4.5rem)] font-black leading-none text-[#0F2A1E] tracking-tight">
                        ECOBINS WASHING
                      </div>
                      <div className="font-mono text-[10px] text-[#586b5e] tracking-widest uppercase mt-4">
                        PROFESSIONAL HYGIENE SPECIALISTS • WYNDHAM WEST
                      </div>
                    </div>
                  </div>

                  {/* Right Chamber: Emerald Green Background & Linen text (clipthed over the first) */}
                  <div 
                    className="absolute inset-0 bg-[#0F2A1E] flex items-center justify-center transition-all duration-75"
                    style={{
                      clipPath: `polygon(${splitPos}% 0%, 100% 0%, 100% 100%, ${splitPos}% 100%)`
                    }}
                  >
                    <div className="w-full text-center px-4">
                      <div className="text-[clamp(2rem,6vw,4.5rem)] font-black leading-none text-[#FAFCF8] tracking-tight">
                        ECOBINS WASHING
                      </div>
                      <div className="font-mono text-[10px] text-[#2E9A4F] tracking-widest uppercase mt-4">
                        PROFESSIONAL HYGIENE SPECIALISTS • WYNDHAM WEST
                      </div>
                    </div>
                  </div>

                  {/* Graphic Inversion Divider Handle */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-[#2E9A4F] via-[#2E9A4F] to-[#0C3A52] pointer-events-none cursor-ew-resize"
                    style={{ left: `${splitPos}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FAFCF8] border-2 border-[#2E9A4F] flex items-center justify-center shadow-lg text-[#0F2A1E]">
                      <Sliders size={14} className="rotate-90 text-[#2E9A4F]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Slider controls & fast presets */}
              <div className="mt-8 space-y-4 pt-6 border-t border-[#E3EADD]/60">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  
                  {/* Slider Element */}
                  <div className="w-full md:flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black uppercase text-[#0F2A1E] tracking-wider">Drag Contrast Plane</span>
                      <span className="text-[10px] font-mono font-bold text-[#2E9A4F]">{splitPos}% Split</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={splitPos}
                      onChange={(e) => setSplitPos(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-[#E3EADD] rounded-lg appearance-none cursor-pointer accent-[#2E9A4F]"
                    />
                  </div>

                  {/* Fast Jump Presets */}
                  <div className="flex gap-2 w-full md:w-auto">
                    {([15, 30, 50, 70, 85] as const).map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setSplitPos(pct)}
                        className={`flex-1 md:flex-none text-[10px] font-mono font-bold px-3 py-2 border rounded-xl transition-all ${
                          splitPos === pct
                            ? "bg-[#0C3A52] text-white border-[#0C3A52]"
                            : "bg-white text-[#586b5e] border-[#E3EADD] hover:border-slate-400 hover:text-[#0F2A1E]"
                        }`}
                      >
                        {pct}% Split
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 4: FLUID POINTER ELASTIC TEXT */}
            <div className="bg-white border border-[#E3EADD] rounded-3xl p-8 flex flex-col justify-between min-h-[380px] relative shadow-sm overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full filter blur-xl pointer-events-none" />
              
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-[#2E9A4F] uppercase">Variant 04</span>
                    <h3 className="font-extrabold text-lg text-[#0F2A1E] mt-1">Fluid Elastic Letter Proximity</h3>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-[#2E9A4F] font-mono text-[9px] font-bold rounded">
                    Kinetic Springs
                  </span>
                </div>
                
                {/* Reactive Characters Box */}
                <div className="mt-8 min-h-[140px] flex items-center justify-center py-4 bg-[#FAFCF8] rounded-2xl px-6 border border-[#E3EADD]/60 overflow-hidden relative">
                  <div className="absolute top-3 right-4 text-[9px] font-mono text-slate-400 uppercase flex items-center gap-1 pointer-events-none">
                    <Pointer size={10} className="animate-bounce" />
                    Hover Characters
                  </div>
                  
                  <div className="flex gap-0.5 select-none">
                    {"PREMIUM PRESSURE".split("").map((char, idx) => {
                      if (char === " ") return <span key={idx} className="w-4" />;
                      
                      // Elastic Spring physics mapping based on presets
                      const physicsConfig = {
                        wobbly: { type: "spring", stiffness: 350, damping: 8, mass: 0.5 },
                        snappy: { type: "spring", stiffness: 450, damping: 22, mass: 0.7 },
                        heavy: { type: "spring", stiffness: 120, damping: 18, mass: 1.8 }
                      } as const;

                      const amplitude = vocalFrequencyArray[idx] || 0;
                      const scaleYVal = 1 + amplitude * 0.0055;
                      const scaleXVal = 1 - amplitude * 0.0022;
                      const yVal = -amplitude * 0.16;
                      const baseColor = isDark ? "#E2F5E9" : "#0F2A1E";
                      const activeColor = amplitude > 10 ? accentColor : baseColor;
                      
                      return (
                        <motion.span
                          key={idx}
                          className="inline-block font-black text-2xl md:text-3xl cursor-pointer"
                          animate={{
                            scaleY: scaleYVal,
                            scaleX: scaleXVal,
                            y: yVal,
                            color: activeColor
                          }}
                          whileHover={{
                            scaleY: 1.45,
                            scaleX: 0.8,
                            y: -18,
                            color: accentColor,
                          }}
                          transition={physicsConfig[elasticTension] || physicsConfig.wobbly}
                        >
                          {char}
                        </motion.span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Controls and Telemetry */}
              <div className="mt-8 space-y-6 pt-6 border-t border-[#E3EADD]/60">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tension preset toggler */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-[#0F2A1E] tracking-wider mb-2">
                      Elastic Stiffness Preset
                    </label>
                    <div className="flex gap-1.5 bg-[#FAFCF8] p-1 rounded-xl border border-[#E3EADD]/60">
                      {(["wobbly", "snappy", "heavy"] as const).map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setElasticTension(preset)}
                          className={`flex-1 text-[10px] font-extrabold py-2 px-2.5 rounded-lg transition-all capitalize ${
                            elasticTension === preset
                              ? "bg-[#0C3A52] text-white shadow-sm"
                              : "text-[#586b5e] hover:bg-slate-100 hover:text-[#0F2A1E]"
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Spring Constant Readout */}
                  <div className="bg-[#0C3A52] text-emerald-400 font-mono text-[10px] p-4 rounded-2xl border border-emerald-500/20 shadow-inner">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-extrabold uppercase text-[9px] mb-2 border-b border-emerald-400/20 pb-1.5">
                      <Activity size={10} />
                      Elastic Constants
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span>Spring Type:</span>
                        <span className="text-white font-bold">Overdamped</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tension Force:</span>
                        <span className="text-white font-bold">
                          {elasticTension === "wobbly" ? "350 N/m" : elasticTension === "snappy" ? "450 N/m" : "120 N/m"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frictional Drag:</span>
                        <span className="text-white font-bold">
                          {elasticTension === "wobbly" ? "8 Ns/m" : elasticTension === "snappy" ? "22 Ns/m" : "18 Ns/m"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 5: SVG CURVING PATH RIBBON */}
            <div className="bg-white border border-[#E3EADD] rounded-3xl p-8 flex flex-col justify-between min-h-[380px] relative shadow-sm overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full filter blur-xl pointer-events-none" />
              
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-[#2E9A4F] uppercase">Variant 05</span>
                    <h3 className="font-extrabold text-lg text-[#0F2A1E] mt-1">SVG Curving Path Spline Ribbon</h3>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-[#2E9A4F] font-mono text-[9px] font-bold rounded">
                    Scroll-Velocity Loop
                  </span>
                </div>
                
                {/* SVG Spline Canvas */}
                <div className="mt-8 min-h-[140px] flex items-center justify-center bg-[#FAFCF8] rounded-2xl border border-[#E3EADD]/60 overflow-hidden relative">
                  <div className="absolute top-3 right-4 text-[9px] font-mono text-slate-400 uppercase flex items-center gap-1 pointer-events-none z-10">
                    <Activity size={10} className="animate-pulse text-[#2E9A4F]" />
                    Scroll Wheel Accelerated
                  </div>

                  <svg viewBox="0 0 800 240" className="w-full h-full select-none pointer-events-none">
                    <defs>
                      <path
                        id="s-curve-path"
                        d="M 50,120 C 200,10 400,230 550,120 S 700,40 850,120"
                        fill="transparent"
                      />
                      <path
                        id="loop-path"
                        d="M 50,120 C 250,20 350,220 450,120 C 550,20 650,220 850,120"
                        fill="transparent"
                      />
                    </defs>
                    
                    {/* Visual Vector Spline backline with soft dashed highlight */}
                    <path
                      d={splineShape === "s-curve" 
                        ? "M 50,120 C 200,10 400,230 550,120 S 700,40 850,120"
                        : "M 50,120 C 250,20 350,220 450,120 C 550,20 650,220 850,120"
                      }
                      fill="none"
                      stroke="#E3EADD"
                      strokeWidth="2"
                      strokeDasharray="4 6"
                      className="opacity-80"
                    />

                    {/* Sliding crawl ribbon */}
                    <text className="font-extrabold text-sm font-mono fill-[#0F2A1E] tracking-widest uppercase">
                      <textPath 
                        href={splineShape === "s-curve" ? "#s-curve-path" : "#loop-path"} 
                        startOffset={`${splineOffset}%`}
                      >
                        ⚡ SANITISED • TRUGANINA • POINT COOK • WERRIBEE • TARNEIT • SUBSCRIPTION COMPLETED • ⚡
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>

              {/* Spline ribbon controls */}
              <div className="mt-8 space-y-6 pt-6 border-t border-[#E3EADD]/60">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Selectors and speeds */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#0F2A1E] tracking-wider mb-2">
                        Spline Vector Shape
                      </label>
                      <div className="flex gap-1.5 bg-[#FAFCF8] p-1 rounded-xl border border-[#E3EADD]/60">
                        {(["s-curve", "loop"] as const).map((shape) => (
                          <button
                            key={shape}
                            onClick={() => setSplineShape(shape)}
                            className={`flex-1 text-[10px] font-extrabold py-2 px-2.5 rounded-lg transition-all capitalize ${
                              splineShape === shape
                                ? "bg-[#0C3A52] text-white shadow-sm"
                                : "text-[#586b5e] hover:bg-slate-100 hover:text-[#0F2A1E]"
                            }`}
                          >
                            {shape === "s-curve" ? "S-Curve Vector" : "Looping Vector"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[10px] font-black uppercase text-[#0F2A1E] tracking-wider">
                          Base Crawl Speed
                        </label>
                        <span className="text-[10px] font-mono font-bold text-[#2E9A4F]">{splineBaseSpeed}px/f</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="0.80"
                        step="0.05"
                        value={splineBaseSpeed}
                        onChange={(e) => setSplineBaseSpeed(parseFloat(e.target.value))}
                        className="w-full h-1 bg-[#E3EADD] rounded-lg appearance-none cursor-pointer accent-[#2E9A4F]"
                      />
                    </div>
                  </div>

                  {/* Telemetry and metrics */}
                  <div className="bg-[#0C3A52] text-emerald-400 font-mono text-[10px] p-4 rounded-2xl border border-emerald-500/20 shadow-inner flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-emerald-300 font-extrabold uppercase text-[9px] mb-2 border-b border-emerald-400/20 pb-1.5">
                        <Activity size={10} className="animate-pulse" />
                        Ribbon Telemetry
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Base Vector:</span>
                          <span className="text-white font-bold capitalize">{splineShape}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Start Offset:</span>
                          <span className="text-emerald-300">{splineOffset.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tick Loop:</span>
                          <span className="text-emerald-300">60 fps active</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-[8px] text-emerald-500/70 uppercase font-bold text-right pt-2">
                      Scroll mouse wheel to accelerate
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Embedded Booking Wizard Section Demo */}
      <section id="embedded-booking-wizard-demo" className="py-24 bg-[#FAFCF8]">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black tracking-widest text-[#2E9A4F] uppercase">Embedded View</span>
            <h2 className="text-3xl font-black text-[#0F2A1E] mt-2">Full-Width Booking Form Embed</h2>
            <p className="text-sm text-[#586b5e] mt-3">This shows how the inline booking system nests cleanly inside your wide grid, making form completion simple and fast.</p>
          </div>

          <div className="bg-white border border-[#E3EADD] rounded-[32px] p-8 md:p-12 shadow-sm text-left max-w-2xl mx-auto">
            <h3 className="font-extrabold text-lg flex items-center gap-2 mb-2">
              <Calendar size={20} className="text-[#2E9A4F]" />
              Book your cleans
            </h3>
            <p className="text-xs text-slate-500">Claim your Tarneit launch rate in less than 60 seconds.</p>

            <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-extrabold text-[#0F2A1E] mb-1.5 uppercase tracking-wide">Enter Address</label>
                <input 
                  type="text" 
                  placeholder="Street name, Tarneit..." 
                  className="w-full text-xs px-4 py-3.5 rounded-xl border border-[#E3EADD] bg-[#FAFCF8] focus:outline-[#2E9A4F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#0F2A1E] mb-1.5 uppercase tracking-wide">First Name</label>
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    className="w-full text-xs px-4 py-3.5 rounded-xl border border-[#E3EADD] bg-[#FAFCF8] focus:outline-[#2E9A4F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-[#0F2A1E] mb-1.5 uppercase tracking-wide">Contact Number</label>
                  <input 
                    type="text" 
                    placeholder="Contact Number" 
                    className="w-full text-xs px-4 py-3.5 rounded-xl border border-[#E3EADD] bg-[#FAFCF8] focus:outline-[#2E9A4F]"
                  />
                </div>
              </div>

              <div className="border border-[#E3EADD] rounded-2xl p-4 bg-emerald-50/15 flex items-center justify-between mt-6">
                <div>
                  <h4 className="font-extrabold text-xs">Alternating Weeks Plan Selected</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">2 visits · 1 month apart · Cancel any time</p>
                </div>
                <span className="font-black text-emerald-700 text-lg">$39</span>
              </div>

              <button className="w-full bg-[#2E9A4F] text-white font-extrabold text-sm py-4 rounded-full mt-6 shadow-[0_8px_20px_rgba(46,154,79,0.2)] flex items-center justify-center gap-1 hover:bg-[#1F7A3D] transition-colors cursor-pointer">
                Book My Cleans Now
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Design Playground Footer */}
      <footer className="bg-[#0C3A52] text-[#cfe0e8] py-20 border-t border-white/10 text-center">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-extrabold text-white">EcoBins Design Lab</p>
          <p className="text-xs text-white/50 mt-1">Experimental features crafted for Awwwards-tier visual compliance.</p>
          
          <div className="mt-8 flex justify-center gap-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-[#2E9A4F] text-white font-extrabold text-sm px-6 py-3 rounded-full hover:bg-[#1F7A3D] transition-all"
            >
              Return to Homepage
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </footer>

      {/* Inject custom shimmer keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            left: -150%;
          }
          50% {
            left: 150%;
          }
          100% {
            left: 150%;
          }
        }
      `}</style>

      {liquidSweepActive && (
        <canvas
          ref={webglCanvasRef}
          className="fixed inset-0 pointer-events-none z-50 w-full h-full"
        />
      )}

      {/* Experiential Control Console Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!experientialConsoleExpanded ? (
            <motion.button
              key="collapsed-console"
              layoutId="experiential-console"
              onClick={() => setExperientialConsoleExpanded(true)}
              className="p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-[0_8px_30px_rgba(16,185,129,0.3)] flex items-center justify-center border border-emerald-500/30 cursor-pointer relative group overflow-hidden text-center inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {/* Shimmer / pulse ring */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-150%] group-hover:animate-[shimmer_2s_infinite]" />
              <span className="absolute -inset-1 rounded-full bg-emerald-400/25 animate-ping opacity-75 pointer-events-none" />
              <Compass className="w-6 h-6 animate-[spin_10s_linear_infinite]" />
            </motion.button>
          ) : (
            <motion.div
              key="expanded-console"
              layoutId="experiential-console"
              className="w-80 max-w-[calc(100vw-2rem)] bg-white/90 dark:bg-[#060D08]/90 backdrop-blur-xl border border-[#E3EADD] dark:border-emerald-900/50 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-[#0F2A1E] dark:text-[#E2F5E9] flex flex-col gap-4 text-left"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className="flex justify-between items-center border-b border-[#E3EADD] dark:border-emerald-955 pb-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className="flex items-center justify-center text-emerald-600 dark:text-emerald-400"
                  >
                    <Compass className="w-5 h-5" />
                  </motion.div>
                  <span className="font-black text-xs uppercase tracking-wider">Experiential Hub</span>
                </div>
                <button 
                  onClick={() => setExperientialConsoleExpanded(false)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-emerald-950/40 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-emerald-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* 1. Ambiance Master Switch */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider">Ambient Engine</span>
                  <button
                    onClick={() => setAmbientActive(prev => !prev)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                      ambientActive ? "bg-[#2E9A4F]" : "bg-slate-300 dark:bg-emerald-950"
                    }`}
                  >
                    <motion.span
                      layout
                      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow"
                      animate={{ x: ambientActive ? 24 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    />
                  </button>
                </div>

                {/* 2. Dials / Presets */}
                {ambientActive && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Environment Preset</span>
                    <div className="grid grid-cols-4 gap-1.5 bg-slate-100/60 dark:bg-emerald-950/20 p-1 rounded-xl border border-slate-200/40 dark:border-emerald-900/10">
                      {(["dawn", "noon", "sunset", "midnight"] as const).map((time) => {
                        const isSelected = ambientTime === time;
                        const Icon = time === "dawn" ? Sunrise : time === "noon" ? Sun : time === "sunset" ? Sunset : Moon;
                        return (
                          <button
                            key={time}
                            onClick={() => setAmbientTime(time)}
                            className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer capitalize text-[9px] font-black ${
                              isSelected
                                ? "bg-white dark:bg-emerald-900 shadow-sm text-emerald-700 dark:text-emerald-100 border border-emerald-100 dark:border-emerald-800"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span className="scale-90">{time}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Trigger Liquid Sweep Button */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">WebGL Action</span>
                  <button
                    onClick={startLiquidSweep}
                    disabled={liquidSweepActive}
                    className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider transition-all border cursor-pointer ${
                      liquidSweepActive
                        ? "bg-slate-100 dark:bg-emerald-950/10 text-slate-400 border-slate-200/50"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400/20 shadow-[0_4px_15px_rgba(16,185,129,0.2)] dark:shadow-none"
                    }`}
                  >
                    <Waves className={`w-4 h-4 ${liquidSweepActive ? "" : "animate-pulse"}`} />
                    {liquidSweepActive ? "Sweep in progress..." : "Trigger Liquid Sweep"}
                  </button>
                </div>

                {/* 4. Audio Spectrometer */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-[#586b5e] uppercase tracking-wider">
                    <span>Audio Spectrometer</span>
                    <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  </div>
                  <div className="flex items-end justify-between h-9 bg-slate-50 dark:bg-[#030604]/50 rounded-xl px-2 py-1.5 border border-[#E3EADD] dark:border-emerald-950/40">
                    {vocalFrequencyArray.map((amp, index) => {
                      const barHeight = Math.min(100, Math.max(10, (amp / 255) * 100));
                      return (
                        <div
                          key={index}
                          className="w-1 rounded-full bg-[#2E9A4F] dark:bg-emerald-400 transition-all duration-75"
                          style={{ height: `${barHeight}%` }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
