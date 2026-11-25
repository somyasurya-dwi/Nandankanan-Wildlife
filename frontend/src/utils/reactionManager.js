/**
 * Reaction Manager for Nandankanan Live Wildlife Streaming
 * Manages animal-specific reaction mappings, realistic initial counts,
 * local persistence, and background API synchronization.
 */

export const ANIMAL_REACTIONS = {
  'royal-bengal-tiger': [
    { id: 'food_meat', name: 'Fresh Meat', iconKey: 'food_meat', emoji: '🥩', initialCount: 3420, effect: 'sizzle' },
    { id: 'food_chicken', name: 'Chicken', iconKey: 'food_chicken', emoji: '🍗', initialCount: 2890, effect: 'roar_trail' },
    { id: 'food_bone_meat', name: 'Bone Meat', iconKey: 'food_bone_meat', emoji: '🍖', initialCount: 2150, effect: 'fire_ember' },
    { id: 'food_poultry', name: 'Buffalo Cut', iconKey: 'food_poultry', emoji: '🥓', initialCount: 1840, effect: 'sparkle' }
  ],
  'asiatic-lion': [
    { id: 'food_meat', name: 'Meat', iconKey: 'food_meat', emoji: '🥩', initialCount: 3810, effect: 'sizzle' },
    { id: 'food_chicken', name: 'Chicken', iconKey: 'food_chicken', emoji: '🍗', initialCount: 3120, effect: 'pride_burst' },
    { id: 'food_bone_meat', name: 'Bone Meat', iconKey: 'food_bone_meat', emoji: '🍖', initialCount: 2640, effect: 'golden_rays' },
    { id: 'food_buffalo_cut', name: 'Buffalo Meat', iconKey: 'food_buffalo_cut', emoji: '🥓', initialCount: 1950, effect: 'roar_trail' }
  ],
  'asian-elephant': [
    { id: 'food_banana', name: 'Banana', iconKey: 'food_banana', emoji: '🍌', initialCount: 4120, effect: 'gentle_wave' },
    { id: 'food_watermelon', name: 'Watermelon', iconKey: 'food_watermelon', emoji: '🍉', initialCount: 3490, effect: 'splash_ripple' },
    { id: 'food_leaves', name: 'Bamboo Leaves', iconKey: 'food_leaves', emoji: '🌿', initialCount: 2890, effect: 'leaf_drift' },
    { id: 'food_corn', name: 'Corn Stalks', iconKey: 'food_corn', emoji: '🌽', initialCount: 2350, effect: 'emerald_glow' }
  ],
  'spotted-deer': [
    { id: 'food_leaves', name: 'Green Leaves', iconKey: 'food_leaves', emoji: '🌿', initialCount: 3310, effect: 'leaf_drift' },
    { id: 'food_grass', name: 'Pasture Grass', iconKey: 'food_grass', emoji: '🌾', initialCount: 2940, effect: 'graceful_drift' },
    { id: 'food_carrot', name: 'Carrot', iconKey: 'food_carrot', emoji: '🥕', initialCount: 2470, effect: 'sparkle' },
    { id: 'food_apple', name: 'Apple', iconKey: 'food_apple', emoji: '🍎', initialCount: 2190, effect: 'petal_shower' }
  ],
  'sloth-bear': [
    { id: 'food_honey', name: 'Raw Honey', iconKey: 'food_honey', emoji: '🍯', initialCount: 3640, effect: 'honey_drip' },
    { id: 'food_banana', name: 'Banana', iconKey: 'food_banana', emoji: '🍌', initialCount: 2830, effect: 'bear_wobble' },
    { id: 'food_watermelon', name: 'Melon', iconKey: 'food_watermelon', emoji: '🍉', initialCount: 2490, effect: 'cute_bubbles' },
    { id: 'food_egg', name: 'Boiled Egg', iconKey: 'food_egg', emoji: '🥚', initialCount: 1980, effect: 'emerald_glow' }
  ],
  'birds': [
    { id: 'food_millet', name: 'Millet & Seeds', iconKey: 'food_millet', emoji: '🌾', initialCount: 3510, effect: 'feather_drift' },
    { id: 'food_corn', name: 'Cracked Corn', iconKey: 'food_corn', emoji: '🌽', initialCount: 3290, effect: 'sparkle' },
    { id: 'food_apple', name: 'Apple', iconKey: 'food_apple', emoji: '🍎', initialCount: 2980, effect: 'rainbow_arc' },
    { id: 'food_grapes', name: 'Grapes', iconKey: 'food_grapes', emoji: '🍇', initialCount: 2620, effect: 'emerald_glow' }
  ],
  'white-bengal-tiger': [
    { id: 'food_meat', name: 'Fresh Meat', iconKey: 'food_meat', emoji: '🥩', initialCount: 3890, effect: 'sizzle' },
    { id: 'food_chicken', name: 'Chicken', iconKey: 'food_chicken', emoji: '🍗', initialCount: 3120, effect: 'roar_trail' },
    { id: 'food_bone_meat', name: 'Bone Meat', iconKey: 'food_bone_meat', emoji: '🍖', initialCount: 2380, effect: 'fire_ember' },
    { id: 'food_buffalo_cut', name: 'Buffalo Cut', iconKey: 'food_buffalo_cut', emoji: '🥓', initialCount: 2150, effect: 'sparkle' }
  ],
  'indian-pangolin': [
    { id: 'food_ants', name: 'Weaver Ants', iconKey: 'food_ants', emoji: '🐜', initialCount: 3370, effect: 'care_glow' },
    { id: 'food_termites', name: 'Termites', iconKey: 'food_termites', emoji: '🪲', initialCount: 2890, effect: 'leaf_drift' },
    { id: 'food_egg', name: 'Egg Yolk', iconKey: 'food_egg', emoji: '🥚', initialCount: 2640, effect: 'sparkle' },
    { id: 'food_larvae', name: 'Grubs & Larvae', iconKey: 'food_larvae', emoji: '🪱', initialCount: 1980, effect: 'emerald_glow' }
  ],
  'gharial': [
    { id: 'food_fish', name: 'River Fish', iconKey: 'food_fish', emoji: '🐟', initialCount: 3820, effect: 'splash_ripple' },
    { id: 'food_carp', name: 'Rohu Carp', iconKey: 'food_carp', emoji: '🐠', initialCount: 3010, effect: 'splash_ripple' },
    { id: 'food_mrigal', name: 'Mrigal Fish', iconKey: 'food_mrigal', emoji: '🐡', initialCount: 2470, effect: 'leaf_drift' },
    { id: 'food_prawn', name: 'River Prawn', iconKey: 'food_prawn', emoji: '🦐', initialCount: 2190, effect: 'cheer_waves' }
  ],
  'king-cobra': [
    { id: 'food_snake', name: 'Rat Snake', iconKey: 'food_snake', emoji: '🐍', initialCount: 3690, effect: 'golden_rays' },
    { id: 'food_lizard', name: 'Monitor Lizard', iconKey: 'food_lizard', emoji: '🦎', initialCount: 3310, effect: 'fire_ember' },
    { id: 'food_frog', name: 'Marsh Frog', iconKey: 'food_frog', emoji: '🐸', initialCount: 2840, effect: 'leaf_drift' },
    { id: 'food_egg', name: 'Egg', iconKey: 'food_egg', emoji: '🥚', initialCount: 2160, effect: 'sparkle' }
  ],
  'indian-flapshell-turtle': [
    { id: 'food_snail', name: 'Apple Snail', iconKey: 'food_snail', emoji: '🐌', initialCount: 3670, effect: 'splash_ripple' },
    { id: 'food_worm', name: 'Earthworm', iconKey: 'food_worm', emoji: '🪱', initialCount: 3180, effect: 'gentle_wave' },
    { id: 'food_shrimp', name: 'Small Shrimp', iconKey: 'food_shrimp', emoji: '🦐', initialCount: 2950, effect: 'emerald_glow' },
    { id: 'food_greens', name: 'Water Lettuce', iconKey: 'food_greens', emoji: '🥬', initialCount: 2420, effect: 'leaf_drift' }
  ],
  'asian-openbill': [
    { id: 'food_snail', name: 'Apple Snail', iconKey: 'food_snail', emoji: '🐌', initialCount: 3820, effect: 'splash_ripple' },
    { id: 'food_mussel', name: 'Freshwater Mussel', iconKey: 'food_mussel', emoji: '🦪', initialCount: 3410, effect: 'feather_drift' },
    { id: 'food_fish', name: 'Small Fish', iconKey: 'food_fish', emoji: '🐟', initialCount: 3120, effect: 'emerald_glow' },
    { id: 'food_frog', name: 'Wetland Frog', iconKey: 'food_frog', emoji: '🐸', initialCount: 2790, effect: 'leaf_drift' }
  ]
};

// Extended catalog for the Expandable Reaction Picker
export const ALL_REACTIONS_CATALOG = [
  { id: 'tiger_love', name: 'Tiger Love', iconKey: 'tiger', emoji: '🐯', category: 'animals' },
  { id: 'white_tiger_love', name: 'White Tiger Pride', iconKey: 'white_tiger', emoji: '🐅', category: 'animals' },
  { id: 'lion_pride', name: 'Lion Pride', iconKey: 'lion', emoji: '🦁', category: 'animals' },
  { id: 'elephant_love', name: 'Elephant Love', iconKey: 'elephant', emoji: '🐘', category: 'animals' },
  { id: 'deer_love', name: 'Deer Love', iconKey: 'deer', emoji: '🦌', category: 'animals' },
  { id: 'bear_love', name: 'Bear Love', iconKey: 'bear', emoji: '🐻', category: 'animals' },
  { id: 'bird_love', name: 'Bird Love', iconKey: 'peacock', emoji: '🦚', category: 'animals' },
  { id: 'pangolin_love', name: 'Pangolin Care', iconKey: 'pangolin', emoji: '🤎', category: 'animals' },
  { id: 'gharial_love', name: 'Gharial Honor', iconKey: 'gharial', emoji: '🐊', category: 'animals' },
  { id: 'king_cobra_respect', name: 'Cobra Majesty', iconKey: 'king_cobra', emoji: '🐍', category: 'animals' },
  { id: 'turtle_love', name: 'Flapshell Turtle', iconKey: 'flapshell_turtle', emoji: '🐢', category: 'animals' },
  { id: 'openbill_flight', name: 'Asian Openbill', iconKey: 'asian_openbill', emoji: '🦩', category: 'animals' },
  { id: 'paw_prints', name: 'Paw Prints', iconKey: 'paw', emoji: '🐾', category: 'animals' },

  { id: 'leaf', name: 'Forest Leaf', iconKey: 'leaf', emoji: '🌿', category: 'nature' },
  { id: 'tree', name: 'Sacred Tree', iconKey: 'tree', emoji: '🌳', category: 'nature' },
  { id: 'water_drop', name: 'Water Drop', iconKey: 'water_drop', emoji: '💧', category: 'nature' },
  { id: 'butterfly', name: 'Butterfly', iconKey: 'butterfly', emoji: '🦋', category: 'nature' },
  { id: 'cherry_blossom', name: 'Blossom', iconKey: 'cherry_blossom', emoji: '🌸', category: 'nature' },
  { id: 'rainbow', name: 'Rainbow', iconKey: 'rainbow', emoji: '🌈', category: 'nature' },

  { id: 'love', name: 'Red Love', iconKey: 'heart_red', emoji: '❤️', category: 'cheers' },
  { id: 'support', name: 'Green Support', iconKey: 'heart_green', emoji: '💚', category: 'cheers' },
  { id: 'heart_hands', name: 'Care Hands', iconKey: 'heart_hands', emoji: '🫶', category: 'cheers' },
  { id: 'heart_eyes', name: 'Heart Eyes', iconKey: 'heart_eyes', emoji: '😍', category: 'cheers' },
  { id: 'cute_face', name: 'Cute Blushing', iconKey: 'cute_face', emoji: '🥰', category: 'cheers' },
  { id: 'king_of_jungle', name: 'Royal Crown', iconKey: 'crown', emoji: '👑', category: 'cheers' },
  { id: 'fire', name: 'Fiery Roar', iconKey: 'fire', emoji: '🔥', category: 'cheers' },
  { id: 'meat_appreciation', name: 'Feast Meat', iconKey: 'meat', emoji: '🥩', category: 'cheers' },
  { id: 'honey_love', name: 'Honey Pot', iconKey: 'honey_pot', emoji: '🍯', category: 'cheers' },
  { id: 'applause', name: 'Applause', iconKey: 'applause', emoji: '👏', category: 'cheers' },
  { id: 'sparkles', name: 'Magical Sparkles', iconKey: 'sparkles', emoji: '✨', category: 'cheers' }
];

const STORAGE_KEY = 'nandankanan_reaction_counts_v2';

class ReactionManager {
  constructor() {
    this.counts = this.loadCounts();
    this.listeners = new Set();
  }

  // Identify animal key safely
  resolveAnimalKey(animal) {
    if (!animal) return 'royal-bengal-tiger';
    const slug = (animal.slug || '').toLowerCase();
    const name = (animal.animal_name || animal.name || '').toLowerCase();

    if (slug.includes('white') || name.includes('white')) return 'white-bengal-tiger';
    if (slug.includes('tiger') || name.includes('tiger')) return 'royal-bengal-tiger';
    if (slug.includes('lion') || name.includes('lion')) return 'asiatic-lion';
    if (slug.includes('elephant') || name.includes('elephant')) return 'asian-elephant';
    if (slug.includes('deer') || name.includes('deer') || slug.includes('chital')) return 'spotted-deer';
    if (slug.includes('bear') || name.includes('bear')) return 'sloth-bear';
    if (slug.includes('openbill') || name.includes('openbill') || slug.includes('openbell') || name.includes('openbell') || slug.includes('anastomus')) return 'asian-openbill';
    if (slug.includes('bird') || name.includes('bird') || slug.includes('peacock') || name.includes('peafowl')) return 'birds';
    if (slug.includes('pangolin') || name.includes('pangolin')) return 'indian-pangolin';
    if (slug.includes('gharial') || name.includes('gharial') || slug.includes('crocodile') || name.includes('crocodile')) return 'gharial';
    if (slug.includes('cobra') || name.includes('cobra') || slug.includes('snake') || name.includes('snake')) return 'king-cobra';
    if (slug.includes('turtle') || name.includes('turtle') || slug.includes('flapshell') || name.includes('flapshell')) return 'indian-flapshell-turtle';

    return 'royal-bengal-tiger';
  }

  // Get active 6 reactions for an animal
  getReactionsForAnimal(animal) {
    const key = this.resolveAnimalKey(animal);
    return ANIMAL_REACTIONS[key] || ANIMAL_REACTIONS['royal-bengal-tiger'];
  }

  // Load counts from localStorage or initialize with defaults
  loadCounts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }

    // Default initialization
    const defaults = {};
    Object.entries(ANIMAL_REACTIONS).forEach(([slug, list]) => {
      defaults[slug] = {};
      list.forEach(item => {
        defaults[slug][item.id] = item.initialCount;
      });
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    } catch {
      // Ignore
    }
    return defaults;
  }

  saveCounts() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.counts));
    } catch {
      // Ignore
    }
    this.notify();
  }

  // Get current counts map for an animal
  getAnimalCounts(animal) {
    const key = this.resolveAnimalKey(animal);
    if (!this.counts[key]) {
      this.counts[key] = {};
      const defs = ANIMAL_REACTIONS[key] || [];
      defs.forEach(d => {
        this.counts[key][d.id] = d.initialCount;
      });
    }
    return { ...this.counts[key] };
  }

  // Send a reaction (increments locally and triggers background sync)
  sendReaction(animal, reaction) {
    const key = this.resolveAnimalKey(animal);
    if (!this.counts[key]) {
      this.counts[key] = {};
    }

    const current = this.counts[key][reaction.id] !== undefined
      ? this.counts[key][reaction.id]
      : (reaction.initialCount || 100);

    const updatedCount = current + 1;
    this.counts[key][reaction.id] = updatedCount;
    this.saveCounts();

    // Background sync to backend API (fire and forget)
    this.syncToBackend(key, reaction.id, reaction.name);

    return updatedCount;
  }

  async syncToBackend(animalSlug, reactionId, reactionName) {
    try {
      await fetch(`/api/reactions/${animalSlug}/send/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reaction_id: reactionId, reaction_name: reactionName })
      });
    } catch {
      // Backend sync is optional / offline-friendly
    }
  }

  // Compute most popular reaction id for an animal
  getPopularReactionId(animal, countsMap) {
    const reactions = this.getReactionsForAnimal(animal);
    let maxId = reactions[0]?.id || 'love';
    let maxCount = -1;

    reactions.forEach(r => {
      const c = countsMap[r.id] !== undefined ? countsMap[r.id] : r.initialCount;
      if (c > maxCount) {
        maxCount = c;
        maxId = r.id;
      }
    });

    return maxId;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.counts));
  }
}

export const reactionManager = new ReactionManager();
