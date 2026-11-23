import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Tv, 
  Camera, 
  X, 
  CreditCard, 
  Smartphone, 
  Building2, 
  AlertCircle,
  Loader2,
  Calendar,
  Layers,
  ArrowRight,
  Check,
  User,
  Users,
  Binoculars,
  Sprout,
  PawPrint
} from 'lucide-react';
import { subscriptionManager } from '../utils/subscriptionManager';
import Realistic3DIcon from './reactions/Realistic3DIcon';
import { SUBSCRIPTION_PLANS, USER_TIERS } from './AnimalSubscriptionPlans';

export default function SubscriptionModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  animal = null,
  animalName = 'Wildlife Live Cameras',
  initialPlan = null
}) {
  const [selectedTier, setSelectedTier] = useState(() => initialPlan?.tier || '1_user');
  const [selectedPlanId, setSelectedPlanId] = useState(() => initialPlan?.id || 'plan_3m');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Sync initialPlan when passed from parent
  useEffect(() => {
    if (initialPlan?.id) {
      setSelectedPlanId(initialPlan.id);
    }
    if (initialPlan?.tier) {
      setSelectedTier(initialPlan.tier);
    }
  }, [initialPlan]);

  const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1];
  const planPrice = currentPlan.prices ? (currentPlan.prices[selectedTier] || currentPlan.prices['1_user']) : (currentPlan.totalPrice || 249);

  // Demo payment checkout popup state
  const [showDemoGateway, setShowDemoGateway] = useState(false);
  const [demoOrder, setDemoOrder] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [demoUpiId, setDemoUpiId] = useState('user@okhdfcbank');

  const targetAnimalName = animal?.animal_name || animalName;

  if (!isOpen) return null;

  const handleStartSubscription = async () => {
    setErrorMsg('');
    setIsProcessing(true);

    try {
      // 1. Create order on backend for specific animal with chosen plan duration and price
      const order = await subscriptionManager.createPaymentOrder({
        email: 'visitor@nandankanan.org',
        name: 'Sanctuary Supporter',
        animal,
        amount: planPrice,
        planTitle: `${targetAnimalName} ${currentPlan.title} Live Stream Pass`,
        days: currentPlan.days
      });

      if (!order || !order.order_id) {
        throw new Error('Could not initiate payment order.');
      }

      // Check if real Razorpay SDK is loaded and real key provided
      const hasRealRazorpay = typeof window !== 'undefined' && 
                              window.Razorpay && 
                              order.key_id && 
                              !order.is_demo && 
                              !order.key_id.includes('demo');

      if (hasRealRazorpay) {
        // Open official Razorpay Checkout modal
        const options = {
          key: order.key_id,
          amount: order.amount,
          currency: order.currency || 'INR',
          name: 'Nandankanan Wildlife Sanctuary',
          description: `${targetAnimalName} ${currentPlan.title} Live Pass (${currentPlan.days} Days)`,
          image: '/images/nandankanan_logo.png',
          order_id: order.order_id,
          theme: {
            color: '#071D12'
          },
          handler: async function (response) {
            setIsProcessing(true);
            try {
              const verifyRes = await subscriptionManager.verifyPayment({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                email: 'visitor@nandankanan.org',
                name: 'Sanctuary Supporter',
                animal,
                amount: planPrice,
                planTitle: `${targetAnimalName} ${currentPlan.title} Live Stream Pass`,
                planName: currentPlan.title,
                days: currentPlan.days,
                isDemo: false
              });

              if (verifyRes.success) {
                setIsProcessing(false);
                onSuccess && onSuccess(verifyRes.subscription);
                onClose && onClose();
              } else {
                setErrorMsg(verifyRes.error || 'Payment signature verification failed.');
                setIsProcessing(false);
              }
            } catch (vErr) {
              setErrorMsg('Verification failed: ' + (vErr.message || 'Network error'));
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              setErrorMsg('Payment was cancelled. Live streaming remains locked until subscription is active.');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setIsProcessing(false);
          setErrorMsg(`Payment Failed: ${response.error.description || 'Transaction declined'}`);
        });
        rzp.open();
      } else {
        // Open clearly labeled Demonstration Payment Gateway Modal
        setDemoOrder(order);
        setShowDemoGateway(true);
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setErrorMsg(err.message || 'Could not connect to payment gateway. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleConfirmDemoPayment = async () => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
      // Simulate real verification round-trip with backend
      const simulatedPaymentId = 'pay_demo_' + Math.random().toString(36).substring(2, 14);
      const simulatedSignature = 'sig_demo_' + Math.random().toString(36).substring(2, 20);

      const verifyRes = await subscriptionManager.verifyPayment({
        orderId: demoOrder?.order_id || ('order_demo_' + Date.now()),
        paymentId: simulatedPaymentId,
        signature: simulatedSignature,
        email: 'visitor@nandankanan.org',
        name: 'Sanctuary Supporter',
        animal,
        amount: planPrice,
        planTitle: `${targetAnimalName} ${currentPlan.title} Live Stream Pass`,
        planName: currentPlan.title,
        days: currentPlan.days,
        isDemo: true
      });

      if (verifyRes.success) {
        setIsProcessing(false);
        setShowDemoGateway(false);
        onSuccess && onSuccess(verifyRes.subscription);
        onClose && onClose();
      } else {
        throw new Error(verifyRes.error || 'Payment verification failed.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Payment simulation failed.');
      setIsProcessing(false);
    }
  };

  const handleReturnToLiveViews = () => {
    if (onClose) {
      onClose();
    }
    window.location.hash = '#live-wildlife';
    try {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } catch (e) {}
    setTimeout(() => {
      const el = document.getElementById('live-cameras-grid') || document.getElementById('live-wildlife');
      if (el) {
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 95;
        if (window.__lenis) {
          window.__lenis.scrollTo(el, { offset: -headerHeight - 12, duration: 1.0, immediate: false });
        } else {
          const pos = el.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: Math.max(0, pos - headerHeight - 12), behavior: 'smooth' });
        }
      }
    }, 60);
  };

  const handleCancelDemoPayment = () => {
    setShowDemoGateway(false);
    setIsProcessing(false);
    handleReturnToLiveViews();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) {
          handleReturnToLiveViews();
        }
      }}
    >
      
      {/* =========================================================================
          MAIN SUBSCRIPTION PROPOSAL CARD
          ========================================================================= */}
      {!showDemoGateway ? (
        <div 
          className="relative w-full max-w-4xl lg:max-w-5xl bg-[#071D12] border-2 border-[#C8A96B] rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-2xl text-[#F5F4EA] flex flex-col max-h-[96vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Subtle Top Gold Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#C8A96B]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Icon (Dismissal & Redirect to Live Views) */}
          <button
            onClick={handleReturnToLiveViews}
            disabled={isProcessing}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer z-10"
            title="Close & Return to Home Page"
            aria-label="Close & Return to Home Page"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Badge */}
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-2.5">
            <span className="px-3 py-1 rounded-full border border-[#C8A96B] bg-[#071D12] text-[#C8A96B] font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Check className="w-3.5 h-3.5 stroke-[2.5] text-[#C8A96B]" />
              <span>PREVIEW COMPLETE</span>
              <Lock className="w-3 h-3 text-[#C8A96B]" />
            </span>
            <span className="text-xs sm:text-[13px] text-[#A7D7A9] font-mono font-medium">5s Free Limit Reached</span>
          </div>

          {/* Main Title Required by User */}
          <div className="text-center mb-2 sm:mb-3">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-serif font-bold text-white tracking-wide leading-tight flex items-center justify-center gap-2.5">
              <span className="shrink-0 flex items-center justify-center">
                {animal?.iconKey ? (
                  <Realistic3DIcon iconKey={animal.iconKey} size={32} className="drop-shadow-md" />
                ) : (
                  <span className="text-2xl sm:text-3xl">{animal?.emoji || '🐾'}</span>
                )}
              </span>
              <span>ENJOY UNLIMITED {targetAnimalName.toUpperCase()} LIVE STREAMING!</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#F5F4EA]/80 max-w-2xl mx-auto leading-snug">
              You have enjoyed your 5-second free preview. Subscribe to the {targetAnimalName} Live Stream Pass to continue watching live.
            </p>
          </div>

          {/* User Tier Capsule Pill Switcher (1 User | 3 Users | 5 Users) */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="inline-flex items-center p-0.5 sm:p-1 rounded-full bg-[#06180E] border border-[#C8A96B]/50 shadow-inner">
              {USER_TIERS.map((tier, idx) => {
                const isTierActive = selectedTier === tier.id;
                return (
                  <React.Fragment key={tier.id}>
                    {idx > 0 && <span className="text-white/20 mx-1 font-mono text-xs">|</span>}
                    <button
                      type="button"
                      onClick={() => setSelectedTier(tier.id)}
                      className={`px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isTierActive
                          ? 'bg-gradient-to-r from-[#C8A96B] via-[#E5C378] to-[#C8A96B] text-[#071D12] shadow-md'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {tier.icon === 'user' ? <User className="w-3.5 h-3.5 stroke-[2.5]" /> : <Users className="w-3.5 h-3.5 stroke-[2.5]" />}
                      <span>{tier.label}</span>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* 3 Pricing Cards Grid (1 Month | 3 Months | 6 Months) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5 items-stretch mb-3 sm:mb-3.5">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isSelected = plan.id === selectedPlanId;
              const price = plan.prices ? (plan.prices[selectedTier] || plan.prices['1_user']) : (plan.totalPrice || 249);
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#0B2A1A] via-[#071D12] to-[#04110A] border-2 border-[#C8A96B] ring-1 ring-[#C8A96B]/80 shadow-[0_0_28px_rgba(200,169,107,0.25)]'
                      : 'bg-[#06180E]/90 border border-[#C8A96B]/30 hover:border-[#C8A96B]/60 shadow-lg'
                  }`}
                >
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                      {plan.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#A7D7A9] font-sans">
                      {plan.subtitle}
                    </p>

                    {/* Pricing Block */}
                    <div className="mt-3 flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#C8A96B] font-display tracking-tight">
                        ₹{price}
                      </span>
                      <span className="text-xs text-[#F5F4EA]/70 font-sans">
                        {plan.periodLabel}
                      </span>
                      {plan.discount && (
                        <span className="ml-1.5 px-2 py-0.5 rounded-full bg-[#C8A96B] text-[#071D12] text-[10px] font-bold font-sans tracking-wide">
                          {plan.discount}
                        </span>
                      )}
                    </div>

                    {/* Features Checkmark List */}
                    <ul className="my-3 space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-[#F5F4EA]/90 leading-snug">
                          <span className="w-3.5 h-3.5 rounded-full border border-[#C8A96B] flex items-center justify-center text-[#C8A96B] shrink-0">
                            <Check className="w-2 h-2 stroke-[3]" />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Bottom Button */}
                  <div className="pt-2">
                    {isSelected ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartSubscription();
                        }}
                        className="w-full py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#C8A96B] via-[#E5C378] to-[#C8A96B] text-[#071D12] font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all cursor-pointer hover:brightness-105 active:scale-98"
                      >
                        Selected
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlanId(plan.id);
                        }}
                        className="w-full py-2 sm:py-2.5 rounded-full border border-[#C8A96B] text-[#C8A96B] hover:bg-[#C8A96B]/15 font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer"
                      >
                        Choose Plan
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feature Strip (Under Cards) */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#06180E]/90 border border-[#C8A96B]/30 shadow-md grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 items-center mb-3 sm:mb-3.5">
            <div className="flex items-center gap-2.5">
              <Binoculars className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8] text-[#E5C378] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#F5F4EA] leading-tight">24/7 Live</h4>
                <p className="text-[10px] text-[#A7D7A9] font-sans">Wildlife Camera</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8] text-[#E5C378] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#F5F4EA] leading-tight">Exclusive</h4>
                <p className="text-[10px] text-[#A7D7A9] font-sans">Conservation Updates</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8] text-[#E5C378] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#F5F4EA] leading-tight">Plan Your Visit</h4>
                <p className="text-[10px] text-[#A7D7A9] font-sans">with Ease</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <PawPrint className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8] text-[#E5C378] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#F5F4EA] leading-tight">Contribute to</h4>
                <p className="text-[10px] text-[#A7D7A9] font-sans">Wildlife Conservation</p>
              </div>
            </div>
          </div>

          {/* Error Message if Any */}
          {errorMsg && (
            <div className="mb-2 p-2 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Bottom Action Bar: Dynamic Radio on Left + Continue to Payment Button on Right */}
          <div className="p-2 sm:p-2.5 rounded-full bg-[#06180E] border border-[#C8A96B]/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-serif font-bold text-[#F5F4EA] px-3">
              <span className="w-3.5 h-3.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] shrink-0" />
              <span>Subscribe to {targetAnimalName} ({currentPlan.title}) – ₹{planPrice}</span>
            </div>

            <button
              type="button"
              onClick={handleStartSubscription}
              disabled={isProcessing}
              className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#C8A96B] via-[#E5C378] to-[#C8A96B] text-[#071D12] font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#071D12]" />
                  <span>Connecting to Payment Gateway...</span>
                </>
              ) : (
                <>
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>

          {/* Maybe Later Dismissal Button */}
          <button
            onClick={handleReturnToLiveViews}
            disabled={isProcessing}
            className="w-full mt-2 py-1 px-2 rounded-lg text-[11px] sm:text-xs font-semibold text-[#F5F4EA]/70 hover:text-white hover:bg-white/10 transition-colors text-center cursor-pointer border border-transparent hover:border-white/10 flex items-center justify-center gap-1.5"
            title="Close & Return to Home Page"
          >
            <span>Maybe Later</span>
            <span className="text-white/40">•</span>
            <span className="text-[#C8A96B]">Close & Return to Home Page</span>
          </button>

          {/* Security & Razorpay Badge */}
          <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-[9.5px] sm:text-[10px] text-[#F5F4EA]/60 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#C8A96B]" />
              Secure Razorpay Checkout
            </span>
            <span>Immediate Instant Activation</span>
          </div>

        </div>
      ) : (

        /* =========================================================================
            RAZORPAY DEMONSTRATION PAYMENT GATEWAY MODAL (Sandbox Mode)
            ========================================================================= */
        <div className="relative w-full max-w-md bg-[#071D12] border-2 border-amber-400/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-2xl text-[#F5F4EA] animate-scaleUp overflow-hidden">
          
          {/* Clearly Labeled Demonstration Mode Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-white/15">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#C8A96B] text-[#071D12] font-bold font-mono flex items-center justify-center text-xs">
                RZP
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-white">Razorpay Test Checkout</h3>
                <p className="text-[9.5px] sm:text-[10px] text-amber-300 font-mono font-semibold">Demonstration Payment Mode</p>
              </div>
            </div>

            <button
              onClick={handleCancelDemoPayment}
              className="p-1 rounded-full text-white/50 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Order Details */}
          <div className="my-2.5 p-2.5 rounded-xl bg-[#0B2A1A] border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[10.5px] text-[#A7D7A9] font-mono">Nandankanan Wildlife Sanctuary</p>
              <p className="text-xs sm:text-sm font-bold text-white">{targetAnimalName} {currentPlan.title} Live Pass</p>
            </div>
            <div className="text-right">
              <p className="text-lg sm:text-xl font-bold text-[#C8A96B] font-display">₹{planPrice}.00</p>
              <p className="text-[9px] text-white/50 font-mono">{demoOrder?.order_id || 'order_demo'}</p>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-1.5 mb-2.5">
            <label className="text-[11px] font-mono text-[#F5F4EA]/70 block">Select Payment Method (Demo):</label>
            
            <button
              type="button"
              onClick={() => setSelectedMethod('upi')}
              className={`w-full p-2 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                selectedMethod === 'upi'
                  ? 'bg-[#14532D] border-[#C8A96B] text-white font-bold'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
              }`}
            >
              <span className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-[#C8A96B]" />
                <span>UPI (Google Pay / PhonePe / Paytm / BHIM)</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Instant</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`w-full p-2 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                selectedMethod === 'card'
                  ? 'bg-[#14532D] border-[#C8A96B] text-white font-bold'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
              }`}
            >
              <span className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-[#C8A96B]" />
                <span>Credit / Debit Card (Visa, MasterCard, RuPay)</span>
              </span>
              <span className="text-[10px] font-mono text-white/50">Simulated</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('netbanking')}
              className={`w-full p-2 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                selectedMethod === 'netbanking'
                  ? 'bg-[#14532D] border-[#C8A96B] text-white font-bold'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
              }`}
            >
              <span className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-[#C8A96B]" />
                <span>NetBanking (SBI, HDFC, ICICI, Axis)</span>
              </span>
              <span className="text-[10px] font-mono text-white/50">Simulated</span>
            </button>
          </div>

          {/* Demonstration Notice Required by Section 3 */}
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[10px] sm:text-[10.5px] mb-2.5 leading-relaxed">
            <strong>Demonstration Payment Notice:</strong> Razorpay live credentials are not set in the environment. This interactive sandbox verifies the payment flow and simulates cryptographic backend verification without charging real money.
          </div>

          {errorMsg && (
            <div className="mb-2 p-2 rounded-lg bg-red-950/80 border border-red-500/40 text-red-200 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancelDemoPayment}
              disabled={isProcessing}
              className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel Payment
            </button>

            <button
              type="button"
              onClick={handleConfirmDemoPayment}
              disabled={isProcessing}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#C8A96B] hover:bg-[#E5C384] text-[#071D12] text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Confirm & Pay ₹{planPrice}</span>
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
