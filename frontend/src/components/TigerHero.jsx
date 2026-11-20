import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  Compass, 
  Tv, 
  Sparkles,
  Camera,
  Layers,
  Activity,
  Radio,
  Eye,
  Shield,
  Zap,
  Flame,
  ArrowUpRight,
  Maximize2,
  MoreHorizontal
} from 'lucide-react';
import { playTigerRoar } from '../utils/audioSynthesizer';

export default function TigerHero() {
  const containerRef = useRef(null);

  // Tiger pose state: 'calm' (standing alert) vs 'roaring' (action step forward & roaring)
  const [tigerPose, setTigerPose] = useState('calm'); // 'calm' | 'roaring'
  const [roarCount, setRoarCount] = useState(0);

  // Mouse & 3D Parallax Tracking
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, normX: 0, normY: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const animFrameRef = useRef(null);

  // Mouse move handler for 3D tilt & spotlight
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized coordinates (-0.5 to 0.5)
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    setMousePos({
      x,
      y,
      normX,
      normY
    });
  }, []);

  // Smooth lerp animation loop for realistic 3D spring tilt
  useEffect(() => {
    let currentTiltX = 0;
    let currentTiltY = 0;

    const loop = () => {
      // Lerp towards target tilt
      const targetTiltX = mousePos.normY * -16; // vertical mouse tilts X axis
      const targetTiltY = mousePos.normX * 18;  // horizontal mouse tilts Y axis

      currentTiltX += (targetTiltX - currentTiltX) * 0.08;
      currentTiltY += (targetTiltY - currentTiltY) * 0.08;

      setTilt({
        x: currentTiltX,
        y: currentTiltY
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [mousePos.normX, mousePos.normY]);

  // Trigger visceral tiger roar + swoop forward action animation
  const triggerTigerAction = () => {
    playTigerRoar();
    setTigerPose('roaring');
    setRoarCount((prev) => prev + 1);

    // Return to alert standing pose after roar action
    setTimeout(() => {
      setTigerPose('calm');
    }, 2400);
  };

  return (
    <section 
      id="hero" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[92vh] lg:min-h-screen overflow-hidden pt-24 sm:pt-28 pb-12 flex flex-col justify-between select-none bg-[#F4F2EB] text-[#1E241F]"
    >
      {/* Giant Faint Luxury Watermark "TIGER" (Exact replica of the Scrolltide "PARROT" watermark in frame 4) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span 
          className="font-serif font-black tracking-[0.25em] text-[#123D2B]/[0.045] uppercase select-none leading-none translate-y-[-20px]"
          style={{
            fontSize: 'clamp(7rem, 20vw, 22rem)',
            transform: `translate3d(${tilt.y * -0.5}px, ${tilt.x * -0.5}px, 0)`
          }}
        >
          TIGER
        </span>
      </div>

      {/* Dynamic Cursor Spotlight Torch Effect */}
      <div 
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x || 700}px ${mousePos.y || 400}px, rgba(200, 169, 107, 0.18), transparent 75%)`,
          opacity: 1
        }}
      />

      {/* Subtle Noise / Ambient Light */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-b from-white/40 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main 3-Column Scrolltide Hero Layout: Left Copy • Center Free-Floating 3D Tiger • Right HUD Cards */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-8 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
        
        {/* LEFT COLUMN: Editorial Typography & Actions */}
        <div className="lg:col-span-4 flex flex-col justify-center text-left">
          
          {/* Eyebrow Kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase mb-4 text-[#738276]">
            <span className="w-5 h-[1.5px] bg-[#738276]" />
            <span>ADAPTIVE THREAT INTELLIGENCE</span>
          </div>

          {/* Main Headline - Exact Scrolltide Serif Structure */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif leading-[1.06] tracking-tight mb-6">
            <span className="block font-medium text-[#1A201B]">
              Defence shaped
            </span>
            <span className="block font-editorial italic font-normal text-[#123D2B] hover:text-[#C8A96B] transition-colors">
              by instinct
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base leading-relaxed max-w-md mb-8 text-[#526359] font-light">
            We read the whole surface of our 437-hectare forest sanctuary and safeguard the Royal Bengal Tiger with zero-latency telemetry, before threats arise.
          </p>

          {/* Action Buttons - Golden Pill + Minimal Arrow Link */}
          <div className="flex items-center gap-5 mb-8">
            <button
              onClick={triggerTigerAction}
              className="px-7 py-3.5 rounded-full bg-[#E5A836] hover:bg-[#d69b2d] text-[#0A160F] font-bold text-xs uppercase tracking-[0.16em] shadow-lg shadow-[#E5A836]/25 hover:shadow-[#E5A836]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>START FREE</span>
              <Sparkles className="w-3.5 h-3.5 text-[#0A160F] group-hover:rotate-45 transition-transform" />
            </button>

            <a
              href="#live-wildlife"
              className="text-[#202820] hover:text-[#123D2B] font-medium text-xs uppercase tracking-[0.16em] transition-all flex items-center gap-1.5 group"
            >
              <span>WATCH THE SYSTEM</span>
              <ArrowUpRight className="w-4 h-4 text-[#123D2B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Sanctuary Metrics */}
          <div className="pt-5 border-t border-black/10 flex items-center gap-6 text-xs">
            <div>
              <div className="font-serif font-bold text-base text-[#123D2B]">437 ha</div>
              <div className="text-[10px] text-[#526359] uppercase tracking-wider">Forest Canopy</div>
            </div>
            <div className="w-[1px] h-6 bg-black/10" />
            <div>
              <div className="font-serif font-bold text-base text-[#123D2B]">156+</div>
              <div className="text-[10px] text-[#526359] uppercase tracking-wider">Protected Fauna</div>
            </div>
            <div className="w-[1px] h-6 bg-black/10" />
            <div>
              <div className="font-serif font-bold text-base text-[#123D2B]">0 ms</div>
              <div className="text-[10px] text-[#526359] uppercase tracking-wider">Buffer Overhead</div>
            </div>
          </div>

        </div>

        {/* CENTER COLUMN: Free-Floating 3D Royal Bengal Tiger (Completely borderless, no box!) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative my-6 lg:my-0 min-h-[460px] sm:min-h-[520px]">
          
          {/* Audio Roar Pill (like the 4350 sound pill in the video) */}
          <div className="absolute -top-3 right-4 z-30">
            <button
              onClick={triggerTigerAction}
              className="px-3 py-1.5 rounded-full bg-black/5 hover:bg-black/10 text-[#202820] font-semibold text-xs flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border border-black/10"
              title="Click to hear Tiger Roar"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#123D2B] animate-pulse" />
              <span className="font-mono text-[11px] font-bold">4350</span>
            </button>
          </div>

          {/* Interactive 3D Animal Container */}
          <div 
            onClick={triggerTigerAction}
            className="relative w-full max-w-[480px] sm:max-w-[540px] flex flex-col items-center justify-end cursor-pointer group transition-transform duration-100 ease-out"
            style={{
              transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${
                tigerPose === 'roaring' ? 1.08 : 1.02
              }, ${tigerPose === 'roaring' ? 1.08 : 1.02}, 1.02)`,
              transformStyle: 'preserve-3d',
            }}
            title="Click tiger to hear visceral roar and dynamic swoop!"
          >
            
            {/* The Cutout Royal Bengal Tiger Subject */}
            <div className="relative w-full flex items-center justify-center z-10">
              
              {/* Pose 1: Calm, alert standing tiger looking directly at user */}
              <img
                src="/images/tiger_isolated.png"
                alt="Royal Bengal Tiger in Nandankanan"
                className={`w-full max-h-[440px] sm:max-h-[500px] object-contain drop-shadow-2xl transition-all duration-500 pointer-events-none ${
                  tigerPose === 'calm'
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95 absolute inset-0'
                }`}
                style={{
                  filter: 'contrast(1.04) saturate(1.08)'
                }}
              />

              {/* Pose 2: Roaring action tiger swooping forward with open mouth & claws */}
              <img
                src="/images/tiger_roaring_isolated.png"
                alt="Roaring Royal Bengal Tiger Action"
                className={`w-full max-h-[440px] sm:max-h-[500px] object-contain drop-shadow-2xl transition-all duration-500 pointer-events-none ${
                  tigerPose === 'roaring'
                    ? 'opacity-100 scale-105 translate-y-[-12px]'
                    : 'opacity-0 scale-95 absolute inset-0'
                }`}
                style={{
                  filter: 'contrast(1.06) saturate(1.12)'
                }}
              />

            </div>

            {/* Realistic Soft Contact Drop Shadow on the Floor */}
            <div 
              className="w-[85%] h-8 bg-black/25 rounded-[100%] blur-xl pointer-events-none transition-all duration-300 -mt-4"
              style={{
                transform: `scale(${tigerPose === 'roaring' ? 1.15 : 1}) translate3d(${tilt.y * -0.8}px, ${tilt.x * 0.4}px, 0)`,
                opacity: tigerPose === 'roaring' ? 0.35 : 0.22
              }}
            />

            {/* Interaction Hint */}
            <div className="mt-3 px-3 py-1 rounded-full bg-black/5 text-[11px] font-medium text-[#526359] flex items-center gap-1.5 opacity-75 group-hover:opacity-100 transition-opacity">
              <Sparkles className="w-3 h-3 text-[#E5A836]" />
              <span>{tigerPose === 'roaring' ? 'Roar Active! Baring Fangs' : 'Click Tiger or move mouse to interact'}</span>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Floating HUD Telemetry Cards (Exact Scrolltide Replica) */}
        <div className="lg:col-span-3 flex flex-col gap-4 items-start lg:items-end justify-center">
          
          {/* FLOATING CARD 1: 12ms Latency Card (Exact Replica of Scrolltide Top Right Card) */}
          <div 
            className="w-full sm:w-64 rounded-2xl bg-[#091610]/95 backdrop-blur-xl border border-white/10 p-4 shadow-2xl text-left transition-transform duration-300 hover:-translate-y-1"
            style={{
              transform: `translate3d(${tilt.y * 0.5}px, ${tilt.x * 0.5}px, 0)`
            }}
          >
            {/* Header with Tiger Avatar Thumbnail & Action Dots */}
            <div className="flex items-center justify-between mb-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/15 bg-black/50">
                <img 
                  src="/images/royal_bengal_tiger.jpg" 
                  alt="Tiger camera view"
                  className="w-full h-full object-cover object-top"
                />
                <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <button className="text-white/50 hover:text-white transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Big 12ms Metric */}
            <div className="text-3xl font-mono font-extrabold text-white tracking-tight mb-1 flex items-baseline gap-1">
              <span>12</span>
              <span className="text-sm font-sans font-normal text-[#C8A96B]">ms</span>
            </div>

            <div className="text-[11px] text-white/70 font-light flex items-center justify-between">
              <span>Telemetry Ping</span>
              <span className="text-emerald-400 font-mono text-[10px]">60 FPS Active</span>
            </div>
          </div>

          {/* FLOATING CARD 2: 99.98% Sanctuary Coverage Card (Scrolltide Second Card) */}
          <div 
            className="w-full sm:w-64 rounded-2xl bg-[#091610]/95 backdrop-blur-xl border border-white/10 p-4 shadow-2xl text-left transition-transform duration-300 hover:-translate-y-1"
            style={{
              transform: `translate3d(${tilt.y * -0.4}px, ${tilt.x * -0.4}px, 0)`
            }}
          >
            {/* Header with Forest Habitat Thumbnail */}
            <div className="flex items-center justify-between mb-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/15 bg-black/50">
                <img 
                  src="/images/sanctuary_forest.jpg" 
                  alt="Sanctuary Forest"
                  className="w-full h-full object-cover"
                />
              </div>
              <Shield className="w-4 h-4 text-[#C8A96B]" />
            </div>

            {/* Big 99.98% Metric */}
            <div className="text-3xl font-mono font-extrabold text-white tracking-tight mb-1 flex items-baseline gap-1">
              <span>99.98</span>
              <span className="text-sm font-sans font-normal text-[#C8A96B]">%</span>
            </div>

            <p className="text-[11px] text-white/75 leading-tight mb-2">
              Sanctuary security & pure Royal Bengal Tiger territory index.
            </p>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60 font-mono">
              <span>ZONE A</span>
              <span className="text-emerald-400">20.4080° N, 85.8160° E</span>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Status Bar */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-8 mt-2 pt-3 border-t border-black/5 flex items-center justify-between">
        
        {/* Park Status */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-[#526359]">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Gates Open: 07:30 AM – 05:30 PM IST</span>
          <span className="text-black/20">•</span>
          <span>Bhubaneswar, Odisha</span>
        </div>

        {/* Scroll Down Indicator */}
        <a 
          href="#explore-animals" 
          className="flex items-center gap-2 text-xs font-semibold text-[#202820] hover:text-[#123D2B] transition-colors mx-auto sm:mx-0 group"
        >
          <span className="uppercase tracking-[0.2em] text-[10px]">SCROLL TO EXPLORE</span>
          <div className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center group-hover:border-[#123D2B] transition-colors">
            <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </div>
        </a>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerTigerAction}
            className="p-2 rounded-full bg-black/5 hover:bg-black/10 text-[#202820] transition-colors"
            title="Hear Tiger Roar"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#C8A96B]" />
          </button>
        </div>

      </div>

    </section>
  );
}
