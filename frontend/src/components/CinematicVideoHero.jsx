import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  Compass, 
  Tv, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { playTigerRoar } from '../utils/audioSynthesizer';

export default function CinematicVideoHero({ onExploreClick, onWatchLiveClick }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isRoaring, setIsRoaring] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleRoar = () => {
    setIsRoaring(true);
    playTigerRoar();
    setTimeout(() => setIsRoaring(false), 2200);
  };

  return (
    <section 
      id="hero" 
      className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden select-none bg-[#071D12]"
    >
      {/* 1. Full-Screen Cinematic Bengal Tiger Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          disablePictureInPicture
          controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
          poster="/images/tiger_hero_poster.jpg"
          className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
        >
          <source src="/videos/tiger_walking_1080p.webm" type="video/webm" />
          <source src="/videos/tiger_hero.webm" type="video/webm" />
        </video>

        {/* Subtle Cinematic Forest Green Gradient Overlay for High Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071D12]/90 via-[#0B2A1A]/65 to-[#071D12]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071D12] via-transparent to-[#071D12]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(18,61,43,0.5)_0%,transparent_60%)]" />
      </div>

      {/* 2. Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 sm:pt-40 pb-20">
        <div className="max-w-3xl">
          
          {/* Official Nandankanan Logo Badge on Front Page */}
          <div className="mb-6 inline-flex items-center gap-4 p-2.5 pr-5 rounded-2xl bg-[#0B2A1A]/90 border border-[#C8A96B]/50 shadow-2xl backdrop-blur-md animate-fadeIn hover:border-[#C8A96B] transition-all">
            <div className="bg-white rounded-xl px-2.5 py-1.5 shadow-md flex items-center">
              <img 
                src="/images/nandankanan_official_logo.png" 
                alt="Nandankanan Official Logo" 
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </div>
            <div className="text-left">
              <span className="text-xs sm:text-sm font-bold text-[#C8A96B] font-mono tracking-wider block">
                ନନ୍ଦନକାନନ ପ୍ରାଣୀ ଉଦ୍ୟାନ • ଭୁବନେଶ୍ୱର
              </span>
              <span className="text-[10px] text-[#F5F4EA]/70 font-mono tracking-widest uppercase block mt-0.5">
                NANDANKANAN ZOOLOGICAL PARK • ESTD. 1960
              </span>
            </div>
          </div>

          {/* Main Bilingual Heading (Odia + English) */}
          <div className="mb-5">
            {/* Odia Heading Line */}
            <div className="text-xl sm:text-3xl md:text-4xl font-serif font-bold text-[#C8A96B] tracking-wide mb-2 drop-shadow-md">
              ଯେଉଁଠି ବନ୍ୟଜୀବନ ପାଏ ଆଶ୍ରୟ
            </div>

            {/* English Main Heading */}
            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#F5F4EA] leading-[1.04] drop-shadow-2xl">
              WHERE THE WILD <br />
              <span className="text-[#C8A96B] font-editorial italic font-normal tracking-normal drop-shadow-lg">
                FINDS ITS HOME
              </span>
            </h1>
          </div>

          {/* Bilingual Subtitle (English + Odia) */}
          <div className="space-y-1.5 mb-8 max-w-2xl drop-shadow-sm">
            <p className="text-base sm:text-lg text-[#F5F4EA]/95 font-light leading-relaxed">
              Discover the extraordinary world of wildlife at Nandankanan, Odisha — 437 hectares of pristine wilderness, home to white tigers, gharials, and 156+ species.
            </p>
            <p className="text-xs sm:text-sm text-[#A7D7A9] font-normal leading-relaxed">
              ନନ୍ଦନକାନନ ପ୍ରାଣୀ ଉଦ୍ୟାନ — ଧଳା ବାଘ, ଘଡ଼ିଆଳ କୁମ୍ଭୀର ଓ ବିରଳ ପ୍ରଜାତିର ସୁରକ୍ଷିତ ପ୍ରାକୃତିକ ନିବାସ।
            </p>
          </div>

          {/* Two Prominent Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-10">
            <a
              href="#explore-animals"
              onClick={onExploreClick}
              className="px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-[#C8A96B] to-[#b39352] hover:from-[#d8b87a] hover:to-[#C8A96B] text-[#123D2B] font-display font-black text-xs sm:text-sm uppercase tracking-[0.16em] shadow-2xl shadow-[#C8A96B]/30 hover:shadow-[#C8A96B]/50 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-3 group"
            >
              <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              <span>EXPLORE WILDLIFE</span>
              <span className="hidden sm:inline opacity-75 font-serif font-normal text-xs tracking-normal">| ବନ୍ୟପ୍ରାଣୀ</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-0.5" />
            </a>

            <a
              href="#live-wildlife"
              onClick={onWatchLiveClick}
              className="px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-[#123D2B]/90 hover:bg-[#123D2B] border border-[#26734D] hover:border-[#C8A96B] text-[#F5F4EA] font-display font-bold text-xs sm:text-sm uppercase tracking-[0.16em] shadow-xl backdrop-blur-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-3 group"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <Tv className="w-4 h-4 text-[#C8A96B] group-hover:scale-110 transition-transform" />
              <span>WATCH LIVE</span>
              <span className="hidden sm:inline text-[#A7D7A9] font-serif font-normal text-xs tracking-normal">| ଲାଇଭ୍ ଦେଖନ୍ତୁ</span>
            </a>
          </div>

          {/* Sanctuary Metric Badges */}
          <div className="hidden sm:flex items-center gap-6 pt-6 border-t border-white/10 text-xs font-mono text-[#F5F4EA]/80">
            <div className="flex items-center gap-2">
              <span className="text-[#C8A96B] font-bold text-sm">437 ha</span>
              <span>Sanctuary Corridor</span>
            </div>
            <span className="text-white/20">•</span>
            <div className="flex items-center gap-2">
              <span className="text-[#C8A96B] font-bold text-sm">156+</span>
              <span>Protected Species</span>
            </div>
            <span className="text-white/20">•</span>
            <div className="flex items-center gap-2">
              <span className="text-[#C8A96B] font-bold text-sm">1960</span>
              <span>Estd. Heritage</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Floating Video & Sound Controls (Bottom Right) */}
      <div className="absolute bottom-8 right-6 sm:right-10 z-20 flex items-center gap-2 bg-[#071D12]/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-2xl">
        {/* Roar button */}
        <button
          onClick={handleRoar}
          className={`px-3 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
            isRoaring 
              ? 'bg-[#C8A96B] text-[#123D2B] scale-105 shadow-lg' 
              : 'bg-[#123D2B] hover:bg-[#26734D] text-[#C8A96B]'
          }`}
          title="Play Royal Bengal Tiger Roar"
        >
          <span>🐅</span>
          <span>{isRoaring ? 'ROARING...' : 'ROAR'}</span>
        </button>

        {/* Mute/Unmute */}
        <button
          onClick={toggleMute}
          className="p-2 rounded-xl bg-[#123D2B] hover:bg-[#26734D] text-[#F5F4EA] transition-colors"
          title={isMuted ? "Unmute Ambient Video Sound" : "Mute Sound"}
          aria-label="Toggle Sound"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-[#C8A96B]" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="p-2 rounded-xl bg-[#123D2B] hover:bg-[#26734D] text-[#F5F4EA] transition-colors"
          title={isPlaying ? "Pause Hero Video" : "Play Hero Video"}
          aria-label="Toggle Video Playback"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-[#C8A96B]" />}
        </button>
      </div>

      {/* 4. Animated Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-[#F5F4EA]/70 pointer-events-none">
        <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C8A96B]">
          SCROLL TO EXPLORE SANCTUARY
        </span>
        <ChevronDown className="w-4 h-4 text-[#C8A96B] animate-bounce" />
      </div>

    </section>
  );
}

