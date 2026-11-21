import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Compass, 
  Tv, 
  HeartHandshake, 
  X, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Scale, 
  Utensils, 
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const SANCTUARY_CATEGORIES = [
  { key: 'All', label: 'All Species', emoji: '🐾', count: 18 },
  { key: 'Mammals', label: 'Mammals', title: 'Mammals & Big Cats', emoji: '🐅', count: 7 },
  { key: 'Birds', label: 'Birds', title: 'Avian Sanctuary & Birds', emoji: '🦚', count: 5 },
  { key: 'Reptiles', label: 'Reptiles', title: 'Reptiles & Crocodilians', emoji: '🐊', count: 3 },
  { key: 'Semi-Aquatic Animals', label: 'Aquatic', title: 'Aquatic & Semi-Aquatic Wildlife', emoji: '🌊', count: 3 }
];

export default function ExploreAnimals({ animals = [], onSponsorAnimal }) {
  const { t, getAnimalName, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeAnimalModal, setActiveAnimalModal] = useState(null);

  // Category matching helper
  const matchesCat = (animalCat, targetCat) => {
    if (targetCat === 'All') return true;
    if (!animalCat) return false;
    if (targetCat.toLowerCase().includes('aquatic') || targetCat === 'Semi-Aquatic Animals') {
      return animalCat.toLowerCase().includes('aquatic');
    }
    return animalCat.toLowerCase() === targetCat.toLowerCase();
  };

  // Filtered animals based on search query & category
  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = 
        !query ||
        animal.name.toLowerCase().includes(query) ||
        animal.scientific_name.toLowerCase().includes(query) ||
        animal.habitat.toLowerCase().includes(query) ||
        animal.diet.toLowerCase().includes(query) ||
        (animal.group && animal.group.toLowerCase().includes(query)) ||
        (animal.category && animal.category.toLowerCase().includes(query));
      
      const categoryMatch = matchesCat(animal.category, selectedCategory);

      return matchesSearch && categoryMatch;
    });
  }, [animals, searchQuery, selectedCategory]);

  // Animals grouped for the default "All" view
  const categorizedGroups = useMemo(() => {
    return SANCTUARY_CATEGORIES.filter((c) => c.key !== 'All').map((cat) => {
      const groupAnimals = animals.filter((a) => matchesCat(a.category, cat.key));
      return {
        ...cat,
        animals: groupAnimals
      };
    });
  }, [animals]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critically Endangered': return 'bg-red-950/80 text-red-300 border-red-500/40';
      case 'Endangered': return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'Vulnerable': return 'bg-yellow-950/80 text-yellow-300 border-yellow-500/40';
      default: return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
    }
  };

  const getCategoryEmoji = (catName) => {
    if (!catName) return '🐾';
    const c = catName.toLowerCase();
    if (c.includes('mammal')) return '🐅';
    if (c.includes('bird')) return '🦚';
    if (c.includes('reptile')) return '🐊';
    if (c.includes('aquatic')) return '🌊';
    return '🐾';
  };

  // Render a Single Animal Card
  const renderAnimalCard = (animal) => {
    return (
      <div
        key={animal.id}
        className="group rounded-2xl bg-[#0D2619]/80 border border-[#26734D]/50 hover:border-[#C8A96B]/70 overflow-hidden flex flex-col shadow-xl hover:shadow-2xl hover:shadow-[#C8A96B]/10 hover:-translate-y-1.5 transition-all duration-500"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#071D12]">
          <img
            src={animal.photo_url}
            alt={animal.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />

          {/* Category Pill on Top-Left */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#071D12]/92 text-[#C8A96B] backdrop-blur-md border border-[#C8A96B]/40 shadow-md flex items-center gap-1.5">
              <span>{getCategoryEmoji(animal.category)}</span>
              <span>{animal.category}</span>
            </span>
          </div>

          {/* Conservation Status on Top-Right */}
          <div className="absolute top-3 right-3 z-10">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md shadow-md ${getStatusColor(animal.conservation_status)}`}>
              {animal.conservation_status}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0D2619] to-transparent pointer-events-none" />
        </div>

        {/* Card Body */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#F5F4EA]/60 mb-2">
              <span className="font-editorial italic text-[#C8A96B] font-semibold text-xs">
                {animal.scientific_name}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-[#F5F4EA]/65">
                <MapPin className="w-3 h-3 text-[#C8A96B]" />
                {animal.habitat.split(',')[0]}
              </span>
            </div>

            {/* Sub-Group / Taxonomic Classification Tag */}
            {animal.group && (
              <div className="mb-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#071D12]/90 text-[10px] font-bold tracking-wider uppercase text-[#C8A96B] border border-[#26734D]/60 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96B]" />
                  <span>{animal.group}</span>
                </span>
              </div>
            )}

            <h3 className="font-display font-bold text-2xl text-[#F5F4EA] group-hover:text-[#C8A96B] transition-colors leading-tight">
              {(getAnimalName && getAnimalName(animal)) || animal.name}
            </h3>

            <p className="mt-2.5 text-xs text-[#F5F4EA]/75 line-clamp-3 leading-relaxed">
              {animal.short_description}
            </p>
          </div>

          {/* Card Action Area */}
          <div className="mt-6 pt-4 border-t border-[#26734D]/40 flex items-center justify-between gap-2">
            <button
              onClick={() => onSponsorAnimal && onSponsorAnimal(animal)}
              className="text-xs font-bold text-[#C8A96B] hover:text-white flex items-center gap-1 hover:underline transition-colors cursor-pointer"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span>Sponsor Animal</span>
            </button>

            <button
              onClick={() => setActiveAnimalModal(animal)}
              className="px-4 py-2 rounded-xl bg-[#26734D] hover:bg-[#2E7D32] text-[#F5F4EA] font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 shadow-md hover:shadow-lg border border-[#C8A96B]/30 cursor-pointer"
            >
              <span>Explore More</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    );
  };

  const isDefaultView = selectedCategory === 'All' && !searchQuery.trim();

  return (
    <section id="explore-animals" className="py-20 sm:py-24 bg-[#071D12] text-[#F5F4EA] relative overflow-hidden scroll-mt-24 sm:scroll-mt-28">
      
      {/* Background Soft Glow Ambience */}
      <div className="absolute top-0 right-10 w-[550px] h-[550px] bg-[#14532D]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[550px] h-[550px] bg-[#2E7D32]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B2A1A] border border-[#C8A96B]/40 mb-3 shadow-md">
            <Compass className="w-3.5 h-3.5 text-[#C8A96B]" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C8A96B]">
              Faunal Diversity & Taxonomy
            </span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl tracking-wide text-[#F5F4EA]">
            EXPLORE OUR <span className="text-[#C8A96B]">SANCTUARY SPECIES</span>
          </h2>

          <p className="mt-3 text-[#F5F4EA]/80 text-sm sm:text-base font-light">
            Discover Nandankanan's iconic wildlife species across Mammals, Birds, Reptiles, and Aquatic wildlife.
          </p>
        </div>

        {/* LUXURY FROSTED GLASS CATEGORY DOCK & SEARCH BAR */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-12">
          
          {/* Frosted Glass Segmented Category Capsule Dock (No-Scrollbar Guaranteed) */}
          <div className="p-1.5 rounded-full bg-[#05180F]/85 backdrop-blur-2xl border border-[#C8A96B]/25 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex items-center gap-1.5 overflow-x-auto max-w-full no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {SANCTUARY_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.key);
                    setSearchQuery('');
                  }}
                  className={`flex items-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm transition-all duration-300 whitespace-nowrap cursor-pointer select-none ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#C8A96B] via-[#E5CE9E] to-[#C8A96B] text-[#071D12] font-black shadow-[0_4px_20px_rgba(200,169,107,0.4)] scale-[1.02]'
                      : 'text-[#F5F4EA]/80 hover:text-white hover:bg-white/5 font-medium'
                  }`}
                >
                  <span className="text-base sm:text-lg filter drop-shadow-sm">{cat.emoji}</span>
                  <span className="tracking-wide">{cat.label}</span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold transition-colors ${
                    isSelected 
                      ? 'bg-[#071D12]/20 text-[#071D12] border border-black/10' 
                      : 'bg-[#071D12]/80 text-[#C8A96B] border border-[#C8A96B]/30'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sleek Frosted Glass Search Capsule */}
          <div className="relative w-full lg:w-80 shrink-0">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-4 text-[#C8A96B] pointer-events-none" />
              <input
                type="text"
                placeholder="Search sanctuary species..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-2.5 sm:py-3 rounded-full bg-[#05180F]/85 backdrop-blur-2xl border border-[#C8A96B]/25 text-xs sm:text-sm text-[#F5F4EA] focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/25 shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all placeholder:text-[#F5F4EA]/45"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 p-1 rounded-full text-[#F5F4EA]/50 hover:text-white hover:bg-white/10 text-xs transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* SPECIES CARDS GRID */}
        {isDefaultView ? (
          /* DEFAULT VIEW: CLEAN CATEGORY SECTIONS */
          <div className="space-y-14">
            {categorizedGroups.map((cat) => (
              <div key={cat.key} className="space-y-6">
                
                {/* Editorial Section Divider */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#C8A96B]/20">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl filter drop-shadow">{cat.emoji}</span>
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-[#F5F4EA] tracking-wide">
                      {cat.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-[#05180F] text-[#C8A96B] font-mono font-bold text-xs border border-[#C8A96B]/30 shadow-sm">
                      {cat.animals.length} Species
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(cat.key)}
                      className="text-xs font-bold text-[#C8A96B] hover:text-white flex items-center gap-1 transition-colors cursor-pointer group"
                    >
                      <span>View only {cat.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* 3-Column Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {cat.animals.map((animal) => renderAnimalCard(animal))}
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* FILTERED CATEGORY OR SEARCH VIEW */
          <div>
            <div className="flex items-center justify-between text-xs text-[#F5F4EA]/70 font-medium mb-6 px-1">
              <span>Showing {filteredAnimals.length} species {selectedCategory !== 'All' ? `in ${selectedCategory}` : ''}</span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[#C8A96B] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Show All Categories</span>
              </button>
            </div>

            {filteredAnimals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAnimals.map((animal) => renderAnimalCard(animal))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#0B2A1A]/40 border border-[#26734D]/40 rounded-2xl p-8 max-w-lg mx-auto">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#0B2A1A] border border-[#C8A96B]/40 flex items-center justify-center text-[#C8A96B] mb-3">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#F5F4EA]">No matching species</h3>
                <p className="text-xs text-[#F5F4EA]/70 mt-1 max-w-sm mx-auto">
                  No animal records match your search. Nandankanan exhibits are continuously updated.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-5 px-4 py-2 rounded-xl bg-[#C8A96B] text-[#071D12] text-xs font-bold uppercase tracking-wider hover:bg-[#d8bc7f] transition-all shadow-md cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Comprehensive Individual Animal Profile Modal */}
      {activeAnimalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#071D12]/90 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-[#0B2A1A] border border-[#C8A96B]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-[#F5F4EA]">
            
            {/* Modal Header Bar with Close Button */}
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setActiveAnimalModal(null)}
                className="p-2.5 rounded-full bg-[#071D12]/80 hover:bg-[#123D2B] text-[#F5F4EA] border border-[#C8A96B]/30 transition-all shadow-xl cursor-pointer"
                aria-label="Close animal details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto">
              {/* Large Photograph Banner */}
              <div className="relative h-72 sm:h-96 w-full bg-[#071D12] overflow-hidden">
                <img
                  src={activeAnimalModal.photo_url}
                  alt={activeAnimalModal.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2A1A] via-[#0B2A1A]/40 to-transparent" />

                {/* Floating Bio Summary over Image */}
                <div className="absolute bottom-6 left-6 right-6 text-[#F5F4EA]">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-md bg-[#123D2B]/90 text-xs font-bold uppercase tracking-wider text-[#C8A96B] border border-[#C8A96B]/40 flex items-center gap-1.5">
                      <span>{getCategoryEmoji(activeAnimalModal.category)}</span>
                      <span>Category: {activeAnimalModal.category}</span>
                    </span>
                    {activeAnimalModal.group && (
                      <span className="px-3 py-1 rounded-md bg-[#071D12]/90 text-xs font-semibold uppercase tracking-wider text-[#F5F4EA]/90 border border-[#26734D]">
                        Group: {activeAnimalModal.group}
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getStatusColor(activeAnimalModal.conservation_status)}`}>
                      IUCN: {activeAnimalModal.conservation_status}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F5F4EA]">
                    {(getAnimalName && getAnimalName(activeAnimalModal)) || activeAnimalModal.name}
                  </h3>
                  <p className="font-editorial italic text-[#C8A96B] text-base sm:text-lg mt-0.5">
                    {activeAnimalModal.scientific_name}
                  </p>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-8 bg-[#0B2A1A]">
                
                {/* Key Ecological Parameters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-[#071D12]/80 border border-[#26734D]/40 shadow-sm">
                    <div className="flex items-center gap-2 text-[#C8A96B] text-xs font-bold uppercase tracking-wider mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C8A96B]" />
                      Habitat
                    </div>
                    <div className="text-xs font-medium text-[#F5F4EA]/90 leading-snug">
                      {activeAnimalModal.habitat}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#071D12]/80 border border-[#26734D]/40 shadow-sm">
                    <div className="flex items-center gap-2 text-[#C8A96B] text-xs font-bold uppercase tracking-wider mb-1">
                      <Utensils className="w-3.5 h-3.5 text-[#C8A96B]" />
                      Diet & Feeding
                    </div>
                    <div className="text-xs font-medium text-[#F5F4EA]/90 leading-snug">
                      {activeAnimalModal.diet}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#071D12]/80 border border-[#26734D]/40 shadow-sm">
                    <div className="flex items-center gap-2 text-[#C8A96B] text-xs font-bold uppercase tracking-wider mb-1">
                      <Scale className="w-3.5 h-3.5 text-[#C8A96B]" />
                      Adult Weight
                    </div>
                    <div className="text-xs font-medium text-[#F5F4EA]/90 leading-snug">
                      {activeAnimalModal.weight_range}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#071D12]/80 border border-[#26734D]/40 shadow-sm">
                    <div className="flex items-center gap-2 text-[#C8A96B] text-xs font-bold uppercase tracking-wider mb-1">
                      <Clock className="w-3.5 h-3.5 text-[#C8A96B]" />
                      Typical Lifespan
                    </div>
                    <div className="text-xs font-medium text-[#F5F4EA]/90 leading-snug">
                      {activeAnimalModal.lifespan}
                    </div>
                  </div>
                </div>

                {/* Full Biography */}
                <div>
                  <h4 className="font-display font-bold text-lg text-[#F5F4EA] mb-2">
                    Species Biography & Nandankanan Context
                  </h4>
                  <p className="text-xs sm:text-sm text-[#F5F4EA]/80 leading-relaxed">
                    {activeAnimalModal.full_bio}
                  </p>
                </div>

                {/* Fascinating Facts */}
                {activeAnimalModal.fun_facts && activeAnimalModal.fun_facts.length > 0 && (
                  <div className="p-5 rounded-2xl bg-[#071D12]/90 text-[#F5F4EA] border border-[#C8A96B]/40">
                    <h4 className="font-display font-bold text-base text-[#C8A96B] mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C8A96B]" />
                      Fascinating Wildlife Facts
                    </h4>
                    <ul className="space-y-2">
                      {activeAnimalModal.fun_facts.map((fact, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-[#F5F4EA]/90">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A96B] shrink-0 mt-0.5" />
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Available Video Footage Preview */}
                {activeAnimalModal.video_url && (
                  <div>
                    <h4 className="font-display font-bold text-base text-[#F5F4EA] mb-3 flex items-center gap-2">
                      <Tv className="w-4 h-4 text-[#C8A96B]" />
                      Sanctuary Observation Footage
                    </h4>
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-[#26734D]/40 shadow-md">
                      <video
                        src={activeAnimalModal.video_url}
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Sponsorship Actions */}
                <div className="pt-4 border-t border-[#26734D]/30 flex flex-col sm:flex-row items-center justify-end gap-4">
                  <button
                    onClick={() => {
                      const animal = activeAnimalModal;
                      setActiveAnimalModal(null);
                      onSponsorAnimal && onSponsorAnimal(animal);
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C8A96B] to-[#b39352] hover:from-[#d8b87a] hover:to-[#C8A96B] text-[#071D12] font-black text-xs uppercase tracking-widest shadow-lg shadow-[#C8A96B]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>Sponsor {(getAnimalName && getAnimalName(activeAnimalModal)) || activeAnimalModal.name}</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
