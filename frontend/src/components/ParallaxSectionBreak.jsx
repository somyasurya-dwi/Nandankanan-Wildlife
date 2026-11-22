import React, { useRef, useEffect } from 'react';
import { ArrowRight, Compass, Shield, Waves } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function GoldenPawIcon({ className = "w-4 h-4 text-[#C8A96B]" }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="currentColor" 
      className={`${className} inline-block shrink-0`}
      aria-hidden="true"
    >
      {/* Main Central Pad */}
      <path d="M50 82 C34 82, 22 70, 25 54 C27 42, 38 40, 50 44 C62 40, 73 42, 75 54 C78 70, 66 82, 50 82 Z" />
      {/* 4 Toes */}
      <ellipse cx="26" cy="34" rx="7" ry="9" transform="rotate(-20 26 34)" />
      <ellipse cx="42" cy="24" rx="7.5" ry="10" transform="rotate(-6 42 24)" />
      <ellipse cx="58" cy="24" rx="7.5" ry="10" transform="rotate(6 58 24)" />
      <ellipse cx="74" cy="34" rx="7" ry="9" transform="rotate(20 74 34)" />
    </svg>
  );
}

export default function ParallaxSectionBreak({
  id,
  bgImage,
  badge,
  odiaText,
  titlePart1,
  titlePart2,
  description,
  metrics = [],
  ctaText,
  ctaHref,
  ctaIcon: CtaIcon = Compass,
  onCtaClick
}) {
  const { language } = useLanguage();
  const glow1Ref = useRef(null);
  const glow2Ref = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            // Only calculate and transform when in/near viewport without React re-renders
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              const scrolled = (window.innerHeight - rect.top) * 0.16;
              if (glow1Ref.current) glow1Ref.current.style.transform = `translate3d(0, ${scrolled * 0.35}px, 0)`;
              if (glow2Ref.current) glow2Ref.current.style.transform = `translate3d(0, ${-scrolled * 0.25}px, 0)`;
              if (contentRef.current) contentRef.current.style.transform = `translate3d(0, ${scrolled * 0.1}px, 0)`;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  return (
    <section 
      id={id}
      className="relative w-full min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] flex items-center justify-center overflow-hidden py-10 sm:py-14 lg:py-16 my-0"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
    >
      {/* Top and Bottom Horizon Accent Lines for Seamless Flow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C8A96B]/30 to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C8A96B]/30 to-transparent z-20 pointer-events-none" />

      {/* Cinematic Dark Glass Overlay with Forest-Green Vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#05140C]/90 via-[#071D12]/75 to-[#05140C]/90 z-10 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#071D12] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#071D12] to-transparent z-10 pointer-events-none" />

      {/* Floating Parallax Atmospheric Glow */}
      <div 
        ref={glow1Ref}
        className="parallax-depth-glow w-96 h-96 bg-[#C8A96B] top-10 left-10 z-10 will-change-transform" 
      />
      <div 
        ref={glow2Ref}
        className="parallax-depth-glow w-96 h-96 bg-[#26734D] bottom-10 right-10 z-10 will-change-transform" 
      />

      {/* Centered Floating Glassmorphism Hero Content */}
      <div 
        ref={contentRef}
        className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center will-change-transform"
      >
        {/* Gold Pill Badge with Golden Paw Icon */}
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B2A1A]/90 border border-[#C8A96B]/60 shadow-[0_0_15px_rgba(200,169,107,0.25)] backdrop-blur-md mb-4 text-[#C8A96B] text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase">
            {badge.includes('BREEDING') || badge.includes('GLOBAL') ? (
              <GoldenPawIcon className="w-4 h-4 text-[#C8A96B] drop-shadow-[0_0_6px_rgba(200,169,107,0.7)]" />
            ) : (
              <Waves className="w-3.5 h-3.5 text-[#C8A96B] drop-shadow-[0_0_6px_rgba(200,169,107,0.5)]" />
            )}
            <span className="text-[#C8A96B]">{badge.replace(/^[🐾🌿\s]+/, '')}</span>
          </div>
        )}

        {/* Odia Poetic Subtitle */}
        {odiaText && (
          <div className="text-lg sm:text-2xl font-odia font-bold text-[#C8A96B] tracking-wide mb-2 drop-shadow-md">
            {odiaText}
          </div>
        )}

        {/* Grand Headline with Editorial Styling */}
        <h2 className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-[#F5F4EA] tracking-tight leading-tight mb-4 drop-shadow-2xl">
          {titlePart1}{' '}
          <span className="font-editorial italic font-normal text-[#C8A96B] block sm:inline">
            {titlePart2}
          </span>
        </h2>

        {/* Descriptive Sentence */}
        {description && (
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#F5F4EA]/85 font-light leading-relaxed mb-8 drop-shadow-sm">
            {description}
          </p>
        )}

        {/* Floating Metrics Pill Bar */}
        {metrics && metrics.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-8">
            {metrics.map((m, idx) => (
              <div 
                key={idx}
                className="px-4 py-2.5 rounded-2xl bg-[#071D12]/80 border border-[#C8A96B]/30 backdrop-blur-md shadow-lg flex items-center gap-3 transition-transform hover:-translate-y-1"
              >
                <span className="text-[#C8A96B] font-display font-black text-base sm:text-xl">
                  {m.value}
                </span>
                <span className="text-gray-300 font-sans text-xs tracking-wide">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* CTA Button */}
        {ctaText && (
          <div className="inline-block">
            <a
              href={ctaHref || '#'}
              onClick={(e) => {
                if (onCtaClick) {
                  e.preventDefault();
                  onCtaClick(e);
                }
              }}
              className="btn-accent px-6 sm:px-8 py-3.5 rounded-2xl text-xs sm:text-sm tracking-wider uppercase inline-flex items-center gap-3 cursor-pointer"
            >
              <CtaIcon className="w-4 h-4 text-[#071D12]" />
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 text-[#071D12]" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
