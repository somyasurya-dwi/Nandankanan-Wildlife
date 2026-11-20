import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Compass, 
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
  ExternalLink
} from 'lucide-react';
import { 
  playTigerRoar, 
  playLionRoar, 
  playElephantTrumpet, 
  playPeafowlCry, 
  playDeerCall, 
  playBearGrunt 
} from '../utils/audioSynthesizer';

export default function ExploreAnimals({ animals, onSponsorAnimal }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeAnimalModal, setActiveAnimalModal] = useState(null);

  const categories = ['All', 'Mammals', 'Birds', 'Reptiles', 'Aquatic Animals'];
  const statuses = ['All', 'Critically Endangered', 'Endangered', 'Vulnerable', 'Least Concern'];

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      const matchesSearch = 
        animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.scientific_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.habitat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.diet.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'All' || 
        animal.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesStatus = 
        selectedStatus === 'All' || 
        animal.conservation_status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [animals, searchQuery, selectedCategory, selectedStatus]);

  const playAnimalAudio = (audioType) => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critically Endangered': return 'bg-red-950/80 text-red-300 border-red-500/40';
      case 'Endangered': return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'Vulnerable': return 'bg-yellow-950/80 text-yellow-300 border-yellow-500/40';
      default: return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <section id="explore-animals" className="py-24 bg-[#0B2A1A] text-[#F5F4EA] relative overflow-hidden">
      
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-[#14532D]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#2E7D32]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#123D2B]/80 border border-[#C8A96B]/40 mb-3 shadow-md">
            <Compass className="w-3.5 h-3.5 text-[#C8A96B]" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C8A96B]">
              Faunal Diversity & Taxonomy
            </span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl tracking-wide text-[#F5F4EA]">
            EXPLORE OUR <span className="text-[#C8A96B]">SANCTUARY SPECIES</span>
          </h2>

          <p className="mt-3 text-[#F5F4EA]/80 text-sm sm:text-base font-light">
            Immerse yourself in Nandankanan's rich biodiversity—home to over 150 species including 
            legendary royal Bengal tigers, white tigers, critically endangered gharials, and rescued wildlife.
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-[#071D12]/90 rounded-2xl p-5 border border-[#26734D]/50 shadow-2xl backdrop-blur-md mb-12">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C8A96B]" />
              <input
                type="text"
                placeholder="Search by animal name, scientific name, habitat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B2A1A] border border-[#26734D]/60 text-xs sm:text-sm text-[#F5F4EA] focus:outline-none focus:border-[#C8A96B] focus:ring-1 focus:ring-[#C8A96B] transition-all placeholder:text-[#F5F4EA]/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F5F4EA]/50 hover:text-[#F5F4EA] text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#C8A96B] text-[#123D2B] font-black shadow-lg shadow-[#C8A96B]/25'
                      : 'bg-[#0B2A1A] text-[#F5F4EA]/80 hover:bg-[#123D2B] border border-[#26734D]/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* Secondary filter: Conservation status */}
          <div className="mt-4 pt-4 border-t border-[#26734D]/30 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#C8A96B] font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              IUCN Status:
            </span>
            {statuses.map((stat) => (
              <button
                key={stat}
                onClick={() => setSelectedStatus(stat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  selectedStatus === stat
                    ? 'bg-[#C8A96B] text-[#123D2B] font-bold'
                    : 'text-[#F5F4EA]/70 hover:bg-[#123D2B]'
                }`}
              >
                {stat}
              </button>
            ))}
          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#F5F4EA]/60 font-medium mb-6 px-1">
          <span>Showing {filteredAnimals.length} species conserved at Nandankanan</span>
          {filteredAnimals.length === 0 && (
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedStatus('All'); }}
              className="text-[#C8A96B] font-semibold hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Animal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAnimals.map((animal) => (
            <div
              key={animal.id}
              className="group rounded-2xl bg-[#123D2B]/70 border border-[#26734D]/50 hover:border-[#C8A96B]/60 overflow-hidden flex flex-col shadow-xl hover:shadow-2xl hover:shadow-[#C8A96B]/10 hover:-translate-y-1.5 transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#071D12]">
                <img
                  src={animal.photo_url}
                  alt={animal.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Status and Category Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#071D12]/90 text-[#F5F4EA] backdrop-blur-md border border-[#C8A96B]/40">
                    {animal.category}
                  </span>
                  {animal.featured && (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#C8A96B] text-[#123D2B] flex items-center gap-1 shadow-md font-bold">
                      <Sparkles className="w-2.5 h-2.5" />
                      Featured
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${getStatusColor(animal.conservation_status)}`}>
                    {animal.conservation_status}
                  </span>
                </div>

                {/* Quick Audio Roar Button on Card */}
                {animal.audio_type && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playAnimalAudio(animal.audio_type);
                    }}
                    className="absolute bottom-3 right-3 p-2.5 rounded-full bg-[#071D12]/90 hover:bg-[#C8A96B] text-[#C8A96B] hover:text-[#123D2B] border border-[#C8A96B]/40 shadow-lg backdrop-blur-md transition-all hover:scale-110"
                    title={`Listen to ${animal.name} vocalization`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#F5F4EA]/60 mb-1">
                    <span className="font-editorial italic text-[#C8A96B] font-semibold text-xs">
                      {animal.scientific_name}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-[#F5F4EA]/60">
                      <MapPin className="w-3 h-3 text-[#C8A96B]" />
                      {animal.habitat.split(',')[0]}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-2xl text-[#F5F4EA] group-hover:text-[#C8A96B] transition-colors">
                    {animal.name}
                  </h3>

                  <p className="mt-2.5 text-xs text-[#F5F4EA]/75 line-clamp-3 leading-relaxed">
                    {animal.short_description}
                  </p>
                </div>

                {/* Card Action Area */}
                <div className="mt-6 pt-4 border-t border-[#26734D]/40 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSponsorAnimal && onSponsorAnimal(animal)}
                    className="text-xs font-bold text-[#C8A96B] hover:text-white flex items-center gap-1 hover:underline"
                  >
                    <HeartHandshake className="w-3.5 h-3.5 text-[#C8A96B]" />
                    <span>Sponsor Animal</span>
                  </button>

                  <button
                    onClick={() => setActiveAnimalModal(animal)}
                    className="px-4 py-2 rounded-xl bg-[#26734D] hover:bg-[#2E7D32] text-[#F5F4EA] font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1 shadow-md hover:shadow-lg border border-[#C8A96B]/30"
                  >
                    <span>Explore More</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Comprehensive Individual Animal Profile Modal */}
      {activeAnimalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#071D12]/90 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-[#0B2A1A] border border-[#C8A96B]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-[#F5F4EA]">
            
            {/* Modal Header Bar with Close Button */}
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setActiveAnimalModal(null)}
                className="p-2.5 rounded-full bg-[#071D12]/80 hover:bg-[#123D2B] text-[#F5F4EA] border border-[#C8A96B]/30 transition-all shadow-xl"
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
                    <span className="px-3 py-1 rounded-md bg-[#123D2B]/90 text-xs font-bold uppercase tracking-wider text-[#C8A96B] border border-[#C8A96B]/40">
                      {activeAnimalModal.category}
                    </span>
                    <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getStatusColor(activeAnimalModal.conservation_status)}`}>
                      IUCN: {activeAnimalModal.conservation_status}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F5F4EA]">
                    {activeAnimalModal.name}
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
                  <div className="p-4 rounded-2xl bg-[#123D2B]/80 border border-[#26734D]/40 shadow-sm">
                    <div className="flex items-center gap-2 text-[#C8A96B] text-xs font-bold uppercase tracking-wider mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C8A96B]" />
                      Habitat
                    </div>
                    <div className="text-xs font-medium text-[#F5F4EA]/90 leading-snug">
                      {activeAnimalModal.habitat}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#123D2B]/80 border border-[#26734D]/40 shadow-sm">
                    <div className="flex items-center gap-2 text-[#C8A96B] text-xs font-bold uppercase tracking-wider mb-1">
                      <Utensils className="w-3.5 h-3.5 text-[#C8A96B]" />
                      Diet & Feeding
                    </div>
                    <div className="text-xs font-medium text-[#F5F4EA]/90 leading-snug">
                      {activeAnimalModal.diet}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#123D2B]/80 border border-[#26734D]/40 shadow-sm">
                    <div className="flex items-center gap-2 text-[#C8A96B] text-xs font-bold uppercase tracking-wider mb-1">
                      <Scale className="w-3.5 h-3.5 text-[#C8A96B]" />
                      Adult Weight
                    </div>
                    <div className="text-xs font-medium text-[#F5F4EA]/90 leading-snug">
                      {activeAnimalModal.weight_range}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#123D2B]/80 border border-[#26734D]/40 shadow-sm">
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
                  <div className="p-5 rounded-2xl bg-[#123D2B]/90 text-[#F5F4EA] border border-[#C8A96B]/40">
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

                {/* Audio Experience & Sponsorship Actions */}
                <div className="pt-4 border-t border-[#26734D]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    onClick={() => playAnimalAudio(activeAnimalModal.audio_type)}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#123D2B] hover:bg-[#1B5039] text-[#F5F4EA] hover:text-[#C8A96B] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-[#26734D]/40"
                  >
                    <Volume2 className="w-4 h-4 text-[#C8A96B]" />
                    <span>Play Animal Sound</span>
                  </button>

                  <button
                    onClick={() => {
                      const animal = activeAnimalModal;
                      setActiveAnimalModal(null);
                      onSponsorAnimal && onSponsorAnimal(animal);
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C8A96B] to-[#b39352] hover:from-[#d8b87a] hover:to-[#C8A96B] text-[#123D2B] font-black text-xs uppercase tracking-widest shadow-lg shadow-[#C8A96B]/20 transition-all flex items-center justify-center gap-2"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>Sponsor {activeAnimalModal.name}</span>
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

