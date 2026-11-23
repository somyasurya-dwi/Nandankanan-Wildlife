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

export const FOOD_CONTRIBUTIONS = [
  {
    id: 'green-leaves',
    name: 'Green Leaves',
    emoji: '🥬',
    price: 20
  },
  {
    id: 'chicken-leg',
    name: 'Chicken Leg',
    emoji: '🍗',
    price: 50
  },
  {
    id: 'chicken-breast',
    name: 'Chicken Breast',
    emoji: '🍗',
    price: 70
  },
  {
    id: 'buffalo-meat',
    name: 'Buffalo Meat',
    emoji: '🥩',
    price: 100
  },
  {
    id: 'fruit-basket',
    name: 'Fruit Basket',
    emoji: '🍎',
    price: 40
  },
  {
    id: 'vegetable-basket',
    name: 'Vegetable Basket',
    emoji: '🥕',
    price: 30
  },
  {
    id: 'hay-dry-grass',
    name: 'Hay / Dry Grass',
    emoji: '🌾',
    price: 25
  },
  {
    id: 'bird-food-mix',
    name: 'Bird Food Mix',
    emoji: '🐦',
    price: 35
  },
  {
    id: 'fresh-fish',
    name: 'Fresh Fish',
    emoji: '🐟',
    price: 60
  },
  {
    id: 'honey-treat',
    name: 'Honey & Treat',
    emoji: '🍯',
    price: 80
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

  // Food selection state (defaults to chicken-leg or matching initialAmount)
  const [selectedFoodId, setSelectedFoodId] = useState(() => {
    if (initialAmount === 'custom') return null;
    const match = FOOD_CONTRIBUTIONS.find(f => f.price === Number(initialAmount));
    return match ? match.id : 'chicken-leg';
  });

  const selectedFood = FOOD_CONTRIBUTIONS.find(f => f.id === selectedFoodId);

  // Selected amount (from food or custom)
  const [selectedAmount, setSelectedAmount] = useState(() => {
    if (initialAmount === 'custom') return 100;
    const match = FOOD_CONTRIBUTIONS.find(f => f.price === Number(initialAmount));
    return match ? match.price : 50;
  });
  const [isCustom, setIsCustom] = useState(initialAmount === 'custom');
  const [customInput, setCustomInput] = useState(initialAmount === 'custom' ? '200' : '');

  const handleFoodSelect = (food) => {
    setIsCustom(false);
    setSelectedFoodId(food.id);
    setSelectedAmount(food.price);
    if (walletBalance < food.price && paymentMethod === 'wallet') {
      setPaymentMethod('razorpay');
    }
  };

  const handleCustomClick = () => {
    setIsCustom(true);
    setSelectedFoodId(null);
    if (!customInput) setCustomInput('200');
  };

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
      const currentFood = FOOD_CONTRIBUTIONS.find(f => f.id === selectedFoodId);
      const res = await onConfirmContribution({
        animal: selectedAnimal,
        amount: effectiveAmount,
        foodItem: isCustom ? null : currentFood,
        foodName: isCustom ? 'Custom Contribution' : currentFood?.name,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-md sm:max-w-lg rounded-2xl bg-gradient-to-b from-[#0B2A1A] to-[#071D12] border border-[#C8A96B]/50 shadow-2xl p-3 sm:p-3.5 text-[#F5F4EA] my-auto max-h-[96vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 p-1.5 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C8A96B] to-[#997736] flex items-center justify-center text-lg shadow-md shadow-[#C8A96B]/30 shrink-0">
            {selectedAnimal?.emoji || <Heart className="w-4 h-4 text-[#071D12] fill-current" />}
          </div>
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#F5F4EA] leading-tight">
              Share Happiness, Feed {selectedAnimal?.name || 'Wildlife'}
            </h3>
            {/* Animal ration profile reference: selectedAnimal?.shareEmoji || selectedAnimal?.careEmoji */}
            <p className="text-[11px] sm:text-xs text-[#C8A96B] font-mono">
              {selectedAnimal?.desc || 'Support approved animal nutrition & welfare programs'}
            </p>
          </div>
        </div>

        {/* Zoo-Approved Welfare Notice */}
        <div className="mb-2 p-1.5 sm:p-2 rounded-lg bg-forest-900/80 border border-[#C8A96B]/20 text-[10px] sm:text-[10.5px] text-[#A7D7A9] flex items-start gap-1.5 leading-snug">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>Official Care Protocol:</strong> Donations support zoo-approved animal nutrition, veterinary care, & enrichment diets managed by Nandankanan wildlife experts. Visitors do not directly feed animals.
          </span>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-2">
          
          {/* SELECT FOOD CONTRIBUTION */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#C8A96B] font-bold">
                Select Food Contribution:
              </label>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                10 options
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {FOOD_CONTRIBUTIONS.map((food) => {
                const isSelected = !isCustom && selectedFoodId === food.id;
                return (
                  <button
                    key={food.id}
                    type="button"
                    onClick={() => handleFoodSelect(food)}
                    className={`px-2.5 py-1.5 rounded-lg border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-[#C8A96B] text-[#071D12] border-[#C8A96B] shadow-sm shadow-[#C8A96B]/30 font-bold scale-[1.01]'
                        : 'bg-[#06180E]/90 text-[#F5F4EA] border-white/10 hover:border-[#C8A96B]/50 hover:bg-[#0B2A1A]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-base shrink-0 leading-none">{food.emoji}</span>
                      <span className={`font-serif font-bold text-[11px] sm:text-xs truncate ${isSelected ? 'text-[#071D12]' : 'text-[#F5F4EA]'}`}>
                        {food.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      <span className={`font-mono font-bold text-[11px] sm:text-xs ${isSelected ? 'text-[#071D12]' : 'text-[#C8A96B]'}`}>
                        ₹{food.price}
                      </span>
                      {isSelected && (
                        <span className="w-3.5 h-3.5 rounded-full bg-[#071D12] text-[#C8A96B] flex items-center justify-center shrink-0">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Option */}
            <div className="mt-2 flex items-center justify-between text-xs pt-1 border-t border-white/10">
              <button
                type="button"
                onClick={handleCustomClick}
                className={`text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isCustom ? 'text-[#C8A96B] font-bold underline' : 'text-[#A7D7A9] hover:text-[#C8A96B]'
                }`}
              >
                <span>⭐</span>
                <span>Or enter custom contribution amount</span>
              </button>
              {isCustom && (
                <div className="flex items-center gap-1.5 w-32">
                  <span className="text-xs font-mono text-[#C8A96B] font-bold">₹</span>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full px-2 py-0.5 rounded bg-black/50 border border-[#C8A96B]/50 text-[#F5F4EA] font-mono text-xs focus:outline-none focus:border-[#C8A96B]"
                    autoFocus
                  />
                </div>
              )}
            </div>
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
                className={`p-1.5 sm:p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'wallet' && canPayFromWallet
                    ? 'bg-[#14532D] border-emerald-400 text-white shadow-sm'
                    : canPayFromWallet
                    ? 'bg-black/30 border-white/10 text-[#F5F4EA]/70 hover:border-white/20'
                    : 'bg-black/20 border-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <Wallet className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10.5px] sm:text-[11px] font-bold">Wildlife Wallet</span>
                </div>
                <div className="text-[9.5px] font-mono text-[#C8A96B]">
                  Balance: ₹{walletBalance}
                  {!canPayFromWallet && <span className="text-red-400 block">(Need ₹{effectiveAmount - walletBalance} more)</span>}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-1.5 sm:p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'razorpay'
                    ? 'bg-[#14532D] border-[#C8A96B] text-white shadow-sm'
                    : 'bg-black/30 border-white/10 text-[#F5F4EA]/70 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <CreditCard className="w-3 h-3 text-[#C8A96B]" />
                  <span className="text-[10.5px] sm:text-[11px] font-bold">UPI / Card / NetBanking</span>
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
          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting || effectiveAmount <= 0}
              className="w-full py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#C8A96B] via-[#E2CB99] to-[#C8A96B] hover:brightness-105 active:scale-[0.99] text-[#071D12] font-serif font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#C8A96B]/25 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
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
