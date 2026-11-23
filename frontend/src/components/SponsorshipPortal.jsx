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
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  FileCheck,
  ChevronRight,
  RefreshCw,
  Bell,
  FileText,
  X,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const NOTICES = [
  {
    id: 1,
    title: "Precautionary Temporary Closure of Nandankanan Zoological Park & Botanical Garden Due to Severe Cyclonic Storm Alert",
    date: "19 Nov 2026",
    refNo: "NKZP/PUB/2026/719",
    badge: "LATEST",
    fileSize: "1.2 MB",
    link: "https://www.nandankanan.org/LatestNewsDetails.php",
    description: "In view of the orange alert and cyclonic weather bulletin issued for Khordha district, entry for visitors to Nandankanan Zoo and State Botanical Garden was temporarily closed as a precautionary safety measure for public and fauna."
  },
  {
    id: 2,
    title: "Specialized Quarantine, Musical Therapy & Nutritional Care Protocol for Rescued Baby Orangutans",
    date: "14 Nov 2026",
    refNo: "NKZP/VET/2026/512",
    badge: "WILDLIFE",
    fileSize: "1.6 MB",
    link: "https://www.nandankanan.org/LatestNewsDetails.php",
    description: "Expert veterinary committee and caretakers oversee intensive medical rehabilitation, haematological testing, and stress-alleviating acoustic enrichment for five rescued juvenile orangutans under quarantine."
  },
  {
    id: 3,
    title: "Induction & Acclimatization of 58 Animals Across 14 Rare Species via Zoological Exchange Partnership",
    date: "28 Oct 2026",
    refNo: "NKZP/WLD/2026/388",
    badge: "EXCHANGE",
    fileSize: "1.9 MB",
    link: "https://www.nandankanan.org/LatestNewsDetails.php",
    description: "Nandankanan successfully expands sanctuary biodiversity profile to 188 species with the arrival of zebras, Bennett's wallabies, ring-tailed lemurs, meerkats, and exotic birds through national trust collaborations."
  },
  {
    id: 4,
    title: "Proposal for Night-Time Eco-Tourism Zone & Flora Interpretive Trail at State Botanical Garden",
    date: "18 Oct 2026",
    refNo: "NKZP/DEV/2026/245",
    badge: "PROJECT",
    fileSize: "920 KB",
    link: "https://www.nandankanan.org/LatestNewsDetails.php",
    description: "Administrative project launched to introduce controlled nocturnal nature trails, sensory educational flora kiosks, and guided botanical conservation exhibits for visitors."
  },
  {
    id: 5,
    title: "Captive Breeding Milestone: Successful Birth of Yellow Anacondas at Reptile Conservatory",
    date: "06 Oct 2026",
    refNo: "NKZP/REP/2026/184",
    badge: "BREEDING",
    fileSize: "1.4 MB",
    link: "https://www.nandankanan.org/LatestNewsDetails.php",
    description: "Historic breeding accomplishment recorded at the herpetological facility with seven healthy yellow anaconda neonates delivered under climate-regulated bio-terrarium monitoring."
  },
  {
    id: 6,
    title: "E-Tender Notice: Fleet Maintenance & Battery Optimization for Safari Eco-Carts (BOV)",
    date: "25 Sep 2026",
    refNo: "NKZP/TEN/2026/102",
    badge: "TENDER",
    fileSize: "840 KB",
    link: "https://www.nandankanan.org/LatestNewsDetails.php",
    description: "Sealed tenders invited on e-procurement portal for annual comprehensive maintenance and zero-emission battery replacement of tourist transit vehicles in safari zones."
  },
  {
    id: 7,
    title: "Sanctuary Environmental Directive: Strict Enforcement of Zero-Plastic Policy across Premises",
    date: "12 Sep 2026",
    refNo: "NKZP/ENV/2026/089",
    badge: "POLICY",
    fileSize: "510 KB",
    link: "https://www.nandankanan.org/LatestNewsDetails.php",
    description: "Complete prohibition on single-use polythene and outside food containers across visitor gates, safari boarding hubs, and food court zones. Free stainless-steel refill stations operational."
  },
  {
    id: 8,
    title: "Annual Wildlife Census & Sambar Deer Demographic Analysis across Sanctuary & Kanjia Wetland",
    date: "28 Aug 2026",
    refNo: "NKZP/CEN/2026/041",
    badge: "CENSUS",
    fileSize: "2.3 MB",
    link: "https://www.nandankanan.org/LatestNewsDetails.php",
    description: "Official publication of comprehensive animal population audit documenting free-ranging ungulates, migratory avifauna at Kanjia Lake, and captive tiger studbook records."
  }
];


export default function SponsorshipPortal({ 
  animals, 
  preSelectedAnimal, 
  onSponsorshipCreated,
  sponsorships 
}) {
  const { t, getAnimalName } = useLanguage();
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

  // News & Notice State
  const [isNewsPaused, setIsNewsPaused] = useState(false);
  const [activeNoticeModal, setActiveNoticeModal] = useState(null);

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
    <section id="sponsorship-portal" className="pt-10 sm:pt-12 lg:pt-14 pb-12 sm:pb-16 lg:pb-20 bg-forest-900 text-ivory-50 relative overflow-hidden">
      
      {/* Top Subtle Golden Forest Horizon Separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C8A96B]/25 to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-[#071D12]/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
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
          <div id="sponsorship-flow" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-28">
            
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
                                <span className="text-gold-400 shrink-0 text-xs leading-none mt-0.5">➢</span>
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
                    className="w-full py-3.5 btn-accent text-xs uppercase tracking-widest flex items-center justify-center gap-2"
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

        {/* NEWS & NOTICE Section */}
        <div id="news-notice" className="mt-20 pt-16 border-t border-gold-500/20 scroll-mt-24">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge mb-3">
              <Bell className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gold-300">
                Official Bulletins & Circulars
              </span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-5xl tracking-wide text-ivory-50">
              NEWS & <span className="text-gold-400">NOTICE</span>
            </h2>

            <p className="mt-3 text-ivory-200/80 text-sm sm:text-base font-light">
              Every story matters. Stay informed about wildlife discoveries, conservation efforts, upcoming events, and important announcements.
            </p>
          </div>

          {/* Wide News Box */}
          <div className="max-w-5xl mx-auto rounded-3xl bg-forest-950/80 border border-gold-500/20 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gold-500/20 mb-4 gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-ivory-100 font-mono">
                  Live Sanctuary Circulars & Gazettes
                </span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.nandankanan.org/LatestNewsDetails.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 hover:bg-gold-500/25 text-gold-300 border border-gold-500/40 text-[11px] font-mono tracking-wider transition-all hover:scale-105"
                  title="Visit official Nandankanan Latest News portal"
                >
                  <span>nandankanan.org/LatestNewsDetails.php</span>
                  <ExternalLink className="w-3 h-3 text-gold-400" />
                </a>
                <span className="text-[11px] text-gold-400/80 font-mono hidden sm:inline-block">
                  ({NOTICES.length} Bulletins)
                </span>
              </div>
            </div>

            {/* Continuous Vertical Scrolling Ticker */}
            <div 
              className="relative h-72 sm:h-80 overflow-hidden rounded-2xl bg-forest-900/60 border border-forest-700/50 p-3 sm:p-4"
              onMouseEnter={() => setIsNewsPaused(true)}
              onMouseLeave={() => setIsNewsPaused(false)}
            >
              <div 
                className="space-y-3"
                style={{
                  animation: 'scrollUpNews 24s linear infinite',
                  animationPlayState: isNewsPaused ? 'paused' : 'running',
                }}
              >
                {[...NOTICES, ...NOTICES].map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-forest-950/90 border border-forest-700/60 hover:border-gold-500/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group/notice shadow-md hover:bg-forest-900/90"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold-500/20 text-gold-300 border border-gold-500/30">
                          {item.badge}
                        </span>
                        <span className="text-xs text-ivory-300 font-mono">
                          {item.date}
                        </span>
                        <span className="text-xs text-ivory-300/60 font-mono">
                          • Ref: {item.refNo}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-semibold text-ivory-50 group-hover/notice:text-gold-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-ivory-200/80 mt-1 line-clamp-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* PDF Button on Side */}
                    <button
                      type="button"
                      onClick={() => setActiveNoticeModal(item)}
                      className="shrink-0 self-start sm:self-center px-4 py-2 rounded-xl bg-red-950/90 hover:bg-red-800 text-red-200 border border-red-500/40 hover:border-red-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      title={`Open ${item.title} (PDF)`}
                    >
                      <FileText className="w-4 h-4 text-red-400" />
                      <span>PDF</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Official Notice Document Viewer Modal */}
      {activeNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071D12]/90 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#0B2A1A] border border-[#C8A96B]/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-[#F5F4EA]">
            
            {/* Modal Top Bar */}
            <div className="p-4 sm:p-5 border-b border-[#26734D]/50 flex items-center justify-between bg-[#071D12]/90">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-950/80 border border-red-500/40 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <span className="font-display font-bold text-sm text-[#F5F4EA] uppercase tracking-wider block">
                    Official Notice Document (PDF)
                  </span>
                  <span className="text-[10px] text-[#C8A96B] font-mono">
                    Ref: {activeNoticeModal.refNo}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveNoticeModal(null)}
                className="p-2 rounded-full bg-forest-900/80 hover:bg-forest-800 text-ivory-200 border border-gold-500/30 transition-all hover:scale-105"
                aria-label="Close Notice Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Sheet Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-white text-zinc-900 font-serif">
              {/* Official Letterhead */}
              <div className="text-center border-b-2 border-zinc-800 pb-4">
                <div className="text-[11px] uppercase tracking-widest font-sans font-bold text-zinc-600 mb-1">
                  Government of Odisha • Forest, Environment & Climate Change Dept.
                </div>
                <h3 className="text-lg sm:text-xl font-bold tracking-wide uppercase text-zinc-900 font-serif">
                  Nandankanan Zoological Park & Botanical Garden
                </h3>
                <div className="text-[11px] font-sans text-zinc-600 mt-1">
                  P.O. Baranga, Dist. Cuttack/Bhubaneswar - 754005, Odisha, India
                </div>
              </div>

              {/* Notice Metadata */}
              <div className="flex flex-wrap justify-between items-center text-xs font-mono text-zinc-700 border-b border-zinc-200 pb-2">
                <div><strong>Notice No:</strong> {activeNoticeModal.refNo}</div>
                <div><strong>Date of Issue:</strong> {activeNoticeModal.date}</div>
              </div>

              {/* Title & Classification */}
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded bg-zinc-100 text-zinc-800 font-sans font-bold text-[10px] uppercase tracking-wider mb-2 border border-zinc-300">
                  Classification: {activeNoticeModal.badge} • Gazetted Circular
                </span>
                <h4 className="text-base sm:text-lg font-bold text-zinc-900 leading-snug font-sans">
                  {activeNoticeModal.title}
                </h4>
              </div>

              {/* Content Body */}
              <div className="text-xs sm:text-sm text-zinc-800 leading-relaxed font-sans space-y-3">
                <p className="font-semibold text-zinc-900">
                  {activeNoticeModal.description}
                </p>
                <p>
                  This official bulletin is promulgated under the statutory authority of the Principal Chief Conservator of Forests (Wildlife) and Chief Wildlife Warden, Odisha. All designated personnel, licensed vendors, research associates, and sanctuary visitors are hereby notified to adhere to the directives stipulated herein.
                </p>
                <p>
                  Detailed terms of reference, compliance schedules, and official application annexures are preserved at the Administrative Block, Nandankanan Zoological Park, and accessible digitally via this official web repository.
                </p>
              </div>

              {/* Authority Signature Block */}
              <div className="pt-6 border-t border-zinc-300 flex justify-between items-end text-xs font-sans">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">Verification</div>
                  <div className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Official Electronic Record
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-zinc-900">Deputy Director</div>
                  <div className="text-zinc-600 text-[11px]">Nandankanan Zoological Park</div>
                  <div className="text-zinc-500 text-[10px]">Govt. of Odisha</div>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-[#071D12] border-t border-[#26734D]/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-ivory-300/70 font-mono">
                  Document File: Electronic PDF • Size: {activeNoticeModal.fileSize}
                </span>
                <span className="text-ivory-300/40 hidden sm:inline">•</span>
                <a
                  href={activeNoticeModal.link || "https://www.nandankanan.org/LatestNewsDetails.php"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-gold-300 hover:text-gold-200 underline flex items-center gap-1 font-mono"
                >
                  <span>Verify on Nandankanan.org</span>
                  <ExternalLink className="w-3 h-3 text-gold-400" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-ivory-100 text-xs font-semibold flex items-center gap-1.5 border border-forest-700 transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-gold-400" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const content = `NANDANKANAN ZOOLOGICAL PARK & BOTANICAL GARDEN\nGOVERNMENT OF ODISHA\nOfficial Source: ${activeNoticeModal.link || 'https://www.nandankanan.org/LatestNewsDetails.php'}\n\nOFFICIAL NOTICE: ${activeNoticeModal.title}\nNotice Ref: ${activeNoticeModal.refNo}\nDate: ${activeNoticeModal.date}\nClassification: ${activeNoticeModal.badge}\n\n${activeNoticeModal.description}\n\nThis official bulletin is promulgated under the statutory authority of the Principal Chief Conservator of Forests (Wildlife), Odisha.\n\nSigned,\nDeputy Director, Nandankanan Zoological Park`;
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${activeNoticeModal.refNo.replace(/\//g, '_')}_Notice.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Notice</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}

