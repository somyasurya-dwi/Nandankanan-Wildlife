import React, { useState } from 'react';
import { 
  User, 
  Users, 
  Check, 
  ArrowRight, 
  Binoculars, 
  Sprout, 
  Calendar, 
  PawPrint,
  Sparkles
} from 'lucide-react';
import Realistic3DIcon from './reactions/Realistic3DIcon';

export const USER_TIERS = [
  { id: '1_user', label: '1 User', icon: 'user', count: 1 },
  { id: '3_users', label: '3 Users', icon: 'users', count: 3 },
  { id: '5_users', label: '5 Users', icon: 'users', count: 5 }
];

export const SUBSCRIPTION_PLANS = [
  {
    id: 'plan_1m',
    durationMonths: 1,
    title: '1 Month',
    subtitle: 'Explore Nandankanan for 30 days',
    days: 30,
    periodLabel: '/ month',
    discount: null,
    isPopular: false,
    prices: {
      '1_user': 99,
      '3_users': 199,
      '5_users': 299
    },
    features: [
      'Wildlife & park information',
      'Personalized visit planning',
      'Conservation updates'
    ]
  },
  {
    id: 'plan_3m',
    durationMonths: 3,
    title: '3 Months',
    subtitle: 'Explore more, save more',
    days: 90,
    periodLabel: '/ 3 months',
    discount: 'Save 17%',
    isPopular: true,
    prices: {
      '1_user': 249,
      '3_users': 499,
      '5_users': 749
    },
    features: [
      'Wildlife & park information',
      'Personalized visit planning',
      'Conservation updates'
    ]
  },
  {
    id: 'plan_6m',
    durationMonths: 6,
    title: '6 Months',
    subtitle: 'Longer support for wildlife',
    days: 180,
    periodLabel: '/ 6 months',
    discount: 'Save 25%',
    isPopular: false,
    prices: {
      '1_user': 449,
      '3_users': 899,
      '5_users': 1349
    },
    features: [
      'Wildlife & park information',
      'Personalized visit planning',
      'Conservation updates'
    ]
  }
];

export default function AnimalSubscriptionPlans({
  animal,
  onSelectPlan,
  isSubscribed = false,
  activeSubscription = null,
  className = ''
}) {
  const [selectedTier, setSelectedTier] = useState('1_user'); // '1_user' | '3_users' | '5_users'
  const [selectedPlanId, setSelectedPlanId] = useState('plan_3m'); // Default: 3 Months (Most Popular)

  const targetAnimalName = animal?.animal_name || 'Nandankanan Wildlife';
  const selectedPlan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1];
  const selectedPrice = selectedPlan.prices[selectedTier] || selectedPlan.prices['1_user'];

  const handleChoosePlan = (plan) => {
    setSelectedPlanId(plan.id);
  };

  const handleProceedPayment = () => {
    if (onSelectPlan) {
      onSelectPlan({
        ...selectedPlan,
        tier: selectedTier,
        totalPrice: selectedPrice,
        price: selectedPrice
      });
    }
  };

  return (
    <section 
      id="animal-subscription-plans"
      aria-label={`Live stream subscription plans for ${targetAnimalName}`}
      className={`w-full max-w-6xl mx-auto mt-6 sm:mt-10 mb-8 sm:mb-12 px-3 sm:px-6 select-none ${className}`}
    >
      {/* =========================================================================
          1. TOP USER TIER SWITCHER (1 User | 3 Users | 5 Users)
          ========================================================================= */}
      <div className="flex flex-col items-center justify-center mb-6 sm:mb-8">
        
        {/* Subtle Section Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14532D]/70 border border-[#C8A96B]/40 text-[#C8A96B] text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase mb-3 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
          <span>Official Live Video Passes</span>
        </div>

        {/* User Multiplier Segmented Capsule Pill */}
        <div className="inline-flex items-center p-1 sm:p-1.5 rounded-full bg-[#06180E]/95 border border-[#C8A96B]/50 shadow-2xl backdrop-blur-xl">
          {USER_TIERS.map((tier, idx) => {
            const isTierActive = selectedTier === tier.id;
            return (
              <React.Fragment key={tier.id}>
                {idx > 0 && <span className="text-white/25 mx-1 font-mono hidden sm:inline">|</span>}
                <button
                  type="button"
                  onClick={() => setSelectedTier(tier.id)}
                  className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    isTierActive
                      ? 'bg-gradient-to-r from-[#C8A96B] via-[#E5C378] to-[#C8A96B] text-[#071D12] shadow-lg shadow-[#C8A96B]/30 scale-100 ring-1 ring-[#C8A96B]'
                      : 'text-[#F5F4EA]/80 hover:text-white hover:bg-white/5'
                  }`}
                  aria-pressed={isTierActive}
                >
                  {tier.icon === 'user' ? (
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                  ) : (
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                  )}
                  <span>{tier.label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          2. 3 PRICING CARDS (1 Month | 3 Months [MOST POPULAR] | 6 Months)
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          const planPrice = plan.prices[selectedTier] || plan.prices['1_user'];

          return (
            <div
              key={plan.id}
              onClick={() => handleChoosePlan(plan)}
              className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-b from-[#0B2A1A] via-[#071D12] to-[#04110A] border-2 border-[#C8A96B] ring-2 ring-[#C8A96B]/80 shadow-[0_0_35px_rgba(200,169,107,0.32)] scale-[1.01]'
                  : 'bg-[#06180E]/90 border border-[#C8A96B]/35 hover:border-[#C8A96B]/70 shadow-xl hover:shadow-2xl backdrop-blur-xl'
              }`}
            >
              {/* Highlight Badge on Top for 3 Months */}
              {plan.isPopular && (
                <div className="absolute -top-3.5 inset-x-0 mx-auto w-fit z-20">
                  <span className="px-3.5 py-0.5 rounded-full bg-gradient-to-r from-[#C8A96B] via-[#E5C378] to-[#C8A96B] text-[#071D12] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest shadow-lg shadow-[#C8A96B]/40 border border-white/20">
                    ★ MOST POPULAR ★
                  </span>
                </div>
              )}

              {/* Card Top: Title, Subtitle, Price & Discount */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F4EA] tracking-wide">
                  {plan.title}
                </h3>

                <p className="mt-1.5 text-xs sm:text-sm text-[#A7D7A9] font-sans">
                  {plan.subtitle}
                </p>

                {/* Pricing Block */}
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#C8A96B] font-display tracking-tight">
                    ₹{planPrice}
                  </span>
                  <span className="text-xs sm:text-sm text-[#F5F4EA]/70 font-sans">
                    {plan.periodLabel}
                  </span>
                  {plan.discount && (
                    <span className="ml-2 px-2.5 py-0.5 rounded-full bg-[#C8A96B] text-[#071D12] text-[10.5px] font-bold font-sans tracking-wide shadow-sm">
                      {plan.discount}
                    </span>
                  )}
                </div>

                {/* Features Checkmark List */}
                <ul className="my-6 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-[13px] text-[#F5F4EA]/90 leading-snug">
                      <span className="w-4 h-4 rounded-full border border-[#C8A96B] flex items-center justify-center text-[#C8A96B] shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card CTA Action Button */}
              <div className="pt-2">
                {isSelected ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProceedPayment();
                    }}
                    className="w-full py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#C8A96B] via-[#E5C378] to-[#C8A96B] hover:brightness-110 active:scale-95 text-[#071D12] font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#C8A96B]/30 transition-all cursor-pointer"
                  >
                    Selected
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChoosePlan(plan);
                    }}
                    className="w-full py-2.5 sm:py-3 rounded-full border border-[#C8A96B] hover:bg-[#C8A96B]/15 active:scale-95 text-[#C8A96B] font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer"
                  >
                    Choose Plan
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* =========================================================================
          3. FEATURE HIGHLIGHT / VALUE PROPOSITION STRIP (Under Cards)
          ========================================================================= */}
      <div className="mt-6 sm:mt-8 p-3.5 sm:p-5 rounded-2xl bg-[#06180E]/90 border border-[#C8A96B]/30 shadow-lg backdrop-blur-xl grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 items-center">
        
        {/* Item 1: 24/7 Live Wildlife Camera */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="text-[#C8A96B] shrink-0">
            <Binoculars className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8] text-[#E5C378]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-[13px] font-bold text-[#F5F4EA] leading-tight">
              24/7 Live
            </h4>
            <p className="text-[10px] sm:text-[11px] text-[#A7D7A9] font-sans mt-0.5">
              Wildlife Camera
            </p>
          </div>
        </div>

        {/* Item 2: Exclusive Conservation Updates */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="text-[#C8A96B] shrink-0">
            <Sprout className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8] text-[#E5C378]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-[13px] font-bold text-[#F5F4EA] leading-tight">
              Exclusive
            </h4>
            <p className="text-[10px] sm:text-[11px] text-[#A7D7A9] font-sans mt-0.5">
              Conservation Updates
            </p>
          </div>
        </div>

        {/* Item 3: Plan Your Visit with Ease */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="text-[#C8A96B] shrink-0">
            <Calendar className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8] text-[#E5C378]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-[13px] font-bold text-[#F5F4EA] leading-tight">
              Plan Your Visit
            </h4>
            <p className="text-[10px] sm:text-[11px] text-[#A7D7A9] font-sans mt-0.5">
              with Ease
            </p>
          </div>
        </div>

        {/* Item 4: Contribute to Wildlife Conservation */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="text-[#C8A96B] shrink-0">
            <PawPrint className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8] text-[#E5C378]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-[13px] font-bold text-[#F5F4EA] leading-tight">
              Contribute to
            </h4>
            <p className="text-[10px] sm:text-[11px] text-[#A7D7A9] font-sans mt-0.5">
              Wildlife Conservation
            </p>
          </div>
        </div>

      </div>

      {/* =========================================================================
          4. BOTTOM PROMINENT ACTION BAR (Subscribe & Continue to Payment)
          ========================================================================= */}
      <div className="mt-4 sm:mt-5 p-3 sm:p-4 rounded-2xl sm:rounded-full bg-[#06180E] border border-[#C8A96B]/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left Side: Paw icon + Dynamic Subscription Title & Price */}
        <div className="flex items-center gap-2.5 text-sm sm:text-base font-serif font-bold text-[#F5F4EA] px-2 sm:px-3 text-center sm:text-left">
          <span className="w-6 h-6 rounded-full bg-[#14532D] flex items-center justify-center text-[#E5C378] text-xs shrink-0 border border-[#C8A96B]/40">
            🐾
          </span>
          <span>
            Subscribe to {targetAnimalName} ({selectedPlan.title}) – ₹{selectedPrice}
          </span>
        </div>

        {/* Right Side: Continue to Payment Pill Button */}
        <button
          type="button"
          onClick={handleProceedPayment}
          className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#C8A96B] via-[#E5C378] to-[#C8A96B] hover:brightness-110 active:scale-95 text-[#071D12] font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#C8A96B]/30 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <span>Continue to Payment</span>
          <ArrowRight className="w-4 h-4 text-[#071D12]" />
        </button>

      </div>

    </section>
  );
}
