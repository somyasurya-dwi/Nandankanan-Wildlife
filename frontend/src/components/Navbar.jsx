import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Check, 
  Wallet, 
  Bell, 
  Type, 
  Sun, 
  Volume1, 
  RotateCcw,
  Sparkles 
} from 'lucide-react';
import { toggleRainforestAmbience } from '../utils/audioSynthesizer';
import { useLanguage } from '../context/LanguageContext';
import WalletModal from './WalletModal';
import NewsNoticeModal from './NewsNoticeModal';
import SubscriptionModal from './SubscriptionModal';

// Official UN Universal Symbol of Accessibility (Matching user reference image 3)
function UniversalAccessibilityIcon({ className = "w-5 h-5" }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="currentColor" 
      className={className}
      aria-hidden="true"
    >
      {/* Outer Circle */}
      <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6.5" />
      {/* Head */}
      <circle cx="50" cy="27" r="7.5" fill="currentColor" />
      {/* Outstretched Arms */}
      <path 
        d="M20 44 C 36 38, 64 38, 80 44 C 82.5 45, 83 48.5, 81 50.5 C 79 52.5, 75.5 52, 73.5 50 C 60 45.5, 40 45.5, 26.5 50 C 24.5 52, 21 52.5, 19 50.5 C 17 48.5, 17.5 45, 20 44 Z" 
        fill="currentColor"
      />
      {/* Torso */}
      <rect x="46.5" y="42" width="7" height="20" rx="3.5" fill="currentColor" />
      {/* Outstretched Legs */}
      <path 
        d="M48 60 L 33 86 C 31.5 88.5, 28 88.5, 26 86 C 24 83.5, 25 80.5, 27 78.5 L 45 56 Z" 
        fill="currentColor"
      />
      <path 
        d="M52 60 L 67 86 C 68.5 88.5, 72 88.5, 74 86 C 76 83.5, 75 80.5, 73 78.5 L 55 56 Z" 
        fill="currentColor"
      />
    </svg>
  );
}

export default function Navbar({ 
  onOpenAuth, 
  currentUser, 
  onLogout, 
  onOpenAdmin,
  activeSection: propActiveSection,
  onSectionChange
}) {
  const { language, setLanguage, t, languages, currentLanguageMeta } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const [dignitaryView, setDignitaryView] = useState('cm'); // 'cm' | 'minister' | 'director'
  const [dignitaryFading, setDignitaryFading] = useState(false);
  const [isDignitaryPaused, setIsDignitaryPaused] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [newsNoticeModalOpen, setNewsNoticeModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleOpenSub = () => setSubscriptionModalOpen(true);
    window.addEventListener('open-subscription-modal', handleOpenSub);
    return () => window.removeEventListener('open-subscription-modal', handleOpenSub);
  }, []);

  // Dynamic Eco-Wallet Balance synchronized with WalletModal
  const [ecoBalance, setEcoBalance] = useState(() => {
    try {
      const saved = localStorage.getItem('nkz_eco_balance');
      return saved ? Number(saved) : 1250;
    } catch {
      return 1250;
    }
  });

  useEffect(() => {
    const handleBalanceUpdate = () => {
      try {
        const saved = localStorage.getItem('nkz_eco_balance');
        if (saved) setEcoBalance(Number(saved));
      } catch {}
    };
    window.addEventListener('nkz_eco_balance_updated', handleBalanceUpdate);
    window.addEventListener('storage', handleBalanceUpdate);
    return () => {
      window.removeEventListener('nkz_eco_balance_updated', handleBalanceUpdate);
      window.removeEventListener('storage', handleBalanceUpdate);
    };
  }, []);

  // Active section state: dynamically initialized from current route hash or 'hero'
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (hash) return hash;
    }
    return propActiveSection || 'hero';
  });

  const isNavigatingUntilRef = useRef(0);
  const activeSectionRef = useRef(activeSection);

  // Accessibility States
  const [fontSize, setFontSize] = useState('normal'); // 'small' | 'normal' | 'large'
  const [highContrast, setHighContrast] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const accessibilityRef = useRef(null);
  const langDropdownRef = useRef(null);

  // Keep internal activeSection synchronized with external prop if provided
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    if (propActiveSection && propActiveSection !== activeSectionRef.current) {
      setActiveSection(propActiveSection);
      activeSectionRef.current = propActiveSection;
    }
  }, [propActiveSection]);

  // Track route hash changes dynamically (e.g. browser back/forward or direct hash URL navigation)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveSection(hash);
        activeSectionRef.current = hash;
        if (onSectionChange) onSectionChange(hash);
      } else if (window.scrollY < 120) {
        setActiveSection('hero');
        activeSectionRef.current = 'hero';
        if (onSectionChange) onSectionChange('hero');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [onSectionChange]);

  // Dynamic Scrollspy with High-Performance Continuous Boundary Tracking
  useEffect(() => {
    const sectionIds = [
      'hero',
      'live-wildlife',
      'interactive-map',
      'explore-animals',
      'conservation-stories',
      'notices',
      'sponsorship-portal',
    ];

    const updateActive = (newSectionId) => {
      if (newSectionId && newSectionId !== activeSectionRef.current) {
        activeSectionRef.current = newSectionId;
        setActiveSection(newSectionId);
      }
    };

    const evaluateActiveSection = () => {
      // Skip updates during smooth programmatic scrolling triggered by navbar clicks
      if (Date.now() < isNavigatingUntilRef.current) return;

      const scrollY = window.scrollY || window.pageYOffset || 0;

      // 1. Top of page threshold -> always hero
      if (scrollY < 120) {
        updateActive('hero');
        return;
      }

      // 2. Bottom of page threshold -> always sponsorship-portal
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollY + windowHeight >= docHeight - 80) {
        updateActive('sponsorship-portal');
        return;
      }

      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 95;
      const triggerY = headerHeight + Math.min(windowHeight * 0.25, 200);

      // 3. Find which section currently encompasses triggerY
      let candidateId = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerY && rect.bottom > triggerY) {
            candidateId = id;
            break;
          }
        }
      }

      // 4. Fallback if between sections (e.g. parallax breaks): pick the last section passed
      if (!candidateId) {
        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const el = document.getElementById(sectionIds[i]);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= triggerY) {
              candidateId = sectionIds[i];
              break;
            }
          }
        }
      }

      if (candidateId) {
        updateActive(candidateId);
      }
    };

    // Throttled scroll handling to eliminate layout thrashing
    let scrollTicking = false;
    let lastEvalTime = 0;
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled((prev) => (prev === scrolled ? prev : scrolled));

      const now = performance.now();
      if (now - lastEvalTime > 80 && !scrollTicking) {
        scrollTicking = true;
        lastEvalTime = now;
        window.requestAnimationFrame(() => {
          evaluateActiveSection();
          scrollTicking = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial evaluation on mount
    evaluateActiveSection();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [onSectionChange]);

  // Smooth Navigation Click Handler with Dynamic Sticky Header Offset
  const handleNavClick = (e, link) => {
    // Notify any open modals (such as the animal details modal) to close cleanly on navigation
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('close-animal-modal'));
      if (link.key === 'zooMap' || link.sectionId === 'interactive-map' || link.scrollTarget === 'zoo-map-viewport') {
        window.dispatchEvent(new CustomEvent('start-zoo-map-orbit'));
      }
    }

    if (link.onClick) {
      e.preventDefault();
      link.onClick();
      return;
    }

    if (link.href && link.href.startsWith('#')) {
      e.preventDefault();
      const activeId = link.sectionId || link.href.slice(1);
      const targetId = link.scrollTarget || activeId;

      // Lock scroll detection momentarily during smooth animation to prevent intermediate flicker
      isNavigatingUntilRef.current = Date.now() + 850;

      // Immediately highlight the selected item on click (0 lag)
      activeSectionRef.current = activeId;
      setActiveSection(activeId);
      if (onSectionChange) onSectionChange(activeId);

      const targetEl = document.getElementById(targetId) || document.getElementById(activeId);
      if (targetEl) {
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 95;

        if (window.__lenis) {
          window.__lenis.scrollTo(targetEl, {
            offset: -headerHeight - 12,
            duration: 1.2,
            immediate: false
          });
        } else {
          const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = Math.max(0, elementPosition - headerHeight - 12);
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }

        // Update URL hash without abrupt jumps
        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', link.href);
        } else {
          window.location.hash = link.href;
        }
      }
    }
  };

  // Auto-transition between CM, Minister and Director every 5 seconds
  useEffect(() => {
    if (isDignitaryPaused) return;

    const timer = setInterval(() => {
      setDignitaryFading(true);
      setTimeout(() => {
        setDignitaryView((prev) => (prev === 'cm' ? 'minister' : prev === 'minister' ? 'director' : 'cm'));
        setDignitaryFading(false);
      }, 350);
    }, 5000);

    return () => clearInterval(timer);
  }, [isDignitaryPaused]);

  const handleManualToggleDignitary = () => {
    setDignitaryFading(true);
    setTimeout(() => {
      setDignitaryView((prev) => (prev === 'cm' ? 'minister' : prev === 'minister' ? 'director' : 'cm'));
      setDignitaryFading(false);
    }, 250);
  };

  const switchToDignitary = (view) => {
    if (view === dignitaryView) return;
    setDignitaryFading(true);
    setTimeout(() => {
      setDignitaryView(view);
      setDignitaryFading(false);
    }, 250);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accessibilityRef.current && !accessibilityRef.current.contains(event.target)) {
        setAccessibilityOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Accessibility Side Effects on HTML element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-size-sm', 'font-size-lg');
    if (fontSize === 'small') root.classList.add('font-size-sm');
    if (fontSize === 'large') root.classList.add('font-size-lg');

    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (highlightLinks) {
      root.classList.add('highlight-links');
    } else {
      root.classList.remove('highlight-links');
    }
  }, [fontSize, highContrast, highlightLinks]);

  const handleToggleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const textToRead = "Welcome to Nandankanan Zoological Park. The living sanctuary in Bhubaneswar, Odisha.";
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.95;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const handleResetAccessibility = () => {
    setFontSize('normal');
    setHighContrast(false);
    setHighlightLinks(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleToggleAmbience = () => {
    const newState = toggleRainforestAmbience(!ambientPlaying);
    setAmbientPlaying(newState);
  };

  const dignitaryData = {
    cm: {
      name: t('nav.cmName'),
      role: t('nav.cmRole'),
      dept: t('nav.cmDept'),
      image: '/images/cm_mohan_majhi_thumb.png',
      alt: "Hon'ble Chief Minister Shri Mohan Charan Majhi",
      ringStyle: 'border-[#1B6537] ring-[#C8A96B]/60 bg-white',
      imgStyle: 'object-cover object-center',
      index: '1/3'
    },
    minister: {
      name: t('nav.ministerName'),
      role: t('nav.ministerRole'),
      dept: t('nav.ministerDept'),
      image: '/images/minister_ganesh_ram_thumb.jpg',
      alt: "Hon'ble Minister Shri Ganesh Ram Singkhuntia",
      ringStyle: 'border-[#1B6537] ring-[#C8A96B]/50 bg-white',
      imgStyle: 'object-cover object-top',
      index: '2/3'
    },
    director: {
      name: t('nav.directorName'),
      role: t('nav.directorRole'),
      dept: t('nav.directorDept'),
      image: '/images/director_sanath_kumar_thumb.jpg',
      alt: "Director Shri Sanath Kumar N., IFS",
      ringStyle: 'border-[#1B6537] ring-[#C8A96B]/50 bg-white',
      imgStyle: 'object-cover object-center',
      index: '3/3'
    },
  };
  const currentDignitary = dignitaryData[dignitaryView] || dignitaryData.cm;

  const navLinks = [
    { key: 'home', name: t('nav.home'), href: '#hero', sectionId: 'hero', scrollTarget: 'hero' },
    { key: 'liveViews', name: t('nav.liveViews') || t('nav.liveCameras'), href: '#live-wildlife', sectionId: 'live-wildlife', scrollTarget: 'live-cameras-grid' },
    { key: 'zooMap', name: t('nav.zooMap'), href: '#interactive-map', sectionId: 'interactive-map', scrollTarget: 'zoo-map-viewport' },
    { key: 'species', name: t('nav.species'), href: '#explore-animals', sectionId: 'explore-animals', scrollTarget: 'species-grid' },
    { key: 'stories', name: t('nav.stories'), href: '#conservation-stories', sectionId: 'conservation-stories', scrollTarget: 'stories-grid' },
    { key: 'notices', name: t('nav.newsNotice'), href: '#notices', sectionId: 'notices', scrollTarget: 'notices-bulletin-box' },
    { key: 'adopt', name: t('nav.adopt'), href: '#sponsorship-portal', sectionId: 'sponsorship-portal', scrollTarget: 'sponsorship-portal' },
  ];

  return (
    <header id="main-navbar" className="sticky top-0 z-50 w-full font-sans shadow-2xl transition-all">
      
      {/* =========================================================================
          TIER 1: OFFICIAL GOVERNMENT OF ODISHA PORTAL HEADER (White / Ivory Background)
          Permanently sticky and visible at the top across the entire website
          ========================================================================= */}
      <div className="w-full bg-[#FFFFFF] border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Official Nandankanan Brand Logo */}
          <a 
            href="#hero" 
            onClick={(e) => handleNavClick(e, { key: 'home', href: '#hero', sectionId: 'hero' })}
            className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 focus:outline-none group"
            aria-label="Nandankanan Zoological Park Home"
          >
            <div className="bg-white rounded-lg px-2 py-1 shadow-xs border border-gray-200 group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
              <img 
                src="/images/nandankanan_official_logo.png" 
                alt="Nandankanan Zoological Park Logo" 
                className="h-8 sm:h-9 md:h-10 w-auto object-contain"
              />
            </div>

            {/* Department & Park Titles */}
            <div className="border-l border-gray-300 pl-2.5 sm:pl-3 text-left min-w-0">
              <h1 className="text-xs sm:text-base md:text-lg font-black tracking-tight text-[#111612] font-display leading-tight truncate">
                {t('nav.brandTitle')} {language === 'en' ? 'ZOOLOGICAL PARK' : ''}
              </h1>
              <p className="text-[9px] sm:text-[10px] md:text-[11px] text-[#4A5568] font-medium tracking-wide leading-tight mt-0.5 line-clamp-1">
                {t('nav.govtDept')}
              </p>
            </div>
          </a>

          {/* Right Header Area: Dignitary Showcase + User Sign In Profile */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            
            {/* Dignitary Portrait Card (Auto-Transitioning between CM, Minister & Director) */}
            <div 
              className="hidden sm:flex items-center gap-2.5 shrink-0 pl-3 border-l border-gray-200 cursor-pointer select-none group"
              onMouseEnter={() => setIsDignitaryPaused(true)}
              onMouseLeave={() => setIsDignitaryPaused(false)}
              onClick={handleManualToggleDignitary}
              title="Auto-transitioning between Hon'ble Chief Minister, Minister and Director (Hover to pause, Click to toggle)"
            >
              {/* Dignitary Text Info with Smooth Crossfade & Slide Transition */}
              <div className={`text-right transition-all duration-300 ease-in-out ${
                dignitaryFading ? 'opacity-0 -translate-y-1 scale-[0.98]' : 'opacity-100 translate-y-0 scale-100'
              }`}>
                <div className="flex items-center justify-end">
                  <span className="text-xs sm:text-[13px] font-extrabold text-[#111612] tracking-tight block">
                    {currentDignitary.name}
                  </span>
                </div>

                <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-[#1B6537] block leading-tight mt-0.5">
                  {currentDignitary.role}
                </span>
                <span className="text-[8.5px] sm:text-[9.5px] text-gray-500 block leading-tight">
                  {currentDignitary.dept}
                </span>

                {/* Dignitary Slide Indicator Dots (CM, Minister, Director) */}
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); switchToDignitary('cm'); }}
                    className={`h-1 rounded-full transition-all duration-300 focus:outline-none ${
                      dignitaryView === 'cm' ? 'w-3.5 bg-[#1B6537]' : 'w-1 bg-gray-300 hover:bg-gray-400'
                    }`}
                    title="Hon'ble Chief Minister Shri Mohan Charan Majhi"
                    aria-label="Chief Minister"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); switchToDignitary('minister'); }}
                    className={`h-1 rounded-full transition-all duration-300 focus:outline-none ${
                      dignitaryView === 'minister' ? 'w-3.5 bg-[#1B6537]' : 'w-1 bg-gray-300 hover:bg-gray-400'
                    }`}
                    title="Hon'ble Minister Shri Ganesh Ram Singkhuntia"
                    aria-label="Minister"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); switchToDignitary('director'); }}
                    className={`h-1 rounded-full transition-all duration-300 focus:outline-none ${
                      dignitaryView === 'director' ? 'w-3.5 bg-[#C8A96B]' : 'w-1 bg-gray-300 hover:bg-gray-400'
                    }`}
                    title="Director Shri Sanath Kumar N., IFS"
                    aria-label="Director"
                  />
                </div>
              </div>

              {/* Dignitary Round Portrait Photograph with Crossfade Animation */}
              <div className="relative">
                <div className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 shadow-sm ring-1.5 transition-all duration-300 ease-in-out ${
                  currentDignitary.ringStyle
                } ${
                  dignitaryFading ? 'opacity-0 scale-90 rotate-6' : 'opacity-100 scale-100 rotate-0'
                }`}>
                  <img 
                    src={currentDignitary.image} 
                    alt={currentDignitary.alt} 
                    className={`w-full h-full ${currentDignitary.imgStyle}`}
                  />
                </div>
              </div>
            </div>

            {/* Official Citizen / Supporter Account Access (Sanctuary Emerald & Gold Theme) */}
            <div className="pl-2.5 sm:pl-3.5 border-l border-[#C8A96B]/30 flex items-center shrink-0">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  {currentUser.is_staff && (
                    <button
                      onClick={onOpenAdmin}
                      className="px-2.5 py-1 text-xs font-serif font-bold rounded-lg bg-[#071D12] text-[#C8A96B] border border-[#C8A96B]/60 hover:border-[#C8A96B] hover:bg-[#0B2A1A] transition-all shadow-xs cursor-pointer"
                    >
                      {t('nav.admin')}
                    </button>
                  )}
                  <div className="flex items-center gap-2 py-1 px-2.5 rounded-full bg-gradient-to-r from-[#0B2A1A]/10 via-[#123D2B]/15 to-[#0B2A1A]/10 border border-[#C8A96B]/50 text-gray-800 shadow-xs">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#0B2A1A] via-[#123D2B] to-[#071D12] border-1.5 border-[#C8A96B] flex items-center justify-center text-[#C8A96B] shrink-0 shadow-xs">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C8A96B] fill-[#C8A96B]/30" />
                    </div>
                    <span className="text-xs font-serif font-black max-w-[85px] sm:max-w-[120px] truncate text-[#071D12]">
                      {currentUser.name}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="text-xs font-bold text-red-600 hover:text-red-700 px-1 py-0.5 transition-colors cursor-pointer"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full bg-gradient-to-r from-[#0B2A1A]/5 via-[#C8A96B]/10 to-[#0B2A1A]/5 hover:from-[#123D2B]/15 hover:to-[#0B2A1A]/20 border border-[#C8A96B]/50 hover:border-[#C8A96B] transition-all cursor-pointer group active:scale-95 shadow-xs hover:shadow-md"
                  title="Sign In / Register to Nandankanan"
                  aria-label="Sign In"
                >
                  {/* Sanctuary Emerald & Gold Medallion Avatar */}
                  <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#0B2A1A] via-[#123D2B] to-[#071D12] border-2 border-[#C8A96B] ring-1 ring-[#1B6537]/50 flex items-center justify-center text-[#C8A96B] shadow-sm transition-all group-hover:scale-105 group-hover:border-[#E5C378] group-hover:shadow-[0_0_12px_rgba(200,169,107,0.45)] shrink-0">
                    <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#C8A96B] fill-[#C8A96B]/25 stroke-[2.2]" />
                  </div>
                  <div className="text-left hidden sm:block pr-1">
                    <span className="block text-xs font-serif font-black text-[#071D12] group-hover:text-[#123D2B] tracking-wide leading-none transition-colors">
                      {t('nav.signIn') || 'Sign In'}
                    </span>
                  </div>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* =========================================================================
          TIER 2: OFFICIAL NAVIGATION BAR STRIP (Permanently Visible at Top Throughout Website)
          ========================================================================= */}
      <nav className="w-full bg-[#123D2B]/95 backdrop-blur-md border-b border-[#26734D]/60 text-[#F5F4EA] shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 sm:h-11">
            
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center h-full space-x-0.5 xl:space-x-1">
              {navLinks.map((link) => {
                const isActive = (link.sectionId && activeSection === link.sectionId) || activeSection === link.key;
                return (
                  <a
                    key={link.key}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className={`h-full px-1.5 xl:px-2 text-[10.5px] xl:text-[11.5px] font-bold tracking-tight xl:tracking-wider uppercase transition-all duration-150 flex items-center justify-center whitespace-nowrap ${
                      isActive
                        ? 'bg-[#1B6537] text-white shadow-inner border-b-2 sm:border-b-3 border-[#C8A96B]'
                        : 'text-[#F5F4EA]/90 hover:bg-[#1B6537]/60 hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Mobile Brand Title in Nav Bar */}
            <div className="lg:hidden flex items-center gap-2">
              <span className="text-xs font-bold text-[#F5F4EA] uppercase tracking-wider font-display">
                {t('nav.brandTitle')}
              </span>
            </div>

            {/* Right Action Area (Grouped Utility Controls + Eco-Wallet + Subscribe + Explore Button) */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0">
              
              {/* Sleek Frosted Utility Hub (Accessibility + Language Switcher) */}
              <div className="flex items-center bg-[#092215]/85 border border-[#26734D]/50 rounded-xl px-1.5 py-0.5 shadow-inner">
                {/* 1. ACCESSIBILITY TOOL (Official UN Universal Symbol of Accessibility) */}
                <div className="relative" ref={accessibilityRef}>
                  <button
                    onClick={() => setAccessibilityOpen(!accessibilityOpen)}
                    className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${
                      accessibilityOpen || highContrast || fontSize !== 'normal'
                        ? 'text-[#C8A96B] bg-[#123D2B]'
                        : 'text-[#F5F4EA]/80 hover:text-white hover:bg-[#1B6537]/50'
                    }`}
                    title="Accessibility Tools / ସୁଗମ୍ୟତା ସୁବିଧା"
                    aria-label="Accessibility Options"
                  >
                    <UniversalAccessibilityIcon className="w-4 h-4" />
                  </button>

                  {/* Accessibility Dropdown Panel */}
                  {accessibilityOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-[#0B2A1A] border border-[#C8A96B]/50 rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn text-[#F5F4EA]">
                      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/10">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-[#C8A96B] flex items-center gap-1.5 font-bold">
                          <UniversalAccessibilityIcon className="w-4 h-4 text-[#C8A96B]" />
                          <span>Accessibility / ସୁଗମ୍ୟତା</span>
                        </span>
                        <button
                          onClick={handleResetAccessibility}
                          className="text-[10px] font-mono text-[#C8A96B] hover:text-white hover:underline flex items-center gap-1 transition-colors"
                          title="Reset accessibility options"
                        >
                          <RotateCcw className="w-3 h-3 text-[#C8A96B]" /> Reset
                        </button>
                      </div>

                      {/* Font Size Scaling */}
                      <div className="mb-3">
                        <label className="text-[11px] font-medium text-[#F5F4EA]/80 block mb-1.5">
                          Text Size / ଅକ୍ଷର ଆକାର
                        </label>
                        <div className="grid grid-cols-3 gap-1.5 bg-[#061D12] p-1 rounded-xl border border-[#26734D]/50">
                          <button
                            onClick={() => setFontSize('small')}
                            className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                              fontSize === 'small' ? 'bg-[#C8A96B] text-[#071D12] shadow-sm' : 'text-[#F5F4EA]/80 hover:bg-[#1B6537]/50 hover:text-white'
                            }`}
                          >
                            A- Small
                          </button>
                          <button
                            onClick={() => setFontSize('normal')}
                            className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                              fontSize === 'normal' ? 'bg-[#C8A96B] text-[#071D12] shadow-sm' : 'text-[#F5F4EA]/80 hover:bg-[#1B6537]/50 hover:text-white'
                            }`}
                          >
                            A Normal
                          </button>
                          <button
                            onClick={() => setFontSize('large')}
                            className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                              fontSize === 'large' ? 'bg-[#C8A96B] text-[#071D12] shadow-sm' : 'text-[#F5F4EA]/80 hover:bg-[#1B6537]/50 hover:text-white'
                            }`}
                          >
                            A+ Large
                          </button>
                        </div>
                      </div>

                      {/* High Contrast Toggle */}
                      <div className="mb-3 flex items-center justify-between p-2.5 rounded-xl bg-[#061D12] border border-[#26734D]/50">
                        <span className="text-xs font-medium text-[#F5F4EA] flex items-center gap-2">
                          <Sun className="w-3.5 h-3.5 text-[#C8A96B]" />
                          <span>High Contrast Mode</span>
                        </span>
                        <button
                          onClick={() => setHighContrast(!highContrast)}
                          className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                            highContrast ? 'bg-[#C8A96B]' : 'bg-[#123D2B] border border-[#26734D]/70'
                          }`}
                        >
                          <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                            highContrast ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      {/* Highlight Links Toggle */}
                      <div className="mb-3 flex items-center justify-between p-2.5 rounded-xl bg-[#061D12] border border-[#26734D]/50">
                        <span className="text-xs font-medium text-[#F5F4EA] flex items-center gap-2">
                          <Type className="w-3.5 h-3.5 text-[#C8A96B]" />
                          <span>Highlight All Links</span>
                        </span>
                        <button
                          onClick={() => setHighlightLinks(!highlightLinks)}
                          className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                            highlightLinks ? 'bg-[#C8A96B]' : 'bg-[#123D2B] border border-[#26734D]/70'
                          }`}
                        >
                          <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                            highlightLinks ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      {/* Screen Reader Speech Assistance */}
                      <button
                        onClick={handleToggleSpeech}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                          isSpeaking
                            ? 'bg-emerald-600 text-white border-emerald-400 animate-pulse'
                            : 'bg-[#1B6537] text-white hover:text-[#C8A96B] hover:bg-[#217c44] border border-[#26734D]/70 shadow-sm'
                        }`}
                      >
                        <Volume1 className="w-4 h-4" />
                        <span>{isSpeaking ? 'Reading Aloud (Click to Stop)' : 'Audio Reader Assistance'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Subtle Divider */}
                <span className="h-3.5 w-[1px] bg-white/20 mx-0.5" />

                {/* 3. LANGUAGE SWITCHER OPTION (Matching User Image: "अ/A" Glyph) */}
                <div className="relative" ref={langDropdownRef}>
                  <button
                    onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                    className={`px-1.5 py-1 rounded-lg transition-all flex items-baseline gap-0.5 ${
                      langDropdownOpen
                        ? 'text-[#C8A96B] bg-[#123D2B]'
                        : 'text-[#F5F4EA]/80 hover:text-white hover:bg-[#1B6537]/50'
                    }`}
                    title="Select Language / ଭାଷା ବଦଳାନ୍ତୁ"
                    aria-label="Select Language"
                  >
                    <span className="font-bold text-xs leading-none font-sans">अ</span>
                    <span className="font-black text-[9px] leading-none text-[#C8A96B] -ml-0.5 font-sans">A</span>
                    <ChevronDown className={`w-2.5 h-2.5 text-[#C8A96B] ml-0.5 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {langDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0B2A1A] border border-[#C8A96B]/50 shadow-2xl py-2 z-50 animate-fadeIn"
                      role="menu"
                    >
                      <div className="px-3 py-1 border-b border-white/10 mb-1 text-[10px] font-mono uppercase tracking-widest text-[#C8A96B]">
                        Official Languages / ଭାଷା
                      </div>
                      {languages.map((lang) => {
                        const isSelected = language === lang.code;
                        return (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setLanguage(lang.code);
                              setLangDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between transition-colors ${
                              isSelected
                                ? 'bg-[#1B6537] text-[#C8A96B] font-bold'
                                : 'text-[#F5F4EA]/90 hover:bg-[#1B6537]/50 hover:text-white'
                            }`}
                            role="menuitem"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{lang.flag}</span>
                              <div>
                                <span className="block font-medium">{lang.nativeName}</span>
                                <span className="text-[10px] text-white/50 block font-mono">{lang.name}</span>
                              </div>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#C8A96B]" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Digital Sanctuary Eco-Wallet Quick Access (Matching Image 1) */}
              <button
                type="button"
                onClick={() => setWalletModalOpen(true)}
                className="px-2 sm:px-2.5 py-1 rounded-xl bg-[#04110A] border border-[#C8A96B]/60 hover:border-[#C8A96B] flex items-center gap-1.5 sm:gap-2 transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                title="Open Nandankanan Digital Eco-Wallet"
                aria-label="Open Eco-Wallet"
              >
                <Wallet className="w-4 h-4 text-[#C8A96B] shrink-0" />
                <span className="px-2 py-0.5 rounded-lg bg-[#C8A96B] text-[#071D12] font-mono font-bold text-xs shadow-xs leading-none">
                  ₹{ecoBalance.toLocaleString('en-IN')}
                </span>
              </button>

              {/* VIP Live Streaming Subscribe Button (Matching Image 1) */}
              <button
                type="button"
                onClick={() => setSubscriptionModalOpen(true)}
                className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#C8A96B] via-[#E5C378] to-[#C8A96B] text-[#071D12] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                title="Subscribe to Unlimited Wildlife Live Streaming"
                aria-label="Subscribe to Live Streaming"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#071D12] fill-current" />
                <span>SUBSCRIBE</span>
              </button>

              {/* Fast-Track Explore Action Button (Redirects to Live Videos) */}
              <a
                href="#live-wildlife"
                onClick={(e) => handleNavClick(e, { key: 'liveViews', href: '#live-wildlife', sectionId: 'live-wildlife', scrollTarget: 'live-cameras-grid' })}
                className="px-3.5 xl:px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#C8A96B] to-[#b39352] hover:from-[#d8b87a] hover:to-[#C8A96B] text-[#071D12] font-black text-[11px] xl:text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
              >
                <span>{t('nav.exploreNow')}</span>
              </a>

            </div>

            {/* Mobile Menu Hamburger (Below lg) */}
            <div className="flex items-center gap-2 lg:hidden">
              
              {/* Mobile Accessibility Button */}
              <button
                onClick={() => setAccessibilityOpen(!accessibilityOpen)}
                className="p-1 rounded-full text-white"
                title="Accessibility"
              >
                <UniversalAccessibilityIcon className="w-4.5 h-4.5" />
              </button>

              {/* Mobile Language Button */}
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="px-1 text-xs font-bold text-white flex items-baseline font-sans"
                title="Language"
              >
                <span>अ</span>
                <span className="text-[9px] text-[#C8A96B]">A</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg text-white hover:text-[#C8A96B] focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#071D12] border-b border-[#26734D]/60 px-4 py-3 space-y-1 animate-fadeIn">
            {navLinks.map((link) => {
              const isActive = (link.sectionId && activeSection === link.sectionId) || activeSection === link.key;
              return (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={(e) => {
                    handleNavClick(e, link);
                    setMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-[#1B6537] text-white border-l-4 border-[#C8A96B]'
                      : 'text-white/90 hover:bg-[#123D2B] hover:text-[#C8A96B]'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
            <div className="pt-2.5 mt-2 border-t border-[#26734D]/40 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setWalletModalOpen(true);
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-[#04110A] border border-[#C8A96B]/50 text-[#C8A96B] flex items-center justify-center gap-2 text-xs font-bold font-mono"
              >
                <Wallet className="w-4 h-4 text-[#C8A96B]" />
                <span className="px-2 py-0.5 rounded bg-[#C8A96B] text-[#071D12] font-bold">
                  ₹{ecoBalance.toLocaleString('en-IN')}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSubscriptionModalOpen(true);
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-[#C8A96B] via-[#E5C378] to-[#C8A96B] text-[#071D12] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>SUBSCRIBE</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Eco-Wallet Modal */}
      <WalletModal 
        isOpen={walletModalOpen} 
        onClose={() => setWalletModalOpen(false)} 
        onOpenSubscription={() => {
          setWalletModalOpen(false);
          setSubscriptionModalOpen(true);
        }}
      />

      {/* VIP Unlimited Wildlife Live Streaming Subscription Modal */}
      <SubscriptionModal 
        isOpen={subscriptionModalOpen} 
        onClose={() => setSubscriptionModalOpen(false)} 
      />

      {/* News & Notices Bulletin Modal */}
      <NewsNoticeModal 
        isOpen={newsNoticeModalOpen} 
        onClose={() => setNewsNoticeModalOpen(false)} 
      />

    </header>
  );
}
