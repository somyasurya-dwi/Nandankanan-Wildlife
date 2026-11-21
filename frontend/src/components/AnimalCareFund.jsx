import React, { useState } from 'react';
import { Leaf, Award, ChevronRight, CheckCircle2, TrendingUp, Info } from 'lucide-react';

export default function AnimalCareFund({
  fund,
  onViewDetails
}) {
  const totalFund = fund?.total_fund || 184350;
  const monthlyGoal = fund?.monthly_goal || 250000;
  const progressPct = fund?.progress_percentage || 73.7;
  
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = fund?.categories || [
    { name: "Animal Nutrition", percentage: 45, icon: "🥩", detail: "Daily fresh beef, poultry, fruit, vitamins & mineral lick formulations" },
    { name: "Veterinary Care", percentage: 25, icon: "🩺", detail: "Clinical diagnostics, preventative deworming & emergency medical reserves" },
    { name: "Habitat Enrichment", percentage: 18, icon: "🌳", detail: "Climbing logs, natural water pools, sensory toys & cave substrates" },
    { name: "Wildlife Conservation", percentage: 12, icon: "🛡️", detail: "Breeding programs, genetic registry tracking & native flora preservation" }
  ];

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-[#0B2A1A]/95 to-[#071D12]/95 border border-[#C8A96B]/35 shadow-xl flex flex-col backdrop-blur-md">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#14532D]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#C8A96B]/20 border border-[#C8A96B]/50 flex items-center justify-center text-[#C8A96B] shrink-0">
            <Leaf className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-[#F5F4EA] flex items-center gap-1.5 leading-tight">
              <span>Animal Care Fund</span>
            </h4>
            <p className="text-[10px] text-[#A7D7A9] font-sans leading-tight">
              Sanctuary nutritional & medical allocation
            </p>
          </div>
        </div>

        <button
          onClick={onViewDetails}
          className="text-[11px] font-mono text-[#C8A96B] hover:text-white transition-colors flex items-center gap-0.5 cursor-pointer font-semibold"
        >
          <span>Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress & Totals */}
      <div className="mb-2.5">
        <div className="flex items-baseline justify-between mb-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold font-mono text-[#F5F4EA]">
              ₹{totalFund.toLocaleString()}
            </span>
            <span className="text-[10px] text-white/60 font-mono">
              of ₹{monthlyGoal.toLocaleString()} goal
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-[#C8A96B] bg-[#C8A96B]/15 px-2 py-0.5 rounded-full border border-[#C8A96B]/30">
            {progressPct}%
          </span>
        </div>

        {/* Progress Bar with shimmering glow */}
        <div className="w-full h-2 rounded-full bg-black/60 border border-white/10 overflow-hidden p-0.5">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-[#C8A96B] to-amber-400 transition-all duration-700 shadow-[0_0_10px_rgba(200,169,107,0.5)]"
            style={{ width: `${Math.min(100, progressPct)}%` }}
          />
        </div>
      </div>

      {/* Welfare Categories Grid */}
      <div className="grid grid-cols-2 gap-[clamp(0.35rem,0.6vw,0.45rem)] text-xs">
        {categories.map((cat) => {
          const isSelected = activeCategory?.name === cat.name;
          return (
            <button 
              key={cat.name}
              onClick={() => setActiveCategory(isSelected ? null : cat)}
              className={`p-1.5 sm:p-2 rounded-xl text-left border transition-all duration-200 cursor-pointer flex items-center justify-between gap-1 select-none ${
                isSelected
                  ? 'bg-[#14532D] border-[#C8A96B] ring-1 ring-[#C8A96B]/50 shadow-md'
                  : 'bg-[#06180E]/75 border-white/10 hover:border-[#C8A96B]/40 hover:bg-[#06180E]'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-sm shrink-0">{cat.icon}</span>
                <span className="text-[10.5px] font-sans text-white/90 truncate">{cat.name}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#A7D7A9] shrink-0">
                {cat.percentage}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Category Micro-Detail Interactive Drawer */}
      {activeCategory && (
        <div className="mt-2 p-2 rounded-xl bg-black/40 border border-[#C8A96B]/40 text-[10.5px] text-[#F5F4EA]/90 animate-fadeIn">
          <div className="flex items-center gap-1.5 text-[#C8A96B] font-semibold mb-0.5">
            <span>{activeCategory.icon}</span>
            <span>{activeCategory.name} ({activeCategory.percentage}%)</span>
          </div>
          <p className="text-white/80 leading-tight">
            {activeCategory.detail}
          </p>
        </div>
      )}

      {/* Bottom verified count badge */}
      <div className="mt-2 pt-2 border-t border-[#14532D]/60 flex items-center justify-between text-[10px] font-mono text-white/60">
        <span>Verified Animal Supporters</span>
        <span className="text-[#C8A96B] font-bold">
          {(fund?.verified_donations_count || 1420).toLocaleString()} Supporters
        </span>
      </div>

    </div>
  );
}
