import React, { useState } from 'react';
import { X, Sparkles, Heart, Trees, Award } from 'lucide-react';
import Realistic3DIcon from './Realistic3DIcon';
import { ALL_REACTIONS_CATALOG } from '../../utils/reactionManager';

export default function ExpandableReactionPicker({
  isOpen,
  onClose,
  onSelectReaction,
  currentAnimal,
  reactionCounts = {}
}) {
  const [activeCategory, setActiveCategory] = useState('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All', icon: Sparkles },
    { id: 'animals', label: 'Species', icon: Award },
    { id: 'nature', label: 'Nature', icon: Trees },
    { id: 'cheers', label: 'Cheers', icon: Heart },
  ];

  const filteredReactions = activeCategory === 'all'
    ? ALL_REACTIONS_CATALOG
    : ALL_REACTIONS_CATALOG.filter(r => r.category === activeCategory);

  return (
    <div 
      className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 w-[95%] max-w-md bg-[#06180E]/95 backdrop-blur-2xl border border-[#C8A96B]/50 rounded-2xl p-3.5 sm:p-4 shadow-2xl z-40 animate-fadeIn text-[#F5F4EA] select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#14532D]/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C8A96B]" />
          <div>
            <h4 className="text-xs sm:text-sm font-serif font-bold text-[#F5F4EA] tracking-wide">
              Sanctuary Reactions
            </h4>
            <p className="text-[10px] text-[#A7D7A9] font-mono leading-none">
              Click any 3D icon to react live on stream
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-[#F5F4EA]/70 hover:text-white hover:bg-white/10 transition-colors"
          title="Close reaction picker"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-medium flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer border ${
                isActive
                  ? 'bg-[#C8A96B] text-[#071D12] font-bold border-[#C8A96B] shadow-sm'
                  : 'bg-white/5 text-white/80 border-white/10 hover:border-[#C8A96B]/40 hover:bg-white/10'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid of 3D Realistic Reactions */}
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
        {filteredReactions.map((item) => {
          const count = reactionCounts[item.id];
          const countStr = count !== undefined
            ? (count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count)
            : '+1';

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectReaction(item);
              }}
              className="group p-2 rounded-xl bg-[#092215]/80 hover:bg-[#14532D]/70 border border-white/10 hover:border-[#C8A96B]/80 transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 hover:shadow-[0_0_15px_rgba(200,169,107,0.35)]"
              title={`${item.name} (${countStr})`}
            >
              <Realistic3DIcon 
                iconKey={item.iconKey} 
                size={30} 
                className="group-hover:scale-115 transition-transform duration-200" 
              />
              <span className="text-[10px] text-white/90 truncate w-full text-center font-medium leading-tight group-hover:text-[#C8A96B]">
                {item.name}
              </span>
              <span className="text-[9px] font-mono text-[#A7D7A9] font-bold leading-none">
                {countStr}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
