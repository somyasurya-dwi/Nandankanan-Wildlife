import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Compass,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  Navigation,
  Plus,
  Minus,
  X,
  MapPin,
  Footprints,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function InteractiveMap({ markers = [], onSelectAnimalBySlug, onOpenLiveCam }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const markersMapRef = useRef({});

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeMarker, setActiveMarker] = useState(null);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [mapStyle, setMapStyle] = useState('illustrated'); // 'illustrated' (default, official map) | 'satellite'
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [isFullscreenMap, setIsFullscreenMap] = useState(false);

  // Exact center of Nandankanan's animal enclosures (for satellite mode)
  const NANDANKANAN_CENTER = [20.4020, 85.8190];
  // Illustrated Map bounds: 1024 x 571 (exact aspect ratio of real environment map)
  const ILLUSTRATED_BOUNDS = [[0, 0], [571, 1024]];

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

  // Focus on a particular animal: opens right-side details without zooming in or distorting the map
  const focusOnAnimal = useCallback((marker) => {
    if (!marker) return;
    setActiveMarker(marker);
    setShowSidePanel(true);
  }, []);

  // Render Markers on Map
  const renderMarkers = useCallback((map, markersGroup, isIllustrated) => {
    markersGroup.clearLayers();
    markersMapRef.current = {};

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

      // Click Event on Marker: Select marker, zoom in to show the place around it, and show details on right side
      leafletMarker.on('click', () => {
        focusOnAnimal(marker);
      });

      markersMapRef.current[marker.id] = leafletMarker;
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
        maxZoom: 1.75,
        zoomSnap: 0.25,
        scrollWheelZoom: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        zoomControl: false,
        maxBounds: [[-80, -80], [651, 1104]],
        maxBoundsViscosity: 0.7
      });

      // Overlay the official illustrated zoo map
      L.imageOverlay('/images/nandankanan_zoo_map.jpg', ILLUSTRATED_BOUNDS, {
        className: 'official-zoo-map-layer',
        alt: 'Nandankanan Zoological Park Guide Map',
        interactive: false
      }).addTo(map);
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

    // Handle clicks inside Leaflet animal popups
    map.on('popupopen', (e) => {
      const container = e.popup.getElement();
      if (!container) return;
      const profileBtn = container.querySelector('.popup-profile-btn');
      if (profileBtn) {
        profileBtn.onclick = (ev) => {
          ev.preventDefault();
          const slug = profileBtn.getAttribute('data-slug');
          if (onSelectAnimalBySlug && slug) {
            onSelectAnimalBySlug(slug);
          }
          const el = document.getElementById('explore-animals');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        };
      }
    });

    // Clicking anywhere on the map near an animal enclosure triggers its popup
    map.on('click', (e) => {
      const clickY = e.latlng.lat;
      const clickX = e.latlng.lng;
      let closestMarker = null;
      let minDistance = Infinity;

      const filtered = markers.filter(
        (m) => selectedCategory === 'all' || m.category === selectedCategory
      );

      filtered.forEach((m) => {
        const my = isIllustrated ? (m.map_y !== undefined ? m.map_y : 260) : m.latitude;
        const mx = isIllustrated ? (m.map_x !== undefined ? m.map_x : 500) : m.longitude;
        const dist = Math.sqrt(Math.pow(clickY - my, 2) + Math.pow(clickX - mx, 2));
        if (dist < minDistance) {
          minDistance = dist;
          closestMarker = m;
        }
      });

      const threshold = isIllustrated ? 55 : 0.0025;
      if (minDistance <= threshold && closestMarker) {
        focusOnAnimal(closestMarker);
      }
    });

    // Invalidate size to ensure crisp full-width layout
    const resizeTimer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapStyle, selectedCategory, renderMarkers, focusOnAnimal, markers, onSelectAnimalBySlug]);

  // Ensure map smoothly recalculates viewport on fullscreen toggle or side panel resize without zooming in
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.invalidateSize();
    if (mapStyle === 'illustrated' && !isZoomedIn) {
      mapInstanceRef.current.fitBounds(ILLUSTRATED_BOUNDS, { animate: true, padding: [10, 10] });
    }
    const timer1 = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        if (mapStyle === 'illustrated' && !isZoomedIn) {
          mapInstanceRef.current.fitBounds(ILLUSTRATED_BOUNDS, { animate: false, padding: [10, 10] });
        }
      }
    }, 150);
    const timer2 = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        if (mapStyle === 'illustrated' && !isZoomedIn) {
          mapInstanceRef.current.fitBounds(ILLUSTRATED_BOUNDS, { animate: false, padding: [10, 10] });
        }
      }
    }, 350);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isFullscreenMap, showSidePanel, mapStyle, isZoomedIn]);

  // Zoom and Pan Handlers (manual zoom only)
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
      setIsZoomedIn(true);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  // Reset View to See ALL Animals Across Full Park
  const handleShowAllAnimals = () => {
    if (!mapInstanceRef.current) return;
    setIsZoomedIn(false);
    setActiveMarker(null);
    setShowSidePanel(false);
    mapInstanceRef.current.closePopup();
    if (mapStyle === 'illustrated') {
      mapInstanceRef.current.fitBounds(ILLUSTRATED_BOUNDS, { animate: true, padding: [10, 10] });
    } else {
      mapInstanceRef.current.setView(NANDANKANAN_CENTER, 15, { animate: true });
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
              Click any animal on the map to <strong>open a detailed popup about its habitat, species info, and surroundings</strong>.
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
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C8A96B] hover:from-[#E5C158] hover:to-[#D4AF37] text-forest-950 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 border border-amber-200/60"
              title="Show all animals across the full park"
            >
              <Navigation className="w-4 h-4 text-forest-950 fill-forest-950" />
              <span className="font-extrabold text-forest-950">Show All Animals</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#C8A96B] text-[#071810] font-black shadow-lg shadow-amber-500/25 border border-amber-200/80 scale-105'
                    : 'bg-forest-950/80 text-ivory-100 hover:text-white hover:bg-forest-800 border border-forest-700/80 font-semibold'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Quick Animal Jump Strip (All Animals) */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest shrink-0 flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Animal:</span>
          </span>
          {markers.map((m) => {
            const isCurrent = activeMarker && activeMarker.id === m.id;
            const label = `${m.emoji || '🐾'} ${m.animal_name || m.title.split(' ')[0]}`;
            return (
              <button
                key={m.id}
                onClick={() => focusOnAnimal(m)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#C8A96B] text-[#071810] font-black shadow-lg shadow-amber-500/30 ring-2 ring-amber-300 scale-105'
                    : 'bg-forest-950/80 border border-forest-700/70 hover:border-amber-400/60 text-ivory-100 hover:text-white font-medium'
                }`}
              >
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Map + Animal Info Side Panel Container - Flexible side-by-side layout (no overlapping) */}
        <div className="flex flex-col lg:flex-row gap-5 items-stretch w-full transition-all duration-300">

          {/* Left: Zoo Map View Frame */}
          <div className={`relative rounded-3xl overflow-hidden zoo-map-frame bg-forest-950 border border-gold-500/30 shadow-2xl transition-all ${
            isFullscreenMap
              ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl'
              : (showSidePanel && activeMarker ? 'w-full lg:flex-1' : 'w-full')
          }`}>

            {/* Movable Leaflet Container */}
            <div
              ref={mapContainerRef}
              className="w-full h-[580px] sm:h-[680px] lg:h-[750px] z-10 map-canvas-interactive zoo-map-container"
              style={{ background: '#0B2419' }}
            />

            {/* Top Bar: Navigation & Status Pill in English + Official Logo */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
              <div className="bg-forest-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-gold-500/30 text-xs text-ivory-100 flex items-center gap-2 shadow-xl pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-gold-300 font-semibold text-xs">
                  {activeMarker ? `Enclosure: ${activeMarker.animal_name || activeMarker.title}` : 'Nandankanan Sanctuary Map'}
                </span>
                <span className="text-[10px] text-ivory-300 hidden sm:inline">| Click any animal to view habitat details</span>
              </div>

              <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-xl border border-black/10 hidden md:flex items-center gap-1.5 pointer-events-auto">
                <img 
                  src="/images/nandankanan_logo.png" 
                  alt="Nandankanan Official Logo" 
                  className="h-6 w-auto object-contain"
                />
              </div>

              {isZoomedIn && (
                <button
                  onClick={handleShowAllAnimals}
                  className="px-3 py-1.5 rounded-xl bg-forest-950/90 hover:bg-forest-900 border border-gold-400 text-gold-300 hover:text-gold-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xl backdrop-blur-md transition-all animate-fadeIn"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Show Full Map</span>
                </button>
              )}
            </div>

            {/* Collapsed Panel Re-open Button (Top Right when panel closed) */}
            {!showSidePanel && activeMarker && (
              <button
                onClick={() => setShowSidePanel(true)}
                className="absolute top-4 right-4 z-20 px-3.5 py-2 rounded-xl bg-forest-950/95 hover:bg-forest-900 border border-gold-400 text-gold-300 hover:text-gold-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all animate-fadeIn"
                title="Open Animal Details"
              >
                <span>{activeMarker.emoji || '🐾'}</span>
                <span>{activeMarker.animal_name || activeMarker.title} (About)</span>
                <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
              </button>
            )}

            {/* Bottom Left Floating Controls & Legend */}
            <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-forest-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-gold-500/30 shadow-2xl">
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

              <div className="hidden sm:flex items-center gap-3 bg-forest-950/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-[11px] text-ivory-200 shadow-xl">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
                  <span>Safari Zones</span>
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
          </div>

          {/* Right: Animal Details Panel - Side-by-side Flexible Layout (Zero Map Overlap) */}
          {showSidePanel && activeMarker && (
            <aside
              aria-label="Animal Details"
              className="w-full lg:w-[380px] xl:w-[420px] shrink-0 flex flex-col justify-between bg-forest-950 border border-gold-500/30 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden h-[580px] sm:h-[680px] lg:h-[750px] transition-all animate-fadeIn"
            >
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-forest-900 via-forest-900 to-forest-950 border-b border-gold-500/25 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{activeMarker.emoji || '🐾'}</span>
                  <div>
                    <span className="text-sm font-bold text-gold-300 block leading-tight font-display tracking-wide">
                      {activeMarker.animal_name || activeMarker.title}
                    </span>
                    <span className="text-[10px] text-ivory-300 font-mono">
                      Exhibit #{activeMarker.id} • {activeMarker.badge_text || 'Sanctuary Habitat'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowSidePanel(false);
                    setActiveMarker(null);
                    setIsZoomedIn(false);
                  }}
                  className="p-1.5 rounded-lg bg-forest-800/80 hover:bg-forest-700 text-ivory-300 hover:text-gold-300 transition-colors"
                  title="Close Animal Details Panel"
                  aria-label="Close animal details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Animal Details Body */}
              <div className="p-4 overflow-y-auto space-y-3.5 flex-1 scrollbar-thin">
                {/* Photo with Badge */}
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-gold-500/30 bg-black shadow-lg shrink-0">
                  <img
                    src={activeMarker.photo_url || '/images/royal_bengal_tiger.jpg'}
                    alt={activeMarker.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-forest-950/90 text-gold-300 border border-gold-500/40 backdrop-blur-md uppercase tracking-wider">
                      {activeMarker.badge_text || 'Sanctuary Habitat'}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-3 px-2.5 py-0.5 rounded bg-black/75 text-[10px] text-ivory-200 font-mono backdrop-blur-sm">
                    {activeMarker.animal_name || activeMarker.title}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-ivory-50 leading-tight">
                    {activeMarker.title}
                  </h3>
                  <p className="text-xs text-gold-400 font-medium mt-1">
                    {activeMarker.animal_name || activeMarker.title}
                  </p>
                </div>

                {/* About Habitat Section */}
                <div className="p-3.5 rounded-2xl bg-forest-900/80 border border-gold-500/20 space-y-2 text-xs">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gold-400">
                    About This Habitat & Animal:
                  </div>
                  <p className="text-xs text-ivory-100 leading-relaxed font-normal">
                    {activeMarker.description}
                  </p>
                </div>

                {/* The Place Around This Habitat */}
                <div className="p-3.5 rounded-2xl bg-forest-900/90 border border-gold-500/25 space-y-2.5 text-xs">
                  <div className="flex items-center gap-1.5 text-gold-300 font-bold uppercase tracking-wider text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-gold-400" />
                    <span>The Place Around This Habitat</span>
                  </div>
                  <p className="text-xs text-ivory-100 leading-relaxed">
                    {activeMarker.surrounding_place || 'Natural forested sanctuary zone surrounded by Sal woodlands, water moats, and visitor walking trails.'}
                  </p>
                  {activeMarker.nearby_landmarks && (
                    <div className="pt-2.5 border-t border-forest-800/80 flex items-start gap-1.5 text-[11px] text-ivory-300/90">
                      <Footprints className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                      <span><strong>Nearby Landmarks:</strong> {activeMarker.nearby_landmarks}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Action Buttons */}
              <div className="p-4 bg-forest-900/95 border-t border-gold-500/20 flex items-center gap-2.5 shrink-0">
                {activeMarker.animal_slug && (
                  <button
                    onClick={() => {
                      if (onSelectAnimalBySlug) onSelectAnimalBySlug(activeMarker.animal_slug);
                      const el = document.getElementById('explore-animals');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C8A96B] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#071810] font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-1.5 border border-amber-200/60"
                  >
                    <span>Explore Species Profile</span>
                    <span>→</span>
                  </button>
                )}
                <button
                  onClick={handleShowAllAnimals}
                  className="px-3.5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-ivory-200 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5"
                  title="Show Entire Zoo Map"
                >
                  <Navigation className="w-3.5 h-3.5 text-gold-400" />
                  <span className="hidden sm:inline text-xs">Full Map</span>
                </button>
              </div>
            </aside>
          )}
        </div>

        {/* Scoped Leaflet Sanctuary Dark Gold Animal Popup Styles */}
        <style>{`
          /* Ultra-HD Map Crispness & Contrast Optimization */
          .official-zoo-map-layer,
          .zoo-map-container img.leaflet-image-layer {
            image-rendering: auto !important;
            image-rendering: high-quality !important;
            image-rendering: -webkit-optimize-contrast;
            filter: contrast(1.03) saturate(1.05) brightness(1.01) !important;
            transform: translate3d(0, 0, 0);
            -webkit-transform: translate3d(0, 0, 0);
            will-change: auto !important;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }

          .custom-leaflet-animal-popup .leaflet-popup-content-wrapper {
            background: rgba(11, 36, 25, 0.96) !important;
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1.5px solid rgba(200, 169, 107, 0.45) !important;
            border-radius: 20px !important;
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.85), 0 0 25px rgba(200, 169, 107, 0.2) !important;
            color: #F5F4EA !important;
            padding: 0 !important;
            overflow: hidden;
          }
          .custom-leaflet-animal-popup .leaflet-popup-content {
            margin: 0 !important;
            line-height: 1.4 !important;
            width: 290px !important;
          }
          .custom-leaflet-animal-popup .leaflet-popup-tip-container {
            overflow: visible;
          }
          .custom-leaflet-animal-popup .leaflet-popup-tip {
            background: rgba(11, 36, 25, 0.96) !important;
            border: 1.5px solid rgba(200, 169, 107, 0.45) !important;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6) !important;
          }
          .custom-leaflet-animal-popup a.leaflet-popup-close-button {
            color: #C8A96B !important;
            top: 10px !important;
            right: 10px !important;
            width: 26px !important;
            height: 26px !important;
            line-height: 24px !important;
            text-align: center !important;
            background: rgba(7, 29, 18, 0.85) !important;
            border-radius: 50% !important;
            border: 1px solid rgba(200, 169, 107, 0.4) !important;
            font-size: 14px !important;
            font-weight: bold !important;
            transition: all 0.2s ease !important;
            z-index: 20 !important;
          }
          .custom-leaflet-animal-popup a.leaflet-popup-close-button:hover {
            background: #C8A96B !important;
            color: #071D12 !important;
          }
          .sanctuary-map-popup {
            display: flex;
            flex-direction: column;
          }
          .sanctuary-map-popup .popup-image-wrap {
            position: relative;
            width: 100%;
            height: 130px;
            overflow: hidden;
            background: #000;
          }
          .sanctuary-map-popup .popup-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }
          .sanctuary-map-popup .popup-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            padding: 3px 8px;
            border-radius: 8px;
            background: rgba(11, 36, 25, 0.88);
            border: 1px solid rgba(200, 169, 107, 0.5);
            backdrop-filter: blur(8px);
            color: #C8A96B;
            font-size: 9.5px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .sanctuary-map-popup .popup-grid-id {
            position: absolute;
            bottom: 8px;
            right: 10px;
            font-size: 9px;
            color: #E5E7EB;
            background: rgba(0, 0, 0, 0.6);
            padding: 2px 6px;
            border-radius: 6px;
            font-family: monospace;
          }
          .sanctuary-map-popup .popup-body {
            padding: 12px 14px 14px;
          }
          .sanctuary-map-popup .popup-title-row {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 5px;
          }
          .sanctuary-map-popup .popup-emoji {
            font-size: 16px;
          }
          .sanctuary-map-popup .popup-title {
            margin: 0;
            font-size: 14.5px;
            font-weight: 800;
            color: #F5F4EA;
            font-family: 'Cinzel', serif, Georgia;
            letter-spacing: 0.02em;
          }
          .sanctuary-map-popup .popup-desc {
            margin: 0 0 10px;
            font-size: 11px;
            color: rgba(245, 244, 234, 0.82);
            line-height: 1.45;
          }
          .sanctuary-map-popup .popup-habitat-box {
            padding: 8px 10px;
            border-radius: 10px;
            background: rgba(7, 29, 18, 0.8);
            border: 1px solid rgba(200, 169, 107, 0.25);
            margin-bottom: 10px;
          }
          .sanctuary-map-popup .popup-habitat-label {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 9.5px;
            font-weight: 700;
            color: #C8A96B;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            margin-bottom: 3px;
          }
          .sanctuary-map-popup .popup-habitat-text {
            margin: 0;
            font-size: 10.5px;
            color: rgba(245, 244, 234, 0.88);
            line-height: 1.35;
          }
          .sanctuary-map-popup .popup-landmarks {
            display: flex;
            align-items: flex-start;
            gap: 4px;
            margin-top: 5px;
            padding-top: 5px;
            border-top: 1px solid rgba(200, 169, 107, 0.15);
            font-size: 9.5px;
            color: rgba(245, 244, 234, 0.7);
          }
          .sanctuary-map-popup .popup-actions {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .sanctuary-map-popup .popup-profile-btn {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 7px 12px;
            border-radius: 10px;
            background: linear-gradient(135deg, #C8A96B, #9E7D3B);
            color: #071D12;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(200, 169, 107, 0.35);
            transition: all 0.2s ease;
          }
          .sanctuary-map-popup .popup-profile-btn:hover {
            filter: brightness(1.15);
            transform: translateY(-1px);
          }
        `}</style>
      </div>

    </section>
  );
}
