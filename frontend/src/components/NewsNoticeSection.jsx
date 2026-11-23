import React, { useState } from 'react';
import { 
  Bell, 
  FileText, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  Printer, 
  Download 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const NOTICES = [
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

export default function NewsNoticeSection() {
  const { t } = useLanguage();
  const [isNewsPaused, setIsNewsPaused] = useState(false);
  const [activeNoticeModal, setActiveNoticeModal] = useState(null);

  return (
    <section id="notices" className="py-24 bg-[#071D12] text-ivory-50 relative overflow-hidden scroll-mt-24">
      
      {/* Background Ambience Glow */}
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-[#14532D]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#C8A96B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
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
        <div id="notices-bulletin-box" className="max-w-5xl mx-auto rounded-3xl bg-forest-950/80 border border-gold-500/20 backdrop-blur-md p-6 sm:p-8 shadow-2xl scroll-mt-28">
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
