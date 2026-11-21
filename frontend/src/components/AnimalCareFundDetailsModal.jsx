import React from 'react';
import { X, Leaf, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AnimalCareFundDetailsModal({
  isOpen,
  onClose,
  fund,
  onContribute
}) {
  if (!isOpen) return null;

  const totalFund = fund?.total_fund || 184350;
  const monthlyGoal = fund?.monthly_goal || 250000;
  const progressPct = fund?.progress_percentage || 73.7;
  const categories = fund?.categories || [
    { name: "Animal Nutrition", percentage: 45, amount: 82957, icon: "🥩", desc: "Fresh meats, green browse, fruits, vitamins & minerals" },
    { name: "Veterinary Care", percentage: 25, amount: 46087, icon: "🩺", desc: "Health surveillance, biometrics, preventative vaccines" },
    { name: "Habitat Enrichment", percentage: 18, amount: 33183, icon: "🌳", desc: "Climbing logs, mud wallows, shade structures, pools" },
    { name: "Wildlife Conservation", percentage: 12, amount: 22122, icon: "🛡️", desc: "Species rehabilitation and genetic diversity programs" }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#0B2A1A] to-[#071D12] border border-[#C8A96B]/50 shadow-2xl p-6 text-[#F5F4EA] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C8A96B] to-[#997736] flex items-center justify-center text-[#071D12] shadow-lg shadow-[#C8A96B]/30 shrink-0">
            <Leaf className="w-5 h-5 text-[#071D12]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-[#F5F4EA]">
              Animal Care Fund Allocation
            </h3>
            <p className="text-xs text-[#A7D7A9] font-mono">
              Transparent, verified wildlife nourishment metrics
            </p>
          </div>
        </div>

        {/* Total & Goal Summary */}
        <div className="p-4 rounded-2xl bg-black/30 border border-white/8 mb-4">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-2xl font-bold font-mono text-[#F5F4EA]">
                ₹{totalFund.toLocaleString()}
              </span>
              <span className="text-xs text-white/60 font-mono ml-2">
                raised toward ₹{monthlyGoal.toLocaleString()} monthly goal
              </span>
            </div>
            <span className="text-sm font-mono font-bold text-[#C8A96B] bg-[#C8A96B]/20 px-2.5 py-0.5 rounded-full border border-[#C8A96B]/40">
              {progressPct}%
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-black/60 border border-white/10 overflow-hidden p-0.5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-[#C8A96B] to-amber-400"
              style={{ width: `${Math.min(100, progressPct)}%` }}
            />
          </div>
        </div>

        {/* Categories Detailed Breakdown */}
        <div className="space-y-2.5 mb-5">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#C8A96B] font-semibold">
            Fund Distribution Across Sanctuary Programs:
          </h4>
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="p-3 rounded-2xl bg-[#06180E]/70 border border-white/5 flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-xl shrink-0 mt-0.5">{cat.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{cat.name}</span>
                    <span className="text-[10px] font-mono text-[#C8A96B] bg-[#C8A96B]/10 px-1.5 py-0.2 rounded border border-[#C8A96B]/25">
                      {cat.percentage}%
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60 mt-0.5 font-sans leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  ₹{cat.amount?.toLocaleString() || '0'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Veterinary Protocol Disclaimer */}
        <div className="p-3 rounded-2xl bg-forest-900/60 border border-[#C8A96B]/20 text-[11px] text-[#A7D7A9] flex items-start gap-2 mb-4 leading-relaxed font-sans">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            Every rupee contributed is audited and strictly allocated to Nandankanan’s registered Veterinary Services & Wildlife Nutrition Division. Direct feeding by visitors is prohibited under sanctuary safety bylaws.
          </span>
        </div>

        <button
          onClick={() => {
            onClose();
            if (onContribute) onContribute(50);
          }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#C8A96B] to-[#DFCA98] hover:brightness-105 active:scale-[0.99] text-[#071D12] font-serif font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#C8A96B]/25 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Heart className="w-4 h-4 fill-current text-rose-700" />
          <span>Share Happiness & Feed Wildlife (₹50)</span>
        </button>

      </div>
    </div>
  );
}
