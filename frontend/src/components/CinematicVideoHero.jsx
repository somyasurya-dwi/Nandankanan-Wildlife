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
      className="relative w-full min-h-[72vh] sm:min-h-[80vh] md:min-h-[85vh] flex flex-col justify-center overflow-hidden select-none bg-[#071D12] pt-8 sm:pt-12 md:pt-14 pb-24 sm:pb-28"
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
                className="w-full h-full object-cover object-center scale-105"
              >
                <source src={scene.videoUrl} type="video/webm" />
                {scene.fallbackVideoUrl && (
                  <source src={scene.fallbackVideoUrl} type="video/webm" />
                )}
              </video>
            </div>
          );
        })}

        {/* Cinematic Darkness Vignette Overlays for Maximum Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#05140C]/90 via-[#071D12]/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071D12] via-transparent to-[#05140C]/60 z-10" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#071D12] to-transparent z-10 pointer-events-none" />
      </div>

      {/* 2. Hero Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 sm:pt-12">
        <div className="max-w-3xl">
          
          {/* Top Odia Tagline matching 1st pic */}
          <div className="text-xl sm:text-2xl md:text-3xl font-odia font-bold text-[#C8A96B] tracking-wide mb-3 drop-shadow-md">
            {language === 'or' ? (t('hero.odiaTagline') || 'WHERE THE WILD FINDS IT\'S HOME') : (t('hero.odiaTagline') || 'ଯେଉଁଠି ବନ୍ୟଜୀବନ ପାଏ ଆଶ୍ରୟ')}
          </div>

          {/* Editorial Grand Typography matching 1st pic */}
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] tracking-tight leading-[1.04] text-[#F5F4EA] drop-shadow-2xl mb-5">
            {language === 'en' ? (
              <>
                WHERE THE <br />
                WILD <br />
                <span className="text-[#C8A96B] font-editorial italic font-normal tracking-normal drop-shadow-lg">
                  FINDS IT'S HOME
                </span>
              </>
            ) : (
              <>
                {t('hero.englishHeadingLine1')} <br />
                <span className="text-[#C8A96B] font-editorial italic font-normal tracking-normal drop-shadow-lg">
                  {t('hero.englishHeadingLine2')}
                </span>
              </>
            )}
          </h1>

          {/* Dual Description Paragraphs matching 1st pic */}
          <p className="text-base sm:text-lg md:text-xl text-[#F5F4EA]/90 max-w-2xl font-light leading-relaxed mb-3 drop-shadow">
            {t('hero.subtitle')}
          </p>
          <p className="text-xs sm:text-sm md:text-[15px] text-[#A6C6AF] max-w-2xl font-normal leading-relaxed mb-6 drop-shadow-sm">
            {t('hero.shortIntro')}
          </p>

          {/* Call-To-Action Button Suite */}
          <div className="flex flex-wrap items-center gap-3.5 mb-10">
            <button
              onClick={onExploreClick}
              className="btn-accent px-6 sm:px-8 py-3.5 rounded-xl text-xs sm:text-sm tracking-wider uppercase inline-flex items-center gap-2.5 shadow-xl group cursor-pointer"
            >
              <span>{t('hero.exploreWildlife')}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <a
              href="#interactive-map"
              onClick={(e) => {
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
                className={`relative overflow-hidden px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
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
            className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
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
            className="p-1.5 rounded-lg bg-[#123D2B]/80 text-[#F5F4EA] hover:text-[#C8A96B] hover:bg-[#1B6537] transition-colors cursor-pointer"
            title={isPlaying ? "Pause Video" : "Play Video"}
            aria-label="Play or Pause Video"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg bg-[#123D2B]/80 text-[#F5F4EA] hover:text-[#C8A96B] hover:bg-[#1B6537] transition-colors cursor-pointer"
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
