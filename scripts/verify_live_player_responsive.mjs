import fs from 'fs';
import path from 'path';
import assert from 'assert';

const baseDir = fs.existsSync(path.resolve(process.cwd(), 'frontend/src/components'))
    ? path.resolve(process.cwd(), 'frontend/src/components')
    : path.resolve(process.cwd(), 'Nandankanan-Wildlife/frontend/src/components');
const playerPath = path.join(baseDir, 'LiveCameraPlayer.jsx');
const walletBarPath = path.join(baseDir, 'WildlifeWalletBar.jsx');
const sharingPath = path.join(baseDir, 'LiveSharingMoments.jsx');

console.log('Running Live Video Page Responsiveness Verification...');

assert(fs.existsSync(playerPath), 'LiveCameraPlayer.jsx must exist');
const playerCode = fs.readFileSync(playerPath, 'utf8');

// 1. Header bar responsiveness
assert(playerCode.includes('px-2.5 sm:px-6'), 'Header must have responsive padding for mobile & desktop');
assert(playerCode.includes('hidden sm:inline">Diet</span>'), 'Diet button text must be responsive');
assert(playerCode.includes('hidden sm:inline">Health</span>'), 'Health button text must be responsive');
assert(playerCode.includes('hidden sm:inline">Feed Wildlife ❤️</span>'), 'Feed Wildlife button text must be responsive');

// 2. Video player top badges responsiveness
assert(playerCode.includes('<span>LIVE</span>') || playerCode.includes('Live</span>'), 'Stream badge must display clean LIVE text');
assert(playerCode.includes('hidden xl:inline">{displayBitrate}</span>'), 'Bitrate badge must be hidden on tablet and below to save space');
assert(!playerCode.includes('Top-Right Technical Resolution & Quality Selector Indicator'), 'Top-right corner quality overlay must be removed for clean viewport');
assert(playerCode.includes('hidden xl:flex items-center px-2.5 py-1 rounded-xl'), 'Layout title badge must be hidden below desktop to prevent overlay collision');

// 2b. Primary Desktop Reference (1440x900) & Fluid Clamping
assert(playerCode.includes('max-w-[1800px] 2xl:max-w-[1920px]'), 'Main container must support full width up to 1800px/1920px');
assert(playerCode.includes('lg:sticky lg:top-28'), 'Sidebar must be sticky on desktop');

// 3. Reaction dock responsiveness
assert(playerCode.includes('overflow-x-auto scrollbar-none') && playerCode.includes('scale-90'), 'Reaction dock must have horizontal scroll safety and responsive scale');

// 4. Video bottom controls bar responsiveness
assert(playerCode.includes('px-2 sm:px-4 py-1.5 sm:py-2.5'), 'Video controls bar must have responsive padding');
assert(playerCode.includes('<RectangleHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />') || playerCode.includes('<Scan className="w-3.5 h-3.5 sm:w-4 sm:h-4" />'), 'Fit button must display responsive framing icon');

// 5. Unified control toolbar responsiveness
assert(playerCode.includes('p-2.5 sm:p-3') && playerCode.includes('flex flex-col md:flex-row'), 'Unified control toolbar must adapt from vertical to horizontal layout');

// 6. Selectable camera feeds responsiveness
assert(playerCode.includes('grid grid-cols-1 md:grid-cols-3'), 'Camera feeds must be 1 col on mobile and 3 cols on tablet/desktop');

// 7. Enclosure map responsiveness
assert(playerCode.includes('h-48 sm:h-56 md:h-64 lg:h-60 xl:h-72'), 'Enclosure map must have responsive height across mobile, tablet, and desktop');
assert(playerCode.includes('flex flex-col sm:flex-row sm:items-center justify-between'), 'Enclosure map header must adapt on mobile viewports');

// 8. Wildlife Wallet Bar responsiveness
assert(fs.existsSync(walletBarPath), 'WildlifeWalletBar.jsx must exist');
const walletCode = fs.readFileSync(walletBarPath, 'utf8');
assert(walletCode.includes('overflow-x-auto') && walletCode.includes('overscroll-x-contain'), 'Quick feed buttons must have smooth touch horizontal scroll');

console.log('✓ All Live Video Page Responsiveness assertions passed successfully!');
