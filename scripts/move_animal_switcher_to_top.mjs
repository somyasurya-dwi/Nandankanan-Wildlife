import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve('c:/Users/Asus/Desktop/Nandankanan1/Nandankanan-Wildlife');
const playerPath = path.join(projectRoot, 'frontend/src/components/LiveCameraPlayer.jsx');
let player = fs.readFileSync(playerPath, 'utf8');

// 1. Add Switch Live Animal option into the sticky top header (directly below WildlifeWalletBar)
const headerTarget = `        {/* =========================================================================
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
      </header>`;

const headerReplacement = `        {/* =========================================================================
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
            SWITCH LIVE ANIMAL: PLACED IN TOP (Prominent, Instant One-Click Access)
            ========================================================================= */}
        <div className="w-full bg-[#05170E]/95 border-t border-[#14532D]/70 py-2.5 px-3 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 shrink-0">
              <Radio className="w-3.5 h-3.5 text-[#C8A96B] shrink-0" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#F5F4EA] font-mono">
                Switch Live Animal:
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scroll-smooth">
              {camerasList.map((c) => {
                const isActive = animal?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelectAnimal && onSelectAnimal(c)}
                    className={\`group relative px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 border cursor-pointer \${
                      isActive
                        ? 'bg-gradient-to-r from-[#C8A96B] to-[#DFCA98] text-[#071D12] font-bold border-[#C8A96B] active-animal-glow scale-[1.02] shadow-md shadow-[#C8A96B]/20'
                        : 'bg-[#14532D]/40 text-[#F5F4EA]/85 hover:text-white hover:bg-[#14532D]/70 border-[#C8A96B]/25 hover:border-[#C8A96B]/60 hover:scale-[1.01]'
                    }\`}
                  >
                    <span className="text-sm transition-transform duration-200 group-hover:scale-115">{c.emoji || '🐾'}</span>
                    <span>{c.animal_name}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#071D12] animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>`;

if (player.includes(headerTarget)) {
  player = player.replace(headerTarget, headerReplacement);
  console.log('Placed Switch Live Animal option at top in LiveCameraPlayer.jsx');
} else {
  console.error('headerTarget NOT found in LiveCameraPlayer.jsx');
}

// 2. Replace bottom footer with clean sanctuary footer
const footerTarget = `        {/* =========================================================================
            6. BOTTOM BAR: QUICK ENCLOSURE SWITCHER (Footer)
            ========================================================================= */}
        <footer className="w-full bg-[#06180E] border-t border-[#14532D]/80 shadow-2xl py-3 px-3 sm:px-6 lg:px-8 xl:px-10 shrink-0">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#C8A96B] shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F5F4EA] font-mono">
              Switch Live Animal:
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scroll-smooth">
            {camerasList.map((c) => {
              const isActive = animal?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectAnimal && onSelectAnimal(c)}
                  className={\`group relative px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-2 border cursor-pointer \${
                    isActive
                      ? 'bg-gradient-to-r from-[#C8A96B] to-[#DFCA98] text-[#071D12] font-bold border-[#C8A96B] active-animal-glow scale-[1.03]'
                      : 'bg-[#14532D]/40 text-[#F5F4EA]/85 hover:text-white hover:bg-[#14532D]/70 border-[#C8A96B]/25 hover:border-[#C8A96B]/60 hover:scale-[1.02]'
                  }\`}
                >
                  <span className="text-sm transition-transform duration-200 group-hover:scale-115">{c.emoji || '🐾'}</span>
                  <span>{c.animal_name}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#071D12] animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </footer>`;

const footerReplacement = `        {/* =========================================================================
            6. SANCTUARY FOOTER
            ========================================================================= */}
        <footer className="w-full bg-[#06180E] border-t border-[#14532D]/80 shadow-2xl py-3 px-3 sm:px-6 lg:px-8 xl:px-10 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A7D7A9] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NANDANKANAN ZOOLOGICAL PARK • 24/7 LIVE WILDLIFE SURVEILLANCE</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {camerasList.map((c) => {
              const isActive = animal?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectAnimal && onSelectAnimal(c)}
                  className={\`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 border cursor-pointer \${
                    isActive
                      ? 'bg-[#C8A96B] text-[#071D12] font-bold border-[#C8A96B] shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5 border-transparent'
                  }\`}
                >
                  <span>{c.emoji}</span>
                  <span>{c.animal_name}</span>
                </button>
              );
            })}
          </div>
        </footer>`;

if (player.includes(footerTarget)) {
  player = player.replace(footerTarget, footerReplacement);
  console.log('Updated bottom footer in LiveCameraPlayer.jsx');
} else {
  console.error('footerTarget NOT found in LiveCameraPlayer.jsx');
}

fs.writeFileSync(playerPath, player, 'utf8');
console.log('Saved LiveCameraPlayer.jsx successfully.');
