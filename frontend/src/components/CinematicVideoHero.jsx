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
  playBearGrunt 
} from '../utils/audioSynthesizer';
import { useLanguage } from '../context/LanguageContext';

export default function CinematicVideoHero({ onExploreClick, onWatchLiveClick }) {
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
      id: 'bear',
      animal: t('hero.scenes.bear') || 'Sloth Bear',
      videoUrl: '/videos/bear_live.webm',
      fallbackVideoUrl: '/videos/bear_live.webm',
      poster: '/images/bear_poster_16x9.jpg',
      audioFn: playBearGrunt,
      emoji: '🐻'
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
      className="relative w-full min-h-[72vh] sm:min-h-[80vh] md:min-h-[85vh] flex flex-col justify-center overflow-hidden select-none bg-[#071D12] pt-8 sm:pt-12 md:pt-14 pb-24 sm:pb-28"
    >
      {/* 1. Cinematic Background Video Carousel (Rock-Solid Frame, No Parallax Shift Before THE WILD, LIVE) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {scenes.map((scene, idx) => {
          const isActive = idx === activeSceneIndex;
          return (
            <div
              key={scene.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive && !isTransitioning ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <video
                ref={(el) => (videoRefs.current[idx] = el)}
                autoPlay={isActive}
                loop
                muted={isMuted}
                playsInline
                preload="metadata"
                poster={scene.poster}
                className="w-full h-full object-cover object-center filter brightness-105 contrast-115 saturate-110"
              >
                <source src={scene.videoUrl} type="video/webm" />
                <source src={scene.fallbackVideoUrl} type="video/webm" />
              </video>
            </div>
          );
        })}

        {/* Focused Cinematic Text Vignette: Deep contrast under text on the left, crystal-clear over animal on the right */}
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#04120A]/90 via-[#04120A]/55 via-45% to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 z-20 bg-gradient-to-t from-[#071D12] via-[#071D12]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-24 z-20 bg-gradient-to-b from-[#04120A]/70 to-transparent pointer-events-none" />

        {/* Subtle Atmospheric Forest Dust Particles */}
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden opacity-60">
          <div className="forest-dust-particle p1" />
          <div className="forest-dust-particle p2" />
          <div className="forest-dust-particle p3" />
          <div className="forest-dust-particle p4" />
          <div className="forest-dust-particle p5" />
        </div>
      </div>

      {/* 2. Main Hero Content Flow (Stable, No Parallax Bleed into Subsequent Sections) */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center">
        <div className="max-w-3xl pb-2">

          {/* Bilingual Hero Heading */}
          <div className="mb-5">
            {language === 'en' ? (
              <>
                {/* Odia Tagline above English Heading in default English view */}
                <div className="text-xl sm:text-2xl md:text-3xl font-odia font-bold text-[#C8A96B] tracking-wide mb-3 drop-shadow-md">
                  {t('hero.odiaTagline')}
                </div>
                {/* English Main Heading */}
                <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] tracking-tight text-[#F5F4EA] leading-[1.04] drop-shadow-2xl">
                  {t('hero.englishHeadingLine1')} <br />
                  <span className="text-[#C8A96B] font-editorial italic font-normal tracking-normal drop-shadow-lg">
                    {t('hero.englishHeadingLine2')}
                  </span>
                </h1>
              </>
            ) : (
              <>
                {/* English Tagline above when Odia/Hindi/Bengali is selected */}
                <div className="text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-[#C8A96B] mb-3 drop-shadow-md">
                  {t('hero.odiaTagline')}
                </div>
                {/* Native Script Main Heading */}
                <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-[#F5F4EA] leading-[1.15] drop-shadow-2xl">
                  {t('hero.englishHeadingLine1')} <br />
                  <span className="text-[#C8A96B] font-serif font-bold tracking-normal drop-shadow-lg">
                    {t('hero.englishHeadingLine2')}
                  </span>
                </h1>
              </>
            )}
          </div>

          {/* Paragraph Introduction */}
          <p className="text-base sm:text-lg md:text-xl text-[#F5F4EA]/90 max-w-2xl font-light leading-relaxed mb-6 drop-shadow">
            {t('hero.subtitle')}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
            <button
              onClick={onExploreClick}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C8A96B] to-[#b39352] hover:from-[#d8b87a] hover:to-[#C8A96B] text-[#071D12] font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-[0_0_20px_rgba(200,169,107,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>{t('hero.exploreWildlife')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#interactive-map"
              className="px-5 py-3 rounded-xl bg-[#06180E]/75 hover:bg-[#123D2B] text-[#F5F4EA] hover:text-[#C8A96B] border border-[#26734D]/60 hover:border-[#C8A96B]/80 font-bold text-xs uppercase tracking-wider backdrop-blur-md shadow-md transition-all flex items-center gap-2"
            >
              <MapIcon className="w-4 h-4 text-[#C8A96B]" />
              <span>{t('hero.discoverZooMap')}</span>
            </a>

            <button
              onClick={onWatchLiveClick}
              className="px-4 py-3 rounded-xl bg-black/30 hover:bg-[#123D2B]/80 text-[#F5F4EA]/90 hover:text-white border border-white/15 hover:border-emerald-500/60 font-semibold text-xs uppercase tracking-wider backdrop-blur-md transition-all flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>{t('hero.watchLive')}</span>
            </button>
          </div>

          {/* Sanctuary Metric Trust Badges */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#F5F4EA]/70 font-mono pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-[#C8A96B] font-bold text-sm">437 ha</span>
              <span>{t('hero.corridorStat')}</span>
            </div>
            <span className="text-white/30 hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <span className="text-[#C8A96B] font-bold text-sm">156+</span>
              <span>{t('hero.speciesStat')}</span>
            </div>
            <span className="text-white/30 hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <span className="text-[#C8A96B] font-bold text-sm">1960</span>
              <span>{t('hero.heritageStat')}</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Multi-Animal Video Transitions Controls (Clean, Minimal Frosted Bar) */}
      <div 
        className="absolute bottom-5 sm:bottom-7 md:bottom-8 left-4 sm:left-6 lg:left-8 z-30 flex items-center gap-2 bg-[#06180E]/90 border border-[#26734D]/50 rounded-xl px-2.5 sm:px-3 py-1.5 backdrop-blur-md shadow-xl max-w-[calc(100vw-2rem)] select-none"
        onMouseEnter={() => setIsControlsHovered(true)}
        onMouseLeave={() => setIsControlsHovered(false)}
      >
        
        {/* Active Scene Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 pr-2.5 border-r border-white/10 text-xs text-[#F5F4EA] font-medium">
          <span className="text-sm">{currentScene.emoji}</span>
          <span className="text-[#C8A96B] font-bold text-xs tracking-wide whitespace-nowrap">
            {currentScene.animal}
          </span>
        </div>

        {/* Animal Scene Carousel Switcher Pills with 10s Timeline Progress Bar */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {scenes.map((s, idx) => {
            const isCurr = idx === activeSceneIndex;
            return (
              <button
                key={s.id}
                onClick={() => switchScene(idx)}
                className={`relative overflow-hidden px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  isCurr
                    ? 'bg-[#C8A96B] text-[#071D12] font-bold shadow-sm'
                    : 'bg-[#123D2B]/80 text-[#F5F4EA]/80 hover:text-white hover:bg-[#1B6537]'
                }`}
                title={`Switch to ${s.animal} video`}
              >
                <span>{s.emoji}</span>
                <span className="hidden md:inline">{s.animal.split(' ')[0]}</span>

                {/* 10-Second Story Bar Filling along the bottom of the active pill */}
                {isCurr && isPlaying && (
                  <span 
                    key={`story-timeline-${activeSceneIndex}`}
                    className="absolute bottom-0 left-0 h-[2px] bg-[#071D12] w-full origin-left animate-timeline-progress" 
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Video Control Buttons: Audio Roar + Play/Pause + Mute/Unmute */}
        <div className="flex items-center gap-1 pl-1.5 sm:pl-2 border-l border-white/10">
          
          {/* Roar Button */}
          <button
            onClick={handleRoar}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              isRoaring 
                ? 'bg-[#C8A96B] text-[#071D12] scale-105 shadow-[0_0_12px_#C8A96B]' 
                : 'bg-[#123D2B]/80 text-[#C8A96B] hover:bg-[#1B6537]'
            }`}
            title="Hear Animal Call"
            aria-label="Hear Animal Roar"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={togglePlay}
            className="p-1.5 rounded-lg bg-[#123D2B]/80 text-[#F5F4EA] hover:text-[#C8A96B] hover:bg-[#1B6537] transition-colors"
            title={isPlaying ? "Pause Video" : "Play Video"}
            aria-label="Play or Pause Video"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg bg-[#123D2B]/80 text-[#F5F4EA] hover:text-[#C8A96B] hover:bg-[#1B6537] transition-colors"
            title={isMuted ? "Unmute Video" : "Mute Video"}
            aria-label="Mute or Unmute Video"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#C8A96B]" />}
          </button>
        </div>

      </div>

      {/* Organic Curved Forest Elevation Wave Transition into Next Section */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none overflow-hidden leading-none">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-6 sm:h-9 md:h-12 text-[#071810] fill-current"
        >
          <path d="M0,0 C150,80 350,-30 500,40 C650,110 900,10 1200,35 L1200,120 L0,120 Z" />
        </svg>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C8A96B]/30 to-transparent" />
      </div>

    </section>
  );
}
