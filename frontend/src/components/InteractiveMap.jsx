import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Navigation,
  Compass,
  Layers,
  Flame,
  ShieldAlert,
  Sparkles,
  Trees,
  Activity,
  Tv,
  Eye,
  Maximize2,
  Minimize2,
  Info,
  Radio,
  ExternalLink,
  ChevronRight,
  Plus,
  Minus,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Map as MapIcon,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Footprints
} from 'lucide-react';

export default function InteractiveMap({ markers = [], onSelectAnimalBySlug, onOpenLiveCam }) {
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
    { key: 'all', label: 'All Sanctuary Highlights' },
    { key: 'safari_zone', label: '🐅 Safari Zones' },
    { key: 'animal_habitat', label: '🐾 Enclosures' },
    { key: 'water_body', label: '🌊 Kanjia Lake' },
    { key: 'visitor_facility', label: '🏛️ Facilities & Rides' }
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

  // Focus on a particular animal: zooms in to show the enclosure and the place around it, and autoplays stream
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
      // Zoom in to 1.25 to show the animal enclosure and the surrounding paths, trees, and nearby exhibits
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
      const animalName = marker.animal_name || marker.title;

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

      // Elegant, Glowing Jewel Pin
      const customIcon = L.divIcon({
        className: 'custom-animal-marker',
        html: `
          <div class="animal-map-pin ${isSelected ? 'active-pin' : ''}" style="
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            pointer-events: auto !important;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          ">
            <!-- Pulsing outer radar beacon -->
            <div style="
              position: absolute;
              top: -4px;
              left: 50%;
              transform: translateX(-50%);
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background: ${glowColor};
              filter: blur(5px);
              z-index: 1;
              animation: pulse 2.2s infinite ease-in-out;
            "></div>

            <!-- Glowing Jewel Avatar -->
            <div style="
              position: relative;
              z-index: 2;
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border: 2.5px solid ${borderColor};
              overflow: hidden;
              background: #0B2419;
              box-shadow: 0 4px 14px rgba(0, 0, 0, 0.8), 0 0 10px ${glowColor};
              transition: transform 0.3s ease;
            ">
              <img 
                src="${animalPhoto}" 
                alt="${animalName}" 
                style="width: 100%; height: 100%; object-fit: cover; display: block;"
              />
            </div>

            <!-- Sleek Glass Capsule Label -->
            <div style="
              position: relative;
              z-index: 3;
              margin-top: 3px;
              padding: 2px 7px;
              border-radius: 9999px;
              background: rgba(11, 36, 25, 0.95);
              backdrop-filter: blur(10px);
              border: 1px solid ${borderColor};
              color: #F5F4EA;
              font-size: 9.5px;
              font-weight: 700;
              letter-spacing: 0.02em;
              white-space: nowrap;
              box-shadow: 0 3px 10px rgba(0,0,0,0.7);
              display: flex;
              align-items: center;
              gap: 3.5px;
            ">
              <span>${animalEmoji}</span>
              <span>${animalName}</span>
            </div>

            <!-- Pin Stem Indicator -->
            <div style="
              width: 2px;
              height: 5px;
              background: ${borderColor};
              box-shadow: 0 2px 4px rgba(0,0,0,0.6);
            "></div>
          </div>
        `,
        iconSize: [120, 64],
        iconAnchor: [60, 62],
        popupAnchor: [0, -62]
      });

      // Target position: [y, x] in illustrated CRS.Simple; [lat, lon] in satellite mode
      const markerPosition = isIllustrated
        ? [marker.map_y !== undefined ? marker.map_y : 260, marker.map_x !== undefined ? marker.map_x : 500]
        : [marker.latitude, marker.longitude];

      const leafletMarker = L.marker(markerPosition, {
        icon: customIcon,
        bubblingMouseEvents: true
      });

      // Click Event on Marker: Select marker, zoom in to show the place around it, and start live video
      leafletMarker.on('click', () => {
        focusOnAnimal(marker);
      });

      markersGroup.addLayer(leafletMarker);
    });
  }, [markers, selectedCategory, activeMarker, focusOnAnimal]);

  // Initialize Map Instance (adapting to mapStyle)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up previous map if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    let map;
    const isIllustrated = (mapStyle === 'illustrated');

    if (isIllustrated) {
      // Illustrated Tourist Map using official illustrated zoo map
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
        maxBounds: [[-100, -100], [626, 1124]],
        maxBoundsViscosity: 0.7
      });

      // Overlay the official illustrated zoo map
      L.imageOverlay('/images/nandankanan_zoo_map.jpg', ILLUSTRATED_BOUNDS).addTo(map);
      map.fitBounds(ILLUSTRATED_BOUNDS, { padding: [10, 10] });
    } else {
      // Satellite Imagery Map
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
        zoomControl: false
      });

      L.tileLayer(SATELLITE_TILE_URL, {
        attribution: SATELLITE_ATTRIBUTION,
        maxZoom: 19
      }).addTo(map);
    }

    mapInstanceRef.current = map;
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    // Render Markers for this mode
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

  // Reset View to See ALL Animals Across Full Park
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
    <section id="interactive-map" className="py-20 sm:py-24 bg-forest-900 text-ivory-50 relative overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute top-10 right-0 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge mb-3">
              <Compass className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gold-300">
                Official Sanctuary Guide Map
              </span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-5xl tracking-wide text-ivory-50">
              EXPLORE ALL ANIMALS <span className="text-gold-400">ON THE ZOO MAP</span>
            </h2>

            <p className="mt-3 text-ivory-200/80 text-sm sm:text-base max-w-2xl font-light">
              See all animals across Nandankanan’s official tourist map.
              Click any animal to <strong>start its live stream video</strong> and <strong>zoom in to explore the place around its habitat</strong>.
            </p>
          </div>

          {/* Map Controls: View Toggle & Show All Animals Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMapStyle(mapStyle === 'illustrated' ? 'satellite' : 'illustrated')}
              className="px-4 py-2.5 rounded-xl bg-forest-800/90 hover:bg-forest-700 text-ivory-100 border border-gold-500/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg backdrop-blur-md"
              title="Toggle between Illustrated Guide Map and Satellite View"
            >
              <Layers className="w-4 h-4 text-gold-400" />
              <span>{mapStyle === 'illustrated' ? "🛰️ Switch to Satellite" : "🗺️ Illustrated Zoo Map"}</span>
            </button>

            <button
              onClick={handleShowAllAnimals}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-forest-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg"
              title="Zoom out to see all animals across the full park"
            >
              <Navigation className="w-4 h-4" />
              <span>Show All Animals</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${selectedCategory === cat.key
                  ? 'bg-gold-500 text-forest-950 font-bold shadow-md shadow-gold-500/20'
                  : 'bg-forest-950/80 text-ivory-200 hover:bg-forest-800 border border-forest-700/60'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Quick Animal Jump Strip (All Animals) */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[11px] font-bold text-gold-400 uppercase tracking-widest shrink-0 flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Select Animal:</span>
          </span>
          {markers.map((m) => {
            const isCurrent = activeMarker && activeMarker.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => focusOnAnimal(m)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all shrink-0 ${isCurrent
                    ? 'bg-gold-500 text-forest-950 font-bold shadow-lg shadow-gold-500/30 ring-2 ring-gold-400 scale-105'
                    : 'bg-forest-950/70 border border-forest-800 hover:border-gold-500/40 text-ivory-200 hover:text-white'
                  }`}
              >
                <span>{m.emoji || '🐾'}</span>
                <span>{m.animal_name || m.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Main Grid: Illustrated Map Box (8 Cols) + Live Video Feed Panel (4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Map View Box (Span 7-8 Cols) */}
          <div className={`lg:col-span-7 xl:col-span-8 relative rounded-3xl overflow-hidden zoo-map-frame bg-forest-950 transition-all ${isFullscreenMap ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl' : ''
            }`}>

            {/* Movable Leaflet Container */}
            <div
              ref={mapContainerRef}
              className="w-full h-[540px] sm:h-[640px] z-10 map-canvas-interactive zoo-map-container"
              style={{ background: '#0B2419' }}
            />

            {/* Top Navigation & Status Pill */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none bg-forest-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-gold-500/30 text-xs text-ivory-100 flex items-center gap-2 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-gold-300 font-semibold text-xs">
                {activeMarker ? `Enclosure: ${activeMarker.animal_name || activeMarker.title}` : 'All Sanctuary Exhibits'}
              </span>
              <span className="text-[10px] text-ivory-300 hidden sm:inline">| Click any animal to zoom into its habitat</span>
            </div>

            {/* Official Nandankanan Logo Badge (Top Right of Map) */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              {isZoomedIn && (
                <button
                  onClick={handleShowAllAnimals}
                  className="px-3.5 py-1.5 rounded-xl bg-forest-950/90 hover:bg-forest-900 border border-gold-400 text-gold-300 hover:text-gold-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xl backdrop-blur-md transition-all animate-fadeIn"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>🌐 Show Entire Zoo Map</span>
                </button>
              )}
              
              <div className="bg-white/95 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl shadow-xl border border-black/10 flex items-center gap-2 pointer-events-auto">
                <img 
                  src="/images/nandankanan_logo.png" 
                  alt="Nandankanan Official Logo" 
                  className="h-7 sm:h-9 w-auto object-contain"
                />
              </div>
            </div>

            {/* Floating Sleek Glass Controls (Bottom Right) */}
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-forest-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-gold-500/30 shadow-2xl">
              <button
                onClick={handleZoomIn}
                className="p-2 rounded-xl bg-forest-900/80 hover:bg-forest-800 text-ivory-100 hover:text-gold-400 transition-colors shadow-sm"
                title="Zoom In"
                aria-label="Zoom in"
              >
                <Plus className="w-4 h-4" />
              </button>

              <button
                onClick={handleZoomOut}
                className="p-2 rounded-xl bg-forest-900/80 hover:bg-forest-800 text-ivory-100 hover:text-gold-400 transition-colors shadow-sm"
                title="Zoom Out"
                aria-label="Zoom out"
              >
                <Minus className="w-4 h-4" />
              </button>

              <button
                onClick={handleShowAllAnimals}
                className="p-2 rounded-xl bg-forest-900/80 hover:bg-forest-800 text-gold-400 transition-colors shadow-sm"
                title="View All Animals (Zoom Out)"
                aria-label="View All Animals"
              >
                <Navigation className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsFullscreenMap(!isFullscreenMap)}
                className="p-2 rounded-xl bg-forest-900/80 hover:bg-forest-800 text-gold-400 transition-colors shadow-sm"
                title={isFullscreenMap ? "Exit Fullscreen" : "Fullscreen Map"}
                aria-label="Toggle Fullscreen"
              >
                {isFullscreenMap ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Bottom Left Legend */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-3 bg-forest-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-[11px] text-ivory-200">
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
          <div className="lg:col-span-5 xl:col-span-4 bg-forest-950/95 border border-gold-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between min-h-[540px] sm:min-h-[640px]">
            {activeMarker ? (
              <div className="animate-fadeIn flex flex-col justify-between h-full">
                <div>
                  {/* LIVE VIDEO STREAM FOR SELECTED ANIMAL */}
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-4 border border-gold-500/40 bg-black shadow-2xl group">
                    <video
                      ref={sideVideoRef}
                      key={activeMarker.id + (activeMarker.stream_url || '')}
                      src={activeMarker.stream_url || '/videos/tiger_walking_1080p.webm'}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      disablePictureInPicture
                      controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
                      className="w-full h-full object-cover"
                    />

                    {/* Top Status Overlays */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-600/95 text-white flex items-center gap-1.5 shadow-lg shadow-red-600/50">
                        <span className="w-2 h-2 rounded-full bg-white live-indicator" />
                        LIVE
                      </span>
                    </div>

                    {/* Top Right Controls: Mute/Unmute & Expand Modal */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-1.5 rounded-lg border backdrop-blur-md transition-all shadow-md ${!isMuted
                            ? 'bg-emerald-600/90 text-white border-emerald-400'
                            : 'bg-forest-950/80 hover:bg-forest-900 border-gold-500/30 text-gold-300'
                          }`}
                        title={isMuted ? "Unmute Enclosure Sound" : "Mute Sound"}
                        aria-label="Toggle Enclosure Audio"
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                      </button>

                      <button
                        onClick={toggleSideVideoPlay}
                        className="p-1.5 rounded-lg bg-forest-950/80 hover:bg-forest-900 border border-gold-500/30 text-gold-300 transition-all shadow-md"
                        title={isPlaying ? "Pause Stream" : "Play Stream"}
                        aria-label="Play or Pause Stream"
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => onOpenLiveCam && onOpenLiveCam(activeMarker)}
                        className="p-1.5 rounded-lg bg-forest-950/80 hover:bg-forest-900 border border-gold-500/30 text-gold-300 transition-all shadow-md"
                        title="Open Fullscreen Cinema Live Modal"
                        aria-label="Open Fullscreen Live Modal"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom Telemetry Bar */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-ivory-50 z-10 bg-forest-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px]">
                      <span className="flex items-center gap-1 text-gold-300 font-semibold truncate">
                        <Radio className="w-3 h-3 text-red-500 shrink-0 animate-pulse" />
                        <span className="truncate">{activeMarker.animal_name || activeMarker.title}</span>
                      </span>
                      <span className="font-mono text-emerald-400 shrink-0 text-[9px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Live Observation Active
                      </span>
                    </div>
                  </div>

                  {/* Header info */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold-500/20 text-gold-300 border border-gold-500/30">
                      {activeMarker.badge_text || activeMarker.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-ivory-300 font-mono">
                      Grid Exhibit #{activeMarker.id}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl sm:text-2xl text-ivory-50 mb-1">
                    {activeMarker.title}
                  </h3>

                  <p className="text-xs text-ivory-200/80 leading-relaxed mb-3 line-clamp-2">
                    {activeMarker.description}
                  </p>

                  {/* "THE PLACE AROUND IT" Dedicated Geographic Context Card */}
                  <div className="p-3.5 rounded-2xl bg-forest-900/90 border border-gold-500/25 space-y-2 text-xs mb-4">
                    <div className="flex items-center gap-1.5 text-gold-300 font-bold uppercase tracking-wider text-[10px]">
                      <MapPin className="w-3.5 h-3.5 text-gold-400" />
                      <span>The Place Around This Habitat:</span>
                    </div>

                    <p className="text-[11px] text-ivory-100/90 leading-relaxed font-light">
                      {activeMarker.surrounding_place || `Natural forested sanctuary zone surrounded by Sal woodlands, water moats, and visitor walking trails.`}
                    </p>

                    {activeMarker.nearby_landmarks && (
                      <div className="pt-2 border-t border-forest-800/80 flex items-start gap-1.5 text-[10px] text-ivory-300/80">
                        <Footprints className="w-3 h-3 text-gold-400 shrink-0 mt-0.5" />
                        <span><strong>Nearby Landmarks:</strong> {activeMarker.nearby_landmarks}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2.5 pt-1">
                  <button
                    onClick={() => onOpenLiveCam && onOpenLiveCam(activeMarker)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 group"
                  >
                    <Tv className="w-4 h-4 animate-pulse" />
                    <span>Watch Fullscreen Live Stream</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShowAllAnimals}
                      className="flex-1 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-ivory-200 hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-forest-700 transition-all text-center"
                    >
                      <Navigation className="w-3.5 h-3.5 text-gold-400" />
                      <span>Show All Animals</span>
                    </button>

                    {activeMarker.animal_slug && (
                      <button
                        onClick={() => {
                          if (onSelectAnimalBySlug) onSelectAnimalBySlug(activeMarker.animal_slug);
                          const el = document.getElementById('explore-animals');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-gold-300 hover:text-gold-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-gold-500/30 transition-all text-center"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Species Profile</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full my-auto py-12">
                <div className="w-16 h-16 rounded-2xl bg-forest-900 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-4 shadow-inner">
                  <Compass className="w-8 h-8" />
                </div>
                <h4 className="font-display font-bold text-lg text-ivory-100">
                  Select Any Animal on Map
                </h4>
                <p className="mt-2 text-xs text-ivory-300/70 max-w-xs leading-relaxed">
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
