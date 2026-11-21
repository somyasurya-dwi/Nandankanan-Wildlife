import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve('c:/Users/Asus/Desktop/Nandankanan1/Nandankanan-Wildlife');

// 1. Update index.css
const indexCssPath = path.join(projectRoot, 'frontend/src/index.css');
let indexCss = fs.readFileSync(indexCssPath, 'utf8');

if (!indexCss.includes('#live-wildlife-dashboard')) {
  const smoothRules = `
/* Smooth natural scrolling & layout flexibility */
html {
  scroll-behavior: smooth;
}

#live-wildlife-dashboard {
  scroll-behavior: smooth;
  scrollbar-gutter: stable;
}
`;
  indexCss = smoothRules + indexCss;
  fs.writeFileSync(indexCssPath, indexCss, 'utf8');
  console.log('Updated index.css with smooth scrolling and stable scrollbar gutter.');
} else {
  console.log('index.css already contains #live-wildlife-dashboard');
}

// 2. Update LiveSharingMoments.jsx
const momentsPath = path.join(projectRoot, 'frontend/src/components/LiveSharingMoments.jsx');
let moments = fs.readFileSync(momentsPath, 'utf8');

moments = moments.replace(
  'space-y-2 overflow-y-auto max-h-[195px] pr-1 scrollbar-thin',
  'space-y-2 overflow-y-auto max-h-[220px] pr-1 scrollbar-thin overscroll-contain'
);
fs.writeFileSync(momentsPath, moments, 'utf8');
console.log('Updated LiveSharingMoments.jsx with overscroll-contain and max-h-[220px]');

// 3. Update LiveCameraPlayer.jsx
const playerPath = path.join(projectRoot, 'frontend/src/components/LiveCameraPlayer.jsx');
let player = fs.readFileSync(playerPath, 'utf8');

// A. Update outer container and header start
const targetA = `  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#071D12]/95 backdrop-blur-xl animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-7xl bg-[#092215] border border-[#C8A96B]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[96vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* =========================================================================
            1. CLEAN HEADER BAR
            ========================================================================= */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#06180E] border-b border-[#14532D]/70 flex items-center justify-between gap-3 shrink-0">`;

const replacementA = `  return (
    <div 
      id="live-wildlife-dashboard"
      className="fixed inset-0 z-[100] bg-[#071D12] overflow-y-auto overflow-x-hidden scroll-smooth selection:bg-[#C8A96B] selection:text-[#071D12]"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-[1800px] 2xl:max-w-[1920px] mx-auto min-h-screen flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* =========================================================================
            1. CLEAN HEADER BAR (Sticky Top Navigation)
            ========================================================================= */}
        <header className="sticky top-0 z-40 bg-[#06180E]/95 backdrop-blur-xl border-b border-[#14532D]/80 shadow-lg shrink-0">
          <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-3 flex items-center justify-between gap-3">`;

if (player.includes(targetA)) {
  player = player.replace(targetA, replacementA);
  console.log('Replaced targetA in LiveCameraPlayer.jsx');
} else {
  console.error('targetA NOT found in LiveCameraPlayer.jsx');
}

// B. Close header and start main body with 75% video / 25% sidebar
const targetB = `            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 px-2 rounded-xl bg-[#14532D]/60 text-[#F5F4EA]/90 hover:text-white hover:bg-[#14532D] transition-colors border border-[#C8A96B]/40 ml-1 cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
              aria-label="Close Live Stream (Esc)"
              title="Close Live Stream (Esc)"
            >
              <X className="w-4 h-4 text-white" />
              <span className="hidden sm:inline text-[9px] font-mono font-bold text-[#C8A96B] px-1.5 py-0.5 bg-black/50 border border-white/10 rounded">ESC</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            WILDLIFE WALLET BANNER (Share Happiness, Feed Wildlife ❤️)
            ========================================================================= */}
        <WildlifeWalletBar
          wallet={walletState.wallet}
          onOpenContribution={(amount, targetAnimal) => {
            handleOpenContribution(amount, targetAnimal);
          }}
          onOpenAddMoney={() => setIsAddMoneyModalOpen(true)}
          onOpenHistory={() => setIsWalletHistoryOpen(true)}
          currentAnimal={animal}
        />

        {/* =========================================================================
            SCROLLABLE DASHBOARD BODY
            ========================================================================= */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-5 md:p-6 space-y-4 sm:space-y-5">

          {/* Main Top Section: 12-Column Grid with Live Video on Left and Live Sharing Moments & Animal Care Fund on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
            
            {/* Left 8 Columns: Live Video Player & Control Toolbar */}
            <div className="lg:col-span-8 space-y-3 sm:space-y-4">`;

const replacementB = `            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 px-2 rounded-xl bg-[#14532D]/60 text-[#F5F4EA]/90 hover:text-white hover:bg-[#14532D] transition-colors border border-[#C8A96B]/40 ml-1 cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
              aria-label="Close Live Stream (Esc)"
              title="Close Live Stream (Esc)"
            >
              <X className="w-4 h-4 text-white" />
              <span className="hidden sm:inline text-[9px] font-mono font-bold text-[#C8A96B] px-1.5 py-0.5 bg-black/50 border border-white/10 rounded">ESC</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            WILDLIFE WALLET BANNER (Share Happiness, Feed Wildlife ❤️)
            ========================================================================= */}
        <WildlifeWalletBar
          wallet={walletState.wallet}
          onOpenContribution={(amount, targetAnimal) => {
            handleOpenContribution(amount, targetAnimal);
          }}
          onOpenAddMoney={() => setIsAddMoneyModalOpen(true)}
          onOpenHistory={() => setIsWalletHistoryOpen(true)}
          currentAnimal={animal}
        />
      </header>

        {/* =========================================================================
            MAIN DASHBOARD BODY (Smooth natural flow, 75% video / 25% sidebar)
            ========================================================================= */}
        <main className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 space-y-6 flex-1">

          {/* Main Top Section: 12-Column Grid with Live Video on Left (~75%) and Live Sharing Moments & Animal Care Fund on Right (~25%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 xl:gap-8 items-start">
            
            {/* Left 8-9 Columns: Live Video Player & Control Toolbar (~70-75% width on desktop) */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-4 sm:space-y-5">`;

if (player.includes(targetB)) {
  player = player.replace(targetB, replacementB);
  console.log('Replaced targetB in LiveCameraPlayer.jsx');
} else {
  console.error('targetB NOT found in LiveCameraPlayer.jsx');
}

// C. Update right sidebar columns and sticky positioning
const targetC = `        {/* Right 4 Columns: Live Sharing Moments & Animal Care Fund (Desktop side panel, mobile stacked) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Live Sharing Moments Panel */}
          <LiveSharingMoments
            contributions={walletState.contributions}
            onViewAll={() => setIsWalletHistoryOpen(true)}
            onQuickDonate={(amount) => handleOpenContribution(amount, animal)}
          />

          {/* Animal Care Fund Progress & Categories */}
          <AnimalCareFund
            fund={walletState.fund}
            onViewDetails={() => setIsFundDetailsOpen(true)}
          />

        </div>`;

const replacementC = `        {/* Right 3-4 Columns: Live Sharing Moments & Animal Care Fund (~25-30% width on desktop, sticky on scroll) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4 lg:space-y-5 lg:sticky lg:top-28">
          
          {/* Live Sharing Moments Panel */}
          <LiveSharingMoments
            contributions={walletState.contributions}
            onViewAll={() => setIsWalletHistoryOpen(true)}
            onQuickDonate={(amount) => handleOpenContribution(amount, animal)}
          />

          {/* Animal Care Fund Progress & Categories */}
          <AnimalCareFund
            fund={walletState.fund}
            onViewDetails={() => setIsFundDetailsOpen(true)}
          />

        </div>`;

if (player.includes(targetC)) {
  player = player.replace(targetC, replacementC);
  console.log('Replaced targetC in LiveCameraPlayer.jsx');
} else {
  console.error('targetC NOT found in LiveCameraPlayer.jsx');
}

// D. Close <main> and turn bottom bar into <footer>
const targetD = `            </div>

          </div>

        </div>

        {/* =========================================================================
            6. BOTTOM BAR: QUICK ENCLOSURE SWITCHER
            ========================================================================= */}
        <div className="p-3 sm:p-4 bg-[#06180E] border-t border-[#14532D]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shrink-0">`;

const replacementD = `            </div>

          </div>

        </main>

        {/* =========================================================================
            6. BOTTOM BAR: QUICK ENCLOSURE SWITCHER (Footer)
            ========================================================================= */}
        <footer className="w-full bg-[#06180E] border-t border-[#14532D]/80 shadow-2xl py-3 px-3 sm:px-6 lg:px-8 xl:px-10 shrink-0">`;

if (player.includes(targetD)) {
  player = player.replace(targetD, replacementD);
  console.log('Replaced targetD in LiveCameraPlayer.jsx');
} else {
  console.error('targetD NOT found in LiveCameraPlayer.jsx');
}

// E. Close footer tag
const targetE = `              );
            })}
          </div>
        </div>

        {/* =========================================================================
            POPUP OVERLAYS: FEEDING, MEDICATION & DONATION
            ========================================================================= */}`;

const replacementE = `              );
            })}
          </div>
        </footer>

        {/* =========================================================================
            POPUP OVERLAYS: FEEDING, MEDICATION & DONATION
            ========================================================================= */}`;

if (player.includes(targetE)) {
  player = player.replace(targetE, replacementE);
  console.log('Replaced targetE in LiveCameraPlayer.jsx');
} else {
  console.error('targetE NOT found in LiveCameraPlayer.jsx');
}

// F. Make popup overlays fixed so they show cleanly in viewport
player = player.replaceAll(
  'className="absolute inset-x-3 sm:inset-x-6 bottom-16 sm:bottom-20 max-w-lg mx-auto bg-[#071D12]/98 border border-[#C8A96B]/60 rounded-2xl p-5 shadow-2xl backdrop-blur-xl z-40 animate-fadeIn text-[#F5F4EA]"',
  'className="fixed bottom-20 left-1/2 -translate-x-1/2 max-w-lg w-[calc(100%-2rem)] mx-auto bg-[#071D12]/98 border border-[#C8A96B]/60 rounded-2xl p-5 shadow-2xl backdrop-blur-xl z-50 animate-fadeIn text-[#F5F4EA]"'
);

fs.writeFileSync(playerPath, player, 'utf8');
console.log('Successfully updated LiveCameraPlayer.jsx!');
