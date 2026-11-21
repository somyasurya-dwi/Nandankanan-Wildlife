import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve('c:/Users/Asus/Desktop/Nandankanan1/Nandankanan-Wildlife');
const playerPath = path.join(projectRoot, 'frontend/src/components/LiveCameraPlayer.jsx');
let src = fs.readFileSync(playerPath, 'utf8');

// 1. Update imports
const importTarget = `import { 
  Play, 
  Pause, 
  Volume2, 
  Volume1,
  VolumeX, 
  Maximize, 
  X, 
  Radio, 
  MapPin, 
  Eye, 
  Camera, 
  UtensilsCrossed, 
  HeartPulse, 
  Wallet, 
  CheckCircle2, 
  Activity, 
  Bell, 
  Radar, 
  LayoutGrid, 
  MonitorPlay, 
  Clock, 
  Video, 
  Map, 
  Navigation, 
  AlertTriangle,
  AlertOctagon,
  LocateFixed,
  Compass,
  ArrowRight,
  Sparkles,
  Lock,
  ShieldCheck,
  Settings,
  Sliders,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { MultiCameraTracker } from '../utils/multiCameraTracker';
import { subscriptionManager } from '../utils/subscriptionManager';
import SubscriptionModal from './SubscriptionModal';
import { walletManager } from '../utils/walletManager';`;

const importReplacement = `import { 
  Play, 
  Pause, 
  Volume2, 
  Volume1,
  VolumeX, 
  Maximize, 
  X, 
  Radio, 
  MapPin, 
  Eye, 
  Camera, 
  UtensilsCrossed, 
  HeartPulse, 
  Wallet, 
  CheckCircle2, 
  Activity, 
  Bell, 
  Radar, 
  LayoutGrid, 
  MonitorPlay, 
  Clock, 
  Video, 
  Map, 
  Navigation, 
  AlertTriangle,
  AlertOctagon,
  LocateFixed,
  Compass,
  ArrowRight,
  Sparkles,
  Lock,
  ShieldCheck,
  Settings,
  Sliders,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Loader2,
  Plus
} from 'lucide-react';
import { MultiCameraTracker } from '../utils/multiCameraTracker';
import { subscriptionManager } from '../utils/subscriptionManager';
import SubscriptionModal from './SubscriptionModal';
import { walletManager } from '../utils/walletManager';
import Realistic3DIcon from './reactions/Realistic3DIcon';
import ExpandableReactionPicker from './reactions/ExpandableReactionPicker';
import { reactionManager } from '../utils/reactionManager';`;

if (src.includes(importTarget)) {
  src = src.replace(importTarget, importReplacement);
  console.log('Updated imports in LiveCameraPlayer.jsx');
} else {
  console.error('importTarget not found!');
}

// 2. Update Reaction Configuration and State
const reactionStateTarget = `  // Species-specific dynamic reaction configuration
  const speciesEmoji = animal?.emoji || (isElephant ? '🐘' : isBird ? '🦚' : isBear ? '🐻' : isDeer ? '🦌' : isLion ? '🦁' : '🐅');

  const REACTION_CONFIG = useMemo(() => [
    { id: 'species', emoji: speciesEmoji, label: animal?.animal_name || 'Animal', initialCount: 1420 },
    { id: 'heart', emoji: '💚', label: 'Love', initialCount: 2840 },
    { id: 'nature', emoji: '🌿', label: 'Habitat', initialCount: 960 },
    { id: 'fire', emoji: '🔥', label: 'Majestic', initialCount: 1890 },
    { id: 'clap', emoji: '👏', label: 'Applause', initialCount: 650 },
    { id: 'sparkles', emoji: '✨', label: 'Magic', initialCount: 1120 },
  ], [speciesEmoji, animal?.animal_name]);

  const [reactionCounts, setReactionCounts] = useState({
    species: 1420,
    heart: 2840,
    nature: 960,
    fire: 1890,
    clap: 650,
    sparkles: 1120,
  });

  const [bouncingEmojiId, setBouncingEmojiId] = useState(null);

  // Compute most popular reaction
  const popularReactionId = useMemo(() => {
    let maxId = 'heart';
    let maxVal = -1;
    Object.entries(reactionCounts).forEach(([id, cnt]) => {
      if (cnt > maxVal) {
        maxVal = cnt;
        maxId = id;
      }
    });
    return maxId;
  }, [reactionCounts]);

  // Enhanced Multi-Trajectory Floating Reaction Spawner
  const handleSendReaction = (item) => {
    // 1. Increment reaction count
    setReactionCounts(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || item.initialCount) + 1
    }));

    // 2. Button bounce animation
    setBouncingEmojiId(item.id);
    setTimeout(() => setBouncingEmojiId(null), 350);

    // 3. Spawn floating particles with varied speeds, angles, rotations, and scales
    const countToSpawn = Math.random() > 0.35 ? 2 : 1;
    const newParticles = [];

    for (let i = 0; i < countToSpawn; i++) {
      const id = Date.now() + Math.random() + i;
      const startX = 22 + Math.random() * 56; // 22% to 78% of video width
      const driftX = (Math.random() - 0.5) * 110; // -55px to +55px
      const rotation = (Math.random() - 0.5) * 60; // -30deg to +30deg
      const duration = 1.9 + Math.random() * 0.9; // 1.9s to 2.8s
      const scale = 0.9 + Math.random() * 0.55; // 0.9x to 1.45x
      const distanceY = 220 + Math.random() * 120; // 220px to 340px travel

      newParticles.push({
        id,
        emoji: item.emoji,
        startX,
        driftX,
        rotation,
        duration,
        scale,
        distanceY
      });

      // Clean up particle
      setTimeout(() => {
        setReactions(prev => prev.filter(r => r.id !== id));
      }, duration * 1000 + 100);
    }

    setReactions(prev => [...prev, ...newParticles]);
  };

  const addReaction = (emoji) => {
    const item = REACTION_CONFIG.find(r => r.emoji === emoji) || { id: 'custom', emoji, initialCount: 100, label: 'Reaction' };
    handleSendReaction(item);
  };`;

const reactionStateReplacement = `  // =========================================================================
  // DYNAMIC ANIMAL-SPECIFIC REACTION SYSTEM WITH REALISTIC 3D ICONS
  // =========================================================================
  const [isReactionPickerOpen, setIsReactionPickerOpen] = useState(false);

  // Automatically resolves the exact 6 main reactions for the currently selected animal
  const activeReactions = useMemo(() => {
    return reactionManager.getReactionsForAnimal(animal);
  }, [animal]);

  // Load persistent real-time reaction counts for the active animal
  const [reactionCounts, setReactionCounts] = useState(() => {
    return reactionManager.getAnimalCounts(animal);
  });

  // When visitor switches animals, seamlessly update reaction counts without page reload or video reset
  useEffect(() => {
    setReactionCounts(reactionManager.getAnimalCounts(animal));
  }, [animal]);

  const [bouncingEmojiId, setBouncingEmojiId] = useState(null);

  // Compute most popular reaction for the active animal
  const popularReactionId = useMemo(() => {
    return reactionManager.getPopularReactionId(animal, reactionCounts);
  }, [animal, reactionCounts]);

  // Enhanced Multi-Trajectory Floating 3D Reaction Spawner
  const handleSendReaction = (item) => {
    // 1. Increment reaction count locally and sync in background
    const newCount = reactionManager.sendReaction(animal, item);
    setReactionCounts(prev => ({
      ...prev,
      [item.id]: newCount
    }));

    // 2. Button bounce animation
    setBouncingEmojiId(item.id);
    setTimeout(() => setBouncingEmojiId(null), 350);

    // 3. Spawn floating 3D particle animations over the live video
    const countToSpawn = Math.random() > 0.35 ? 2 : 1;
    const newParticles = [];

    for (let i = 0; i < countToSpawn; i++) {
      const id = Date.now() + Math.random() + i;
      const startX = 20 + Math.random() * 60; // 20% to 80% width
      const driftX = (Math.random() - 0.5) * 120; // -60px to +60px
      const rotation = (Math.random() - 0.5) * 50; // -25deg to +25deg
      const duration = 2.0 + Math.random() * 0.8; // 2.0s to 2.8s
      const scale = 0.95 + Math.random() * 0.45; // 0.95x to 1.4x
      const distanceY = 240 + Math.random() * 120; // 240px to 360px travel

      newParticles.push({
        id,
        iconKey: item.iconKey,
        name: item.name || item.label,
        emojiFallback: item.emoji,
        effect: item.effect,
        startX,
        driftX,
        rotation,
        duration,
        scale,
        distanceY
      });

      // Clean up particle
      setTimeout(() => {
        setReactions(prev => prev.filter(r => r.id !== id));
      }, duration * 1000 + 100);
    }

    setReactions(prev => [...prev, ...newParticles]);
  };

  const addReaction = (emoji) => {
    const item = activeReactions.find(r => r.emoji === emoji || r.iconKey === emoji) || { 
      id: 'custom', 
      iconKey: 'heart_red', 
      name: 'Love', 
      initialCount: 100 
    };
    handleSendReaction(item);
  };`;

if (src.includes(reactionStateTarget)) {
  src = src.replace(reactionStateTarget, reactionStateReplacement);
  console.log('Updated reaction state and handler in LiveCameraPlayer.jsx');
} else {
  console.error('reactionStateTarget not found!');
}

// 3. Update Reaction Layer and Centered Dock in JSX
const reactionDockTarget = `            {/* Floating Multi-Particle Reactions Layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
              {reactions.map((r) => (
                <div
                  key={r.id}
                  style={{
                    left: \`\${r.startX || r.x || 50}%\`,
                    bottom: '75px',
                    fontSize: \`\${Math.round(28 * (r.scale || 1))}px\`,
                    animation: \`floatUpWobble \${r.duration || 2.2}s cubic-bezier(0.22, 1, 0.36, 1) forwards\`,
                    '--drift-x': \`\${r.driftX || 0}px\`,
                    '--rotation': \`\${r.rotation || 0}deg\`,
                    '--distance-y': \`-\${r.distanceY || 240}px\`,
                  }}
                  className="absolute pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] select-none will-change-transform animate-floatUpWobble"
                >
                  {r.emoji}
                </div>
              ))}
            </div>

            {/* Centered Floating Glassmorphism Reaction Dock */}
            <div className="absolute bottom-13 sm:bottom-16 inset-x-0 mx-auto w-fit max-w-[94%] z-20 flex items-center justify-center pointer-events-auto px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-2xl bg-black/65 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-200 hover:scale-[1.02]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C8A96B] font-semibold mr-1.5 flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3 text-[#C8A96B]" />
                <span className="hidden sm:inline">React:</span>
              </span>
              <div className="flex items-center gap-1 sm:gap-1.5">
                {REACTION_CONFIG.map((item) => {
                  const isHot = item.id === popularReactionId;
                  const isBouncing = bouncingEmojiId === item.id;
                  const count = reactionCounts[item.id] || 0;
                  const countStr = count >= 1000 ? \`\${(count / 1000).toFixed(1)}k\` : count;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSendReaction(item)}
                      className={\`group relative flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-xl transition-all duration-200 cursor-pointer select-none \${
                        isHot 
                          ? 'bg-[#C8A96B]/25 border border-[#C8A96B]/70 shadow-[0_0_12px_rgba(200,169,107,0.4)]' 
                          : 'bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25'
                      } \${isBouncing ? 'scale-125 -translate-y-1' : 'hover:scale-105 active:scale-95'}\`}
                      title={\`\${item.label} (\${count.toLocaleString()})\`}
                    >
                      <span className="text-base sm:text-lg leading-none transition-transform group-hover:scale-110">
                        {item.emoji}
                      </span>
                      <span className={\`text-[10px] font-mono font-medium leading-none \${
                        isHot ? 'text-[#C8A96B] font-bold' : 'text-white/80 group-hover:text-white'
                      }\`}>
                        {countStr}
                      </span>
                      {isHot && (
                        <span className="absolute -top-1.5 -right-1 px-1 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-[8px] font-bold text-white uppercase tracking-tighter shadow-sm animate-pulse">
                          HOT
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>`;

const reactionDockReplacement = `            {/* Floating Multi-Particle 3D Reactions Layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
              {reactions.map((r) => (
                <div
                  key={r.id}
                  style={{
                    left: \`\${r.startX || 50}%\`,
                    bottom: '80px',
                    animation: \`floatUpWobble \${r.duration || 2.2}s cubic-bezier(0.22, 1, 0.36, 1) forwards\`,
                    '--drift-x': \`\${r.driftX || 0}px\`,
                    '--rotation': \`\${r.rotation || 0}deg\`,
                    '--distance-y': \`-\${r.distanceY || 260}px\`,
                  }}
                  className="absolute pointer-events-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] select-none will-change-transform animate-floatUpWobble"
                >
                  <Realistic3DIcon 
                    iconKey={r.iconKey} 
                    size={Math.round(36 * (r.scale || 1))} 
                    effect={r.effect} 
                  />
                </div>
              ))}
            </div>

            {/* Centered Dynamic Floating Glassmorphism Reaction Dock with Realistic 3D Icons */}
            <div className="absolute bottom-13 sm:bottom-16 inset-x-0 mx-auto w-fit max-w-[96%] z-20 flex items-center justify-center pointer-events-auto px-2 sm:px-3 py-1 sm:py-1.5 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-200 hover:scale-[1.02]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C8A96B] font-semibold mr-1.5 flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3 text-[#C8A96B]" />
                <span className="hidden sm:inline">React:</span>
              </span>
              <div className="flex items-center gap-1 sm:gap-1.5">
                {activeReactions.map((item) => {
                  const isHot = item.id === popularReactionId;
                  const isBouncing = bouncingEmojiId === item.id;
                  const count = reactionCounts[item.id] !== undefined ? reactionCounts[item.id] : item.initialCount;
                  const countStr = count >= 1000 ? \`\${(count / 1000).toFixed(1)}k\` : count;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSendReaction(item)}
                      className={\`group relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl transition-all duration-200 cursor-pointer select-none \${
                        isHot 
                          ? 'bg-[#C8A96B]/25 border border-[#C8A96B]/80 shadow-[0_0_15px_rgba(200,169,107,0.45)] ring-1 ring-[#C8A96B]/50' 
                          : 'bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#C8A96B]/40 hover:shadow-[0_0_12px_rgba(200,169,107,0.25)]'
                      } \${isBouncing ? 'scale-125 -translate-y-1' : 'hover:scale-105 active:scale-95'}\`}
                      title={\`\${item.name} (\${count.toLocaleString()})\`}
                    >
                      <Realistic3DIcon 
                        iconKey={item.iconKey} 
                        size={22} 
                        className="transition-transform group-hover:scale-115"
                      />
                      <span className={\`text-[10px] font-mono font-medium leading-none \${
                        isHot ? 'text-[#C8A96B] font-bold' : 'text-white/80 group-hover:text-white'
                      }\`}>
                        {countStr}
                      </span>
                      {isHot && (
                        <span className="absolute -top-1.5 -right-1 px-1 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-[8px] font-bold text-white uppercase tracking-tighter shadow-sm animate-pulse">
                          HOT
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Expandable Reaction Picker Drawer Toggle */}
                <button
                  onClick={() => setIsReactionPickerOpen(prev => !prev)}
                  className={\`p-1.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center \${
                    isReactionPickerOpen
                      ? 'bg-[#C8A96B] text-[#071D12] border-[#C8A96B] shadow-md shadow-[#C8A96B]/30'
                      : 'bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border-white/10 hover:border-[#C8A96B]/40'
                  }\`}
                  title="Explore All Sanctuary Reactions (+)"
                >
                  <Plus className={\`w-3.5 h-3.5 transition-transform duration-200 \${isReactionPickerOpen ? 'rotate-45' : ''}\`} />
                </button>
              </div>
            </div>

            {/* Expandable Reaction Picker Drawer */}
            <ExpandableReactionPicker
              isOpen={isReactionPickerOpen}
              onClose={() => setIsReactionPickerOpen(false)}
              onSelectReaction={(item) => {
                handleSendReaction(item);
              }}
              currentAnimal={animal}
              reactionCounts={reactionCounts}
            />`;

if (src.includes(reactionDockTarget)) {
  src = src.replace(reactionDockTarget, reactionDockReplacement);
  console.log('Updated reaction dock and layer in LiveCameraPlayer.jsx');
} else {
  console.error('reactionDockTarget not found!');
}

fs.writeFileSync(playerPath, src, 'utf8');
console.log('Saved LiveCameraPlayer.jsx successfully.');
