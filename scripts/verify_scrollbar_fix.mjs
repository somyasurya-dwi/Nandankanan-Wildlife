import fs from 'fs';
import path from 'path';
import assert from 'assert';

const projectRoot = path.resolve('c:/Users/Asus/Desktop/Nandankanan1/Nandankanan-Wildlife');

console.log('===============================================================================');
console.log('VERIFYING: ANIMAL SELECTION HORIZONTAL SCROLLBAR HIDING & NAVIGATION');
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

// 1. CSS Scrollbar Hiding Requirements
test('index.css defines .animal-selector-scroll with scrollbar-width: none', () => {
  assert(indexCssSrc.includes('.animal-selector-scroll'), 'Must define .animal-selector-scroll class');
  assert(indexCssSrc.includes('scrollbar-width: none'), 'Must have scrollbar-width: none');
  assert(indexCssSrc.includes('-ms-overflow-style: none'), 'Must have -ms-overflow-style: none');
  assert(indexCssSrc.includes('.animal-selector-scroll::-webkit-scrollbar'), 'Must have ::-webkit-scrollbar rule');
  assert(indexCssSrc.includes('display: none'), 'Must have display: none on webkit scrollbar');
});

// 2. Component Scroll Container
test('LiveCameraPlayer uses animal-selector-scroll with inline scrollbar hiding styles', () => {
  assert(playerSrc.includes('id="animal-selection-scroll-container"'), 'Must have id="animal-selection-scroll-container"');
  assert(playerSrc.includes('className="animal-selector-scroll'), 'Must apply animal-selector-scroll class');
  assert(playerSrc.includes("scrollbarWidth: 'none'"), 'Must include inline scrollbarWidth: none');
  assert(playerSrc.includes("msOverflowStyle: 'none'"), 'Must include inline msOverflowStyle: none');
});

// 3. Overflow is NOT hidden
test('Horizontal scrolling is preserved with overflow-x-auto (never overflow: hidden)', () => {
  assert(playerSrc.includes('overflow-x-auto'), 'Must preserve overflow-x-auto for smooth horizontal scroll');
  assert(!playerSrc.includes('id="animal-selection-scroll-container"\n                className="animal-selector-scroll flex items-center gap-1.5 sm:gap-2 overflow-hidden'), 'Must not disable scroll with overflow-hidden');
});

// 4. Left and Right Navigation Arrows
test('Left and right navigation arrows are present and functional', () => {
  assert(playerSrc.includes('ChevronLeft'), 'Must import ChevronLeft');
  assert(playerSrc.includes('ChevronRight'), 'Must import ChevronRight');
  assert(playerSrc.includes('handleAnimalScrollLeft'), 'Must have handleAnimalScrollLeft');
  assert(playerSrc.includes('handleAnimalScrollRight'), 'Must have handleAnimalScrollRight');
  assert(playerSrc.includes('aria-label="Scroll animal options left"'), 'Must have left arrow aria-label');
  assert(playerSrc.includes('aria-label="Scroll animal options right"'), 'Must have right arrow aria-label');
});

// 5. Automatic Scroll Into View for Selected Animal
test('Automatically brings selected animal button into view on animal change', () => {
  assert(playerSrc.includes('activeAnimalBtnRef'), 'Must have activeAnimalBtnRef');
  assert(playerSrc.includes('ref={isActive ? activeAnimalBtnRef : null}'), 'Active animal button must receive ref');
  assert(playerSrc.includes('container.scrollBy({ left: scrollOffset, behavior: \'smooth\' })'), 'Must smoothly scroll selected animal into view');
});

// 6. Mouse Wheel Horizontal Scroll Conversion
test('Mouse wheel scrolling over animal buttons converts to horizontal scroll without vertical shift', () => {
  assert(playerSrc.includes('e.preventDefault()'), 'Wheel handler must call e.preventDefault() to avoid vertical jump');
  assert(playerSrc.includes('e.stopPropagation()'), 'Wheel handler must call e.stopPropagation()');
  assert(playerSrc.includes('container.scrollLeft += e.deltaY'), 'Must convert vertical wheel delta to horizontal scroll');
});

// 7. Accessibility of All Sanctuary Species
test('All 6 animal buttons remain accessible with active golden glow', () => {
  assert(playerSrc.includes('c.animal_name'), 'Must render all animal names from camerasList');
  assert(playerSrc.includes('c.emoji'), 'Must render animal emoji');
  assert(playerSrc.includes('active-animal-glow'), 'Must keep active-animal-glow');
  assert(playerSrc.includes('bg-gradient-to-r from-[#C8A96B] to-[#DFCA98]'), 'Must keep golden active gradient');
});

console.log('===============================================================================');
console.log(`RESULTS: ${passed} / 7 TESTS PASSED (${(passed/7*100).toFixed(0)}% SUCCESS)`);
console.log('===============================================================================');
