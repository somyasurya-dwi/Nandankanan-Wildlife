import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Compass, 
  Map as MapIcon, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { 
  playTigerRoar, 
  playLionRoar, 
  playElephantTrumpet, 
  playPeafowlCry 
} from '../utils/audioSynthesizer';
import { useLanguage } from '../context/LanguageContext';

export default function CinematicVideoHero({ onExploreClick, onMapClick, onWatchLiveClick }) {
  const { language, t } = useLanguage();

  // Multi-animal video scenes
  const scenes = [
    {
      id: 'tiger',
      animal: t('hero.scenes.tiger') || 'Royal Bengal Tiger',
      videoUrl: '/videos/tiger_walking_1080p.webm',
      fallbackVideoUrl: '/videos/tiger_hero.webm',
      poster: '/images/tiger_hero_poster_16x9.jpg',
      audioFn: playTigerRoar,
      emoji: '🐅'
    },
    {
      id: 'lion',
      animal: t('hero.scenes.lion') || 'Asiatic Lion',
      videoUrl: '/videos/lion_live.webm',
      fallbackVideoUrl: '/videos/lion_live.webm',
      poster: '/images/lion_poster_16x9.jpg',
      audioFn: playLionRoar,
      emoji: '🦁'
    },
    {
      id: 'elephant',
      animal: t('hero.scenes.elephant') || 'Asian Elephant',
      videoUrl: '/videos/elephant_live.webm',
      fallbackVideoUrl: '/videos/elephant_live.webm',
      poster: '/images/elephant_poster_16x9.jpg',
      audioFn: playElephantTrumpet,
      emoji: '🐘'
    },
    {
      id: 'peafowl',
      animal: t('hero.scenes.peafowl') || 'Indian Peafowl',
      videoUrl: '/videos/birds_live.webm',
      fallbackVideoUrl: '/videos/birds_live.webm',
      poster: '/images/peafowl_poster_16x9.jpg',
      audioFn: playPeafowlCry,
      emoji: '🦚'
    }
  ];

  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isRoaring, setIsRoaring] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isControlsHovered, setIsControlsHovered] = useState(false);

  const videoRefs = useRef([]);

  // Auto-rotate scene every 10 seconds (pauses if video is paused or controls hovered)
  useEffect(() => {
    if (!isPlaying || isControlsHovered) return;
    const interval = setInterval(() => {
      handleNextScene();
    }, 10000);
    return () => clearInterval(interval);
  }, [isPlaying, activeSceneIndex, isControlsHovered]);

  const handleNextScene = () => {
    switchScene((activeSceneIndex + 1) % scenes.length);
  };

  const switchScene = (newIndex) => {
    if (newIndex === activeSceneIndex) return;
    setIsTransitioning(true);

    // Pause current video
    if (videoRefs.current[activeSceneIndex]) {
      videoRefs.current[activeSceneIndex].pause();
    }

    setTimeout(() => {
      setActiveSceneIndex(newIndex);
      setIsTransitioning(false);

      // Play new video
      if (videoRefs.current[newIndex] && isPlaying) {
        videoRefs.current[newIndex].currentTime = 0;
        videoRefs.current[newIndex].play().catch(() => {});
      }
    }, 400);
  };

  const togglePlay = () => {
    const curVideo = videoRefs.current[activeSceneIndex];
    if (!curVideo) return;
    if (isPlaying) {
      curVideo.pause();
      setIsPlaying(false);
    } else {
      curVideo.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRefs.current.forEach((v) => {
      if (v) v.muted = nextMuted;
    });
  };

  const handleRoar = () => {
    setIsRoaring(true);
    const scene = scenes[activeSceneIndex];
    if (scene && scene.audioFn) {
      scene.audioFn();
    }
    setTimeout(() => setIsRoaring(false), 2200);
  };

  const currentScene = scenes[activeSceneIndex];

  return (
    <section 
      id="hero" 
      className="relative w-full min-h-[70vh] sm:min-h-[76vh] md:min-h-[82vh] flex flex-col justify-start overflow-hidden select-none bg-[#071D12] pt-3 sm:pt-4 md:pt-5 pb-6 sm:pb-8 md:pb-10"
    >
      {/* 1. Cinematic Background Video Carousel */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {scenes.map((scene, idx) => {
          const isActive = idx === activeSceneIndex;
          return (
            <div 
              key={scene.id} 
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <video
                ref={(el) => (videoRefs.current[idx] = el)}
                src={scene.videoUrl}
                autoPlay={isActive}
                loop
                muted={isMuted}
                playsInline
                poster={scene.poster}
                className="w-full h-full object-cover object-center scale-105 brightness-[1.12] contrast-[1.08] saturate-[1.18]"
              >
                <source src={scene.videoUrl} type="video/webm" />
                {scene.fallbackVideoUrl && (
                  <source src={scene.fallbackVideoUrl} type="video/webm" />
                )}
              </video>
            </div>
          );
        })}

        {/* Vantara-Style Ambient Natural Lighting & Clear Scrim Overlays (Zero-Blur, High-Luminance) */}
        {/* 1. Subtle horizontal text contrast scrim on the left (keeps video fully visible while ensuring sharp text) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent z-10 pointer-events-none" />
        
        {/* 2. Soft top header blend (for seamless transition under sticky navbar) */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent z-10 pointer-events-none" />

        {/* 3. Golden natural sunlight ambient warmth (Vantara signature warm golden daylight glow) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#C8A96B]/15 via-transparent to-[#10B981]/5 mix-blend-screen pointer-events-none z-10" />

        {/* 4. Soft bottom seamless section fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#071D12] to-transparent z-10 pointer-events-none" />
      </div>

      {/* 2. Hero Content Container with Responsive Grid Layout */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-1 sm:pt-2 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
          
          {/* Main Left Column: Editorial Typography, Actions & Metrics */}
          <div className="lg:col-span-8 xl:col-span-9 max-w-3xl">
            
            {/* Top Odia Tagline matching 1st pic */}
            <div className="text-xl sm:text-2xl md:text-3xl font-odia font-bold text-[#C8A96B] tracking-wide mb-2 sm:mb-2.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              {language === 'or' ? (t('hero.odiaTagline') || 'WHERE THE WILD FINDS IT\'S HOME') : (t('hero.odiaTagline') || 'ଯେଉଁଠି ବନ୍ୟଜୀବନ ପାଏ ଆଶ୍ରୟ')}
            </div>

            {/* Editorial Grand Typography matching 1st pic */}
            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] tracking-tight leading-[1.04] text-[#F5F4EA] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] mb-3 sm:mb-4">
              {language === 'en' ? (
                <>
                  WHERE THE <br />
                  WILD <br />
                  <span className="text-[#C8A96B] font-editorial italic font-normal tracking-normal drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                    FINDS IT'S HOME
                  </span>
                </>
              ) : (
                <>
                  {t('hero.englishHeadingLine1')} <br />
                  <span className="text-[#C8A96B] font-editorial italic font-normal tracking-normal drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                    {t('hero.englishHeadingLine2')}
                  </span>
                </>
              )}
            </h1>

            {/* Dual Description Paragraphs matching 1st pic */}
            <p className="text-base sm:text-lg md:text-xl text-[#F5F4EA] max-w-2xl font-light leading-relaxed mb-2 sm:mb-2.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              {t('hero.subtitle')}
            </p>
            <p className="text-xs sm:text-sm md:text-[15px] text-[#C2E0CB] max-w-2xl font-medium leading-relaxed mb-4 sm:mb-5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              {t('hero.shortIntro')}
            </p>

            {/* Call-To-Action Button Suite */}
            <div className="flex flex-wrap items-center gap-3.5 mb-5 sm:mb-6">
              <button
                onClick={onExploreClick}
                className="btn-accent px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm tracking-wider uppercase inline-flex items-center gap-2.5 shadow-xl group cursor-pointer"
              >
                <span>{t('hero.exploreWildlife')}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#interactive-map"
                onClick={(e) => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('reset-zoo-map-view'));
                  }
                  if (onMapClick) {
                    e.preventDefault();
                    onMapClick();
                  }
                }}
                className="px-5 py-3 rounded-xl bg-[#06180E]/75 hover:bg-[#123D2B] text-[#F5F4EA] hover:text-[#C8A96B] border border-[#26734D]/60 hover:border-[#C8A96B]/80 font-bold text-xs uppercase tracking-wider backdrop-blur-md shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <MapIcon className="w-4 h-4 text-[#C8A96B]" />
                <span>{t('hero.discoverZooMap')}</span>
              </a>

              <button
                onClick={onWatchLiveClick}
                className="px-5 py-3 rounded-xl bg-[#06180E]/75 hover:bg-[#123D2B] text-[#F5F4EA] hover:text-[#C8A96B] border border-[#26734D]/60 hover:border-[#C8A96B]/80 font-bold text-xs uppercase tracking-wider backdrop-blur-md shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>{t('hero.watchLive')}</span>
              </button>
            </div>

            {/* Sanctuary Metric Trust Badges (Frosted Conservation Capsules) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/15">
              {/* Badge 1: Corridor Area */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#06180E]/75 hover:bg-[#06180E]/90 border border-[#26734D]/50 hover:border-[#C8A96B]/60 backdrop-blur-md shadow-lg transition-all group">
                <span className="text-base sm:text-lg">🌲</span>
                <div className="flex flex-col">
                  <span className="text-[#C8A96B] font-display font-black text-sm sm:text-base leading-tight">
                    437 ha
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#F5F4EA]/80 leading-none">
                    {t('hero.corridorStat')}
                  </span>
                </div>
              </div>

              {/* Badge 2: Protected Species */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#06180E]/75 hover:bg-[#06180E]/90 border border-[#26734D]/50 hover:border-[#C8A96B]/60 backdrop-blur-md shadow-lg transition-all group">
                <span className="text-base sm:text-lg">🐾</span>
                <div className="flex flex-col">
                  <span className="text-[#C8A96B] font-display font-black text-sm sm:text-base leading-tight">
                    156+
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#F5F4EA]/80 leading-none">
                    {t('hero.speciesStat')}
                  </span>
                </div>
              </div>

              {/* Badge 3: Heritage Foundation */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#06180E]/75 hover:bg-[#06180E]/90 border border-[#26734D]/50 hover:border-[#C8A96B]/60 backdrop-blur-md shadow-lg transition-all group">
                <span className="text-base sm:text-lg">🏛️</span>
                <div className="flex flex-col">
                  <span className="text-[#C8A96B] font-display font-black text-sm sm:text-base leading-tight">
                    1960
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#F5F4EA]/80 leading-none">
                    {t('hero.heritageStat')}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Video Playback Controls (Zero-Overlap Grid Placement) */}
          <div className="lg:col-span-4 xl:col-span-3 flex lg:justify-end items-center gap-2.5 pb-2">
            {/* 1. Play / Pause Button */}
            <button
              onClick={togglePlay}
              className="p-2.5 sm:p-3 rounded-xl bg-[#06180E]/85 hover:bg-[#123D2B] text-[#F5F4EA] hover:text-[#C8A96B] border border-[#26734D]/60 hover:border-[#C8A96B]/80 backdrop-blur-md shadow-xl transition-all cursor-pointer flex items-center justify-center group hover:scale-105 active:scale-95"
              title={isPlaying ? "Pause Video" : "Play Video"}
              aria-label={isPlaying ? "Pause Video" : "Play Video"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-[#F5F4EA]/80 group-hover:text-white" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8A96B]" />
              )}
            </button>

            {/* 2. Volume / Mute Button */}
            <button
              onClick={toggleMute}
              className="p-2.5 sm:p-3 rounded-xl bg-[#06180E]/85 hover:bg-[#123D2B] text-[#F5F4EA] hover:text-[#C8A96B] border border-[#26734D]/60 hover:border-[#C8A96B]/80 backdrop-blur-md shadow-xl transition-all cursor-pointer flex items-center justify-center group hover:scale-105 active:scale-95"
              title={isMuted ? "Unmute Video" : "Mute Video"}
              aria-label={isMuted ? "Unmute Video" : "Mute Video"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-[#F5F4EA]/80 group-hover:text-white" />
              ) : (
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8A96B] animate-pulse" />
              )}
            </button>
          </div>

        </div>
      </div>



      {/* Organic Curved Forest Elevation Wave Transition into Next Section */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none overflow-hidden leading-none">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-5 sm:h-7 md:h-9 text-[#071810] fill-current"
        >
          <path d="M0,0 C150,80 350,-30 500,40 C650,110 900,10 1200,35 L1200,120 L0,120 Z" />
        </svg>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C8A96B]/30 to-transparent" />
      </div>

    </section>
  );
}
