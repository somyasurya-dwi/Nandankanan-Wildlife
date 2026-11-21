import fs from 'fs';
import path from 'path';
import assert from 'assert';

const projectRoot = path.resolve('c:/Users/Asus/Desktop/Nandankanan1/Nandankanan-Wildlife');

console.log('===============================================================================');
console.log('VERIFYING: NO HORIZONTAL SCROLLBAR ON MODALS & DASHBOARD PAGES');
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

// 1. CSS Global Horizontal Scrollbar Hiding
test('index.css hides all horizontal webkit scrollbars globally', () => {
  const css = fs.readFileSync(path.join(projectRoot, 'frontend/src/index.css'), 'utf8');
  assert(css.includes('::-webkit-scrollbar:horizontal'), 'Must define ::-webkit-scrollbar:horizontal');
  assert(css.includes('display: none !important'), 'Must hide horizontal scrollbar display');
  assert(css.includes('height: 0px !important'), 'Must zero out horizontal scrollbar height');
});

// 2. CSS Utility Classes
test('index.css defines .scrollbar-none and .no-scrollbar cross-browser utilities', () => {
  const css = fs.readFileSync(path.join(projectRoot, 'frontend/src/index.css'), 'utf8');
  assert(css.includes('.scrollbar-none'), 'Must define .scrollbar-none');
  assert(css.includes('.no-scrollbar'), 'Must define .no-scrollbar');
  assert(css.includes('scrollbar-width: none !important'), 'Must support Firefox scrollbar-width');
  assert(css.includes('-ms-overflow-style: none !important'), 'Must support IE/Edge -ms-overflow-style');
});

// 3. CommunityMomentsModal Layout
test('CommunityMomentsModal species filter wraps cleanly without horizontal scrollbar', () => {
  const modal = fs.readFileSync(path.join(projectRoot, 'frontend/src/components/CommunityMomentsModal.jsx'), 'utf8');
  assert(modal.includes('flex-wrap'), 'Species filters must use flex-wrap to prevent horizontal overflow');
  assert(modal.includes('overflow-x-hidden'), 'Species filter container must prevent horizontal overflow');
  assert(!modal.includes('overflow-x-auto pb-1 sm:pb-0 scrollbar-none'), 'Must not have overflowing auto scrollbar on species filters');
});

// 4. Live Wildlife Dashboard Container
test('LiveCameraPlayer main container enforces overflow-x-hidden', () => {
  const player = fs.readFileSync(path.join(projectRoot, 'frontend/src/components/LiveCameraPlayer.jsx'), 'utf8');
  assert(player.includes('overflow-x-hidden'), 'Main dashboard container must prevent horizontal scroll');
});

console.log('===============================================================================');
console.log(`RESULTS: ${passed} / 4 TESTS PASSED (${(passed/4*100).toFixed(0)}% SUCCESS)`);
console.log('===============================================================================');
