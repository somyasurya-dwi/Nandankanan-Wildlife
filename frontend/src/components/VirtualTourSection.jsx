import React, { useState } from 'react';
import { Eye, RotateCw, Compass, Sparkles, ArrowRight, Layers } from 'lucide-react';

export default function VirtualTourSection() {
  const [activeTourIndex, setActiveTourIndex] = useState(0);

  const tours = [
    {
      id: 1,
      title: "Royal Bengal Tiger Territory",
      habitat: "Dense Sal & Bamboo Forest",
      desc: "Stand in the middle of Sector A tiger territory as the apex predator surveys the riparian corridor.",
      image: "/images/sanctuary_forest.jpg",
      hotspots: [
        { label: "Water Pool Feeder", x: "32%", y: "65%" },
        { label: "Basking Rock Ledge", x: "68%", y: "45%" },
      ]
    },
    {
      id: 2,
      title: "Kanjia Lake Eco-Sanctuary",
      habitat: "66-Hectare Freshwater Wetland",
      desc: "Immerse yourself along the tranquil waters of Kanjia Lake surrounded by migratory bird nesting islands.",
      image: "/images/kanjia_lake.jpg",
      hotspots: [
        { label: "Migratory Island", x: "48%", y: "40%" },
        { label: "Ropeway Crossing", x: "78%", y: "30%" },
      ]
    },
    {
      id: 3,
      title: "Asian Elephant Meadow",
      habitat: "Moist Deciduous Wallow",
      desc: "Watch the herd foraging along the natural mud pits and bathing streams of Nandankanan.",
      image: "/images/asian_elephant.jpg",
      hotspots: [
        { label: "Mud Bathing Station", x: "55%", y: "60%" },
      ]
    }
  ];

  const currentTour = tours[activeTourIndex];

  return (
    <section className="py-28 bg-[#0B2A1A] text-[#F4F1E8] relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F28C1B]" />
              <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#F28C1B] font-bold">
                IMMERSIVE EXPLORATION
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif text-[#F4F1E8] leading-tight">
              360° Virtual Safari. <br />
              <span className="font-editorial italic font-normal text-[#A7D7A9]">Step inside their sanctuary.</span>
            </h2>
          </div>

          {/* Tour Switcher Tabs */}
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
            {tours.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setActiveTourIndex(idx)}
                className={`text-xs px-4 py-2 rounded-full font-semibold transition-all ${
                  activeTourIndex === idx
                    ? 'bg-[#14532D] text-white shadow-lg'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {t.title.split(' ')[0]} {t.title.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* 360 Panoramic Viewer Frame */}
        <div className="relative aspect-[16/9] max-h-[580px] rounded-3xl overflow-hidden border border-white/15 bg-black shadow-2xl group cursor-grab">
          <img 
            src={currentTour.image} 
            alt={currentTour.title}
            className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out filter brightness-95" 
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Interactive Hotspots */}
          {currentTour.hotspots.map((hs, i) => (
            <div
              key={i}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group/spot cursor-pointer"
              style={{ left: hs.x, top: hs.y }}
            >
              <div className="relative flex items-center justify-center">
                <span className="w-8 h-8 rounded-full bg-[#F28C1B]/40 animate-ping absolute" />
                <span className="w-5 h-5 rounded-full bg-[#F28C1B] border-2 border-white flex items-center justify-center shadow-xl">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </span>
                {/* Tooltip */}
                <span className="absolute bottom-full mb-2 opacity-0 group-hover/spot:opacity-100 transition-opacity bg-black/90 text-white font-mono text-[10px] px-2.5 py-1 rounded-md whitespace-nowrap border border-white/20">
                  {hs.label}
                </span>
              </div>
            </div>
          ))}

          {/* Drag to rotate hint */}
          <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-white/80">
            <RotateCw className="w-3.5 h-3.5 text-[#F28C1B] animate-spin" />
            <span>360° Pan Active</span>
          </div>

          {/* Bottom Bar Info */}
          <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#F28C1B] font-mono font-bold mb-1">
                {currentTour.habitat}
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-white font-bold mb-1">
                {currentTour.title}
              </h3>
              <p className="text-xs text-white/70 max-w-lg">
                {currentTour.desc}
              </p>
            </div>

            <button
              onClick={() => alert(`Starting full-screen 360° Photo Sphere tour of ${currentTour.title}`)}
              className="px-6 py-3 rounded-full bg-[#14532D] hover:bg-[#2E7D32] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto shadow-xl"
            >
              <span>Enter 360° Sphere</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F28C1B]" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

