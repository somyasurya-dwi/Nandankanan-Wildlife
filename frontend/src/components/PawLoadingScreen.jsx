import React from 'react';

export default function PawLoadingScreen({ isLoaded }) {
  return (
    <div
      className={`fixed inset-0 z-50 bg-[#071D12] flex flex-col items-center justify-center transition-all duration-700 pointer-events-none ${
        isLoaded ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
    >
      <div className="flex flex-col items-center">
        {/* Animated Green Paw Print */}
        <div className="relative w-20 h-20 mb-6">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-[#A7D7A9] fill-current animate-pulse"
          >
            {/* Main Pad */}
            <path d="M50 82 C34 82, 22 70, 25 54 C27 42, 38 40, 50 44 C62 40, 73 42, 75 54 C78 70, 66 82, 50 82 Z" />
            {/* 4 Toes */}
            <ellipse cx="26" cy="34" rx="7" ry="9" transform="rotate(-20 26 34)" />
            <ellipse cx="42" cy="24" rx="7.5" ry="10" transform="rotate(-6 42 24)" />
            <ellipse cx="58" cy="24" rx="7.5" ry="10" transform="rotate(6 58 24)" />
            <ellipse cx="74" cy="34" rx="7" ry="9" transform="rotate(20 74 34)" />
          </svg>
          <div className="absolute inset-0 rounded-full bg-[#14532D]/40 blur-xl animate-ping" />
        </div>

        {/* Official Logo Badge */}
        <div className="bg-white/95 rounded-2xl p-2.5 shadow-2xl border border-[#C8A96B]/50 mb-6">
          <img 
            src="/images/nandankanan_official_logo.png" 
            alt="Nandankanan Zoological Park Official Logo" 
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Branding */}
        <h2 className="font-serif font-black tracking-[0.25em] text-xl sm:text-2xl text-white uppercase mb-1">
          NANDANKANAN
        </h2>
        <p className="text-xs font-bold text-[#C8A96B] mb-1">
          ନନ୍ଦନକାନନ ପ୍ରାଣୀ ଉଦ୍ୟାନ • ଭୁବନେଶ୍ୱର
        </p>
        <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#A7D7A9]">
          Where the wild lives on • Estd. 1960
        </p>

        {/* Loading Progress Bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
          <div className="w-full h-full bg-[#F28C1B] origin-left animate-pulse" />
        </div>
      </div>
    </div>
  );
}

