import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Ticket, 
  Calendar, 
  Users, 
  CheckCircle2, 
  QrCode, 
  Download, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function TicketBookingModal({ isOpen, onClose, language }) {
  const [step, setStep] = useState(1); // 1: Select tickets & safaris, 2: Visitor details, 3: Confirmed Pass
  const [visitDate, setVisitDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [foreigners, setForeigners] = useState(0);
  const [includeSafari, setIncludeSafari] = useState(true);
  const [includeTrain, setIncludeTrain] = useState(false);
  const [includeRopeway, setIncludeRopeway] = useState(false);

  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [passData, setPassData] = useState(null);

  if (!isOpen) return null;

  // Pricing
  const adultPrice = 50;
  const childPrice = 10;
  const foreignerPrice = 100;
  const safariPrice = 100;
  const trainPrice = 50;
  const ropewayPrice = 100;

  const totalVisitors = adults + children + foreigners;
  const entryTotal = (adults * adultPrice) + (children * childPrice) + (foreigners * foreignerPrice);
  const safariTotal = includeSafari ? (totalVisitors * safariPrice) : 0;
  const trainTotal = includeTrain ? (totalVisitors * trainPrice) : 0;
  const ropewayTotal = includeRopeway ? (totalVisitors * ropewayPrice) : 0;
  const grandTotal = entryTotal + safariTotal + trainTotal + ropewayTotal;

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorEmail.trim()) return;

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#F28C1B', '#14532D', '#A7D7A9', '#FFFFFF']
    });

    setPassData({
      passId: `NKZ-${Math.floor(10000000 + Math.random() * 90000000)}`,
      name: visitorName,
      date: visitDate,
      totalVisitors,
      adults,
      children,
      foreigners,
      safari: includeSafari,
      train: includeTrain,
      ropeway: includeRopeway,
      amountPaid: grandTotal,
      timestamp: new Date().toLocaleString()
    });

    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#071D12] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#2E7D32]/50 shadow-2xl relative text-[#F4F1E8]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-transform hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-[#0B2A1A] text-white border-b border-[#2E7D32]/40">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[10px] font-mono uppercase tracking-[0.2em] text-[#A7D7A9] mb-2">
            <Ticket className="w-3.5 h-3.5 text-[#F28C1B]" />
            <span>Fast-Track Sanctuary Pass</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Nandankanan e-Ticketing
          </h3>
          <p className="text-xs text-[#A7D7A9] font-light">
            Skip the physical queue at the main entrance with instant QR verification.
          </p>
        </div>

        {/* Step 1: Select Date & Counts */}
        {step === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Visit Date */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#A7D7A9] font-bold mb-1.5">
                Select Date of Visit (Tuesday to Sunday)
              </label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0B2A1A] border border-[#2E7D32]/40 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-[#F28C1B]"
              />
              <span className="text-[11px] text-[#F28C1B] block mt-1">
                * Note: The zoo is closed every Monday for animal welfare audits.
              </span>
            </div>

            {/* Visitor Quantities */}
            <div className="space-y-3">
              <label className="block text-xs font-mono uppercase text-[#A7D7A9] font-bold">
                Visitor Quantities
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#0B2A1A] rounded-xl border border-[#2E7D32]/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Adults (₹50)</span>
                    <span className="text-[10px] text-[#A7D7A9]">Age 12+</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-7 h-7 rounded-lg bg-[#14532D] text-white font-bold text-xs"
                    >-</button>
                    <span className="text-xs font-bold w-4 text-center text-white">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-7 h-7 rounded-lg bg-[#14532D] text-white font-bold text-xs"
                    >+</button>
                  </div>
                </div>

                <div className="p-3 bg-[#0B2A1A] rounded-xl border border-[#2E7D32]/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Children (₹10)</span>
                    <span className="text-[10px] text-[#A7D7A9]">Age 3–12</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-7 h-7 rounded-lg bg-[#14532D] text-white font-bold text-xs"
                    >-</button>
                    <span className="text-xs font-bold w-4 text-center text-white">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="w-7 h-7 rounded-lg bg-[#14532D] text-white font-bold text-xs"
                    >+</button>
                  </div>
                </div>

                <div className="p-3 bg-[#0B2A1A] rounded-xl border border-[#2E7D32]/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Foreigner (₹100)</span>
                    <span className="text-[10px] text-[#A7D7A9]">All Ages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setForeigners(Math.max(0, foreigners - 1))}
                      className="w-7 h-7 rounded-lg bg-[#14532D] text-white font-bold text-xs"
                    >-</button>
                    <span className="text-xs font-bold w-4 text-center text-white">{foreigners}</span>
                    <button
                      type="button"
                      onClick={() => setForeigners(foreigners + 1)}
                      className="w-7 h-7 rounded-lg bg-[#14532D] text-white font-bold text-xs"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Add-on Safaris */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-[#A7D7A9] font-bold">
                Experience Add-Ons
              </label>

              <label className="flex items-center justify-between p-3.5 bg-[#0B2A1A] rounded-xl border border-[#2E7D32]/30 cursor-pointer hover:border-[#F28C1B]/50 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeSafari}
                    onChange={(e) => setIncludeSafari(e.target.checked)}
                    className="w-4 h-4 accent-[#14532D]"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">🐅 Tiger & Lion Safari Bus</span>
                    <span className="text-[10px] text-[#A7D7A9]">Open forest bus excursion</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#F28C1B]">+₹100 / person</span>
              </label>

              <label className="flex items-center justify-between p-3.5 bg-[#0B2A1A] rounded-xl border border-[#2E7D32]/30 cursor-pointer hover:border-[#F28C1B]/50 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeTrain}
                    onChange={(e) => setIncludeTrain(e.target.checked)}
                    className="w-4 h-4 accent-[#14532D]"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">🚂 Narrow-Gauge Toy Train</span>
                    <span className="text-[10px] text-[#A7D7A9]">2.5 km scenic woodland circuit</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#F28C1B]">+₹50 / person</span>
              </label>

              <label className="flex items-center justify-between p-3.5 bg-[#0B2A1A] rounded-xl border border-[#2E7D32]/30 cursor-pointer hover:border-[#F28C1B]/50 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeRopeway}
                    onChange={(e) => setIncludeRopeway(e.target.checked)}
                    className="w-4 h-4 accent-[#14532D]"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">🚡 Lake Kanjia Monocable Ropeway</span>
                    <span className="text-[10px] text-[#A7D7A9]">628m aerial lake crossing</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#F28C1B]">+₹100 / person</span>
              </label>
            </div>

            {/* Total Strip */}
            <div className="p-4 rounded-2xl bg-[#0B2A1A] border border-[#2E7D32]/50 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#A7D7A9] block">
                  Total Payable Amount
                </span>
                <span className="text-2xl font-serif font-bold text-[#F28C1B]">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-full bg-[#14532D] hover:bg-[#2E7D32] border border-[#2E7D32]/60 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <span>Continue to Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

        {/* Step 2: Visitor Details */}
        {step === 2 && (
          <form onSubmit={handleConfirmBooking} className="p-6 sm:p-8 space-y-4">
            <h4 className="text-lg font-serif font-bold text-white mb-1">
              Lead Visitor Contact Information
            </h4>
            <p className="text-xs text-[#A7D7A9] font-light mb-4">
              Your digital entry pass with QR code will be generated instantly and linked to this contact.
            </p>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A7D7A9] font-bold mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Soumya Ranjan"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0B2A1A] border border-[#2E7D32]/40 text-xs sm:text-sm text-white focus:outline-none focus:border-[#F28C1B] placeholder:text-white/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#A7D7A9] font-bold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="soumya@example.com"
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B2A1A] border border-[#2E7D32]/40 text-xs sm:text-sm text-white focus:outline-none focus:border-[#F28C1B] placeholder:text-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#A7D7A9] font-bold mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B2A1A] border border-[#2E7D32]/40 text-xs sm:text-sm text-white focus:outline-none focus:border-[#F28C1B] placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-[#A7D7A9] hover:text-white"
              >
                ← Back to Selection
              </button>

              <button
                type="submit"
                className="px-8 py-3.5 rounded-full bg-[#14532D] hover:bg-[#2E7D32] border border-[#2E7D32]/60 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#F28C1B]" />
                <span>Confirm & Issue Pass (₹{grandTotal})</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmed Digital Pass */}
        {step === 3 && passData && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 mx-auto flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-serif font-bold text-white">
                Sanctuary Fast-Track Pass Issued!
              </h4>
              <p className="text-xs text-[#A7D7A9] font-light">
                Present this QR code at the Main Entrance e-turnstiles or safari boarding gates.
              </p>
            </div>

            {/* Pass Ticket Card */}
            <div className="bg-[#0B2A1A] rounded-3xl p-6 border-2 border-dashed border-[#2E7D32]/60 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#A7D7A9]">Pass Reference</span>
                  <span className="text-base font-bold font-mono text-white block">{passData.passId}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-[#A7D7A9]">Visit Date</span>
                  <span className="text-xs font-bold text-[#F28C1B] block">{passData.date}</span>
                </div>
              </div>

              <div className="py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[#A7D7A9] block text-[10px]">Lead Visitor</span>
                  <span className="font-bold text-white">{passData.name}</span>
                </div>
                <div>
                  <span className="text-[#A7D7A9] block text-[10px]">Total Visitors</span>
                  <span className="font-bold text-white">{passData.totalVisitors} Person(s)</span>
                </div>
                <div>
                  <span className="text-[#A7D7A9] block text-[10px]">Safari Included</span>
                  <span className="font-bold text-emerald-400">{passData.safari ? "YES" : "NO"}</span>
                </div>
                <div>
                  <span className="text-[#A7D7A9] block text-[10px]">Amount Paid</span>
                  <span className="font-bold text-[#F28C1B]">₹{passData.amountPaid}</span>
                </div>
              </div>

              {/* QR Code Graphic */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center text-[#071D12] p-2 shadow-lg">
                    <QrCode className="w-16 h-16 text-[#071D12]" />
                  </div>
                  <div className="text-xs">
                    <span className="font-mono font-bold text-white block">NANDANKANAN E-GATE PASS</span>
                    <span className="text-[10px] text-[#A7D7A9] block">Scan at Entrance & Safari Gates</span>
                    <span className="text-[9px] text-emerald-400 font-mono">STATUS: CONFIRMED & ACTIVE</span>
                  </div>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-full bg-[#F28C1B] hover:bg-[#e07d10] text-[#071D12] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Pass</span>
                </button>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={onClose}
                className="text-xs font-semibold text-[#A7D7A9] hover:text-white"
              >
                Close Window & Return to Sanctuary
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

