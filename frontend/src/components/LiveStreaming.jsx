import React, { useState, useRef, useEffect } from 'react';
import { 
  Tv, 
  Eye, 
  Play, 
  Radio, 
  MapPin, 
  Sparkles,
  Clock,
  Lock,
  Signal,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LiveCameraPlayer from './LiveCameraPlayer';
import { subscriptionManager } from '../utils/subscriptionManager';
import Realistic3DIcon from './reactions/Realistic3DIcon';

export default function LiveStreaming({ 
  cameras, 
  activeModalCamera: externalActiveModalCamera, 
  setActiveModalCamera: externalSetActiveModalCamera 
}) {
  const { t, getAnimalName } = useLanguage();
  const [internalActiveModalCamera, setInternalActiveModalCamera] = useState(null);
  const activeModalCamera = externalActiveModalCamera !== undefined ? externalActiveModalCamera : internalActiveModalCamera;
  const setActiveModalCamera = externalSetActiveModalCamera || setInternalActiveModalCamera;

  // Active hover preview card ID
  const [hoveredCardId, setHoveredCardId] = useState(null);
  // Refs for each card video element
  const videoRefs = useRef({});

  // Resolve active modal animal to ensure full camera data
  const resolvedModalAnimal = React.useMemo(() => {
    if (!activeModalCamera) return null;
    const match = cameras.find(
      (c) => c.id === activeModalCamera.id || 
             c.animal_name?.toLowerCase() === activeModalCamera.animal_name?.toLowerCase() ||
             c.slug === activeModalCamera.slug
    );
    return match || activeModalCamera;
  }, [activeModalCamera, cameras]);

  // Deep linking and URL hash routing for individual animal camera page
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#live/')) {
        const slug = hash.replace('#live/', '').trim().toLowerCase();
        const found = cameras.find(
          (c) => c.slug === slug || 
                 c.animal_name?.toLowerCase().replace(/\s+/g, '-') === slug ||
                 c.id?.toString() === slug
        );
        if (found) {
          setActiveModalCamera(found);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [cameras]);

  // Open the individual animal live camera page
  const handleOpenLiveModal = (camera) => {
    // Pause all card previews
    Object.values(videoRefs.current).forEach((v) => {
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    });
    setHoveredCardId(null);

    setActiveModalCamera(camera);
    if (camera?.slug) {
      window.history.replaceState(null, '', `#live/${camera.slug}`);
    }
  };

  const handleCloseModal = () => {
    setActiveModalCamera(null);
    if (window.location.hash.startsWith('#live/')) {
      window.history.replaceState(null, '', '#live-wildlife');
    }
  };

  // Switch animal inside live camera player
  const handleSelectAnimalFromPlayer = (newAnimal) => {
    setActiveModalCamera(newAnimal);
    if (newAnimal?.slug) {
      window.history.replaceState(null, '', `#live/${newAnimal.slug}`);
    }
  };

  // Hover start on animal card
  const handleCardMouseEnter = (camId) => {
    setHoveredCardId(camId);

    // Pause all other card video previews
    Object.keys(videoRefs.current).forEach((key) => {
      const v = videoRefs.current[key];
      if (v && Number(key) !== camId) {
        v.pause();
        v.currentTime = 0;
      }
    });

    // Play target video preview
    const activeVideo = videoRefs.current[camId];
    if (activeVideo) {
      const playPromise = activeVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  };

  // Hover end on animal card
  const handleCardMouseLeave = (camId) => {
    const activeVideo = videoRefs.current[camId];
    if (activeVideo) {
      activeVideo.pause();
      activeVideo.currentTime = 0;
    }
    setHoveredCardId(null);
  };

  // Mobile / touch device click-based preview interaction
  const handleCardTap = (camera) => {
    if (hoveredCardId === camera.id) {
      // If already previewing, clicking the preview area opens the live stream page
      handleOpenLiveModal(camera);
    } else {
      // First tap activates the video preview for this card
      handleCardMouseEnter(camera.id);
    }
  };

  return (
    <section id="live-wildlife" className="pt-6 sm:pt-8 lg:pt-10 pb-10 sm:pb-12 lg:pb-14 bg-[#071810] text-ivory-50 relative overflow-hidden scroll-mt-28">

      
      {/* Top Subtle Forest Mist Horizon Divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C8A96B]/25 to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#071D12]/50 to-transparent pointer-events-none" />

      {/* Background Ambience Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-forest-800/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge mb-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 live-indicator" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-300">
                Continuous Stream Network
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-wide text-ivory-50">
              THE WILD, <span className="text-gold-400">LIVE</span>
            </h2>
            <p className="mt-2.5 text-ivory-200/80 max-w-xl text-sm sm:text-base font-light">
              Watch real-time animal observation feeds from across Nandankanan’s 437-hectare forest enclosures and sanctuary wetlands.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-forest-900/80 border border-gold-500/25 rounded-xl px-4 py-2 flex items-center gap-2.5 text-xs text-ivory-200 backdrop-blur-md shadow-sm">
              <Signal className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="font-medium">{cameras?.length || 11} High-Definition Habitat Feeds Active</span>
            </div>

            <div className="bg-[#14532D]/80 border border-[#C8A96B]/50 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-[#C8A96B] font-bold font-mono backdrop-blur-md shadow-lg shadow-[#C8A96B]/20">
              <Sparkles className="w-4 h-4 text-[#C8A96B]" />
              <span>5s Free Live Preview • Individual Passes Available (Tiger Subscribed)</span>
            </div>
          </div>
        </div>

        {/* Demo Mode Notice Banner */}
        <div className="mb-6 sm:mb-8 p-3.5 rounded-2xl bg-[#0B2A1A]/70 border border-gold-500/20 backdrop-blur-md flex items-start gap-3 shadow-md">
          <Info className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
          <div className="text-xs text-ivory-200/90 leading-relaxed">
            <strong className="text-gold-300 uppercase tracking-wider font-semibold">Sanctuary Live Feeds Note:</strong>{' '}
            Currently presenting synchronized high-fidelity habitat live video footage for visitor experience. 
            All cameras are engineered with standard RTSP/HLS architecture for seamless connection to Nandankanan’s on-ground streaming cameras.
          </div>
        </div>

        {/* 6 Camera Cards Grid */}
        <div id="live-cameras-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto scroll-mt-28">

          {cameras.map((camera) => {
            const isPreviewing = hoveredCardId === camera.id;
            const primaryStream = camera.stream_url || camera.cameras?.[0]?.stream_url;

            return (
              <div
                key={camera.id}
                onMouseEnter={() => handleCardMouseEnter(camera.id)}
                onMouseLeave={() => handleCardMouseLeave(camera.id)}
                className={`group rounded-2xl bg-forest-900/80 border transition-all duration-500 overflow-hidden flex flex-col shadow-xl shadow-gold-950/20 hover:-translate-y-1.5 ${
                  isPreviewing
                    ? 'border-gold-400 shadow-2xl shadow-gold-500/30 ring-2 ring-gold-400/80'
                    : 'border-gold-500/60 hover:border-gold-400 hover:ring-2 hover:ring-gold-400/80 hover:shadow-2xl hover:shadow-gold-500/30'
                }`}
              >
                {/* Thumbnail & Video Preview Container */}
                <div 
                  className="relative aspect-video w-full overflow-hidden bg-forest-950 cursor-pointer"
                  onClick={() => handleCardTap(camera)}
                >
                  {/* Base Thumbnail Poster Fallback */}
                  <img
                    src={camera.thumbnail_url}
                    alt={camera.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Real-Time Continuous Live Video Stream */}
                  <video
                    ref={(el) => (videoRefs.current[camera.id] = el)}
                    src={primaryStream}
                    autoPlay
                    muted
                    loop
                    playsInline
                    disablePictureInPicture
                    controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-transparent pointer-events-none" />

                  {/* Live / Preview Status Badges */}
                  <div className="absolute top-2 left-2 flex flex-col items-start gap-1 z-10 pointer-events-none">
                    {isPreviewing ? (
                      /* Active Video Preview Indicator */
                      <span className="px-2 py-0.5 rounded-md text-[8.5px] font-bold tracking-widest uppercase flex items-center gap-1 bg-emerald-600/90 text-white backdrop-blur-md shadow-lg shadow-emerald-600/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-white live-indicator" />
                        LIVE PREVIEW
                      </span>
                    ) : (
                      /* Standard Live / Offline Status Badge */
                      <span className={`px-2 py-0.5 rounded-md text-[8.5px] font-bold tracking-widest uppercase flex items-center gap-1 ${
                        camera.status === 'LIVE'
                          ? 'bg-red-600/90 text-white backdrop-blur-md shadow-lg shadow-red-600/40'
                          : 'bg-zinc-700/80 text-zinc-300'
                      }`}>
                        {camera.status === 'LIVE' && <span className="w-1.5 h-1.5 rounded-full bg-white live-indicator" />}
                        {camera.status}
                      </span>
                    )}

                    {/* Individual Animal Subscription Status Badge */}
                    {subscriptionManager.isSubscribed(camera) && (
                      <span 
                        className="px-2 py-0.5 rounded-md bg-black/90 border border-[#C8A96B] text-[#F5F4EA] font-mono text-[9px] font-extrabold backdrop-blur-md uppercase tracking-wider shadow-md"
                        title={`VIP Unlimited Access — ${subscriptionManager.getSubscriptionPlanLabel(camera) || '3 Months Plan'}`}
                      >
                        <span className="text-[#C8A96B] mr-1">✦</span>
                        {(subscriptionManager.getSubscriptionPlanLabel(camera) || '3 Months Plan').toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Viewer Count */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-forest-950/80 backdrop-blur-md text-[9.5px] font-medium text-ivory-200 border border-forest-700/50 z-10 pointer-events-none">
                    <Eye className="w-3 h-3 text-gold-400" />
                    <span>{camera.viewer_count?.toLocaleString()} watching</span>
                  </div>

                  {/* Quick Play Overlay Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLiveModal(camera);
                    }}
                    className={`absolute inset-0 m-auto w-10 h-10 rounded-full bg-gradient-to-br from-gold-300 via-gold-500 to-gold-600 text-forest-950 flex items-center justify-center shadow-lg shadow-gold-500/50 ring-2 ring-gold-300/80 transition-all duration-300 cursor-pointer ${
                      isPreviewing 
                        ? 'opacity-90 scale-95 hover:scale-105 hover:opacity-100 z-10' 
                        : 'opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 z-10'
                    }`}
                    aria-label={`Watch live feed for ${camera.animal_name}`}
                    title={`Open full live camera page for ${camera.animal_name}`}
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center text-[10.5px] text-gold-400 font-medium mb-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gold-400/80" />
                        {camera.habitat_name}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-xl text-ivory-50 group-hover:text-gold-300 transition-colors flex items-center gap-2">
                      <span className="shrink-0 flex items-center justify-center">
                        {camera.iconKey ? (
                          <Realistic3DIcon iconKey={camera.iconKey} size={24} className="drop-shadow-sm" />

                        ) : (
                          <span>{camera.emoji || '🐾'}</span>
                        )}
                      </span>
                      <span>{getAnimalName ? getAnimalName({ name: camera.animal_name }) || camera.animal_name : camera.animal_name}</span>
                    </h3>

                    <p className="mt-1 text-xs text-ivory-200/70 line-clamp-2 leading-relaxed">
                      {camera.description || `Live observation stream observing ${camera.animal_name} in its naturalized sanctuary enclosure.`}
                    </p>
                  </div>

                  {/* Card Action Button */}
                  <div className="mt-3 pt-2.5 border-t border-forest-800/80 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-ivory-300 uppercase tracking-widest font-mono truncate">
                      {camera.camera_location}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenLiveModal(camera);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-forest-800 hover:bg-gold-500 text-ivory-50 hover:text-forest-950 font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1 border border-gold-500/30 hover:border-gold-400 shadow-md group-hover:shadow-gold-500/20 shrink-0 cursor-pointer"
                    >
                      <Tv className="w-3.5 h-3.5" />
                      <span>{t ? t('live.watchModal') || 'Watch Live' : 'Watch Live'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* =========================================================================
          DEDICATED INDIVIDUAL ANIMAL LIVE CAMERA PAGE / MODAL
          ========================================================================= */}
      {resolvedModalAnimal && (
        <LiveCameraPlayer
          animal={resolvedModalAnimal}
          camerasList={cameras}
          onSelectAnimal={handleSelectAnimalFromPlayer}
          onClose={handleCloseModal}
        />
      )}

    </section>
  );
}
