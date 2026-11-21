import React from 'react';
import { Wallet, PlusCircle, History, Sparkles, Heart } from 'lucide-react';

export default function WildlifeWalletBar({
  wallet,
  onOpenContribution,
  onOpenAddMoney,
  onOpenHistory,
  currentAnimal
}) {
  const balance = wallet?.balance ?? 0;

  const quickOptions = [
    { amount: 10, label: 'Share', emoji: '🥩', desc: '₹10 Share' },
    { amount: 50, label: 'Care', emoji: '🍖', desc: '₹50 Care' },
    { amount: 100, label: 'Support', emoji: '❤️', desc: '₹100 Support' },
    { amount: 'custom', label: 'Custom', emoji: '⭐', desc: 'Extra Amount' },
  ];

  return (
    <div className="px-2.5 sm:px-6 lg:px-8 xl:px-10 py-1.5 sm:py-2 bg-gradient-to-r from-[#071D12] via-[#0B2A1A] to-[#071D12] border-b border-[#C8A96B]/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 sm:gap-3 shadow-md">
      
      {/* Left: Wallet Brand & Balance */}
      <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2.5 sm:gap-5">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#C8A96B] to-[#997736] flex items-center justify-center text-[#071D12] shadow-md shadow-[#C8A96B]/20 shrink-0">
            <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#071D12]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-xs sm:text-base text-[#F5F4EA] tracking-wide">
                Wildlife Wallet
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono uppercase tracking-wider font-semibold">
                Active
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#C8A96B] font-sans flex items-center gap-1 font-medium">
              <span>Share Happiness, Feed Wildlife</span>
              <span className="text-red-400">❤️</span>
            </p>
          </div>
        </div>

        {/* Current Balance Badge & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-[#06180E]/90 border border-[#C8A96B]/40 rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 backdrop-blur-md">
          <div className="text-left">
            <span className="text-[8.5px] sm:text-[9px] uppercase tracking-wider text-[#A7D7A9] font-mono block leading-tight">
              Balance
            </span>
            <span className="text-xs sm:text-base font-bold font-mono text-[#F5F4EA] leading-tight">
              ₹{balance.toLocaleString()}
            </span>
          </div>

          <button
            onClick={onOpenAddMoney}
            className="ml-1 sm:ml-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-[#C8A96B] hover:bg-[#D4BA7E] active:scale-95 text-[#071D12] text-[10.5px] sm:text-[11px] font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            title="Add money to your Wildlife Wallet"
          >
            <PlusCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Add Money</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="px-1.5 py-0.5 sm:py-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-[#C8A96B] transition-colors cursor-pointer text-[10.5px] sm:text-[11px] flex items-center gap-1"
            title="View Transaction & Contribution History"
          >
            <History className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline font-mono">History</span>
          </button>
        </div>
      </div>

      {/* Right: Quick Contribution Options */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none overscroll-x-contain">
        <span className="text-[10px] sm:text-[11px] font-mono text-[#C8A96B] uppercase tracking-wider font-semibold mr-0.5 whitespace-nowrap hidden xl:inline">
          Quick Feed:
        </span>

        {quickOptions.map((opt) => (
          <button
            key={opt.label}
            onClick={() => onOpenContribution(opt.amount, currentAnimal)}
            className="group px-2 sm:px-2.5 py-1 rounded-lg bg-forest-900/80 hover:bg-[#14532D] border border-[#C8A96B]/30 hover:border-[#C8A96B] transition-all duration-200 flex items-center gap-1 text-[10.5px] sm:text-[11px] font-semibold text-[#F5F4EA] shadow-sm hover:shadow-[#C8A96B]/20 hover:-translate-y-0.5 active:scale-95 cursor-pointer whitespace-nowrap"
            title={`Contribute ${opt.desc} for ${currentAnimal?.animal_name || 'Wildlife'}`}
          >
            <span className="text-xs group-hover:scale-110 transition-transform duration-200">
              {opt.emoji}
            </span>
            <span className="text-gold-300 font-bold">
              {opt.amount === 'custom' ? 'Extra' : `₹${opt.amount}`}
            </span>
            <span className="text-[#A7D7A9] font-normal text-[9.5px] sm:text-[10px]">
              – {opt.label}
            </span>
          </button>
        ))}
      </div>

    </div>
  );
}
