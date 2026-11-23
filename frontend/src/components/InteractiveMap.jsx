import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import L from 'leaflet';
import ThreeZooMap from './ThreeZooMap';
import InteractiveMap3D from './InteractiveMap3D';
import { useLanguage } from '../context/LanguageContext';
import { INITIAL_ANIMALS } from '../data/mockData';
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
  Footprints,
  X,
  RotateCcw
} from 'lucide-react';

export default function InteractiveMap({ 
  markers = [], 
  onSelectAnimalBySlug, 
  onOpenLiveCam,
  activeMarkerProp = null
}) {
  const { t, getAnimalName } = useLanguage();
  const mapContainerRef = useRef(null);
  const fullscreenMapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const sideVideoRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeMarker, setActiveMarker] = useState(null);
  const [mapStyle, setMapStyle] = useState('3d'); // '3d' (Default Google Earth 3D) | 'illustrated' | 'satellite'
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [isFullscreenMap, setIsFullscreenMap] = useState(false);
  const [isDoubleScreen, setIsDoubleScreen] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isolateMarkerId, setIsolateMarkerId] = useState(null);
  const [focusTrigger, setFocusTrigger] = useState(0);

  // Exact center of Nandankanan's animal enclosures (for satellite mode)
  const NANDANKANAN_CENTER = [20.4020, 85.8190];
  // Illustrated Map bounds: 1024 x 571 (exact aspect ratio of real environment map)
  const ILLUSTRATED_BOUNDS = [[0, 0], [571, 1024]];

  const categories = [
    { key: 'all', label: '🌿 All 12 Species' },
    { key: 'safari_zone', label: (t && t('map.categories.safari_zone')) || '🐅 Safari Zones (5)' },
    { key: 'animal_habitat', label: (t && t('map.categories.animal_habitat')) || '🐾 Enclosures & Habitats (7)' }
  ];

  // Satellite tile layer
  const SATELLITE_TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  const SATELLITE_ATTRIBUTION = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP | Nandankanan GIS';

  // Find corresponding animal scientific record for comprehensive species identification
  const identifiedAnimal = activeMarker
    ? INITIAL_ANIMALS.find(
        (a) =>
          a.slug === activeMarker.animal_slug ||
          a.name.toLowerCase() === (activeMarker.animal_name || activeMarker.title).toLowerCase() ||
          ((activeMarker.animal_slug === 'peacock' || activeMarker.animal_name === 'Peacock') &&
            (a.slug === 'indian-peafowl' || a.name.toLowerCase().includes('peafowl'))) ||
          ((activeMarker.animal_slug === 'spotted-deer' || activeMarker.animal_name === 'Deer') &&
            (a.slug === 'spotted-deer' || a.name.toLowerCase().includes('deer'))) ||
          ((activeMarker.animal_slug === 'asian-elephant' || activeMarker.animal_name === 'Elephant') &&
            (a.slug === 'asian-elephant' || a.name.toLowerCase().includes('elephant'))) ||
          ((activeMarker.animal_slug === 'sloth-bear' || activeMarker.animal_name === 'Bear') &&
            (a.slug === 'sloth-bear' || a.name.toLowerCase().includes('bear')))
      )
    : null;

  // Focus on a particular animal: zooms in to show the enclosure and the place around it, and autoplays stream
  const focusOnAnimal = useCallback((marker, isolate = false) => {
    if (!marker) return;
    setActiveMarker(marker);
    setIsPlaying(true);
    setIsZoomedIn(true);

    if (isolate || marker._isolate) {
      setIsolateMarkerId(marker.id);
    } else {
      setIsolateMarkerId(null);
    }
    setFocusTrigger(Date.now());

    if (mapStyle !== '3d' && mapInstanceRef.current) {
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
    }
  }, [mapStyle]);

  // Synchronize external active marker triggered from Chatbot or external UI
  useEffect(() => {
    if (activeMarkerProp) {
      setMapStyle('3d');
      focusOnAnimal(activeMarkerProp, Boolean(activeMarkerProp._isolate));
    }
  }, [activeMarkerProp, focusOnAnimal]);

  // Listen for navigation & map click events to clear isolate mode (and switch style only if explicitly requested)
  useEffect(() => {
    const handleMapNavigation = (e) => {
      if (e?.detail?.style) {
        setMapStyle(e.detail.style);
      }
      setActiveMarker(null);
      setIsolateMarkerId(null);
    };
    window.addEventListener('start-zoo-map-orbit', handleMapNavigation);
    window.addEventListener('reset-zoo-map-view', handleMapNavigation);
    return () => {
      window.removeEventListener('start-zoo-map-orbit', handleMapNavigation);
      window.removeEventListener('reset-zoo-map-view', handleMapNavigation);
    };
  }, []);

  // Fullscreen escape key, scroll lock, and Leaflet resize
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreenMap) {
        setIsFullscreenMap(false);
      }
    };
    if (isFullscreenMap) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    if (mapInstanceRef.current) {
      const timer = setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 150);
      return () => clearTimeout(timer);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isFullscreenMap]);

  // Render Markers on Leaflet Map (for 2D modes)
  const renderMarkers = useCallback((map, markersGroup, isIllustrated) => {
    markersGroup.clearLayers();

    const filtered = markers.filter(
      (m) => {
        if (isolateMarkerId) return m.id === isolateMarkerId;
        return selectedCategory === 'all' || m.category === selectedCategory;
      }
    );

    filtered.forEach((marker) => {
      const isSelected = activeMarker && activeMarker.id === marker.id;
      const animalPhoto = marker.photo_url || '/images/royal_bengal_tiger.jpg';
      const animalEmoji = marker.emoji || '🐾';
      const animalName = (getAnimalName && getAnimalName(marker)) || marker.animal_name || marker.title;

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

      const markerPosition = isIllustrated
        ? [marker.map_y !== undefined ? marker.map_y : 260, marker.map_x !== undefined ? marker.map_x : 500]
        : [marker.latitude, marker.longitude];

      const leafletMarker = L.marker(markerPosition, {
        icon: customIcon,
        bubblingMouseEvents: true
      });

      leafletMarker.on('click', () => {
        focusOnAnimal(marker);
      });

      markersGroup.addLayer(leafletMarker);
    });
  }, [markers, selectedCategory, activeMarker, focusOnAnimal, isolateMarkerId]);

  // Initialize Leaflet Map Instance (adapting to mapStyle and fullscreen container)
  useEffect(() => {
    // If in 3D or deepzoom mode, clean up Leaflet map
    if (mapStyle === '3d' || mapStyle === 'deepzoom') {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      return;
    }

    const containerEl = isFullscreenMap ? fullscreenMapContainerRef.current : mapContainerRef.current;
    if (!containerEl) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    let map;
    const isIllustrated = (mapStyle === 'illustrated');

    if (isIllustrated) {
      map = L.map(containerEl, {
        crs: L.CRS.Simple,
        minZoom: -0.75,
        maxZoom: 2.5,
        zoomSnap: 0.25,
        scrollWheelZoom: false,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        zoomControl: false,
        maxBounds: [[-100, -100], [671, 1124]],
        maxBoundsViscosity: 0.7
      });

      L.imageOverlay('/images/nandankanan_zoo_map_4k.jpg', ILLUSTRATED_BOUNDS).addTo(map);
      map.fitBounds(ILLUSTRATED_BOUNDS, { padding: [10, 10] });
    } else {
      map = L.map(containerEl, {
        center: NANDANKANAN_CENTER,
        zoom: 15,
        minZoom: 11,
        maxZoom: 19,
        scrollWheelZoom: false,
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

    renderMarkers(map, markersGroup, isIllustrated);

    // Ensure map properly recalculates dimensions
    const resizeTimer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);

    return () => {
      clearTimeout(resizeTimer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapStyle, isFullscreenMap, selectedCategory, renderMarkers]);

  // Zoom and Pan Handlers (for Leaflet 2D)
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  // Reset View to See ALL Animals Across Full Park
  const handleShowAllAnimals = () => {
    setActiveMarker(null);
    setIsZoomedIn(false);
    setSelectedCategory('all');
    setIsolateMarkerId(null);
    setFocusTrigger(Date.now());
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('reset-zoo-map-view'));
    }
    if (mapStyle === 'illustrated' && mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(ILLUSTRATED_BOUNDS, { animate: true, padding: [10, 10] });
    } else if (mapStyle === 'satellite' && mapInstanceRef.current) {
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
    <section id="interactive-map" className="py-8 sm:py-12 bg-forest-900 text-ivory-50 relative overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute top-10 right-0 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1720px] 2xl:max-w-[1840px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full glass-badge mb-2">
              <Compass className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold-300">
                Official Sanctuary Guide Map
              </span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-4xl tracking-wide text-ivory-50">
              EXPLORE ALL ANIMALS <span className="text-gold-400">ON THE 3D MAP</span>
            </h2>

            <p className="mt-1.5 text-ivory-200/80 text-xs sm:text-sm max-w-2xl font-light">
              Experience Nandankanan in <strong>3D Google Earth-class terrain</strong>. Click any animal to <strong>identify the species</strong>, activate the 3D habitat beacon, swoop the 3D camera into its enclosure, and stream live habitat observation feeds.
            </p>
          </div>

          {/* Map Controls: 3D Google Earth / 2D Illustrated / Satellite Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-forest-950/95 border border-[#C8A96B]/40 backdrop-blur-md shadow-2xl">
              <button
                onClick={() => {
                  setMapStyle('3d');
                  setActiveMarker(null);
                  setIsolateMarkerId(null);
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('start-zoo-map-orbit'));
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                  mapStyle === '3d'
                    ? 'bg-[#C8A96B] text-[#071810] shadow-lg shadow-[#C8A96B]/30 ring-2 ring-[#C8A96B]'
                    : 'text-[#FAF9F5] hover:text-[#C8A96B] hover:bg-forest-900/70'
                }`}
                title="Interactive 3D Google Earth Terrain Perspective"
              >
                <span className="text-sm">🌍</span>
                <span className="font-extrabold tracking-wide">3D GOOGLE EARTH</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                  mapStyle === '3d' ? 'bg-[#071810] text-[#C8A96B]' : 'bg-[#C8A96B]/20 text-[#C8A96B]'
                }`}>HD</span>
              </button>

              <button
                onClick={() => setMapStyle('deepzoom')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  mapStyle === 'deepzoom'
                    ? 'bg-[#C8A96B] text-[#071810] shadow-md ring-2 ring-[#C8A96B]'
                    : 'text-[#FAF9F5] hover:text-[#C8A96B] hover:bg-forest-900/70'
                }`}
                title="4K Deep-Zoom DZI Interactive Pyramidal Map"
              >
                <span className="text-sm">🔍</span>
                <span>4K DEEP ZOOM</span>
              </button>

              <button
                onClick={() => setMapStyle('satellite')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  mapStyle === 'satellite'
                    ? 'bg-[#C8A96B] text-[#071810] shadow-md ring-2 ring-[#C8A96B]'
                    : 'text-[#FAF9F5] hover:text-[#C8A96B] hover:bg-forest-900/70'
                }`}
                title="Topographic Satellite World Imagery"
              >
                <span className="text-sm">🛰️</span>
                <span>SATELLITE</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                if (cat.key === 'all') {
                  setSelectedCategory('all');
                } else {
                  setSelectedCategory((prev) => (prev === cat.key ? 'all' : cat.key));
                }
                setIsolateMarkerId(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                (cat.key === 'all' && selectedCategory === 'all') || selectedCategory === cat.key
                  ? 'bg-gold-500 text-forest-950 font-bold shadow-md shadow-gold-500/20'
                  : 'bg-forest-950/80 text-ivory-200 hover:bg-forest-800 border border-forest-700/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Quick Animal Jump Strip (All 12 Live Sanctuary Animals) */}
        <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          <span className="text-[11px] font-bold text-gold-400 uppercase tracking-widest shrink-0 flex items-center gap-1 mr-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Select Animal to View Live:</span>
          </span>
          {markers.map((m) => {
            const isCurrent = activeMarker && (activeMarker.id === m.id || activeMarker.animal_slug === m.animal_slug);
            return (
              <button
                key={m.id || m.animal_slug}
                onClick={() => focusOnAnimal(m)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all shrink-0 cursor-pointer ${isCurrent
                    ? 'bg-gold-500 text-forest-950 font-bold shadow-lg shadow-gold-500/30 ring-2 ring-gold-400 scale-105'
                    : 'bg-forest-950/70 border border-forest-800 hover:border-gold-500/40 text-ivory-200 hover:text-white'
                  }`}
                title={`Click to view ${m.animal_name || m.title} live video`}
              >
                <span>{m.emoji || '🐾'}</span>
                <span>{m.animal_name || m.title}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              </button>
            );
          })}
        </div>

        {/* Main Layout: Wide Full-Width 3D/2D Map Box + Live Video Feed Section */}
        <div className="flex flex-col gap-6">

          {/* Map View Box - Wide Size Full Width */}
          <div 
            id="zoo-map-viewport"
            onClick={() => {
              if (activeMarker || isolateMarkerId) {
                setActiveMarker(null);
                setIsolateMarkerId(null);
              }
              if (mapStyle === '3d' && typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('start-zoo-map-orbit'));
              }
            }}
            className="w-full relative rounded-3xl overflow-hidden zoo-map-frame bg-forest-950 transition-all scroll-mt-28"
          >
            {/* Render 4K Deep Zoom OR 3D Google Earth WebGL canvas OR 2D Leaflet Container */}
            {mapStyle === 'deepzoom' ? (
              <InteractiveMap3D
                markers={markers}
                activeMarker={activeMarker}
                onSelectAnimalBySlug={onSelectAnimalBySlug}
                onOpenLiveCam={onOpenLiveCam}
                onSelectMarker={focusOnAnimal}
                embedded={true}
                isFullscreen={false}
                isExpanded={isMapExpanded}
              />
            ) : mapStyle === '3d' ? (
              <ThreeZooMap
                markers={markers}
                activeMarker={activeMarker}
                onSelectMarker={focusOnAnimal}
                selectedCategory={selectedCategory}
                onOpenLiveCam={onOpenLiveCam}
                isolateMarkerId={isolateMarkerId}
                focusTrigger={focusTrigger}
                onResetIsolate={() => setIsolateMarkerId(null)}
                isFullscreen={false}
                isExpanded={isMapExpanded}
              />
            ) : (
              <>
                <div
                  ref={mapContainerRef}
                  className={`w-full ${isMapExpanded ? 'h-[620px] sm:h-[700px] md:h-[780px] lg:h-[840px] xl:h-[880px]' : 'h-[420px] sm:h-[480px] md:h-[540px] lg:h-[580px] xl:h-[600px] 2xl:h-[620px]'} z-10 map-canvas-interactive zoo-map-container transition-all duration-300`}
                  style={{ background: '#0B2419' }}
                />

                {/* 2D Mode Status Pill */}
                <div className="absolute top-4 left-4 z-20 pointer-events-none bg-forest-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-gold-500/30 text-xs text-ivory-100 flex items-center gap-2 shadow-xl">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-gold-300 font-semibold text-xs">
                    {activeMarker ? `Enclosure: ${activeMarker.animal_name || activeMarker.title}` : 'All Sanctuary Exhibits'}
                  </span>
                  <span className="text-[10px] text-ivory-300 hidden sm:inline">| Click any animal to zoom into its habitat</span>
                </div>

                {/* 2D Zoom Controls */}
                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-forest-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-gold-500/30 shadow-2xl">
                  <button
                    onClick={handleZoomIn}
                    className="p-2 rounded-xl bg-forest-900/80 hover:bg-forest-800 text-ivory-100 hover:text-gold-400 transition-colors shadow-sm"
                    title="Zoom In"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-2 rounded-xl bg-forest-900/80 hover:bg-forest-800 text-ivory-100 hover:text-gold-400 transition-colors shadow-sm"
                    title="Zoom Out"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleShowAllAnimals}
                    className="p-2 rounded-xl bg-forest-900/80 hover:bg-forest-800 text-gold-400 transition-colors shadow-sm"
                    title="Show All"
                  >
                    <Navigation className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {/* Top Right Box Size Controls: Increase/Default Size Toggle + Fullscreen */}
            <div 
              className="absolute top-4 right-4 z-30 flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMapExpanded(!isMapExpanded);
                }}
                className="px-3 py-2 rounded-2xl bg-forest-950/95 hover:bg-forest-900 border border-gold-500/40 text-gold-300 hover:text-gold-100 transition-all shadow-xl backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1.5 text-xs font-mono font-bold"
                title={isMapExpanded ? "Restore Exact Default Size" : "Increase Map Box Size"}
                aria-label="Toggle Increased Size"
              >
                {isMapExpanded ? <Minimize2 className="w-3.5 h-3.5 text-gold-400" /> : <Maximize2 className="w-3.5 h-3.5 text-gold-400" />}
                <span>{isMapExpanded ? "DEFAULT SIZE" : "INCREASE SIZE"}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreenMap(true);
                }}
                className="p-2.5 rounded-2xl bg-forest-950/95 hover:bg-forest-900 border border-gold-500/40 text-gold-300 hover:text-gold-200 transition-all shadow-xl backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95"
                title="Fullscreen Monitor View"
                aria-label="Fullscreen Map"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Animal Live Video Stream Card & "SPECIES IDENTIFIED" Dossier (Wide Full-Width 2-Column Responsive Layout) */}
          {activeMarker && (
            <div className="w-full bg-forest-950/95 border border-gold-500/30 rounded-3xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl animate-fadeIn">
              {/* Header HUD Bar */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-forest-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    SPECIES IDENTIFIED &amp; 3D HABITAT LOCKED
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gold-300 hidden sm:inline">
                    ID: #{activeMarker.id} • 3D BEACON ACTIVE
                  </span>
                  <button
                    onClick={() => {
                      setActiveMarker(null);
                      setIsolateMarkerId(null);
                    }}
                    className="w-7 h-7 rounded-full bg-forest-900 hover:bg-[#C8A96B] text-ivory-200 hover:text-[#071D12] border border-gold-500/30 flex items-center justify-center transition-all cursor-pointer"
                    title="Close Dossier"
                    aria-label="Close details panel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 2-Column Grid: Video on Left, Details & Habitat on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column (5-6 cols): Live Video Feed */}
                <div className="lg:col-span-5 xl:col-span-6 flex flex-col gap-2.5">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-gold-500/40 bg-black shadow-xl group">
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
                        className={`p-1.5 rounded-lg border backdrop-blur-md transition-all shadow-md cursor-pointer ${!isMuted
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
                        className="p-1.5 rounded-lg bg-forest-950/80 hover:bg-forest-900 border border-gold-500/30 text-gold-300 transition-all shadow-md cursor-pointer"
                        title={isPlaying ? "Pause Stream" : "Play Stream"}
                        aria-label="Play or Pause Stream"
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => onOpenLiveCam && onOpenLiveCam(activeMarker)}
                        className="p-1.5 rounded-lg bg-forest-950/80 hover:bg-forest-900 border border-gold-500/30 text-gold-300 transition-all shadow-md cursor-pointer"
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

                  <button
                    onClick={() => onOpenLiveCam && onOpenLiveCam(activeMarker)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Tv className="w-4 h-4 animate-pulse" />
                    <span>Watch Fullscreen Live Stream</span>
                  </button>
                </div>

                {/* Right Column (7-6 cols): Identified Species Dossier & Habitat Context */}
                <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-between space-y-3.5">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3 
                        onClick={() => onOpenLiveCam && onOpenLiveCam(activeMarker)}
                        className="font-display font-black text-2xl sm:text-3xl text-ivory-50 cursor-pointer hover:text-gold-300 transition-colors"
                        title="Click to view live stream in full player"
                      >
                        {activeMarker.animal_name || activeMarker.title}
                      </h3>
                      {identifiedAnimal?.conservation_status && (
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                          identifiedAnimal.conservation_status.toLowerCase().includes('endangered')
                            ? 'bg-red-500/20 text-red-300 border-red-500/40'
                            : identifiedAnimal.conservation_status.toLowerCase().includes('vulnerable')
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {identifiedAnimal.conservation_status}
                        </span>
                      )}
                    </div>

                    {/* Scientific Name */}
                    {identifiedAnimal?.scientific_name && (
                      <p className="text-xs text-gold-300/90 italic font-serif mb-2">
                        Taxonomy: {identifiedAnimal.scientific_name}
                      </p>
                    )}

                    <p className="text-xs text-ivory-200/80 leading-relaxed mb-3">
                      {activeMarker.description}
                    </p>

                    {/* Scientific Metric Telemetry Strip */}
                    {identifiedAnimal && (
                      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-forest-900/70 border border-forest-800 text-xs mb-3">
                        <div className="text-center">
                          <span className="text-ivory-400 text-[9px] block uppercase font-mono">Diet</span>
                          <span className="text-gold-300 font-bold truncate block">{identifiedAnimal.diet?.split('(')[0]?.trim() || 'Custom'}</span>
                        </div>
                        <div className="text-center border-x border-forest-800">
                          <span className="text-ivory-400 text-[9px] block uppercase font-mono">Weight</span>
                          <span className="text-ivory-100 font-bold truncate block">{identifiedAnimal.weight_range || 'N/A'}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-ivory-400 text-[9px] block uppercase font-mono">Lifespan</span>
                          <span className="text-emerald-300 font-bold truncate block">{identifiedAnimal.lifespan || 'N/A'}</span>
                        </div>
                      </div>
                    )}

                    {/* "THE PLACE AROUND IT" Dedicated Geographic Context Card */}
                    <div className="p-3.5 rounded-2xl bg-forest-900/90 border border-gold-500/25 space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-gold-300 font-bold uppercase tracking-wider text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-gold-400" />
                        <span>The Place Around This Habitat:</span>
                      </div>

                      <p className="text-xs text-ivory-100/90 leading-relaxed font-light">
                        {activeMarker.surrounding_place || `Natural forested sanctuary zone surrounded by Sal woodlands, water moats, and visitor walking trails.`}
                      </p>

                      {activeMarker.nearby_landmarks && (
                        <div className="pt-2 border-t border-forest-800/80 flex items-start gap-1.5 text-xs text-ivory-300/80">
                          <Footprints className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                          <span><strong>Nearby:</strong> {activeMarker.nearby_landmarks}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        handleShowAllAnimals();
                        setActiveMarker(null);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-ivory-200 hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-forest-700 transition-all text-center cursor-pointer"
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
                        className="flex-1 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-gold-300 hover:text-gold-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-gold-500/30 transition-all text-center cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Species Profile</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* FULLSCREEN MAP PORTAL OVERLAY */}
      {isFullscreenMap && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[999999] w-screen h-screen bg-forest-950 flex flex-col overflow-hidden select-none animate-fadeIn"
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
        >
          {/* Top Bar with Mode Switcher & Clearly Visible Close (✕) Button */}
          <div className="absolute top-4 inset-x-4 z-[1000000] flex items-center justify-between pointer-events-none gap-3">
            {/* Left: Map Mode Switcher */}
            <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 bg-forest-950/90 backdrop-blur-xl border border-gold-500/40 rounded-2xl p-1.5 shadow-2xl">
              <button
                onClick={() => setMapStyle('3d')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-mono text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  mapStyle === '3d'
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-forest-950 shadow-md'
                    : 'text-ivory-200 hover:text-gold-300 hover:bg-forest-900/60'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>3D GLOBE</span>
              </button>
              <button
                onClick={() => setMapStyle('deepzoom')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-mono text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  mapStyle === 'deepzoom'
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-forest-950 shadow-md'
                    : 'text-ivory-200 hover:text-gold-300 hover:bg-forest-900/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">4K </span><span>DEEP ZOOM</span>
              </button>
              <button
                onClick={() => setMapStyle('satellite')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-mono text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  mapStyle === 'satellite'
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-forest-950 shadow-md'
                    : 'text-ivory-200 hover:text-gold-300 hover:bg-forest-900/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>SATELLITE</span>
              </button>
            </div>

            {/* Right: Clearly Visible Close (✕) Button */}
            <button
              onClick={() => setIsFullscreenMap(false)}
              className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-forest-900/95 hover:bg-forest-800 border-2 border-gold-400 text-gold-300 hover:text-gold-100 shadow-2xl backdrop-blur-xl transition-all cursor-pointer group active:scale-95"
              title="Close Fullscreen (Esc)"
              aria-label="Close Fullscreen Map"
            >
              <span className="text-xs font-mono font-bold tracking-wider uppercase hidden sm:inline text-gold-200">Close</span>
              <X className="w-5 h-5 text-gold-300 group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          {/* Fullscreen Map View Canvas */}
          <div className="relative w-full h-full flex-1">
            {mapStyle === 'deepzoom' ? (
              <InteractiveMap3D
                markers={markers}
                activeMarker={activeMarker}
                onSelectAnimalBySlug={onSelectAnimalBySlug}
                onOpenLiveCam={onOpenLiveCam}
                onSelectMarker={focusOnAnimal}
                embedded={true}
                isFullscreen={true}
                onCloseFullscreen={() => setIsFullscreenMap(false)}
              />
            ) : mapStyle === '3d' ? (
              <ThreeZooMap
                markers={markers}
                activeMarker={activeMarker}
                onSelectMarker={focusOnAnimal}
                selectedCategory={selectedCategory}
                onOpenLiveCam={onOpenLiveCam}
                isolateMarkerId={isolateMarkerId}
                focusTrigger={focusTrigger}
                onResetIsolate={() => setIsolateMarkerId(null)}
                isFullscreen={true}
              />
            ) : (
              <>
                <div
                  ref={fullscreenMapContainerRef}
                  className="w-full h-full min-h-screen z-10 map-canvas-interactive zoo-map-container"
                  style={{ background: '#0B2419' }}
                />

                {/* 2D Zoom Controls in Fullscreen */}
                <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 bg-forest-950/90 backdrop-blur-md p-2 rounded-2xl border border-gold-500/30 shadow-2xl">
                  <button
                    onClick={handleZoomIn}
                    className="p-2.5 rounded-xl bg-forest-900/80 hover:bg-forest-800 text-ivory-100 hover:text-gold-400 transition-colors shadow-sm"
                    title="Zoom In"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-2.5 rounded-xl bg-forest-900/80 hover:bg-forest-800 text-ivory-100 hover:text-gold-400 transition-colors shadow-sm"
                    title="Zoom Out"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleShowAllAnimals}
                    className="p-2.5 rounded-xl bg-forest-900/80 hover:bg-forest-800 text-gold-400 transition-colors shadow-sm"
                    title="Show All"
                  >
                    <Navigation className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}

            {/* Quick Animal Jump Strip at Bottom of Fullscreen (hidden in 4K deepzoom to not block OpenSeadragon's controls and minimap) */}
            {mapStyle !== 'deepzoom' && (
              <div className="absolute bottom-6 left-6 right-28 z-20 pointer-events-none hidden md:block">
                <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-forest-950/90 backdrop-blur-md border border-gold-500/30 scrollbar-none max-w-fit shadow-2xl">
                  <span className="text-[10px] font-mono text-gold-400/80 uppercase px-2 font-bold shrink-0">
                    Quick Jump:
                  </span>
                  {markers.slice(0, 12).map((m) => {
                    const isCur = activeMarker?.id === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => focusOnAnimal(m)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                          isCur
                            ? 'bg-gold-500 text-forest-950 font-bold shadow-sm'
                            : 'bg-forest-900/70 hover:bg-forest-800 text-ivory-200 hover:text-gold-300'
                        }`}
                      >
                        <span>{m.emoji || '🐾'}</span>
                        <span>{m.animal_name || m.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active Animal Live Stream Floating Overlay (if activeMarker selected in fullscreen) */}
            {activeMarker && (
              <div className="absolute top-20 right-6 z-30 w-80 max-w-[90vw] bg-forest-950/95 border border-gold-500/40 rounded-2xl p-3 shadow-2xl backdrop-blur-xl animate-fadeIn">
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-forest-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-gold-300 truncate">
                      {activeMarker.animal_name || activeMarker.title}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveMarker(null)}
                    className="p-1 rounded hover:bg-forest-800 text-ivory-300 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {(activeMarker.stream_url || activeMarker.live_video_url) ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-2">
                    <video
                      src={activeMarker.stream_url || activeMarker.live_video_url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-red-600/90 text-[9px] font-mono font-bold text-white uppercase">
                      LIVE FEED
                    </div>
                  </div>
                ) : null}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-emerald-400">
                    {activeMarker.zone || 'Zone A'}
                  </span>
                  {onOpenLiveCam && (
                    <button
                      onClick={() => onOpenLiveCam(activeMarker)}
                      className="px-2.5 py-1 rounded-lg bg-gold-500/20 hover:bg-gold-500 text-gold-300 hover:text-forest-950 font-mono text-[10px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Tv className="w-3 h-3" />
                      <span>Full Cam</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

    </section>
  );
}
