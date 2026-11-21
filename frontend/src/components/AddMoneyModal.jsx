import React, { useState } from 'react';
import { X, Wallet, Plus, CreditCard, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AddMoneyModal({
  isOpen,
  onClose,
  currentBalance = 150,
  onConfirmTopUp
}) {
  if (!isOpen) return null;

  const quickAmounts = [50, 100, 250, 500, 1000];
  const [amount, setAmount] = useState(250);
  const [customInput, setCustomInput] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const effectiveAmount = isCustom ? (parseInt(customInput, 10) || 0) : amount;

  const handleSelectQuick = (val) => {
    setIsCustom(false);
    setAmount(val);
  };

  const handleCustomToggle = () => {
    setIsCustom(true);
    if (!customInput) setCustomInput('500');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (effectiveAmount < 10) {
      setErrorMsg('Minimum top-up amount is ₹10.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await onConfirmTopUp(effectiveAmount);
      if (res?.success) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#C8A96B', '#10B981', '#34D399']
          });
        } catch {}
        onClose();
      } else {
        setErrorMsg(res?.error || 'Payment verification failed. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0B2A1A] to-[#071D12] border border-[#C8A96B]/50 shadow-2xl p-6 text-[#F5F4EA]"
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
            <Plus className="w-5 h-5 text-[#071D12]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#F5F4EA]">
              Add Money to Wallet
            </h3>
            <p className="text-xs text-[#A7D7A9] font-mono">
              Current Balance: <strong className="text-white">₹{currentBalance.toLocaleString()}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#C8A96B] font-semibold mb-2">
              Select Amount:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleSelectQuick(amt)}
                  className={`py-2.5 rounded-xl border font-mono font-bold text-sm transition-all cursor-pointer ${
                    !isCustom && amount === amt
                      ? 'bg-[#C8A96B] text-[#071D12] border-[#C8A96B] shadow-md shadow-[#C8A96B]/25 scale-[1.02]'
                      : 'bg-black/30 text-[#F5F4EA] border-white/10 hover:border-[#C8A96B]/40'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}

              <button
                type="button"
                onClick={handleCustomToggle}
                className={`py-2.5 rounded-xl border font-mono font-bold text-sm transition-all cursor-pointer ${
                  isCustom
                    ? 'bg-[#C8A96B] text-[#071D12] border-[#C8A96B] shadow-md shadow-[#C8A96B]/25 scale-[1.02]'
                    : 'bg-black/30 text-[#F5F4EA] border-white/10 hover:border-[#C8A96B]/40'
                }`}
              >
                Custom
              </button>
            </div>

            {isCustom && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-base font-mono text-[#C8A96B] font-bold">₹</span>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter amount (e.g. 500)"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-[#C8A96B]/40 text-[#F5F4EA] font-mono text-sm focus:outline-none focus:border-[#C8A96B]"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Secure Payment Mode Notice */}
          <div className="p-3 rounded-2xl bg-black/30 border border-white/5 space-y-1.5 text-xs text-white/70">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#A7D7A9]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-bit Encrypted Transaction</span>
              </span>
              <span>Razorpay Sandbox</span>
            </div>
            <p className="text-[10px] text-white/50 leading-relaxed font-sans">
              Instant balance activation. Use your wallet balance to share happiness and feed animals across all sanctuary live streams.
            </p>
          </div>

          {errorMsg && (
            <div className="p-2 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing || effectiveAmount < 10}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C8A96B] to-[#DFCA98] hover:brightness-105 active:scale-[0.99] text-[#071D12] font-serif font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#C8A96B]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-[#071D12] border-t-transparent animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Add ₹{effectiveAmount} to Wallet</span>
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
