import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  BookOpen, 
  Calendar, 
  User, 
  Clock, 
  ChevronRight, 
  X, 
  Sparkles, 
  Share2, 
  Bookmark, 
  Leaf,
  ArrowLeft
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ConservationStories({ stories = [] }) {
  const { t } = useLanguage();
  const [activeStoryModal, setActiveStoryModal] = useState(null);

  // Lock background scroll and pause Lenis smooth scroll while story modal is open
  useEffect(() => {
    if (!activeStoryModal) return;

    const originalOverflow = document.body.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    if (window.__lenis) {
      window.__lenis.stop();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveStoryModal(null);
      }
    };

    const handleNavEvent = () => {
      setActiveStoryModal(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handleNavEvent);
    window.addEventListener('hashchange', handleNavEvent);
    window.addEventListener('close-animal-modal', handleNavEvent);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = '';
      if (window.__lenis) {
        window.__lenis.start();
      }
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handleNavEvent);
      window.removeEventListener('hashchange', handleNavEvent);
      window.removeEventListener('close-animal-modal', handleNavEvent);
    };
  }, [activeStoryModal]);

  return (
    <section id="conservation-stories" className="pt-10 sm:pt-12 lg:pt-14 pb-10 sm:pb-12 lg:pb-14 bg-[#071D12] text-[#F5F4EA] relative overflow-hidden">
      
      {/* Top Subtle Golden Forest Horizon Separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C8A96B]/25 to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-[#05140C]/60 to-transparent pointer-events-none" />

      {/* Background Subtle Forest Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#14532D]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#2E7D32]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#123D2B]/80 border border-[#C8A96B]/40 mb-3 shadow-md">
              <Leaf className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C8A96B]">
                Editorial Chronicles & Scientific Impact
              </span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-wide text-[#F5F4EA]">
              EVERY LIFE <span className="text-[#C8A96B]">HAS A STORY</span>
            </h2>

            <p className="mt-3 text-[#F5F4EA]/80 text-sm sm:text-base max-w-xl font-light">
              Chronicles of pioneering breeding breakthroughs, habitat restoration around Lake Kanjia, 
              and veterinary missions that redefined global wildlife conservation.
            </p>
          </div>
        </div>

        {/* Stories Grid: Magazine Editorial Layout */}
        <div id="stories-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch scroll-mt-28">
          
          {/* Main Hero Story (Span 7 cols) */}
          {stories[0] && (
            <div 
              onClick={() => setActiveStoryModal(stories[0])}
              className="lg:col-span-7 group rounded-3xl bg-[#123D2B]/75 border border-[#26734D]/50 hover:border-[#C8A96B]/60 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between parallax-card"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#071D12]">
                <img
                  src={stories[0].cover_image}
                  alt={stories[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071D12] via-[#071D12]/30 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#C8A96B] text-[#123D2B] shadow-md">
                    {stories[0].category}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-[#F5F4EA]">
                  <span className="text-xs text-[#C8A96B] font-mono flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    {stories[0].read_time}
                  </span>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F5F4EA] group-hover:text-[#C8A96B] transition-colors leading-tight">
                    {stories[0].title}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <p className="text-sm text-[#F5F4EA]/80 leading-relaxed line-clamp-3">
                  {stories[0].summary}
                </p>

                <div className="mt-6 pt-4 border-t border-[#26734D]/40 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#F5F4EA]/60 font-medium">
                    <User className="w-3.5 h-3.5 text-[#C8A96B]" />
                    <span>{stories[0].author}</span>
                  </div>

                  <span className="text-xs font-bold text-[#C8A96B] group-hover:text-white flex items-center gap-1">
                    <span>Read Full Story</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Stories Column (Span 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {stories.slice(1).map((story) => (
              <div
                key={story.id}
                onClick={() => setActiveStoryModal(story)}
                className="group p-4 sm:p-5 rounded-2xl bg-[#123D2B]/75 border border-[#26734D]/50 hover:border-[#C8A96B]/60 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex gap-4 items-center parallax-card"
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-[#071D12]">
                  <img
                    src={story.cover_image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#C8A96B] mb-1">
                    <span className="truncate max-w-[140px]">{story.category}</span>
                    <span>•</span>
                    <span className="text-[#F5F4EA]/50 font-mono shrink-0">{story.read_time}</span>
                  </div>

                  <h4 className="font-display font-bold text-sm sm:text-base text-[#F5F4EA] group-hover:text-[#C8A96B] transition-colors line-clamp-2 leading-snug">
                    {story.title}
                  </h4>

                  <p className="mt-1 text-xs text-[#F5F4EA]/70 line-clamp-2 leading-relaxed">
                    {story.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Full Editorial Story Modal Reader (Portaled to document.body to break out of <main z-20> and avoid navbar overlapping) */}
      {activeStoryModal && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveStoryModal(null);
            }
          }}
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          onWheel={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={activeStoryModal.title}
        >
          <div 
            className="relative w-full max-w-3xl bg-[#0B2A1A] border border-[#C8A96B]/50 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col max-h-[90vh] text-[#F5F4EA]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header with Back & Close Buttons */}
            <div className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#071D12]/98 backdrop-blur-md border-b border-[#26734D]/50 shadow-md shrink-0">
              <span className="px-3 py-1 rounded-md bg-[#C8A96B] text-[#123D2B] text-xs font-bold uppercase tracking-wider shadow-sm">
                {activeStoryModal.category}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveStoryModal(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#123D2B] hover:bg-[#1a563c] text-[#C8A96B] hover:text-white font-bold text-xs uppercase tracking-wider transition-all border border-[#C8A96B]/30 shadow-md cursor-pointer"
                  title="Back to stories"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  onClick={() => setActiveStoryModal(null)}
                  className="p-2 rounded-xl bg-[#123D2B] hover:bg-red-950/80 text-[#F5F4EA]/80 hover:text-white border border-[#26734D] hover:border-red-500/50 transition-all shadow-md cursor-pointer"
                  aria-label="Close story"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Story Article */}
            <div 
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-6 sm:p-10 space-y-6"
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              data-lenis-prevent-touch="true"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#071D12] mb-6 shadow-md border border-[#26734D]/30">
                <img
                  src={activeStoryModal.cover_image}
                  alt={activeStoryModal.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-[#F5F4EA] leading-tight">
                  {activeStoryModal.title}
                </h3>
                
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#F5F4EA]/70 border-b border-[#26734D]/40 pb-4">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#C8A96B]" />
                    {activeStoryModal.author}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[#C8A96B]">
                    <Clock className="w-3.5 h-3.5" />
                    {activeStoryModal.read_time}
                  </span>
                </div>
              </div>

              {/* Story Content Prose */}
              <div className="space-y-4 text-sm sm:text-base text-[#F5F4EA]/90 leading-relaxed font-editorial">
                {activeStoryModal.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="first-letter:text-3xl first-letter:font-bold first-letter:text-[#C8A96B] first-letter:mr-1">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Archival Note */}
              <div className="p-5 rounded-2xl bg-[#123D2B]/90 border border-[#26734D]/40 text-xs text-[#F5F4EA]/80 leading-relaxed">
                <strong className="font-bold text-[#C8A96B]">Verified Archival Record:</strong> Documented from official Odisha Forest Department 
                reports and peer-reviewed wildlife biology journals published in collaboration with Nandankanan Zoological Park.
              </div>

            </div>

          </div>
        </div>,
        document.body
      )}

    </section>
  );
}

