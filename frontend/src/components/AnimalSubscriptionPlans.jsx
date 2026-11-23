import React from 'react';
import { 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  RotateCcw, 
  Headphones, 
  Award,
  Sparkles,
  Lock,
  Heart,
  Star
} from 'lucide-react';
import Realistic3DIcon from './reactions/Realistic3DIcon';

export const SUBSCRIPTION_PLANS = [
  {
    id: 'plan_1m',
    durationMonths: 1,
    title: '1 Month',
    subtitle: 'Start your conservation journey',
    basePrice: 199,
    gstPercent: 18,
    totalPrice: 235,
    iconType: 'calendar_1',
    badge: null,
    isPopular: false,
    isBestValue: false,
    days: 30,
    features: [
      '24/7 Live enclosure camera stream',
      'Digital adoption certificate',
      'Monthly animal health update',
      'Community supporter badge'
    ]
  },
  {
    id: 'plan_3m',
    durationMonths: 3,
    title: '3 Months',
    subtitle: 'Support & watch them grow',
    basePrice: 299,
    gstPercent: 18,
    totalPrice: 353,
    iconType: 'calendar_3',
    badge: '★ Most Popular ★',
    isPopular: true,
    isBestValue: false,
    days: 90,
    features: [
      '24/7 Live enclosure camera stream',
      'Digital adoption certificate',
      'Weekly keeper video updates',
      'Priority live feed access'
    ]
  },
  {
    id: 'plan_6m',
    durationMonths: 6,
    title: '6 Months',
    subtitle: 'Deeper bond with wildlife',
    basePrice: 499,
    gstPercent: 18,
    totalPrice: 589,
    iconType: 'calendar_6',
    badge: null,
    isPopular: false,
    isBestValue: false,
    days: 180,
    features: [
      '24/7 Live enclosure camera stream',
      'Digital adoption certificate',
      'Weekly keeper video updates',
      '1 Free zoo entry pass'
    ]
  },
  {
    id: 'plan_12m',
    durationMonths: 12,
    title: '12 Months',
    subtitle: 'Year-round wildlife guardian',
    basePrice: 699,
    gstPercent: 18,
    totalPrice: 825,
    iconType: 'guardian_tiger',
    badge: '♥ Best Value',
    isPopular: false,
    isBestValue: true,
    days: 365,
    features: [
      '24/7 Live enclosure camera stream',
      'Official 365 day adoption certificate',
      'Name on virtual adopter wall',
      '2 Free zoo entry passes'
    ]
  }
];

// Custom Plan Icons matching reference image styling
function PlanBadgeIcon({ type, animal }) {
  if (type === 'calendar_1') {
    return (
      <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" stroke="#C8A96B" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
        <circle cx="32" cy="32" r="26" fill="#06180E" stroke="#C8A96B" strokeWidth="2.2" />
        {/* Calendar body */}
        <rect x="18" y="18" width="28" height="26" rx="4" stroke="#E5C378" strokeWidth="2" fill="#0B2A1A" />
        <line x1="18" y1="26" x2="46" y2="26" stroke="#E5C378" strokeWidth="1.8" />
        {/* Binder rings */}
        <line x1="24" y1="15" x2="24" y2="19" stroke="#C8A96B" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="40" y1="15" x2="40" y2="19" stroke="#C8A96B" strokeWidth="2.5" strokeLinecap="round" />
        {/* Number 1 */}
        <text x="32" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="system-ui, sans-serif">1</text>
        {/* Small clock circle */}
        <circle cx="43" cy="41" r="7" fill="#071D12" stroke="#E5C378" strokeWidth="1.8" />
        <polyline points="43,37 43,41 46,43" stroke="#E5C378" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'calendar_3') {
    return (
      <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" stroke="#C8A96B" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
        <circle cx="32" cy="32" r="26" fill="#06180E" stroke="#C8A96B" strokeWidth="2.2" />
        {/* Calendar body */}
        <rect x="18" y="18" width="28" height="26" rx="4" stroke="#E5C378" strokeWidth="2" fill="#0B2A1A" />
        <line x1="18" y1="26" x2="46" y2="26" stroke="#E5C378" strokeWidth="1.8" />
        {/* Binder rings */}
        <line x1="24" y1="15" x2="24" y2="19" stroke="#C8A96B" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="40" y1="15" x2="40" y2="19" stroke="#C8A96B" strokeWidth="2.5" strokeLinecap="round" />
        {/* Number 3 */}
        <text x="32" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="system-ui, sans-serif">3</text>
        {/* Paw emblem in bottom corner */}
        <circle cx="43" cy="41" r="7" fill="#071D12" stroke="#C8A96B" strokeWidth="1.8" />
        <circle cx="41.5" cy="42" r="1.8" fill="#E5C378" />
        <circle cx="40.5" cy="39" r="0.9" fill="#E5C378" />
        <circle cx="43" cy="38" r="0.9" fill="#E5C378" />
        <circle cx="45" cy="39.5" r="0.9" fill="#E5C378" />
      </svg>
    );
  }

  if (type === 'calendar_6') {
    return (
      <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" stroke="#C8A96B" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
        <circle cx="32" cy="32" r="26" fill="#06180E" stroke="#C8A96B" strokeWidth="2.2" />
        {/* Calendar body */}
        <rect x="18" y="18" width="28" height="26" rx="4" stroke="#E5C378" strokeWidth="2" fill="#0B2A1A" />
        <line x1="18" y1="26" x2="46" y2="26" stroke="#E5C378" strokeWidth="1.8" />
        {/* Binder rings */}
        <line x1="24" y1="15" x2="24" y2="19" stroke="#C8A96B" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="40" y1="15" x2="40" y2="19" stroke="#C8A96B" strokeWidth="2.5" strokeLinecap="round" />
        {/* Number 6 */}
        <text x="32" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="system-ui, sans-serif">6</text>
        {/* Globe / Clock in corner */}
        <circle cx="43" cy="41" r="7" fill="#071D12" stroke="#E5C378" strokeWidth="1.8" />
        <ellipse cx="43" cy="41" rx="3.5" ry="6.5" stroke="#E5C378" strokeWidth="1" />
        <line x1="36" y1="41" x2="50" y2="41" stroke="#E5C378" strokeWidth="1" />
      </svg>
    );
  }

  // Golden Tiger emblem / Realistic3DIcon
  return (
    <div className="relative w-12 h-12 rounded-full border-2 border-[#C8A96B] bg-[#06180E] flex items-center justify-center shadow-lg shadow-[#C8A96B]/30 ring-2 ring-[#E5C378]/40">
      {animal?.iconKey ? (
        <Realistic3DIcon iconKey={animal.iconKey} size={28} className="drop-shadow-md" />
      ) : (
        <span className="text-2xl">{animal?.emoji || '🐯'}</span>
      )}
    </div>
  );
}

export default function AnimalSubscriptionPlans({
  animal,
  onSelectPlan,
  isSubscribed = false,
  activeSubscription = null,
  className = ''
}) {
  const targetAnimalName = animal?.animal_name || 'Sanctuary Wildlife';

  return (
    <section 
      id="animal-subscription-plans"
      aria-label={`Live stream subscription plans for ${targetAnimalName}`}
      className={`w-full max-w-7xl mx-auto mt-6 sm:mt-10 mb-8 sm:mb-12 px-3 sm:px-6 select-none ${className}`}
    >
      {/* =========================================================================
          SECTION HEADER
          ========================================================================= */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#14532D]/70 border border-[#C8A96B]/50 text-[#C8A96B] text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase mb-3 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
          <span>Official 24/7 Enclosure Access Plans</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#F5F4EA] tracking-wide leading-tight">
          Live Video Stream & Conservation Subscription
        </h2>
        
        <p className="mt-2.5 text-xs sm:text-sm text-[#A7D7A9] leading-relaxed">
          Support <strong className="text-[#F5F4EA] font-semibold">{targetAnimalName}</strong> directly through continuous optical telemetry. 100% of proceeds fund specialized diet, veterinary healthcare, and naturalized enclosure enrichment.
        </p>
      </div>

      {/* =========================================================================
          4-TIER SUBSCRIPTION CARDS GRID
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 items-stretch">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isFeatured = plan.isPopular || plan.isBestValue;
          
          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] ${
                isFeatured
                  ? 'bg-gradient-to-b from-[#0B2A1A] via-[#071D12] to-[#04110A] border-2 border-[#C8A96B] shadow-[0_16px_40px_rgba(200,169,107,0.22)] ring-1 ring-[#C8A96B]/50 pt-8 sm:pt-9 p-5 sm:p-6'
                  : 'bg-gradient-to-b from-[#071D12]/95 to-[#04110A] border-2 border-[#C8A96B]/35 hover:border-[#C8A96B]/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)] pt-6 p-5 sm:p-6'
              }`}
            >
              {/* Highlight Badges on Top */}
              {plan.badge && (
                <div className="absolute -top-3.5 inset-x-0 mx-auto w-fit z-20">
                  <span className="px-4 py-1 rounded-full bg-gradient-to-r from-[#C8A96B] via-[#E5C378] to-[#C8A96B] text-[#071D12] text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#C8A96B]/40 flex items-center gap-1.5 border border-white/20">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Card Top Section: Icon, Duration, Subtitle, Price & Total */}
              <div>
                {/* Plan Circular Icon */}
                <div className="flex items-center justify-center mb-3 sm:mb-4">
                  <PlanBadgeIcon type={plan.iconType} animal={animal} />
                </div>

                {/* Duration Title */}
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-center text-[#F5F4EA] tracking-wide">
                  {plan.title}
                </h3>

                {/* Plan Subtitle */}
                <p className="mt-1 text-xs text-center text-[#A7D7A9] font-sans">
                  {plan.subtitle}
                </p>

                {/* Pricing Block */}
                <div className="mt-4 sm:mt-5 text-center">
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#C8A96B] font-display tracking-tight">
                      ₹{plan.basePrice}
                    </span>
                    <span className="text-xs sm:text-sm text-[#F5F4EA]/70 font-sans">
                      + GST ({plan.gstPercent}%)
                    </span>
                  </div>

                  {/* Total Pill Badge matching reference image */}
                  <div className="mt-2.5 inline-flex items-center justify-center">
                    <span className="px-3.5 py-1 rounded-full bg-[#06180E] border border-[#C8A96B]/60 text-xs font-mono font-semibold text-[#F5F4EA] shadow-inner">
                      Total: ₹{plan.totalPrice}
                    </span>
                  </div>
                </div>

                {/* Divider Line */}
                <div className="my-5 border-t border-[#14532D]/70" />

                {/* Feature Inclusions Checkmarks List */}
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-[#F5F4EA]/90 leading-snug">
                      <span className="w-4 h-4 rounded-full bg-[#14532D] text-[#C8A96B] flex items-center justify-center shrink-0 mt-0.5 border border-[#C8A96B]/40">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card CTA Action Button */}
              <div className="mt-6 sm:mt-7 pt-2">
                <button
                  onClick={() => onSelectPlan && onSelectPlan(plan)}
                  className="w-full py-3 sm:py-3.5 px-4 rounded-full bg-gradient-to-r from-[#C8A96B] via-[#E5C378] to-[#C8A96B] hover:brightness-110 active:scale-95 text-[#071D12] font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#C8A96B]/25 flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[#C8A96B]/40 cursor-pointer"
                  aria-label={`Subscribe to ${plan.title} plan for ₹${plan.totalPrice}`}
                >
                  <span>Subscribe Now</span>
                  <ArrowRight className="w-4 h-4 text-[#071D12]" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* =========================================================================
          BOTTOM TRUST BAR (MATCHING REFERENCE IMAGE FOOTER)
          ========================================================================= */}
      <div className="mt-8 sm:mt-10 p-4 sm:p-5 rounded-2xl bg-[#06180E]/95 border border-[#C8A96B]/35 shadow-xl backdrop-blur-xl grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-center">
        
        {/* Item 1: Secure Payments */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#14532D]/80 border border-[#C8A96B]/40 flex items-center justify-center text-[#C8A96B] shrink-0 shadow-md">
            <ShieldCheck className="w-5 h-5 text-[#E5C378]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#F5F4EA] leading-tight">
              Secure Payments
            </h4>
            <p className="text-[11px] text-[#A7D7A9] font-sans mt-0.5">
              100% Encrypted
            </p>
          </div>
        </div>

        {/* Item 2: Cancel Anytime */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#14532D]/80 border border-[#C8A96B]/40 flex items-center justify-center text-[#C8A96B] shrink-0 shadow-md">
            <RotateCcw className="w-5 h-5 text-[#E5C378]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#F5F4EA] leading-tight">
              Cancel Anytime
            </h4>
            <p className="text-[11px] text-[#A7D7A9] font-sans mt-0.5">
              No Hassle
            </p>
          </div>
        </div>

        {/* Item 3: 24/7 Support */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#14532D]/80 border border-[#C8A96B]/40 flex items-center justify-center text-[#C8A96B] shrink-0 shadow-md">
            <Headphones className="w-5 h-5 text-[#E5C378]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#F5F4EA] leading-tight">
              24/7 Support
            </h4>
            <p className="text-[11px] text-[#A7D7A9] font-sans mt-0.5">
              Always Here
            </p>
          </div>
        </div>

        {/* Item 4: Official Conservation */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#14532D]/80 border border-[#C8A96B]/40 flex items-center justify-center text-[#C8A96B] shrink-0 shadow-md">
            <Award className="w-5 h-5 text-[#E5C378]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#F5F4EA] leading-tight">
              Official Conservation
            </h4>
            <p className="text-[11px] text-[#A7D7A9] font-sans mt-0.5">
              Partner
            </p>
          </div>
        </div>

      </div>

    </section>
  );
}
