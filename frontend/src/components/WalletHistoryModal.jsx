import React, { useState } from 'react';
import { X, Heart, Wallet, Clock, ShieldCheck, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function WalletHistoryModal({
  isOpen,
  onClose,
  contributions = [],
  transactions = []
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('contributions');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#0B2A1A] to-[#071D12] border border-[#C8A96B]/50 shadow-2xl p-6 text-[#F5F4EA] max-h-[85vh] flex flex-col my-auto"
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
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C8A96B] to-[#997736] flex items-center justify-center text-[#071D12] shadow-lg shadow-[#C8A96B]/30 shrink-0">
            <Clock className="w-5 h-5 text-[#071D12]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-[#F5F4EA]">
              Wildlife Wallet & Contribution History
            </h3>
            <p className="text-xs text-[#A7D7A9] font-mono">
              Complete verified community ledger & transactions
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-[#14532D] pb-3 mb-3 shrink-0">
          <button
            onClick={() => setActiveTab('contributions')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'contributions'
                ? 'bg-[#C8A96B] text-[#071D12] font-bold shadow-md shadow-[#C8A96B]/20'
                : 'bg-black/30 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Contributions ({contributions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-[#C8A96B] text-[#071D12] font-bold shadow-md shadow-[#C8A96B]/20'
                : 'bg-black/30 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Wallet Transactions ({transactions.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[200px]">
          {activeTab === 'contributions' && (
            <>
              {contributions.length > 0 ? (
                contributions.map((item) => {
                  const donorName = item.display_donor_name || (item.is_anonymous ? 'Anonymous Wildlife Friend' : item.donor_name);
                  return (
                    <div
                      key={item.id || item.contribution_id}
                      className="p-3 rounded-2xl bg-black/30 border border-white/8 hover:border-[#C8A96B]/40 transition-colors flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xl shrink-0">{item.animal_emoji || '🐾'}</span>
                          <div className="min-w-0 truncate">
                            <span className="text-xs font-bold text-white truncate block">
                              {donorName}
                            </span>
                            <span className="text-[11px] text-[#C8A96B] font-mono">
                              Supported {item.animal_name}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0">
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/40">
                            +₹{item.amount}
                          </span>
                          <span className="text-[10px] text-white/50 font-mono mt-0.5">
                            {item.time_ago || (item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Verified')}
                          </span>
                        </div>
                      </div>

                      {item.personal_message && (
                        <p className="text-xs text-[#F5F4EA]/80 italic bg-[#06180E]/70 px-2.5 py-1.5 rounded-xl border border-white/5">
                          "{item.personal_message}"
                        </p>
                      )}

                      <div className="text-[10px] text-[#A7D7A9] font-mono flex items-center justify-between">
                        <span>{item.program_description}</span>
                        <span className="flex items-center gap-1 text-emerald-400">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-xs font-mono text-white/50">
                  No contributions recorded yet.
                </div>
              )}
            </>
          )}

          {activeTab === 'transactions' && (
            <>
              {transactions.length > 0 ? (
                transactions.map((tx) => {
                  const isTopUp = tx.transaction_type === 'topup';
                  return (
                    <div
                      key={tx.transaction_id || tx.id}
                      className="p-3 rounded-2xl bg-black/30 border border-white/8 hover:border-[#C8A96B]/40 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isTopUp ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {isTopUp ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0 truncate">
                          <span className="text-xs font-semibold text-white block truncate">
                            {tx.description}
                          </span>
                          <span className="text-[10px] text-white/50 font-mono">
                            {tx.created_at ? new Date(tx.created_at).toLocaleString() : 'Recent'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-xs font-mono font-bold block ${
                          isTopUp ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {isTopUp ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                        </span>
                        <span className="text-[10px] text-white/50 font-mono">
                          Balance: ₹{tx.balance_after}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-xs font-mono text-white/50">
                  No transactions recorded yet.
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#14532D] text-[11px] font-mono text-[#A7D7A9] flex items-center justify-between shrink-0">
          <span>Official Nandankanan Wildlife Welfare Portal</span>
          <span className="text-[#C8A96B]">Audit Verified</span>
        </div>

      </div>
    </div>
  );
}
