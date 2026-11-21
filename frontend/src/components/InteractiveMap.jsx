import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import ThreeZooMap from './ThreeZooMap';
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
  Plus,
  Minus,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function InteractiveMap({ 
  markers = [], 
  onSelectAnimalBySlug, 
  onOpenLiveCam,
  activeMarkerProp = null
}) {
  const { t, getAnimalName } = useLanguage();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeMarker, setActiveMarker] = useState(null);
  const [mapStyle, setMapStyle] = useState('3d'); // '3d' (Default Google Earth 3D) | 'illustrated' | 'satellite'
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [isFullscreenMap, setIsFullscreenMap] = useState(false);
  const [isolateMarkerId, setIsolateMarkerId] = useState(null);
  const [focusTrigger, setFocusTrigger] = useState(0);

  // Exact center of Nandankanan's animal enclosures (for satellite mode)
  const NANDANKANAN_CENTER = [20.4020, 85.8190];
  // Illustrated Map bounds: 1024 x 526
  const ILLUSTRATED_BOUNDS = [[0, 0], [526, 1024]];

  const categories = [
    { key: 'all', label: (t && t('map.categories.all')) || 'All Sanctuary Highlights' },
    { key: 'safari_zone', label: (t && t('map.categories.safari_zone')) || '🐅 Safari Zones' },
    { key: 'animal_habitat', label: (t && t('map.categories.animal_habitat')) || '🐾 Enclosures' },
    { key: 'water_body', label: (t && t('map.categories.water_body')) || '🌊 Kanjia Lake' },
    { key: 'visitor_facility', label: (t && t('map.categories.visitor_facility')) || '🏛️ Facilities & Rides' }
  ];

  // Satellite tile layer
  const SATELLITE_TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  const SATELLITE_ATTRIBUTION = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP | Nandankanan GIS';

  // Focus on a particular animal: zooms in to show enclosure & surroundings
  const focusOnAnimal = useCallback((marker, isolate = false) => {
    if (!marker) return;
    setActiveMarker(marker);
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
      focusOnAnimal(activeMarkerProp, Boolean(activeMarkerProp._isolate));
    }
  }, [activeMarkerProp, focusOnAnimal]);

  // Render Markers on Leaflet Map
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
          <div class="group relative cursor-pointer" style="transform: translate(-50%, -50%);">
            <!-- Pulsing Halo on Selected -->
            ${isSelected ? `
              <div class="absolute -inset-2 rounded-full animate-ping opacity-75"
                   style="background: radial-gradient(circle, ${glowColor} 0%, transparent 70%);"></div>
            ` : ''}

            <!-- Circular Photo Badge -->
            <div class="relative w-11 h-11 rounded-full p-0.5 shadow-2xl transition-all duration-300 transform group-hover:scale-125"
                 style="
                   background: linear-gradient(135deg, ${borderColor}, #05140C);
                   box-shadow: 0 0 ${isSelected ? '22px' : '10px'} ${glowColor};
                   border: 2px solid ${isSelected ? '#FFF' : borderColor};
                 ">
              <div class="w-full h-full rounded-full overflow-hidden bg-forest-950 flex items-center justify-center">
                ${marker.photo_url ? `
                  <img src="${animalPhoto}" alt="${animalName}" class="w-full h-full object-cover" />
                ` : `
                  <span class="text-base select-none">${animalEmoji}</span>
                `}
              </div>

              <!-- Live Indicator Dot if live cam available -->
              ${marker.live_cam_available ? `
                <div class="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-600 border border-white flex items-center justify-center shadow-md">
                  <span class="w-1.5 h-1.5 rounded-full bg-white live-indicator"></span>
                </div>
              ` : ''}
            </div>

            <!-- Sleek Tooltip on Hover -->
            <div class="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 hidden group-hover:flex flex-col items-center pointer-events-none z-50">
              <div class="px-2.5 py-1 rounded-md bg-[#071D12]/95 border border-[#C8A96B]/50 text-[11px] font-bold text-white whitespace-nowrap shadow-xl backdrop-blur-md">
                ${animalName}
              </div>
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
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
  }, [markers, selectedCategory, activeMarker, focusOnAnimal, getAnimalName, isolateMarkerId]);

  // Initialize Leaflet Map Instance (adapting to mapStyle)
  useEffect(() => {
    // If in 3D mode, clean up Leaflet map
    if (mapStyle === '3d') {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      return;
    }

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
        maxBounds: [[-100, -100], [626, 1124]],
        maxBoundsViscosity: 0.7
      });

      L.imageOverlay('/images/nandankanan_zoo_map_4k.jpg', ILLUSTRATED_BOUNDS).addTo(map);
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

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapStyle, selectedCategory, renderMarkers]);

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
    if (mapStyle === 'illustrated' && mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(ILLUSTRATED_BOUNDS, { animate: true, padding: [10, 10] });
    } else if (mapStyle === 'satellite' && mapInstanceRef.current) {
      mapInstanceRef.current.setView(NANDANKANAN_CENTER, 15, { animate: true });
    }
  };

  return (
    <section id="interactive-map" className="scroll-mt-24 sm:scroll-mt-28 pt-10 sm:pt-12 lg:pt-14 pb-10 sm:pb-12 lg:pb-14 bg-[#071D12] text-[#F5F4EA] relative overflow-hidden">

      {/* Top Subtle Golden Forest Horizon Separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C8A96B]/25 to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-[#05140C]/60 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-[#0B2A1A] border border-[#26734D] flex items-center justify-center text-[#C8A96B]">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-xs uppercase tracking-widest font-mono text-[#C8A96B]">
                {(t && t('map.eyebrow')) || 'Interactive Sanctuary Cartography'}
              </span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#F5F4EA] tracking-tight">
              {(t && t('map.title')) || 'Interactive Zoo Habitat Map'}
            </h2>
            <p className="text-xs sm:text-sm text-[#F5F4EA]/80 mt-1 max-w-xl">
              {(t && t('map.subtitle')) || 'Locate wildlife enclosures across 437 hectares, switch to 3D Google Earth, or tap any animal pin for live feeds.'}
            </p>
          </div>

          {/* Map Controls: 3D Google Earth / 2D Illustrated / Satellite Mode Switcher & Show All Animals */}
          <div className="flex flex-wrap items-center gap-2.5 relative z-30">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0B2A1A] border border-[#26734D]/60 backdrop-blur-md shadow-2xl">
              <button
                onClick={() => setMapStyle('3d')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  mapStyle === '3d'
                    ? 'bg-[#C8A96B] text-[#071810] shadow-lg shadow-[#C8A96B]/30'
                    : 'text-[#F5F4EA] hover:text-[#C8A96B]'
                }`}
                title="Interactive 3D Google Earth Terrain Perspective"
              >
                <span>🌍</span>
                <span className="font-extrabold tracking-wide">3D GOOGLE EARTH</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                  mapStyle === '3d' ? 'bg-[#071810] text-[#C8A96B]' : 'bg-[#C8A96B]/20 text-[#C8A96B]'
                }`}>
                  3D
                </span>
              </button>

              <button
                onClick={() => setMapStyle('illustrated')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  mapStyle === 'illustrated'
                    ? 'bg-[#C8A96B] text-[#071810] shadow-lg shadow-[#C8A96B]/30'
                    : 'text-[#F5F4EA] hover:text-[#C8A96B]'
                }`}
                title="Illustrated Sanctuary Map"
              >
                <span>🗺️</span>
                <span>ILLUSTRATED</span>
              </button>

              <button
                onClick={() => setMapStyle('satellite')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  mapStyle === 'satellite'
                    ? 'bg-[#C8A96B] text-[#071810] shadow-lg shadow-[#C8A96B]/30'
                    : 'text-[#F5F4EA] hover:text-[#C8A96B]'
                }`}
                title="High-Resolution Satellite Orthoimagery"
              >
                <span>🛰️</span>
                <span>SATELLITE</span>
              </button>
            </div>

            <button
              onClick={handleShowAllAnimals}
              className="btn-map-control-accent flex items-center gap-1.5 cursor-pointer px-3.5 py-2 rounded-xl bg-[#0B2A1A] hover:bg-[#123D2B] border border-[#26734D]/60 text-xs font-bold text-[#F5F4EA] uppercase tracking-wider transition-all"
              title="Zoom out to see all animals across the full park"
              aria-label="Show All Animals"
            >
              <Navigation className="w-4 h-4 text-[#C8A96B]" />
              <span>{(t && t('map.showAllAnimals')) || 'SHOW ALL ANIMALS'}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all shadow-md cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-[#C8A96B] text-[#071D12] border border-[#D4B87A] shadow-[#C8A96B]/30'
                  : 'bg-[#0B2A1A] text-[#F5F4EA]/90 hover:bg-[#123D2B] border border-[#26734D]/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Quick Animal Jump Strip */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[11px] font-bold text-[#C8A96B] uppercase tracking-widest shrink-0 flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{(t && t('map.selectAnimal')) || 'SELECT ANIMAL'}</span>
          </span>
          {markers.map((m) => {
            const isCurrent = activeMarker && activeMarker.id === m.id;
            const displayName = (getAnimalName && getAnimalName(m)) || m.animal_name || m.title;
            return (
              <button
                key={m.id}
                onClick={() => focusOnAnimal(m)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all shrink-0 shadow-sm cursor-pointer ${
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

        {/* Full-Width Interactive Map Box (Expanded to Full Width Without Bulky Side Panel) */}
        <div className={`w-full relative rounded-3xl overflow-hidden border border-[#26734D]/50 bg-[#071810] shadow-2xl transition-all ${
          isFullscreenMap ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl' : ''
        }`}>

          {/* Render 3D Google Earth WebGL canvas OR 2D Leaflet Container */}
          {mapStyle === '3d' ? (
            <ThreeZooMap
              markers={markers}
              activeMarker={activeMarker}
              onSelectMarker={focusOnAnimal}
              selectedCategory={selectedCategory}
              onOpenLiveCam={onOpenLiveCam}
              isolateMarkerId={isolateMarkerId}
              focusTrigger={focusTrigger}
              onResetIsolate={() => setIsolateMarkerId(null)}
            />
          ) : (
            <>
              {/* Movable Leaflet Container */}
              <div
                ref={mapContainerRef}
                className="w-full h-[500px] sm:h-[620px] md:h-[720px] lg:h-[800px] z-10 map-canvas-interactive"
                style={{ background: '#0B2419' }}
              />

              {/* Top Status Pill (2D Mode) */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none bg-[#071D12]/92 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#C8A96B]/40 text-xs text-[#F5F4EA] flex items-center gap-2 shadow-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[#C8A96B] font-bold text-xs">
                  {activeMarker ? `${(t && t('map.enclosurePrefix')) || 'Enclosure:'} ${(getAnimalName && getAnimalName(activeMarker)) || activeMarker.animal_name || activeMarker.title}` : ((t && t('map.allEnclosures')) || 'All Sanctuary Exhibits')}
                </span>
                <span className="text-[10px] text-[#F5F4EA]/70 hidden sm:inline">
                  | {(t && t('map.clickPrompt')) || 'Click any animal to view habitat'}
                </span>
              </div>
            </>
          )}

          {/* Floating On-Map Zoom & Reset Controls */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            {mapStyle !== '3d' && (
              <>
                <button
                  onClick={handleZoomIn}
                  className="p-2.5 rounded-xl bg-[#071D12]/92 hover:bg-[#0B2A1A] border border-[#C8A96B]/40 text-[#C8A96B] hover:text-white transition-all shadow-xl backdrop-blur-md cursor-pointer"
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2.5 rounded-xl bg-[#071D12]/92 hover:bg-[#0B2A1A] border border-[#C8A96B]/40 text-[#C8A96B] hover:text-white transition-all shadow-xl backdrop-blur-md cursor-pointer"
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={handleShowAllAnimals}
                  className="p-2.5 rounded-xl bg-[#071D12]/92 hover:bg-[#0B2A1A] border border-[#C8A96B]/40 text-[#C8A96B] hover:text-white transition-all shadow-xl backdrop-blur-md cursor-pointer"
                  title="Reset View"
                  aria-label="Reset View"
                >
                  <Compass className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={() => setIsFullscreenMap(!isFullscreenMap)}
              className="p-2.5 rounded-xl bg-[#071D12]/92 hover:bg-[#0B2A1A] border border-[#C8A96B]/40 text-[#C8A96B] hover:text-white transition-all shadow-xl backdrop-blur-md cursor-pointer"
              title={isFullscreenMap ? 'Exit Fullscreen' : 'Fullscreen Map'}
              aria-label="Fullscreen Map"
            >
              {isFullscreenMap ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Sleek Floating Enclosure Detail Card on Marker Click */}
          {activeMarker && (
            <div className="absolute bottom-16 sm:bottom-6 left-4 right-4 sm:right-auto sm:max-w-md z-30 bg-[#071D12]/95 backdrop-blur-xl border border-[#C8A96B]/50 rounded-2xl p-4 shadow-2xl animate-fadeIn">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#0B2A1A] border border-[#C8A96B]/40 shrink-0 flex items-center justify-center">
                    {activeMarker.photo_url ? (
                      <img src={activeMarker.photo_url} alt={activeMarker.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">{activeMarker.emoji || '🐾'}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#C8A96B] block">
                      {activeMarker.badge_text || 'Sanctuary Enclosure'}
                    </span>
                    <h4 className="font-display font-bold text-base sm:text-lg text-[#F5F4EA] leading-tight">
                      {(getAnimalName && getAnimalName(activeMarker)) || activeMarker.animal_name || activeMarker.title}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => setActiveMarker(null)}
                  className="p-1 rounded-lg text-[#F5F4EA]/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close enclosure info"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#F5F4EA]/80 leading-relaxed mb-3 line-clamp-2">
                {activeMarker.description}
              </p>

              <div className="flex items-center gap-2">
                {activeMarker.live_cam_available && (
                  <button
                    onClick={() => onOpenLiveCam && onOpenLiveCam(activeMarker)}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#C8A96B] to-[#b89858] text-[#071D12] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 transition-all cursor-pointer"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>Watch Live Feed</span>
                  </button>
                )}
                {activeMarker.animal_slug && (
                  <button
                    onClick={() => {
                      if (onSelectAnimalBySlug) onSelectAnimalBySlug(activeMarker.animal_slug);
                      const el = document.getElementById('explore-animals');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="py-2 px-3 rounded-xl bg-[#0B2A1A] hover:bg-[#123D2B] border border-[#26734D] text-[#F5F4EA] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C8A96B]" />
                    <span>Species Profile</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Bottom Left Legend (Visible when no floating active card is open) */}
          {!activeMarker && (
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
          )}

        </div>

      </div>

    </section>
  );
}
