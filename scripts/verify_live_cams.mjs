import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_CAMERAS } from '../frontend/src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPublic = path.resolve(__dirname, '../frontend/public');

console.log('Total live cameras:', INITIAL_CAMERAS.length);
let allOk = true;

const expectedFoods = {
  "Royal Bengal Tiger": "Meat",
  "Asiatic Lion": "Meat",
  "Elephant": "Grass, leaves, fruits and vegetables",
  "Deer": "Grass, leaves and vegetation",
  "Bear": "Fruits, vegetation and other species-appropriate food",
  "Birds": "Species-appropriate seeds, fruits or other food"
};

INITIAL_CAMERAS.forEach((c, idx) => {
  console.log(`\n[${idx + 1}] Animal: ${c.animal_name} (${c.slug})`);
  console.log(`  - Primary Food: "${c.feeding_info?.primary_food}"`);
  console.log(`  - Diet Category: ${c.feeding_info?.diet_category}`);
  console.log(`  - Med Status: ${c.medication_info?.medication_status?.slice(0, 50)}...`);
  console.log(`  - Donation Tiers: ${JSON.stringify(c.donation_info?.amounts)}`);
  console.log(`  - Cameras count: ${c.cameras?.length}`);

  if (expectedFoods[c.animal_name] && c.feeding_info?.primary_food !== expectedFoods[c.animal_name]) {
    console.error(`  ERROR: Expected food "${expectedFoods[c.animal_name]}" but found "${c.feeding_info?.primary_food}"`);
    allOk = false;
  }
  
  if (!c.cameras || c.cameras.length !== 3) {
    console.error(`  ERROR: ${c.animal_name} does not have exactly 3 cameras!`);
    allOk = false;
  }
  
  c.cameras.forEach(cam => {
    console.log(`    * ${cam.name} (${cam.angle}): ${cam.stream_url} [Simulated: ${cam.isSimulated}]`);
    const fullPath = path.join(frontendPublic, cam.stream_url);
    if (!fs.existsSync(fullPath)) {
      console.error(`      ERROR: Video path missing: ${fullPath}`);
      allOk = false;
    }
  });

  const thumbPath = path.join(frontendPublic, c.thumbnail_url);
  if (!fs.existsSync(thumbPath)) {
    console.error(`  ERROR: Thumbnail missing: ${thumbPath}`);
    allOk = false;
  }
});

if (allOk) {
  console.log('\n=========================================');
  console.log('>>> ALL 6 ANIMALS & CAMERAS VERIFIED 100% OK! <<<');
  console.log('=========================================\n');
} else {
  process.exit(1);
}
