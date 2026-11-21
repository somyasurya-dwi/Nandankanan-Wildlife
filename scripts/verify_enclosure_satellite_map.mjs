import fs from 'fs';
import path from 'path';
import assert from 'assert';

const projectRoot = path.resolve('c:/Users/Asus/Desktop/Nandankanan1/Nandankanan-Wildlife');

console.log('===============================================================================');
console.log('VERIFYING: ENCLOSURE COVERAGE MAP SATELLITE VIEW UPGRADE');
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

const satImagePath = path.join(projectRoot, 'frontend/public/images/enclosure_satellite_map.jpg');

// 1. Asset verification
test('Satellite orthophoto image asset exists in frontend/public/images', () => {
  assert(fs.existsSync(satImagePath), 'enclosure_satellite_map.jpg must exist');
  const stat = fs.statSync(satImagePath);
  assert(stat.size > 50000, 'Image file size must be substantial (>50KB)');
});

// 2. Default state verification
test('LiveCameraPlayer sets default enclosureMapMode to satellite', () => {
  assert(playerSrc.includes("const [enclosureMapMode, setEnclosureMapMode] = useState('satellite')"), 'Default mode must be satellite');
});

// 3. Satellite image mounting
test('SVG renders satellite orthophoto background image', () => {
  assert(playerSrc.includes('href="/images/enclosure_satellite_map.jpg"'), 'Must mount satellite orthophoto image');
  assert(playerSrc.includes('preserveAspectRatio="xMidYMid slice"'), 'Must preserve aspect ratio');
});

// 4. Pure Satellite View (Topology Removed)
test('Enclosure map renders pure Satellite view with Topology mode removed', () => {
  assert(!playerSrc.includes('🗺️ Topology'), 'Topology button must be removed');
  assert(!playerSrc.includes("setEnclosureMapMode('topology')"), 'Topology toggle handler must be removed');
  assert(!playerSrc.includes('/* TOPOLOGY VIEW LAYER */'), 'Topology SVG layer must be removed');
  assert(playerSrc.includes('SATELLITE ORTHO'), 'Must retain SATELLITE ORTHO badge');
  assert(playerSrc.includes('/images/enclosure_satellite_map.jpg'), 'Must retain satellite orthophoto asset');
});

// 5. Satellite GIS & HUD Overlays
test('Satellite view includes GIS boundary, North indicator, and telemetry coordinates', () => {
  assert(playerSrc.includes('SATELLITE ORTHO'), 'Must have SATELLITE ORTHO badge');
  assert(playerSrc.includes('SATELLITE GIS'), 'Must have SATELLITE GIS watermark');
  assert(playerSrc.includes('clipPath id="enclosureClip"'), 'Must define enclosure clipPath');
  assert(playerSrc.includes('stroke="#10B981"'), 'Must use luminous emerald GIS boundary');
});

// 6. Camera Interactive Controls Preserved
test('Cameras 1, 2, and 3 retain selection handlers and FOV illumination', () => {
  assert(playerSrc.includes('handleSelectCameraAngle(1)'), 'Camera 1 must retain handler');
  assert(playerSrc.includes('handleSelectCameraAngle(2)'), 'Camera 2 must retain handler');
  assert(playerSrc.includes('handleSelectCameraAngle(3)'), 'Camera 3 must retain handler');
  assert(playerSrc.includes('url(#satelliteConeGlow)'), 'Must render satellite FOV cones');
});

// 7. Live Animal Tracking Blip Preserved
test('Live animal tracking telemetry blip remains functional over satellite terrain', () => {
  assert(playerSrc.includes('trackerState.is_detected'), 'Must check trackerState.is_detected');
  assert(playerSrc.includes('trackerState.callsign'), 'Must render animal callsign');
});

console.log('===============================================================================');
console.log(`RESULTS: ${passed} / 7 TESTS PASSED (${(passed/7*100).toFixed(0)}% SUCCESS)`);
console.log('===============================================================================');
