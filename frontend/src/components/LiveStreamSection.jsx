import React, { useState, useRef } from 'react';
import { Tv, Play, Pause, Volume2, VolumeX, Maximize2, Users, Activity, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LiveStreamSection({ language }) {
  const videoRef = useRef(null);
  const [activeCamIndex, setActiveCamIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const cameras = [
    {
      id: 1,
      name: "White Tiger Sanctuary",
      species: "Panthera tigris tigris (var. alba)",
      habitat: "Pool & Sal Tree Enclosure",
      viewers: 2840,
      badge: "4K 60FPS",
      src: "/videos/tiger_walking_1080p.webm",
      poster: "/images/white_tiger.jpg",
      status: "LIVE",
      desc: "Live observation of the iconic white tiger cooling off in the water channels of Nandankanan."
    },
    {
      id: 2,
      name: "Royal Bengal Tiger Safari",
      species: "Panthera tigris tigris",
      habitat: "Open Forest Safari Sector A",
      viewers: 3410,
      badge: "1080p Stream",
      src: "/videos/tiger_walking_pacing.webm",
      poster: "/images/royal_bengal_tiger.jpg",
      status: "LIVE",
      desc: "Full territory tracking across 12 hectares of natural deciduous jungle corridor."
    },
    {
      id: 3,
      name: "Asiatic Lion Pride",
      species: "Panthera leo persica",
      habitat: "Savannah & Rock Outcrop Safari",
      viewers: 1920,
      badge: "HD Feed",
      src: "/videos/tiger_walking_zoo.webm",
      poster: "/images/asiatic_lion.jpg",
      status: "LIVE",
      desc: "Observing pride basking on the sunlit ridges of the lion safari."
    },
    {
      id: 4,
      name: "Asian Elephant Meadow",
      species: "Elephas maximus",
      habitat: "Bathing Pool & Mud Wallow",
      viewers: 1650,
      badge: "HD Feed",
      src: "/videos/tiger_safari.webm",
      poster: "/images/asian_elephant.jpg",
      status: "LIVE",
      desc: "Family herd foraging along the lush borders of Kanjia wetland."
    },
    {
      id: 5,
      name: "Sloth Bear Cavern",
      species: "Melursus ursinus",
      habitat: "Rocky Ravine & Termite Mounds",
      viewers: 1140,
      badge: "HD Feed",
      src: "/videos/tiger_walking_1080p.webm",
      poster: "/images/sloth_bear.jpg",
      status: "LIVE",
      desc: "Nocturnal & crepuscular foraging behavior monitoring."
    },
    {
      id: 6,
      name: "Walk-Through Bird Aviary",
      species: "Aves Sanctuary",
      habitat: "Canopy Walkway & Wetland Pools",
      viewers: 980,
      badge: "1080p Stream",
      src: "/videos/tiger_walking_pacing.webm",
      poster: "/images/indian_peafowl.jpg",
      status: "LIVE",
      desc: "Over 80 indigenous and migratory wetland bird species."
    }
  ];

  const currentCam = cameras[activeCamIndex];

  const handleSelectCam = (idx) => {
    setActiveCamIndex(idx);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

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

  const toggleSound = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section id="live" className="py-28 bg-[#0B2A1A] text-[#F4F1E8] relative z-20 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-[#14532D]/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#2E7D32]/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#F28C1B] font-bold">
                THE WILD, LIVE • 24/7 STREAMING
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif text-[#F4F1E8] leading-tight">
              Unfiltered nature. <br />
              <span className="font-editorial italic font-normal text-[#A7D7A9]">From their world to yours.</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#A7D7A9]">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Users className="w-4 h-4 text-[#F28C1B]" />
              <span>{cameras.reduce((acc, c) => acc + c.viewers, 0).toLocaleString()} Active Viewers</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>6 High-Definition Optical Feeds</span>
            </div>
          </div>
        </div>

        {/* Big Cinematic Video Player */}
        <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-black shadow-2xl aspect-[16/9] max-h-[640px] mb-8 group">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            poster={currentCam.poster}
            className="w-full h-full object-cover object-center"
          >
            <source src={currentCam.src} type="video/webm" />
          </video>

          {/* Player Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none" />

          {/* Top Player Status Bar */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-red-600 text-white font-bold text-[11px] tracking-widest uppercase flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                LIVE
              </span>
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#F4F1E8] font-mono text-xs border border-white/15">
                {currentCam.badge}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-white/90">
              <Users className="w-3.5 h-3.5 text-[#F28C1B]" />
              <span>{currentCam.viewers.toLocaleString()} watching</span>
            </div>
          </div>

          {/* Bottom Player Information & Controls */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-20">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#F28C1B] font-mono font-semibold mb-1">
                {currentCam.habitat}
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-white font-bold mb-1">
                {currentCam.name}
              </h3>
              <p className="text-xs text-white/70 max-w-lg hidden sm:block">
                {currentCam.desc}
              </p>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-white/15 self-start sm:self-auto">
              <button
                onClick={togglePlay}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={isPlaying ? "Pause stream" : "Play stream"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleSound}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={isMuted ? "Unmute audio" : "Mute audio"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#F28C1B]" />}
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Feed Switcher Cards Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {cameras.map((cam, idx) => (
            <button
              key={cam.id}
              onClick={() => handleSelectCam(idx)}
              className={`relative rounded-2xl overflow-hidden text-left p-3 border transition-all duration-300 group ${
                activeCamIndex === idx
                  ? 'bg-[#14532D] border-[#F28C1B] shadow-xl scale-[1.02]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/25'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2.5 bg-black">
                <img 
                  src={cam.poster} 
                  alt={cam.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-red-600 text-white font-mono text-[9px] font-bold">
                  LIVE
                </span>
              </div>

              <div className="font-serif text-sm font-bold text-white truncate">
                {cam.name}
              </div>
              <div className="text-[11px] text-[#A7D7A9] font-mono">
                {cam.viewers.toLocaleString()} watching
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}

