import React, { useEffect, useRef, useState, useCallback } from 'react';
import OpenSeadragon from 'openseadragon';
import './InteractiveMap3D.css';

/* ─────────────────────────────────────────────────────────────
   NANDANKANAN HIGH-RESOLUTION DEEP-ZOOM 3D MAP
   - Google Maps-style Deep Zoom using OpenSeadragon & DZI Pyramids
   - Native 4K Progressive Tiling (Zero blur, sub-pixel sharpness)
   - Smooth mouse wheel, pinch-to-zoom, momentum panning, inertia
   - Interactive Enclosures: Elephant, Lion, Tiger, Bear, Herbivore, etc.
   - Glassmorphism Forest-Green UI with responsive controls & drawer
───────────────────────────────────────────────────────────── */

// Coordinate mapping from 1024×571 illustrated space to normalized DZI (width=1.0, aspect=0.5)
const MAP_ASPECT = 2048 / 4096; // 0.5

function mapToNormalized(map_x, map_y) {
  const norm_x = map_x / 1024.0;
  const norm_y = ((571.0 - map_y) / 571.0) * MAP_ASPECT;
  return { x: norm_x, y: norm_y };
}

// 5 Priority Safaris highlighted upfront
const PRIMARY_SAFARIS = ['Royal Bengal Tiger', 'White Tiger', 'Asiatic Lion', 'Asian Elephant', 'Sloth Bear', 'Spotted Deer'];

export default function InteractiveMap3D({ markers = [], onSelectAnimalBySlug, onOpenLiveCam, embedded = false }) {
  const osdContainerRef  = useRef(null);
  const viewerRef        = useRef(null);
  const overlaysRef      = useRef([]);
  const auraOverlayRef   = useRef(null);

  const [activeMarker, setActiveMarker]   = useState(null);
  const [filterCat, setFilterCat]         = useState('all');
  const [zoomPercent, setZoomPercent]     = useState(100);
  const [isFullscreen, setIsFullscreen]   = useState(false);
  const [navigationTip, setNavigationTip] = useState(null);

  /* ─────────────────────────── INITIALIZE OPENSEADRAGON ─────────────────────────── */
  useEffect(() => {
    if (!osdContainerRef.current) return;

    // Initialize viewer
    const viewer = OpenSeadragon({
      element: osdContainerRef.current,
      prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.1/images/',
      tileSources: '/dz/nandankanan_zoo_3d.dzi',
      showNavigationControl: false, // Custom glassmorphism controls
      showNavigator: true,
      navigatorPosition: 'BOTTOM_RIGHT',
      navigatorSizeRatio: 0.16,
      navigatorAutoFade: false,
      animationTime: 0.9,
      springStiffness: 8.5,
      zoomPerClick: 1.8,
      zoomPerScroll: 1.25,
      minZoomImageRatio: 0.85,
      maxZoomPixelRatio: 3.2, // Deep zoom right down to animal enclosures
      visibilityRatio: 0.85,
      constrainDuringPan: true,
      preserveImageSizeOnResize: true,
      gestureSettingsMouse: {
        clickToZoom: false,
        dblClickToZoom: true,
        pinchToZoom: true,
        scrollToZoom: true,
      },
      gestureSettingsTouch: {
        pinchToZoom: true,
        flickEnabled: true,
      },
    });

    viewerRef.current = viewer;

    // Track zoom percentage
    const updateZoomDisplay = () => {
      if (!viewer.viewport) return;
      const z = viewer.viewport.getZoom(true);
      const homeZ = viewer.viewport.getHomeZoom();
      const pct = Math.round((z / homeZ) * 100);
      setZoomPercent(pct);
    };

    viewer.addHandler('zoom', updateZoomDisplay);
    viewer.addHandler('animation', updateZoomDisplay);

    // Fullscreen tracking
    viewer.addHandler('full-screen', (e) => {
      setIsFullscreen(e.fullScreen);
    });

    // Cleanup
    return () => {
      viewer.destroy();
      viewerRef.current = null;
    };
  }, []);

  /* ─────────────────────────── OVERLAYS CREATION ─────────────────────────── */
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    // Wait for viewer to be open
    const onOpen = () => {
      // Clear previous overlays
      overlaysRef.current.forEach((el) => viewer.removeOverlay(el));
      overlaysRef.current = [];

      markers.forEach((marker) => {
        const { x, y } = mapToNormalized(marker.map_x, marker.map_y);
        const isPrimary = PRIMARY_SAFARIS.includes(marker.animal_name);

        const el = document.createElement('div');
        el.className = `enclosure-tag ${isPrimary ? 'tag-primary' : ''}`;
        el.id = `tag-${marker.animal_slug || marker.id}`;

        el.innerHTML = `
          <span class="tag-emoji">${marker.emoji || '🐾'}</span>
          <span class="tag-title">${marker.animal_name}</span>
        `;

        const onTrigger = (e) => {
          if (e && e.stopPropagation) e.stopPropagation();
          handleSelectEnclosure(marker);
        };

        el.addEventListener('click', onTrigger);
        el.addEventListener('touchend', onTrigger);

        new OpenSeadragon.MouseTracker({
          element: el,
          clickHandler: onTrigger,
        });

        viewer.addOverlay({
          element: el,
          location: new OpenSeadragon.Point(x, y),
          placement: OpenSeadragon.Placement.CENTER,
          checkResize: false,
        });

        overlaysRef.current.push(el);
      });
    };

    if (viewer.isOpen()) {
      onOpen();
    } else {
      viewer.addOnceHandler('open', onOpen);
    }
  }, [markers]);

  /* ── Filter visibility of tags ── */
  useEffect(() => {
    markers.forEach((marker) => {
      const el = document.getElementById(`tag-${marker.animal_slug || marker.id}`);
      if (!el) return;
      const visible = filterCat === 'all' || marker.category === filterCat;
      el.style.display = visible ? 'inline-flex' : 'none';
    });
  }, [filterCat, markers]);

  /* ─────────────────────────── SELECT & ZOOM TO ENCLOSURE ─────────────────────────── */
  const handleSelectEnclosure = useCallback((marker) => {
    setActiveMarker(marker);
    setNavigationTip(null);
    const viewer = viewerRef.current;
    if (!viewer || !viewer.viewport) return;

    const { x, y } = mapToNormalized(marker.map_x, marker.map_y);
    const targetPoint = new OpenSeadragon.Point(x, y);

    // Dynamic drawer offset:
    // On desktop, the drawer occupies the right 32% (up to 420px) of the viewport.
    // Shifting the pan center rightward by half the drawer's width frames the animal
    // perfectly in the unobstructed visible viewport on the left (matching Image 2).
    const containerWidth = viewer.container ? viewer.container.clientWidth : 1000;
    const isMobile = containerWidth < 768;
    const drawerPx = isMobile ? 0 : Math.min(containerWidth * 0.33, 400);
    const deltaX = viewer.viewport.deltaPointsFromPixels(new OpenSeadragon.Point(drawerPx / 2, 0)).x;
    const panTarget = new OpenSeadragon.Point(x + deltaX, y);

    // Smooth Google Maps-style glide and deep zoom to enclosure
    viewer.viewport.panTo(panTarget, false);
    viewer.viewport.zoomTo(viewer.viewport.getHomeZoom() * 2.4, targetPoint, false);

    // Update active class on tags
    overlaysRef.current.forEach((el) => el.classList.remove('tag-active'));
    const activeEl = document.getElementById(`tag-${marker.animal_slug || marker.id}`);
    if (activeEl) activeEl.classList.add('tag-active');

    // Add glowing enclosure aura pulse
    if (auraOverlayRef.current) {
      viewer.removeOverlay(auraOverlayRef.current);
      auraOverlayRef.current = null;
    }

    const aura = document.createElement('div');
    aura.className = 'enclosure-aura';
    viewer.addOverlay({
      element: aura,
      location: targetPoint,
      placement: OpenSeadragon.Placement.CENTER,
    });
    auraOverlayRef.current = aura;
  }, []);

  /* ── Navigate Here (Deep Enclosure Zoom + Route Advice) ── */
  const handleNavigateHere = () => {
    if (!activeMarker || !viewerRef.current) return;
    const viewer = viewerRef.current;
    const { x, y } = mapToNormalized(activeMarker.map_x, activeMarker.map_y);
    const pt = new OpenSeadragon.Point(x, y);

    // Maximum enclosure resolution zoom
    viewer.viewport.panTo(pt, false);
    viewer.viewport.zoomTo(viewer.viewport.getHomeZoom() * 3.0, pt, false);

    // Set walking path hint
    setNavigationTip(
      `🚶 Walk along Northern Safari Ring Road from Main Gate towards ${activeMarker.nearby_landmarks || 'the habitat entry point'}.`
    );
  };

  /* ── Zoom Controls ── */
  const handleZoom = (dir) => {
    const viewer = viewerRef.current;
    if (!viewer || !viewer.viewport) return;
    const current = viewer.viewport.getZoom();
    const factor = dir === 'in' ? 1.5 : 0.67;
    viewer.viewport.zoomTo(current * factor, null, false);
  };

  const handleReset = () => {
    const viewer = viewerRef.current;
    if (!viewer || !viewer.viewport) return;
    viewer.viewport.goHome(false);
    if (auraOverlayRef.current) {
      viewer.removeOverlay(auraOverlayRef.current);
      auraOverlayRef.current = null;
    }
    overlaysRef.current.forEach((el) => el.classList.remove('tag-active'));
    setActiveMarker(null);
    setNavigationTip(null);
  };

  const handleToggleFullscreen = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.setFullScreen(!viewer.isFullScreen());
  };

  return (
    <section id={embedded ? undefined : "interactive-map"} className={embedded ? "w-full" : "nandankanan-map-wrapper py-20 bg-[#041009] text-[#F5F4EA] relative overflow-hidden"}>
      <div className={embedded ? "w-full" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"}>
        {/* ── Section Header (Standalone Only) ── */}
        {!embedded && (
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-[#C8A96B]/15 border border-[#C8A96B]/40 rounded-full px-4 py-1.5 mb-3 backdrop-blur-md">
              <span className="text-sm">🗺️</span>
              <span className="text-[#C8A96B] text-xs font-bold tracking-widest uppercase">Deep Zoom High-Resolution 3D Map</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#F5F4EA] tracking-tight">
              NANDANKANAN <span className="text-[#C8A96B]">PARK EXPLORER</span>
            </h2>
            <p className="text-[#a4c2ad] mt-2 text-xs md:text-sm max-w-2xl mx-auto">
              Powered by high-resolution tiled pyramid rendering. Zoom smoothly from the entire sanctuary right down to individual animal enclosures with perfect clarity.
            </p>

            {/* ── Category Filters ── */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {[
                { id: 'all', label: 'All Enclosures', icon: '🌍' },
                { id: 'safari_zone', label: 'Safari Safaris', icon: '🦁' },
                { id: 'animal_habitat', label: 'Habitats', icon: '🐘' },
                { id: 'mammal', label: 'Mammals', icon: '🐻' },
                { id: 'bird', label: 'Aviaries', icon: '🦚' },
                { id: 'reptile', label: 'Reptile Sanctuary', icon: '🐊' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCat(cat.id)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5"
                  style={{
                    background: filterCat === cat.id ? '#C8A96B' : 'rgba(255,255,255,0.05)',
                    color: filterCat === cat.id ? '#041009' : '#c9dfd0',
                    border: `1px solid ${filterCat === cat.id ? '#C8A96B' : 'rgba(200,169,107,0.2)'}`,
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Main Map Viewport ── */}
        <div className={`osd-viewport-container relative rounded-3xl overflow-hidden border border-[#C8A96B]/30 shadow-2xl bg-black ${embedded ? 'h-[620px] sm:h-[680px]' : ''}`}>
          {/* OpenSeadragon Mount */}
          <div ref={osdContainerRef} className="w-full h-full" tabIndex={0} />

          {/* ── Top-Left HUD: Resolution & Status ── */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
            <div className="glass-panel px-3.5 py-2 rounded-xl flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[#F5F4EA] font-extrabold text-xs tracking-wider uppercase">Nandankanan 3D Map</span>
                <span className="text-[#C8A96B] font-mono text-[10px]">4K DZI Progressive Tiles</span>
              </div>
              <div className="h-6 w-px bg-white/20 mx-1" />
              <div className="flex flex-col">
                <span className="text-[#a4c2ad] text-[9px] uppercase font-bold">Zoom</span>
                <span className="text-[#34D399] font-mono font-bold text-xs">{zoomPercent}%</span>
              </div>
            </div>

            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1 text-[10px] text-[#a4c2ad] flex items-center gap-1.5 w-fit">
              <span>🖱️</span>
              <span>Scroll to zoom · Drag to navigate · Click enclosure to focus</span>
            </div>
          </div>

          {/* ── Top-Right Quick Safari Jump Buttons ── */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <div className="glass-panel p-1.5 rounded-xl hidden md:flex items-center gap-1.5">
              <span className="text-[10px] text-[#C8A96B] font-bold uppercase tracking-wider px-2">Safaris:</span>
              {[
                { name: 'Tiger Safari', slug: 'tiger-safari', emoji: '🐅' },
                { name: 'Lion Safari', slug: 'lion-safari', emoji: '🦁' },
                { name: 'Elephant Safari', slug: 'elephant-safari', emoji: '🐘' },
                { name: 'Bear Safari', slug: 'bear-safari', emoji: '🐻' },
                { name: 'Herbivore Safari', slug: 'herbivore-safari', emoji: '🦌' },
              ].map((s) => {
                const target = markers.find((m) => m.animal_slug?.includes(s.slug.split('-')[0]) || m.animal_name?.toLowerCase().includes(s.slug.split('-')[0]));
                return (
                  <button
                    key={s.slug}
                    onClick={() => target && handleSelectEnclosure(target)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#d3e8db] hover:bg-[#C8A96B] hover:text-[#071D12] transition-all flex items-center gap-1"
                  >
                    <span>{s.emoji}</span>
                    <span>{s.name.replace(' Safari', '')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Floating Zoom & Reset Glass Controls (Bottom-Left) ── */}
          <div className="absolute bottom-6 left-4 z-20 flex flex-col gap-2">
            <button
              onClick={() => handleZoom('in')}
              title="Zoom In"
              className="zoom-btn"
            >
              +
            </button>
            <button
              onClick={() => handleZoom('out')}
              title="Zoom Out"
              className="zoom-btn"
            >
              −
            </button>
            <button
              onClick={handleReset}
              title="Reset View"
              className="zoom-btn text-sm"
            >
              ⌂
            </button>
            <button
              onClick={handleToggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
              className="zoom-btn text-sm"
            >
              {isFullscreen ? '⊠' : '⛶'}
            </button>
          </div>

          {/* ── Interactive Animal Enclosure Slide-Over Drawer ── */}
          {activeMarker && (
            <div className="enclosure-drawer custom-scrollbar">
              {/* Photo Banner */}
              <div className="relative h-48 shrink-0 overflow-hidden bg-black/40">
                {activeMarker.photo_url ? (
                  <img
                    src={activeMarker.photo_url}
                    alt={activeMarker.animal_name}
                    className="w-full h-full object-cover object-[center_35%]"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    {activeMarker.emoji || '🐾'}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#041009] via-transparent to-black/30" />

                {/* Close Button */}
                <button
                  onClick={() => {
                    setActiveMarker(null);
                    setNavigationTip(null);
                    if (auraOverlayRef.current && viewerRef.current) {
                      viewerRef.current.removeOverlay(auraOverlayRef.current);
                      auraOverlayRef.current = null;
                    }
                    overlaysRef.current.forEach((el) => el.classList.remove('tag-active'));
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-[#C8A96B] hover:text-[#071D12] transition-all font-bold text-sm"
                >
                  ✕
                </button>

                {/* Status Pill */}
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider bg-[#C8A96B] text-[#071D12]">
                    {activeMarker.emoji} {activeMarker.badge_text || activeMarker.category}
                  </span>
                </div>
              </div>

              {/* Drawer Body */}
              <div className="p-5 flex flex-col gap-4 flex-1">
                <div>
                  <h3 className="text-2xl font-black text-[#F5F4EA] leading-tight tracking-tight">
                    {activeMarker.animal_name}
                  </h3>
                  <span className="text-[#C8A96B] font-mono text-xs uppercase tracking-widest">
                    Nandankanan Enclosure
                  </span>
                </div>

                {activeMarker.description && (
                  <p className="text-[#a4c2ad] text-xs leading-relaxed">
                    {activeMarker.description}
                  </p>
                )}

                {/* Territory description */}
                {activeMarker.surrounding_place && (
                  <div className="bg-[#071D12]/80 border border-[#C8A96B]/20 rounded-xl p-3">
                    <span className="text-[#C8A96B] text-[10px] font-bold uppercase tracking-wider block mb-1">
                      📍 Enclosure Environment
                    </span>
                    <p className="text-xs text-[#d8e8dc] leading-relaxed">
                      {activeMarker.surrounding_place}
                    </p>
                  </div>
                )}

                {/* Nearby landmarks */}
                {activeMarker.nearby_landmarks && (
                  <div className="bg-[#071D12]/80 border border-emerald-500/20 rounded-xl p-3">
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider block mb-1">
                      🏛️ Nearby Sights
                    </span>
                    <p className="text-xs text-[#d8e8dc] leading-relaxed">
                      {activeMarker.nearby_landmarks}
                    </p>
                  </div>
                )}

                {/* Navigation Tip Notice */}
                {navigationTip && (
                  <div className="bg-emerald-950/60 border border-emerald-400/50 rounded-xl p-3 animate-in fade-in">
                    <span className="text-emerald-300 font-bold text-xs block mb-1">🧭 Navigation Route:</span>
                    <p className="text-xs text-[#d8e8dc] leading-relaxed">{navigationTip}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 mt-auto pt-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleNavigateHere}
                      className="py-2.5 px-3 rounded-xl text-xs font-bold tracking-wide uppercase transition-all bg-[#071D12] border border-[#C8A96B]/50 text-[#C8A96B] hover:bg-[#C8A96B] hover:text-[#071D12] flex items-center justify-center gap-1.5 shadow"
                    >
                      <span>🧭</span>
                      <span>Navigate Here</span>
                    </button>

                    {activeMarker.animal_slug && onSelectAnimalBySlug && (
                      <button
                        onClick={() => onSelectAnimalBySlug(activeMarker.animal_slug)}
                        className="py-2.5 px-3 rounded-xl text-xs font-black tracking-wide uppercase transition-all shadow bg-gradient-to-r from-[#C8A96B] to-[#eab308] text-[#071D12] flex items-center justify-center gap-1.5"
                      >
                        <span>🦁</span>
                        <span>View Details</span>
                      </button>
                    )}
                  </div>

                  {onOpenLiveCam && (
                    <button
                      onClick={() => onOpenLiveCam({ name: activeMarker.animal_name, url: activeMarker.stream_url || '' })}
                      className="w-full py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/10 flex items-center justify-center gap-1.5"
                    >
                      <span>📡</span>
                      <span>Watch Live Stream</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Quick Habitat Selector Carousel Strip (Bottom, Standalone Only) ── */}
        {!embedded && (
          <div className="mt-5 flex gap-3 overflow-x-auto pb-3 custom-scrollbar">
            {markers.map((m) => {
              const isSelected = activeMarker?.animal_name === m.animal_name;
              const isPrimary = PRIMARY_SAFARIS.includes(m.animal_name);
              return (
                <button
                  key={m.id || m.animal_slug}
                  onClick={() => handleSelectEnclosure(m)}
                  className={`quick-habitat-card ${isSelected ? 'card-selected' : ''}`}
                  style={{
                    borderColor: isPrimary ? 'rgba(245, 158, 11, 0.4)' : undefined,
                  }}
                >
                  <span className="text-2xl">{m.emoji || '🐾'}</span>
                  <div className="text-left">
                    <div className="text-xs font-bold text-[#F5F4EA] whitespace-nowrap">{m.animal_name}</div>
                    <div className="text-[9px] text-[#C8A96B] font-mono uppercase">
                      {isPrimary ? '⭐ ' : ''}{m.badge_text ? m.badge_text.slice(0, 18) : m.category}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
