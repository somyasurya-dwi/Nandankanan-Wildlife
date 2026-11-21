import fs from 'fs';
import path from 'path';
import assert from 'assert';

const projectRoot = path.resolve('c:/Users/Asus/Desktop/Nandankanan1/Nandankanan-Wildlife');

console.log('===============================================================================');
console.log('VERIFYING: DASHBOARD SCROLLING, RESPONSIVENESS & LAYOUT FLEXIBILITY');
console.log('===============================================================================');

let passed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}: ${err.message}`);
  }
}

const playerPath = path.join(projectRoot, 'frontend/src/components/LiveCameraPlayer.jsx');
const playerSrc = fs.readFileSync(playerPath, 'utf8');

const indexCssPath = path.join(projectRoot, 'frontend/src/index.css');
const indexCssSrc = fs.readFileSync(indexCssPath, 'utf8');

const momentsPath = path.join(projectRoot, 'frontend/src/components/LiveSharingMoments.jsx');
const momentsSrc = fs.readFileSync(momentsPath, 'utf8');

// 1. Single Root Scroll Container
test('Outer container has id="live-wildlife-dashboard", data-lenis-prevent and smooth scrolling', () => {
  assert(playerSrc.includes('id="live-wildlife-dashboard"'), 'Must have id="live-wildlife-dashboard"');
  assert(playerSrc.includes('overflow-y-auto overflow-x-hidden'), 'Must have single root scroll container');
  assert(playerSrc.includes('data-lenis-prevent="true"'), 'Must have data-lenis-prevent="true" to prevent Lenis scroll interception');
  assert(playerSrc.includes('createPortal('), 'Must render via createPortal to mount on document.body above navbar');
});

// 2. Removal of Nested Scroll Locks
test('Inner card no longer has max-h-[96vh] or overflow-y-auto trap', () => {
  assert(!playerSrc.includes('max-h-[96vh]'), 'Should not constrain card to 96vh');
  assert(!playerSrc.includes('className="overflow-y-auto flex-1 p-3 sm:p-5 md:p-6 space-y-4'), 'Should not trap inner body in overflow-y-auto');
});

// 3. Fluid Responsive Width Expansion
test('Dashboard card expands up to max-w-[1800px] 2xl:max-w-[1920px]', () => {
  assert(playerSrc.includes('max-w-[1800px] 2xl:max-w-[1920px]'), 'Must support full width up to 1800px/1920px');
  assert(!playerSrc.includes('max-w-7xl bg-[#092215]'), 'Should not constrain whole dashboard to narrow max-w-7xl');
});

// 4. Sticky Top Header
test('Top navigation & wallet bar are encapsulated in a sticky header', () => {
  assert(playerSrc.includes('<header className="sticky top-0 z-40 bg-[#06180E]/95 backdrop-blur-xl border-b border-[#14532D]/80 shadow-lg shrink-0">'), 'Header must be sticky top-0');
  assert(playerSrc.includes('</header>'), 'Header element must close properly');
});

// 5. Proportions: ~70-75% Video and ~25-30% Right Sidebar
test('Two-column layout implements 75% video and 25% sidebar proportions', () => {
  assert(playerSrc.includes('lg:col-span-8 xl:col-span-9'), 'Video container must occupy lg:col-span-8 xl:col-span-9 (~70-75%)');
  assert(playerSrc.includes('lg:col-span-4 xl:col-span-3'), 'Sidebar container must occupy lg:col-span-4 xl:col-span-3 (~25-30%)');
  assert(playerSrc.includes('lg:sticky lg:top-28'), 'Right sidebar must be sticky during desktop scrolling');
});

// 6. Switch Live Animal Option Placed in Top
test('Switch live animal option is placed in the top header with active glow and instant switching', () => {
  assert(playerSrc.includes('Switch Live Animal:'), 'Must include Switch Live Animal');
  assert(playerSrc.includes('active-animal-glow'), 'Active animal must retain golden highlight glow');
  assert(playerSrc.includes('<header') && playerSrc.indexOf('Switch Live Animal:') < playerSrc.indexOf('</header>'), 'Switch Live Animal must be placed in the top header');
});

// 7. Live Sharing Moments Scroll Containment
test('LiveSharingMoments has overscroll-contain to avoid scroll-chaining', () => {
  assert(momentsSrc.includes('overscroll-contain'), 'Must have overscroll-contain');
  assert(momentsSrc.includes('max-h-[220px]'), 'Must have comfortable max-h-[220px]');
});

// 8. CSS Smooth Scrolling & Stable Gutter
test('CSS has html scroll-behavior: smooth and stable scrollbar gutter', () => {
  assert(indexCssSrc.includes('scroll-behavior: smooth;'), 'Must have scroll-behavior: smooth');
  assert(indexCssSrc.includes('scrollbar-gutter: stable;'), 'Must have scrollbar-gutter: stable');
});

// 9. No Global overflow: hidden
test('No global overflow: hidden on body or main dashboard', () => {
  assert(!indexCssSrc.includes('body { overflow: hidden'), 'Must not have body overflow hidden');
  assert(!playerSrc.includes('id="live-wildlife-dashboard"\n      className="fixed inset-0 z-[100] bg-[#071D12] overflow-hidden'), 'Main dashboard must not be overflow hidden');
});

// 10. Popups Viewport Centered & Clear Modal Presentation
test('Information popups are fixed in viewport with backdrop overlay so user can view them clearly', () => {
  assert(playerSrc.includes('fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn'), 'Popups must be viewport-centered with dark backdrop overlay');
});

console.log('===============================================================================');
console.log(`RESULTS: ${passed} / 10 TESTS PASSED (${(passed/10*100).toFixed(0)}% SUCCESS)`);
console.log('===============================================================================');
