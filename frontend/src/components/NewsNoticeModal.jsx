import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  FileText, 
  Download, 
  Calendar, 
  Search, 
  AlertCircle, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function NewsNoticeModal({ isOpen, onClose }) {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const notices = [
    {
      id: 'NK-NOT-2026-088',
      title: 'Tiger & Lion Safari Operating Schedule & Winter Timings Advisory (2026–27)',
      date: '20 Nov 2026',
      category: 'ADVISORY',
      isNew: true,
      summary: 'Safari operations commence promptly at 09:00 AM. Fast-track digital token booking is recommended due to peak tourist inflow during the holiday season.',
      fileSize: '420 KB PDF'
    },
    {
      id: 'NK-TND-2026-042',
      title: 'E-Tender Notice: Supply of Fresh Fodder, Concentrates & Veterinary Pharmaceuticals for 2027',
      date: '18 Nov 2026',
      category: 'TENDER',
      isNew: true,
      summary: 'Bids invited from certified suppliers for dietary provisions adhering to Central Zoo Authority (CZA) nutritional specifications.',
      fileSize: '1.2 MB PDF'
    },
    {
      id: 'NK-CIR-2026-019',
      title: 'Press Release: Historic Conservation Milestone — 3 Royal Bengal Tiger Cubs Born Healthy',
      date: '12 Nov 2026',
      category: 'NEWS',
      isNew: false,
      summary: 'Tigress Bijaya gives birth to three healthy cubs under 24/7 CCTV surveillance at the Conservation Breeding Center.',
      fileSize: '890 KB PDF'
    },
    {
      id: 'NK-NOT-2026-074',
      title: 'Lake Kanjia Eco-Tourism: Solar-Powered Boats Operational with Zero Emissions Protocol',
      date: '04 Nov 2026',
      category: 'ADVISORY',
      isNew: false,
      summary: 'All recreational boating in Lake Kanjia converted to solar electric power to prevent acoustic disturbance to migratory avifauna.',
      fileSize: '310 KB PDF'
    },
    {
      id: 'NK-CIR-2026-011',
      title: 'Plastic-Free Reserve Mandate: Strict Fine Schedule for Single-Use Polythene Carry-Bags',
      date: '28 Oct 2026',
      category: 'CIRCULAR',
      isNew: false,
      summary: 'Deposit counters operational at Gate No. 1 and Gate No. 2 for exchanging plastic bottles with biodegradable alternatives.',
      fileSize: '250 KB PDF'
    }
  ];

  const categories = ['ALL', 'ADVISORY', 'TENDER', 'NEWS', 'CIRCULAR'];

  const filtered = notices.filter((n) => {
    const matchesCat = activeCategory === 'ALL' || n.category === activeCategory;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#071D12] border border-[#C8A96B]/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0B2A1A] via-[#123D2B] to-[#0B2A1A] border-b border-[#26734D]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#C8A96B]/20 text-[#C8A96B] border border-[#C8A96B]/40 shadow-inner">
              <Bell className="w-5 h-5 text-[#C8A96B]" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg sm:text-xl text-[#F5F4EA] tracking-wide flex items-center gap-2">
                <span>Official News & Notices</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C8A96B]/20 text-[#C8A96B] font-mono border border-[#C8A96B]/40 font-bold uppercase">
                  Govt. of Odisha
                </span>
              </h2>
              <p className="text-xs text-[#A7D7A9] font-sans">
                Sanctuary circulars, tender notifications & public advisories
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close notices modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-5 bg-[#0B2A1A] border-b border-[#26734D]/30 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search circulars, ref numbers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#071810] border border-[#26734D] text-xs text-[#F5F4EA] placeholder-gray-400 focus:outline-none focus:border-[#C8A96B]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold font-mono tracking-wider transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#C8A96B] text-[#071D12] shadow-sm'
                    : 'bg-[#071810] text-gray-300 hover:text-white hover:bg-[#123D2B] border border-[#26734D]/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notices List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1 max-h-[420px]">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              No matching circulars or notices found.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#0B2A1A]/80 border border-[#26734D]/50 hover:border-[#C8A96B]/50 transition-all group"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider ${
                      item.category === 'ADVISORY' 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : item.category === 'TENDER'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : item.category === 'NEWS'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                      {item.category}
                    </span>

                    {item.isNew && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500 text-white animate-pulse">
                        NEW
                      </span>
                    )}

                    <span className="text-[10px] font-mono text-gray-400">
                      {item.id}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-[#C8A96B] flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-[#F5F4EA] group-hover:text-[#C8A96B] transition-colors leading-snug mb-1.5">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-300 leading-relaxed mb-3">
                  {item.summary}
                </p>

                <div className="flex items-center justify-between pt-2.5 border-t border-[#26734D]/30 text-xs">
                  <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                    {item.fileSize}
                  </span>

                  <button
                    onClick={() => alert(`Downloading official notification: ${item.id}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#123D2B] hover:bg-[#1B6537] text-[#C8A96B] hover:text-white border border-[#26734D] text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#071810] border-t border-[#26734D]/40 flex items-center justify-between text-[11px] text-gray-400">
          <span>Official Gazette: Department of Forest, Environment & Climate Change</span>
          <button 
            onClick={onClose}
            className="text-[#C8A96B] font-bold hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
