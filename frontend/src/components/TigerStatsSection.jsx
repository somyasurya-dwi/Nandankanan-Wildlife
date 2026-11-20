import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function TigerStatsSection() {
  const sectionRef = useRef(null);
  const [counts, setCounts] = useState({ ms: 0, pct: 0, hrs: 0 });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const proxy = { ms: 0, pct: 0, hrs: 0 };

    const tween = gsap.to(proxy, {
      ms: 12,
      pct: 99.8,
      hrs: 24,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 75%',
        once: true,
      },
      onUpdate: () => {
        setCounts({
          ms: Math.round(proxy.ms),
          pct: Number(proxy.pct.toFixed(1)),
          hrs: Math.round(proxy.hrs),
        });
      }
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <section id="stats" ref={sectionRef} className="py-28 bg-[#111111] text-white relative z-20 overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#F28C1B]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-5 h-[1.5px] bg-[#F28C1B]" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#F28C1B]">
              MEASURABLE SUPREMACY
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white leading-tight mb-5">
            Real milliseconds. <br />
            <span className="font-editorial italic font-normal text-white">Absolute certainty.</span>
          </h2>
          <p className="text-white/60 font-light leading-relaxed">
            When adversary dwell times average 48 hours, sub-second instinctual containment is the only moat that matters.
          </p>
        </div>

        {/* Big 3 Stats Grid with Count-Up Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pt-8 border-t border-white/10">
          
          {/* Stat 1: 12ms Response */}
          <div className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#F28C1B]/50 transition-colors">
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.2em] text-white/50 mb-3">
                MEAN RESPONSE TIME
              </div>
              <div className="text-6xl sm:text-7xl font-mono font-extrabold text-white tracking-tight mb-3 flex items-baseline gap-1">
                <span>{counts.ms}</span>
                <span className="text-2xl font-sans font-normal text-[#F28C1B]">ms</span>
              </div>
            </div>
            <p className="text-xs text-white/60 font-light leading-relaxed pt-4 border-t border-white/10">
              End-to-end telemetry discovery to automated kernel isolation.
            </p>
          </div>

          {/* Stat 2: 99.8% Detection */}
          <div className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#F28C1B]/50 transition-colors">
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.2em] text-white/50 mb-3">
                AUTONOMOUS DETECTION RATE
              </div>
              <div className="text-6xl sm:text-7xl font-mono font-extrabold text-white tracking-tight mb-3 flex items-baseline gap-1">
                <span>{counts.pct}</span>
                <span className="text-2xl font-sans font-normal text-[#F28C1B]">%</span>
              </div>
            </div>
            <p className="text-xs text-white/60 font-light leading-relaxed pt-4 border-t border-white/10">
              Zero-day and evasive memory injection detection accuracy.
            </p>
          </div>

          {/* Stat 3: 24/7 Coverage */}
          <div className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#F28C1B]/50 transition-colors">
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.2em] text-white/50 mb-3">
                CONTINUOUS GUARDIANSHIP
              </div>
              <div className="text-6xl sm:text-7xl font-mono font-extrabold text-white tracking-tight mb-3 flex items-baseline gap-1">
                <span>{counts.hrs}/7</span>
                <span className="text-2xl font-sans font-normal text-[#F28C1B]">365</span>
              </div>
            </div>
            <p className="text-xs text-white/60 font-light leading-relaxed pt-4 border-t border-white/10">
              Unblinking autonomous watch across multi-cloud and sovereign endpoints.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

