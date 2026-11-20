import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Ticket, Volume2, VolumeX } from 'lucide-react';

export default function VantaraNavbar({ language, onToggleLanguage, onOpenTickets }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = language === 'odia' ? [
    { name: 'ଅନୁସନ୍ଧାନ (Explore)', href: '#hero' },
    { name: 'ଜୀବଜନ୍ତୁ (Animals)', href: '#animals' },
    { name: 'ଲାଇଭ୍ (Live)', href: '#live' },
    { name: 'ମାନଚିତ୍ର (Map)', href: '#map' },
    { name: 'ପରିଦର୍ଶନ (Visit)', href: '#plan-visit' },
    { name: 'ସଂରକ୍ଷଣ (Conservation)', href: '#conservation' },
    { name: 'ସହଯୋଗ (Involved)', href: '#get-involved' },
  ] : [
    { name: 'Explore', href: '#hero' },
    { name: 'Animals', href: '#animals' },
    { name: 'Live', href: '#live' },
    { name: 'Map', href: '#map' },
    { name: 'Plan Your Visit', href: '#plan-visit' },
    { name: 'Conservation', href: '#conservation' },
    { name: 'Get Involved', href: '#get-involved' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[#071D12]/95 backdrop-blur-xl py-3 border-b border-[#14532D]/50 text-[#F4F1E8] shadow-2xl'
          : 'bg-transparent py-5 sm:py-6 text-[#F4F1E8]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="bg-white/95 rounded-xl p-1.5 shadow-md border border-white/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <img 
              src="/images/nandankanan_logo.png" 
              alt="Nandankanan Logo" 
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </div>
          <div>
            <span className="font-serif font-black text-lg sm:text-xl tracking-[0.16em] uppercase block leading-tight text-[#F4F1E8]">
              NANDANKANAN
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] font-medium block leading-none text-[#A7D7A9]">
              {language === 'odia' ? 'ପ୍ରାଣୀ ଉଦ୍ୟାନ • ଭୁବନେଶ୍ୱର' : 'ZOOLOGICAL PARK • BHUBANESWAR'}
            </span>
          </div>
        </a>

        {/* Center Nav Links */}
        <nav className="hidden xl:flex items-center space-x-7">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs uppercase tracking-[0.14em] font-semibold transition-colors duration-200 relative py-1 text-[#F4F1E8]/85 hover:text-[#F28C1B]"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Actions: Language Switcher + Book Tickets */}
        <div className="hidden sm:flex items-center gap-4">
          
          {/* Language Toggle: EN / ODIA */}
          <button
            onClick={onToggleLanguage}
            className="px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider flex items-center gap-1.5 border border-white/20 text-[#F4F1E8] hover:bg-white/10 transition-all"
            title="Switch Language / ଭାଷା ପରିବର୍ତ୍ତନ"
          >
            <Globe className="w-3.5 h-3.5 text-[#F28C1B]" />
            <span>{language === 'odia' ? 'ଓଡ଼ିଆ' : 'English'}</span>
          </button>

          {/* Green "Book Tickets" Pill Button */}
          <button
            onClick={onOpenTickets}
            className="px-5 py-2.5 rounded-full bg-[#14532D] hover:bg-[#2E7D32] text-[#F4F1E8] font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Ticket className="w-3.5 h-3.5 text-[#F28C1B]" />
            <span>{language === 'odia' ? 'ଟିକେଟ୍ ବୁକ୍ କରନ୍ତୁ' : 'Book Tickets'}</span>
          </button>

        </div>

        {/* Mobile Hamburger */}
        <div className="flex items-center gap-3 xl:hidden">
          <button
            onClick={onToggleLanguage}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
              scrolled ? 'border-white/20 text-white' : 'border-black/20 text-[#0B2A1A]'
            }`}
          >
            {language === 'odia' ? 'ଓଡ଼ିଆ' : 'EN'}
          </button>
          
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`p-2 focus:outline-none ${scrolled ? 'text-white' : 'text-[#0B2A1A]'}`}
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="xl:hidden bg-[#0B2A1A]/98 backdrop-blur-2xl border-b border-[#14532D]/40 px-8 py-8 text-white shadow-2xl">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm uppercase tracking-wider font-semibold text-white/90 hover:text-[#F28C1B] py-1 border-b border-white/5"
              >
                {link.name}
              </a>
            ))}

            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => { setMobileOpen(false); onOpenTickets(); }}
                className="w-full py-3.5 rounded-full bg-[#14532D] hover:bg-[#2E7D32] text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4 text-[#F28C1B]" />
                <span>{language === 'odia' ? 'ଟିକେଟ୍ ବୁକ୍ କରନ୍ତୁ' : 'Book Tickets'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

