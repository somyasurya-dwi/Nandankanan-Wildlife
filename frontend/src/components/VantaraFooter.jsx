import React from 'react';
import { 
  Compass, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  ArrowUp, 
  Heart,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function VantaraFooter({ language, onOpenTickets }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const galleryImages = [
    { title: "Royal Bengal Tiger", src: "/images/royal_bengal_tiger.jpg" },
    { title: "White Tiger Lineage", src: "/images/white_tiger.jpg?v=20261123" },
    { title: "Asiatic Lion", src: "/images/asiatic_lion.jpg" },
    { title: "Asian Elephant", src: "/images/asian_elephant.jpg" },
    { title: "Kanjia Lake Eco-Zone", src: "/images/kanjia_lake.jpg" },
    { title: "King Cobra Habitat", src: "/images/king_cobra.jpg" },
  ];

  const newsItems = [
    {
      date: "Nov 15, 2026",
      title: "Three New White Tiger Cubs Complete 6-Month Pediatric Care",
      tag: "Breeding News"
    },
    {
      date: "Oct 28, 2026",
      title: "Winter Migratory Birds Flock to Lake Kanjia Sanctuary Islands",
      tag: "Wetland Ecology"
    },
    {
      date: "Oct 10, 2026",
      title: "New Solar-Powered Electric Safari Fleet Inaugurated",
      tag: "Green Initiative"
    }
  ];

  return (
    <footer className="bg-[#071D12] text-[#F4F1E8] pt-24 pb-12 relative z-20 border-t border-white/10 overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#14532D]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Gallery Strip */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#F28C1B] font-bold block mb-1">
                SANCTUARY VISUALS
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Wild Encounters Gallery
              </h3>
            </div>
            <a 
              href="#interactive-map"
              className="text-xs uppercase font-mono tracking-wider text-[#A7D7A9] hover:text-white transition-colors"
            >
              Explore Map Markers →
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {galleryImages.map((img, idx) => (
              <div 
                key={idx}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-lg cursor-pointer"
              >
                <img 
                  src={img.src} 
                  alt={img.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-[10px] font-mono text-white font-semibold line-clamp-1">
                    {img.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* News & Bulletins Section */}
        <div className="mb-20 pb-16 border-b border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-4 h-4 text-[#F28C1B]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#F28C1B] font-bold">
              OFFICIAL SANCTUARY BULLETINS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsItems.map((news, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#A7D7A9]/40 transition-colors">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#A7D7A9] mb-2">
                  <span>{news.date}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#14532D] text-white font-bold">{news.tag}</span>
                </div>
                <h4 className="text-sm font-serif font-bold text-white hover:text-[#F28C1B] transition-colors cursor-pointer leading-snug">
                  {news.title}
                </h4>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white rounded-xl p-2 shadow-sm border border-black/10">
                <img 
                  src="/images/nandankanan_logo.png" 
                  alt="Nandankanan Logo" 
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div>
                <span className="font-serif font-black text-xl tracking-[0.16em] uppercase block text-white leading-tight">
                  NANDANKANAN
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-[#A7D7A9] block">
                  ZOOLOGICAL PARK • BHUBANESWAR
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#F4F1E8]/75 font-light leading-relaxed max-w-sm mb-6">
              Established in 1960 amidst the natural Sal forests of Odisha, Nandankanan is India's 
              foremost 437-hectare biological sanctuary and world pioneer in white tiger preservation.
            </p>

            <div className="flex items-center gap-3 text-white/70">
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#F28C1B] hover:text-[#0B2A1A] flex items-center justify-center transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#F28C1B] hover:text-[#0B2A1A] flex items-center justify-center transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#F28C1B] hover:text-[#0B2A1A] flex items-center justify-center transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="X" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#F28C1B] hover:text-[#0B2A1A] flex items-center justify-center transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 3: Navigation Quick Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#A7D7A9] font-bold mb-5">
              Explore Sanctuary
            </h4>
            <ul className="space-y-3 text-xs text-[#F4F1E8]/80 font-light">
              <li><a href="#hero" className="hover:text-[#F28C1B] transition-colors">Where the Wild Lives On</a></li>
              <li><a href="#animals" className="hover:text-[#F28C1B] transition-colors">Encyclopaedia of Species</a></li>
              <li><a href="#live" className="hover:text-[#F28C1B] transition-colors">4K Live Animal Feeds</a></li>
              <li><a href="#interactive-map" className="hover:text-[#F28C1B] transition-colors">Interactive Illustrated Map</a></li>
              <li><a href="#plan-visit" className="hover:text-[#F28C1B] transition-colors">Visitor Guidelines & Safaris</a></li>
              <li><a href="#conservation" className="hover:text-[#F28C1B] transition-colors">Scientific Research Wing</a></li>
              <li><a href="#get-involved" className="hover:text-[#F28C1B] transition-colors">Adopt an Animal / Guardian</a></li>
            </ul>
          </div>

          {/* Col 4: Timings & Rapid Fast-Track */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#A7D7A9] font-bold mb-5">
              Visiting Schedule
            </h4>
            <div className="space-y-3 text-xs text-[#F4F1E8]/80 font-light">
              <div>
                <span className="block text-white font-semibold">Tuesday – Sunday</span>
                <span>07:30 AM to 05:30 PM</span>
              </div>
              <div>
                <span className="block text-white font-semibold">Every Monday</span>
                <span className="text-amber-400">Closed for Maintenance</span>
              </div>
              <div>
                <span className="block text-white font-semibold">Safari Hours</span>
                <span>09:00 AM to 04:30 PM</span>
              </div>
              <button
                onClick={onOpenTickets}
                className="mt-4 px-4 py-2 rounded-full bg-[#14532D] hover:bg-[#2E7D32] text-white text-xs font-bold uppercase tracking-wider block"
              >
                Book Tickets Online
              </button>
            </div>
          </div>

          {/* Col 5: Verified Contact Info */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#A7D7A9] font-bold mb-5">
              Official Contact
            </h4>
            <ul className="space-y-3.5 text-xs text-[#F4F1E8]/80 font-light">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F28C1B] flex-shrink-0 mt-0.5" />
                <span>Nandankanan Zoological Park, Baranga, Bhubaneswar, Odisha – 754005</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F28C1B] flex-shrink-0" />
                <span>0674-2466075 / +91 674 2466072</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F28C1B] flex-shrink-0" />
                <span>director.nandankanan@gov.in</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#F28C1B] flex-shrink-0" />
                <span>www.nandankanan.org</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A7D7A9]/80 gap-4">
          <div>
            <span>© {new Date().getFullYear()} Nandankanan Zoological Park • Forest & Environment Dept, Government of Odisha.</span>
            <span className="block text-[11px] text-[#A7D7A9]/50 mt-1">
              {language === 'odia' 
                ? 'ଓଡ଼ିଶା ସରକାରଙ୍କ ଜଙ୍ଗଲ ଓ ପରିବେଶ ବିଭାଗ ଅଧୀନରେ ପରିଚାଳିତ।' 
                : 'Recognized by Central Zoo Authority (CZA) & World Association of Zoos and Aquariums (WAZA).'}
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-semibold text-white hover:text-[#F28C1B] transition-colors group cursor-pointer"
          >
            <span className="uppercase tracking-widest text-[10px]">Back to Top</span>
            <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#F28C1B] group-hover:text-[#0B2A1A] flex items-center justify-center transition-all">
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>

      </div>
    </footer>
  );
}

