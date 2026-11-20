import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  HeartHandshake, 
  Award, 
  ShieldCheck, 
  Download, 
  Printer, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  FileCheck,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

export default function SponsorshipPortal({ 
  animals, 
  preSelectedAnimal, 
  onSponsorshipCreated,
  sponsorships 
}) {
  const [selectedAnimalId, setSelectedAnimalId] = useState(
    preSelectedAnimal ? preSelectedAnimal.id : (animals[0] ? animals[0].id : 1)
  );
  const [selectedTier, setSelectedTier] = useState('gold'); // 'silver' | 'gold' | 'platinum'
  const [duration, setDuration] = useState(12); // months
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [message, setMessage] = useState('');
  
  // Certificate State
  const [generatedCertificate, setGeneratedCertificate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const certificateRef = useRef(null);

  const selectedAnimal = animals.find((a) => a.id === Number(selectedAnimalId)) || animals[0];

  const tiers = {
    silver: {
      name: 'Silver Defender',
      monthlyRate: 2500,
      badge: 'Defender Tier',
      benefits: [
        'Official Digital Certificate of Wildlife Guardianship',
        'Quarterly Health & Care Progress Report',
        'Donor Wall Recognition on Nandankanan Portal',
        'Free Entry Pass for 2 Visitors (Annual Plan)'
      ]
    },
    gold: {
      name: 'Gold Guardian',
      monthlyRate: 5000,
      badge: 'Most Popular',
      benefits: [
        'Everything in Silver Tier',
        'Direct Enclosure Plaque Display at Nandankanan',
        'Exclusive Bi-Monthly Veterinary Updates & Photos',
        'VIP Guided Enclosure Tour with Sanctuary Rangers',
        'Annual Complimentary Park Safari Pass for 4 Visitors'
      ]
    },
    platinum: {
      name: 'Platinum Champion',
      monthlyRate: 15000,
      badge: 'Champion Tier',
      benefits: [
        'Everything in Gold Tier',
        'Permanent Marble Plaque at Enclosure Observation Post',
        'Direct Video Call Session with Senior Mahout & Veterinarian',
        'Personalized Wildlife Heritage Plaque shipped to your address',
        'Unlimited VIP Sanctuary & Safari Access for Year'
      ]
    }
  };

  const currentTierInfo = tiers[selectedTier];
  const totalAmount = currentTierInfo.monthlyRate * duration;

  const handleCreateSponsorship = (e) => {
    e.preventDefault();
    if (!donorName.trim() || !donorEmail.trim()) {
      alert("Please provide your name and email to generate the Guardianship Certificate.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const certId = `NKZ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newSponsorship = {
        id: Date.now(),
        certificate_id: certId,
        donor_name: donorName,
        donor_email: donorEmail,
        donor_phone: donorPhone,
        animal: selectedAnimal.id,
        animal_name: selectedAnimal.name,
        animal_photo: selectedAnimal.photo_url,
        tier: currentTierInfo.name,
        duration_months: duration,
        amount: totalAmount,
        personal_message: message,
        created_at: new Date().toISOString().split('T')[0]
      };

      setGeneratedCertificate(newSponsorship);
      if (onSponsorshipCreated) {
        onSponsorshipCreated(newSponsorship);
      }
      setIsSubmitting(false);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C8A96B', '#26734D', '#123D2B', '#EAE8D5']
        });
      } catch (err) {
        // Confetti fallback
      }
    }, 600);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <section id="sponsorship-portal" className="py-24 bg-forest-900 text-ivory-50 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge mb-3">
            <HeartHandshake className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gold-300">
              Virtual Guardianship Program
            </span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl tracking-wide text-ivory-50">
            ADOPT & PROTECT <span className="text-gold-400">OUR WILDLIFE</span>
          </h2>

          <p className="mt-3 text-ivory-200/80 text-sm sm:text-base font-light">
            Become an active custodian of nature. Virtual animal sponsorship provides essential 
            nutritional rations, advanced veterinary medicine, and natural habitat enrichment.
          </p>

          {/* Legal Ownership Disclaimer (Crucial Requirement) */}
          <div className="mt-6 p-3.5 rounded-2xl bg-forest-950/80 border border-gold-500/30 text-xs text-gold-200/90 flex items-center justify-center gap-2 max-w-2xl mx-auto">
            <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
            <span>
              <strong>Ethical Wildlife Policy:</strong> Animal sponsorship provides care and welfare funds. 
              It does <em>not</em> confer ownership, physical possession, or private handling of wild fauna.
            </span>
          </div>
        </div>

        {/* Generated Certificate Display (If active) */}
        {generatedCertificate ? (
          <div className="mb-16 animate-fadeIn">
            <div className="max-w-3xl mx-auto bg-ivory-50 text-charcoal-900 rounded-3xl p-6 sm:p-10 border-4 border-gold-500/80 shadow-2xl relative overflow-hidden">
              
              {/* Ornate Gold Border Corners */}
              <div className="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-gold-600 pointer-events-none" />
              <div className="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-gold-600 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-gold-600 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-gold-600 pointer-events-none" />

              {/* Certificate Inner Frame */}
              <div className="border border-gold-500/40 p-6 sm:p-8 rounded-2xl text-center bg-white/70">
                
                <div className="flex flex-col items-center justify-center gap-2 mb-3">
                  <div className="bg-white rounded-xl p-2 shadow-md border border-gold-500/30">
                    <img 
                      src="/images/nandankanan_logo.png" 
                      alt="Nandankanan Official Logo" 
                      className="h-10 sm:h-12 w-auto object-contain"
                    />
                  </div>
                  <span className="font-display font-bold text-xs uppercase tracking-[0.25em] text-forest-800">
                    Nandankanan Zoological Park • Government of Odisha
                  </span>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-4xl text-forest-950 uppercase tracking-wider mt-2">
                  Certificate of Guardianship
                </h3>
                
                <p className="text-xs uppercase tracking-[0.2em] text-gold-700 font-semibold mt-1">
                  Wildlife Conservation Honor Roll
                </p>

                <div className="my-6 py-4 border-y border-gold-500/30">
                  <p className="text-xs text-charcoal-600 italic font-editorial">
                    This prestigious digital citation is gratefully bestowed upon
                  </p>
                  
                  <h4 className="font-display font-black text-2xl sm:text-3xl text-forest-900 mt-2 tracking-wide">
                    {generatedCertificate.donor_name}
                  </h4>

                  <p className="text-xs text-charcoal-700 mt-3 max-w-lg mx-auto leading-relaxed">
                    In deep recognition of your philanthropic guardianship of the{' '}
                    <strong className="text-forest-800 font-bold">{generatedCertificate.animal_name}</strong>{' '}
                    under the <strong className="text-gold-700">{generatedCertificate.tier}</strong> program. 
                    Your generous commitment directly preserves species welfare and ecological balance.
                  </p>
                </div>

                {/* Details Footer on Certificate */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                  <div>
                    <span className="text-charcoal-400 uppercase text-[10px] tracking-wider block">Certificate ID</span>
                    <strong className="font-mono text-forest-800">{generatedCertificate.certificate_id}</strong>
                  </div>
                  <div>
                    <span className="text-charcoal-400 uppercase text-[10px] tracking-wider block">Duration</span>
                    <strong className="text-forest-800">{generatedCertificate.duration_months} Months (₹{generatedCertificate.amount.toLocaleString()})</strong>
                  </div>
                  <div>
                    <span className="text-charcoal-400 uppercase text-[10px] tracking-wider block">Issued by</span>
                    <strong className="text-forest-800">Director, Nandankanan</strong>
                  </div>
                </div>

              </div>

              {/* Action Buttons for Certificate */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handlePrintCertificate}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-gold-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Certificate</span>
                </button>

                <button
                  onClick={() => setGeneratedCertificate(null)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-ivory-200 hover:bg-ivory-300 text-charcoal-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Sponsor Another Animal</span>
                </button>
              </div>

            </div>
          </div>
        ) : (
          /* Sponsorship Configuration & Checkout Flow */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 Columns: Animal Selection & Tier Options */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Step 1: Animal Picker */}
              <div className="p-6 rounded-3xl bg-forest-950/80 border border-gold-500/20 backdrop-blur-md">
                <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-3">
                  <span className="w-5 h-5 rounded-full bg-gold-500 text-forest-950 flex items-center justify-center text-[11px] font-bold">1</span>
                  <span>Select Wildlife Species to Sponsor</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {animals.filter(a => a.sponsorship_available).map((animal) => {
                    const isSelected = selectedAnimal.id === animal.id;
                    return (
                      <button
                        key={animal.id}
                        type="button"
                        onClick={() => setSelectedAnimalId(animal.id)}
                        className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col items-center text-center gap-2 ${
                          isSelected
                            ? 'bg-forest-800 border-gold-400 shadow-lg shadow-gold-500/10 -translate-y-0.5'
                            : 'bg-forest-900/60 border-forest-800 hover:border-gold-500/40'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                          <img src={animal.photo_url} alt={animal.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h5 className="font-display font-bold text-xs text-ivory-50 line-clamp-1">{animal.name}</h5>
                          <span className="text-[10px] text-gold-400 font-mono">₹{animal.monthly_sponsorship_cost?.toLocaleString()}/mo</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Choose Sponsorship Tier */}
              <div className="p-6 rounded-3xl bg-forest-950/80 border border-gold-500/20 backdrop-blur-md">
                <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-4">
                  <span className="w-5 h-5 rounded-full bg-gold-500 text-forest-950 flex items-center justify-center text-[11px] font-bold">2</span>
                  <span>Select Guardianship Tier</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(tiers).map(([key, tier]) => {
                    const isSelected = selectedTier === key;
                    return (
                      <div
                        key={key}
                        onClick={() => setSelectedTier(key)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-forest-800 border-gold-400 shadow-xl shadow-gold-500/20 -translate-y-1'
                            : 'bg-forest-900/60 border-forest-800 hover:border-gold-500/30'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 border border-gold-500/30">
                              {tier.badge}
                            </span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-gold-400" />}
                          </div>

                          <h5 className="font-display font-bold text-base text-ivory-50">{tier.name}</h5>
                          <div className="mt-1 font-mono text-lg font-bold text-gold-400">
                            ₹{tier.monthlyRate.toLocaleString()}<span className="text-xs text-ivory-300 font-normal">/mo</span>
                          </div>

                          <ul className="mt-4 space-y-2 text-[11px] text-ivory-200/90">
                            {tier.benefits.map((b, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <Sparkles className="w-3 h-3 text-gold-400 shrink-0 mt-0.5" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Duration Selector */}
              <div className="p-6 rounded-3xl bg-forest-950/80 border border-gold-500/20 backdrop-blur-md flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-400 block mb-1">
                    Guardianship Term
                  </span>
                  <span className="text-xs text-ivory-300">Choose commitment duration</span>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 6, 12].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDuration(m)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        duration === m
                          ? 'bg-gold-500 text-forest-950 shadow-md'
                          : 'bg-forest-900 text-ivory-200 border border-forest-700 hover:bg-forest-800'
                      }`}
                    >
                      {m} {m === 1 ? 'Month' : 'Months'}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 5 Columns: Sponsor Details & Checkout */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleCreateSponsorship}
                className="p-6 sm:p-8 rounded-3xl bg-forest-950 border border-gold-500/30 shadow-2xl backdrop-blur-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-6">
                    <span className="w-5 h-5 rounded-full bg-gold-500 text-forest-950 flex items-center justify-center text-[11px] font-bold">3</span>
                    <span>Donor Details & Issuance</span>
                  </div>

                  {/* Summary Card */}
                  <div className="p-4 rounded-2xl bg-forest-900 border border-gold-500/20 mb-6 flex items-center gap-4">
                    <img
                      src={selectedAnimal.photo_url}
                      alt={selectedAnimal.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gold-500/30"
                    />
                    <div>
                      <span className="text-[10px] text-gold-400 uppercase font-mono tracking-wider">{currentTierInfo.name}</span>
                      <h4 className="font-display font-bold text-lg text-ivory-50">{selectedAnimal.name}</h4>
                      <div className="text-xs text-ivory-300">
                        {duration} Months • Total: <strong className="text-gold-300 font-mono text-sm">₹{totalAmount.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Form Inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-ivory-200 mb-1">
                        Full Name (for Official Certificate) *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gold-400" />
                        <input
                          type="text"
                          required
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          placeholder="e.g. Dr. Ananya Sen"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-forest-900 border border-forest-700 text-xs sm:text-sm text-ivory-50 focus:border-gold-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-ivory-200 mb-1">
                        Email Address (to receive certificate) *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gold-400" />
                        <input
                          type="email"
                          required
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          placeholder="e.g. ananya@sanctuary.in"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-forest-900 border border-forest-700 text-xs sm:text-sm text-ivory-50 focus:border-gold-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-ivory-200 mb-1">
                        Phone Number (optional)
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gold-400" />
                        <input
                          type="tel"
                          value={donorPhone}
                          onChange={(e) => setDonorPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-forest-900 border border-forest-700 text-xs sm:text-sm text-ivory-50 focus:border-gold-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-ivory-200 mb-1">
                        Dedication Message
                      </label>
                      <textarea
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="In honor of wildlife conservation or family dedication..."
                        className="w-full p-3 rounded-xl bg-forest-900 border border-forest-700 text-xs text-ivory-50 focus:border-gold-400 focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                </div>

                {/* Submit Action */}
                <div className="mt-8 pt-4 border-t border-forest-800">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-forest-950 font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-gold-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Generating Official Certificate...</span>
                    ) : (
                      <>
                        <Award className="w-4 h-4" />
                        <span>Issue Digital Guardianship Certificate</span>
                      </>
                    )}
                  </button>

                  <p className="mt-2 text-center text-[10px] text-ivory-300/60">
                    Demo Mode • Instant digital certificate issued with verifiable serial number.
                  </p>
                </div>

              </form>
            </div>

          </div>
        )}

      </div>

    </section>
  );
}

