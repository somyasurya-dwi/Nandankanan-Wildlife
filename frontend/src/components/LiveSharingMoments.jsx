import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  ThumbsUp, 
  Send, 
  Inbox, 
  MessageSquareHeart, 
  PenLine 
} from 'lucide-react';
import { walletManager } from '../utils/walletManager';

export default function LiveSharingMoments({
  contributions = [],
  currentAnimal = null,
  onViewAll,
  onQuickDonate,
  onOpenInbox,
  onOpenComposer
}) {
  // Only display verified contributions
  const verifiedList = contributions.filter(c => c.is_verified || c.status === 'verified').slice(0, 4);

  // Local interactive cheers state { [contributionId]: cheerCount }
  const [cheers, setCheers] = useState({});
  const [cheeredCardId, setCheeredCardId] = useState(null);

  const handleCheer = (id, e) => {
    e.stopPropagation();
    walletManager.likeContribution(id);
    setCheers(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    setCheeredCardId(id);
    setTimeout(() => setCheeredCardId(null), 400);
  };

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-[#0B2A1A]/95 to-[#071D12]/95 border border-[#C8A96B]/35 shadow-xl flex flex-col backdrop-blur-md">
      
      {/* Header with Title and Inbox Button */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#14532D]">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-[#F5F4EA] flex items-center gap-1.5 leading-tight">
              <span>Live Sharing Moments</span>
              <span className="px-1.5 py-0.2 rounded bg-red-600/20 text-red-400 text-[9px] font-mono font-bold uppercase tracking-wider border border-red-500/30">
                LIVE
              </span>
            </h4>
            <p className="text-[10px] text-[#A7D7A9] font-sans leading-tight">
              Recent verified community contributions
            </p>
          </div>
        </div>

        {/* Top-Right Action Controls (Inbox & View All) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenInbox}
            className="relative px-2.5 py-1 rounded-xl bg-[#14532D]/70 hover:bg-[#14532D] text-[#C8A96B] hover:text-[#DFCA98] border border-[#C8A96B]/35 hover:border-[#C8A96B] transition-all flex items-center gap-1.5 cursor-pointer text-[11px] font-mono font-semibold shadow-sm active:scale-95 group"
            title="Open Community Inbox & Moments Feed"
            aria-label="Open Community Inbox"
          >
            <Inbox className="w-3.5 h-3.5 text-[#C8A96B] group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Inbox</span>
            {contributions.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-[#071D12] text-[9px] font-bold flex items-center justify-center shadow-md animate-pulse">
                {contributions.length > 99 ? '99+' : contributions.length}
              </span>
            )}
          </button>

          <button
            onClick={onViewAll}
            className="text-[11px] font-mono text-[#C8A96B] hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-semibold p-1"
            title="View all verified contributions"
          >
            <span className="hidden md:inline">View All</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Share Your Moment Action Bar */}
      <button
        onClick={onOpenComposer}
        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#14532D] to-[#0B2A1A] hover:from-[#1B6537] hover:to-[#14532D] border border-[#C8A96B]/40 hover:border-[#C8A96B] text-[#F5F4EA] hover:text-white transition-all flex items-center justify-between text-xs font-semibold shadow-sm cursor-pointer group active:scale-[0.99] mb-2.5"
      >
        <span className="flex items-center gap-2">
          <MessageSquareHeart className="w-3.5 h-3.5 text-[#C8A96B] group-hover:scale-115 transition-transform" />
          <span>Share Your Moment ❤️</span>
        </span>
        <span className="text-[10px] text-[#A7D7A9] font-mono group-hover:text-white transition-colors flex items-center gap-1">
          <span>Free / Optional Feed</span>
          <PenLine className="w-3 h-3 text-[#C8A96B]" />
        </span>
      </button>

      {/* Verified Moments List */}
      <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1 scrollbar-thin overscroll-contain">
        {verifiedList.length > 0 ? (
          verifiedList.map((item) => {
            const itemId = item.id || item.contribution_id;
            const donorName = item.display_donor_name || (item.is_anonymous ? 'Anonymous Wildlife Friend' : item.donor_name);
            const initials = item.is_anonymous ? '🐾' : donorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const cheerCount = (item.likes_count ?? item.cheer_count ?? 3) + (cheers[itemId] || 0);
            const isCheered = cheeredCardId === itemId;

            return (
              <div
                key={itemId}
                className="p-2.5 rounded-xl bg-[#06180E]/75 border border-white/10 hover:border-[#C8A96B]/60 transition-all duration-200 group flex flex-col gap-1.5 hover:bg-[#06180E] shadow-sm"
              >
                {/* Donor & Amount Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#14532D] to-[#071D12] border border-[#C8A96B]/40 flex items-center justify-center text-[10px] font-bold text-[#C8A96B] shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0 truncate">
                      <span className="text-xs font-semibold text-[#F5F4EA] truncate block leading-tight">
                        {donorName}
                      </span>
                      <span className="text-[10px] text-[#C8A96B] font-mono flex items-center gap-1 leading-tight">
                        <span>{item.animal_emoji || '🐾'}</span>
                        <span className="truncate">{item.animal_name}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {Number(item.amount) > 0 ? (
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs shadow-sm">
                        +₹{item.amount}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-lg bg-[#C8A96B]/15 border border-[#C8A96B]/40 text-[#C8A96B] font-mono text-[10px]">
                        Community Wish 🌿
                      </span>
                    )}
                    
                    {/* Interactive Cheer Button */}
                    <button
                      onClick={(e) => handleCheer(itemId, e)}
                      className={`px-1.5 py-0.5 rounded-lg border text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer select-none ${
                        isCheered
                          ? 'bg-rose-500/30 border-rose-400 text-rose-300 scale-110'
                          : 'bg-white/5 border-white/10 hover:border-rose-400/50 hover:bg-rose-500/10 text-white/70 hover:text-rose-300'
                      }`}
                      title="Cheer and send love to this donor"
                    >
                      <Heart className={`w-3 h-3 ${isCheered ? 'fill-rose-400 text-rose-400 animate-ping' : 'text-rose-400'}`} />
                      <span>{cheerCount}</span>
                    </button>
                  </div>
                </div>

                {/* Personal Message */}
                {item.personal_message && (
                  <p className="text-[11px] text-[#F5F4EA]/85 italic bg-black/30 rounded-lg px-2 py-1 border border-white/5 line-clamp-2">
                    "{item.personal_message}"
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-xs font-mono text-zinc-400">
            No contributions recorded yet. Be the first to share happiness!
          </div>
        )}
      </div>

      {/* Bottom Quick Call-to-Action */}
      <div className="mt-2.5 pt-2 border-t border-[#14532D]/70 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-[#A7D7A9] font-mono text-[10px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Zoo-Verified Welfare</span>
        </div>
        <button
          onClick={() => onQuickDonate(50)}
          className="text-xs font-bold text-[#C8A96B] hover:text-[#D4BA7E] transition-all cursor-pointer flex items-center gap-1 active:scale-95"
        >
          <span>Feed Wildlife</span>
          <span className="text-red-400 animate-pulse">❤️</span>
        </button>
      </div>

    </div>
  );
}
