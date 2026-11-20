import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  HeartHandshake, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  Mail, 
  GraduationCap, 
  Users, 
  Briefcase,
  ArrowRight,
  Leaf
} from 'lucide-react';
import { INITIAL_ANIMALS } from '../data/mockData';

export default function GetInvolvedSection({ language }) {
  const [activeTab, setActiveTab] = useState('adopt'); // 'adopt' | 'volunteer' | 'csr' | 'education'
  const [selectedAnimalId, setSelectedAnimalId] = useState(INITIAL_ANIMALS[0].id);
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorEmail, setSponsorEmail] = useState('');
  const [certificateData, setCertificateData] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const selectedAnimal = INITIAL_ANIMALS.find(a => a.id === Number(selectedAnimalId)) || INITIAL_ANIMALS[0];

  const handleGenerateCertificate = (e) => {
    e.preventDefault();
    if (!sponsorName.trim() || !sponsorEmail.trim()) return;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F28C1B', '#14532D', '#A7D7A9', '#ffffff']
    });

    setCertificateData({
      id: `NKZ-GUARD-${Math.floor(100000 + Math.random() * 900000)}`,
      donor: sponsorName,
      animal: selectedAnimal.name,
      scientificName: selectedAnimal.scientific_name,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      tier: 'Sanctuary Guardian'
    });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
  };

  return (
    <section id="get-involved" className="py-28 bg-[#0B2A1A] text-[#F4F1E8] relative z-20 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#14532D]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F28C1B]" />
              <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#F28C1B] font-bold">
                {language === 'odia' ? 'ସହଯୋଗ ଓ ସଂରକ୍ଷଣ ଭାଗୀଦାରୀ' : 'BECOME A WILDLIFE GUARDIAN'}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white leading-tight">
              Get Involved. <br />
              <span className="font-editorial italic font-normal text-[#A7D7A9]">
                {language === 'odia' ? 'ଆପଣଙ୍କ ସହଯୋଗ ଏକ ନୂତନ ଜୀବନ ଦେଇପାରେ।' : 'Stand with our wildlife.'}
              </span>
            </h2>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-[#071D12] p-1.5 rounded-full border border-[#2E7D32]/40 shadow-xl">
            <button
              onClick={() => setActiveTab('adopt')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'adopt'
                  ? 'bg-[#2E7D32] text-white shadow-md'
                  : 'text-[#A7D7A9] hover:text-white'
              }`}
            >
              Animal Adoption
            </button>
            <button
              onClick={() => setActiveTab('volunteer')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'volunteer'
                  ? 'bg-[#2E7D32] text-white shadow-md'
                  : 'text-[#A7D7A9] hover:text-white'
              }`}
            >
              Volunteer
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'education'
                  ? 'bg-[#2E7D32] text-white shadow-md'
                  : 'text-[#A7D7A9] hover:text-white'
              }`}
            >
              Schools & Youth
            </button>
            <button
              onClick={() => setActiveTab('csr')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'csr'
                  ? 'bg-[#2E7D32] text-white shadow-md'
                  : 'text-[#A7D7A9] hover:text-white'
              }`}
            >
              Corporate CSR
            </button>
          </div>
        </div>

        {/* Tab 1: Animal Adoption Portal */}
        {activeTab === 'adopt' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Interactive Form */}
            <div className="lg:col-span-6 bg-[#071D12]/95 rounded-3xl p-8 sm:p-10 border border-[#2E7D32]/40 shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <HeartHandshake className="w-5 h-5 text-[#F28C1B]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#A7D7A9] font-bold">
                  Virtual Guardianship
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-4">
                Adopt an Animal at Nandankanan
              </h3>
              <p className="text-xs sm:text-sm text-[#A7D7A9]/90 font-light leading-relaxed mb-6">
                Your monthly or annual sponsorship directly funds customized nutritional diets, 
                advanced enrichment toys, and veterinary diagnostics. You receive an official digital certificate and donor plaque.
              </p>

              <form onSubmit={handleGenerateCertificate} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#A7D7A9] mb-1.5 font-bold">
                    Choose Animal to Sponsor
                  </label>
                  <select
                    value={selectedAnimalId}
                    onChange={(e) => setSelectedAnimalId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B2A1A] border border-[#2E7D32]/40 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-[#F28C1B]"
                  >
                    {INITIAL_ANIMALS.filter(a => a.sponsorship_available).map((animal) => (
                      <option key={animal.id} value={animal.id}>
                        {animal.name} — ₹{animal.monthly_sponsorship_cost?.toLocaleString()}/month
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#A7D7A9] mb-1.5 font-bold">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Radhika Mohapatra"
                      value={sponsorName}
                      onChange={(e) => setSponsorName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B2A1A] border border-[#2E7D32]/40 text-xs sm:text-sm text-white focus:outline-none focus:border-[#F28C1B] placeholder:text-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#A7D7A9] mb-1.5 font-bold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="radhika@example.com"
                      value={sponsorEmail}
                      onChange={(e) => setSponsorEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B2A1A] border border-[#2E7D32]/40 text-xs sm:text-sm text-white focus:outline-none focus:border-[#F28C1B] placeholder:text-white/30"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#14532D] hover:bg-[#2E7D32] border border-[#2E7D32]/60 text-white font-bold text-xs uppercase tracking-[0.18em] transition-all shadow-xl flex items-center justify-center gap-2 mt-4"
                >
                  <Award className="w-4 h-4 text-[#F28C1B]" />
                  <span>Generate Guardianship Certificate</span>
                </button>
              </form>
            </div>

            {/* Right: Live Certificate Preview */}
            <div className="lg:col-span-6 bg-[#071D12] text-[#F4F1E8] rounded-3xl p-8 sm:p-10 border border-[#2E7D32]/50 shadow-2xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-[#14532D]/30 rounded-full blur-3xl pointer-events-none" />

              <div className="border-4 border-double border-[#A7D7A9]/40 p-6 sm:p-8 rounded-2xl relative z-10 bg-[#0B2A1A]/90 backdrop-blur-md">
                
                {/* Certificate Header */}
                <div className="text-center mb-6">
                  <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#F28C1B] block mb-1">
                    GOVERNMENT OF ODISHA • FOREST & ENVIRONMENT DEPARTMENT
                  </span>
                  <h4 className="font-serif font-black text-xl sm:text-2xl text-white tracking-wide uppercase">
                    CERTIFICATE OF WILDLIFE GUARDIANSHIP
                  </h4>
                  <div className="w-20 h-0.5 bg-[#A7D7A9] mx-auto mt-2" />
                </div>

                {/* Certificate Body */}
                <div className="text-center space-y-3 mb-6">
                  <p className="text-xs text-[#A7D7A9] font-light">This honors and certifies that</p>
                  <p className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                    {certificateData ? certificateData.donor : (sponsorName || "Distinguished Wildlife Benefactor")}
                  </p>
                  <p className="text-xs text-[#A7D7A9] font-light">has proudly adopted and become the guardian of</p>
                  <p className="text-lg sm:text-xl font-serif font-bold text-[#F28C1B]">
                    {certificateData ? certificateData.animal : selectedAnimal.name}
                  </p>
                  <p className="text-[11px] font-mono italic text-[#A7D7A9]/70">
                    {selectedAnimal.scientific_name}
                  </p>
                </div>

                {/* Seal & Metadata */}
                <div className="pt-4 border-t border-white/15 flex items-center justify-between text-[10px] font-mono text-[#A7D7A9]">
                  <div>
                    <span className="block text-[#F4F1E8]/60">Certificate ID</span>
                    <span className="font-bold text-white">{certificateData?.id || "NKZ-DEMO-2026"}</span>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto rounded-full border border-[#F28C1B] flex items-center justify-center text-[#F28C1B] mb-1">
                      🐾
                    </div>
                    <span>SANCTUARY SEAL</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[#F4F1E8]/60">Date Issued</span>
                    <span className="font-bold text-white">{certificateData?.date || "November 2026"}</span>
                  </div>
                </div>

              </div>

              {certificateData && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-2.5 rounded-full bg-[#F28C1B] hover:bg-[#e07d10] text-[#071D12] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official PDF Pass</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Volunteering */}
        {activeTab === 'volunteer' && (
          <div className="bg-[#071D12]/95 rounded-3xl p-8 sm:p-12 border border-[#2E7D32]/40 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#0B2A1A] border border-[#2E7D32]/30">
              <Users className="w-6 h-6 text-[#F28C1B] mb-3" />
              <h4 className="text-lg font-serif font-bold text-white mb-2">Sanctuary Docents</h4>
              <p className="text-xs text-[#A7D7A9]/80 leading-relaxed mb-4">
                Lead weekend educational walking tours for school groups and tourists, explaining apex predator behaviors and wetland ecology.
              </p>
              <span className="text-[11px] font-mono text-[#F28C1B] font-bold">Weekends • Min. 4 hrs/week</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B2A1A] border border-[#2E7D32]/30">
              <Leaf className="w-6 h-6 text-[#F28C1B] mb-3" />
              <h4 className="text-lg font-serif font-bold text-white mb-2">Lake Kanjia Stewards</h4>
              <p className="text-xs text-[#A7D7A9]/80 leading-relaxed mb-4">
                Participate in freshwater wetland habitat cleanups, invasive hyacinth clearing, and seasonal migratory bird counting.
              </p>
              <span className="text-[11px] font-mono text-[#F28C1B] font-bold">Seasonal • Open to all</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B2A1A] border border-[#2E7D32]/30">
              <Briefcase className="w-6 h-6 text-[#F28C1B] mb-3" />
              <h4 className="text-lg font-serif font-bold text-white mb-2">Veterinary Apprentices</h4>
              <p className="text-xs text-[#A7D7A9]/80 leading-relaxed mb-4">
                Assisting senior zoological veterinarians in hospital telemetry, neonatal incubator monitoring, and reptile vivarium audits.
              </p>
              <span className="text-[11px] font-mono text-[#F28C1B] font-bold">B.V.Sc / Zoology Students</span>
            </div>
          </div>
        )}

        {/* Tab 3: Schools & Youth */}
        {activeTab === 'education' && (
          <div className="bg-[#071D12]/95 rounded-3xl p-8 sm:p-12 border border-[#2E7D32]/40 shadow-2xl">
            <div className="max-w-2xl mb-8">
              <GraduationCap className="w-8 h-8 text-[#F28C1B] mb-3" />
              <h3 className="text-3xl font-serif font-bold text-white mb-2">
                Nandankanan Nature Discovery Clubs
              </h3>
              <p className="text-xs sm:text-sm text-[#A7D7A9] font-light leading-relaxed">
                Empowering the next generation of environmental leaders through subsidized school excursions, 
                hands-on botany labs in the botanical garden, and junior zookeeper shadow days.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0B2A1A] border border-[#2E7D32]/30">
                <span className="font-bold text-xs text-white block mb-1">Junior Safari Pass</span>
                <p className="text-xs text-[#A7D7A9]/80">Concession tickets for government and non-profit schools (₹5 per student).</p>
              </div>
              <div className="p-4 rounded-xl bg-[#0B2A1A] border border-[#2E7D32]/30">
                <span className="font-bold text-xs text-white block mb-1">Wild Classroom Kits</span>
                <p className="text-xs text-[#A7D7A9]/80">Free illustrated worksheets on white tiger genetics and wetland food webs.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Corporate CSR */}
        {activeTab === 'csr' && (
          <div className="bg-[#071D12]/95 rounded-3xl p-8 sm:p-12 border border-[#2E7D32]/40 shadow-2xl">
            <h3 className="text-3xl font-serif font-bold text-white mb-3">
              Corporate Social Responsibility (CSR)
            </h3>
            <p className="text-xs sm:text-sm text-[#A7D7A9] font-light leading-relaxed mb-6 max-w-2xl">
              Nandankanan partners with leading public sector undertakings (PSUs) and private enterprises 
              under Section 135 of the Companies Act to construct state-of-the-art animal enclosures and veterinary quarantine wards.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-[#F28C1B]">
              <span>Email CSR Secretariat: <strong>director.nandankanan@gov.in</strong></span>
            </div>
          </div>
        )}

        {/* Newsletter Signup Banner */}
        <div className="mt-16 rounded-3xl bg-[#071D12] text-[#F4F1E8] p-8 sm:p-12 shadow-2xl border border-[#2E7D32]/40 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#F28C1B] font-bold block mb-2">
              DISPATCHES FROM THE JUNGLE
            </span>
            <h4 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
              Subscribe to "The Whispering Forest"
            </h4>
            <p className="text-xs sm:text-sm text-[#A7D7A9] font-light max-w-md">
              Receive monthly camera trap highlights, cub birth bulletins, and conservation research stories directly in your inbox.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {newsletterSubscribed ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-[#A7D7A9] bg-white/10 px-6 py-3.5 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Subscribed! Welcome to the flock.</span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="px-5 py-3.5 rounded-full bg-[#0B2A1A] border border-[#2E7D32]/50 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#F28C1B] w-full sm:w-72"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-full bg-[#F28C1B] hover:bg-[#e07d10] text-[#071D12] font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap w-full sm:w-auto shadow-lg"
                >
                  Join Circle
                </button>
              </>
            )}
          </form>
        </div>

      </div>
    </section>
  );
}
