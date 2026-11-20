import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function TigerNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Platform', href: '#features' },
    { name: 'Coverage', href: '#stats' },
    { name: 'Research', href: '#features' },
    { name: 'Company', href: '#testimonial' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#EFEFEC]/85 backdrop-blur-md py-3.5 border-b border-black/5 shadow-sm'
          : 'bg-transparent py-5 sm:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        
        {/* Brand Logo "TIGER" with subtle orange tiger dot */}
        <a href="#" className="flex items-center gap-2 group">
          <span className="font-serif font-black text-2xl tracking-[0.18em] text-[#111111] uppercase">
            TIGER
          </span>
          <span className="w-2 h-2 rounded-full bg-[#F28C1B] group-hover:scale-125 transition-transform" />
        </a>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs uppercase tracking-[0.15em] font-medium text-[#666666] hover:text-[#111111] transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-6">
          <a
            href="#cta"
            className="text-xs uppercase tracking-[0.15em] font-medium text-[#666666] hover:text-[#111111] transition-colors"
          >
            Log in
          </a>
          <a
            href="#cta"
            className="px-5 py-2.5 rounded-full bg-[#111111] hover:bg-[#F28C1B] text-white font-semibold text-xs tracking-[0.1em] uppercase transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            Get started
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[#111111] focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#EFEFEC]/98 backdrop-blur-xl border-b border-black/10 px-8 py-6 shadow-xl">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm uppercase tracking-wider font-medium text-[#444444] hover:text-[#111111]"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-black/10 flex flex-col gap-3">
              <a
                href="#cta"
                onClick={() => setMobileOpen(false)}
                className="w-full py-2.5 text-center text-xs uppercase tracking-wider font-semibold text-[#111111]"
              >
                Log in
              </a>
              <a
                href="#cta"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 rounded-full bg-[#111111] hover:bg-[#F28C1B] text-white text-center text-xs uppercase tracking-wider font-semibold shadow-md"
              >
                Get started
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

