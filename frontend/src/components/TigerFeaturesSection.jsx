import React from 'react';
import { Eye, Search, Zap, ShieldAlert, Cpu, Lock, ArrowRight } from 'lucide-react';

export default function TigerFeaturesSection() {
  const features = [
    {
      step: '01',
      title: 'Detect',
      subtitle: 'Surface perimeter reading & instinctive telemetry',
      description: 'Continuous, zero-overhead telemetry across every identity, cloud asset, and network edge. TIGER forms a unified sensory map of your entire digital footprint in real time.',
      icon: Eye,
      highlight: 'Sub-second inventory discovery',
      badge: 'SENSORY LAYER'
    },
    {
      step: '02',
      title: 'Hunt',
      subtitle: 'Autonomous anomaly tracking & behavioral heuristics',
      description: 'Threats do not announce themselves. TIGER stalks silent lateral movement, privilege escalations, and exfiltration attempts before signatures even exist.',
      icon: Search,
      highlight: 'Pattern recognition by neural instinct',
      badge: 'PREDATORY HEURISTICS'
    },
    {
      step: '03',
      title: 'Respond',
      subtitle: 'Sub-15ms automated threat containment',
      description: 'Instant neutralization. Memory freezing, credential revocation, and micro-segmentation occur the millisecond malicious intent crystallizes.',
      icon: Zap,
      highlight: '12ms automated containment cycle',
      badge: 'LETHAL MITIGATION'
    }
  ];

  return (
    <section id="features" className="py-28 relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-xl mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-5 h-[1.5px] bg-[#F28C1B]" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#666666]">
              PREDATORY CAPABILITIES
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#111111] leading-tight mb-5">
            How instincts outpace <br />
            <span className="font-editorial italic font-normal text-[#111111]">the adversary.</span>
          </h2>
          <p className="text-[#555555] font-light leading-relaxed">
            Legacy security reacts to signatures that already failed. TIGER operates like an apex predator: quiet observation, instant instinctual response.
          </p>
        </div>

        {/* 3 Feature Cards Grid (Positioned so the 3D Tiger prowls beside them!) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Spatial corridor for 3D tiger prowling on the left */}
          <div className="hidden lg:block lg:col-span-5 min-h-[600px] pointer-events-none" />

          {/* Cards Column on the right */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="bg-white/80 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-black/6 shadow-lg hover:shadow-2xl hover:border-[#F28C1B]/40 transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#F28C1B] font-bold">
                      {feat.step} • {feat.badge}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-[#EFEFEC] flex items-center justify-center group-hover:bg-[#F28C1B] transition-colors">
                      <Icon className="w-5 h-5 text-[#111111] group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  <h3 className="text-3xl font-serif text-[#111111] mb-2">
                    {feat.title}
                  </h3>

                  <div className="text-sm font-semibold text-[#888888] mb-4">
                    {feat.subtitle}
                  </div>

                  <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed mb-6">
                    {feat.description}
                  </p>

                  <div className="pt-4 border-t border-black/6 flex items-center justify-between text-xs font-mono text-[#444444]">
                    <span className="text-[#F28C1B] font-semibold">{feat.highlight}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Explore engine <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}

