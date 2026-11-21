import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Video, 
  ShieldCheck, 
  MapPin, 
  Volume2, 
  VolumeX, 
  User, 
  Menu, 
  X, 
  Leaf, 
  Sparkles,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { toggleRainforestAmbience } from '../utils/audioSynthesizer';

export default function Navbar({ 
  onOpenAuth, 
  currentUser, 
  onLogout, 
  onOpenAdmin,
  activeSection
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ambientPlaying, setAmbientPlaying] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleAmbience = () => {
    const newState = toggleRainforestAmbience(!ambientPlaying);
    setAmbientPlaying(newState);
  };

  const navLinks = [
    { name: 'Live View', href: '#live-wildlife' },
    { name: 'Zoo Map', href: '#interactive-map' },
    { name: 'Species', href: '#explore-animals' },
    { name: 'Virtual Tour', href: '#virtual-experience' },
    { name: 'Stories', href: '#conservation-stories' },
    { name: 'Plan Visit', href: '#plan-visit' },
    { name: 'Adopt', href: '#sponsorship-portal' },
    { name: 'Notice & News', href: '#news-notice' },
  ];

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-[#071D12]/95 backdrop-blur-xl py-3 border-b border-[#26734D]/50 shadow-2xl text-[#F5F4EA] transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Official Nandankanan Brand Logo */}
          <a href="#hero" className="flex items-center gap-3 shrink-0 group">
            <div className="bg-white/95 rounded-xl px-2.5 py-1.5 shadow-md border border-[#C8A96B]/40 group-hover:scale-105 transition-transform flex items-center justify-center">
              <img 
                src="/images/nandankanan_official_logo.png" 
                alt="Nandankanan Zoological Park Logo" 
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
            <div className="hidden sm:block border-l border-[#C8A96B]/30 pl-3">
              <span className="text-xs uppercase tracking-[0.2em] font-bold block leading-tight font-serif text-[#F5F4EA]">
                NANDANKANAN
              </span>
              <span className="text-[10px] text-[#C8A96B] font-mono block leading-tight">
                ନନ୍ଦନକାନନ • BHUBANESWAR
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-0.5 lg:space-x-1.5 xl:space-x-2.5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`px-2.5 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all duration-200 rounded-lg whitespace-nowrap ${
                  activeSection === link.href.replace('#', '')
                    ? 'text-[#C8A96B] font-bold bg-[#123D2B]'
                    : 'text-[#F5F4EA]/85 hover:text-[#C8A96B] hover:bg-[#123D2B]/50'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Action Icons & Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* User / Staff Dashboard Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {currentUser.is_staff && (
                  <button
                    onClick={onOpenAdmin}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#C8A96B]/15 border border-[#C8A96B]/40 text-[#C8A96B] hover:bg-[#C8A96B]/25 transition-all flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-[#C8A96B]" />
                    <span>Admin</span>
                  </button>
                )}
                <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${
                  isScrolled ? 'bg-[#0B2A1A] border-[#26734D] text-[#F5F4EA]' : 'bg-black/30 border-white/20 text-[#F5F4EA]'
                }`}>
                  <User className="w-3.5 h-3.5 text-[#C8A96B]" />
                  <span>{currentUser.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className={`text-xs hover:underline ${isScrolled ? 'text-[#F5F4EA]/70' : 'text-[#F5F4EA]/80'}`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className={`text-xs font-semibold tracking-wider uppercase px-4 py-2 transition-colors ${
                  isScrolled ? 'text-[#F5F4EA]/80 hover:text-[#C8A96B]' : 'text-[#F5F4EA] hover:text-[#C8A96B]'
                }`}
              >
                Sign In
              </button>
            )}

            {/* Prominent Explore Now Button */}
            <a
              href="#explore-animals"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#C8A96B] to-[#b39352] hover:from-[#d8b87a] hover:to-[#C8A96B] text-[#123D2B] font-display font-black text-xs uppercase tracking-[0.14em] shadow-lg shadow-[#C8A96B]/20 hover:shadow-[#C8A96B]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-1.5"
            >
              <span>EXPLORE NOW</span>
            </a>

          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={handleToggleAmbience}
              className={`p-2 rounded-full border text-xs ${
                ambientPlaying ? 'bg-gold-500/20 border-gold-400 text-gold-300' : 'bg-forest-800/60 border-forest-600/50 text-ivory-200'
              }`}
            >
              {ambientPlaying ? <Volume2 className="w-4 h-4 text-gold-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-forest-800/80 border border-gold-500/30 text-ivory-100 hover:text-gold-400 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-forest-950/98 backdrop-blur-xl border-b border-gold-500/20 px-6 py-6 transition-all duration-300 shadow-2xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium uppercase tracking-wider text-ivory-100 hover:text-gold-400 hover:bg-forest-800/50 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
            
            <div className="pt-4 border-t border-forest-800 flex flex-col gap-3">
              {currentUser ? (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gold-300 font-medium">Signed in: {currentUser.name}</span>
                  {currentUser.is_staff && (
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
                      className="px-3 py-1.5 text-xs font-semibold rounded bg-gold-500/20 text-gold-300 border border-gold-500/40"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                  className="w-full py-2.5 rounded-lg bg-forest-800 border border-gold-500/30 text-ivory-100 font-medium text-xs uppercase tracking-wider text-center"
                >
                  Sign In / Register
                </button>
              )}

              <a
                href="#explore-animals"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-forest-950 font-bold text-xs uppercase tracking-widest text-center shadow-lg shadow-gold-500/20"
              >
                Explore Now
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

