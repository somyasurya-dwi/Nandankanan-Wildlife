import { useLanguage } from '../context/LanguageContext';
﻿import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  Filter, 
  Compass, 
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
  ChevronDown,
  RotateCcw,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';

export const ANIMAL_CATEGORY_GROUPS = {
  Mammals: [
    'Big Cats',
    'Elephants and Large Mammals',
    'Deer and Antelopes',
    'Primates',
    'Other Mammals'
  ],
  Birds: [
    'Parrots and Parakeets',
    'Peafowl and Pheasants',
    'Water Birds',
    'Birds of Prey',
    'Other Birds'
  ],
  Reptiles: [
    'Crocodiles',
    'Snakes',
    'Lizards',
    'Turtles and Tortoises'
  ],
  'Semi-Aquatic Animals': [
    'Freshwater Fishes',
    'Aquatic Mammals',
    'Amphibians'
  ],
  'Aquatic Animals': [
    'Freshwater Fishes',
    'Aquatic Mammals',
    'Amphibians'
  ]
};

export default function ExploreAnimals({ animals = [], onSponsorAnimal }) {
  const { t, getAnimalName, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeAnimalModal, setActiveAnimalModal] = useState(null);
  const dropdownRef = useRef(null);

  const categories = ['All', 'Mammals', 'Birds', 'Reptiles', 'Semi-Aquatic Animals'];
  const statuses = ['All', 'Critically Endangered', 'Endangered', 'Vulnerable', 'Least Concern'];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Animal Modal: Scroll Lock, Lenis Smooth Scroll Pause & Navigation cleanup
  useEffect(() => {
    if (!activeAnimalModal) return;

    // 1. Prevent background page scrolling & compensate for scrollbar width shift
    const originalOverflow = document.body.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // 2. Pause Lenis smooth scroll while viewing animal modal
    if (window.__lenis) {
      window.__lenis.stop();
    }

    // 3. Close on Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveAnimalModal(null);
      }
    };

    // 4. Close on browser back/forward, hash changes, or external navigation
    const handleNavEvent = () => {
      setActiveAnimalModal(null);
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
  }, [activeAnimalModal]);

  // Helper: Retrieve category-appropriate group for an animal
  const getAnimalGroup = (animal) => {
    if (!animal?.group) return '';
    if (animal.group === 'Crocodilians') return 'Crocodiles';
    return animal.group;
  };

  // Helper: Get available animal groups and exact counts for any category
  const getCategoryGroups = (cat) => {
    if (cat === 'All') return [];
    const referenceGroups = ANIMAL_CATEGORY_GROUPS[cat] || (cat.toLowerCase().includes('aquatic') ? ANIMAL_CATEGORY_GROUPS['Semi-Aquatic Animals'] : []);
    const catAnimals = animals.filter((animal) => {
      if (!animal.category) return false;
      if (cat === 'Semi-Aquatic Animals' || cat === 'Aquatic Animals') {
        return animal.category.toLowerCase().includes('aquatic');
      }
      return animal.category.toLowerCase() === cat.toLowerCase();
    });

    const counts = {};
    catAnimals.forEach((animal) => {
      const grp = getAnimalGroup(animal);
      if (grp) counts[grp] = (counts[grp] || 0) + 1;
    });

    const result = referenceGroups.map((name) => ({
      name,
      count: counts[name] || 0
    }));

    // In case there are extra groups present in animals:
    Object.keys(counts).forEach(name => {
      if (!referenceGroups.includes(name)) {
        result.push({ name, count: counts[name] });
      }
    });

    return result;
  };

  // Filtered animals based on search query, category, animal group, and IUCN status
  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = 
        !query ||
        animal.name.toLowerCase().includes(query) ||
        animal.scientific_name.toLowerCase().includes(query) ||
        animal.habitat.toLowerCase().includes(query) ||
        animal.diet.toLowerCase().includes(query) ||
        (animal.group && animal.group.toLowerCase().includes(query));
      
      const matchesCategory = 
        selectedCategory === 'All' || 
        animal.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory.toLowerCase().includes('aquatic') && animal.category && animal.category.toLowerCase().includes('aquatic'));

      const animalGroup = getAnimalGroup(animal);
      const matchesGroup = 
        selectedCategory === 'All' ||
        selectedGroup === 'All' || 
        (animalGroup && animalGroup.toLowerCase() === selectedGroup.toLowerCase());

      const matchesStatus = 
        selectedStatus === 'All' || 
        animal.conservation_status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesCategory && matchesGroup && matchesStatus;
    });
  }, [animals, searchQuery, selectedCategory, selectedGroup, selectedStatus]);

  const handleSelectAll = () => {
    setSelectedCategory('All');
    setSelectedGroup('All');
    setOpenDropdown(null);
  };

  // 1. Direct Category Click: selects category and immediately displays animals, never opens dropdown
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setSelectedGroup('All');
    setOpenDropdown(null);
  };

  // 2. Dropdown Symbol Click: ONLY toggles the dropdown menu for selecting a specific group
  const handleToggleDropdown = (cat) => {
    setOpenDropdown((prev) => (prev === cat ? null : cat));
  };

  const handleGroupSelect = (cat, grpName) => {
    setSelectedCategory(cat);
    setSelectedGroup(grpName);
    setOpenDropdown(null);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedGroup('All');
    setSelectedStatus('All');
    setOpenDropdown(null);
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
        <div className="relative z-40 bg-[#071D12]/95 rounded-2xl p-5 border border-[#26734D]/50 shadow-2xl backdrop-blur-md mb-12">
          
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F5F4EA]/50 hover:text-[#F5F4EA] text-xs font-semibold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Options with Distinct Dropdown Symbols */}
            <div ref={dropdownRef} className="relative flex items-center gap-1.5 flex-wrap sm:flex-nowrap w-full lg:w-auto">
              
              {/* ALL Pill */}
              <button
                type="button"
                onClick={handleSelectAll}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-[#C8A96B] text-[#123D2B] font-black shadow-lg shadow-[#C8A96B]/25'
                    : 'bg-[#0B2A1A] text-[#F5F4EA]/80 hover:bg-[#123D2B] border border-[#26734D]/40'
                }`}
              >
                All
              </button>

              {/* Specific Categories with Separate Label Click & Dropdown Arrow */}
              {['Mammals', 'Birds', 'Reptiles', 'Semi-Aquatic Animals'].map((cat) => {
                const isSelected = selectedCategory === cat;
                const isOpen = openDropdown === cat;
                const groups = getCategoryGroups(cat);
                const totalInCat = groups.reduce((acc, g) => acc + g.count, 0);

                return (
                  <div key={cat} className="relative inline-flex items-center">
                    
                    {/* Unified Pill with Split Click Targets */}
                    <div className={`inline-flex items-center rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-[#C8A96B] text-[#123D2B] border-[#C8A96B] shadow-lg shadow-[#C8A96B]/25'
                        : 'bg-[#0B2A1A] text-[#F5F4EA]/80 hover:bg-[#123D2B] border border-[#26734D]/40'
                    }`}>
                      
                      {/* 1. Category Name Button: immediately shows that category, does NOT open dropdown */}
                      <button
                        type="button"
                        onClick={() => handleCategorySelect(cat)}
                        className={`pl-3.5 pr-2 py-1.5 font-bold tracking-wider hover:opacity-85 transition-opacity flex items-center gap-1.5 ${
                          isSelected ? 'text-[#123D2B] font-black' : 'text-[#F5F4EA]/90'
                        }`}
                        title={`Show all ${cat}`}
                      >
                        <span>{cat}</span>
                        {isSelected && selectedGroup !== 'All' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#123D2B]" />
                        )}
                      </button>

                      {/* Subtle divider */}
                      <span className={`w-[1px] h-3.5 self-center ${
                        isSelected ? 'bg-[#123D2B]/30' : 'bg-[#26734D]/60'
                      }`} />

                      {/* 2. Dropdown Arrow Button: ONLY opens/closes the dropdown menu */}
                      <button
                        type="button"
                        onClick={() => handleToggleDropdown(cat)}
                        className={`px-2.5 py-1.5 flex items-center justify-center hover:opacity-80 transition-all rounded-r-xl ${
                          isOpen 
                            ? (isSelected ? 'bg-[#b89858]' : 'bg-[#144730]') 
                            : ''
                        }`}
                        aria-label={`Toggle ${cat} sub-groups menu`}
                        title={`Filter ${cat} by group`}
                      >
                        <ChevronDown 
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                    </div>

                    {/* Floating Dropdown Menu: floats cleanly above all content below */}
                    {isOpen && (
                      <>
                        {/* Backdrop to close dropdown cleanly when clicking outside */}
                        <div 
                          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]" 
                          onClick={() => setOpenDropdown(null)} 
                        />
                        <div className={`absolute top-full mt-2.5 ${
                          cat === 'Semi-Aquatic Animals' || cat === 'Aquatic Animals' || cat === 'Reptiles' ? 'right-0' : 'left-0'
                        } min-w-[260px] bg-[#071D12]/98 border-2 border-[#C8A96B] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl overflow-hidden py-1.5 z-50 animate-fadeIn`}>
                          
                          <div className="px-3.5 py-2 border-b border-[#26734D]/40 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#C8A96B]">
                            <span>Select Animal Group</span>
                            <span className="text-[10px] text-[#F5F4EA]/60 font-mono">({totalInCat} verified)</span>
                          </div>

                          <div className="max-h-60 overflow-y-auto py-1">
                            {/* Option: All [Category] */}
                            <button
                              type="button"
                              onClick={() => handleGroupSelect(cat, 'All')}
                              className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                                isSelected && selectedGroup === 'All'
                                  ? 'bg-[#123D2B] text-[#C8A96B] font-bold border-l-2 border-[#C8A96B]'
                                  : 'text-[#F5F4EA]/90 hover:bg-[#123D2B] hover:text-[#C8A96B]'
                              }`}
                            >
                              <span>All {cat}</span>
                              <span className="text-[10px] opacity-60 font-mono">({totalInCat})</span>
                            </button>

                            {/* Individual Animal Groups */}
                            {groups.map((grp) => (
                              <button
                                key={grp.name}
                                type="button"
                                onClick={() => handleGroupSelect(cat, grp.name)}
                                className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                                  isSelected && selectedGroup === grp.name
                                    ? 'bg-[#123D2B] text-[#C8A96B] font-bold border-l-2 border-[#C8A96B]'
                                    : 'text-[#F5F4EA]/90 hover:bg-[#123D2B] hover:text-[#C8A96B]'
                                }`}
                              >
                                <span>{grp.name}</span>
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                  grp.count > 0 
                                    ? 'bg-[#123D2B] text-[#C8A96B]' 
                                    : 'text-[#F5F4EA]/30'
                                }`}>
                                  ({grp.count})
                                </span>
                              </button>
                            ))}
                          </div>

                        </div>
                      </>
                    )}
                  </div>
                );
              })}

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
                    ? 'bg-[#C8A96B] text-[#123D2B] font-bold shadow-md shadow-[#C8A96B]/20'
                    : 'text-[#F5F4EA]/70 hover:bg-[#123D2B]'
                }`}
              >
                {stat}
              </button>
            ))}
          </div>

        </div>

        {/* Results Counter and Active Filter Pill */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 text-xs text-[#F5F4EA]/70 font-medium mb-6 px-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span>Showing {filteredAnimals.length} species conserved at Nandankanan</span>
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#123D2B] text-[#C8A96B] text-[11px] font-bold border border-[#C8A96B]/30">
                <span>{selectedCategory}</span>
                {selectedGroup !== 'All' && (
                  <>
                    <span className="text-[#F5F4EA]/40">›</span>
                    <span className="text-white">{selectedGroup}</span>
                    <button 
                      onClick={() => setSelectedGroup('All')}
                      className="ml-0.5 hover:text-white transition-colors"
                      title="Clear group filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                )}
              </span>
            )}
          </div>
          {(selectedCategory !== 'All' || selectedGroup !== 'All' || selectedStatus !== 'All' || searchQuery) && (
            <button 
              onClick={handleResetFilters}
              className="text-[#C8A96B] font-semibold hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>

        {/* Animal Cards Grid or Empty State */}
        {filteredAnimals.length > 0 ? (
          <div id="species-grid" className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto scroll-mt-28">
            {filteredAnimals.map((animal) => {
              return (
                <div
                  key={animal.id}
                  className="group rounded-2xl bg-forest-900/80 border border-gold-500/60 hover:border-gold-400 hover:ring-2 hover:ring-gold-400/80 overflow-hidden flex flex-col shadow-xl shadow-gold-950/20 hover:shadow-2xl hover:shadow-gold-500/30 hover:-translate-y-1.5 transition-all duration-500"
                >
                  {/* Image Container (Clickable to open detailed species profile) */}
                  <div
                    onClick={() => setActiveAnimalModal(animal)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveAnimalModal(animal);
                      }
                    }}
                    className="relative aspect-video w-full overflow-hidden bg-forest-950 cursor-pointer"
                    aria-label={`View details for ${(getAnimalName && getAnimalName(animal)) || animal.name}`}
                  >
                    <img
                      src={animal.photo_url}
                      alt={animal.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Dark gradient overlay matching Live View */}
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-transparent pointer-events-none" />

                    {/* Category Badge on Top-Left */}
                    <div className="absolute top-2 left-2 pointer-events-none z-10">
                      <span className="px-2 py-0.5 rounded-md text-[8.5px] font-bold uppercase tracking-wider bg-forest-950/90 text-[#F5F4EA] backdrop-blur-md border border-gold-500/40 shadow-sm">
                        {animal.category}
                      </span>
                    </div>

                    {/* Conservation Status on Top-Right */}
                    <div className="absolute top-2 right-2 pointer-events-none z-10">
                      <span className={`px-2 py-0.5 rounded-md text-[8.5px] font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm ${getStatusColor(animal.conservation_status)}`}>
                        {animal.conservation_status}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10.5px] text-[#F5F4EA]/60 mb-0.5">
                        <span className="font-editorial italic text-[#C8A96B] font-semibold text-xs truncate max-w-[140px]">
                          {animal.scientific_name}
                        </span>
                        <span className="flex items-center gap-1 text-[10.5px] text-[#F5F4EA]/60 truncate max-w-[110px]">
                          <MapPin className="w-3 h-3 text-[#C8A96B] shrink-0" />
                          <span className="truncate">{animal.habitat.split(',')[0]}</span>
                        </span>
                      </div>

                      {animal.group && (
                        <div className="mb-1">
                          <span className="inline-block px-1.5 py-0.2 rounded bg-[#071D12]/90 text-[8.5px] font-bold tracking-wider uppercase text-[#C8A96B] border border-[#26734D]/60 shadow-sm">
                            {animal.group}
                          </span>
                        </div>
                      )}

                      <h3
                        onClick={() => setActiveAnimalModal(animal)}
                        className="font-display font-bold text-base sm:text-lg text-[#F5F4EA] group-hover:text-gold-300 transition-colors cursor-pointer leading-snug"
                      >
                        {(getAnimalName && getAnimalName(animal)) || animal.name}
                      </h3>

                      <p className="mt-1 text-xs text-[#F5F4EA]/75 line-clamp-2 leading-relaxed">
                        {animal.short_description}
                      </p>
                    </div>

                    {/* Card Action Area */}
                    <div className="mt-3 pt-2.5 border-t border-gold-500/20 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSponsorAnimal && onSponsorAnimal(animal)}
                        className="text-xs font-bold text-[#C8A96B] hover:text-white flex items-center gap-1 hover:underline transition-colors cursor-pointer"
                      >
                        <HeartHandshake className="w-3.5 h-3.5 text-[#C8A96B]" />
                        <span>Sponsor</span>
                      </button>

                      <button
                        onClick={() => setActiveAnimalModal(animal)}
                        className="px-3 py-1.5 rounded-xl bg-[#26734D] hover:bg-[#2E7D32] text-[#F5F4EA] font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1 shadow-md hover:shadow-lg border border-[#C8A96B]/30 cursor-pointer"
                      >
                        <span>Explore More</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#123D2B]/30 border border-[#26734D]/40 rounded-2xl p-8 max-w-lg mx-auto">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#123D2B] border border-[#C8A96B]/40 flex items-center justify-center text-[#C8A96B] mb-3">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#F5F4EA]">No species recorded yet</h3>
            <p className="text-xs text-[#F5F4EA]/70 mt-1 max-w-sm mx-auto">
              No animal records currently match {selectedGroup !== 'All' ? `"${selectedGroup}"` : 'your filters'}. Nandankanan exhibits are continuously updated.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 px-4 py-2 rounded-xl bg-[#C8A96B] text-[#123D2B] text-xs font-bold uppercase tracking-wider hover:bg-[#d8bc7f] transition-all shadow-md"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Comprehensive Individual Animal Profile Modal (Portaled to document.body to break out of <main z-20> stacking context) */}
      {activeAnimalModal && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveAnimalModal(null);
            }
          }}
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          onWheel={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={activeAnimalModal.name}
        >
          <div 
            className="relative w-full max-w-4xl bg-[#0B2A1A] border border-[#C8A96B]/50 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col max-h-[90vh] text-[#F5F4EA]"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Sticky Modal Top Navigation Bar with Back & Close Buttons */}
            <div className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#071D12]/98 backdrop-blur-md border-b border-[#26734D]/50 shadow-md shrink-0">
              <button
                onClick={() => setActiveAnimalModal(null)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#123D2B] hover:bg-[#1a563c] text-[#C8A96B] hover:text-white font-bold text-xs uppercase tracking-wider transition-all border border-[#C8A96B]/30 shadow-md group cursor-pointer"
                title="Back to all species"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Back to Species</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#F5F4EA]/70">
                <span className="text-[#C8A96B] font-semibold">{activeAnimalModal.category}</span>
                {activeAnimalModal.group && (
                  <>
                    <span className="opacity-40">›</span>
                    <span>{activeAnimalModal.group}</span>
                  </>
                )}
                <span className="opacity-40">›</span>
                <span className="text-white font-bold truncate max-w-[200px]">
                  {(getAnimalName && getAnimalName(activeAnimalModal)) || activeAnimalModal.name}
                </span>
              </div>

              <button
                onClick={() => setActiveAnimalModal(null)}
                className="p-2 rounded-xl bg-[#123D2B] hover:bg-red-950/80 text-[#F5F4EA]/80 hover:text-white border border-[#26734D] hover:border-red-500/50 transition-all shadow-md cursor-pointer"
                aria-label="Close animal details"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Modal Content Container */}
            <div 
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              data-lenis-prevent-touch="true"
            >
              {/* Large Photograph Banner */}
              <div className="relative h-64 sm:h-80 md:h-96 w-full bg-[#071D12] overflow-hidden shrink-0">
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
                      <Compass className="w-4 h-4 text-[#C8A96B]" />
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

              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

    </section>
  );
}
