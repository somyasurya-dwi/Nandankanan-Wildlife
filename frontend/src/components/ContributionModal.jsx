import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  Wallet, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  CreditCard,
  Lock,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ANIMAL_PROGRAMS = [
  {
    slug: 'royal-bengal-tiger',
    name: 'Royal Bengal Tiger',
    emoji: '🐯',
    desc: 'Support approved meat and nutrition programs',
    shareEmoji: '🥩',
    careEmoji: '🍖',
    supportEmoji: '❤️'
  },
  {
    slug: 'asiatic-lion',
    name: 'Asiatic Lion',
    emoji: '🦁',
    desc: 'Support nutrition and animal welfare',
    shareEmoji: '🥩',
    careEmoji: '🍖',
    supportEmoji: '❤️'
  },
  {
    slug: 'asian-elephant',
    name: 'Elephant',
    emoji: '🐘',
    desc: 'Support approved food and care programs',
    shareEmoji: '🍌',
    careEmoji: '🎋',
    supportEmoji: '❤️'
  },
  {
    slug: 'spotted-deer',
    name: 'Deer',
    emoji: '🦌',
    desc: 'Support nutrition and habitat care',
    shareEmoji: '🥕',
    careEmoji: '🌿',
    supportEmoji: '❤️'
  },
  {
    slug: 'sloth-bear',
    name: 'Bear',
    emoji: '🐻',
    desc: 'Support nutrition and veterinary care',
    shareEmoji: '🍯',
    careEmoji: '🍉',
    supportEmoji: '❤️'
  },
  {
    slug: 'birds',
    name: 'Birds',
    emoji: '🐦',
    desc: 'Support approved bird food and habitat care',
    shareEmoji: '🌾',
    careEmoji: '🍇',
    supportEmoji: '❤️'
  },
  {
    slug: 'white-bengal-tiger',
    name: 'White Bengal Tiger',
    emoji: '🐅',
    desc: 'Support approved enrichment nutrition & meat rations',
    shareEmoji: '🥩',
    careEmoji: '🍖',
    supportEmoji: '❤️'
  },
  {
    slug: 'indian-pangolin',
    name: 'Indian Pangolin',
    emoji: '🦔',
    desc: 'Support specialized insect and ant-egg diet formulation',
    shareEmoji: '🐜',
    careEmoji: '🪵',
    supportEmoji: '❤️'
  },
  {
    slug: 'gharial-crocodile',
    name: 'Gharial Crocodile',
    emoji: '🐊',
    desc: 'Support live freshwater fish and veterinary aquatic care',
    shareEmoji: '🐟',
    careEmoji: '🦐',
    supportEmoji: '❤️'
  },
  {
    slug: 'king-cobra',
    name: 'King Cobra',
    emoji: '🐍',
    desc: 'Support climate-controlled terrarium and specialized diet',
    shareEmoji: '🥚',
    careEmoji: '🌿',
    supportEmoji: '❤️'
  },
  {
    slug: 'indian-flapshell-turtle',
    name: 'Indian Flapshell Turtle',
    emoji: '🐢',
    desc: 'Support lake wetland vegetation and aquatic health',
    shareEmoji: '🥬',
    careEmoji: '🌱',
    supportEmoji: '❤️'
  },
  {
    slug: 'asian-openbill',
    name: 'Asian Openbill',
    emoji: '🪶',
    desc: 'Support Lake Kanjia freshwater snail population and wetland care',
    shareEmoji: '🐌',
    careEmoji: '🌾',
    supportEmoji: '❤️'
  }
];

const resolveAnimal = (target) => {
  if (!target) return ANIMAL_PROGRAMS[0];
  const targetSlug = (target.slug || '').toLowerCase();
  const targetName = (target.animal_name || target.name || '').toLowerCase();
  
  if (targetSlug.includes('white') || targetName.includes('white')) {
    return ANIMAL_PROGRAMS.find(a => a.slug === 'white-bengal-tiger') || ANIMAL_PROGRAMS[0];
  }
  if (targetSlug.includes('pangolin') || targetName.includes('pangolin')) {
    return ANIMAL_PROGRAMS.find(a => a.slug === 'indian-pangolin') || ANIMAL_PROGRAMS[0];
  }
  if (targetSlug.includes('gharial') || targetName.includes('gharial') || targetName.includes('crocodile')) {
    return ANIMAL_PROGRAMS.find(a => a.slug === 'gharial-crocodile') || ANIMAL_PROGRAMS[0];
  }
  if (targetSlug.includes('cobra') || targetName.includes('cobra')) {
    return ANIMAL_PROGRAMS.find(a => a.slug === 'king-cobra') || ANIMAL_PROGRAMS[0];
  }
  if (targetSlug.includes('turtle') || targetName.includes('turtle') || targetName.includes('flapshell')) {
    return ANIMAL_PROGRAMS.find(a => a.slug === 'indian-flapshell-turtle') || ANIMAL_PROGRAMS[0];
  }
  if (targetSlug.includes('openbill') || targetName.includes('openbill') || targetName.includes('openbell')) {
    return ANIMAL_PROGRAMS.find(a => a.slug === 'asian-openbill') || ANIMAL_PROGRAMS[0];
  }
  if (targetSlug.includes('lion') || targetName.includes('lion')) {
    return ANIMAL_PROGRAMS.find(a => a.slug === 'asiatic-lion') || ANIMAL_PROGRAMS[0];
  }
  if (targetSlug.includes('elephant') || targetName.includes('elephant')) {
    return ANIMAL_PROGRAMS.find(a => a.slug === 'asian-elephant') || ANIMAL_PROGRAMS[0];
  }
  if (targetSlug.includes('deer') || targetName.includes('deer')) {
    return ANIMAL_PROGRAMS.find(a => a.slug === 'spotted-deer') || ANIMAL_PROGRAMS[0];
  }
  if (targetSlug.includes('bear') || targetName.includes('bear')) {
    return ANIMAL_PROGRAMS.find(a => a.slug === 'sloth-bear') || ANIMAL_PROGRAMS[0];
  }
  if (targetSlug.includes('bird') || targetName.includes('bird') || targetName.includes('peacock')) {
    return ANIMAL_PROGRAMS.find(a => a.slug === 'birds') || ANIMAL_PROGRAMS[0];
  }
  return ANIMAL_PROGRAMS.find(a => a.slug === 'royal-bengal-tiger') || ANIMAL_PROGRAMS[0];
};

export default function ContributionModal({
  isOpen,
  onClose,
  initialAmount = 50,
  initialAnimal = null,
  walletBalance = 150,
  onConfirmContribution,
  onOpenAddMoney
}) {
  if (!isOpen) return null;

  // Selected animal
  const [selectedAnimal, setSelectedAnimal] = useState(() => resolveAnimal(initialAnimal));

  useEffect(() => {
    if (initialAnimal) {
      setSelectedAnimal(resolveAnimal(initialAnimal));
    }
  }, [initialAnimal, isOpen]);

  // Selected amount (10, 50, 100, or custom)
  const [selectedAmount, setSelectedAmount] = useState(
    initialAmount === 'custom' ? 100 : (Number(initialAmount) || 50)
  );
  const [isCustom, setIsCustom] = useState(initialAmount === 'custom');
  const [customInput, setCustomInput] = useState(initialAmount === 'custom' ? '200' : '');

  // Form fields
  const [donorName, setDonorName] = useState('Priya Sharma');
  const [personalMessage, setPersonalMessage] = useState('Sending love to our majestic friends! ❤️');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(walletBalance >= 50 ? 'wallet' : 'razorpay');

  // Loading & error state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const effectiveAmount = isCustom ? (parseInt(customInput, 10) || 0) : selectedAmount;
  const canPayFromWallet = walletBalance >= effectiveAmount;

  const handleAmountClick = (amt) => {
    setIsCustom(false);
    setSelectedAmount(amt);
    if (walletBalance < amt && paymentMethod === 'wallet') {
      setPaymentMethod('razorpay');
    }
  };

  const handleCustomClick = () => {
    setIsCustom(true);
    if (!customInput) setCustomInput('200');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (effectiveAmount < 1) {
      setErrorMessage('Please enter a valid contribution amount of at least ₹10.');
      return;
    }

    if (paymentMethod === 'wallet' && !canPayFromWallet) {
      setErrorMessage(`Insufficient wallet balance (₹${walletBalance}). Please top up your wallet or pay via card/UPI.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await onConfirmContribution({
        animal: selectedAnimal,
        amount: effectiveAmount,
        donorName: isAnonymous ? 'Anonymous Wildlife Friend' : donorName,
        personalMessage,
        isAnonymous,
        paymentMethod
      });

      if (res?.success) {
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#C8A96B', '#10B981', '#F59E0B', '#EF4444']
          });
        } catch {}
        onClose();
      } else if (res?.error) {
        setErrorMessage(res.error);
      }
    } catch (err) {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-md sm:max-w-lg rounded-2xl bg-gradient-to-b from-[#0B2A1A] to-[#071D12] border border-[#C8A96B]/50 shadow-2xl p-3.5 sm:p-4.5 text-[#F5F4EA] my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-1.5 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C8A96B] to-[#997736] flex items-center justify-center text-lg shadow-md shadow-[#C8A96B]/30 shrink-0">
            {selectedAnimal?.emoji || <Heart className="w-4 h-4 text-[#071D12] fill-current" />}
          </div>
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#F5F4EA] leading-tight">
              Share Happiness, Feed {selectedAnimal?.name || 'Wildlife'}
            </h3>
            <p className="text-[11px] sm:text-xs text-[#C8A96B] font-mono">
              {selectedAnimal?.desc || 'Support approved animal nutrition & welfare programs'} ❤️
            </p>
          </div>
        </div>

        {/* Zoo-Approved Welfare Notice */}
        <div className="mb-2.5 p-2 rounded-lg bg-forest-900/80 border border-[#C8A96B]/20 text-[10px] sm:text-[10.5px] text-[#A7D7A9] flex items-start gap-1.5 leading-snug">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>Official Care Protocol:</strong> Donations support zoo-approved animal nutrition, veterinary care, & enrichment diets managed by Nandankanan wildlife experts. Visitors do not directly feed animals.
          </span>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-2.5">
          
          {/* Contribution Amount */}
          <div>
            <label className="block text-[10.5px] sm:text-xs font-mono uppercase tracking-wider text-[#C8A96B] font-semibold mb-1">
              Select Contribution Amount:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { amt: 10, label: 'Share', emoji: selectedAnimal?.shareEmoji || '🥩' },
                { amt: 50, label: 'Care', emoji: selectedAnimal?.careEmoji || '🍖' },
                { amt: 100, label: 'Support', emoji: selectedAnimal?.supportEmoji || '❤️' },
              ].map((opt) => (
                <button
                  key={opt.amt}
                  type="button"
                  onClick={() => handleAmountClick(opt.amt)}
                  className={`py-1.5 px-1 rounded-lg border text-[11px] font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                    !isCustom && selectedAmount === opt.amt
                      ? 'bg-[#C8A96B] text-[#071D12] border-[#C8A96B] shadow-sm shadow-[#C8A96B]/25 scale-[1.01]'
                      : 'bg-[#06180E]/80 text-[#F5F4EA] border-white/10 hover:border-[#C8A96B]/40 hover:bg-[#14532D]/40'
                  }`}
                >
                  <span className="text-xs">{opt.emoji}</span>
                  <span className="font-mono text-xs font-black">₹{opt.amt}</span>
                  <span className="text-[9.5px] font-normal opacity-80">{opt.label}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={handleCustomClick}
                className={`py-1.5 px-1 rounded-lg border text-[11px] font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                  isCustom
                    ? 'bg-[#C8A96B] text-[#071D12] border-[#C8A96B] shadow-sm shadow-[#C8A96B]/25 scale-[1.01]'
                    : 'bg-[#06180E]/80 text-[#F5F4EA] border-white/10 hover:border-[#C8A96B]/40 hover:bg-[#14532D]/40'
                }`}
              >
                <span className="text-xs">⭐</span>
                <span className="font-mono text-xs font-black">Extra</span>
                <span className="text-[9.5px] font-normal opacity-80">Custom</span>
              </button>
            </div>

            {/* Custom Amount Input */}
            {isCustom && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="text-xs font-mono text-[#C8A96B] font-bold">₹</span>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter amount (e.g. 250)"
                  className="w-full px-2.5 py-1 rounded-lg bg-black/40 border border-[#C8A96B]/40 text-[#F5F4EA] font-mono text-xs focus:outline-none focus:border-[#C8A96B]"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* 3. Donor Name & Message */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[10.5px] font-mono uppercase tracking-wider text-[#C8A96B] font-semibold mb-0.5">
                Your Name:
              </label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Priya Sharma"
                disabled={isAnonymous}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-[#F5F4EA] focus:outline-none focus:border-[#C8A96B] disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[10.5px] font-mono uppercase tracking-wider text-[#C8A96B] font-semibold mb-0.5">
                Personal Message:
              </label>
              <input
                type="text"
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder="Sending love to our majestic friends! ❤️"
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-[#F5F4EA] focus:outline-none focus:border-[#C8A96B]"
              />
            </div>
          </div>

          {/* 4. Anonymous Toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[#A7D7A9] font-sans">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="accent-[#C8A96B] w-3.5 h-3.5 rounded cursor-pointer"
            />
            <span>Make my contribution anonymous in Live Sharing Moments</span>
          </label>

          {/* 5. Payment Method Selector */}
          <div>
            <label className="block text-[10.5px] sm:text-xs font-mono uppercase tracking-wider text-[#C8A96B] font-semibold mb-1">
              Payment Method:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                disabled={!canPayFromWallet}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'wallet' && canPayFromWallet
                    ? 'bg-[#14532D] border-emerald-400 text-white shadow-sm'
                    : canPayFromWallet
                    ? 'bg-black/30 border-white/10 text-[#F5F4EA]/70 hover:border-white/20'
                    : 'bg-black/20 border-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <Wallet className="w-3 h-3 text-emerald-400" />
                  <span className="text-[11px] font-bold">Wildlife Wallet</span>
                </div>
                <div className="text-[9.5px] font-mono text-[#C8A96B]">
                  Balance: ₹{walletBalance}
                  {!canPayFromWallet && <span className="text-red-400 block">(Need ₹{effectiveAmount - walletBalance} more)</span>}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'razorpay'
                    ? 'bg-[#14532D] border-[#C8A96B] text-white shadow-sm'
                    : 'bg-black/30 border-white/10 text-[#F5F4EA]/70 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <CreditCard className="w-3 h-3 text-[#C8A96B]" />
                  <span className="text-[11px] font-bold">UPI / Card / NetBanking</span>
                </div>
                <span className="text-[9.5px] font-mono text-[#A7D7A9]">
                  Instant Razorpay Demo
                </span>
              </button>
            </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-2 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 text-[11px] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-1 sm:pt-1.5">
            <button
              type="submit"
              disabled={isSubmitting || effectiveAmount <= 0}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C8A96B] via-[#E2CB99] to-[#C8A96B] hover:brightness-105 active:scale-[0.99] text-[#071D12] font-serif font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#C8A96B]/25 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-[#071D12] border-t-transparent animate-spin" />
                  <span>Verifying Contribution...</span>
                </>
              ) : (
                <>
                  <Heart className="w-3.5 h-3.5 fill-current text-rose-700" />
                  <span>Confirm Contribution – ₹{effectiveAmount}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
