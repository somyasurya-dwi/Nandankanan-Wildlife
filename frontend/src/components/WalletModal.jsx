import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Wallet, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2,
  Tv,
  Receipt,
  Download,
  Calendar,
  CreditCard,
  ChevronRight,
  Check,
  XCircle,
  RotateCcw,
  QrCode,
  Smartphone,
  Building2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const DEFAULT_ORDERS = [
  {
    id: 'NK-ORD-98214',
    title: 'Royal Bengal Tiger — 30-Day VIP 4K Live Stream Pass',
    category: 'subscription',
    date: '23 Nov 2026, 03:15 PM',
    paymentMethod: 'Deducted from Eco-Wallet',
    amount: -299,
    status: 'ACTIVE',
    invoiceId: 'INV-98214'
  },
  {
    id: 'NK-TOP-88120',
    title: 'Eco-Wallet Instant Recharge via UPI (PhonePe / HDFC Bank)',
    category: 'topup',
    date: '23 Nov 2026, 01:40 PM',
    paymentMethod: 'UPI Ref #482910482',
    amount: 1000,
    status: 'SUCCESS',
    invoiceId: 'INV-88120'
  },
  {
    id: 'NK-ORD-77319',
    title: 'Asiatic Lion Sanctuary Care & Nutrition Voluntary Contribution',
    category: 'donation',
    date: '21 Nov 2026, 11:20 AM',
    paymentMethod: 'Deducted from Eco-Wallet',
    amount: -100,
    status: 'VERIFIED',
    invoiceId: 'INV-77319'
  },
  {
    id: 'NK-ORD-66408',
    title: 'Lake Kanjia Eco-Solar Boating Sanctuary Access Pass',
    category: 'pass',
    date: '18 Nov 2026, 02:10 PM',
    paymentMethod: 'Deducted from Eco-Wallet',
    amount: -150,
    status: 'COMPLETED',
    invoiceId: 'INV-66408'
  },
  {
    id: 'NK-TOP-55110',
    title: 'Sanctuary Welcome Eco-Credit Bonus (Govt. of Odisha)',
    category: 'topup',
    date: '15 Nov 2026, 10:00 AM',
    paymentMethod: 'Odisha Tourism Promotional Grant',
    amount: 800,
    status: 'CREDITED',
    invoiceId: 'INV-55110'
  }
];

export default function WalletModal({ isOpen, onClose }) {
  const { language, t } = useLanguage();

  // Persistent Eco-Balance state
  const [balance, setBalance] = useState(() => {
    try {
      const saved = localStorage.getItem('nkz_eco_balance');
      return saved ? Number(saved) : 1250;
    } catch {
      return 1250;
    }
  });

  // Persistent Order History
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('nkz_eco_orders');
      return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  });

  // Active Tab: 'orders' | 'subscriptions' | 'topup'
  const [activeTab, setActiveTab] = useState('orders');
  const [orderFilter, setOrderFilter] = useState('all');

  // Top-Up Form States
  const [selectedTopUpAmount, setSelectedTopUpAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [isProcessingTopUp, setIsProcessingTopUp] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(null);
  const [invoiceToast, setInvoiceToast] = useState(null);

  // Sub-method states for Payment Gateways
  // UPI states:
  const [upiMode, setUpiMode] = useState('app'); // 'app' | 'vpa' | 'qr'
  const [selectedUpiApp, setSelectedUpiApp] = useState('phonepe'); // 'phonepe' | 'gpay' | 'paytm' | 'bhim'
  const [upiVpa, setUpiVpa] = useState('visitor@okhdfcbank');

  // Card states:
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardHolder, setCardHolder] = useState('SANATH KUMAR N');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('882');

  // Net Banking states:
  const [selectedBank, setSelectedBank] = useState('sbi');

  // Subscriptions States
  const [subscriptionStatus, setSubscriptionStatus] = useState(() => {
    try {
      return localStorage.getItem('nkz_vip_sub_status') || 'ACTIVE';
    } catch {
      return 'ACTIVE';
    }
  });
  const [autoRenew, setAutoRenew] = useState(true);
  const [subToast, setSubToast] = useState(null);

  // Content scroll ref for universal mouse wheel forwarding
  const contentScrollRef = useRef(null);

  // Lock background scroll, pause Lenis, and notify application while modal is open
  useEffect(() => {
    if (!isOpen) return;

    // Dispatch global modal state so floating widgets like AI Chatbot hide cleanly
    window.dispatchEvent(new CustomEvent('nkz_modal_state_change', { detail: { open: true, type: 'wallet' } }));

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (window.__lenis) {
      window.__lenis.stop();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.dispatchEvent(new CustomEvent('nkz_modal_state_change', { detail: { open: false, type: 'wallet' } }));
      document.body.style.overflow = originalOverflow;
      if (window.__lenis) {
        window.__lenis.start();
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Handle wheel scrolling anywhere inside the modal box
  const handleWheelScroll = (e) => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTop += e.deltaY;
    }
  };

  // Synchronize balance updates to localStorage & broadcast event
  const updateBalance = (newBalance) => {
    setBalance(newBalance);
    try {
      localStorage.setItem('nkz_eco_balance', String(newBalance));
      window.dispatchEvent(new Event('nkz_eco_balance_updated'));
    } catch (e) {
      console.warn('Could not persist eco balance:', e);
    }
  };

  // Synchronize orders to localStorage
  const addOrder = (newOrder) => {
    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      try {
        localStorage.setItem('nkz_eco_orders', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not persist orders:', e);
      }
      return updated;
    });
  };

  if (!isOpen) return null;

  // Process Add Money (Top-Up) with realistic processing feedback
  const handleProceedTopUp = (e) => {
    if (e) e.preventDefault();
    const amountToAdd = customAmount ? Number(customAmount) : Number(selectedTopUpAmount);
    if (!amountToAdd || isNaN(amountToAdd) || amountToAdd < 10) return;

    setIsProcessingTopUp(true);

    setTimeout(() => {
      const newBalance = balance + amountToAdd;
      updateBalance(newBalance);

      let methodDetail = 'Instant UPI';
      if (paymentMethod === 'upi') {
        const appNames = {
          phonepe: 'PhonePe UPI',
          gpay: 'Google Pay UPI',
          paytm: 'Paytm UPI',
          bhim: 'BHIM NPCI UPI'
        };
        methodDetail = upiMode === 'qr' ? 'Scanned BharatQR Code' : (upiMode === 'app' ? appNames[selectedUpiApp] : `VPA: ${upiVpa}`);
      } else if (paymentMethod === 'card') {
        methodDetail = `Visa Debit Card (**${cardNumber.slice(-4)})`;
      } else if (paymentMethod === 'netbanking') {
        const bankNames = {
          sbi: 'State Bank of India',
          hdfc: 'HDFC Bank NetBanking',
          icici: 'ICICI Bank NetBanking',
          axis: 'Axis Bank NetBanking',
          ogb: 'Odisha Gramya Bank',
          pnb: 'Punjab National Bank'
        };
        methodDetail = bankNames[selectedBank] || 'Nationalized Bank NetBanking';
      }

      const newOrderId = `NK-TOP-${Math.floor(10000 + Math.random() * 90000)}`;
      const newOrder = {
        id: newOrderId,
        title: `Eco-Wallet Recharge via ${methodDetail}`,
        category: 'topup',
        date: 'Just Now',
        paymentMethod: methodDetail,
        amount: amountToAdd,
        status: 'SUCCESS',
        invoiceId: `INV-${Math.floor(10000 + Math.random() * 90000)}`
      };

      addOrder(newOrder);
      setIsProcessingTopUp(false);
      setTopUpSuccess(amountToAdd);
      setCustomAmount('');

      setTimeout(() => {
        setTopUpSuccess(null);
      }, 4000);
    }, 900);
  };

  // Instant Subscribe animal feed using Eco-Wallet balance
  const handleSubscribeFeed = (animalName, monthlyPrice) => {
    if (balance < monthlyPrice) {
      setActiveTab('topup');
      setSelectedTopUpAmount(500);
      return;
    }

    const newBalance = balance - monthlyPrice;
    updateBalance(newBalance);

    const newOrderId = `NK-SUB-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: newOrderId,
      title: `${animalName} — 30-Day VIP Pass`,
      category: 'subscription',
      date: 'Just Now',
      paymentMethod: 'Deducted from Eco-Wallet',
      amount: -monthlyPrice,
      status: 'ACTIVE',
      invoiceId: `INV-${Math.floor(10000 + Math.random() * 90000)}`
    };

    addOrder(newOrder);
    setSubToast(`Subscribed to ${animalName}! Auto-renew active via Eco-Wallet.`);
    setTimeout(() => setSubToast(null), 3000);
  };

  // Terminate Active Subscription
  const handleTerminateSubscription = () => {
    setSubscriptionStatus('TERMINATED');
    setAutoRenew(false);
    try {
      localStorage.setItem('nkz_vip_sub_status', 'TERMINATED');
    } catch {}

    const cancelOrder = {
      id: `NK-TERM-${Math.floor(10000 + Math.random() * 90000)}`,
      title: 'Royal Bengal Tiger VIP Pass — Auto-Debit Cancelled',
      category: 'subscription',
      date: 'Just Now',
      paymentMethod: 'Terminated by Visitor',
      amount: 0,
      status: 'TERMINATED',
      invoiceId: `CAN-${Math.floor(10000 + Math.random() * 90000)}`
    };

    addOrder(cancelOrder);
    setSubToast('Subscription terminated! Auto-debit disabled. Current pass valid until 23 Dec 2026.');
    setTimeout(() => setSubToast(null), 4000);
  };

  // Reactivate Subscription
  const handleReactivateSubscription = () => {
    setSubscriptionStatus('ACTIVE');
    setAutoRenew(true);
    try {
      localStorage.setItem('nkz_vip_sub_status', 'ACTIVE');
    } catch {}

    const reactivateOrder = {
      id: `NK-ACT-${Math.floor(10000 + Math.random() * 90000)}`,
      title: 'Royal Bengal Tiger VIP Pass — Plan Reactivated',
      category: 'subscription',
      date: 'Just Now',
      paymentMethod: 'Eco-Wallet Auto-Debit',
      amount: 0,
      status: 'ACTIVE',
      invoiceId: `ACT-${Math.floor(10000 + Math.random() * 90000)}`
    };

    addOrder(reactivateOrder);
    setSubToast('VIP Membership reactivated! 4K live streaming and auto-renew restored.');
    setTimeout(() => setSubToast(null), 3500);
  };

  // Fully Functional Invoice / Receipt File Downloader
  const handleDownloadInvoice = (order) => {
    const isCredit = order.amount > 0;
    const invoiceContent = `===============================================================
GOVERNMENT OF ODISHA
FOREST, ENVIRONMENT & CLIMATE CHANGE DEPARTMENT
NANDANKANAN BIOLOGICAL PARK, BHUBANESWAR
OFFICIAL DIGITAL SANCTUARY RECEIPT & TAX INVOICE
===============================================================
Receipt / Invoice No : ${order.invoiceId}
Transaction ID       : ${order.id}
Transaction Date     : ${order.date}
Visitor ID           : NK-VISITOR-8891 (KYC Verified)
Payment Mode         : ${order.paymentMethod}
Status               : ${order.status}
---------------------------------------------------------------
PARTICULARS:
${order.title}
Category             : ${order.category.toUpperCase()}
Amount               : ${isCredit ? '+' : '-'}INR ${Math.abs(order.amount)}.00
Gateway Surcharge    : INR 0.00 (Exempt under Sanctuary Green Cess)
Total Transacted     : INR ${Math.abs(order.amount)}.00
---------------------------------------------------------------
DIGITAL AUTHENTICATION:
Secured by: Odisha Treasury Payment Gateway
Authority: Shri Sanath Kumar N., IFS
Designation: Director, Nandankanan Biological Park
Verification Code: NK-OD-SEC-${Math.floor(100000 + Math.random() * 900000)}
===============================================================
Thank you for supporting wildlife conservation at Nandankanan!
Visit: https://nandankanan.org | Eco-Helpline: 1800-345-6789
===============================================================`;

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Nandankanan-Invoice-${order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setInvoiceToast(`Receipt #${order.invoiceId} downloaded successfully!`);
    setTimeout(() => setInvoiceToast(null), 3000);
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.category === orderFilter;
  });

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl lg:max-w-5xl bg-[#071D12]/98 border border-gold-500/60 rounded-3xl shadow-2xl shadow-black/95 overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheelScroll}
      >
        {/* =========================================================================
            HEADER & BALANCE BAR (Polished Single-Line Layout with Luxury Gold Top-Up)
            ========================================================================= */}
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-[#0B2A1A] via-[#123D2B] to-[#0B2A1A] border-b border-[#26734D]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Sanctuary Branding */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gold-500/20 text-gold-400 border border-gold-500/40 shadow-inner shrink-0">
              <Wallet className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-black text-lg sm:text-xl text-ivory-50 tracking-wide">
                  Nandankanan Eco-Wallet & Passes
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/30 font-bold uppercase flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active KYC Verified
                </span>
              </div>
              <p className="text-xs text-[#A7D7A9] font-sans">
                Official Wildlife Sanctuary Passes, Live Subscriptions & Payment Ledger
              </p>
            </div>
          </div>

          {/* Balance Readout & Luxury Gold Top-Up Button */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 self-end sm:self-auto">
            {/* Balance Badge */}
            <div className="text-right">
              <span className="text-[9.5px] font-mono uppercase tracking-widest text-gold-400/90 block font-semibold">
                Total Eco-Balance
              </span>
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-lg font-sans text-gold-400 font-bold">₹</span>
                <span className="text-2xl sm:text-3xl font-display font-black text-ivory-50 tracking-tight">
                  {balance.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-emerald-400 font-mono font-semibold">.00</span>
              </div>
            </div>

            {/* Always Gold Top-Up Fast Action (Single Line, Never Wraps, Clean Without +) */}
            <button
              type="button"
              onClick={() => setActiveTab('topup')}
              className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 hover:from-gold-300 hover:to-gold-500 text-forest-950 shadow-md shadow-gold-950/40 transition-all flex items-center justify-center cursor-pointer shrink-0 whitespace-nowrap active:scale-95 border border-gold-300/40"
              title="Add Money / Top-up Eco-Wallet"
            >
              <span>TOP-UP</span>
            </button>

            {/* Modal Close Button */}
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 ml-0.5"
              aria-label="Close wallet modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            SECONDARY NAVIGATION & STATUS BAR
            ========================================================================= */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#071810] border-b border-[#26734D]/30 flex flex-wrap items-center justify-between gap-2.5">
          {/* 3 Core Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-forest-950 border border-[#26734D]/40">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'orders' 
                  ? 'bg-[#1B6537] text-white shadow ring-1 ring-emerald-400/50' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Order Ledger ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'subscriptions' 
                  ? 'bg-[#1B6537] text-white shadow ring-1 ring-emerald-400/50' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Subscriptions Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('topup')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'topup' 
                  ? 'bg-[#1B6537] text-white shadow ring-1 ring-emerald-400/50' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Add Money</span>
            </button>
          </div>

          {/* Security & Government Guarantee Badge */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-gold-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Secured by Odisha Treasury (Govt. of Odisha)</span>
          </div>
        </div>

        {/* Global Feedback Toasts */}
        {topUpSuccess && (
          <div className="mx-4 sm:mx-6 mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Successfully credited <strong>₹{topUpSuccess}.00</strong> to your Eco-Wallet! Balance updated in header & navbar.</span>
          </div>
        )}

        {subToast && (
          <div className="mx-4 sm:mx-6 mt-3 p-2.5 rounded-xl bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs flex items-center gap-2 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-gold-400 shrink-0" />
            <span>{subToast}</span>
          </div>
        )}

        {invoiceToast && (
          <div className="mx-4 sm:mx-6 mt-3 p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs flex items-center gap-2 animate-fadeIn">
            <Download className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{invoiceToast}</span>
          </div>
        )}

        {/* =========================================================================
            CONTENT BODY (Unified Smooth Mousewheel Scrolling Canvas)
            ========================================================================= */}
        <div 
          ref={contentScrollRef}
          data-lenis-prevent
          style={{ 
            scrollBehavior: 'smooth', 
            overscrollBehavior: 'contain', 
            WebkitOverflowScrolling: 'touch' 
          }}
          className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 scrollbar-thin scrollbar-thumb-gold-500/40 hover:scrollbar-thumb-gold-400 scrollbar-track-forest-950/80"
        >

          {/* -----------------------------------------------------------------------
              TAB 1: HIGH-VISIBILITY COMPACT ORDER LEDGER TABLE
              ----------------------------------------------------------------------- */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {/* Category Filter Chips */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
                  {[
                    { key: 'all', label: `All Orders (${orders.length})` },
                    { key: 'subscription', label: 'Subscriptions' },
                    { key: 'topup', label: 'Recharges / Top-Ups' },
                    { key: 'donation', label: 'Sanctuary Care' }
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setOrderFilter(f.key)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        orderFilter === f.key
                          ? 'bg-gold-500 text-forest-950 font-bold shadow-md'
                          : 'bg-forest-900/80 text-gray-300 hover:text-white border border-forest-700/50'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <span className="text-[11px] text-gray-400 font-mono">
                  Showing {filteredOrders.length} verified transactions
                </span>
              </div>

              {/* Data Table */}
              <div className="w-full overflow-hidden rounded-2xl border border-forest-700/80 bg-forest-950/90 shadow-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-forest-800 bg-forest-900/95 text-xs font-mono text-gold-400 font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-3.5">Order ID & Date</th>
                      <th className="py-2.5 px-3.5">Sanctuary Service Details</th>
                      <th className="py-2.5 px-3.5">Payment Method</th>
                      <th className="py-2.5 px-3.5 text-right">Amount</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3.5 text-center">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest-800/60 text-xs sm:text-[13px]">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => {
                        const isCredit = order.amount > 0;
                        const isTerminated = order.status === 'TERMINATED';
                        return (
                          <tr key={order.id} className="hover:bg-forest-900/60 transition-colors group">
                            {/* Order ID & Date */}
                            <td className="py-3 px-3.5 whitespace-nowrap">
                              <span className="font-mono text-gold-300 font-bold block text-xs tracking-wide">
                                {order.id}
                              </span>
                              <span className="text-[10.5px] text-gray-400 font-mono block mt-0.5">
                                {order.date}
                              </span>
                            </td>

                            {/* Service Details */}
                            <td className="py-3 px-3.5">
                              <span className="font-bold text-ivory-50 block leading-snug">
                                {order.title}
                              </span>
                              <span className="text-[10.5px] text-gray-400 block mt-0.5">
                                Verified by Nandankanan Accounts Wing
                              </span>
                            </td>

                            {/* Payment Method */}
                            <td className="py-3 px-3.5 whitespace-nowrap">
                              <span className="text-xs text-gray-300 font-medium block">
                                {order.paymentMethod}
                              </span>
                              <span className="text-[10px] text-emerald-400/90 font-mono block mt-0.5">
                                0% Gateway Fee
                              </span>
                            </td>

                            {/* Amount */}
                            <td className="py-3 px-3.5 text-right font-mono font-black whitespace-nowrap">
                              <span className={`text-sm ${
                                isTerminated 
                                  ? 'text-gray-400' 
                                  : isCredit 
                                    ? 'text-emerald-400' 
                                    : 'text-ivory-100'
                              }`}>
                                {isTerminated ? '₹0.00' : isCredit ? `+₹${order.amount}.00` : `-₹${Math.abs(order.amount)}.00`}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase border ${
                                isTerminated
                                  ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              }`}>
                                {order.status}
                              </span>
                            </td>

                            {/* Receipt Download Action */}
                            <td className="py-3 px-3.5 text-center whitespace-nowrap">
                              <button
                                onClick={() => handleDownloadInvoice(order)}
                                title="Download Official Tax Invoice / Receipt"
                                className="px-2 py-1 rounded-lg bg-forest-900 hover:bg-forest-800 text-gold-300 hover:text-white border border-gold-500/30 text-xs font-mono font-bold transition-all flex items-center gap-1 mx-auto cursor-pointer"
                              >
                                <Download className="w-3 h-3 text-gold-400" />
                                <span>PDF</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-10 text-gray-400 text-sm">
                          No transactions found in this category.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------------
              TAB 2: NETFLIX STYLE SUBSCRIPTIONS HUB (With Functional Termination)
              ----------------------------------------------------------------------- */}
          {activeTab === 'subscriptions' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Left Column: Active Membership Overview & Termination Controls */}
              <div className="lg:col-span-7 p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#0B2A1A] via-[#123D2B] to-[#0B2A1A] border border-gold-500/60 shadow-xl space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-md font-black text-[10px] uppercase tracking-wider ${
                      subscriptionStatus === 'ACTIVE'
                        ? 'bg-gold-500 text-forest-950'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}>
                      {subscriptionStatus === 'ACTIVE' ? '★ Active VIP Membership' : '✕ Subscription Terminated'}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      Netflix-Grade 4K Stream
                    </span>
                  </div>

                  <span className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold-400" />
                    {subscriptionStatus === 'ACTIVE' ? 'Renews 23 Dec 2026' : 'Access until 23 Dec 2026'}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-black text-lg text-ivory-50 flex items-center gap-2">
                    <span>🐅 Royal Bengal Tiger — VIP Live Safari 4K Pass</span>
                  </h3>
                  <p className="text-xs text-[#A7D7A9] leading-relaxed mt-1">
                    {subscriptionStatus === 'ACTIVE'
                      ? 'Continuous 30-day unthrottled live multi-angle surveillance feeds across all sector tiger enclosures with priority PTZ joystick camera control.'
                      : 'Subscription is currently cancelled. Your stream access remains valid until 23 Dec 2026. No automatic renewals or deductions will occur.'}
                  </p>
                </div>

                {/* Plan Highlights Grid */}
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  {[
                    { label: '4K Ultra HD Live Feeds', desc: 'Direct multi-angle relay' },
                    { label: 'Zero-Queue PTZ Joystick', desc: 'Instant camera movement' },
                    { label: 'Night Vision & Dawn Feeds', desc: 'Infrared nocturnal tracking' },
                    { label: 'VIP Feeder Chatroom', desc: 'Direct keeper reactions' }
                  ].map((perk) => (
                    <div key={perk.label} className="p-2 rounded-xl bg-forest-950/80 border border-[#26734D]/60 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-ivory-100">
                        <Check className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                        <span>{perk.label}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 block ml-5">{perk.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Billing Rate, Auto-Renew Toggle & Termination Button */}
                <div className="pt-3 border-t border-[#26734D]/50 flex items-center justify-between flex-wrap gap-2.5">
                  <div>
                    <span className="text-xs text-gray-400">Plan Rate: </span>
                    <strong className="text-sm font-mono text-gold-300 font-bold">₹299.00 / month</strong>
                    <span className="text-[10.5px] text-gray-400 block">
                      {subscriptionStatus === 'ACTIVE' ? '(Auto-debited from Eco-Wallet)' : '(Auto-debit stopped)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Auto-Debit Switch (when active) */}
                    {subscriptionStatus === 'ACTIVE' ? (
                      <button
                        type="button"
                        onClick={() => setAutoRenew(!autoRenew)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-950 border border-gold-500/40 text-xs text-gray-200 cursor-pointer hover:border-gold-400 transition-colors"
                        title="Toggle monthly auto-debit"
                      >
                        <span>Auto-Debit:</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                          autoRenew ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {autoRenew ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    ) : null}

                    {/* Functional Terminate or Reactivate Button */}
                    {subscriptionStatus === 'ACTIVE' ? (
                      <button
                        type="button"
                        onClick={handleTerminateSubscription}
                        className="px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 hover:border-red-500/60 text-red-400 hover:text-red-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                        title="Terminate subscription & cancel auto-renew"
                      >
                        <XCircle className="w-3.5 h-3.5 text-red-400" />
                        <span>Terminate Subscription</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleReactivateSubscription}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:brightness-110 text-forest-950 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                        title="Reactivate VIP pass"
                      >
                        <RotateCcw className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Reactivate Plan (₹299/mo)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Other Sanctuary Feeds with 1-Click Subscribe */}
              <div className="lg:col-span-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Other Sanctuary Feeds</span>
                  </h4>
                  <span className="text-[10px] text-gray-400 font-mono">1-Click Wallet Access</span>
                </div>

                <div className="space-y-2">
                  {[
                    { name: 'Asiatic Lion Safari Feed', price: 199, icon: '🦁', desc: 'Open ridge & scrubland savanna cam' },
                    { name: 'Asian Elephant Wetland Feed', price: 149, icon: '🐘', desc: 'Freshwater lake mud wallow stream' },
                    { name: 'White Bengal Tiger Heritage Feed', price: 249, icon: '🐅', desc: 'Rare white tiger enclosure feed' },
                    { name: 'Sloth Bear & Aviary Stream', price: 129, icon: '🐻', desc: 'Cave enclosure & Kanjia bird sanctuary' }
                  ].map((sub) => (
                    <div 
                      key={sub.name}
                      className="p-2.5 rounded-2xl bg-forest-900/80 border border-forest-700/60 flex items-center justify-between gap-2.5 hover:border-gold-500/50 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl shrink-0">{sub.icon}</span>
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-ivory-100 truncate">{sub.name}</h5>
                          <span className="text-[10px] text-gray-400 block truncate">{sub.desc}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSubscribeFeed(sub.name, sub.price)}
                        className="px-2.5 py-1 rounded-xl bg-[#1B6537] hover:bg-[#26734D] text-white text-xs font-bold font-mono shrink-0 transition-colors flex items-center gap-1 shadow cursor-pointer"
                        title={`Subscribe to ${sub.name}`}
                      >
                        <span>₹{sub.price}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------------
              TAB 3: TOP-UP / ADD MONEY (Symmetric Twin Cards + Centered Pill Button)
              ----------------------------------------------------------------------- */}
          {activeTab === 'topup' && (
            <div className="space-y-4">
              {/* Twin Symmetrical Section Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                
                {/* ===================================================================
                    LEFT CARD: SELECT QUICK TOP-UP AMOUNT
                    =================================================================== */}
                <div className="p-4 sm:p-5 rounded-2xl bg-forest-900/80 border border-forest-700/60 flex flex-col justify-between space-y-3.5 shadow-md">
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gold-400 block mb-1.5">
                        Select Quick Top-Up Amount
                      </label>
                      
                      {/* Quick Amount Pills */}
                      <div className="grid grid-cols-5 gap-1.5">
                        {[100, 200, 500, 1000, 2000].map((amt) => {
                          const isSelected = selectedTopUpAmount === amt && !customAmount;
                          return (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => {
                                setSelectedTopUpAmount(amt);
                                setCustomAmount('');
                              }}
                              className={`py-1.5 px-0.5 rounded-lg font-mono text-xs font-bold transition-all text-center cursor-pointer ${
                                isSelected
                                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-forest-950 ring-2 ring-gold-400 font-black shadow-md'
                                  : 'bg-forest-950 text-gray-300 hover:text-white border border-forest-700/50'
                              }`}
                            >
                              ₹{amt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Amount Field */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-300 block mb-1">
                        Or Enter Any Custom Amount (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-400 font-bold text-sm">
                          ₹
                        </span>
                        <input
                          type="number"
                          min="10"
                          max="50000"
                          placeholder="Amount between ₹10 and ₹50,000"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-forest-950 border border-forest-700 focus:border-gold-500 focus:outline-none text-ivory-50 font-mono text-xs placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Surcharge Guarantee Note */}
                  <div className="p-2 rounded-lg bg-forest-950/80 border border-forest-800 text-[10.5px] text-gray-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Direct Odisha Treasury gateway with <strong>0% surcharge</strong>. Instant wallet credit.
                    </span>
                  </div>
                </div>

                {/* ===================================================================
                    RIGHT CARD: CHOOSE PAYMENT METHOD (Styled Identically to Left Box)
                    =================================================================== */}
                <div className="p-4 sm:p-5 rounded-2xl bg-forest-900/80 border border-forest-700/60 flex flex-col justify-between space-y-3.5 shadow-md">
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gold-400 block mb-1.5">
                        Choose Payment Method
                      </label>

                      {/* 3 Payment Method Pills Matching the Amount Pills */}
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: 'upi', label: 'Instant UPI' },
                          { id: 'card', label: 'Debit & Credit Cards' },
                          { id: 'netbanking', label: 'Net Banking' }
                        ].map((m) => {
                          const isActive = paymentMethod === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setPaymentMethod(m.id)}
                              className={`py-1.5 px-1 rounded-lg text-xs font-bold transition-all text-center cursor-pointer truncate ${
                                isActive
                                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-forest-950 ring-2 ring-gold-400 font-black shadow-md'
                                  : 'bg-forest-950 text-gray-300 hover:text-white border border-forest-700/50'
                              }`}
                            >
                              {m.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Interactive Content for Selected Gateway */}
                    {paymentMethod === 'upi' && (
                      <div className="space-y-2 animate-fadeIn">
                        {/* UPI Mode Selector Pills */}
                        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-forest-950 border border-forest-700/60">
                          <button
                            type="button"
                            onClick={() => setUpiMode('app')}
                            className={`flex-1 py-1 rounded-md text-xs font-bold transition-all ${
                              upiMode === 'app' ? 'bg-[#1B6537] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            UPI Apps
                          </button>
                          <button
                            type="button"
                            onClick={() => setUpiMode('vpa')}
                            className={`flex-1 py-1 rounded-md text-xs font-bold transition-all ${
                              upiMode === 'vpa' ? 'bg-[#1B6537] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            Enter UPI ID
                          </button>
                          <button
                            type="button"
                            onClick={() => setUpiMode('qr')}
                            className={`flex-1 py-1 rounded-md text-xs font-bold transition-all ${
                              upiMode === 'qr' ? 'bg-[#1B6537] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            Scan QR
                          </button>
                        </div>

                        {/* UPI App Selection */}
                        {upiMode === 'app' && (
                          <div className="space-y-1.5">
                            <div className="grid grid-cols-4 gap-1.5">
                              {[
                                { id: 'phonepe', name: 'PhonePe', color: 'from-purple-600 to-indigo-700' },
                                { id: 'gpay', name: 'Google Pay', color: 'from-blue-600 to-teal-600' },
                                { id: 'paytm', name: 'Paytm', color: 'from-sky-600 to-blue-800' },
                                { id: 'bhim', name: 'BHIM UPI', color: 'from-emerald-600 to-teal-800' }
                              ].map((app) => (
                                <button
                                  key={app.id}
                                  type="button"
                                  onClick={() => setSelectedUpiApp(app.id)}
                                  className={`py-1 px-1 rounded-lg text-[11px] font-bold transition-all text-center border cursor-pointer ${
                                    selectedUpiApp === app.id
                                      ? 'bg-gradient-to-r ' + app.color + ' text-white border-gold-400 ring-1 ring-gold-400 shadow-md font-black'
                                      : 'bg-forest-950 border-forest-700 text-gray-300 hover:text-white'
                                  }`}
                                >
                                  {app.name}
                                </button>
                              ))}
                            </div>
                            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Direct UPI Intent ready for instant confirmation
                            </span>
                          </div>
                        )}

                        {/* UPI VPA Input */}
                        {upiMode === 'vpa' && (
                          <div className="space-y-1">
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                value={upiVpa}
                                onChange={(e) => setUpiVpa(e.target.value)}
                                placeholder="username@okhdfcbank"
                                className="flex-1 px-2.5 py-1.5 rounded-lg bg-forest-950 border border-forest-700 focus:border-gold-500 focus:outline-none text-ivory-50 text-xs font-mono"
                              />
                              <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center">
                                VERIFIED
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                              <span>Quick:</span>
                              {['user@oksbi', 'visitor@paytm', 'wildlife@ybl'].map((sug) => (
                                <button
                                  key={sug}
                                  type="button"
                                  onClick={() => setUpiVpa(sug)}
                                  className="text-gold-400 hover:underline cursor-pointer font-mono"
                                >
                                  {sug}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* BharatQR Code Simulator */}
                        {upiMode === 'qr' && (
                          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-forest-950 border border-forest-700">
                            <div className="p-1.5 bg-white rounded-lg shadow shrink-0">
                              <QrCode className="w-10 h-10 text-forest-950" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-ivory-100 block">
                                Odisha Treasury Sanctuary BharatQR
                              </span>
                              <span className="text-[10px] text-emerald-400 font-mono font-bold block">
                                Dynamic ₹{customAmount || selectedTopUpAmount} QR Active
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Cards Interactive View */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-1.5 animate-fadeIn">
                        <div>
                          <input
                            type="text"
                            value={cardNumber}
                            maxLength={19}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="Card Number: 4532 •••• •••• 8821"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-forest-950 border border-forest-700 focus:border-gold-500 focus:outline-none text-ivory-50 text-xs font-mono"
                          />
                        </div>
                        <div className="grid grid-cols-12 gap-1.5">
                          <div className="col-span-6">
                            <input
                              type="text"
                              value={cardHolder}
                              onChange={(e) => setCardHolder(e.target.value)}
                              placeholder="Name: SANATH KUMAR"
                              className="w-full px-2 py-1.5 rounded-lg bg-forest-950 border border-forest-700 focus:border-gold-500 focus:outline-none text-ivory-50 text-xs uppercase"
                            />
                          </div>
                          <div className="col-span-3">
                            <input
                              type="text"
                              value={cardExpiry}
                              maxLength={5}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              className="w-full px-1.5 py-1.5 rounded-lg bg-forest-950 border border-forest-700 focus:border-gold-500 focus:outline-none text-ivory-50 text-xs font-mono text-center"
                            />
                          </div>
                          <div className="col-span-3">
                            <input
                              type="password"
                              value={cardCvv}
                              maxLength={4}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="CVV"
                              className="w-full px-1.5 py-1.5 rounded-lg bg-forest-950 border border-forest-700 focus:border-gold-500 focus:outline-none text-ivory-50 text-xs font-mono text-center"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Net Banking Interactive View */}
                    {paymentMethod === 'netbanking' && (
                      <div className="space-y-1.5 animate-fadeIn">
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { id: 'sbi', name: 'SBI' },
                            { id: 'hdfc', name: 'HDFC' },
                            { id: 'icici', name: 'ICICI' },
                            { id: 'axis', name: 'Axis' },
                            { id: 'ogb', name: 'Odisha Gramya' },
                            { id: 'pnb', name: 'PNB' }
                          ].map((b) => (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => setSelectedBank(b.id)}
                              className={`py-1 px-1 rounded-md text-[11px] font-bold transition-all text-center border cursor-pointer truncate ${
                                selectedBank === b.id
                                  ? 'bg-gold-500 text-forest-950 border-gold-400 font-black shadow-xs'
                                  : 'bg-forest-950 border-forest-700 text-gray-300 hover:text-white'
                              }`}
                            >
                              {b.name}
                            </button>
                          ))}
                        </div>

                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-forest-950 border border-forest-700 text-ivory-50 text-xs focus:border-gold-500 focus:outline-none"
                        >
                          <option value="sbi">State Bank of India</option>
                          <option value="hdfc">HDFC Bank</option>
                          <option value="icici">ICICI Bank</option>
                          <option value="axis">Axis Bank</option>
                          <option value="ogb">Odisha Gramya Bank</option>
                          <option value="pnb">Punjab National Bank</option>
                          <option value="bob">Bank of Baroda</option>
                          <option value="canara">Canara Bank</option>
                          <option value="kotak">Kotak Mahindra Bank</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Security Note Matching Left Card's Note */}
                  <div className="p-2 rounded-lg bg-forest-950/80 border border-forest-800 text-[10.5px] text-gray-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Direct RBI-approved gateway with <strong>256-bit institutional encryption</strong>.
                    </span>
                  </div>
                </div>
              </div>

              {/* ===================================================================
                  CENTERED PILL PROCEED BUTTON (Placed Below Both Sections in the Middle)
                  Matching exact user-provided design in media_1795438763046_0ea81748.png
                  =================================================================== */}
              <div className="flex justify-center pt-2 pb-1">
                <button
                  type="button"
                  disabled={isProcessingTopUp}
                  onClick={handleProceedTopUp}
                  className="w-full max-w-xl sm:max-w-2xl py-3 sm:py-3.5 px-6 sm:px-10 rounded-full bg-gradient-to-r from-[#D4B87A] via-[#C8A96B] to-[#AA771C] hover:brightness-105 active:scale-[0.99] text-forest-950 font-black tracking-wider text-xs sm:text-sm uppercase shadow-xl shadow-black/50 transition-all cursor-pointer flex items-center justify-center gap-2.5 border border-[#E5CA8F]/50 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isProcessingTopUp ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-forest-950" />
                      <span>CONNECTING ODISHA TREASURY GATEWAY...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-forest-950 stroke-[2.5]" />
                      <span>PROCEED TO ADD ₹{customAmount || selectedTopUpAmount} TO ECO-WALLET</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            FOOTER BAR
            ========================================================================= */}
        <div className="py-3 px-4 sm:px-6 bg-forest-950 border-t border-[#26734D]/40 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="font-mono text-gray-300">Registered Visitor ID: NK-VISITOR-8891</span>
            <span className="text-emerald-400 font-bold">• KYC Verified</span>
            <span className="hidden sm:inline text-gray-500">• 256-Bit SSL Encrypted</span>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-gold-300 hover:text-white font-bold border border-gold-500/30 hover:border-gold-400 transition-all cursor-pointer text-xs uppercase tracking-wider shadow-md shrink-0 active:scale-95 ml-2"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
