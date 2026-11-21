import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Navigation,
  Compass,
  Layers,
  Sparkles,
  Tv,
  Eye,
  Maximize2,
  Minimize2,
  Radio,
  Plus,
  Minus,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Footprints
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function InteractiveMap({ markers = [], onSelectAnimalBySlug, onOpenLiveCam }) {
  const { t, getAnimalName } = useLanguage();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const sideVideoRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeMarker, setActiveMarker] = useState(markers && markers.length > 0 ? markers[0] : null);
  const [mapStyle, setMapStyle] = useState('illustrated'); // 'illustrated' (default, official map) | 'satellite'
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [isFullscreenMap, setIsFullscreenMap] = useState(false);

  // Exact center of Nandankanan's animal enclosures (for satellite mode)
  const NANDANKANAN_CENTER = [20.4020, 85.8190];
  // Illustrated Map bounds: 1024 x 526
  const ILLUSTRATED_BOUNDS = [[0, 0], [526, 1024]];

  const categories = [
    { key: 'all', label: t('map.categories.all') || 'All Sanctuary Highlights' },
    { key: 'safari_zone', label: t('map.categories.safari_zone') || '🐅 Safari Zones' },
    { key: 'animal_habitat', label: t('map.categories.animal_habitat') || '🐾 Enclosures' },
    { key: 'water_body', label: t('map.categories.water_body') || '🌊 Kanjia Lake' },
    { key: 'visitor_facility', label: t('map.categories.visitor_facility') || '🏛️ Facilities & Rides' }
  ];

  // Satellite tile layer
  const SATELLITE_TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  const SATELLITE_ATTRIBUTION = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP | Nandankanan GIS';

  // Set initial active marker when markers load
  useEffect(() => {
    if (!activeMarker && markers && markers.length > 0) {
      setActiveMarker(markers[0]);
    }
  }, [markers]);

  // Focus on a particular animal: zooms in to show enclosure & surroundings
  const focusOnAnimal = useCallback((marker) => {
    if (!marker || !mapInstanceRef.current) return;
    setActiveMarker(marker);
    setIsPlaying(true);
    setIsZoomedIn(true);

    const isIllustrated = (mapStyle === 'illustrated');
    if (isIllustrated) {
      const markerPosition = [
        marker.map_y !== undefined ? marker.map_y : 260,
        marker.map_x !== undefined ? marker.map_x : 500
      ];
      mapInstanceRef.current.setView(markerPosition, 1.25, { animate: true, duration: 1.0 });
    } else {
      mapInstanceRef.current.setView([marker.latitude, marker.longitude], 17, { animate: true, duration: 1.0 });
    }
  }, [mapStyle]);

  // Render Markers on Map
  const renderMarkers = useCallback((map, markersGroup, isIllustrated) => {
    markersGroup.clearLayers();

    const filtered = markers.filter(
      (m) => selectedCategory === 'all' || m.category === selectedCategory
    );

    filtered.forEach((marker) => {
      const isSelected = activeMarker && activeMarker.id === marker.id;
      const animalPhoto = marker.photo_url || '/images/royal_bengal_tiger.jpg';
      const animalEmoji = marker.emoji || '🐾';
      const animalName = getAnimalName(marker) || marker.animal_name || marker.title;

      let borderColor = '#C8A96B'; // Gold
      let glowColor = 'rgba(200, 169, 107, 0.6)';
      if (marker.category === 'safari_zone') {
        borderColor = '#F59E0B'; // Amber
        glowColor = 'rgba(245, 158, 11, 0.7)';
      } else if (marker.category === 'water_body') {
        borderColor = '#38BDF8'; // Sky
        glowColor = 'rgba(56, 189, 248, 0.65)';
      } else if (marker.category === 'visitor_facility') {
        borderColor = '#10B981'; // Emerald
        glowColor = 'rgba(16, 185, 129, 0.6)';
      }

      // Jewel Pin
      const customIcon = L.divIcon({
        className: 'custom-animal-marker',
        html: `
          <div class="relative group cursor-pointer" style="transform: translate(-50%, -50%);">
            <div class="relative w-12 h-12 rounded-full flex items-center justify-center p-0.5 transition-all duration-300 ${
              isSelected ? 'scale-125 z-30' : 'hover:scale-115 z-20'
            }" style="
              background: ${isSelected ? '#FFFFFF' : 'rgba(7, 29, 18, 0.95)'};
              border: 2.5px solid ${isSelected ? '#C8A96B' : borderColor};
              box-shadow: 0 4px 18px ${glowColor}, 0 0 ${isSelected ? '22px #C8A96B' : '10px ' + borderColor};
            ">
              <div class="w-full h-full rounded-full overflow-hidden bg-forest-950 flex items-center justify-center relative">
                ${
                  marker.photo_url 
                    ? `<img src="${animalPhoto}" alt="${animalName}" class="w-full h-full object-cover filter brightness-105" />`
                    : `<span class="text-lg">${animalEmoji}</span>`
                }
                ${
                  isSelected 
                    ? `<span class="absolute inset-0 bg-[#C8A96B]/25 animate-pulse"></span>` 
                    : ''
                }
              </div>

              <!-- Live Indicator Dot -->
              <span class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white flex items-center justify-center shadow-md">
                <span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              </span>
            </div>

            <!-- Floating Label Tag -->
            <div class="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase transition-all duration-200 pointer-events-none shadow-xl ${
              isSelected 
                ? 'bg-[#C8A96B] text-[#071D12] font-black border border-white scale-105' 
                : 'bg-[#071D12]/95 text-[#F5F4EA] border border-[#26734D]/60'
            }">
              ${animalName}
            </div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      });

      const position = isIllustrated
        ? [
            marker.map_y !== undefined ? marker.map_y : 260,
            marker.map_x !== undefined ? marker.map_x : 500
          ]
        : [marker.latitude, marker.longitude];

      const leafletMarker = L.marker(position, { icon: customIcon });

      leafletMarker.on('click', () => {
        focusOnAnimal(marker);
      });

      markersGroup.addLayer(leafletMarker);
    });
  }, [selectedCategory, activeMarker, focusOnAnimal, getAnimalName]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    let map;
    const isIllustrated = (mapStyle === 'illustrated');

    if (isIllustrated) {
      map = L.map(mapContainerRef.current, {
        crs: L.CRS.Simple,
        minZoom: -0.75,
        maxZoom: 2.5,
        zoomSnap: 0.25,
        scrollWheelZoom: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        zoomControl: false,
        attributionControl: false,
        maxBounds: [[-100, -100], [626, 1124]],
        maxBoundsViscosity: 0.7
      });

      L.imageOverlay('/images/nandankanan_zoo_map.jpg', ILLUSTRATED_BOUNDS).addTo(map);
      map.fitBounds(ILLUSTRATED_BOUNDS, { padding: [10, 10] });
    } else {
      map = L.map(mapContainerRef.current, {
        center: NANDANKANAN_CENTER,
        zoom: 15,
        minZoom: 11,
        maxZoom: 19,
        scrollWheelZoom: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer(SATELLITE_TILE_URL, {
        attribution: SATELLITE_ATTRIBUTION,
        maxZoom: 19
      }).addTo(map);
    }

    mapInstanceRef.current = map;
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    renderMarkers(map, markersGroup, isIllustrated);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapStyle, selectedCategory, renderMarkers]);

  // Zoom and Pan Handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  // Reset View to See ALL Animals
  const handleShowAllAnimals = () => {
    if (!mapInstanceRef.current) return;
    setIsZoomedIn(false);
    if (mapStyle === 'illustrated') {
      mapInstanceRef.current.fitBounds(ILLUSTRATED_BOUNDS, { animate: true, padding: [10, 10] });
    } else {
      mapInstanceRef.current.setView(NANDANKANAN_CENTER, 15, { animate: true });
    }
  };

  const toggleSideVideoPlay = () => {
    if (!sideVideoRef.current) return;
    if (isPlaying) {
      sideVideoRef.current.pause();
      setIsPlaying(false);
    } else {
      sideVideoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section id="interactive-map" className="pt-10 sm:pt-12 lg:pt-14 pb-10 sm:pb-12 lg:pb-14 bg-[#071D12] text-[#F5F4EA] relative overflow-hidden">

      {/* Top Subtle Golden Forest Horizon Separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C8A96B]/25 to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-[#05140C]/60 to-transparent pointer-events-none" />

      {/* Background Ambience */}
      <div className="absolute top-10 right-0 w-96 h-96 bg-[#C8A96B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-[#26734D]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B2A1A] border border-[#C8A96B]/40 mb-3 shadow-md">
              <Compass className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C8A96B]">
                {t('map.badge')}
              </span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-5xl tracking-wide text-[#F5F4EA]">
              {t('map.heading').includes('ON THE ZOO MAP') ? (
                <>
                  {t('map.heading').replace('ON THE ZOO MAP', '')} <span className="text-[#C8A96B]">ON THE ZOO MAP</span>
                </>
              ) : (
                t('map.heading')
              )}
            </h2>

            <p className="mt-3 text-[#F5F4EA]/80 text-sm sm:text-base max-w-2xl font-light">
              {t('map.description')}
            </p>
          </div>

          {/* Map Controls: View Toggle & Show All Animals Button (HIGH VISIBILITY GUARANTEED) */}
          <div className="flex flex-wrap items-center gap-3 relative z-30">
            <button
              onClick={() => setMapStyle(mapStyle === 'illustrated' ? 'satellite' : 'illustrated')}
              className="btn-map-control flex items-center gap-2"
              title="Toggle between Illustrated Guide Map and Satellite View"
              aria-label="Toggle Map View"
            >
              <Layers className="w-4 h-4 text-[#C8A96B]" />
              <span>{mapStyle === 'illustrated' ? t('map.switchToSatellite') : t('map.illustratedMap')}</span>
            </button>

            <button
              onClick={handleShowAllAnimals}
              className="btn-map-control-accent flex items-center gap-1.5"
              title="Zoom out to see all animals across the full park"
              aria-label="Show All Animals"
            >
              <Navigation className="w-4 h-4" />
              <span>{t('map.showAllAnimals')}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills (Fixed Contrast & Click States) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all shadow-md ${
                selectedCategory === cat.key
                  ? 'bg-[#C8A96B] text-[#071D12] border border-[#D4B87A] shadow-[#C8A96B]/30'
                  : 'bg-[#0B2A1A] text-[#F5F4EA]/90 hover:bg-[#123D2B] border border-[#26734D]/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Quick Animal Jump Strip (All Animals) */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[11px] font-bold text-[#C8A96B] uppercase tracking-widest shrink-0 flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('map.selectAnimal')}</span>
          </span>
          {markers.map((m) => {
            const isCurrent = activeMarker && activeMarker.id === m.id;
            const displayName = getAnimalName(m) || m.animal_name || m.title;
            return (
              <button
                key={m.id}
                onClick={() => focusOnAnimal(m)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all shrink-0 shadow-sm ${
                  isCurrent
                    ? 'bg-[#C8A96B] text-[#071D12] font-black ring-2 ring-[#C8A96B] scale-105 shadow-md shadow-[#C8A96B]/30'
                    : 'bg-[#0B2A1A] border border-[#26734D]/60 hover:border-[#C8A96B]/60 text-[#F5F4EA]/90 hover:text-white'
                }`}
              >
                <span>{m.emoji || '🐾'}</span>
                <span>{displayName.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Main Grid: Illustrated Map Box (8 Cols) + Live Video Feed Panel (4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Map View Box (Span 7-8 Cols) */}
          <div className={`lg:col-span-7 xl:col-span-8 relative rounded-3xl overflow-hidden border border-[#26734D]/50 bg-[#071810] shadow-2xl transition-all ${
            isFullscreenMap ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl' : ''
          }`}>

            {/* Movable Leaflet Container */}
            <div
              ref={mapContainerRef}
              className="w-full h-[380px] sm:h-[500px] md:h-[620px] z-10 map-canvas-interactive"
              style={{ background: '#0B2419' }}
            />

            {/* Top Navigation & Status Pill */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none bg-[#071D12]/92 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#C8A96B]/40 text-xs text-[#F5F4EA] flex items-center gap-2 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[#C8A96B] font-bold text-xs">
                {activeMarker ? `${t('map.enclosurePrefix')} ${getAnimalName(activeMarker) || activeMarker.animal_name || activeMarker.title}` : t('map.allExhibits')}
              </span>
              <span className="text-[10px] text-[#A7D7A9] hidden sm:inline">| {t('map.clickHint')}</span>
            </div>

            {/* Top Right Controls & Crest */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              {isZoomedIn && (
                <button
                  onClick={handleShowAllAnimals}
                  className="btn-map-control-accent text-xs px-3 py-1.5 shadow-xl animate-fadeIn"
                  title="Show full park map"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{t('map.showEntireMap')}</span>
                </button>
              )}
              
              <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-xl border border-black/10 flex items-center gap-1.5 pointer-events-auto">
                <img 
                  src="/images/nandankanan_official_logo.png" 
                  alt="Nandankanan Official Logo" 
                  className="h-7 sm:h-8 w-auto object-contain"
                />
              </div>
            </div>

            {/* Floating Sleek Glass Controls (Bottom Right) */}
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-[#071D12]/95 backdrop-blur-md p-1.5 rounded-2xl border border-[#C8A96B]/40 shadow-2xl">
              <button
                onClick={handleZoomIn}
                className="p-2 rounded-xl bg-[#0B2A1A] hover:bg-[#123D2B] text-[#F5F4EA] hover:text-[#C8A96B] transition-colors shadow-sm"
                title="Zoom In"
                aria-label="Zoom in"
              >
                <Plus className="w-4 h-4" />
              </button>

              <button
                onClick={handleZoomOut}
                className="p-2 rounded-xl bg-[#0B2A1A] hover:bg-[#123D2B] text-[#F5F4EA] hover:text-[#C8A96B] transition-colors shadow-sm"
                title="Zoom Out"
                aria-label="Zoom out"
              >
                <Minus className="w-4 h-4" />
              </button>

              <button
                onClick={handleShowAllAnimals}
                className="p-2 rounded-xl bg-[#0B2A1A] hover:bg-[#123D2B] text-[#C8A96B] transition-colors shadow-sm"
                title="View All Animals (Zoom Out)"
                aria-label="View All Animals"
              >
                <Navigation className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsFullscreenMap(!isFullscreenMap)}
                className="p-2 rounded-xl bg-[#0B2A1A] hover:bg-[#123D2B] text-[#C8A96B] transition-colors shadow-sm"
                title={isFullscreenMap ? "Exit Fullscreen" : "Fullscreen Map"}
                aria-label="Toggle Fullscreen"
              >
                {isFullscreenMap ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Bottom Left Legend */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-3 bg-[#071D12]/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-[11px] text-[#F5F4EA]/90 shadow-xl">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
                <span>Safaris</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
                <span>Enclosures</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm" />
                <span>Kanjia Lake</span>
              </span>
            </div>
          </div>

          {/* Right Cols: Active Animal Live Video Stream Card & "The Place Around It" */}
          <div className="lg:col-span-5 xl:col-span-4 bg-[#0B2A1A]/95 border border-[#26734D]/60 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between min-h-auto lg:min-h-[520px] xl:min-h-[620px]">
            {activeMarker ? (
              <div className="animate-fadeIn flex flex-col justify-between h-full">
                <div>
                  {/* LIVE VIDEO STREAM FOR SELECTED ANIMAL */}
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-4 border border-[#C8A96B]/50 bg-black shadow-2xl group">
                    <video
                      ref={sideVideoRef}
                      key={activeMarker.id + (activeMarker.stream_url || '')}
                      src={activeMarker.stream_url || '/videos/tiger_walking_1080p.webm'}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={activeMarker.stream_url || '/videos/tiger_walking_1080p.webm'} type="video/webm" />
                    </video>

                    {/* Top Status Overlays */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-600/95 text-white flex items-center gap-1.5 shadow-lg shadow-red-600/50">
                        <span className="w-2 h-2 rounded-full bg-white live-indicator" />
                        LIVE STREAM
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#071D12]/80 text-[9px] uppercase tracking-wider text-[#C8A96B] border border-[#C8A96B]/30 backdrop-blur-md">
                        DEMO FEED
                      </span>
                    </div>

                    {/* Top Right Controls: Mute/Unmute & Expand Modal */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-1.5 rounded-lg border backdrop-blur-md transition-all shadow-md ${!isMuted
                            ? 'bg-emerald-600/90 text-white border-emerald-400'
                            : 'bg-[#071D12]/80 hover:bg-[#071D12] border-[#C8A96B]/30 text-[#C8A96B]'
                          }`}
                        title={isMuted ? "Unmute Enclosure Sound" : "Mute Sound"}
                        aria-label="Toggle Enclosure Audio"
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                      </button>

                      <button
                        onClick={toggleSideVideoPlay}
                        className="p-1.5 rounded-lg bg-[#071D12]/80 hover:bg-[#071D12] border border-[#C8A96B]/30 text-[#C8A96B] transition-all shadow-md"
                        title={isPlaying ? "Pause Stream" : "Play Stream"}
                        aria-label="Play or Pause Stream"
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => onOpenLiveCam && onOpenLiveCam(activeMarker)}
                        className="p-1.5 rounded-lg bg-[#071D12]/80 hover:bg-[#071D12] border border-[#C8A96B]/30 text-[#C8A96B] transition-all shadow-md"
                        title="Open Fullscreen Cinema Live Modal"
                        aria-label="Open Fullscreen Live Modal"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom Telemetry Bar */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[#F5F4EA] z-10 bg-[#071D12]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px]">
                      <span className="flex items-center gap-1 text-[#C8A96B] font-semibold truncate">
                        <Radio className="w-3 h-3 text-red-500 shrink-0 animate-pulse" />
                        <span className="truncate">{getAnimalName(activeMarker) || activeMarker.animal_name || activeMarker.title}</span>
                      </span>
                      <span className="font-mono text-emerald-400 shrink-0 text-[9px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Live Feed Active
                      </span>
                    </div>
                  </div>

                  {/* Header info */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#C8A96B]/20 text-[#C8A96B] border border-[#C8A96B]/30">
                      {activeMarker.badge_text || activeMarker.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-[#A7D7A9] font-mono">
                      Grid Exhibit #{activeMarker.id}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl sm:text-2xl text-[#F5F4EA] mb-1">
                    {getAnimalName(activeMarker) || activeMarker.title}
                  </h3>

                  <p className="text-xs text-[#F5F4EA]/80 leading-relaxed mb-3 line-clamp-2">
                    {activeMarker.description}
                  </p>

                  {/* "THE PLACE AROUND IT" Dedicated Geographic Context Card */}
                  <div className="p-3.5 rounded-2xl bg-[#071D12]/80 border border-[#C8A96B]/25 space-y-2 text-xs mb-4">
                    <div className="flex items-center gap-1.5 text-[#C8A96B] font-bold uppercase tracking-wider text-[10px]">
                      <MapPin className="w-3.5 h-3.5 text-[#C8A96B]" />
                      <span>The Place Around This Habitat:</span>
                    </div>

                    <p className="text-[11px] text-[#F5F4EA]/90 leading-relaxed font-light">
                      {activeMarker.surrounding_place || `Natural forested sanctuary zone surrounded by Sal woodlands, water moats, and visitor walking trails.`}
                    </p>

                    {activeMarker.nearby_landmarks && (
                      <div className="pt-2 border-t border-white/10 flex items-start gap-1.5 text-[10px] text-[#A7D7A9]">
                        <Footprints className="w-3 h-3 text-[#C8A96B] shrink-0 mt-0.5" />
                        <span><strong>Nearby Landmarks:</strong> {activeMarker.nearby_landmarks}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions (UNIFIED BUTTON STYLING) */}
                <div className="space-y-2.5 pt-1">
                  <button
                    onClick={() => onOpenLiveCam && onOpenLiveCam(activeMarker)}
                    className="w-full py-3 rounded-xl btn-accent font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 group"
                  >
                    <Tv className="w-4 h-4 animate-pulse" />
                    <span>Watch Fullscreen Live Stream</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShowAllAnimals}
                      className="flex-1 py-2.5 rounded-xl btn-secondary text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 text-center"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#C8A96B]" />
                      <span>{t('map.showAllAnimals')}</span>
                    </button>

                    {activeMarker.animal_slug && (
                      <button
                        onClick={() => {
                          if (onSelectAnimalBySlug) onSelectAnimalBySlug(activeMarker.animal_slug);
                          const el = document.getElementById('explore-animals');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="flex-1 py-2.5 rounded-xl btn-primary text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 text-center"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#C8A96B]" />
                        <span>Species Profile</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full my-auto py-12">
                <div className="w-16 h-16 rounded-2xl bg-[#071D12] border border-[#C8A96B]/30 flex items-center justify-center text-[#C8A96B] mb-4 shadow-inner">
                  <Compass className="w-8 h-8" />
                </div>
                <h4 className="font-display font-bold text-lg text-[#F5F4EA]">
                  Select Any Animal on Map
                </h4>
                <p className="mt-2 text-xs text-[#F5F4EA]/70 max-w-xs leading-relaxed">
                  Every animal enclosure on the illustrated map is marked. Click any animal to immediately start watching its live video stream and zoom in to explore the place around it.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </section>
  );
}
