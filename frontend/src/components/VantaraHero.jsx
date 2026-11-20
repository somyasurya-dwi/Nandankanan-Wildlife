import React from 'react';
import { Tv, ChevronDown, Sparkles } from 'lucide-react';

export default function VantaraHero({ language, onOpenLiveCam }) {
  return (
    <section 
      id="hero" 
      className="relative w-full min-h-screen flex flex-col justify-between pt-32 sm:pt-36 pb-12 overflow-hidden select-none bg-[#071D12] text-[#F4F1E8]"
    >
      {/* Background Deep Emerald Atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[750px] h-[550px] bg-gradient-to-br from-[#14532D]/40 via-[#0B2A1A]/30 to-transparent rounded-full blur-3xl opacity-75" />
        <div className="absolute bottom-10 right-10 w-[600px] h-[500px] bg-[#2E7D32]/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(20,83,45,0.25)_0%,transparent_70%)]" />
      </div>

      {/* Main Visual Hero Content (Minimal, letting the Real 3D Tiger lead) */}
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-20 flex-1 my-auto">
        
        {/* Left Column: Minimal Cinematic Branding & Single "Watch Live" CTA */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left max-w-xl">
          
          {/* Subtle Tag */}
          <div className="inline-flex items-center gap-2.5 mb-5 px-3.5 py-1 rounded-full bg-[#14532D]/40 border border-[#2E7D32]/40 w-fit backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#A7D7A9] uppercase font-mono">
              BHUBANESWAR, ODISHA • ESTD. 1960
            </span>
          </div>

          {/* Headline: "Where the wild lives on" in white & vibrant orange */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.02] tracking-tight mb-6">
            <span>Where the wild </span>
            <span className="font-editorial italic font-normal text-[#F28C1B] block drop-shadow-md">
              lives on.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#A7D7A9]/90 font-light leading-relaxed max-w-md mb-8">
            {language === 'odia' 
              ? 'ଭାରତର ସର୍ବପ୍ରଥମ ପ୍ରାକୃତିକ ସଂରକ୍ଷଣ କ୍ଷେତ୍ର ଓ ଧଳା ବାଘର ଐତିହାସିକ ନିବାସ।' 
              : 'India’s premier 437-hectare conservation sanctuary and the world’s pioneer in white tiger guardianship.'}
          </p>

          {/* Core Action Buttons: "Watch Live" & "Explore Animals" */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#live"
              className="px-8 py-4 rounded-full bg-[#14532D] hover:bg-[#2E7D32] border border-[#2E7D32]/60 text-white font-bold text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#14532D]/50 hover:shadow-[#2E7D32]/60 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-3 group"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <Tv className="w-4 h-4 text-[#F28C1B] group-hover:scale-110 transition-transform" />
              <span>{language === 'odia' ? 'ଲାଇଭ୍ ଦେଖନ୍ତୁ' : 'Watch Live'}</span>
            </a>

            <a
              href="#animals"
              className="text-xs uppercase tracking-[0.16em] font-semibold text-[#A7D7A9] hover:text-white px-4 py-4 transition-colors flex items-center gap-1.5"
            >
              <span>{language === 'odia' ? 'ପ୍ରାଣୀ ସମ୍ପର୍କରେ' : 'Explore Animals'}</span>
              <span>→</span>
            </a>
          </div>

        </div>

        {/* Center / Right: Spatial Corridor for the 3D Real Tiger */}
        <div className="lg:col-span-6 min-h-[360px] sm:min-h-[480px] pointer-events-none" />

      </div>

      {/* Bottom Subtle Scroll Down Indicator */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 flex items-center justify-between text-xs text-[#A7D7A9]/80 pt-4 border-t border-white/10">
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Sanctuary Open: 07:30 AM – 05:30 PM (Closed Mondays)</span>
        </div>

        <a
          href="#live"
          className="flex items-center gap-2 text-xs font-semibold text-[#A7D7A9] hover:text-white transition-colors mx-auto sm:mx-0 group cursor-pointer"
        >
          <span className="uppercase tracking-[0.2em] text-[10px]">
            {language === 'odia' ? 'ସମ୍ପୂର୍ଣ୍ଣ ଅନୁଭୂତି ପାଇଁ ସ୍କ୍ରୋଲ୍ କରନ୍ତୁ' : 'SCROLL TO EXPLORE SANCTUARY'}
          </span>
          <div className="w-6 h-6 rounded-full border border-[#2E7D32] flex items-center justify-center group-hover:border-white transition-colors">
            <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </div>
        </a>

        <div className="hidden md:block text-[11px] font-mono text-[#A7D7A9]/60">
          20.4020° N, 85.8190° E
        </div>
      </div>

    </section>
  );
}
