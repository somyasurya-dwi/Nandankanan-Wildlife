import React, { useState, useRef, useEffect } from 'react';
import { 
  Tv, 
  Eye, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  X, 
  Radio, 
  MapPin, 
  Signal, 
  Activity, 
  Clock, 
  Heart, 
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';

export default function LiveStreaming({ 
  cameras, 
  activeModalCamera: externalActiveModalCamera, 
  setActiveModalCamera: externalSetActiveModalCamera 
}) {
  const [internalActiveModalCamera, setInternalActiveModalCamera] = useState(null);
  const activeModalCamera = externalActiveModalCamera !== undefined ? externalActiveModalCamera : internalActiveModalCamera;
  const setActiveModalCamera = externalSetActiveModalCamera || setInternalActiveModalCamera;
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [reactions, setReactions] = useState([]);
  const modalVideoRef = useRef(null);

  const handleOpenLiveModal = (camera) => {
    setActiveModalCamera(camera);
    setIsPlaying(true);
  };

  const handleCloseModal = () => {
    setActiveModalCamera(null);
  };

  const addReaction = (emoji) => {
    const id = Date.now() + Math.random();
    setReactions((prev) => [...prev, { id, emoji, x: 20 + Math.random() * 60 }]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2500);
  };

  return (
    <section id="live-wildlife" className="py-24 bg-forest-950 text-ivory-50 relative overflow-hidden">
      
      {/* Background Ambience Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-forest-800/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 live-indicator" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-300">
                Continuous Stream Network
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-wide text-ivory-50">
              THE WILD, <span className="text-gold-400">LIVE</span>
            </h2>
            <p className="mt-3 text-ivory-200/80 max-w-xl text-sm sm:text-base font-light">
              Watch real-time animal observation feeds from across Nandankanan’s 437-hectare forest enclosures and sanctuary wetlands.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-forest-900/80 border border-gold-500/20 rounded-xl px-4 py-2.5 flex items-center gap-3 text-xs text-ivory-200 backdrop-blur-md">
              <Signal className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>6 High-Definition Habitat Feeds Active</span>
            </div>
          </div>
        </div>

        {/* Demo Mode Notice Banner */}
        <div className="mb-10 p-4 rounded-2xl bg-forest-900/60 border border-gold-500/20 backdrop-blur-md flex items-start gap-3">
          <Info className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
          <div className="text-xs text-ivory-200/90 leading-relaxed">
            <strong className="text-gold-300 uppercase tracking-wider font-semibold">Sanctuary Live Feeds Note:</strong>{' '}
            Currently presenting synchronized high-fidelity habitat demo video footage for visitor experience. 
            All cameras are engineered with standard RTSP/HLS architecture for seamless connection to Nandankanan’s on-ground streaming cameras.
          </div>
        </div>

        {/* 6 Camera Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cameras.map((camera) => (
            <div
              key={camera.id}
              className="group rounded-2xl bg-forest-900/70 border border-forest-700/60 hover:border-gold-500/50 transition-all duration-500 overflow-hidden flex flex-col shadow-xl hover:shadow-2xl hover:shadow-gold-500/10 hover:-translate-y-1.5"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-forest-950">
                <img
                  src={camera.thumbnail_url}
                  alt={camera.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-transparent" />

                {/* Live / Offline Status Badge */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 ${
                    camera.status === 'LIVE'
                      ? 'bg-red-600/90 text-white backdrop-blur-md shadow-lg shadow-red-600/40'
                      : 'bg-zinc-700/80 text-zinc-300'
                  }`}>
                    {camera.status === 'LIVE' && <span className="w-2 h-2 rounded-full bg-white live-indicator" />}
                    {camera.status}
                  </span>
                  
                  <span className="px-2 py-0.5 rounded-md bg-forest-950/70 text-[9px] uppercase tracking-wider text-gold-400 border border-gold-500/30 backdrop-blur-md">
                    DEMO VIDEO
                  </span>
                </div>

                {/* Viewer Count */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-forest-950/80 backdrop-blur-md text-[11px] font-medium text-ivory-200 border border-forest-700/50">
                  <Eye className="w-3.5 h-3.5 text-gold-400" />
                  <span>{camera.viewer_count?.toLocaleString()} watching</span>
                </div>

                {/* Quick Play Overlay Button */}
                <button
                  onClick={() => handleOpenLiveModal(camera)}
                  className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-gold-500/90 hover:bg-gold-400 text-forest-950 flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100"
                  aria-label={`Watch live feed for ${camera.animal_name}`}
                >
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-gold-400 font-medium mb-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gold-400/80" />
                      {camera.habitat_name}
                    </span>
                    <span className="text-[11px] text-ivory-300/60 font-mono">1080p 30fps</span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-ivory-50 group-hover:text-gold-300 transition-colors">
                    {camera.animal_name}
                  </h3>

                  <p className="mt-2 text-xs text-ivory-200/70 line-clamp-2 leading-relaxed">
                    {camera.description || `Live observation stream observing ${camera.animal_name} in its naturalized sanctuary enclosure.`}
                  </p>
                </div>

                {/* Card Action Button */}
                <div className="mt-6 pt-4 border-t border-forest-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-ivory-300 uppercase tracking-widest font-mono">
                    {camera.camera_location}
                  </span>

                  <button
                    onClick={() => handleOpenLiveModal(camera)}
                    className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-gold-500 text-ivory-50 hover:text-forest-950 font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 border border-gold-500/30 hover:border-gold-400 shadow-md group-hover:shadow-gold-500/20"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>Watch Live</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Dedicated Live Video Player Modal */}
      {activeModalCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-forest-950/90 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-5xl bg-forest-900 border border-gold-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="px-5 py-4 bg-forest-950 border-b border-forest-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-red-600 text-white text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-white live-indicator" />
                  LIVE CAM
                </span>
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-ivory-50 flex items-center gap-2">
                    {activeModalCamera.title}
                  </h3>
                  <p className="text-[11px] text-gold-400 font-mono">
                    {activeModalCamera.camera_location} • Nandankanan Sanctuary Network
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-forest-800 text-[10px] uppercase font-mono text-gold-300 border border-gold-500/30">
                  DEMO STREAM
                </span>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg bg-forest-800/80 text-ivory-200 hover:text-white hover:bg-forest-700 transition-colors"
                  aria-label="Close video player"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player Box */}
            <div className="relative bg-black aspect-video w-full flex items-center justify-center overflow-hidden">
              <video
                ref={modalVideoRef}
                src={activeModalCamera.stream_url}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-contain"
              />

              {/* Floating Live Watermark and Stats */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 pointer-events-none">
                <div className="flex items-center gap-2 px-3 py-1 rounded bg-black/70 backdrop-blur-md border border-gold-500/30 text-[11px] text-ivory-100 font-mono">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-gold-300 font-bold">NKZ-CAM-{activeModalCamera.id.toString().padStart(2, '0')}</span>
                  <span className="text-ivory-300/80">|</span>
                  <span>1080p @ 30 FPS</span>
                  <span className="text-ivory-300/80">|</span>
                  <span>Bitrate: 4.8 Mbps</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-black/60 text-[10px] text-zinc-300 font-mono w-max">
                  LAT: 20.3957° N, LON: 85.8239° E
                </div>
              </div>

              {/* Simulated Floating Reactions */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
                {reactions.map((r) => (
                  <div
                    key={r.id}
                    style={{ left: `${r.x}%` }}
                    className="absolute bottom-10 text-3xl animate-floatUp pointer-events-none drop-shadow-lg"
                  >
                    {r.emoji}
                  </div>
                ))}
              </div>

              {/* Player Overlay Controls */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (!modalVideoRef.current) return;
                      if (isPlaying) {
                        modalVideoRef.current.pause();
                        setIsPlaying(false);
                      } else {
                        modalVideoRef.current.play();
                        setIsPlaying(true);
                      }
                    }}
                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-md"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      if (!modalVideoRef.current) return;
                      modalVideoRef.current.muted = !isMuted;
                      setIsMuted(!isMuted);
                    }}
                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-md"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-gold-400" />}
                  </button>

                  <span className="text-xs text-ivory-200 font-mono hidden sm:inline">
                    Simulated Sanctuary Stream • 00:00:14 Live
                  </span>
                </div>

                {/* Reaction Emojis */}
                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <span className="text-[11px] text-ivory-300 mr-1 hidden sm:inline">React:</span>
                  {['🐅', '💚', '🌿', '🔥', '👏'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => addReaction(emoji)}
                      className="hover:scale-125 transition-transform text-base p-1"
                      title={`Send ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Bottom: Quick Camera Switcher */}
            <div className="p-4 bg-forest-950 border-t border-forest-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 overflow-x-auto">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-gold-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-ivory-100">
                  Switch Enclosure Feed:
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {cameras.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveModalCamera(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      activeModalCamera.id === c.id
                        ? 'bg-gold-500 text-forest-950 font-bold shadow-md'
                        : 'bg-forest-900 text-ivory-200 hover:bg-forest-800 border border-forest-700/60'
                    }`}
                  >
                    {c.animal_name}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}

