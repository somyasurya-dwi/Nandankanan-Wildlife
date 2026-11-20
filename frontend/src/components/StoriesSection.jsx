import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  X, 
  Sparkles, 
  Leaf, 
  ShieldCheck, 
  Award,
  ChevronRight 
} from 'lucide-react';
import { INITIAL_STORIES } from '../data/mockData';

export default function StoriesSection({ language }) {
  const [activeStory, setActiveStory] = useState(null);

  // Add the legendary Tigress Kanan story to complete the 4 core stories
  const stories = [
    ...INITIAL_STORIES,
    {
      id: 4,
      title: "The Legend of Tigress Kanan: The Wild Cat Who Chose Nandankanan",
      slug: "legend-of-tigress-kanan",
      category: "Wild Lore & Heritage",
      cover_image: "/images/royal_bengal_tiger.jpg",
      author: "Forest Heritage Archives, 1967",
      read_time: "4 min read",
      summary: "In 1967, a wild tigress roaming Chandaka forests leaped over the 18-foot high enclosure fence into Nandankanan, choosing captivity alongside a captive tiger.",
      content: `In the annals of zoological history, the story of Tigress 'Kanan' remains unparalleled. In the summer of 1967, Nandankanan was a young zoological park nestled against the wild Chandaka forests.

A wild female Bengal tiger began frequenting the perimeter of the tiger enclosure at night, drawn by the roaring of captive male tiger 'Pradeep'. Zoo officials constructed a massive 18-foot trench and heightened the fences. Yet on the night of July 23, 1967, Kanan made an astounding leap over the 18-foot barrier directly into the open enclosure to join Pradeep.

She voluntarily surrendered her wild freedom to remain within Nandankanan's grounds. Today, she is honored with a memorial monument inside the sanctuary, symbolizing the magnetic, untamable spirit of Odisha's wild predators.`,
      featured: true
    }
  ];

  return (
    <section id="stories" className="py-28 bg-[#0B2A1A] text-[#F4F1E8] relative z-20 overflow-hidden">
      
      {/* Background Subtle Forest Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#14532D]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#2E7D32]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F28C1B]" />
              <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#F28C1B] font-bold">
                {language === 'odia' ? 'ସଂରକ୍ଷଣ ଓ ଐତିହ୍ୟ କାହାଣୀ' : 'EDITORIAL CHRONICLES'}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1E8] leading-tight">
              Animal Stories & Rescue. <br />
              <span className="font-editorial italic font-normal text-[#A7D7A9]">
                {language === 'odia' ? 'ପ୍ରତ୍ୟେକ ପ୍ରାଣୀର ଏକ ଅନନ୍ୟ କାହାଣୀ।' : 'Every life has a destiny.'}
              </span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#A7D7A9]/90 max-w-md font-light leading-relaxed">
            {language === 'odia'
              ? 'ନନ୍ଦନକାନନର ଅଗ୍ରଣୀ ପ୍ରଜନନ ସଫଳତା, ବନ୍ୟପ୍ରାଣୀ ଚିକିତ୍ସା ଓ କାଳଜୟୀ ଐତିହ୍ୟର ସତ୍ୟ କାହାଣୀ।'
              : 'Pioneering breeding breakthroughs, midnight wildlife rescues, and tales that permanently altered global conservation biology.'}
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Hero Story (Span 7 cols) */}
          <div 
            onClick={() => setActiveStory(stories[0])}
            className="lg:col-span-7 group rounded-3xl bg-[#14532D]/40 border border-white/10 overflow-hidden shadow-2xl hover:border-[#F28C1B]/60 transition-all duration-500 cursor-pointer flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
              <img
                src={stories[0].cover_image}
                alt={stories[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2A1A] via-transparent to-black/30" />
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F28C1B] text-[#0B2A1A] shadow-md">
                  {stories[0].category}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[11px] font-mono text-[#A7D7A9] flex items-center gap-1.5 mb-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {stories[0].read_time} • {stories[0].author}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white group-hover:text-[#F28C1B] transition-colors leading-snug">
                  {stories[0].title}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex items-center justify-between">
              <p className="text-xs sm:text-sm text-[#F4F1E8]/80 font-light line-clamp-2 max-w-lg">
                {stories[0].summary}
              </p>
              <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-[#F28C1B] text-white group-hover:text-[#0B2A1A] flex items-center justify-center transition-all flex-shrink-0 ml-4">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Secondary Stack (Span 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {stories.slice(1, 4).map((story) => (
              <div
                key={story.id}
                onClick={() => setActiveStory(story)}
                className="group rounded-2xl bg-[#14532D]/30 border border-white/10 p-5 hover:bg-[#14532D]/60 hover:border-[#A7D7A9]/40 transition-all cursor-pointer flex items-center gap-5 shadow-lg"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-black/40">
                  <img
                    src={story.cover_image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#F28C1B] block mb-1">
                    {story.category}
                  </span>
                  <h4 className="text-sm sm:text-base font-serif font-bold text-white group-hover:text-[#A7D7A9] transition-colors line-clamp-2 leading-snug mb-1">
                    {story.title}
                  </h4>
                  <span className="text-[11px] text-[#A7D7A9]/80 font-light flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {story.read_time}
                  </span>
                </div>

                <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Story Reader Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#FAF8F5] text-[#0B2A1A] rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto border border-[#14532D]/20 shadow-2xl relative">
            
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 text-[#0B2A1A] flex items-center justify-center transition-transform hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 sm:h-72 w-full bg-black">
              <img
                src={activeStory.cover_image}
                alt={activeStory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F28C1B] text-[#0B2A1A] inline-block mb-2">
                  {activeStory.category}
                </span>
                <h3 className="text-2xl sm:text-4xl font-serif font-bold leading-tight">
                  {activeStory.title}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-10">
              <div className="flex items-center justify-between text-xs text-[#75887D] font-mono pb-6 mb-6 border-b border-black/10">
                <span>By {activeStory.author}</span>
                <span>{activeStory.read_time}</span>
              </div>

              <div className="text-sm sm:text-base text-[#354035] font-light leading-relaxed space-y-4 whitespace-pre-line">
                {activeStory.content}
              </div>

              <div className="mt-8 pt-6 border-t border-black/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#14532D]">
                  <Leaf className="w-4 h-4 text-[#2E7D32]" />
                  <span>Nandankanan Conservation Archives</span>
                </div>
                <button
                  onClick={() => setActiveStory(null)}
                  className="px-6 py-2.5 rounded-full bg-[#14532D] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2E7D32] transition-colors"
                >
                  Close Story
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}

