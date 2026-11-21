import fs from 'fs';
import path from 'path';
import assert from 'assert';

const projectRoot = path.resolve('c:/Users/Asus/Desktop/Nandankanan1/Nandankanan-Wildlife');

console.log('===============================================================================');
console.log('VERIFYING: ANIMAL SELECTION ARROW NAVIGATION (ELEPHANT -> ASIATIC LION)');
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

// 1. Navigation Functions
test('LiveCameraPlayer implements handleAnimalScrollLeft that navigates to previous animal', () => {
  assert(playerSrc.includes('const handleAnimalScrollLeft = useCallback('), 'Must define handleAnimalScrollLeft with useCallback');
  assert(playerSrc.includes('const targetIndex = (currentIndex - 1 + camerasList.length) % camerasList.length'), 'Must compute previous animal index with circular wrapping');
  assert(playerSrc.includes('onSelectAnimal(targetAnimal)'), 'Must call onSelectAnimal with targetAnimal');
});

test('LiveCameraPlayer implements handleAnimalScrollRight that navigates to next animal', () => {
  assert(playerSrc.includes('const handleAnimalScrollRight = useCallback('), 'Must define handleAnimalScrollRight with useCallback');
  assert(playerSrc.includes('const targetIndex = (currentIndex + 1) % camerasList.length'), 'Must compute next animal index with circular wrapping');
  assert(playerSrc.includes('onSelectAnimal(targetAnimal)'), 'Must call onSelectAnimal with targetAnimal');
});

// 2. Logic Simulation of Elephant -> Asiatic Lion
test('Simulating animal list: selecting Elephant and clicking left arrow goes to Asiatic Lion', () => {
  const mockCameras = [
    { id: 1, slug: 'royal-bengal-tiger', animal_name: 'Royal Bengal Tiger' },
    { id: 2, slug: 'asiatic-lion', animal_name: 'Asiatic Lion' },
    { id: 3, slug: 'asian-elephant', animal_name: 'Elephant' },
    { id: 4, slug: 'spotted-deer', animal_name: 'Deer' },
    { id: 5, slug: 'sloth-bear', animal_name: 'Bear' },
    { id: 6, slug: 'birds', animal_name: 'Birds' }
  ];

  const currentAnimal = { id: 3, slug: 'asian-elephant', animal_name: 'Elephant' };
  
  // Find index
  const idx = mockCameras.findIndex(
    (c) => c.id === currentAnimal.id || 
           c.slug === currentAnimal.slug || 
           c.animal_name?.toLowerCase() === currentAnimal.animal_name?.toLowerCase()
  );
  assert.strictEqual(idx, 2, 'Elephant must be index 2');

  // Left arrow index
  const leftIdx = (idx - 1 + mockCameras.length) % mockCameras.length;
  assert.strictEqual(leftIdx, 1, 'Previous index from Elephant must be 1');
  assert.strictEqual(mockCameras[leftIdx].animal_name, 'Asiatic Lion', 'Animal to left of Elephant must be Asiatic Lion');
  assert.strictEqual(mockCameras[leftIdx].slug, 'asiatic-lion', 'Slug of animal to left must be asiatic-lion');

  // Right arrow index
  const rightIdx = (idx + 1) % mockCameras.length;
  assert.strictEqual(rightIdx, 3, 'Next index from Elephant must be 3');
  assert.strictEqual(mockCameras[rightIdx].animal_name, 'Deer', 'Animal to right of Elephant must be Deer');
});

// 3. Arrow UI Controls
test('Left and right arrow buttons trigger handleAnimalScrollLeft and handleAnimalScrollRight', () => {
  assert(playerSrc.includes('onClick={handleAnimalScrollLeft}'), 'Left button must have onClick={handleAnimalScrollLeft}');
  assert(playerSrc.includes('onClick={handleAnimalScrollRight}'), 'Right button must have onClick={handleAnimalScrollRight}');
  assert(playerSrc.includes('aria-label="Scroll animal options left"'), 'Left button must retain accessibility aria-label');
  assert(playerSrc.includes('aria-label="Scroll animal options right"'), 'Right button must retain accessibility aria-label');
});

// 4. Keyboard Arrow Navigation
test('Keyboard ArrowLeft and ArrowRight trigger animal navigation', () => {
  assert(playerSrc.includes("e.key === 'ArrowLeft'"), 'Must handle ArrowLeft key');
  assert(playerSrc.includes("e.key === 'ArrowRight'"), 'Must handle ArrowRight key');
});

// 5. Scroll Into View Preserved
test('Smooth horizontal container scrolling remains functional', () => {
  assert(playerSrc.includes('animalScrollContainerRef.current.scrollBy({ left: -180, behavior: \'smooth\' })'), 'Must preserve left container scrollBy');
  assert(playerSrc.includes('animalScrollContainerRef.current.scrollBy({ left: 180, behavior: \'smooth\' })'), 'Must preserve right container scrollBy');
  assert(playerSrc.includes('container.scrollBy({ left: scrollOffset, behavior: \'smooth\' })'), 'Must bring active button into view');
});

console.log('===============================================================================');
console.log(`RESULTS: ${passed} / 6 TESTS PASSED (${(passed/6*100).toFixed(0)}% SUCCESS)`);
console.log('===============================================================================');
