import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  Volume2,
  Tv,
  HeartHandshake,
  X,
  Sparkles,
  CheckCircle2,
  MapPin,
  Activity,
  Clock,
  Scale,
  Utensils,
  ShieldAlert,
  ChevronRight,
  Info
} from 'lucide-react';
import { INITIAL_ANIMALS } from '../data/mockData';
import {
  playTigerRoar,
  playLionRoar,
  playElephantTrumpet,
  playPeafowlCry,
  playDeerCall,
  playBearGrunt
} from '../utils/audioSynthesizer';

export default function SpeciesGridSection({ language, onOpenTickets }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const categories = ['All', 'Mammals', 'Birds', 'Reptiles', 'Semi-Aquatic Animals'];

  const filteredAnimals = useMemo(() => {
    return INITIAL_ANIMALS.filter((animal) => {
      const matchesSearch =
        animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.scientific_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.habitat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.diet.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' ||
        animal.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory.toLowerCase().includes('aquatic') && animal.category.toLowerCase().includes('aquatic'));

      const matchesStatus =
        selectedStatus === 'All' ||
        animal.conservation_status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

  const playAudio = (audioType) => {
    switch (audioType) {
      case 'tiger': playTigerRoar(); break;
      case 'lion': playLionRoar(); break;
      case 'elephant': playElephantTrumpet(); break;
      case 'peafowl': playPeafowlCry(); break;
      case 'deer': playDeerCall(); break;
      case 'bear': playBearGrunt(); break;
      default: playTigerRoar(); break;
    }
  };

  const whiteTiger = INITIAL_ANIMALS.find(a => a.slug === 'white-bengal-tiger') || INITIAL_ANIMALS[1];

  return (
    <section id="animals" className="py-28 bg-[#0B2A1A] text-[#F4F1E8] relative z-20 overflow-hidden">

      {/* Background Soft Emerald Glow */}
      <div className="absolute top-0 right-10 w-[600px] h-[600px] bg-[#14532D]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#2E7D32]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F28C1B]" />
              <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#F28C1B] font-bold">
                {language === 'odia' ? 'ଜୀବ ବିବିଧତା ଓ ପରିବେଶ' : 'ENCYCLOPAEDIA OF SPECIES'}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white leading-tight">
              Fauna of Nandankanan. <br />
              <span className="font-editorial italic font-normal text-[#A7D7A9]">
                {language === 'odia' ? 'ପ୍ରାକୃତିକ ନିବାସର ସୁରକ୍ଷିତ ବାତାବରଣ।' : 'Guardians of wild heritage.'}
              </span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#A7D7A9]/90 max-w-md font-light leading-relaxed">
            {language === 'odia'
              ? 'ନନ୍ଦନକାନନ ପ୍ରାଣୀ ଉଦ୍ୟାନରେ ୧୫୬ରୁ ଅଧିକ ବିଲୁପ୍ତପ୍ରାୟ ଜାତିର ବନ୍ୟପ୍ରାଣୀ ସଂରକ୍ଷିତ ହୋଇ ରହିଛନ୍ତି।'
              : 'Home to over 156 rare species thriving across 437 hectares of natural deciduous jungle, moist woodland, and freshwater wetlands.'}
          </p>
        </div>

        {/* Featured Spotlight Banner: White Bengal Tiger */}
        <div className="mb-16 rounded-3xl overflow-hidden bg-gradient-to-br from-[#071D12] via-[#0E3B24] to-[#071D12] text-[#F4F1E8] p-8 sm:p-12 shadow-2xl relative group border border-[#2E7D32]/40">
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 opacity-35 lg:opacity-60 overflow-hidden pointer-events-none">
            <img
              src={whiteTiger.photo_url}
              alt={whiteTiger.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071D12] via-[#071D12]/80 to-transparent lg:block hidden" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-mono uppercase tracking-[0.2em] text-[#A7D7A9] mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#F28C1B]" />
              <span>World Zoological Heritage</span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3">
              The Legend of the White Tiger
            </h3>
            <p className="text-xs sm:text-sm text-[#A7D7A9] font-mono italic mb-4">
              {whiteTiger.scientific_name} • First Born to Normal Parents in 1980
            </p>
            <p className="text-sm sm:text-base text-[#F4F1E8]/85 font-light leading-relaxed mb-8 max-w-xl">
              Nandankanan made global history in 1980 when tawny Royal Bengal tigers Deepak and Ganga
              gave birth to the world’s first captive-bred white tiger litter, establishing the sanctuary as
              the planetary cradle of healthy white tiger conservation.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setSelectedAnimal(whiteTiger)}
                className="px-6 py-3.5 rounded-full bg-[#F28C1B] hover:bg-[#e07d10] text-[#071D12] font-bold text-xs uppercase tracking-[0.16em] transition-all shadow-lg flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                <span>Read Full Archive</span>
              </button>

              <button
                onClick={() => playAudio('tiger')}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-[#F4F1E8] border border-white/20 font-semibold text-xs uppercase tracking-[0.16em] transition-all flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4 text-[#F28C1B]" />
                <span>Listen to Roar</span>
              </button>

              <a
                href="#live"
                className="text-xs text-[#A7D7A9] hover:text-white uppercase tracking-[0.14em] font-semibold flex items-center gap-1.5 px-3 py-3"
              >
                <Tv className="w-3.5 h-3.5 text-red-400" />
                <span>Watch Live Cam</span>
              </a>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls (Deep Forest Styled) */}
        <div className="bg-[#071D12]/90 rounded-2xl p-5 border border-[#2E7D32]/40 shadow-xl mb-10 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A7D7A9]" />
            <input
              type="text"
              placeholder="Search by animal name, species, habitat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B2A1A] border border-[#2E7D32]/40 text-xs sm:text-sm text-white focus:outline-none focus:border-[#F28C1B] transition-all placeholder:text-[#A7D7A9]/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A7D7A9] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${selectedCategory === cat
                  ? 'bg-[#2E7D32] text-white shadow-md'
                  : 'bg-[#0B2A1A] text-[#A7D7A9] hover:bg-[#14532D] border border-[#2E7D32]/30'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Animals Grid (Deep Emerald Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto">
          {filteredAnimals.map((animal) => {
            const isWhiteTiger = animal.slug === 'white-bengal-tiger';
            return (
              <div
                key={animal.id}
                onClick={() => setSelectedAnimal(animal)}
                className={`group rounded-2xl bg-[#071D12]/95 border border-gold-500/60 hover:border-gold-400 hover:ring-2 hover:ring-gold-400/80 overflow-hidden shadow-xl shadow-gold-950/20 hover:shadow-2xl hover:shadow-gold-500/30 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between ${isWhiteTiger ? 'ring-2 ring-gold-400' : ''
                  }`}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                  <img
                    src={animal.photo_url}
                    alt={animal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wider bg-[#071D12]/90 text-[#A7D7A9] border border-[#2E7D32]/40 backdrop-blur-md">
                      {animal.category}
                    </span>
                    {isWhiteTiger && (
                      <span className="px-2 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wider bg-[#F28C1B] text-[#071D12]">
                        Heritage
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2 right-2">
                    <span className="px-2 py-0.5 rounded text-[8.5px] font-semibold bg-[#0B2A1A]/90 text-[#A7D7A9] border border-white/10 backdrop-blur-md shadow-sm">
                      {animal.conservation_status}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base sm:text-lg font-serif font-bold text-white group-hover:text-[#F28C1B] transition-colors mb-0.5">
                      {animal.name}
                    </h4>
                    <p className="text-[11px] text-[#A7D7A9] font-mono italic mb-1.5">
                      {animal.scientific_name}
                    </p>
                    <p className="text-xs text-[#F4F1E8]/75 line-clamp-2 font-light leading-relaxed mb-2">
                      {animal.short_description}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[#A7D7A9]">
                    <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1 group-hover:text-white text-xs">
                      <span>View Profile</span>
                      <span>→</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(animal.audio_type);
                      }}
                      className="p-1.5 rounded-full hover:bg-white/10 text-[#F28C1B] transition-colors"
                      title="Play Sound"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Species Detail Modal (Dark Sanctuary Theme - Portaled to document.body) */}
      {selectedAnimal && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedAnimal(null);
          }}
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
        >
          <div
            className="bg-[#071D12] text-[#F4F1E8] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#2E7D32]/50 shadow-2xl relative overscroll-contain"
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent="true"
          >

            <button
              onClick={() => setSelectedAnimal(null)}
              className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-5 relative aspect-video md:aspect-auto h-64 md:h-full bg-black overflow-hidden">
                <img
                  src={selectedAnimal.photo_url}
                  alt={selectedAnimal.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071D12] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#A7D7A9] block">
                    {selectedAnimal.category}
                  </span>
                  <span className="text-xl font-serif font-bold">
                    {selectedAnimal.name}
                  </span>
                </div>
              </div>

              <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#14532D] text-[#A7D7A9] border border-[#2E7D32]/50">
                      IUCN: {selectedAnimal.conservation_status}
                    </span>
                    <button
                      onClick={() => playAudio(selectedAnimal.audio_type)}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F28C1B]/20 text-[#F28C1B] border border-[#F28C1B]/30 flex items-center gap-1.5 hover:bg-[#F28C1B]/30"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#F28C1B]" />
                      <span>Roar / Cry</span>
                    </button>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1">
                    {selectedAnimal.name}
                  </h3>
                  <p className="text-xs text-[#A7D7A9] font-mono italic mb-4">
                    {selectedAnimal.scientific_name}
                  </p>

                  <p className="text-xs sm:text-sm text-[#F4F1E8]/85 leading-relaxed mb-6 font-light">
                    {selectedAnimal.full_bio}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6 bg-[#0B2A1A] p-4 rounded-2xl border border-white/10 text-xs">
                    <div>
                      <span className="text-[#A7D7A9] block text-[10px] uppercase font-mono">Habitat</span>
                      <span className="font-semibold text-white">{selectedAnimal.habitat}</span>
                    </div>
                    <div>
                      <span className="text-[#A7D7A9] block text-[10px] uppercase font-mono">Diet</span>
                      <span className="font-semibold text-white">{selectedAnimal.diet}</span>
                    </div>
                    <div>
                      <span className="text-[#A7D7A9] block text-[10px] uppercase font-mono">Lifespan</span>
                      <span className="font-semibold text-white">{selectedAnimal.lifespan}</span>
                    </div>
                    <div>
                      <span className="text-[#A7D7A9] block text-[10px] uppercase font-mono">Weight Range</span>
                      <span className="font-semibold text-white">{selectedAnimal.weight_range}</span>
                    </div>
                  </div>

                  {selectedAnimal.fun_facts && selectedAnimal.fun_facts.length > 0 && (
                    <div className="mb-6">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#A7D7A9] block mb-2">
                        Did You Know?
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#F4F1E8]/80">
                        {selectedAnimal.fun_facts.map((fact, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#F28C1B] font-bold">•</span>
                            <span>{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <a
                    href="#interactive-map"
                    onClick={() => setSelectedAnimal(null)}
                    className="text-xs font-semibold text-[#A7D7A9] hover:text-white flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Locate on Zoo Map</span>
                  </a>

                  <a
                    href="#live"
                    onClick={() => setSelectedAnimal(null)}
                    className="px-5 py-2.5 rounded-full bg-[#14532D] hover:bg-[#2E7D32] border border-[#2E7D32]/50 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center gap-1.5"
                  >
                    <Tv className="w-3.5 h-3.5 text-[#F28C1B]" />
                    <span>Live Cam</span>
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

    </section>
  );
}
