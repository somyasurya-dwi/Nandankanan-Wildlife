import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Award, 
  Sparkles, 
  Leaf, 
  FileText, 
  ShieldCheck, 
  Heart, 
  Microscope,
  CheckCircle2
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ConservationSection({ language }) {
  const sectionRef = useRef(null);
  const [stats, setStats] = useState({
    hectares: 0,
    species: 0,
    whiteTigers: 0,
    gharials: 0,
    wetland: 0
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const statTargets = {
      hectares: 437,
      species: 156,
      whiteTigers: 34,
      gharials: 1000,
      wetland: 66
    };

    const countObj = {
      hectares: 0,
      species: 0,
      whiteTigers: 0,
      gharials: 0,
      wetland: 0
    };

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 75%',
      onEnter: () => {
        gsap.to(countObj, {
          hectares: statTargets.hectares,
          species: statTargets.species,
          whiteTigers: statTargets.whiteTigers,
          gharials: statTargets.gharials,
          wetland: statTargets.wetland,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate: () => {
            setStats({
              hectares: Math.floor(countObj.hectares),
              species: Math.floor(countObj.species),
              whiteTigers: Math.floor(countObj.whiteTigers),
              gharials: Math.floor(countObj.gharials),
              wetland: Math.floor(countObj.wetland)
            });
          }
        });
      },
      once: true
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const programmes = [
    {
      title: "White Tiger Conservation Lineage",
      achievement: "World's First Birth to Tawny Parents (1980)",
      desc: "Nandankanan rewrote zoological genetics when normal tawny tigers Deepak and Ganga naturally birthed healthy white tiger cubs, establishing a vital genetic repository.",
      badge: "World First"
    },
    {
      title: "Gharial Crocodilian Recovery",
      achievement: "Over 1,000 Juveniles Head-Started",
      desc: "Partnered with UNDP/FAO in 1980 to establish the world's premier captive breeding pool, rehabilitating critically endangered gharials back into the Mahanadi River.",
      badge: "Global Benchmark"
    },
    {
      title: "Indian Pangolin Research Center",
      achievement: "Exclusive Nocturnal Breeding Enclosure",
      desc: "Nandankanan runs the world's only dedicated captive conservation & telemetry breeding center for the endangered Indian Pangolin (Manis crassicaudata).",
      badge: "Pioneering Research"
    },
    {
      title: "King Cobra Captive Breeding",
      achievement: "First Successful Nesting & Hatching",
      desc: "The only institution worldwide to replicate the precise thermal, humidity, and leaf-nesting behaviors required to successfully breed King Cobras in human care.",
      badge: "Global Milestone"
    }
  ];

  return (
    <section 
      id="conservation" 
      ref={sectionRef} 
      className="pt-10 sm:pt-12 lg:pt-14 pb-10 sm:pb-12 lg:pb-14 bg-[#0B2A1A] text-[#F4F1E8] relative z-20 overflow-hidden"
    >
      {/* Top Subtle Golden Forest Horizon Separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C8A96B]/25 to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-[#071D12]/50 to-transparent pointer-events-none" />

      {/* Background Studio Light Accents */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#14532D]/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[#2E7D32]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F28C1B]" />
              <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#F28C1B] font-bold">
                {language === 'odia' ? 'ବୈଜ୍ଞାନିକ ସଂରକ୍ଷଣ ଓ ଅନୁସନ୍ଧାନ' : 'SCIENCE & PRESERVATION'}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1E8] leading-tight">
              Conservation Milestones. <br />
              <span className="font-editorial italic font-normal text-[#A7D7A9]">
                {language === 'odia' ? 'ଜୀବନ ରକ୍ଷା ଆମର ସଂକଳ୍ପ।' : 'Rewriting the future of species.'}
              </span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#A7D7A9]/90 max-w-md font-light leading-relaxed">
            {language === 'odia'
              ? 'ନନ୍ଦନକାନନ ବିଶ୍ୱରେ ଏକମାତ୍ର ଚିଡ଼ିଆଖାନା ଯେଉଁଠାରେ ଧଳା ବାଘ, ଘଡ଼ିଆଳ କୁମ୍ଭୀର ଏବଂ ଶଙ୍ଖଚୁଡ଼ ସାପଙ୍କ ସଫଳ ପ୍ରଜନନ ହୋଇପାରିଛି।'
              : 'Recognized by the Central Zoo Authority and the World Association of Zoos and Aquariums (WAZA) for monumental captive breeding records.'}
          </p>
        </div>

        {/* Count-Up Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          
          <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#14532D]/30 border border-white/10 backdrop-blur-md">
            <span className="text-4xl sm:text-6xl font-serif font-bold text-[#F28C1B] block mb-2 font-mono">
              {stats.hectares}
            </span>
            <span className="text-xs uppercase font-mono tracking-widest text-[#A7D7A9] block mb-1">
              Hectares Protected
            </span>
            <p className="text-xs text-[#F4F1E8]/70 font-light">
              Continuous natural deciduous forest corridor adjacent to Chandaka.
            </p>
          </div>

          <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#14532D]/30 border border-white/10 backdrop-blur-md">
            <span className="text-4xl sm:text-6xl font-serif font-bold text-white block mb-2 font-mono">
              {stats.species}+
            </span>
            <span className="text-xs uppercase font-mono tracking-widest text-[#A7D7A9] block mb-1">
              Species Conserved
            </span>
            <p className="text-xs text-[#F4F1E8]/70 font-light">
              Including Schedule-I endangered mammals, birds, and aquatic life.
            </p>
          </div>

          <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#14532D]/30 border border-white/10 backdrop-blur-md">
            <span className="text-4xl sm:text-6xl font-serif font-bold text-[#A7D7A9] block mb-2 font-mono">
              {stats.whiteTigers}+
            </span>
            <span className="text-xs uppercase font-mono tracking-widest text-[#A7D7A9] block mb-1">
              White Tigers Reared
            </span>
            <p className="text-xs text-[#F4F1E8]/70 font-light">
              First in world to naturally birth white tigers from normal tawny parents.
            </p>
          </div>

          <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#14532D]/30 border border-white/10 backdrop-blur-md">
            <span className="text-4xl sm:text-6xl font-serif font-bold text-[#F28C1B] block mb-2 font-mono">
              {stats.gharials}+
            </span>
            <span className="text-xs uppercase font-mono tracking-widest text-[#A7D7A9] block mb-1">
              Gharials Released
            </span>
            <p className="text-xs text-[#F4F1E8]/70 font-light">
              Restoring endangered crocodilian populations in the Mahanadi River.
            </p>
          </div>

        </div>

        {/* Breeding Programmes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programmes.map((prog, idx) => (
            <div 
              key={idx}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#F28C1B]/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F28C1B] text-[#0B2A1A]">
                    {prog.badge}
                  </span>
                  <Microscope className="w-5 h-5 text-[#A7D7A9] group-hover:rotate-12 transition-transform" />
                </div>

                <h3 className="text-2xl font-serif font-bold text-white mb-2 group-hover:text-[#F28C1B] transition-colors">
                  {prog.title}
                </h3>
                <p className="text-xs text-[#A7D7A9] font-mono mb-4">
                  {prog.achievement}
                </p>
                <p className="text-xs sm:text-sm text-[#F4F1E8]/80 font-light leading-relaxed">
                  {prog.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#A7D7A9]">
                <span>State Wildlife Wing Publication</span>
                <span className="text-[#F28C1B] font-semibold">WAZA Certified</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

