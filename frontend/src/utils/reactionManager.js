/**
 * Reaction Manager for Nandankanan Live Wildlife Streaming
 * Manages animal-specific reaction mappings, realistic initial counts,
 * local persistence, and background API synchronization.
 */

export const ANIMAL_REACTIONS = {
  'royal-bengal-tiger': [
    { id: 'tiger_love', name: 'Tiger Love', iconKey: 'tiger', emoji: '🐯', initialCount: 3420, effect: 'roar_trail' },
    { id: 'love', name: 'Love', iconKey: 'heart_red', emoji: '❤️', initialCount: 4280, effect: 'heart_burst' },
    { id: 'paw_prints', name: 'Paw Prints', iconKey: 'paw', emoji: '🐾', initialCount: 1890, effect: 'paw_step' },
    { id: 'meat_appreciation', name: 'Meat Appreciation', iconKey: 'meat', emoji: '🥩', initialCount: 2150, effect: 'sizzle' },
    { id: 'amazing', name: 'Amazing', iconKey: 'heart_eyes', emoji: '😍', initialCount: 1740, effect: 'sparkle' },
    { id: 'exciting', name: 'Exciting', iconKey: 'fire', emoji: '🔥', initialCount: 2980, effect: 'fire_ember' }
  ],
  'asiatic-lion': [
    { id: 'lion_pride', name: 'Lion Pride', iconKey: 'lion', emoji: '🦁', initialCount: 3810, effect: 'pride_burst' },
    { id: 'king_of_jungle', name: 'King of Jungle', iconKey: 'crown', emoji: '👑', initialCount: 4620, effect: 'golden_rays' },
    { id: 'love', name: 'Love', iconKey: 'heart_red', emoji: '❤️', initialCount: 3950, effect: 'heart_burst' },
    { id: 'paw_prints', name: 'Paw Prints', iconKey: 'paw', emoji: '🐾', initialCount: 1620, effect: 'paw_step' },
    { id: 'roar', name: 'Roar', iconKey: 'fire', emoji: '🔥', initialCount: 3120, effect: 'roar_trail' },
    { id: 'applause', name: 'Applause', iconKey: 'applause', emoji: '👏', initialCount: 1840, effect: 'cheer_waves' }
  ],
  'asian-elephant': [
    { id: 'elephant_love', name: 'Elephant Love', iconKey: 'elephant', emoji: '🐘', initialCount: 4120, effect: 'gentle_wave' },
    { id: 'support', name: 'Support', iconKey: 'heart_green', emoji: '💚', initialCount: 3490, effect: 'emerald_glow' },
    { id: 'nature', name: 'Nature', iconKey: 'leaf', emoji: '🌿', initialCount: 2350, effect: 'leaf_drift' },
    { id: 'care', name: 'Care', iconKey: 'heart_hands', emoji: '🫶', initialCount: 2890, effect: 'care_glow' },
    { id: 'cute', name: 'Cute', iconKey: 'cute_face', emoji: '🥰', initialCount: 3180, effect: 'cute_bubbles' },
    { id: 'water_love', name: 'Water Love', iconKey: 'water_drop', emoji: '💧', initialCount: 2760, effect: 'splash_ripple' }
  ],
  'spotted-deer': [
    { id: 'deer_love', name: 'Deer Love', iconKey: 'deer', emoji: '🦌', initialCount: 2940, effect: 'graceful_drift' },
    { id: 'beautiful', name: 'Beautiful', iconKey: 'cherry_blossom', emoji: '🌸', initialCount: 3820, effect: 'petal_shower' },
    { id: 'nature_butterfly', name: 'Nature', iconKey: 'butterfly', emoji: '🦋', initialCount: 2470, effect: 'butterfly_flutter' },
    { id: 'green_earth', name: 'Green Earth', iconKey: 'leaf', emoji: '🌿', initialCount: 2190, effect: 'leaf_drift' },
    { id: 'love', name: 'Love', iconKey: 'heart_red', emoji: '❤️', initialCount: 3310, effect: 'heart_burst' },
    { id: 'magical', name: 'Magical', iconKey: 'sparkles', emoji: '✨', initialCount: 3050, effect: 'sparkle' }
  ],
  'sloth-bear': [
    { id: 'bear_love', name: 'Bear Love', iconKey: 'bear', emoji: '🐻', initialCount: 2830, effect: 'bear_wobble' },
    { id: 'paw_prints', name: 'Paw Prints', iconKey: 'paw', emoji: '🐾', initialCount: 1980, effect: 'paw_step' },
    { id: 'honey_love', name: 'Honey Love', iconKey: 'honey_pot', emoji: '🍯', initialCount: 3640, effect: 'honey_drip' },
    { id: 'cute', name: 'Cute', iconKey: 'cute_face', emoji: '🥰', initialCount: 2710, effect: 'cute_bubbles' },
    { id: 'support', name: 'Support', iconKey: 'heart_green', emoji: '💚', initialCount: 2490, effect: 'emerald_glow' },
    { id: 'amazing', name: 'Amazing', iconKey: 'fire', emoji: '🔥', initialCount: 2310, effect: 'fire_ember' }
  ],
  'birds': [
    { id: 'bird_love', name: 'Bird Love', iconKey: 'peacock', emoji: '🐦', initialCount: 3290, effect: 'feather_drift' },
    { id: 'beautiful', name: 'Beautiful', iconKey: 'butterfly', emoji: '🦋', initialCount: 3510, effect: 'butterfly_flutter' },
    { id: 'colorful', name: 'Colorful', iconKey: 'rainbow', emoji: '🌈', initialCount: 4180, effect: 'rainbow_arc' },
    { id: 'green_earth_tree', name: 'Green Earth', iconKey: 'tree', emoji: '🌳', initialCount: 2620, effect: 'forest_shimmer' },
    { id: 'nature_heart', name: 'Nature', iconKey: 'heart_green', emoji: '💚', initialCount: 2980, effect: 'emerald_glow' },
    { id: 'wonderful', name: 'Wonderful', iconKey: 'sparkles', emoji: '✨', initialCount: 3740, effect: 'sparkle' }
  ]
};

// Extended catalog for the Expandable Reaction Picker
export const ALL_REACTIONS_CATALOG = [
  { id: 'tiger_love', name: 'Tiger Love', iconKey: 'tiger', emoji: '🐯', category: 'animals' },
  { id: 'lion_pride', name: 'Lion Pride', iconKey: 'lion', emoji: '🦁', category: 'animals' },
  { id: 'elephant_love', name: 'Elephant Love', iconKey: 'elephant', emoji: '🐘', category: 'animals' },
  { id: 'deer_love', name: 'Deer Love', iconKey: 'deer', emoji: '🦌', category: 'animals' },
  { id: 'bear_love', name: 'Bear Love', iconKey: 'bear', emoji: '🐻', category: 'animals' },
  { id: 'bird_love', name: 'Bird Love', iconKey: 'peacock', emoji: '🦚', category: 'animals' },
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

const STORAGE_KEY = 'nandankanan_reaction_counts_v1';

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

    if (slug.includes('tiger') || name.includes('tiger')) return 'royal-bengal-tiger';
    if (slug.includes('lion') || name.includes('lion')) return 'asiatic-lion';
    if (slug.includes('elephant') || name.includes('elephant')) return 'asian-elephant';
    if (slug.includes('deer') || name.includes('deer') || slug.includes('chital')) return 'spotted-deer';
    if (slug.includes('bear') || name.includes('bear')) return 'sloth-bear';
    if (slug.includes('bird') || name.includes('bird') || slug.includes('peacock') || name.includes('peafowl')) return 'birds';

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
