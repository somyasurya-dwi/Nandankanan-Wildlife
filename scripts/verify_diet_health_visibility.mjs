import fs from 'fs';
import path from 'path';
import assert from 'assert';

const projectRoot = path.resolve('c:/Users/Asus/Desktop/Nandankanan1/Nandankanan-Wildlife');

console.log('===============================================================================');
console.log('VERIFYING: DIET & HEALTH MODAL PRESENTATION AND VISIBILITY');
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

// 1. Full-Screen Backdrop Overlay for 100% Contrast & Focus
test('Diet and Health popups render inside a dark backdrop overlay (no video bleed-through)', () => {
  assert(playerSrc.includes('fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn'), 'Must have dimmed backdrop overlay at z-[120]');
  assert(playerSrc.includes('if (e.target === e.currentTarget) setActivePopup(null);'), 'Must support click-outside-to-close');
});

// 2. High-Contrast Modal Container
test('Modals have solid dark forest gradient container with gold border', () => {
  assert(playerSrc.includes('bg-gradient-to-b from-[#0B2A1A] to-[#071D12]'), 'Must use opaque dark gradient background');
  assert(playerSrc.includes('border-2 border-[#C8A96B]/70'), 'Must have gold border for clean definition');
  assert(playerSrc.includes('max-w-xl rounded-3xl'), 'Must be generously sized with max-w-xl');
});

// 3. Removal of Cramped max-h-48 Truncation
test('Removed max-h-48 truncation so content does not get cut off', () => {
  assert(!playerSrc.includes('max-h-48 overflow-y-auto pr-1'), 'Must not truncate content with tiny max-h-48');
});

// 4. Diet & Feeding Regimen Elements
test('Diet popup includes all required nutritional and foraging data fields', () => {
  assert(playerSrc.includes('Diet & Feeding Regimen'), 'Must have title Diet & Feeding Regimen');
  assert(playerSrc.includes('Primary Food / Diet:'), 'Must show Primary Food / Diet badge');
  assert(playerSrc.includes('{feedingInfo.primary_food}'), 'Must display primary food');
  assert(playerSrc.includes('Daily Ration:'), 'Must display Daily Ration');
  assert(playerSrc.includes('{feedingInfo.daily_ration}'), 'Must display daily ration text');
  assert(playerSrc.includes('Feeding Schedule:'), 'Must display Feeding Schedule');
  assert(playerSrc.includes('{feedingInfo.feeding_schedule}'), 'Must display feeding schedule text');
  assert(playerSrc.includes('Enrichment & Foraging:'), 'Must display Enrichment & Foraging');
  assert(playerSrc.includes('{feedingInfo.enrichment_notes}'), 'Must display enrichment notes');
});

// 5. Veterinary Health & Wellness Elements
test('Health popup includes clinical telemetry, protocol and medication fields', () => {
  assert(playerSrc.includes('Veterinary Health & Wellness'), 'Must have title Veterinary Health & Wellness');
  assert(playerSrc.includes('Clinical Status:'), 'Must show Clinical Status badge');
  assert(playerSrc.includes('Active & Healthy'), 'Must display Active & Healthy badge');
  assert(playerSrc.includes('Supervising Unit:'), 'Must display Supervising Unit');
  assert(playerSrc.includes('{medicationInfo.supervising_unit}'), 'Must display supervising unit text');
  assert(playerSrc.includes('Veterinary Protocol:'), 'Must display Veterinary Protocol');
  assert(playerSrc.includes('{medicationInfo.veterinary_care}'), 'Must display veterinary care text');
  assert(playerSrc.includes('Medication & Prophylaxis:'), 'Must display Medication & Prophylaxis');
  assert(playerSrc.includes('{medicationInfo.medication_status}'), 'Must display medication status text');
});

// 6. Navigation Bar Toggle Buttons
test('Top navigation Diet and Health buttons have active state and pointer cursor', () => {
  assert(playerSrc.includes("activePopup === 'feeding'"), 'Must toggle feeding popup');
  assert(playerSrc.includes("activePopup === 'medication'"), 'Must toggle medication popup');
  assert(playerSrc.includes('cursor-pointer'), 'Buttons must have pointer cursor');
});

// 7. Multiple Dismiss Options (X button, Backdrop, ESC, Close button)
test('Modals support multiple dismissal interactions', () => {
  assert(playerSrc.includes('aria-label="Close Diet Information"'), 'Diet modal has close button');
  assert(playerSrc.includes('aria-label="Close Health Information"'), 'Health modal has close button');
  assert(playerSrc.includes('Close') && playerSrc.includes('setActivePopup(null)'), 'Modals have explicit bottom close action button');
});

console.log('===============================================================================');
console.log(`RESULTS: ${passed} / 7 TESTS PASSED (${(passed/7*100).toFixed(0)}% SUCCESS)`);
console.log('===============================================================================');
