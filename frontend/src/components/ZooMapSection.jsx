import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Compass, Layers, Info, Filter, ArrowUpRight, Check, ExternalLink } from 'lucide-react';

export default function ZooMapSection({ language }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLineRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [mapMode, setMapMode] = useState('illustrated'); // 'illustrated' | 'satellite'

  // Exact coordinates of Nandankanan Zoological Park
  const NANDANKANAN_COORDS = [20.4020, 85.8190];

  const zooLocations = [
    {
      id: 1,
      title: "Royal Bengal Tiger Safari",
      category: "safari",
      coords: [20.4055, 85.8145],
      photo: "/images/royal_bengal_tiger.jpg",
      timings: "09:00 AM - 04:30 PM",
      desc: "Open forest safari where Bengal tigers roam free through 12 hectares of natural deciduous jungle.",
      highlight: "Protected natural corridor"
    },
    {
      id: 2,
      title: "White Tiger Sanctuary",
      category: "carnivore",
      coords: [20.4030, 85.8175],
      photo: "/images/white_tiger.jpg?v=20261123",
      timings: "08:00 AM - 05:00 PM",
      desc: "Birthplace of the world's first captive-bred white tiger lineage from normal parents (1980).",
      highlight: "Historic birthplace"
    },
    {
      id: 3,
      title: "Asiatic Lion Safari",
      category: "safari",
      coords: [20.4070, 85.8130],
      photo: "/images/asiatic_lion.jpg",
      timings: "09:00 AM - 04:30 PM",
      desc: "Vast rocky terrain safari simulating the Gir forest ecosystem with basking prides.",
      highlight: "Open safari buses"
    },
    {
      id: 4,
      title: "Asian Elephant Meadow",
      category: "herbivore",
      coords: [20.3985, 85.8205],
      photo: "/images/asian_elephant.jpg",
      timings: "08:00 AM - 05:00 PM",
      desc: "Spacious elephant habitat with natural watering pools and mud baths bordering Kanjia lake.",
      highlight: "Bathing hours 10:30 AM"
    },
    {
      id: 5,
      title: "Reptile Park & King Cobra House",
      category: "reptile",
      coords: [20.4005, 85.8210],
      photo: "/images/king_cobra.jpg",
      timings: "08:30 AM - 05:00 PM",
      desc: "India's premier enclosure housing the majestic King Cobra, Gharials, and saltwater crocodiles.",
      highlight: "Climate-controlled vivariums"
    },
    {
      id: 6,
      title: "Kanjia Lake Eco-Zone & Boating",
      category: "lake",
      coords: [20.4045, 85.8240],
      photo: "/images/kanjia_lake.jpg",
      timings: "08:00 AM - 05:00 PM",
      desc: "66-hectare natural wetland of national importance hosting over 100 migratory bird species.",
      highlight: "Eco-paddle boating"
    },
    {
      id: 7,
      title: "Aerial Monocable Ropeway",
      category: "facility",
      coords: [20.4035, 85.8215],
      photo: "/images/sanctuary_forest.jpg",
      timings: "09:00 AM - 05:00 PM",
      desc: "628-meter aerial ropeway gliding over Kanjia Lake into the botanical sanctuary.",
      highlight: "Bird's-eye panoramic view"
    },
    {
      id: 8,
      title: "Historic Toy Train Station",
      category: "facility",
      coords: [20.3975, 85.8235],
      photo: "/images/sanctuary_forest.jpg",
      timings: "08:30 AM - 04:30 PM",
      desc: "Scenic 1.58 km narrow-gauge railway tour passing lush woodland habitats.",
      highlight: "Family favorite"
    },
    {
      id: 9,
      title: "Visitor Plaza & Main Entrance",
      category: "facility",
      coords: [20.3955, 85.8250],
      photo: "/images/nandankanan_logo.png",
      timings: "07:30 AM - 05:30 PM",
      desc: "Main ticketing counters, information kiosk, lockers, battery operated vehicles, and parking.",
      highlight: "Entry gate"
    }
  ];

  const categories = [
    { id: 'all', label: 'All Locations' },
    { id: 'safari', label: 'Safaris' },
    { id: 'carnivore', label: 'Carnivores' },
    { id: 'herbivore', label: 'Herbivores' },
    { id: 'reptile', label: 'Reptiles' },
    { id: 'lake', label: 'Kanjia Lake' },
    { id: 'facility', label: 'Visitor Facilities' },
  ];

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: NANDANKANAN_COORDS,
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: false,
    });
    mapInstanceRef.current = map;

    // Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | Nandankanan GIS',
      maxZoom: 18,
    }).addTo(map);

    // Layer group for markers
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    // Render Markers
    renderMarkers(zooLocations);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const renderMarkers = (locations) => {
    if (!markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    locations.forEach((loc) => {
      const isSafari = loc.category === 'safari';
      const isFacility = loc.category === 'facility';

      const customIcon = L.divIcon({
        className: 'custom-zoo-pin',
        html: `
          <div style="
            background: ${isSafari ? '#F28C1B' : isFacility ? '#2E7D32' : '#14532D'};
            color: #fff;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid #FAF8F5;
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            font-size: 13px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            📍
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
      });

      const marker = L.marker(loc.coords, { icon: customIcon });
      marker.on('click', () => {
        setSelectedMarker(loc);
        mapInstanceRef.current.flyTo(loc.coords, 16, { duration: 0.8 });
      });
      markersLayerRef.current.addLayer(marker);
    });
  };

  // Filter Markers when category changes
  useEffect(() => {
    const filtered = activeCategory === 'all'
      ? zooLocations
      : zooLocations.filter((l) => l.category === activeCategory);
    renderMarkers(filtered);
  }, [activeCategory]);

  // "Near Me" Geolocation handler
  const handleNearMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        if (mapInstanceRef.current) {
          L.circleMarker(coords, {
            radius: 8,
            fillColor: '#3B82F6',
            color: '#FFFFFF',
            weight: 3,
            fillOpacity: 1,
          }).addTo(mapInstanceRef.current).bindPopup("You are here").openPopup();

          mapInstanceRef.current.flyTo(coords, 15);
        }
      },
      () => {
        // Fallback to Baranga / Nandankanan entrance
        alert("Using default Nandankanan Main Entrance location.");
        setUserLocation(NANDANKANAN_COORDS);
      }
    );
  };

  // Toggle Recommended Zoo Walking Route
  const handleToggleRoute = () => {
    if (!mapInstanceRef.current) return;
    if (showRoute) {
      if (routeLineRef.current) {
        mapInstanceRef.current.removeLayer(routeLineRef.current);
        routeLineRef.current = null;
      }
      setShowRoute(false);
    } else {
      const routePoints = zooLocations.map((l) => l.coords);
      const polyline = L.polyline(routePoints, {
        color: '#F28C1B',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.85,
      }).addTo(mapInstanceRef.current);
      routeLineRef.current = polyline;
      mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });
      setShowRoute(true);
    }
  };

  return (
    <section id="map" className="py-28 bg-[#F4F1E8] relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-5 h-[1.5px] bg-[#14532D]" />
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#14532D]">
                INTERACTIVE SANCTUARY MAP
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif text-[#0B2A1A] leading-tight">
              Explore 437 hectares. <br />
              <span className="font-editorial italic font-normal text-[#14532D]">Every habitat mapped.</span>
            </h2>
          </div>

          {/* Quick Map Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleNearMe}
              className="px-4 py-2.5 rounded-full bg-white border border-black/10 text-xs font-semibold text-[#0B2A1A] hover:border-[#14532D] shadow-sm flex items-center gap-2 transition-all"
            >
              <Navigation className="w-3.5 h-3.5 text-[#F28C1B]" />
              <span>Near Me</span>
            </button>

            <button
              onClick={handleToggleRoute}
              className={`px-4 py-2.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-2 transition-all ${
                showRoute 
                  ? 'bg-[#14532D] text-white' 
                  : 'bg-white border border-black/10 text-[#0B2A1A] hover:border-[#14532D]'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#F28C1B]" />
              <span>{showRoute ? 'Hide Safari Route' : 'Show Walking Route'}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-xs px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#14532D] text-[#F4F1E8] shadow-md'
                  : 'bg-white text-[#354035] hover:bg-[#14532D]/10 border border-black/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Map Container + Detail Card Overlay */}
        <div className="relative rounded-3xl overflow-hidden border border-black/10 shadow-2xl bg-white aspect-[16/10] sm:aspect-[16/9] max-h-[600px]">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Illustrated Guide Map Preview Toggle Button in Corner */}
          <div className="absolute top-4 right-4 z-20">
            <a
              href="/images/nandankanan_zoo_map.jpg"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-black/15 text-xs font-semibold text-[#0B2A1A] shadow-md hover:bg-[#14532D] hover:text-white transition-all flex items-center gap-2"
            >
              <span>View Illustrated Park Map</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Selected Location Card Popout */}
          {selectedMarker && (
            <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:w-80 z-20 bg-white/95 backdrop-blur-xl rounded-2xl p-4 border border-black/10 shadow-2xl animate-fade-in">
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-3 bg-black">
                <img 
                  src={selectedMarker.photo} 
                  alt={selectedMarker.title} 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#14532D] text-white font-mono text-[9px] font-bold">
                  {selectedMarker.highlight}
                </span>
              </div>

              <h4 className="font-serif font-bold text-base text-[#0B2A1A] mb-1">
                {selectedMarker.title}
              </h4>
              <p className="text-[11px] text-[#526359] leading-relaxed mb-3">
                {selectedMarker.desc}
              </p>

              <div className="pt-2 border-t border-black/10 flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] text-[#75887D]">
                  ⏱ {selectedMarker.timings}
                </span>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMarker.coords[0]},${selectedMarker.coords[1]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#14532D] hover:text-[#F28C1B] flex items-center gap-1"
                >
                  <span>Directions</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}

