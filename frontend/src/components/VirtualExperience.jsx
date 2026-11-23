import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles, 
  Eye, 
  Camera, 
  Layers, 
  RotateCw, 
  Play, 
  Tv, 
  X,
  ChevronLeft,
  ChevronRight,
  Headphones
} from 'lucide-react';
import { 
  playTigerRoar, 
  playLionRoar, 
  playElephantTrumpet, 
  playPeafowlCry, 
  playDeerCall, 
  playBearGrunt 
} from '../utils/audioSynthesizer';

export default function VirtualExperience() {
  const [activeTab, setActiveTab] = useState('360'); // '360' | 'sounds' | 'gallery'
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activeSound, setActiveSound] = useState(null);

  // 360 Viewer Canvas States
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentPanoIndex, setCurrentPanoIndex] = useState(0);

  const panoramas = [
    {
      title: "Sal & Teak Forest Canopy",
      subtitle: "Nandankanan Core Sanctuary Zone",
      src: "/images/sanctuary_forest.jpg",
      hotspots: [
        { label: "Tiger Safari Boundary", x: 30, y: 55 },
        { label: "Feeder Stream to Kanjia Lake", x: 75, y: 65 }
      ]
    },
    {
      title: "Lake Kanjia Shoreline & Wetlands",
      subtitle: "National Wetland Eco-Sanctuary (66 Hectares)",
      src: "/images/kanjia_lake.jpg",
      hotspots: [
        { label: "Waterbird Nesting Islets", x: 45, y: 48 },
        { label: "Boating Ghat & Lily Beds", x: 80, y: 62 }
      ]
    }
  ];

  // Draw 360 panorama on canvas with smooth wrap-around panning
  useEffect(() => {
    if (activeTab !== '360') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = panoramas[currentPanoIndex].src;

    let animId;

    const render = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 480;

      if (img.complete && img.naturalWidth > 0) {
        const aspect = img.naturalWidth / img.naturalHeight;
        const renderHeight = canvas.height * 1.3;
        const renderWidth = renderHeight * aspect;

        // Wrap around calculation
        let sx = (panOffset.x % renderWidth);
        if (sx > 0) sx -= renderWidth;

        ctx.drawImage(img, sx, -40, renderWidth, renderHeight);
        ctx.drawImage(img, sx + renderWidth, -40, renderWidth, renderHeight);
        if (sx + renderWidth < canvas.width) {
          ctx.drawImage(img, sx + renderWidth * 2, -40, renderWidth, renderHeight);
        }

        // Draw Interactive Hotspot Pins
        panoramas[currentPanoIndex].hotspots.forEach((spot) => {
          const pinX = ((spot.x * 12 + sx + renderWidth * 2) % canvas.width);
          const pinY = spot.y * 3.8;

          // Glowing radar pin
          ctx.beginPath();
          ctx.arc(pinX, pinY, 9, 0, Math.PI * 2);
          ctx.fillStyle = '#C8A96B';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(pinX, pinY, 15, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(200, 169, 107, 0.4)';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Label text
          ctx.fillStyle = '#FAF9F3';
          ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
          ctx.shadowBlur = 4;
          ctx.fillText(spot.label, pinX + 16, pinY + 4);
          ctx.shadowBlur = 0;
        });

      } else {
        // Fallback loading placeholder
        ctx.fillStyle = '#0B2419';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#C8A96B';
        ctx.font = '14px Plus Jakarta Sans';
        ctx.textAlign = 'center';
        ctx.fillText('Loading 360° Sanctuary Scene...', canvas.width / 2, canvas.height / 2);
      }
    };

    img.onload = render;
    render();

    // Auto subtle drift when not dragging
    const driftInterval = setInterval(() => {
      if (!isDragging) {
        setPanOffset((prev) => ({ ...prev, x: prev.x - 0.4 }));
      }
    }, 30);

    return () => {
      clearInterval(driftInterval);
      cancelAnimationFrame(animId);
    };
  }, [activeTab, panOffset, currentPanoIndex, isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    setPanOffset((prev) => ({ ...prev, x: prev.x + dx }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Bio-Acoustic Soundboard Animals
  const soundItems = [
    {
      id: 'tiger',
      name: 'Royal Bengal Tiger',
      action: playTigerRoar,
      frequency: '35 - 320 Hz',
      desc: 'Deep resonant territorial roar capable of propagating across 3 km of forest understory.'
    },
    {
      id: 'lion',
      name: 'Asiatic Lion',
      action: playLionRoar,
      frequency: '50 - 260 Hz',
      desc: 'Powerful pride bonding roar with low acoustic chest resonance.'
    },
    {
      id: 'elephant',
      name: 'Asian Elephant',
      action: playElephantTrumpet,
      frequency: '220 - 650 Hz',
      desc: 'Piercing trumpet call modulated through the nasal passages of the trunk.'
    },
    {
      id: 'peafowl',
      name: 'Indian Peafowl',
      action: playPeafowlCry,
      frequency: '680 - 1800 Hz',
      desc: 'Iconic monsoon mating cry and vigilant canopy predator alarm call.'
    },
    {
      id: 'deer',
      name: 'Spotted Deer',
      action: playDeerCall,
      frequency: '420 - 880 Hz',
      desc: 'High-frequency whistling alarm bark alerting the herd to approaching predators.'
    },
    {
      id: 'bear',
      name: 'Sloth Bear',
      action: playBearGrunt,
      frequency: '50 - 280 Hz',
      desc: 'Guttural rock cavern grunting vocalization when foraging for termite mounds.'
    }
  ];

  const handlePlaySound = (item) => {
    setActiveSound(item.id);
    item.action();
    setTimeout(() => setActiveSound(null), 2500);
  };

  // Gallery Photos
  const galleryPhotos = [
    {
      title: "Royal Bengal Tiger on Forest Prowl",
      category: "Big Cats",
      src: "/images/royal_bengal_tiger.jpg",
      location: "Tiger Safari Sector 1"
    },
    {
      title: "The Legendary White Tiger of Nandankanan",
      category: "Heritage",
      src: "/images/white_tiger.jpg?v=20261123",
      location: "White Tiger Heritage Habitat"
    },
    {
      title: "Monarch of the Gir Prides — Asiatic Lion",
      category: "Big Cats",
      src: "/images/asiatic_lion.jpg",
      location: "Lion Safari Ridge"
    },
    {
      title: "Asian Elephant Family at Bathing Troughs",
      category: "Herbivores",
      src: "/images/asian_elephant.jpg",
      location: "Elephant Care Center"
    },
    {
      title: "Gharial Basking on Kanjia Sandbank",
      category: "Reptiles",
      src: "/images/gharial.jpg",
      location: "Gharial Breeding Sanctuary"
    },
    {
      title: "Indian Pangolin Nocturnal Research",
      category: "Endangered",
      src: "/images/pangolin.jpg",
      location: "Pangolin Conservation Center"
    },
    {
      title: "Spotted Deer Herd in Dappled Sunlight",
      category: "Herbivores",
      src: "/images/spotted_deer.jpg",
      location: "Herbivore Safari Sector 2"
    },
    {
      title: "Monsoon Dance of the Indian Peafowl",
      category: "Avian",
      src: "/images/indian_peafowl.jpg",
      location: "Kanjia Lake Shoreline"
    },
    {
      title: "Kanjia Lake Wetland Sanctuary",
      category: "Wetland",
      src: "/images/kanjia_lake.jpg",
      location: "Wetland Eco-Zone"
    }
  ];

  return (
    <section id="virtual-experience" className="pt-10 sm:pt-12 lg:pt-14 pb-10 sm:pb-12 lg:pb-14 bg-forest-950 text-ivory-50 relative overflow-hidden">
      
      {/* Top Subtle Golden Forest Horizon Separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C8A96B]/25 to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-[#0B2A1A]/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge mb-3">
            <Compass className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gold-300">
              Sensory Sanctuary Portal
            </span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl tracking-wide text-ivory-50">
            VIRTUAL <span className="text-gold-400">WILDLIFE EXPERIENCE</span>
          </h2>

          <p className="mt-3 text-ivory-200/80 text-sm sm:text-base font-light">
            Step directly into the living ecosystem of Nandankanan through 360-degree habitat panoramas, 
            realistic bio-acoustic wildlife calls, and high-definition photography.
          </p>

          {/* Experience Mode Switcher Tabs */}
          <div className="mt-6 inline-flex max-w-full overflow-x-auto items-center p-1.5 rounded-2xl bg-forest-900 border border-gold-500/30">
            <button
              onClick={() => setActiveTab('360')}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === '360'
                  ? 'bg-gold-500 text-forest-950 shadow-md'
                  : 'text-ivory-200 hover:text-gold-300'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>360° Habitats</span>
            </button>

            <button
              onClick={() => setActiveTab('sounds')}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'sounds'
                  ? 'bg-gold-500 text-forest-950 shadow-md'
                  : 'text-ivory-200 hover:text-gold-300'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Animal Soundboard</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'gallery'
                  ? 'bg-gold-500 text-forest-950 shadow-md'
                  : 'text-ivory-200 hover:text-gold-300'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Photo Gallery</span>
            </button>
          </div>
        </div>

        {/* Tab 1: 360 Degree Panoramic Habitat Explorer */}
        {activeTab === '360' && (
          <div id="virtual-tour-viewer" className="animate-fadeIn scroll-mt-28">
            <div className="relative rounded-3xl overflow-hidden border border-gold-500/30 shadow-2xl bg-black cursor-grab active:cursor-grabbing">
              
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
                }}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
                }}
                onTouchEnd={handleMouseUp}
                className="w-full h-[480px] block select-none"
              />

              {/* Floating 360 Controls & Information Overlay */}
              <div className="absolute top-4 left-4 z-20 bg-forest-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-gold-500/30">
                <h4 className="font-display font-bold text-sm text-ivory-50">
                  {panoramas[currentPanoIndex].title}
                </h4>
                <p className="text-[11px] text-gold-400 font-mono">
                  {panoramas[currentPanoIndex].subtitle}
                </p>
              </div>

              {/* Drag instruction pill */}
              <div className="absolute bottom-4 left-4 z-20 bg-forest-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-ivory-200 flex items-center gap-2 pointer-events-none">
                <RotateCw className="w-3.5 h-3.5 text-gold-400 animate-spin" />
                <span>Click & drag or swipe to pan 360°</span>
              </div>

              {/* Panorama Scene Switcher (Bottom Right) */}
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
                {panoramas.map((p, idx) => (
                  <button
                    key={p.title}
                    onClick={() => setCurrentPanoIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition-all ${
                      currentPanoIndex === idx
                        ? 'bg-gold-500 text-forest-950 shadow-md font-bold'
                        : 'bg-forest-950/80 text-ivory-200 border border-gold-500/30 hover:bg-forest-900'
                    }`}
                  >
                    Scene {idx + 1}
                  </button>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Animal Bio-Acoustic Soundboard */}
        {activeTab === 'sounds' && (
          <div className="animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {soundItems.map((item) => {
                const isPlayingThis = activeSound === item.id;
                return (
                  <div
                    key={item.id}
                    className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                      isPlayingThis
                        ? 'bg-forest-900 border-gold-400 shadow-xl shadow-gold-500/20 -translate-y-1'
                        : 'bg-forest-900/60 border-forest-800/80 hover:border-gold-500/40 hover:bg-forest-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 bg-forest-950 px-2.5 py-1 rounded-md border border-forest-800">
                          {item.frequency}
                        </span>
                        {isPlayingThis && (
                          <span className="text-[10px] uppercase font-bold text-emerald-400 animate-pulse flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            Acoustic Playing
                          </span>
                        )}
                      </div>

                      <h4 className="font-display font-bold text-xl text-ivory-50 mb-2">
                        {item.name}
                      </h4>

                      <p className="text-xs text-ivory-200/80 leading-relaxed mb-6">
                        {item.desc}
                      </p>
                    </div>

                    {/* Sound Action Button */}
                    <button
                      onClick={() => handlePlaySound(item)}
                      className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
                        isPlayingThis
                          ? 'bg-gold-500 text-forest-950'
                          : 'bg-forest-800 text-gold-300 hover:bg-gold-500 hover:text-forest-950 border border-gold-500/30'
                      }`}
                    >
                      <Volume2 className={`w-4 h-4 ${isPlayingThis ? 'animate-bounce' : ''}`} />
                      <span>{isPlayingThis ? "Playing Vocalization..." : "Trigger Animal Sound"}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Curated Wildlife Photography Gallery */}
        {activeTab === 'gallery' && (
          <div className="animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryPhotos.map((photo, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-forest-900 border border-forest-800/80 hover:border-gold-500/50 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Photo Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-forest-900/90 text-gold-300 border border-gold-500/30 mb-1.5 inline-block">
                      {photo.category}
                    </span>
                    <h4 className="font-display font-bold text-base text-ivory-50 group-hover:text-gold-300 transition-colors">
                      {photo.title}
                    </h4>
                    <p className="text-[11px] text-ivory-300/80 flex items-center gap-1 mt-0.5 font-mono">
                      {photo.location}
                    </p>
                  </div>

                  {/* Expand Icon */}
                  <div className="absolute top-3 right-3 p-2 rounded-full bg-forest-950/70 text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox Modal for Photo Gallery */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/95 backdrop-blur-2xl animate-fadeIn cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-forest-900 border border-gold-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-4 bg-forest-950 border-b border-forest-800 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-ivory-50">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs text-gold-400 font-mono">
                  {selectedPhoto.location} • Nandankanan Wildlife Archives
                </p>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 rounded-lg bg-forest-800 text-ivory-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[75vh] bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
