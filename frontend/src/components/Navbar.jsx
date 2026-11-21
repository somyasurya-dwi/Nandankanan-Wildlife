import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Check, 
  RefreshCw, 
  Wallet, 
  Bell, 
  Type, 
  Sun, 
  Volume1, 
  RotateCcw 
} from 'lucide-react';
import { toggleRainforestAmbience } from '../utils/audioSynthesizer';
import { useLanguage } from '../context/LanguageContext';
import WalletModal from './WalletModal';
import NewsNoticeModal from './NewsNoticeModal';

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
  const [newsNoticeModalOpen, setNewsNoticeModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Active section state: dynamically initialized from current route hash or 'hero'
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (hash) return hash;
    }
    return propActiveSection || 'hero';
  });

  const isManualScrollingRef = useRef(false);
  const manualScrollTimeoutRef = useRef(null);

  // Accessibility States
  const [fontSize, setFontSize] = useState('normal'); // 'small' | 'normal' | 'large'
  const [highContrast, setHighContrast] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const accessibilityRef = useRef(null);
  const langDropdownRef = useRef(null);

  // Keep internal activeSection synchronized with external prop if provided
  useEffect(() => {
    if (propActiveSection && propActiveSection !== activeSection) {
      setActiveSection(propActiveSection);
    }
  }, [propActiveSection]);

  // Track route hash changes dynamically (e.g. browser back/forward or direct hash URL navigation)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveSection(hash);
        if (onSectionChange) onSectionChange(hash);
      } else if (window.scrollY < 120) {
        setActiveSection('hero');
        if (onSectionChange) onSectionChange('hero');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [onSectionChange]);

  // Dynamic Scrollspy with Intersection Observer & Sticky Navbar Offset
  useEffect(() => {
    const sectionIds = [
      'hero',
      'live-wildlife',
      'interactive-map',
      'explore-animals',
      'virtual-experience',
      'conservation-stories',
      'sponsorship-portal',
    ];

    const getHeaderHeight = () => {
      const header = document.querySelector('header');
      return header ? header.offsetHeight : 95;
    };

    let headerHeight = getHeaderHeight();

    // Map storing active intersection entries from IntersectionObserver
    const intersectionEntries = new Map();

    const evaluateActiveSection = () => {
      // Skip updates during smooth programmatic scrolling triggered by navbar clicks
      if (isManualScrollingRef.current) return;

      // 1. When near the top of the viewport, activate 'hero'
      if (window.scrollY < 80) {
        if (activeSection !== 'hero') {
          setActiveSection('hero');
          if (onSectionChange) onSectionChange('hero');
        }
        return;
      }

      // 2. When near the bottom of document, activate the last section ('sponsorship-portal')
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= docHeight - 80) {
        const lastId = sectionIds[sectionIds.length - 1];
        if (activeSection !== lastId) {
          setActiveSection(lastId);
          if (onSectionChange) onSectionChange(lastId);
        }
        return;
      }

      headerHeight = getHeaderHeight();
      const activationOffset = headerHeight + 60;

      let candidateId = null;

      // 3. Primary Section Boundary Detection: find section intersecting the sticky header threshold
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= activationOffset && rect.bottom > activationOffset) {
            candidateId = id;
            break;
          }
        }
      }

      // 4. Secondary Observer Fallback: highest intersection ratio in viewport
      if (!candidateId) {
        let highestRatio = 0;
        intersectionEntries.forEach((entry, id) => {
          if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
            highestRatio = entry.intersectionRatio;
            candidateId = id;
          }
        });
      }

      // Update state if section changed
      if (candidateId && candidateId !== activeSection) {
        setActiveSection(candidateId);
        if (onSectionChange) onSectionChange(candidateId);
      }
    };

    // Initialize IntersectionObserver with rootMargin accounting for sticky header offset
    const observerOptions = {
      root: null,
      rootMargin: `-${headerHeight}px 0px -40% 0px`,
      threshold: [0, 0.15, 0.3, 0.5, 0.7, 1.0]
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        intersectionEntries.set(entry.target.id, entry);
      });
      evaluateActiveSection();
    }, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Handle scroll events with rAF for instant feedback on rapid trackpad/mousewheel scrolling
    let scrollTicking = false;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(() => {
        evaluateActiveSection();
        scrollTicking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    evaluateActiveSection();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (manualScrollTimeoutRef.current) clearTimeout(manualScrollTimeoutRef.current);
    };
  }, [activeSection, onSectionChange]);

  // Smooth Navigation Click Handler with Dynamic Sticky Header Offset
  const handleNavClick = (e, link) => {
    if (link.onClick) {
      e.preventDefault();
      link.onClick();
      return;
    }

    if (link.href && link.href.startsWith('#')) {
      e.preventDefault();
      const targetId = link.sectionId || link.href.slice(1);

      // Immediately highlight the selected item on click (0 lag)
      setActiveSection(targetId);
      if (onSectionChange) onSectionChange(targetId);

      // Lock scroll detection momentarily during smooth animation to prevent intermediate flicker
      isManualScrollingRef.current = true;
      if (manualScrollTimeoutRef.current) clearTimeout(manualScrollTimeoutRef.current);
      manualScrollTimeoutRef.current = setTimeout(() => {
        isManualScrollingRef.current = false;
      }, 850);

      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 95;

        if (window.__lenis) {
          window.__lenis.scrollTo(targetEl, {
            offset: -headerHeight,
            duration: 1.2,
            immediate: false
          });
        } else {
          const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = Math.max(0, elementPosition - headerHeight + 2);
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
    { key: 'home', name: t('nav.home'), href: '#hero', sectionId: 'hero' },
    { key: 'liveViews', name: t('nav.liveViews') || t('nav.liveCameras'), href: '#live-wildlife', sectionId: 'live-wildlife' },
    { key: 'zooMap', name: t('nav.zooMap'), href: '#interactive-map', sectionId: 'interactive-map' },
    { key: 'species', name: t('nav.species'), href: '#explore-animals', sectionId: 'explore-animals' },
    { key: 'virtualTour', name: t('nav.virtualTour'), href: '#virtual-experience', sectionId: 'virtual-experience' },
    { key: 'stories', name: t('nav.stories'), href: '#conservation-stories', sectionId: 'conservation-stories' },
    { key: 'notices', name: t('nav.newsNotice'), href: '#notices', onClick: () => setNewsNoticeModalOpen(true) },
    { key: 'adopt', name: t('nav.adopt'), href: '#sponsorship-portal', sectionId: 'sponsorship-portal' },
    { key: 'wallet', name: t('nav.wallet'), href: '#wallet', onClick: () => setWalletModalOpen(true) },
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

          {/* Right: Dignitary Portrait Card (Auto-Transitioning between CM, Minister & Director) */}
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
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-xs sm:text-[13px] font-extrabold text-[#111612] tracking-tight block">
                  {currentDignitary.name}
                </span>
                <span 
                  className="text-[9px] p-0.5 rounded-full bg-emerald-50 text-[#1B6537] border border-emerald-200/80 shadow-xs flex items-center justify-center group-hover:bg-emerald-100 transition-colors"
                  title="Auto-toggle active (Click to switch now)"
                >
                  <RefreshCw className="w-2.5 h-2.5 animate-spin-slow" />
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

              {/* Status Indicator Dot with Pulse */}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-xs">
                <span className="w-1 h-1 rounded-full bg-white animate-ping" />
              </span>
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

            {/* Right Action Area (Grouped Utility Controls + Eco-Wallet + User + Explore Button) */}
            <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 shrink-0">
              
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
                    <div className="absolute right-0 mt-2 w-72 bg-[#06180E]/98 border border-[#C8A96B]/50 rounded-2xl shadow-2xl p-4 z-50 backdrop-blur-xl animate-fadeIn text-[#F5F4EA]">
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <UniversalAccessibilityIcon className="w-4 h-4 text-[#C8A96B]" />
                          <span>Accessibility / ସୁଗମ୍ୟତା</span>
                        </span>
                        <button
                          onClick={handleResetAccessibility}
                          className="text-[10px] font-mono text-[#C8A96B] hover:underline flex items-center gap-1"
                          title="Reset accessibility options"
                        >
                          <RotateCcw className="w-3 h-3" /> Reset
                        </button>
                      </div>

                      {/* Font Size Scaling */}
                      <div className="mb-3">
                        <label className="text-[11px] font-medium text-white/70 block mb-1.5">
                          Text Size / ଅକ୍ଷର ଆକାର
                        </label>
                        <div className="grid grid-cols-3 gap-1.5 bg-[#0B2419] p-1 rounded-xl border border-white/10">
                          <button
                            onClick={() => setFontSize('small')}
                            className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                              fontSize === 'small' ? 'bg-[#C8A96B] text-[#071D12]' : 'text-white/80 hover:bg-white/5'
                            }`}
                          >
                            A- Small
                          </button>
                          <button
                            onClick={() => setFontSize('normal')}
                            className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                              fontSize === 'normal' ? 'bg-[#C8A96B] text-[#071D12]' : 'text-white/80 hover:bg-white/5'
                            }`}
                          >
                            A Normal
                          </button>
                          <button
                            onClick={() => setFontSize('large')}
                            className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                              fontSize === 'large' ? 'bg-[#C8A96B] text-[#071D12]' : 'text-white/80 hover:bg-white/5'
                            }`}
                          >
                            A+ Large
                          </button>
                        </div>
                      </div>

                      {/* High Contrast Toggle */}
                      <div className="mb-3 flex items-center justify-between p-2 rounded-xl bg-[#0B2419] border border-white/10">
                        <span className="text-xs font-medium flex items-center gap-2">
                          <Sun className="w-3.5 h-3.5 text-[#C8A96B]" />
                          <span>High Contrast Mode</span>
                        </span>
                        <button
                          onClick={() => setHighContrast(!highContrast)}
                          className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                            highContrast ? 'bg-[#C8A96B]' : 'bg-gray-600'
                          }`}
                        >
                          <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                            highContrast ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      {/* Highlight Links Toggle */}
                      <div className="mb-3 flex items-center justify-between p-2 rounded-xl bg-[#0B2419] border border-white/10">
                        <span className="text-xs font-medium flex items-center gap-2">
                          <Type className="w-3.5 h-3.5 text-[#C8A96B]" />
                          <span>Highlight All Links</span>
                        </span>
                        <button
                          onClick={() => setHighlightLinks(!highlightLinks)}
                          className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                            highlightLinks ? 'bg-[#C8A96B]' : 'bg-gray-600'
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
                        className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                          isSpeaking
                            ? 'bg-emerald-600 text-white border-emerald-400 animate-pulse'
                            : 'bg-[#123D2B] text-[#C8A96B] border-[#C8A96B]/30 hover:bg-[#C8A96B] hover:text-[#071D12]'
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

              {/* Digital Sanctuary Eco-Wallet Quick Access */}
              <button
                onClick={() => setWalletModalOpen(true)}
                className="px-2 xl:px-2.5 py-1.5 rounded-lg bg-[#0B2A1A] border border-[#C8A96B]/50 hover:border-[#C8A96B] text-[#C8A96B] hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm hover:scale-105 active:scale-95 whitespace-nowrap"
                title="Open Nandankanan Digital Eco-Wallet"
                aria-label="Open Eco-Wallet"
              >
                <Wallet className="w-3.5 h-3.5 text-[#C8A96B]" />
                <span className="hidden xl:inline">{t('nav.wallet')}</span>
                <span className="text-[10px] font-black font-mono bg-[#C8A96B] text-[#071D12] px-1.5 py-0.5 rounded-md shadow-xs">
                  ₹1,250
                </span>
              </button>

              {/* User Sign In / Dashboard */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  {currentUser.is_staff && (
                    <button
                      onClick={onOpenAdmin}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-[#C8A96B]/20 text-[#C8A96B] border border-[#C8A96B]/40"
                    >
                      {t('nav.admin')}
                    </button>
                  )}
                  <div className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded bg-[#0B2A1A] border border-[#26734D] text-[#F5F4EA]">
                    <User className="w-3 h-3 text-[#C8A96B]" />
                    <span className="max-w-[80px] truncate">{currentUser.name}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="text-xs text-[#F5F4EA]/70 hover:text-white hover:underline"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="px-3 py-1 text-xs font-semibold tracking-wider uppercase text-[#F5F4EA] hover:text-[#C8A96B] transition-colors"
                >
                  {t('nav.signIn')}
                </button>
              )}

              {/* Fast-Track Explore Action Button */}
              <a
                href="#explore-animals"
                onClick={(e) => handleNavClick(e, { key: 'species', href: '#explore-animals', sectionId: 'explore-animals' })}
                className="px-3 xl:px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#C8A96B] to-[#b39352] hover:from-[#d8b87a] hover:to-[#C8A96B] text-[#071D12] font-black text-[11px] xl:text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
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
          </div>
        )}
      </nav>

      {/* Eco-Wallet Modal */}
      <WalletModal 
        isOpen={walletModalOpen} 
        onClose={() => setWalletModalOpen(false)} 
      />

      {/* News & Notices Bulletin Modal */}
      <NewsNoticeModal 
        isOpen={newsNoticeModalOpen} 
        onClose={() => setNewsNoticeModalOpen(false)} 
      />

    </header>
  );
}
