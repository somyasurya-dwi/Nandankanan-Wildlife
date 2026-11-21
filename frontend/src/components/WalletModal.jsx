import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  ArrowUpRight, 
  Plus, 
  QrCode, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  History, 
  Ticket,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function WalletModal({ isOpen, onClose }) {
  const { language, t } = useLanguage();
  const [balance, setBalance] = useState(1250);
  const [activeTab, setActiveTab] = useState('passes'); // 'passes' | 'topup' | 'history'
  const [topUpSuccess, setTopUpSuccess] = useState(null);

  if (!isOpen) return null;

  const handleTopUp = (amount) => {
    setBalance((prev) => prev + amount);
    setTopUpSuccess(amount);
    setTimeout(() => setTopUpSuccess(null), 3000);
  };

  const passes = [
    {
      id: 'SAFARI-902',
      name: 'Tiger & Lion Safari Fast-Track Token',
      date: 'Valid Today',
      type: 'Single Use Pass',
      status: 'Ready to Scan',
      color: 'from-amber-600 to-amber-700'
    },
    {
      id: 'TRAIN-441',
      name: 'Eco Toy Train Scenic Loop Pass',
      date: 'Valid Today',
      type: 'Standard Pass',
      status: 'Active',
      color: 'from-emerald-600 to-emerald-700'
    },
    {
      id: 'BOAT-108',
      name: 'Lake Kanjia Solar Boating Voucher',
      date: 'Valid for 30 Days',
      type: 'Eco Voucher',
      status: 'Unredeemed',
      color: 'from-teal-600 to-teal-700'
    }
  ];

  const transactions = [
    { title: 'Safari Fast-Track Pass', date: 'Today, 10:15 AM', amount: '-₹350', type: 'debit' },
    { title: 'Eco-Canteen Zero Plastic Lunch', date: 'Today, 01:20 PM', amount: '-₹280', type: 'debit' },
    { title: 'UPI Top-Up (Odisha State Bank)', date: 'Yesterday', amount: '+₹1,000', type: 'credit' },
    { title: 'Sanctuary Entry Pass QR', date: 'Yesterday', amount: '-₹100', type: 'debit' },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-[#071D12] border border-[#C8A96B]/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0B2A1A] via-[#123D2B] to-[#0B2A1A] border-b border-[#26734D]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#C8A96B]/20 text-[#C8A96B] border border-[#C8A96B]/40 shadow-inner">
              <Wallet className="w-5 h-5 text-[#C8A96B]" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg sm:text-xl text-[#F5F4EA] tracking-wide flex items-center gap-2">
                <span>Nandankanan Eco-Wallet</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/30 font-bold uppercase">
                  Active
                </span>
              </h2>
              <p className="text-xs text-[#A7D7A9] font-sans">
                Cashless passes, cafeteria credits & safari tokens
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close wallet modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-[#0B2A1A] to-[#071810] border-b border-[#26734D]/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-widest text-gray-300">
              Total Available Eco-Balance
            </span>
            <span className="text-[11px] font-mono text-[#C8A96B] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Secured by Odisha Treasury
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-sans text-[#C8A96B] font-bold">₹</span>
              <span className="text-4xl sm:text-5xl font-display font-black text-[#F5F4EA] tracking-tight">
                {balance.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-emerald-400 font-mono ml-2 font-semibold">.00 INR</span>
            </div>

            <button
              onClick={() => setActiveTab('topup')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#C8A96B] to-[#b39352] text-[#071D12] text-xs font-black uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Top-Up</span>
            </button>
          </div>

          {topUpSuccess && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Successfully added ₹{topUpSuccess} to your Eco-Wallet!</span>
            </div>
          )}

          {/* Quick Tab Selector */}
          <div className="flex items-center gap-2 mt-5 p-1 rounded-xl bg-[#071810] border border-[#26734D]/40">
            <button
              onClick={() => setActiveTab('passes')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'passes' 
                  ? 'bg-[#1B6537] text-white shadow-md' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Digital Passes ({passes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('topup')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'topup' 
                  ? 'bg-[#1B6537] text-white shadow-md' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Add Money</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'history' 
                  ? 'bg-[#1B6537] text-white shadow-md' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Pass History</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3.5 flex-1 max-h-[380px]">
          {activeTab === 'passes' && (
            <div className="space-y-3">
              {passes.map((pass) => (
                <div 
                  key={pass.id}
                  className="p-3.5 rounded-2xl bg-[#0B2A1A]/80 border border-[#26734D]/60 flex items-center justify-between gap-3 hover:border-[#C8A96B]/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white text-[#071D12] shrink-0 shadow-md">
                      <QrCode className="w-6 h-6 text-[#071D12]" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#F5F4EA] leading-tight">
                        {pass.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-gray-400">
                        <span className="text-[#C8A96B] font-semibold">{pass.id}</span>
                        <span>•</span>
                        <span>{pass.date}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                    {pass.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'topup' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#C8A96B] uppercase tracking-wider block">
                Quick Recharges (One-Click UPI / Net Banking)
              </span>
              <div className="grid grid-cols-3 gap-3">
                {[200, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleTopUp(amt)}
                    className="p-4 rounded-2xl bg-[#0B2A1A] border border-[#26734D] hover:border-[#C8A96B] text-center hover:scale-105 active:scale-95 transition-all group"
                  >
                    <span className="text-xs text-gray-400 block font-mono">Add</span>
                    <span className="text-xl sm:text-2xl font-black font-display text-[#C8A96B] group-hover:text-white transition-colors block my-0.5">
                      +₹{amt}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold block">Instant</span>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#0B2A1A]/60 border border-[#26734D]/40 text-xs text-gray-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#F5F4EA]">
                  <Sparkles className="w-4 h-4 text-[#C8A96B]" />
                  <span>Eco-Pass Privileges</span>
                </div>
                <p className="text-[11px] leading-relaxed text-gray-400">
                  Zero transaction fees on all government-authorized sanctuary safaris, battery-operated vehicle tours, and child concessions.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2.5">
              {transactions.map((tx, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-xl bg-[#0B2A1A]/60 border border-[#26734D]/30 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#F5F4EA] block">{tx.title}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{tx.date}</span>
                  </div>
                  <span className={`font-mono font-bold text-sm ${
                    tx.type === 'credit' ? 'text-emerald-400' : 'text-[#C8A96B]'
                  }`}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#071810] border-t border-[#26734D]/40 flex items-center justify-between text-[11px] text-gray-400">
          <span>Registered ID: NK-VISITOR-8891</span>
          <button 
            onClick={onClose}
            className="text-[#C8A96B] font-bold hover:underline"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
