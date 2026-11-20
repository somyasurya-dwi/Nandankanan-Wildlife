import React from 'react';
import { ArrowUpRight, Star, Shield, Zap, Sparkles, Activity, Eye, CheckCircle2 } from 'lucide-react';

export default function TigerHeroSection() {
  return (
    <section className="relative w-full min-h-screen pt-32 sm:pt-36 pb-20 flex flex-col justify-center overflow-hidden">
      
      {/* Background Soft Studio Gradient */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[400px] bg-gradient-to-br from-white/60 to-transparent rounded-full blur-3xl opacity-70" />
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
        
        {/* LEFT COLUMN: Editorial Typography & Actions */}
        <div className="lg:col-span-5 flex flex-col justify-center text-left">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5 mb-5">
            <span className="w-5 h-[1.5px] bg-[#F28C1B]" />
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#666666] uppercase">
              ADAPTIVE THREAT INTELLIGENCE
            </span>
          </div>

          {/* Headline: "Defence shaped by instinct" (with 'instinct' in elegant italic serif) */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-[#111111] leading-[1.04] tracking-tight mb-6">
            <span>Defence shaped </span>
            <span className="font-editorial italic font-normal text-[#111111] hover:text-[#F28C1B] transition-colors">
              by instinct
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed max-w-lg mb-8">
            We read the whole surface of your estate and move on a threat before it becomes an incident.
          </p>

          {/* Buttons: Tiger Orange "Start free" + "Watch the system ↗" */}
          <div className="flex flex-wrap items-center gap-5 mb-10">
            <a
              href="#cta"
              className="px-8 py-4 rounded-full bg-[#F28C1B] hover:bg-[#d9750d] text-white font-semibold text-xs uppercase tracking-[0.15em] transition-all duration-300 shadow-xl shadow-[#F28C1B]/30 hover:shadow-[#F28C1B]/50 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <span>Start free</span>
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </a>

            <a
              href="#features"
              className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#111111] hover:text-[#F28C1B] transition-colors flex items-center gap-1.5 group"
            >
              <span>Watch the system</span>
              <ArrowUpRight className="w-4 h-4 text-[#F28C1B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Micro Trust Indicators */}
          <div className="pt-6 border-t border-black/10 flex items-center gap-8 text-xs text-[#777777]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#F28C1B]" />
              <span>Zero-agent deploy</span>
            </div>
            <div className="w-[1px] h-4 bg-black/15" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#F28C1B]" />
              <span>SOC 2 Type II certified</span>
            </div>
          </div>

        </div>

        {/* CENTER COLUMN: Reserved spatial corridor for 3D Tiger */}
        <div className="lg:col-span-4 min-h-[300px] lg:min-h-[500px] pointer-events-none" />

        {/* RIGHT COLUMN: Two Floating Phone Mockups Showing Dashboard Cards + Rating */}
        <div className="lg:col-span-3 flex flex-col items-start lg:items-end gap-5">
          
          {/* Small 4.9/5 Rating Badge Above Cards */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-black/5 shadow-sm text-xs font-medium text-[#222222]">
            <div className="flex items-center gap-0.5 text-[#F28C1B]">
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="font-bold text-[#111111]">4.9/5</span>
            <span className="text-[#888888] text-[11px]">(420+ Security Teams)</span>
          </div>

          {/* Floating Phone Mockup Card 1: 12ms Response Time */}
          <div className="w-full sm:w-64 rounded-2xl bg-white/90 backdrop-blur-xl border border-black/8 p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-bold tracking-widest text-[#888888] uppercase">
                  ACTIVE PING
                </span>
              </div>
              <Activity className="w-3.5 h-3.5 text-[#F28C1B]" />
            </div>

            <div className="text-3xl font-mono font-extrabold text-[#111111] tracking-tight mb-1 flex items-baseline gap-1">
              <span>12</span>
              <span className="text-sm font-sans font-normal text-[#F28C1B]">ms</span>
            </div>

            <p className="text-[11px] text-[#666666] leading-tight mb-3">
              Mean response time across hybrid infrastructure.
            </p>

            <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[10px] text-[#888888] font-mono">
              <span>LATENCY BUFFER</span>
              <span className="text-emerald-600 font-bold">0.00%</span>
            </div>
          </div>

          {/* Floating Phone Mockup Card 2: 99.8% Detection Stat */}
          <div className="w-full sm:w-64 rounded-2xl bg-[#111111] text-white p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F28C1B]" />
                <span className="text-[10px] font-bold tracking-widest text-white/60 uppercase">
                  AUTONOMOUS CATCH
                </span>
              </div>
              <Shield className="w-3.5 h-3.5 text-[#F28C1B]" />
            </div>

            <div className="text-3xl font-mono font-extrabold text-white tracking-tight mb-1 flex items-baseline gap-1">
              <span>99.8</span>
              <span className="text-sm font-sans font-normal text-[#F28C1B]">%</span>
            </div>

            <p className="text-[11px] text-white/70 leading-tight mb-3">
              Zero-day and insider threat containment without human intervention.
            </p>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50 font-mono">
              <span>HEURISTIC CONFIDENCE</span>
              <span className="text-[#F28C1B]">99.998%</span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}

