import React from 'react';
import { 
  Leaf, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Globe, 
  ExternalLink, 
  ShieldCheck, 
  Heart,
  Share2
} from 'lucide-react';

export default function Footer() {
  return (
    <footer id="footer" className="bg-forest-950 text-ivory-50 border-t border-gold-500/20 pt-16 pb-12 relative overflow-hidden">
      
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-forest-800">
          
          {/* Brand Col (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col items-start gap-3">
              <div className="bg-white/95 rounded-2xl p-2.5 shadow-xl border border-gold-500/40 inline-block">
                <img 
                  src="/images/nandankanan_logo.png" 
                  alt="Nandankanan Zoological Park Logo" 
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold-400 font-semibold">
                The Living World of Wildlife • Estd. 1960
              </p>
              <p className="text-xs text-[#A7D7A9] font-medium">
                ନନ୍ଦନକାନନ ପ୍ରାଣୀ ଉଦ୍ୟାନ • ଭୁବନେଶ୍ୱର, ଓଡ଼ିଶା
              </p>
            </div>

            <p className="text-xs text-ivory-200/80 leading-relaxed max-w-sm">
              Established in 1960 and set across 437 hectares of natural moist deciduous forest and 
              Lake Kanjia, Nandankanan Zoological Park is internationally renowned for tiger conservation, 
              gharials, and pangolin captive breeding. First Indian member of WAZA.
            </p>

            <div className="pt-2 flex items-center gap-3 text-gold-400">
              {/* Facebook */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-lg bg-forest-900 border border-forest-800 flex items-center justify-center hover:bg-gold-500 hover:text-forest-950 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Twitter / X */}
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-lg bg-forest-900 border border-forest-800 flex items-center justify-center hover:bg-gold-500 hover:text-forest-950 transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-lg bg-forest-900 border border-forest-800 flex items-center justify-center hover:bg-gold-500 hover:text-forest-950 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-lg bg-forest-900 border border-forest-800 flex items-center justify-center hover:bg-gold-500 hover:text-forest-950 transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-gold-400 mb-4">
              Explore Sanctuary
            </h4>
            <ul className="space-y-2 text-xs text-ivory-200/80">
              <li>
                <a href="#hero" className="hover:text-gold-300 transition-colors">Cinematic Hero</a>
              </li>
              <li>
                <a href="#live-wildlife" className="hover:text-gold-300 transition-colors">Live Wildlife Cams</a>
              </li>
              <li>
                <a href="#explore-animals" className="hover:text-gold-300 transition-colors">Species Taxonomy</a>
              </li>
              <li>
                <a href="#interactive-map" className="hover:text-gold-300 transition-colors">Interactive GIS Map</a>
              </li>
              <li>
                <a href="#virtual-experience" className="hover:text-gold-300 transition-colors">360° Habitat & Sounds</a>
              </li>
              <li>
                <a href="#sponsorship-portal" className="hover:text-gold-300 transition-colors">Animal Guardianship</a>
              </li>
            </ul>
          </div>

          {/* Conservation Pillars */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-gold-400 mb-4">
              Conservation
            </h4>
            <ul className="space-y-2 text-xs text-ivory-200/80">
              <li>
                <a href="#conservation-stories" className="hover:text-gold-300 transition-colors">White Tiger Heritage</a>
              </li>
              <li>
                <a href="#conservation-stories" className="hover:text-gold-300 transition-colors">Gharial Breeding Pool</a>
              </li>
              <li>
                <a href="#conservation-stories" className="hover:text-gold-300 transition-colors">Pangolin Research Center</a>
              </li>
              <li>
                <a href="#conservation-stories" className="hover:text-gold-300 transition-colors">Chandaka Corridor Rescue</a>
              </li>
              <li>
                <a href="#conservation-stories" className="hover:text-gold-300 transition-colors">Kanjia Lake Eco-Zone</a>
              </li>
            </ul>
          </div>

          {/* Official Contact Info */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-gold-400 mb-4">
              Verified Park Info
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory-200/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>Nandankanan, Baranga, Bhubaneswar, Odisha 754005, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>7:30 AM - 5:00 PM (Closed Mondays)</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>+91 674 2466075 / 1800-345-6789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>director@nandankanan.org</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gold-400 shrink-0" />
                <a 
                  href="https://www.nandankanan.org" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:underline text-gold-300 flex items-center gap-1"
                >
                  <span>nandankanan.org</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory-300/60 gap-4">
          <div>
            © {new Date().getFullYear()} Nandankanan Zoological Park, Forest & Environment Dept., Govt. of Odisha.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#hero" className="hover:text-gold-400">Privacy Policy</a>
            <span>•</span>
            <a href="#hero" className="hover:text-gold-400">Terms of Guardianship</a>
            <span>•</span>
            <a href="#hero" className="hover:text-gold-400">Visitor Safety Guidelines</a>
          </div>
        </div>

      </div>

    </footer>
  );
}
